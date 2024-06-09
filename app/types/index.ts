import { ArraySchema, MapSchema, Schema, SetSchema } from "@colyseus/schema"
import Board from "../core/board"
import Dps from "../core/dps"
import DpsHeal from "../core/dps-heal"
import { EvolutionRule } from "../core/evolution-rules"
import Count from "../models/colyseus-models/count"
import ExperienceManager from "../models/colyseus-models/experience-manager"
import { IPokemonRecord } from "../models/colyseus-models/game-record"
import HistoryItem from "../models/colyseus-models/history-item"
import { ILeaderboardInfo } from "../types/interfaces/LeaderboardInfo"
import { ISpecialGamePlanned } from "../types/interfaces/Lobby"
import LobbyUser from "../models/colyseus-models/lobby-user"
import Message from "../models/colyseus-models/message"
import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonCollection from "../models/colyseus-models/pokemon-collection"
import Status from "../models/colyseus-models/status"
import Synergies from "../models/colyseus-models/synergies"
import { TournamentSchema } from "../models/colyseus-models/tournament"
import { Effects } from "../models/effects"
import GameRoom from "../rooms/game-room"
import { Ability } from "./enum/Ability"
import { DungeonPMDO } from "./enum/Dungeon"
import { Effect } from "./enum/Effect"
import { Emotion } from "./enum/Emotion"
import {
  AttackType,
  BoardEvent,
  GameMode,
  Orientation,
  PokemonActionState,
  Rarity,
  Stat
} from "./enum/Game"
import { Item } from "./enum/Item"
import { Passive } from "./enum/Passive"
import { Pkm, PkmProposition } from "./enum/Pokemon"
import { Synergy } from "./enum/Synergy"
import { Weather } from "./enum/Weather"

export * from "./enum/Emotion"

export const CDN_PORTRAIT_URL =
  "https://raw.githubusercontent.com/keldaanCommunity/SpriteCollab/master/portrait/"

export const CDN_URL =
  "https://raw.githubusercontent.com/keldaanCommunity/SpriteCollab/master"

export const USERNAME_REGEXP = /^(\p{Letter}|[0-9]|\.|-|_){3,24}$/u

export type PkmWithConfig = { name: Pkm; shiny?: boolean; emotion?: Emotion }

export enum Role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  BASIC = "BASIC",
  BOT = "BOT",
  BOT_MANAGER = "BOT_MANAGER"
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
  SELL_POKEMON = "SELL_POKEMON",
  REMOVE_FROM_SHOP = "REMOVE_FROM_SHOP",
  CHANGE_SELECTED_EMOTION = "CHANGE_SELECTED_EMOTION",
  NEW_MESSAGE = "NEW_MESSAGE",
  BOT_CREATION = "BOT_CREATION",
  SEARCH = "SEARH",
  CHANGE_NAME = "CHANGE_NAME",
  CHANGE_AVATAR = "CHANGE_AVATAR",
  REQUEST_BOT_DATA = "REQUEST_BOT_DATA",
  REQUEST_BOT_MONITOR = "REQUEST_BOT_MONITOR",
  REQUEST_BOT_LIST = "REQUEST_BOT_LIST",
  OPEN_BOOSTER = "OPEN_BOOSTER",
  BUY_BOOSTER = "BUY_BOOSTER",
  ADD_BOT = "ADD_BOT",
  REMOVE_BOT = "REMOVE_BOT",
  TOGGLE_READY = "TOGGLE_READY",
  TOGGLE_NO_ELO = "TOGGLE_NO_ELO",
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
  DRAG_DROP_FAILED = "DRAG_DROP_FAILED",
  SHOW_EMOTE = "SHOW_EMOTE",
  FINAL_RANK = "FINAL_RANK",
  SEARCH_BY_ID = "SEARCH_BY_ID",
  SUGGESTIONS = "SUGGESTIONS",
  SET_TITLE = "SET_TITLE",
  REMOVE_MESSAGE = "REMOVE_MESSAGE",
  NEW_TOURNAMENT = "NEW_TOURNAMENT",
  REMOVE_TOURNAMENT = "REMOVE_TOURNAMENT",
  REMAKE_TOURNAMENT_LOBBIES = "REMAKE_TOURNAMENT_LOBBIES",
  PARTICIPATE_TOURNAMENT = "PARTICIPATE_TOURNAMENT",
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
  POKEMON_WANDERING = "POKEMON_WANDERING",
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
  SIMULATION_STOP = "SIMULATION_STOP",
  ABILITY = "ABILITY",
  SELECT_LANGUAGE = "SELECT_LANGUAGE",
  USER_PROFILE = "USER_PROFILE",
  PICK_BERRY = "PICK_BERRY",
  SERVER_ANNOUNCEMENT = "SERVER_ANNOUNCEMENT",
  PRELOAD_MAPS = "PRELOAD_MAPS",
  NPC_DIALOG = "NPC_DIALOG"
}

