import { matchMaker } from "colyseus"
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto"
import TwitchBlacklistedStreamer, {
  ITwitchBlacklistedStreamer
} from "../models/mongo-models/twitch-blacklisted-streamer"
import UserMetadata from "../models/mongo-models/user-metadata"
import { logger } from "../utils/logger"

const TWITCH_OAUTH_URL = "https://id.twitch.tv/oauth2/token"
const TWITCH_OAUTH_AUTHORIZE_URL = "https://id.twitch.tv/oauth2/authorize"
const TWITCH_HELIX_URL = "https://api.twitch.tv/helix"
const DEFAULT_CATEGORY_NAME = "Pokemon Auto Chess"
const THUMBNAIL_WIDTH = "320"
const THUMBNAIL_HEIGHT = "180"
const DEFAULT_TWITCH_STATE_TTL_SECONDS = 600

/**
 * Short-lived server-side session created when a user initiates OAuth linking.
 * Keyed by nonce so the callback can recover the PKCE verifier.
 */
type TwitchVerificationSession = {
  uid: string // PAC user who started the flow
  codeVerifier: string // PKCE verifier (never leaves the server)
  expiresAt: number // Unix timestamp (ms) after which the session is invalid
}

/**
 * Payload embedded in the OAuth state parameter.
 * The payload is base64url-encoded and HMAC-signed before being sent to Twitch.
 */
type TwitchStatePayload = {
  uid: string // PAC user UID
  nonce: string // Random one-time value that keys the verification session
  iat: number // Issued-at timestamp (ms)
  exp: number // Expiry timestamp (ms)
}

/** Minimal subset of Twitch Helix /users used by account linking. */
type TwitchOAuthUser = {
  id: string // Stable Twitch user ID (numeric string)
  login: string // Lowercase login name
  display_name: string // Display-cased name
}

/** Payload returned by the verification start endpoint. */
export type TwitchVerificationStartPayload = {
  authorizeUrl: string // Full Twitch authorize URL the frontend should redirect to
  expiresAt: string // ISO timestamp; tells the client when the flow will expire
}

/** Result returned internally after a successful callback completion. */
export type TwitchVerificationResult = {
  uid: string
  twitchUserId: string
  twitchLogin: string
  twitchDisplayName: string
}

type TwitchToken = {
  accessToken: string
  expiresAt: number
}

export type TwitchStream = {
  id: string
  userName: string
  userLogin: string
  title: string
  language: string
  thumbnailUrl: string
  url: string
  viewerCount: number
  startedAt: string
  tags: string[]
}

export type TwitchStreamsPayload = {
  streams: TwitchStream[]
  lastRefreshAt: string | null
  isConfigured: boolean
  error: string | null
}

let tokenCache: TwitchToken | null = null
let cachedStreams: TwitchStream[] = []
let lastRefreshAt: Date | null = null
let lastError: string | null = null
let blacklistedLogins = new Set<string>()
/** In-memory pending OAuth sessions used in local development mode. */
const twitchVerificationSessions = new Map<string, TwitchVerificationSession>()
const isDevelopment = process.env.MODE === "dev"
const TWITCH_VERIFICATION_SESSION_PREFIX = "twitch_oauth_verification"
const TWITCH_VERIFICATION_SESSIONS_KEY = `${TWITCH_VERIFICATION_SESSION_PREFIX}:sessions`

/** Normalizes a Twitch login for case-insensitive comparisons and persistence. */
function normalizeStreamerLogin(value: string) {
  return value.trim().toLowerCase().replace(/^@/, "")
}

/** Returns the HMAC secret used to sign and verify OAuth state. */
function getStateSecret() {
  return process.env.TWITCH_OAUTH_STATE_SECRET
}

/** Returns the OAuth callback URI configured in Twitch developer settings. */
function getVerificationRedirectUri() {
  return process.env.TWITCH_OAUTH_REDIRECT_URI
}

/**
 * Returns the state/session TTL in seconds.
 * Falls back to a safe default when env input is missing or invalid.
 */
