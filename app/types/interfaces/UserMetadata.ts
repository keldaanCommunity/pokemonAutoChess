import { Emotion, Role, Title } from ".."
import { Language } from "../enum/Language"

interface IUserMetadata {
  uid: string
  displayName: string
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
  booster: number
  titles: Title[]
  title: "" | Title
  role: Role
  banned?: boolean
  pokemonCollection: Map<string, IPokemonCollectionItem>
}

interface IPokemonCollectionItem {
  id: string
  selectedEmotion: Emotion | null
  selectedShiny: boolean
  dust: number
  played: number
}

export interface IUserMetadataMongo extends IUserMetadata {
  pokemonCollection: Map<string, IPokemonCollectionItemMongo>
}

export interface IPokemonCollectionItemMongo extends IPokemonCollectionItem {
  // OPTIMIZED: Single field to store all unlocked emotions data in 5 bytes (40 bits used)
  unlocked: Buffer
}

// used in JSON responses and client-side before unpacking
export interface IUserMetadataClient extends IUserMetadata {
  pokemonCollection: Map<string, IPokemonCollectionItemClient>
}

export interface IPokemonCollectionItemClient extends IPokemonCollectionItem {
  unlockedb64: string // 40 bits encoded as base64 string
}

// used after unpacking the base64 string into emotions and shinyEmotions
export type IPokemonCollectionItemUnpacked = Omit<
  IPokemonCollectionItem,
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
