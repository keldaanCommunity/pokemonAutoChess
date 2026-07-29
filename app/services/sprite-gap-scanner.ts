import SpriteGapCache from "../models/mongo-models/sprite-gap-cache"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "../public/src/game/components/pokemon-animations"
import { AnimationType } from "../types/Animation"
import { Pkm, PkmByIndex, PkmIndex } from "../types/enum/Pokemon"
import { logger } from "../utils/logger"

/**
 * GraphQL query to fetch all monsters with their forms and availability metadata
 */
const GET_ALL_MONSTERS_QUERY = `
  query GetAllMonsters {
    monster {
      id
      rawId
      name
      forms {
        monsterId
        path
        fullPath
        name
        fullName
        isShiny
        isFemale
        canon
        portraits {
          phase
          emotions {
            emotion
            url
          }
        }
        sprites {
          phase
          actions {
            ... on Sprite {
              action
            }
            ... on CopyOf {
              action
            }
          }
        }
      }
    }
  }
`

/**
 * Response type from SpriteCollab GraphQL
 */
interface SpriteCollabForm {
  monsterId: number
  path: string
  fullPath: string
  name: string
  fullName: string
  isShiny: boolean
  isFemale: boolean
  canon: boolean
  portraits: {
    phase: string
    emotions: {
      emotion: string
      url: string
    }[]
  }
  sprites: {
    phase: string
    actions: {
      action: string
    }[]
  }
}

interface SpriteCollabMon {
  id: number
  rawId: string
  name: string
  forms: SpriteCollabForm[]
}

interface SpriteCollabResponse {
  data: {
    monster: SpriteCollabMon[]
  }
}

/**
 * Normalized index with metadata
 */
interface SpriteGapEntry {
  index: string
  pkm: string
  formName: string
  displayName: string
  formPath: string
  portraitUrl?: string
  isShiny: boolean
  hasPortrait: boolean
  hasSprite: boolean
  canon: boolean
}

/**
 * Comparison result
 */
export interface SpriteGapScannerResult {
  spriteOnly: SpriteGapEntry[]
  stats: {
    totalSpriteCollab: number
    lastRefresh: number
    refreshDurationMs: number
  }
}

/**
 * In-memory cache for sprite gap scanner results
 */
interface CacheSnapshot {
  data: SpriteGapScannerResult
  timestamp: number
}

let cache: CacheSnapshot | null = null
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const MIN_REMOTE_REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const CACHE_SNAPSHOT_ID = "global"
const CACHE_HYDRATION_INTERVAL_MS = 60 * 1000
let inFlightRefresh: Promise<SpriteGapScannerResult> | null = null
let inFlightHydration: Promise<void> | null = null
let lastHydrationAttempt = 0

function isValidSnapshot(value: unknown): value is CacheSnapshot {
  if (!value || typeof value !== "object") {
    return false
  }

  const snapshot = value as CacheSnapshot
  return Boolean(
    snapshot.data &&
      Array.isArray(snapshot.data.spriteOnly) &&
      snapshot.data.stats &&
      typeof snapshot.timestamp === "number"
  )
}

async function hydrateCacheFromPersistence(force = false): Promise<void> {
  const now = Date.now()

  if (!force && now - lastHydrationAttempt < CACHE_HYDRATION_INTERVAL_MS) {
    return
  }

  if (inFlightHydration) {
    return inFlightHydration
  }

  lastHydrationAttempt = now

  inFlightHydration = (async () => {
    try {
      const doc = await SpriteGapCache.findById(CACHE_SNAPSHOT_ID).lean()
      if (!doc) {
        return
      }

      const snapshot = {
        data: doc.data as SpriteGapScannerResult,
        timestamp: doc.timestamp
      }

      if (isValidSnapshot(snapshot)) {
        if (!cache || snapshot.timestamp > cache.timestamp) {
          cache = snapshot
          logger.info(
            "[SPRITE_GAP_SCANNER] Hydrated cache snapshot from MongoDB"
          )
        }
      }
    } catch (error) {
      logger.warn(
        "[SPRITE_GAP_SCANNER] Failed to hydrate cache snapshot from MongoDB",
        error
      )
    } finally {
      inFlightHydration = null
    }
  })()

  return inFlightHydration
}

function queueHydrateCacheFromPersistence(): void {
  void hydrateCacheFromPersistence()
}

async function persistCacheSnapshot(snapshot: CacheSnapshot): Promise<void> {
  try {
    await SpriteGapCache.updateOne(
      { _id: CACHE_SNAPSHOT_ID },
      {
        _id: CACHE_SNAPSHOT_ID,
        timestamp: snapshot.timestamp,
        data: snapshot.data
      },
      { upsert: true }
    )
  } catch (error) {
    logger.warn("[SPRITE_GAP_SCANNER] Failed to persist cache snapshot", error)
  }
}

