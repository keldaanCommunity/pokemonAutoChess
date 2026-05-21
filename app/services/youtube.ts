import { matchMaker } from "colyseus"
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto"
import UserMetadata from "../models/mongo-models/user-metadata"
import { logger } from "../utils/logger"

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_OAUTH_AUTHORIZE_URL =
  "https://accounts.google.com/o/oauth2/v2/auth"
const YOUTUBE_DATA_API_URL = "https://www.googleapis.com/youtube/v3"
const DEFAULT_YOUTUBE_STATE_TTL_SECONDS = 600
const DEFAULT_YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly"

/**
 * Short-lived server-side session created when a user initiates OAuth linking.
 * Keyed by nonce so the callback can recover the PKCE verifier.
 */
type YouTubeVerificationSession = {
  uid: string
  codeVerifier: string
  expiresAt: number
}

/**
 * Payload embedded in the OAuth state parameter.
 * The payload is base64url-encoded and HMAC-signed before being sent to Google.
 */
type YouTubeStatePayload = {
  uid: string
  nonce: string
  iat: number
  exp: number
}

/** Minimal subset of YouTube channel identity used by account linking. */
type YouTubeChannel = {
  id: string
  title: string
  handle?: string
}

/** Payload returned by the verification start endpoint. */
export type YouTubeVerificationStartPayload = {
  authorizeUrl: string
  expiresAt: string
}

/** Result returned internally after a successful callback completion. */
export type YouTubeVerificationResult = {
  uid: string
  youtubeChannelId: string
  youtubeChannelTitle: string
  youtubeHandle: string | null
}

const youtubeVerificationSessions = new Map<
  string,
  YouTubeVerificationSession
>()
const isDevelopment = process.env.MODE === "dev"
const YOUTUBE_VERIFICATION_SESSION_PREFIX = "youtube_oauth_verification"
const YOUTUBE_VERIFICATION_SESSIONS_KEY = `${YOUTUBE_VERIFICATION_SESSION_PREFIX}:sessions`

/** Returns Google OAuth client ID from environment. */
function getClientId() {
  return process.env.YOUTUBE_CLIENT_ID
}

/** Returns Google OAuth client secret from environment. */
function getClientSecret() {
  return process.env.YOUTUBE_CLIENT_SECRET
}

/** Returns the HMAC secret used to sign and verify OAuth state. */
function getStateSecret() {
  return process.env.YOUTUBE_OAUTH_STATE_SECRET
}

/** Returns the OAuth callback URI configured in Google Cloud Console. */
function getVerificationRedirectUri() {
  return process.env.YOUTUBE_OAUTH_REDIRECT_URI
}

/**
 * Returns the state/session TTL in seconds.
 * Falls back to a safe default when env input is missing or invalid.
 */
function getVerificationStateTtlSeconds() {
  const raw = Number(process.env.YOUTUBE_OAUTH_STATE_TTL_SECONDS)
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_YOUTUBE_STATE_TTL_SECONDS
  }
  return Math.floor(raw)
}

/** Returns OAuth scopes used for account verification. */
function getVerificationScope() {
  return process.env.YOUTUBE_OAUTH_SCOPE?.trim() || DEFAULT_YOUTUBE_SCOPE
}

/**
 * Ensures all required YouTube OAuth configuration exists before
 * starting/completing account verification.
 */
function ensureVerificationConfigured() {
  if (!getClientId() || !getClientSecret()) {
    throw new Error("YouTube OAuth is not configured")
  }
  if (!getVerificationRedirectUri()) {
    throw new Error("YOUTUBE_OAUTH_REDIRECT_URI is missing")
  }
  const stateSecret = getStateSecret()
  if (!stateSecret || stateSecret.length < 32) {
    throw new Error("YOUTUBE_OAUTH_STATE_SECRET must be at least 32 chars")
  }
}

/**
 * Removes expired verification sessions.
 * Uses Presence in multi-process mode and a local map in development mode.
 */
async function cleanupExpiredVerificationSessions() {
  if (!isDevelopment) {
    const sessions = await matchMaker.presence.hgetall(
      YOUTUBE_VERIFICATION_SESSIONS_KEY
    )
    const now = Date.now()

    for (const [nonce, rawSession] of Object.entries(sessions)) {
      try {
        const session = JSON.parse(rawSession) as YouTubeVerificationSession
        if (session.expiresAt <= now) {
          await matchMaker.presence.hdel(
            YOUTUBE_VERIFICATION_SESSIONS_KEY,
            nonce
          )
        }
      } catch (error) {
        logger.warn("Invalid YouTube verification session during cleanup", {
          nonce,
          error
        })
        await matchMaker.presence.hdel(YOUTUBE_VERIFICATION_SESSIONS_KEY, nonce)
      }
    }

    return
  }

  const now = Date.now()
  for (const [nonce, session] of youtubeVerificationSessions.entries()) {
    if (session.expiresAt <= now) {
      youtubeVerificationSessions.delete(nonce)
    }
  }
}

