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

interface SpriteCollabMonster {
  id: number
  rawId: string
  name: string
  forms: SpriteCollabForm[]
}

interface SpriteCollabResponse {
  data: {
    monster: SpriteCollabMonster[]
  }
}

/**
 * Normalized index with metadata
 */
interface SpriteGapEntry {
  index: string
  monsterName: string
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
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

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
async function fetchSpriteCollabMonsters(): Promise<SpriteCollabMonster[]> {
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
function parseMonsterForms(
  monsters: SpriteCollabMonster[]
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
        monsterName: monster.name,
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
 * Called on schedule (daily cron) and lazily if cache is stale
 */
async function refreshSpriteGapDataInternal(): Promise<SpriteGapScannerResult> {
  const startTime = Date.now()

  try {
    logger.info("[SPRITE_GAP_SCANNER] Starting data refresh...")

    const monsters = await fetchSpriteCollabMonsters()
    logger.info(
      `[SPRITE_GAP_SCANNER] Fetched ${monsters.length} monsters from SpriteCollab`
    )

    const spriteIndexMap = parseMonsterForms(monsters)
    const result = compareIndexes(spriteIndexMap)

    result.stats.refreshDurationMs = Date.now() - startTime

    // Update cache
    cache = {
      data: result,
      timestamp: Date.now()
    }

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
  }
}

export function refreshSpriteGapData(): void {
  void refreshSpriteGapDataInternal()
}

/**
 * Get cached sprite gap scanner data
 * Returns cached data if valid (< 24h old), otherwise triggers async refresh
 * and returns previously cached data or empty result
 */
export function getCachedSpriteGapData(): SpriteGapScannerResult {
  const now = Date.now()

  // Cache is valid
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data
  }

  // Cache is stale or missing - trigger async refresh but return current state
  if (!cache) {
    logger.debug("[SPRITE_GAP_SCANNER] Cache miss, queuing refresh")
    // Trigger async refresh without awaiting
    refreshSpriteGapData()
    // Return empty result until cache is populated
    return {
      spriteOnly: [],
      stats: {
        totalSpriteCollab: 0,
        lastRefresh: 0,
        refreshDurationMs: 0
      }
    }
  }

  // Cache exists but is stale, queue refresh and return stale data
  logger.debug("[SPRITE_GAP_SCANNER] Cache stale, queuing refresh")
  refreshSpriteGapData()

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
