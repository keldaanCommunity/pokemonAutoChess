import {
  ArraySchema,
  MapSchema,
  SetSchema,
  CollectionSchema
} from "@colyseus/schema"
import Board from "../core/board"
import Dps from "../core/dps"
import DpsHeal from "../core/dps-heal"
import Count from "../models/colyseus-models/count"
import Status from "../models/colyseus-models/status"
import ExperienceManager from "../models/colyseus-models/experience-manager"
import { ILeaderboardInfo } from "../models/colyseus-models/leaderboard-info"
import LobbyUser from "../models/colyseus-models/lobby-user"
import Message from "../models/colyseus-models/message"
import Synergies from "../models/colyseus-models/synergies"
import PokemonCollection from "../models/colyseus-models/pokemon-collection"
import {
  AttackType,
  BoardEvent,
  Orientation,
  PokemonActionState,
  Rarity
} from "./enum/Game"
import { Emotion } from "./enum/Emotion"
import { Effect } from "./enum/Effect"
import { Ability } from "./enum/Ability"
import { Synergy } from "./enum/Synergy"
import HistoryItem from "../models/colyseus-models/history-item"
import { Item } from "./enum/Item"
import { Pkm, PkmProposition } from "./enum/Pokemon"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { IPokemonRecord } from "../models/colyseus-models/game-record"
import GameRoom from "../rooms/game-room"
import { Effects } from "../models/effects"
import { Passive } from "./enum/Passive"
import { Weather } from "./enum/Weather"

export * from "./enum/Emotion"

export const FIGHTING_PHASE_DURATION = 40000

export const CDN_PORTRAIT_URL =
  "https://raw.githubusercontent.com/keldaanCommunity/SpriteCollab/master/portrait/"

export const CDN_URL =
  "https://raw.githubusercontent.com/keldaanCommunity/SpriteCollab/master"

export const USERNAME_REGEXP =
  /^(?=.{4,20}$)(?:[\u0021-\uFFFF]+(?:(?:\.|-|_)[\u0021-\uFFFF])*)+$/

export type NonFunctionPropNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export type DetailledPkm = { pkm: Pkm; shiny: boolean; emotion: Emotion }

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

export type PrecomputedAbility = {
  [key in Ability]: Pkm[]
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
  BOT = "BOT",
  BOT_MANAGER = "BOT_MANAGER"
}

export const RoleName: { [key in Role]: string } = {
  [Role.ADMIN]: "Creator",
  [Role.MODERATOR]: "Mod",
  [Role.BASIC]: "Basic",
  [Role.BOT]: "Bot",
  [Role.BOT_MANAGER]: "Bot Manager"
}

export const RoleColor: { [key in Role]: string } = {
  [Role.ADMIN]: "success",
  [Role.MODERATOR]: "primary",
  [Role.BASIC]: "",
  [Role.BOT]: "secondary",
  [Role.BOT_MANAGER]: "danger"
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
  BUY_BOOSTER = "BUY_BOOSTER",
  ADD_BOT = "ADD_BOT",
  REMOVE_BOT = "REMOVE_BOT",
  TOGGLE_READY = "TOGGLE_READY",
  TOGGLE_NO_ELO = "TOGGLE_NO_ELO",
  REQUEST_TILEMAP = "REQUEST_TILEMAP",
  REFRESH = "REFRESH",
  LOCK = "LOCK",
  LEVEL_UP = "LEVEL_UP",
  SHOP = "SHOP",
  ITEM = "ITEM",
  GAME_START = "GAME_START",
  GAME_START_REQUEST = "GAME_START_REQUEST",
  GAME_END = "GAME_END",
  CHANGE_ROOM_NAME = "CHANGE_ROOM_NAME",
  CHANGE_ROOM_PASSWORD = "CHANGE_ROOM_PASSWORD",
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
  SET_ROLE = "SET_ROLE",
  GIVE_TITLE = "GIVE_TITLE",
  REQUEST_LEADERBOARD = "REQUEST_LEADERBOARD",
  REQUEST_LEVEL_LEADERBOARD = "REQUEST_LEVEL_LEADERBOARD",
  REQUEST_BOT_LEADERBOARD = "REQUEST_BOT_LEADERBOARD",
  POKEMON_PROPOSITION = "POKEMON_PROPOSITION",
  KICK = "KICK",
  DELETE_ROOM = "DELETE_ROOM",
  BAN = "BAN",
  BANNED = "BANNED",
  POKEMON_DAMAGE = "POKEMON_DAMAGE",
  POKEMON_HEAL = "POKEMON_HEAL",
  UNOWN_ENCOUNTER = "UNOWN_ENCOUNTER",
  UNOWN_WANDERING = "UNOWN_WANDERING",
  VECTOR = "VECTOR",
  LOADING_PROGRESS = "LOADING_PROGRESS",
  LOADING_COMPLETE = "LOADING_COMPLETE",
  PLAYER_INCOME = "PLAYER_INCOME",
  PLAYER_DAMAGE = "PLAYER_DAMAGE",
  ROOMS = "ROOMS",
  ADD_ROOM = "ADD_ROOM",
  REMOVE_ROOM = "REMOVE_ROOM",
  ADD_BOT_DATABASE = "ADD_BOT_DATABASE",
  DELETE_BOT_DATABASE = "DELETE_BOT_DATABASE",
  BOT_DATABASE_LOG = "BOT_DATABASE_LOG",
  UNBAN = "UNBAN",
  BOARD_EVENT = "BOARD_EVENT",
  ABILITY = "ABILITY"
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
  FLYING_MELEE = "FLYING/melee",
  ICE_RANGE = "ICE/range"
}