/** Persists a verification session in the environment-appropriate backing store. */
async function storeVerificationSession(
  nonce: string,
  session: YouTubeVerificationSession
) {
  if (isDevelopment) {
    youtubeVerificationSessions.set(nonce, session)
    return
  }

  await matchMaker.presence.hset(
    YOUTUBE_VERIFICATION_SESSIONS_KEY,
    nonce,
    JSON.stringify(session)
  )
}

/** Retrieves a pending verification session by nonce. */
async function getVerificationSession(
  nonce: string
): Promise<YouTubeVerificationSession | null> {
  if (isDevelopment) {
    return youtubeVerificationSessions.get(nonce) ?? null
  }

  const raw = await matchMaker.presence.hget(
    YOUTUBE_VERIFICATION_SESSIONS_KEY,
    nonce
  )
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as YouTubeVerificationSession
  } catch (error) {
    logger.warn("Invalid stored YouTube verification session payload", {
      nonce,
      error
    })
    await deleteVerificationSession(nonce)
    return null
  }
}

/** Deletes a verification session. */
async function deleteVerificationSession(nonce: string) {
  if (isDevelopment) {
    youtubeVerificationSessions.delete(nonce)
    return
  }

  await matchMaker.presence.hdel(YOUTUBE_VERIFICATION_SESSIONS_KEY, nonce)
}

/**
 * Signs a base64url-encoded state payload with HMAC-SHA256.
 * The resulting state format is `<payloadBase64>.<signatureBase64>`.
 */
function signStatePayload(payloadBase64: string) {
  return createHmac("sha256", getStateSecret()!)
    .update(payloadBase64)
    .digest("base64url")
}

/**
 * Parses and validates the OAuth state returned by Google.
 * Validation order:
 * 1) Structure integrity (payload.signature)
 * 2) HMAC signature verification (constant-time compare)
 * 3) Expiration check
 */
function parseAndVerifyState(state: string): YouTubeStatePayload {
  const [payloadBase64, signature] = state.split(".")
  if (!payloadBase64 || !signature) {
    throw new Error("Invalid OAuth state")
  }

  const expectedSignature = signStatePayload(payloadBase64)
  const provided = Buffer.from(signature, "base64url")
  const expected = Buffer.from(expectedSignature, "base64url")
  /** Prevent timing-based oracle attacks while comparing signatures. */
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    throw new Error("Invalid OAuth state signature")
  }

  const decodedPayload = Buffer.from(payloadBase64, "base64url").toString(
    "utf8"
  )
  const payload = JSON.parse(decodedPayload) as YouTubeStatePayload

  if (!payload.uid || !payload.nonce || !payload.exp) {
    throw new Error("Malformed OAuth state payload")
  }
  if (payload.exp <= Date.now()) {
    throw new Error("OAuth state has expired")
  }

  return payload
}

/** Computes PKCE challenge: BASE64URL(SHA256(code_verifier)). */
function buildPkceChallenge(codeVerifier: string) {
  return createHash("sha256").update(codeVerifier).digest("base64url")
}

/** Generates a high-entropy PKCE verifier string. */
function generateCodeVerifier() {
  return randomBytes(48).toString("base64url")
}

/** Generates a one-time nonce used to key pending OAuth sessions. */
function generateNonce() {
  return randomBytes(24).toString("base64url")
}

/**
 * Starts account verification and returns the Google authorize URL.
 * Security measures:
 * - Signed and time-limited OAuth state
 * - PKCE with server-held verifier
 */
export async function startYouTubeAccountVerification(
  uid: string
): Promise<YouTubeVerificationStartPayload> {
  ensureVerificationConfigured()
  await cleanupExpiredVerificationSessions()

  const now = Date.now()
  const nonce = generateNonce()
  const stateTtlMs = getVerificationStateTtlSeconds() * 1000
  const expiresAt = now + stateTtlMs
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = buildPkceChallenge(codeVerifier)

  const statePayload: YouTubeStatePayload = {
    uid,
    nonce,
    iat: now,
    exp: expiresAt
  }
  /** Keep state URL-safe and deterministic with base64url payload encoding. */
  const payloadBase64 = Buffer.from(JSON.stringify(statePayload)).toString(
    "base64url"
  )
  const signature = signStatePayload(payloadBase64)
  const state = `${payloadBase64}.${signature}`

  /** Store verifier server-side; send only code_challenge to Google. */
  await storeVerificationSession(nonce, {
    uid,
    codeVerifier,
    expiresAt
  })

  const authorizeParams = new URLSearchParams({
    client_id: getClientId()!,
    redirect_uri: getVerificationRedirectUri()!,
    response_type: "code",
    access_type: "online",
    state,
    scope: getVerificationScope(),
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  })

  return {
    authorizeUrl: `${GOOGLE_OAUTH_AUTHORIZE_URL}?${authorizeParams.toString()}`,
    expiresAt: new Date(expiresAt).toISOString()
  }
}