export enum AttackSprite {
  BUG_MELEE = "BUG/melee",
  BUG_RANGE = "BUG/range",
  DARK_MELEE = "DARK/melee",
  DARK_RANGE = "DARK/range",
  DRAGON_MELEE = "DRAGON/melee",
  DRAGON_RANGE = "DRAGON/range",
  ELECTRIC_MELEE = "ELECTRIC/melee",
  ELECTRIC_RANGE = "ELECTRIC/range",
  FAIRY_MELEE = "FAIRY/melee",
  FAIRY_RANGE = "FAIRY/range",
  FIGHTING_MELEE = "FIGHTING/melee",
  FIGHTING_RANGE = "FIGHTING/range",
  FIRE_MELEE = "FIRE/melee",
  FIRE_RANGE = "FIRE/range",
  FLYING_MELEE = "FLYING/melee",
  FLYING_RANGE = "FLYING/range",
  GHOST_RANGE = "GHOST/range",
  GRASS_MELEE = "GRASS/melee",
  GRASS_RANGE = "GRASS/range",
  ICE_MELEE = "ICE/melee",
  ICE_RANGE = "ICE/range",
  NORMAL_MELEE = "NORMAL/melee",
  POISON_MELEE = "POISON/melee",
  POISON_RANGE = "POISON/range",
  PSYCHIC_MELEE = "PSYCHIC/melee",
  PSYCHIC_RANGE = "PSYCHIC/range",
  WATER_MELEE = "WATER/melee",
  WATER_RANGE = "WATER/range",
  ROCK_MELEE = "ROCK/melee",
  ROCK_RANGE = "ROCK/range",
  SOUND_RANGE = "SOUND/range",
  STEEL_MELEE = "STEEL/melee"
}

export const AttackSpriteScale: { [sprite in AttackSprite]: [number, number] } =
  {
    "BUG/melee": [1.5, 1.5],
    "BUG/range": [2, 2],
    "DARK/melee": [1.5, 1.5],
    "DARK/range": [1.5, 1.5],
    "DRAGON/melee": [2, 2],
    "DRAGON/range": [2, 2],
    "ELECTRIC/melee": [1.5, 1.5],
    "ELECTRIC/range": [2, 2],
    "FAIRY/melee": [2, 2],
    "FAIRY/range": [2, 2],
    "FIGHTING/melee": [2, 2],
    "FIGHTING/range": [2, 2],
    "FIRE/melee": [1, 1],
    "FIRE/range": [2, 2],
    "FLYING/melee": [1, 1],
    "FLYING/range": [1.5, 1.5],
    "GHOST/range": [2, 2],
    "GRASS/melee": [1, 1],
    "GRASS/range": [3, 3],
    "ICE/melee": [2, 2],
    "ICE/range": [2, 2],
    "NORMAL/melee": [2, 2],
    "POISON/melee": [2, 2],
    "POISON/range": [1.5, 1.5],
    "PSYCHIC/melee": [1.5, 1.5],
    "PSYCHIC/range": [2, 2],
    "ROCK/melee": [1.5, 1.5],
    "ROCK/range": [2, 2],
    "STEEL/melee": [1.5, 1.5],
    "SOUND/range": [2, 2],
    "WATER/melee": [2, 2],
    "WATER/range": [3, 3]
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
}