export enum ModalMode {
  EXPORT = "EXPORT",
  IMPORT = "IMPORT"
}

export enum ReadWriteMode {
  WRITE = "WRITE",
  ERASE = "ERASE"
}

export interface ICreditName {
  Contact: string
  Discord: string
  Name: string
}

export interface IChatV2 {
  id: string
  payload: string
  authorId: string
  author: string
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
  elo: number
  name: string
  id: string
  rank: number
  avatar: string
  title: string
  role: Role
  pokemons: IPokemonRecord[]
  synergies: Array<{ name: Synergy; value: number }>
}

export interface IGameHistorySimplePlayer extends ISimplePlayer {
  pokemons: IGameHistoryPokemonRecord[]
}

export interface IGameHistoryPokemonRecord extends IPokemonRecord {
  inventory: Item[]
}

export interface IPokemonAvatar {
  id: string
  name: Pkm
  shiny: boolean
  x: number
  y: number
  action: PokemonActionState
}

export interface IFloatingItem {
  id: string
  name: Item
  x: number
  y: number
}

export interface IPlayer {
  id: string
  name: string
  avatar: string
  board: MapSchema<Pokemon>
  shop: ArraySchema<Pkm>
  simulation: ISimulation
  experienceManager: ExperienceManager
  synergies: Synergies
  money: number
  life: number
  shopLocked: boolean
  streak: number
  interest: number
  opponentId: string
  opponentName: string
  opponentAvatar: string
  opponentTitle: string
  boardSize: number
  items: CollectionSchema<Item>
  rank: number
  elo: number
  alive: boolean
  history: ArraySchema<HistoryItem>
  pokemonCollection: PokemonCollection
  title: Title | ""
  role: Role
  itemsProposition: ArraySchema<Item>
  pokemonsProposition: ArraySchema<PkmProposition>
  rerollCount: number
  loadingProgress: number
  effects: Effects
  isBot: boolean
}
export interface IPokemon {
  id: string
  name: Pkm
  types: ArraySchema<Synergy>
  rarity: Rarity
  index: string
  evolution: Pkm
  positionX: number
  positionY: number
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
  passive: Passive
  items: SetSchema<Item>
  evolutionTimer: number | undefined
  shiny: boolean
  emotion: Emotion
  final: boolean
  action: PokemonActionState
  canBePlaced: boolean
  canBeCloned: boolean
}

export interface IExperienceManager {
  level: number
  experience: number
  expNeeded: number
  maxLevel: number
}

export interface ISimulation {
  room: GameRoom
  id: string
  weather: Weather
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

export function instanceofPokemonEntity(
  obj: IPokemon | IPokemonEntity | IPokemonAvatar
) {
  return "mana" in obj
}

export interface IPokemonEntity {
  simulation: ISimulation
  addAbilityPower(value: number): void
  addAttack(atk: number): void
  addAttackSpeed(as: number): void
  addMaxHP(life: number): void
  handleShield(shieldBonus: number, pokemon: IPokemonEntity)
  update(dt: number, board: Board, weather: string)
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
  targetX: number
  targetY: number
  attackSprite: AttackSprite
  rarity: Rarity
  name: Pkm
  effects: ArraySchema<Effect>
  items: SetSchema<Item>
  types: ArraySchema<Synergy>
  stars: number
  skill: Ability
  passive: Passive
  status: Status
  count: Count
  critDamage: number
  ap: number
  healDone: number
  shiny: boolean
  emotion: Emotion
  baseAtk: number
  isClone: boolean
}

export interface IStatus {
  magmaStorm: boolean
  burn: boolean
  silence: boolean
  poisonStacks: number
  freeze: boolean
  protect: boolean
  sleep: boolean
  confusion: boolean
  wound: boolean
  resurection: boolean
  resurecting: boolean
  paralysis: boolean
  armorReduction: boolean
  runeProtect: boolean
  electricField: boolean
  psychicField: boolean
  grassField: boolean
  fairyField: boolean
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
  powerLensCount: number
  staticCount: number
  starDustCount: number
  tripleAttackCount: number
  staticHolderCount: number
  defensiveRibbonCount: number
  earthquakeCount: number
  mindBlownCount: number
  spellBlockedCount: number
  manaBurnCount: number
  moneyCount: number
  futureSightCount: number
  healOrderCount: number
  attackOrderCount: number
  monsterExecutionCount: number
}

export interface IPreparationMetadata {
  name: string
  password: string | null
  noElo: boolean
  type: "preparation"
  gameStarted: boolean
}

export interface IGameMetadata {
  name: string
  nbPlayers: number
  stageLevel: number
  type: "game"
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
  ROOKIE = "ROOKIE",
  AMATEUR = "AMATEUR",
  VETERAN = "VETERAN",
  PRO = "PRO",
  EXPERT = "EXPERT",
  ELITE = "ELITE",
  MASTER = "MASTER",
  GRAND_MASTER = "GRAND_MASTER",
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
  BABYSITTER = "BABYSITTER",
  ALCHEMIST = "ALCHEMIST",
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
  SURVIVOR = "SURVIVOR",
  GAMBLER = "GAMBLER",
  BOT_BUILDER = "BOT_BUILDER",
  SHINY_SEEKER = "SHINY_SEEKER",
  ARCHEOLOGIST = "ARCHEOLOGIST",
  DENTIST = "DENTIST",
  FISHERMAN = "FISHERMAN"
}

export interface IBoardEvent {
  type: BoardEvent
  x?: number
  y?: number
}