/**
 * Exchanges an authorization code for a user access token.
 * Includes code_verifier so Google can validate PKCE challenge binding.
 */
async function exchangeAuthorizationCode(
  code: string,
  codeVerifier: string
): Promise<string> {
  const body = new URLSearchParams({
    client_id: getClientId() ?? "",
    client_secret: getClientSecret() ?? "",
    code,
    grant_type: "authorization_code",
    redirect_uri: getVerificationRedirectUri() ?? "",
    code_verifier: codeVerifier
  })

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(
      `Google code exchange failed (${response.status}): ${error.slice(0, 300)}`
    )
  }

  const payload = (await response.json()) as {
    access_token?: string
  }
  if (!payload.access_token) {
    throw new Error("Google code exchange returned no access token")
  }

  return payload.access_token
}

/** Fetches the authenticated YouTube channel for the current OAuth user. */
async function fetchYouTubeChannel(
  accessToken: string
): Promise<YouTubeChannel> {
  const response = await fetch(
    `${YOUTUBE_DATA_API_URL}/channels?part=id,snippet&mine=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(
      `YouTube channel fetch failed (${response.status}): ${error.slice(0, 300)}`
    )
  }

  const json = (await response.json()) as {
    items?: Array<{
      id?: string
      snippet?: {
        title?: string
        customUrl?: string
      }
    }>
  }

  const channel = json.items?.[0]
  const channelId = channel?.id
  if (!channelId) {
    throw new Error("No YouTube channel found for authenticated account")
  }

  const title = channel.snippet?.title?.trim() || channelId
  const customUrl = channel.snippet?.customUrl?.trim()
  const handle = customUrl
    ? customUrl.startsWith("@")
      ? customUrl
      : `@${customUrl}`
    : undefined

  return {
    id: channelId,
    title,
    handle
  }
}

/**
 * Completes OAuth verification from the callback route and persists linked
 * YouTube identity on the user metadata document.
 */
export async function completeYouTubeAccountVerification(
  code: string,
  state: string
): Promise<YouTubeVerificationResult> {
  ensureVerificationConfigured()
  await cleanupExpiredVerificationSessions()

  const parsedState = parseAndVerifyState(state)
  const session = await getVerificationSession(parsedState.nonce)
  if (!session || session.expiresAt <= Date.now()) {
    await deleteVerificationSession(parsedState.nonce)
    throw new Error("OAuth verification session expired")
  }
  if (session.uid !== parsedState.uid) {
    await deleteVerificationSession(parsedState.nonce)
    throw new Error("OAuth verification session mismatch")
  }

  /** Single-use nonce deletion prevents callback replay attempts. */
  await deleteVerificationSession(parsedState.nonce)
  const accessToken = await exchangeAuthorizationCode(
    code,
    session.codeVerifier
  )
  const channel = await fetchYouTubeChannel(accessToken)

  const linkedUser = await UserMetadata.findOne(
    { youtubeChannelId: channel.id },
    ["uid"]
  )
  if (linkedUser && linkedUser.uid !== parsedState.uid) {
    throw new Error("YouTube channel already linked to another user")
  }

  const user = await UserMetadata.findOne({ uid: parsedState.uid })
  if (!user) {
    throw new Error("User not found")
  }

  /** Persist verified YouTube identity and reset any prior revocation marker. */
  user.youtubeChannelId = channel.id
  user.youtubeChannelTitle = channel.title
  user.youtubeHandle = channel.handle
  user.youtubeVerifiedAt = new Date()
  user.youtubeVerificationRevokedAt = null
  await user.save()

  logger.info("YouTube verification linked", {
    uid: user.uid,
    youtubeChannelId: channel.id,
    youtubeHandle: channel.handle
  })

  return {
    uid: user.uid,
    youtubeChannelId: channel.id,
    youtubeChannelTitle: channel.title,
    youtubeHandle: channel.handle ?? null
  }
}

/**
 * Unlinks a previously linked YouTube account for the given user.
 * Records revocation timestamp for auditability.
 */
export async function unlinkYouTubeAccount(uid: string) {
  const user = await UserMetadata.findOne({ uid })
  if (!user) {
    throw new Error("User not found")
  }

  const hadLink = Boolean(user.youtubeChannelId)
  user.youtubeChannelId = undefined
  user.youtubeChannelTitle = undefined
  user.youtubeHandle = undefined
  user.youtubeVerifiedAt = null
  user.youtubeVerificationRevokedAt = new Date()
  await user.save()

  if (hadLink) {
    logger.info("YouTube verification unlinked", { uid: user.uid })
  }
}
