import {
  ArraySchema,
  MapSchema,
  SetSchema,
  CollectionSchema
} from "@colyseus/schema"
import board from "../core/board"
import Dps from "../core/dps"
import DpsHeal from "../core/dps-heal"
import Count from "../models/colyseus-models/count"
import Status from "../models/colyseus-models/status"
import ExperienceManager from "../models/colyseus-models/experience-manager"
import LeaderboardInfo, {
  ILeaderboardInfo
} from "../models/colyseus-models/leaderboard-info"
import LobbyUser from "../models/colyseus-models/lobby-user"
import Message from "../models/colyseus-models/message"
import Synergies from "../models/colyseus-models/synergies"
import PokemonCollection from "../models/colyseus-models/pokemon-collection"
import {
  AttackType,
  Orientation,
  PokemonActionState,
  Rarity
} from "./enum/Game"
import { Effect } from "./enum/Effect"
import { Ability } from "./enum/Ability"
import { Synergy } from "./enum/Synergy"
import HistoryItem from "../models/colyseus-models/history-item"
import { Item } from "./enum/Item"
import { Pkm } from "./enum/Pokemon"
import { Pokemon } from "../models/colyseus-models/pokemon"

export const CDN_PORTRAIT_URL =
  "https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/"

export const CDN_URL =
  "https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master"

export type PrecomputedTypePokemon = {
  [key in Synergy]: {
    pokemons: Pkm[]
    mythicalPokemons: Pkm[]
    additionalPokemons: Pkm[]
  }
}

export type PrecomputedRaritPokemonyAll = {
  [key in Rarity]: Pkm[]
}

export type PrecomputedTypePokemonAll = {
  [key in Synergy]: Pkm[]
}

export type Langage = {
  eng: string
  esp: string
  prt: string
  fra: string
}

export enum Role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  BASIC = "BASIC",
  BOT = "BOT"
}

export const RoleName: { [key in Role]: string } = {
  [Role.ADMIN]: "Admin",
  [Role.MODERATOR]: "Mod",
  [Role.BASIC]: "Basic",
  [Role.BOT]: "Bot"
}

export const RoleColor: { [key in Role]: string } = {
  [Role.ADMIN]: "success",
  [Role.MODERATOR]: "primary",
  [Role.BASIC]: "",
  [Role.BOT]: "secondary"
}

export enum Transfer {
  DRAG_DROP = "DRAG_DROP",
  DRAG_DROP_COMBINE = "DRAG_DROP_COMBINE",
  DRAG_DROP_ITEM = "DRAG_DROP_ITEM",
  SELL_DROP = "SELL_DROP",
  CHANGE_SELECTED_EMOTION = "CHANGE_SELECTED_EMOTION",
  NEW_MESSAGE = "NEW_MESSAGE",
  BOT_CREATION = "BOT_CREATION",
  SEARCH = "SEARH",
  CHANGE_NAME = "CHANGE_NAME",
  CHANGE_AVATAR = "CHANGE_AVATAR",
  REQUEST_META = "REQUEST_META",
  REQUEST_META_ITEMS = "REQUEST_META_ITEMS",
  REQUEST_BOT_DATA = "REQUEST_BOT_DATA",
  REQUEST_BOT_MONITOR = "REQUEST_BOT_MONITOR",
  REQUEST_BOT_LIST = "REQUEST_BOT_LIST",
  OPEN_BOOSTER = "OPEN_BOOSTER",
  ADD_BOT = "ADD_BOT",
  REMOVE_BOT = "REMOVE_BOT",
  TOGGLE_READY = "TOGGLE_READY",
  REQUEST_TILEMAP = "REQUEST_TILEMAP",
  REFRESH = "REFRESH",
  LOCK = "LOCK",
  LEVEL_UP = "LEVEL_UP",
  SHOP = "SHOP",
  ITEM = "ITEM",
  GAME_START = "GAME_START",
  CHANGE_ROOM_NAME = "CHANGE_ROOM_NAME",
  BUY_EMOTION = "BUY_EMOTION",
  BOOSTER_CONTENT = "BOOSTER_CONTENT",
  PASTEBIN_URL = "PASTEBIN_URL",
  USER = "USER",
  MESSAGES = "MESSAGES",
  DRAG_DROP_FAILED = "DRAG_DROP_FAILED",
  BROADCAST_EMOTE = "BROADCAST_EMOTE",
  BROADCAST_INFO = "BROADCAST_INFO",
  REQUEST_META_POKEMONS = "REQUEST_META_POKEMONS",
  SEARCH_BY_ID = "SEARCH_BY_ID",
  SUGGESTIONS = "SUGGESTIONS",
  SET_TITLE = "SET_TITLE",
  REMOVE_MESSAGE = "REMOVE_MESSAGE",
  GIVE_BOOSTER = "GIVE_BOOSTER",
  SET_MODERATOR = "SET_MODERATOR",
  GIVE_TITLE = "GIVE_TITLE",
  REQUEST_LEADERBOARD = "REQUEST_LEADERBOARD",
  REQUEST_LEVEL_LEADERBOARD = "REQUEST_LEVEL_LEADERBOARD",
  REQUEST_BOT_LEADERBOARD = "REQUEST_BOT_LEADERBOARD",
  POKEMON_PROPOSITION = "POKEMON_PROPOSITION"
}

