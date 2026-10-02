import type { Emotion, Role, Title } from ".."
import type { Language } from "../enum/Language"
import type { GameEventData } from "../events"

interface IUserMetadata {
  uid: string
  displayName: string
  twitchUserId?: string
  twitchLogin?: string
  twitchDisplayName?: string
  twitchVerifiedAt?: Date | null
  twitchVerificationRevokedAt?: Date | null
  language: Language | ""
  avatar: string
  games: number
  wins: number
  exp: number
  level: number
  elo: number
  maxElo: number
  eventPoints: number
  maxEventPoints: number
  eventFinishTime: Date | null
  eventData?: GameEventData
  booster: number
  titles: Title[]
  title: "" | Title
  role: Role
  banned?: boolean
  pokemonCollection: Map<string, IPokemonCollectionItem>
}

/*
 * A collection entry is not guaranteed to be complete.
 * Can just be a bare `{ played: n }` entry for a pokemon the player has never owned,
 * or a bare `{ dust: n }` one for a Unown they caught but never played or owned
 */
interface IPokemonCollectionItem {
  id: string
  selectedEmotion?: Emotion | null
  selectedShiny?: boolean
  dust?: number
  played?: number
}

export interface IUserMetadataMongo extends IUserMetadata {
  pokemonCollection: Map<string, IPokemonCollectionItemMongo>
}

export interface IPokemonCollectionItemMongo extends IPokemonCollectionItem {
  // OPTIMIZED: Single field to store all unlocked emotions data in 5 bytes (40 bits used)
  unlocked?: Uint8Array
}

// When using .lean(), Mongoose returns BSON Binary objects instead of Buffer
export type IPokemonCollectionItemLean = Omit<
  IPokemonCollectionItemMongo,
  "unlocked"
> & {
  unlocked: Uint8Array | { buffer: ArrayBuffer } | undefined
}

export type IUserMetadataLean = Omit<
  IUserMetadataMongo,
  "pokemonCollection"
> & {
  pokemonCollection: Record<string, IPokemonCollectionItemLean>
}

/*
 * Narrow projection for a single collection entry used when hydrating a Player.
 * Used in GameRoom to feed PokemonCustoms and to compute avatar emotes.
 * Only these fields are actually needed; dust/played/id are dropped to shrink the payload.
 */
export type IPokemonCollectionItemForPlayer = {
  selectedEmotion: Emotion | null
  selectedShiny: boolean
  unlocked: Uint8Array
}

/*
 * Lean variant of the above: what actually comes back from the projected query.
 * Optional because a thin stored entry really can be missing these, and .lean()
 * hands back a BSON Binary rather than a Buffer for `unlocked`.
 * toPlayerCollection() normalises this into IPokemonCollectionItemForPlayer.
 */
export type IPokemonCollectionItemForPlayerLean = {
  selectedEmotion?: Emotion | null
  selectedShiny?: boolean
  unlocked: Uint8Array | { buffer: ArrayBuffer } | undefined
}

/*
 * Narrow projection of UserMetadata used exclusively for Player in GameRoom
 * remove all non-essential pokemonCollection subfields for smaller payloads
 */
export type IUserMetadataForPlayer = Pick<
  IUserMetadataMongo,
  "uid" | "displayName" | "elo" | "games" | "avatar" | "title" | "role"
> & {
  pokemonCollection: Record<string, IPokemonCollectionItemForPlayerLean>
}

// used in JSON responses and client-side before unpacking
export interface IUserMetadataClient extends IUserMetadata {
  pokemonCollection: Map<string, IPokemonCollectionItemClient>
}

// used in JSON responses and client-side before unpacking.
// Always complete: toCollectionItemClient() fills in the defaults a thin stored
// entry may be missing, so this deliberately does not extend the possibly-thin
// IPokemonCollectionItem.
export interface IPokemonCollectionItemClient {
  id: string
  selectedEmotion: Emotion | null
  selectedShiny: boolean
  dust: number
  played: number
  unlockedb64: string // 40 bits encoded as base64 string
}

// used after unpacking the base64 string into emotions and shinyEmotions
export type IPokemonCollectionItemUnpacked = Omit<
  IPokemonCollectionItemClient,
  "unlockedb64"
> & {
  emotions: Emotion[]
  shinyEmotions: Emotion[]
}

export interface IUserMetadataUnpacked extends IUserMetadata {
  pokemonCollection: Map<string, IPokemonCollectionItemUnpacked>
}

export type IUserMetadataJSON = Omit<
  IUserMetadataClient,
  "pokemonCollection"
> & { pokemonCollection: { [index: string]: IPokemonCollectionItemClient } }