function getVerificationStateTtlSeconds() {
  const raw = Number(process.env.TWITCH_OAUTH_STATE_TTL_SECONDS)
  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_TWITCH_STATE_TTL_SECONDS
  }
  return Math.floor(raw)
}

/**
 * Ensures all required Twitch OAuth configuration exists before starting/completing
 * account verification.
 */
function ensureVerificationConfigured() {
  if (!getClientId() || !getClientSecret()) {
    throw new Error("Twitch OAuth is not configured")
  }
  if (!getVerificationRedirectUri()) {
    throw new Error("TWITCH_OAUTH_REDIRECT_URI is missing")
  }
  const stateSecret = getStateSecret()
  if (!stateSecret || stateSecret.length < 32) {
    throw new Error("TWITCH_OAUTH_STATE_SECRET must be at least 32 chars")
  }
}

/**
 * Removes expired verification sessions.
 * Uses Presence in multi-process mode and a local map in development mode.
 */
async function cleanupExpiredVerificationSessions() {
  if (!isDevelopment) {
    const sessions = await matchMaker.presence.hgetall(
      TWITCH_VERIFICATION_SESSIONS_KEY
    )
    const now = Date.now()

    for (const [nonce, rawSession] of Object.entries(sessions)) {
      try {
        const session = JSON.parse(rawSession) as TwitchVerificationSession
        if (session.expiresAt <= now) {
          await matchMaker.presence.hdel(
            TWITCH_VERIFICATION_SESSIONS_KEY,
            nonce
          )
        }
      } catch (error) {
        logger.warn("Invalid Twitch verification session during cleanup", {
          nonce,
          error
        })
        await matchMaker.presence.hdel(TWITCH_VERIFICATION_SESSIONS_KEY, nonce)
      }
    }

    return
  }

  const now = Date.now()
  for (const [nonce, session] of twitchVerificationSessions.entries()) {
    if (session.expiresAt <= now) {
      twitchVerificationSessions.delete(nonce)
    }
  }
}

/** Returns the legacy per-nonce Presence key used by the previous storage format. */
function getVerificationSessionKey(nonce: string) {
  return `${TWITCH_VERIFICATION_SESSION_PREFIX}:${nonce}`
}

/** Persists a verification session in the environment-appropriate backing store. */
async function storeVerificationSession(
  nonce: string,
  session: TwitchVerificationSession
) {
  if (isDevelopment) {
    twitchVerificationSessions.set(nonce, session)
    return
  }

  await matchMaker.presence.hset(
    TWITCH_VERIFICATION_SESSIONS_KEY,
    nonce,
    JSON.stringify(session)
  )
}

/** Retrieves a pending verification session by nonce. */
async function getVerificationSession(
  nonce: string
): Promise<TwitchVerificationSession | null> {
  if (isDevelopment) {
    return twitchVerificationSessions.get(nonce) ?? null
  }

  let raw = await matchMaker.presence.hget(
    TWITCH_VERIFICATION_SESSIONS_KEY,
    nonce
  )
  // Backward-compatibility with previous per-nonce storage format.
  if (!raw) {
    raw = await matchMaker.presence.hget(
      getVerificationSessionKey(nonce),
      "session"
    )
  }
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as TwitchVerificationSession
  } catch (error) {
    logger.warn("Invalid stored Twitch verification session payload", {
      nonce,
      error
    })
    await deleteVerificationSession(nonce)
    return null
  }
}

/** Deletes a verification session from current and legacy storage keys. */
async function deleteVerificationSession(nonce: string) {
  if (isDevelopment) {
    twitchVerificationSessions.delete(nonce)
    return
  }

  await matchMaker.presence.hdel(TWITCH_VERIFICATION_SESSIONS_KEY, nonce)
  // Backward-compatibility with previous per-nonce storage format.
  await matchMaker.presence.hdel(getVerificationSessionKey(nonce), "session")
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
 * Parses and validates the OAuth state returned by Twitch.
 * Validation order:
 * 1) Structure integrity (payload.signature)
 * 2) HMAC signature verification (constant-time compare)
 * 3) Expiration check
 */
