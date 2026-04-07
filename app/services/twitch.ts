import { logger } from "../utils/logger"

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
    url: `https://www.twitch.tv/${stream.user_login}`
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
      }>
    }

    cachedStreams = json.data.map(mapStream)
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