export enum AttackSprite {
  WATER_MELEE = "WATER/melee",
  ROCK_MELEE = "ROCK/melee",
  NORMAL_MELEE = "NORMAL/melee",
  ELECTRIC_MELEE = "ELECTRIC/melee",
  DRAGON_MELEE = "DRAGON/melee",
  FIGHTING_RANGE = "FIGHTING/range",
  DRAGON_RANGE = "DRAGON/range",
  FIGHTING_MELEE = "FIGHTING/melee",
  FIRE_MELEE = "FIRE/melee",
  PSYCHIC_RANGE = "PSYCHIC/range",
  FIRE_RANGE = "FIRE/range",
  GRASS_RANGE = "GRASS/range",
  WATER_RANGE = "WATER/range",
  FLYING_RANGE = "FLYING/range",
  ICE_MELEE = "ICE/melee",
  GHOST_RANGE = "GHOST/range",
  FAIRY_RANGE = "FAIRY/range",
  ELECTRIC_RANGE = "ELECTRIC/range",
  POISON_MELEE = "POISON/melee",
  GRASS_MELEE = "GRASS/melee",
  FAIRY_MELEE = "FAIRY/melee",
  POISON_RANGE = "POISON/range",
  BUG_MELEE = "BUG/melee",
  FLYING_MELEE = "FLYING/melee"
}

export enum ModalMode {
  EXPORT = "EXPORT",
  IMPORT = "IMPORT"
}

export enum ReadWriteMode {
  WRITE = "WRITE",
  ERASE = "ERASE"
}

export interface ICreditNames {
  Contact: string[]
  Discord: string[]
  Name: string[]
}

export interface IMessage {
  name: string
  payload: string
  avatar: string
  time: number
}

export interface IClient {
  auth?: {
    uid: string
  }
}

export interface IDragDropMessage {
  x: number
  y: number
  id: string
}

export interface IDragDropItemMessage {
  x: number
  y: number
  id: Item
  bypass?: boolean
}

export interface IDragDropCombineMessage {
  itemA: Item
  itemB: Item
}

export interface ICustomLobbyState {
  messages: ArraySchema<Message>
  users: MapSchema<LobbyUser>
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardInfo[]
  levelLeaderboard: ILeaderboardInfo[]
}

export interface IGameState {
  afterGameId: string
  roundTime: number
  phase: string
  players: MapSchema<IPlayer>
  stageLevel: number
  mapName: string
}

export interface ISimplePlayer {
  name: string
  id: string
  rank: number
  avatar: string
  pokemons: string[]
}

export interface IPlayer {
  id: string
  name: string
  avatar: string
  board: MapSchema<Pokemon>
  shop: Pkm[]
  simulation: ISimulation
  experienceManager: ExperienceManager
  synergies: Synergies
  itemsProposition: Item[]
  money: number
  life: number
  shopLocked: boolean
  streak: number
  interest: number
  opponentName: string
  opponentAvatar: string
  boardSize: number
  items: CollectionSchema<Item>
  rank: number
  elo: number
  alive: boolean
  history: ArraySchema<HistoryItem>
  pokemonCollection: PokemonCollection
  title: Title | ""
  role: Role
  pokemonsProposition: Pkm[]
  rerollCount: number
}
export interface IPokemon {
  id: string
  name: Pkm
  types: Synergy[]
  rarity: Rarity
  index: string
  evolution: Pkm
  positionX: number
  positionY: number
  cost: number
  attackSprite: AttackSprite
  atkSpeed: number
  def: number
  speDef: number
  attackType: AttackType
  atk: number
  hp: number
  range: number
  stars: number
  maxMana: number
  skill: Ability
  items: SetSchema<Item>
  fossilTimer: number | undefined
  shiny: boolean
  emotion: Emotion
  final: boolean
}