/**
 * Normalize SpriteCollab fullPath to PAC dashed index format
 * Examples:
 *   "0869" -> "0869"
 *   "0869/0049" -> "0869-0049"
 *   "0025/0001" -> "0025-0001"
 *   "0025/0001/1" -> "0025-0001-1"
 *
 * PAC canonical format is dashed, with segments padded to 4 digits when numeric
 */
function normalizePathToIndex(fullPath: string): string {
  const segments = fullPath.split("/")
  // Convert slash-separated path to dash-separated index
  // e.g., "0869/0049" becomes "0869-0049"
  return segments.join("-")
}

function getShinyIndex(index: string): string {
  const split = index.split("-")
  if (split.length === 1) {
    return `${index}-0000-0001`
  }
  if (split.length === 2) {
    return `${index}-0001`
  }
  return [...split.slice(0, 2), "0001", ...split.slice(3)].join("-")
}

function getPacIndexSet(): Set<string> {
  const pacIndexSet = new Set<string>()

  for (const pkm of Object.values(Pkm)) {
    const baseIndex = PkmIndex[pkm]
    if (!baseIndex) {
      continue
    }

    pacIndexSet.add(baseIndex)

    const conf = PokemonAnimations[pkm] ?? DEFAULT_POKEMON_ANIMATION_CONFIG
    if (!conf.shinyUnavailable) {
      pacIndexSet.add(getShinyIndex(baseIndex))
    }
  }

  return pacIndexSet
}

function getBaseIndex(index: string): string {
  const parts = index.split("-")

  if (parts.length === 3 && parts[1] === "0000" && parts[2] === "0001") {
    return parts[0]
  }

  if (parts.length >= 3 && parts[2] === "0001") {
    return [...parts.slice(0, 2), ...parts.slice(3)].join("-")
  }

  return index
}

function getRequiredActionsForIndex(index: string): Set<string> {
  const baseIndex = getBaseIndex(index)
  const pkm = PkmByIndex[baseIndex] as Pkm | undefined
  const conf = pkm
    ? (PokemonAnimations[pkm] ?? DEFAULT_POKEMON_ANIMATION_CONFIG)
    : DEFAULT_POKEMON_ANIMATION_CONFIG

  return new Set<string>([
    AnimationType.Idle,
    AnimationType.Walk,
    conf.sleep ?? AnimationType.Sleep,
    conf.hurt ?? AnimationType.Hurt,
    conf.attack ?? AnimationType.Attack,
    conf.hop ?? AnimationType.Hop
  ])
}

function satisfiesPacCriteria(form: SpriteCollabForm, index: string): boolean {
  const hasPortrait = form.portraits.emotions.length > 0
  if (!hasPortrait) {
    return false
  }

  const availableActions = new Set(form.sprites.actions.map((a) => a.action))
  const requiredActions = getRequiredActionsForIndex(index)

  for (const action of requiredActions) {
    if (!availableActions.has(action)) {
      return false
    }
  }

  return true
}

/**
 * Fetch all monsters from SpriteCollab GraphQL endpoint
 */
async function fetchSpriteCollabMons(): Promise<SpriteCollabMon[]> {
  try {
    const response = await fetch("https://spriteserver.pmdcollab.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: GET_ALL_MONSTERS_QUERY
      })
    })

    if (!response.ok) {
      throw new Error(`GraphQL endpoint returned ${response.status}`)
    }

    const json: SpriteCollabResponse = await response.json()

    if (!json.data || !json.data.monster) {
      throw new Error("Invalid response structure: missing data.monster")
    }

    return json.data.monster
  } catch (error) {
    logger.error(
      "[SPRITE_GAP_SCANNER] Failed to fetch SpriteCollab data",
      error
    )
    throw error
  }
}

/**
 * Parse SpriteCollab response and build normalized index set
 */
function parseMonsForms(
  monsters: SpriteCollabMon[]
): Map<string, SpriteGapEntry> {
  const spriteIndexMap = new Map<string, SpriteGapEntry>()

  for (const monster of monsters) {
    for (const form of monster.forms) {
      const index = normalizePathToIndex(form.fullPath)

      if (!satisfiesPacCriteria(form, index)) {
        continue
      }

      // Determine if this form has portrait/sprite availability
      const hasPortrait = form.portraits.emotions.length > 0
      const hasSprite = form.sprites.phase !== "INCOMPLETE"
      const normalPortrait = form.portraits.emotions.find(
        (emotion) => emotion.emotion === "Normal"
      )
      const portraitUrl =
        normalPortrait?.url ?? form.portraits.emotions[0]?.url ?? undefined

      spriteIndexMap.set(index, {
        index,
        pkm: monster.name,
        formName: form.fullName,
        displayName: `${monster.name} - ${form.fullName}`,
        formPath: form.fullPath,
        portraitUrl,
        isShiny: form.isShiny,
        hasPortrait,
        hasSprite,
        canon: form.canon
      })
    }
  }

  return spriteIndexMap
}

