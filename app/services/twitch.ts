import { logger } from "../utils/logger"
import TwitchBlacklistedStreamer, {
  ITwitchBlacklistedStreamer
} from "../models/mongo-models/twitch-blacklisted-streamer"

const TWITCH_OAUTH_URL = "https://id.twitch.tv/oauth2/token"
const TWITCH_HELIX_URL = "https://api.twitch.tv/helix"
const DEFAULT_CATEGORY_NAME = "Pokemon Auto Chess"
const THUMBNAIL_WIDTH = "320"
const THUMBNAIL_HEIGHT = "180"

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

function normalizeStreamerLogin(value: string) {
  return value.trim().toLowerCase().replace(/^@/, "")
}

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

function getClientId() {
  return process.env.TWITCH_CLIENT_ID
}

function getClientSecret() {
  return process.env.TWITCH_CLIENT_SECRET
}

function getCategoryName() {
  return process.env.TWITCH_CATEGORY_NAME ?? DEFAULT_CATEGORY_NAME
}

function isConfigured() {
  return Boolean(getClientId() && getClientSecret())
}

function buildHeaders(accessToken: string): HeadersInit {
  return {
    "Client-Id": getClientId() ?? "",
    Authorization: `Bearer ${accessToken}`
  }
}

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

export function getTwitchStreamsPayload(): TwitchStreamsPayload {
  return {
    streams: cachedStreams,
    lastRefreshAt: lastRefreshAt ? lastRefreshAt.toISOString() : null,
    isConfigured: isConfigured(),
    error: lastError
  }
}