export interface IExperienceManager {
  level: number
  experience: number
  expNeeded: number
  maxLevel: number
}

export interface ISimulation {
  climate: string
  blueEffects: Effect[]
  redEffects: Effect[]
  blueTeam: MapSchema<IPokemonEntity>
  redTeam: MapSchema<IPokemonEntity>
  blueDpsMeter: MapSchema<Dps>
  redDpsMeter: MapSchema<Dps>
  blueHealDpsMeter: MapSchema<DpsHeal>
  redHealDpsMeter: MapSchema<DpsHeal>
}

export interface IDps {
  changeDamage(
    physicalDamage: number,
    specialDamage: number,
    trueDamage: number
  )
  id: string
  name: string
  physicalDamage: number
  specialDamage: number
  trueDamage: number
}

export interface IDpsHeal {
  changeHeal(healDone: number, shieldDone: number)
  id: string
  name: string
  heal: number
  shield: number
}

export function instanceofPokemonEntity(obj: IPokemon | IPokemonEntity) {
  return "mana" in obj
}

export interface IPokemonEntity {
  handleShield(shieldBonus: number, pokemon: IPokemonEntity)
  update(dt: number, board: board, climate: string)
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  shieldDone: number
  positionX: number
  positionY: number
  action: PokemonActionState
  index: string
  id: string
  orientation: Orientation
  critChance: number
  hp: number
  mana: number
  maxMana: number
  atk: number
  def: number
  speDef: number
  attackType: AttackType
  life: number
  shield: number
  team: number
  range: number
  atkSpeed: number
  atkSpeedBonus: number
  targetX: number
  targetY: number
  attackSprite: AttackSprite
  rarity: Rarity
  name: Pkm
  effects: Effect[]
  items: SetSchema<Item>
  types: Synergy[]
  stars: number
  skill: Ability
  status: Status
  count: Count
  critDamage: number
  spellDamage: number
  healDone: number
  shiny: boolean
  emotion: Emotion
}

export interface IStatus {
  burn: boolean
  silence: boolean
  poison: boolean
  freeze: boolean
  protect: boolean
  sleep: boolean
  confusion: boolean
  wound: boolean
  resurection: boolean
  smoke: boolean
  armorReduction: boolean
  runeProtect: boolean
  electricField: boolean
  psychicField: boolean
}

export interface ICount {
  crit: number
  ult: number
  petalDanceCount: number
  fieldCount: number
  soundCount: number
  fairyCritCount: number
  attackCount: number
  growGroundCount: number
  dodgeCount: number
  incenseCount: number
  staticCount: number
  brightPowderCount: number
  doubleAttackCount: number
  staticHolderCount: number
  defensiveRibbonCount: number
  earthquakeCount: number
  mindBlownCount: number
}

export interface IPreparationMetadata {
  name: string
  type: string
}

export enum Emotion {
  NORMAL = "Normal",
  HAPPY = "Happy",
  PAIN = "Pain",
  ANGRY = "Angry",
  WORRIED = "Worried",
  SAD = "Sad",
  CRYING = "Crying",
  SHOUTING = "Shouting",
  TEARY_EYED = "Teary-Eyed",
  DETERMINED = "Determined",
  JOYOUS = "Joyous",
  INSPIRED = "Inspired",
  SURPRISED = "Surprised",
  DIZZY = "Dizzy",
  SPECIAL0 = "Special0",
  SPECIAL1 = "Special1",
  SIGH = "Sigh",
  STUNNED = "Stunned",
  SPECIAL2 = "Special2",
  SPECIAL3 = "Special3"
}

export const EmotionCost: { [key in Emotion]: number } = {
  [Emotion.NORMAL]: 50,
  [Emotion.HAPPY]: 100,
  [Emotion.PAIN]: 110,
  [Emotion.ANGRY]: 120,
  [Emotion.WORRIED]: 130,
  [Emotion.SAD]: 140,
  [Emotion.CRYING]: 150,
  [Emotion.SHOUTING]: 160,
  [Emotion.TEARY_EYED]: 170,
  [Emotion.DETERMINED]: 180,
  [Emotion.JOYOUS]: 190,
  [Emotion.INSPIRED]: 200,
  [Emotion.SURPRISED]: 210,
  [Emotion.DIZZY]: 220,
  [Emotion.SPECIAL0]: 230,
  [Emotion.SPECIAL1]: 240,
  [Emotion.SIGH]: 250,
  [Emotion.STUNNED]: 260,
  [Emotion.SPECIAL2]: 270,
  [Emotion.SPECIAL3]: 280
}