/**
 * Perform comparison between SpriteCollab and PAC indexes
 */
function compareIndexes(
  spriteIndexMap: Map<string, SpriteGapEntry>
): SpriteGapScannerResult {
  const pacIndexSet = getPacIndexSet()
  const spriteOnly: SpriteGapEntry[] = []

  // Keep only SpriteCollab entries that are missing from PAC
  for (const [index, entry] of spriteIndexMap.entries()) {
    if (!pacIndexSet.has(index)) {
      spriteOnly.push(entry)
    }
  }

  return {
    spriteOnly,
    stats: {
      totalSpriteCollab: spriteIndexMap.size,
      lastRefresh: Date.now(),
      refreshDurationMs: 0
    }
  }
}

/**
 * Refresh sprite gap scanner data from remote GraphQL endpoint
 * Called on schedule (daily cron), startup warmup and manual maintenance command
 */
async function refreshSpriteGapDataInternal(
  force = false
): Promise<SpriteGapScannerResult> {
  await hydrateCacheFromPersistence()
  const now = Date.now()

  if (
    !force &&
    cache &&
    now - cache.timestamp < MIN_REMOTE_REFRESH_INTERVAL_MS
  ) {
    logger.info(
      "[SPRITE_GAP_SCANNER] Skipping remote refresh because it ran recently"
    )
    return cache.data
  }

  if (inFlightRefresh) {
    return inFlightRefresh
  }

  const startTime = now

  inFlightRefresh = (async () => {
    try {
      logger.info("[SPRITE_GAP_SCANNER] Starting data refresh...")

      const mons = await fetchSpriteCollabMons()
      logger.info(
        `[SPRITE_GAP_SCANNER] Fetched ${mons.length} monsters from SpriteCollab`
      )

      const spriteIndexMap = parseMonsForms(mons)
      const result = compareIndexes(spriteIndexMap)

      result.stats.refreshDurationMs = Date.now() - startTime

      // Update cache
      cache = {
        data: result,
        timestamp: Date.now()
      }
      await persistCacheSnapshot(cache)

      logger.info(
        `[SPRITE_GAP_SCANNER] Refresh complete in ${result.stats.refreshDurationMs}ms: ` +
          `${result.spriteOnly.length} sprite-only`
      )

      return result
    } catch (error) {
      logger.error(
        "[SPRITE_GAP_SCANNER] Refresh failed",
        error,
        "returning stale cache or empty result"
      )

      // If cache exists, return stale data with error flag
      if (cache) {
        return {
          ...cache.data,
          stats: {
            ...cache.data.stats,
            lastRefresh: cache.timestamp
          }
        }
      }

      // If no cache, return empty result
      return {
        spriteOnly: [],
        stats: {
          totalSpriteCollab: 0,
          lastRefresh: Date.now(),
          refreshDurationMs: Date.now() - startTime
        }
      }
    } finally {
      inFlightRefresh = null
    }
  })()

  return inFlightRefresh
}

export function refreshSpriteGapData(force = false): void {
  void refreshSpriteGapDataInternal(force)
}

/**
 * Get cached sprite gap scanner data
 * Returns cached data if valid (< 24h old), otherwise returns stale data or empty result
 * and asynchronously tries to hydrate in-memory cache from MongoDB.
 */
export function getCachedSpriteGapData(): SpriteGapScannerResult {
  queueHydrateCacheFromPersistence()
  const now = Date.now()

  // Cache is valid
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data
  }

  // Cache is stale or missing - do not trigger remote refresh from API traffic.
  // Refreshes are managed by startup, cron and maintenance commands.
  if (!cache) {
    logger.debug("[SPRITE_GAP_SCANNER] Cache miss, returning empty state")
    return {
      spriteOnly: [],
      stats: {
        totalSpriteCollab: 0,
        lastRefresh: 0,
        refreshDurationMs: 0
      }
    }
  }

  // Cache exists but is stale, return stale data.
  logger.debug("[SPRITE_GAP_SCANNER] Cache stale, returning stale state")

  return {
    ...cache.data,
    stats: {
      ...cache.data.stats,
      lastRefresh: cache.timestamp
    }
  }
}

/**
 * Perform warmup refresh on startup
 * Ensures cache is populated before first API request
 */
export async function warmupSpriteGapScanner(): Promise<void> {
  logger.info("[SPRITE_GAP_SCANNER] Warming up cache on startup...")
  try {
    await refreshSpriteGapDataInternal()
    logger.info("[SPRITE_GAP_SCANNER] Warmup complete")
  } catch (error) {
    logger.error("[SPRITE_GAP_SCANNER] Warmup failed", error)
  }
}