export interface IDragDropCombineMessage {
  itemA: Item
  itemB: Item
}

export interface ICustomLobbyState extends Schema {
  messages: ArraySchema<Message>
  users: MapSchema<LobbyUser>
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardInfo[]
  levelLeaderboard: ILeaderboardInfo[]
  nextSpecialGame: ISpecialGamePlanned
  tournaments: ArraySchema<TournamentSchema>
}

export interface IGameState extends Schema {
  afterGameId: string
  roundTime: number
  phase: string
  players: MapSchema<IPlayer>
  stageLevel: number
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

export interface IPortal {
  id: string
  x: number
  y: number
}

export interface ISynergySymbol {
  id: string
  x: number
  y: number
  synergy: Synergy
}

export interface IPlayer {
  id: string
  name: string
  avatar: string
  board: MapSchema<Pokemon>
  shop: ArraySchema<Pkm>
  simulationId: string
  simulationTeamIndex: number
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
  items: ArraySchema<Item>
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
  map: DungeonPMDO
  regionalPokemons: ArraySchema<Pkm>
  commonRegionalPool: Pkm[]
  uncommonRegionalPool: Pkm[]
  rareRegionalPool: Pkm[]
  epicRegionalPool: Pkm[]
  ultraRegionalPool: Pkm[]
}

export interface IPokemon {
  id: string
  name: Pkm
  types: SetSchema<Synergy>
  rarity: Rarity
  index: string
  evolution: Pkm
  evolutionRule: EvolutionRule
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
  maxPP: number
  skill: Ability
  passive: Passive
  items: SetSchema<Item>
  shiny: boolean
  emotion: Emotion
  additional: boolean
  regional: boolean
  action: PokemonActionState
  canBePlaced: boolean
  canBeCloned: boolean
  canHoldItems: boolean
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
  blueEffects: Set<Effect>
  redEffects: Set<Effect>
  blueTeam: MapSchema<IPokemonEntity>
  redTeam: MapSchema<IPokemonEntity>
  blueDpsMeter: MapSchema<Dps>
  redDpsMeter: MapSchema<Dps>
  blueHealDpsMeter: MapSchema<DpsHeal>
  redHealDpsMeter: MapSchema<DpsHeal>
  bluePlayerId: string
  redPlayerId: string
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
  return "pp" in obj
}

export interface IPokemonEntity {
  simulation: ISimulation
  refToBoardPokemon: IPokemon
  applyStat(stat: Stat, value: number): void
  addAbilityPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addPP(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addAttack(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addAttackSpeed(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addMaxHP(life: number): void
  addShield(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addSpecialDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addCritChance(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addCritPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  update(
    dt: number,
    board: Board,
    weather: string,
    player: Player | undefined
  ): void
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
  pp: number
  maxPP: number
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
  effects: SetSchema<Effect>
  items: SetSchema<Item>
  types: SetSchema<Synergy>
  stars: number
  skill: Ability
  passive: Passive
  status: Status
  count: Count
  critPower: number
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
  fightingBlockCount: number
  dodgeCount: number
  powerLensCount: number
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
  magmarizerCount: number
}

export interface IPreparationMetadata {
  name: string
  ownerName: string
  password: string | null
  noElo: boolean
  type: "preparation"
  gameStarted: boolean
  minRank: string | null
  gameMode: GameMode
  whitelist: string[] | null
  blacklist: string[]
  tournamentId: string | null
  bracketId: string | null
}

export interface IGameMetadata {
  name: string
  ownerName: string
  gameMode: GameMode
  playerIds: string[]
  stageLevel: number
  type: "game"
  tournamentId: string | null
  bracketId: string | null
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
  FISHERMAN = "FISHERMAN",
  CHOSEN_ONE = "CHOSEN_ONE",
  VANQUISHER = "VANQUISHER",
  OUTSIDER = "OUTSIDER",
  GLUTTON = "GLUTTON",
  STARGAZER = "STARGAZER",
  BLOODY = "BLOODY",
  ETERNAL = "ETERNAL"
}

export interface IBoardEvent {
  simulationId: string
  type: BoardEvent
  x: number
  y: number
}