export interface ISuggestionUser {
  name: string
  elo: number
  level: number
  id: string
  avatar: string
}

export enum Title {
  NOVICE = "NOVICE",
  BIRD_KEEPER = "BIRD_KEEPER",
  BLACK_BELT = "BLACK_BELT",
  BUG_MANIAC = "BUG_MANIAC",
  CUTE_MANIAC = "CUTE_MANIAC",
  DELINQUENT = "DELINQUENT",
  DRAGON_TAMER = "DRAGON_TAMER",
  FIREFIGHTER = "FIREFIGHTER",
  TEAM_ROCKET_GRUNT = "TEAM_ROCKET_GRUNT",
  HIKER = "HIKER",
  LONE_WOLF = "LONE_WOLF",
  KINDLER = "KINDLER",
  GARDENER = "GARDENER",
  MUSEUM_DIRECTOR = "MUSEUM_DIRECTOR",
  ENGINEER = "ENGINEER",
  TELEKINESIST = "TELEKINESIST",
  ELECTRICIAN = "ELECTRICIAN",
  GEOLOGIST = "GEOLOGIST",
  MYTH_TRAINER = "MYTH_TRAINER",
  DIVER = "DIVER",
  POKEMON_RANGER = "POKEMON_RANGER",
  CAMPER = "CAMPER",
  RIVAL = "RIVAL",
  SKIER = "SKIER",
  POKEFAN = "POKEFAN",
  HEX_MANIAC = "HEX_MANIAC",
  MUSICIAN = "MUSICIAN",
  HARLEQUIN = "HARLEQUIN",
  GLITCH_TRAINER = "GLITCH_TRAINER",
  NURSE = "NURSE",
  GARDIAN = "GARDIAN",
  DUKE = "DUKE",
  DUCHESS = "DUCHESS",
  CHAMPION = "CHAMPION",
  ELITE_FOUR_MEMBER = "ELITE_FOUR_MEMBER",
  GYM_LEADER = "GYM_LEADER",
  GYM_CHALLENGER = "GYM_CHALLENGER",
  GYM_TRAINER = "GYM_TRAINER",
  ACE_TRAINER = "ACE_TRAINER",
  BACKER = "BACKER",
  TYRANT = "TYRANT",
  GAMBLER = "GAMBLER",
  SHINY_SEEKER = "SHINY_SEEKER"
}

export const TitleName: { [key in Title]: string } = {
  [Title.NOVICE]: "Novice",
  [Title.BIRD_KEEPER]: "Bird Keeper",
  [Title.BLACK_BELT]: "Black Belt",
  [Title.BUG_MANIAC]: "Bug Maniac",
  [Title.CUTE_MANIAC]: "Cute Maniac",
  [Title.DELINQUENT]: "Delinquent",
  [Title.DRAGON_TAMER]: "Dragon Tamer",
  [Title.FIREFIGHTER]: "Firefighter",
  [Title.TEAM_ROCKET_GRUNT]: "Team Rocket Grunt",
  [Title.HIKER]: "Hiker",
  [Title.LONE_WOLF]: "Lone Wolf",
  [Title.KINDLER]: "Kindler",
  [Title.GARDENER]: "Gardener",
  [Title.MUSEUM_DIRECTOR]: "Museum Director",
  [Title.ENGINEER]: "Engineer",
  [Title.TELEKINESIST]: "Telekinesist",
  [Title.ELECTRICIAN]: "Electrician",
  [Title.GEOLOGIST]: "Geologist",
  [Title.MYTH_TRAINER]: "Myth Trainer",
  [Title.DIVER]: "Diver",
  [Title.POKEMON_RANGER]: "Pokemon Ranger",
  [Title.SKIER]: "Skier",
  [Title.POKEFAN]: "Pokefan",
  [Title.HEX_MANIAC]: "Hex Maniac",
  [Title.MUSICIAN]: "Musician",
  [Title.HARLEQUIN]: "Harlequin",
  [Title.GLITCH_TRAINER]: "Glitch Trainer",
  [Title.NURSE]: "Nurse",
  [Title.GARDIAN]: "Gardian",
  [Title.DUKE]: "Duke",
  [Title.DUCHESS]: "Duchess",
  [Title.CHAMPION]: "Champion",
  [Title.ELITE_FOUR_MEMBER]: "Elite Four Member",
  [Title.ACE_TRAINER]: "Ace Trainer",
  [Title.GYM_LEADER]: "Gym Leader",
  [Title.GYM_CHALLENGER]: "Gym Challenger",
  [Title.GYM_TRAINER]: "Gym Trainer",
  [Title.CAMPER]: "Camper",
  [Title.RIVAL]: "Rival",
  [Title.BACKER]: "Backer",
  [Title.TYRANT]: "Tyrant",
  [Title.GAMBLER]: "Gambler",
  [Title.SHINY_SEEKER]: "Shiny Seeker"
}