function parseAndVerifyState(state: string): TwitchStatePayload {
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
  const payload = JSON.parse(decodedPayload) as TwitchStatePayload

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
 * Returns optional OAuth scopes.
 * Empty scope is valid for identity-only linking.
 */
function getVerificationScope() {
  return process.env.TWITCH_OAUTH_SCOPE ?? ""
}

/**
 * Starts account verification and returns the Twitch authorize URL.
 * Security measures:
 * - Signed and time-limited OAuth state
 * - PKCE with server-held verifier
 * - force_verify to require explicit user consent
 */
export async function startTwitchAccountVerification(
  uid: string
): Promise<TwitchVerificationStartPayload> {
  ensureVerificationConfigured()
  await cleanupExpiredVerificationSessions()

  const now = Date.now()
  const nonce = generateNonce()
  const stateTtlMs = getVerificationStateTtlSeconds() * 1000
  const expiresAt = now + stateTtlMs
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = buildPkceChallenge(codeVerifier)

  const statePayload: TwitchStatePayload = {
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

  /** Store verifier server-side; send only code_challenge to Twitch. */
  await storeVerificationSession(nonce, {
    uid,
    codeVerifier,
    expiresAt
  })

  const authorizeParams = new URLSearchParams({
    client_id: getClientId()!,
    redirect_uri: getVerificationRedirectUri()!,
    response_type: "code",
    force_verify: "true",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  })

  const scope = getVerificationScope().trim()
  if (scope) {
    authorizeParams.set("scope", scope)
  }

  return {
    authorizeUrl: `${TWITCH_OAUTH_AUTHORIZE_URL}?${authorizeParams.toString()}`,
    expiresAt: new Date(expiresAt).toISOString()
  }
}

/**
 * Exchanges an authorization code for a user access token.
 * Includes code_verifier so Twitch can validate PKCE challenge binding.
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

  const response = await fetch(TWITCH_OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(
      `Twitch code exchange failed (${response.status}): ${error.slice(0, 300)}`
    )
  }

  const payload = (await response.json()) as {
    access_token: string
  }
  if (!payload.access_token) {
    throw new Error("Twitch code exchange returned no access token")
  }

  return payload.access_token
}

/** Fetches the authenticated Twitch user using the user access token. */
async function fetchTwitchUser(accessToken: string): Promise<TwitchOAuthUser> {
  const response = await fetch(`${TWITCH_HELIX_URL}/users`, {
    headers: buildHeaders(accessToken)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(
      `Twitch user fetch failed (${response.status}): ${error.slice(0, 300)}`
    )
  }

  const json = (await response.json()) as { data: TwitchOAuthUser[] }
  const user = json.data?.[0]
  if (!user) {
    throw new Error("Twitch did not return an authenticated user")
  }

  return user
}

/**
 * Completes OAuth verification from the callback route and persists linked
 * Twitch identity on the user metadata document.
 */
export async function completeTwitchAccountVerification(
  code: string,
  state: string
): Promise<TwitchVerificationResult> {
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
  const userAccessToken = await exchangeAuthorizationCode(
    code,
    session.codeVerifier
  )
  const twitchUser = await fetchTwitchUser(userAccessToken)
  const normalizedLogin = normalizeStreamerLogin(twitchUser.login)

  /** Enforce one Twitch account linked to at most one PAC account. */
  const linkedUser = await UserMetadata.findOne(
    { twitchUserId: twitchUser.id },
    ["uid"]
  )
  if (linkedUser && linkedUser.uid !== parsedState.uid) {
    throw new Error("Twitch account already linked to another user")
  }

  const user = await UserMetadata.findOne({ uid: parsedState.uid })
  if (!user) {
    throw new Error("User not found")
  }

  /** Persist verified Twitch identity and reset any prior revocation marker. */
  user.twitchUserId = twitchUser.id
  user.twitchLogin = normalizedLogin
  user.twitchDisplayName = twitchUser.display_name
  user.twitchVerifiedAt = new Date()
  user.twitchVerificationRevokedAt = null // clear any previous revocation
  await user.save()

  logger.info("Twitch verification linked", {
    uid: user.uid,
    twitchUserId: twitchUser.id,
    twitchLogin: normalizedLogin
  })

  return {
    uid: user.uid,
    twitchUserId: twitchUser.id,
    twitchLogin: normalizedLogin,
    twitchDisplayName: twitchUser.display_name
  }
}

/**
 * Unlinks a previously linked Twitch account for the given user.
 * Records revocation timestamp for auditability.
 */
export async function unlinkTwitchAccount(uid: string) {
  const user = await UserMetadata.findOne({ uid })
  if (!user) {
    throw new Error("User not found")
  }

  const hadLink = Boolean(user.twitchUserId)
  user.twitchUserId = undefined
  user.twitchLogin = undefined
  user.twitchDisplayName = undefined
  user.twitchVerifiedAt = null
  /** Allows downstream tooling to distinguish never-linked vs unlinked. */
  user.twitchVerificationRevokedAt = new Date()
  await user.save()

  if (hadLink) {
    logger.info("Twitch verification unlinked", { uid: user.uid })
  }
}

/** Refreshes the in-memory set of blacklisted streamer logins from MongoDB. */
export async function refreshTwitchBlacklist() {
  try {
    const entries = await TwitchBlacklistedStreamer.find({}, [
      "streamerLogin"
    ]).lean()
    blacklistedLogins = new Set(
      entries
        .map((entry) => normalizeStreamerLogin(entry.streamerLogin))
        .filter((login) => login.length > 0)
    )
  } catch (error) {
    logger.error("Unable to refresh Twitch blacklist", { error })
  }
}

/** Returns all blacklist entries sorted by newest first. */
export async function listTwitchBlacklist(): Promise<
  ITwitchBlacklistedStreamer[]
> {
  return TwitchBlacklistedStreamer.find({}, [
    "streamerLogin",
    "reason",
    "createdBy",
    "createdAt",
    "updatedAt"
  ])
    .sort({ createdAt: -1 })
    .lean()
}

/** Adds a streamer login to blacklist and refreshes cached blacklist/streams. */
export async function addTwitchBlacklistEntry(
  streamerLogin: string,
  createdBy: string,
  reason?: string
) {
  const normalizedLogin = normalizeStreamerLogin(streamerLogin)
  if (!normalizedLogin) {
    throw new Error("Invalid streamerLogin")
  }

  const existing = await TwitchBlacklistedStreamer.findOne({
    streamerLogin: normalizedLogin
  })
  if (existing) {
    throw new Error("Streamer is already blacklisted")
  }

  await TwitchBlacklistedStreamer.create({
    streamerLogin: normalizedLogin,
    reason: reason?.trim() ?? "",
    createdBy: createdBy.trim()
  })

  await refreshTwitchBlacklist()
  await refreshTwitchStreams()
}

/** Removes a streamer from blacklist and refreshes cached blacklist/streams. */
export async function removeTwitchBlacklistEntry(streamerLogin: string) {
  const normalizedLogin = normalizeStreamerLogin(streamerLogin)
  if (!normalizedLogin) {
    throw new Error("Invalid streamerLogin")
  }

  const deleteResult = await TwitchBlacklistedStreamer.deleteOne({
    streamerLogin: normalizedLogin
  })

  await refreshTwitchBlacklist()
  await refreshTwitchStreams()

  return deleteResult.deletedCount > 0
}

/** Returns Twitch app client ID from environment. */
function getClientId() {
  return process.env.TWITCH_CLIENT_ID
}

/** Returns Twitch app client secret from environment. */
function getClientSecret() {
  return process.env.TWITCH_CLIENT_SECRET
}

/** Returns stream category name used for Twitch stream discovery. */
function getCategoryName() {
  return process.env.TWITCH_CATEGORY_NAME ?? DEFAULT_CATEGORY_NAME
}

/** Indicates whether Twitch app credentials are configured. */
function isConfigured() {
  return Boolean(getClientId() && getClientSecret())
}

/** Builds shared Twitch API headers for Helix requests. */
function buildHeaders(accessToken: string): HeadersInit {
  return {
    "Client-Id": getClientId() ?? "",
    Authorization: `Bearer ${accessToken}`
  }
}

/**
 * Returns a cached app access token when valid, otherwise requests a new one.
 * Used by server-side stream discovery endpoints.
 */
async function getAppAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken
  }

  const body = new URLSearchParams({
    client_id: getClientId() ?? "",
    client_secret: getClientSecret() ?? "",
    grant_type: "client_credentials"
  })

  const response = await fetch(TWITCH_OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(
      `Twitch OAuth failed (${response.status}): ${error.slice(0, 300)}`
    )
  }

  const json = (await response.json()) as {
    access_token: string
    expires_in: number
  }

  tokenCache = {
    accessToken: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000
  }

  return tokenCache.accessToken
}

/** Resolves configured category name to Twitch category/game ID. */
async function resolveCategoryId(accessToken: string): Promise<string> {
  const categoryName = getCategoryName()
  const params = new URLSearchParams({ name: categoryName })
  const response = await fetch(
    `${TWITCH_HELIX_URL}/games?${params.toString()}`,
    {
      headers: buildHeaders(accessToken)
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(
      `Twitch category lookup failed (${response.status}): ${error.slice(0, 300)}`
    )
  }

  const json = (await response.json()) as {
    data: Array<{ id: string; name: string }>
  }

  const category = json.data.find((entry) => entry.name === categoryName)
  if (!category) {
    throw new Error(`Twitch category not found: ${categoryName}`)
  }

  logger.info(`Resolved Twitch category id for ${categoryName}: ${category.id}`)
  return category.id
}

/** Maps raw Twitch stream API item into API payload shape used by client. */
function mapStream(stream: {
  id: string
  user_name: string
  user_login: string
  title: string
  language: string
  thumbnail_url: string
  viewer_count: number
  started_at: string
  tags: string[]
}): TwitchStream {
  return {
    id: stream.id,
    userName: stream.user_name,
    userLogin: stream.user_login,
    title: stream.title,
    language: stream.language,
    thumbnailUrl: stream.thumbnail_url
      .replace("{width}", THUMBNAIL_WIDTH)
      .replace("{height}", THUMBNAIL_HEIGHT),
    url: `https://www.twitch.tv/${stream.user_login}`,
    viewerCount: stream.viewer_count,
    startedAt: stream.started_at,
    tags: stream.tags ?? []
  }
}

/**
 * Refreshes cached Twitch streams for the configured category and applies
 * blacklist filtering.
 */
export async function refreshTwitchStreams() {
  if (!isConfigured()) {
    lastError = "TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is missing"
    cachedStreams = []
    return cachedStreams
  }

  try {
    const accessToken = await getAppAccessToken()
    const categoryId = await resolveCategoryId(accessToken)
    const params = new URLSearchParams({
      game_id: categoryId,
      first: "50",
      type: "live"
    })

    const response = await fetch(
      `${TWITCH_HELIX_URL}/streams?${params.toString()}`,
      {
        headers: buildHeaders(accessToken)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(
        `Twitch streams fetch failed (${response.status}): ${error.slice(0, 300)}`
      )
    }

    const json = (await response.json()) as {
      data: Array<{
        id: string
        user_name: string
        user_login: string
        title: string
        language: string
        thumbnail_url: string
        viewer_count: number
        started_at: string
        tags: string[]
      }>
    }

    cachedStreams = json.data
      .map(mapStream)
      .filter(
        (stream) =>
          !blacklistedLogins.has(normalizeStreamerLogin(stream.userLogin))
      )
    lastRefreshAt = new Date()
    lastError = null

    return cachedStreams
  } catch (error) {
    lastError = error instanceof Error ? error.message : "Unknown Twitch error"
    logger.error("Unable to refresh Twitch streams", { error: lastError })
    return cachedStreams
  }
}

/** Returns the current Twitch streams payload served by API endpoints. */
export function getTwitchStreamsPayload(): TwitchStreamsPayload {
  return {
    streams: cachedStreams,
    lastRefreshAt: lastRefreshAt ? lastRefreshAt.toISOString() : null,
    isConfigured: isConfigured(),
    error: lastError
  }
}