export const TitleDescription: { [key in Title]: string } = {
  [Title.NOVICE]: "Play your first game",
  [Title.BIRD_KEEPER]: "Max Synergy With Flying type in a game",
  [Title.BLACK_BELT]: "Max Synergy With Fighting Type in a game",
  [Title.BUG_MANIAC]: "Max Synergy With Bug Type in a game",
  [Title.CUTE_MANIAC]: "Max Synergy With Fairy Type in a game",
  [Title.DELINQUENT]: "Max Synergy With Dark Type in a game",
  [Title.DRAGON_TAMER]: "Max Synergy With Dragon Type in a game",
  [Title.FIREFIGHTER]: "Max Synergy With Water Type in a game",
  [Title.TEAM_ROCKET_GRUNT]: "Max Synergy With Poison Type in a game",
  [Title.HIKER]: "Max Synergy With Mineral Type in a game",
  [Title.LONE_WOLF]: "Win in a lobby against only bots",
  [Title.KINDLER]: "Max Synergy With Fire Type in a game",
  [Title.GARDENER]: "Max Synergy With Flora Type in a game",
  [Title.MUSEUM_DIRECTOR]: "Max Synergy With Fossil Type in a game",
  [Title.ENGINEER]: "Max Synergy With Steel Type in a game",
  [Title.TELEKINESIST]: "Max Synergy With Psychic Type in a game",
  [Title.ELECTRICIAN]: "Max Synergy With Electric Type in a game",
  [Title.GEOLOGIST]: "Max Synergy With Ground Type in a game",
  [Title.MYTH_TRAINER]: "Max Synergy With Monster Type in a game",
  [Title.DIVER]: "Max Synergy With Aquatic Type in a game",
  [Title.POKEMON_RANGER]: "Max Synergy With Grass Type in a game",
  [Title.SKIER]: "Max Synergy With Ice Type in a game",
  [Title.POKEFAN]: "Max Synergy With Normal Type in a game",
  [Title.HEX_MANIAC]: "Max Synergy With Ghost Type in a game",
  [Title.MUSICIAN]: "Max Synergy With Sound Type in a game",
  [Title.HARLEQUIN]: "Have 5 different synergies at once",
  [Title.GLITCH_TRAINER]: "Report a Bug without annoying Keldaan",
  [Title.NURSE]: "Heal 1000 or more in a single fight",
  [Title.GARDIAN]: "Shield 1000 or more in a single fight",
  [Title.DUKE]: "Own 30 different avatars",
  [Title.DUCHESS]: "Own all the emotion of a single pokemon",
  [Title.CHAMPION]: "Win a Tournament",
  [Title.ELITE_FOUR_MEMBER]: "Reach first 4 places of a tournament",
  [Title.ACE_TRAINER]: "Reach the final of a tournament",
  [Title.GYM_LEADER]: "Reach 1400 Elo",
  [Title.GYM_CHALLENGER]: "Reach 1200 Elo",
  [Title.GYM_TRAINER]: "Reach 1100 Elo",
  [Title.CAMPER]: "Max Synergy with Field Type in a game",
  [Title.RIVAL]: "Max Synergy with Human Type in a game",
  [Title.BACKER]: "Support the game financially",
  [Title.TYRANT]: "Win a game at 100 Hp",
  [Title.GAMBLER]: "Reroll over 60 times in a single match",
  [Title.SHINY_SEEKER]: "Have over 30 shiny pokemon avatars"
}
