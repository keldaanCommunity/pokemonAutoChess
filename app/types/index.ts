import { ArraySchema, MapSchema, Schema, SetSchema } from "@colyseus/schema"
import type { Board } from "../core/board"
import Dps from "../core/dps"
import { Effect as EffectClass } from "../core/effects/effect"
import { EvolutionRule } from "../core/evolution-rules"
import { FlowerPot } from "../core/flower-pots"
import Count from "../models/colyseus-models/count"
import ExperienceManager from "../models/colyseus-models/experience-manager"
import { IPokemonRecord } from "../models/colyseus-models/game-record"
import HistoryItem from "../models/colyseus-models/history-item"
import Message from "../models/colyseus-models/message"
import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { PokemonCustoms } from "../models/colyseus-models/pokemon-customs"
import Status from "../models/colyseus-models/status"
import Synergies from "../models/colyseus-models/synergies"
import { TournamentSchema } from "../models/colyseus-models/tournament"
import { Effects } from "../models/effects"
import GameRoom from "../rooms/game-room"
import { ILeaderboardInfo } from "../types/interfaces/LeaderboardInfo"
import { AttackSprite } from "./Animation"
import { Ability } from "./enum/Ability"
import { DungeonPMDO } from "./enum/Dungeon"
import { BoardEffect, EffectEnum } from "./enum/Effect"
import { Emotion } from "./enum/Emotion"
import {
  GameMode,
  Orientation,
  PokemonActionState,
  Rarity,
  Stat,
  Team
} from "./enum/Game"
import { Item } from "./enum/Item"
import { Passive } from "./enum/Passive"
import { Pkm, PkmProposition } from "./enum/Pokemon"
import { Synergy } from "./enum/Synergy"
import { Weather } from "./enum/Weather"

export * from "./enum/Emotion"
export * from "./enum/Item"

export const CDN_URL =
  "https://raw.githubusercontent.com/keldaanCommunity/SpriteCollab/master"

export type PkmCustom = { shiny?: boolean; emotion?: Emotion }
export interface PkmWithCustom extends PkmCustom {
  name: Pkm
}

export enum Role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  BASIC = "BASIC",
  BOT = "BOT",
  BOT_MANAGER = "BOT_MANAGER"
}

export enum Transfer {
  DRAG_DROP = "DRAG_DROP",
  DRAG_DROP_COMBINE = "DRAG_DROP_COMBINE",
  DRAG_DROP_ITEM = "DRAG_DROP_ITEM",
  SWITCH_BENCH_AND_BOARD = "SWITCH_BENCH_AND_BOARD",
  SELL_POKEMON = "SELL_POKEMON",
  REMOVE_FROM_SHOP = "REMOVE_FROM_SHOP",
  CHANGE_SELECTED_EMOTION = "CHANGE_SELECTED_EMOTION",
  NEW_MESSAGE = "NEW_MESSAGE",
  SEARCH = "SEARCH",
  CHANGE_NAME = "CHANGE_NAME",
  CHANGE_AVATAR = "CHANGE_AVATAR",
  REQUEST_BOT_MONITOR = "REQUEST_BOT_MONITOR",
  OPEN_BOOSTER = "OPEN_BOOSTER",
  BUY_BOOSTER = "BUY_BOOSTER",
  ADD_BOT = "ADD_BOT",
  REMOVE_BOT = "REMOVE_BOT",
  TOGGLE_READY = "TOGGLE_READY",
  CHANGE_NO_ELO = "CHANGE_NO_ELO",
  REFRESH = "REFRESH",
  SPECTATE = "SPECTATE",
  LOCK = "LOCK",
  LEVEL_UP = "LEVEL_UP",
  SHOP = "SHOP",
  ITEM = "ITEM",
  COOK = "COOK",
  DIG = "DIG",
  GAME_START = "GAME_START",
  GAME_START_REQUEST = "GAME_START_REQUEST",
  GAME_END = "GAME_END",
  CHANGE_ROOM_NAME = "CHANGE_ROOM_NAME",
  CHANGE_ROOM_PASSWORD = "CHANGE_ROOM_PASSWORD",
  CHANGE_ROOM_RANKS = "CHANGE_ROOM_RANKS",
  CHANGE_SPECIAL_RULE = "CHANGE_SPECIAL_RULE",
  BUY_EMOTION = "BUY_EMOTION",
  BOOSTER_CONTENT = "BOOSTER_CONTENT",
  USER = "USER",
  DRAG_DROP_CANCEL = "DRAG_DROP_CANCEL",
  SHOW_EMOTE = "SHOW_EMOTE",
  FINAL_RANK = "FINAL_RANK",
  SEARCH_BY_ID = "SEARCH_BY_ID",
  SUGGESTIONS = "SUGGESTIONS",
  SET_TITLE = "SET_TITLE",
  REMOVE_MESSAGE = "REMOVE_MESSAGE",
  NEW_TOURNAMENT = "NEW_TOURNAMENT",
  DELETE_TOURNAMENT = "DELETE_TOURNAMENT",
  REMAKE_TOURNAMENT_LOBBY = "REMAKE_TOURNAMENT_LOBBY",
  PARTICIPATE_TOURNAMENT = "PARTICIPATE_TOURNAMENT",
  GIVE_BOOSTER = "GIVE_BOOSTER",
  SET_ROLE = "SET_ROLE",
  GIVE_TITLE = "GIVE_TITLE",
  POKEMON_PROPOSITION = "POKEMON_PROPOSITION",
  KICK = "KICK",
  DELETE_ROOM = "DELETE_ROOM",
  BAN = "BAN",
  BANNED = "BANNED",
  POKEMON_DAMAGE = "POKEMON_DAMAGE",
  POKEMON_HEAL = "POKEMON_HEAL",
  WANDERER = "WANDERER",
  WANDERER_CLICKED = "WANDERER_CLICKED",
  VECTOR = "VECTOR",
  LOADING_PROGRESS = "LOADING_PROGRESS",
  LOADING_COMPLETE = "LOADING_COMPLETE",
  PLAYER_INCOME = "PLAYER_INCOME",
  PLAYER_DAMAGE = "PLAYER_DAMAGE",
  ROOMS = "ROOMS",
  REQUEST_ROOM = "REQUEST_ROOM",
  ADD_ROOM = "ADD_ROOM",
  REMOVE_ROOM = "REMOVE_ROOM",
  UNBAN = "UNBAN",
  BOARD_EVENT = "BOARD_EVENT",
  CLEAR_BOARD = "CLEAR_BOARD",
  SIMULATION_STOP = "SIMULATION_STOP",
  ABILITY = "ABILITY",
  SELECT_LANGUAGE = "SELECT_LANGUAGE",
  USER_PROFILE = "USER_PROFILE",
  PICK_BERRY = "PICK_BERRY",
  PRELOAD_MAPS = "PRELOAD_MAPS",
  NPC_DIALOG = "NPC_DIALOG",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  HEAP_SNAPSHOT = "HEAP_SNAPSHOT",
  RECONNECT_PROMPT = "RECONNECT_PROMPT",
  OVERWRITE_BOARD = "OVERWRITE_BOARD"
}

export enum ReadWriteMode {
  WRITE = "WRITE",
  ERASE = "ERASE"
}

export interface ICreditName {
  contact: string
  discord: string
  name: string
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
  zone: string
  index: number
  id: Item
}

export interface IDragDropCombineMessage {
  itemA: Item
  itemB: Item
}

export interface ICustomLobbyState extends Schema {
  ccu: number
  messages: ArraySchema<Message>
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardInfo[]
  levelLeaderboard: ILeaderboardInfo[]
  tournaments: ArraySchema<TournamentSchema>
  clients: number
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
  games: number
  name: string
  id: string
  rank: number
  avatar: string
  title: string
  role: Role
  pokemons: IPokemonRecord[] | ArraySchema<IPokemonRecord>
  synergies:
    | Array<{ name: Synergy; value: number }>
    | ArraySchema<{ name: Synergy; value: number }>
}

export interface IAfterGamePlayer extends ISimplePlayer {
  moneyEarned: number
  playerDamageDealt: number
  rerollCount: number
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
  portalId: string
  itemId: string
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
  portalId: string
}

export interface IPlayer {
  id: string
  name: string
  avatar: string
  board: MapSchema<Pokemon>
  shop: ArraySchema<Pkm>
  simulationId: string
  team: Team
  experienceManager: ExperienceManager
  synergies: Synergies
  money: number
  life: number
  shopLocked: boolean
  shopFreeRolls: number
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
  pokemonCustoms: PokemonCustoms
  title: Title | ""
  role: Role
  itemsProposition: ArraySchema<Item>
  pokemonsProposition: ArraySchema<PkmProposition>
  loadingProgress: number
  berryTreesStages: number[]
  flowerPots: Pokemon[]
  flowerPotsSpawnOrder: FlowerPot[]
  mulch: number
  mulchCap: number
  effects: Effects
  isBot: boolean
  map: DungeonPMDO | "town"
  regionalPokemons: ArraySchema<Pkm>
  commonRegionalPool: Pkm[]
  uncommonRegionalPool: Pkm[]
  rareRegionalPool: Pkm[]
  epicRegionalPool: Pkm[]
  ultraRegionalPool: Pkm[]
  opponents: Map<string, number>
  ghost: boolean
  rerollCount: number
  totalMoneyEarned: number
  totalPlayerDamageDealt: number
  wildChance: number
  eggChance: number
  goldenEggChance: number
  cellBattery: number
  lightX: number
  lightY: number
}

export interface IPokemon {
  id: string
  name: Pkm
  types: SetSchema<Synergy>
  rarity: Rarity
  index: string
  evolution: Pkm
  evolutions: Pkm[]
  evolutionRule: EvolutionRule
  positionX: number
  positionY: number
  speed: number
  def: number
  speDef: number
  atk: number
  hp: number
  maxHP: number
  shield: number
  range: number
  stars: number
  pp: number
  maxPP: number
  luck: number
  ap: number
  critChance: number
  critPower: number
  stacks: number
  stacksRequired: number
  skill: Ability
  passive: Passive
  items: SetSchema<Item>
  dishes: SetSchema<Item>
  tm: Ability | null
  shiny: boolean
  emotion: Emotion
  additional: boolean
  regional: boolean
  action: PokemonActionState
  canBePlaced: boolean
  canBeCloned: boolean
  canHoldItems: boolean
  canEat: boolean
  deathCount: number
  killCount: number
  readonly hasEvolution: boolean
  supercharged: boolean
}

export interface IExperienceManager {
  level: number
  experience: number
  expNeeded: number
  maxLevel: number
}

export interface ISimulation {
  room: GameRoom
  board: Board
  id: string
  weather: Weather
  bluePlayer: IPlayer | undefined
  redPlayer: IPlayer | undefined
  blueEffects: Set<EffectEnum>
  redEffects: Set<EffectEnum>
  blueTeam: MapSchema<IPokemonEntity>
  redTeam: MapSchema<IPokemonEntity>
  blueDpsMeter: MapSchema<Dps>
  redDpsMeter: MapSchema<Dps>
  bluePlayerId: string
  redPlayerId: string
}

export interface ISimulationCommand {
  delay: number
  executed: boolean
  update(dt: number): void
  execute(): void
}

export interface IDps {
  update(
    physicalDamage: number,
    specialDamage: number,
    trueDamage: number,
    physicalDamageReduced: number,
    specialDamageReduced: number,
    shieldDamageTaken: number,
    heal: number,
    shield: number
  )
  id: string
  name: string
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  physicalDamageReduced: number
  specialDamageReduced: number
  shieldDamageTaken: number
  heal: number
  shield: number
}

export interface IPokemonEntity {
  simulation: ISimulation
  refToBoardPokemon: IPokemon
  get player(): IPlayer | undefined
  broadcastAbility(options: any): void
  applyStat(stat: Stat, value: number): void
  addAbilityPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent?: boolean
  ): void
  addLuck(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent?: boolean
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
    crit: boolean,
    permanent?: boolean
  ): void
  addSpeed(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent?: boolean
  ): void
  addMaxHP(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent?: boolean
  ): void
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
    crit: boolean,
    permanent?: boolean
  ): void
  addSpecialDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent?: boolean
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
  addDodgeChance(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ): void
  addItem(item: Item, permanent?: boolean): void
  removeItem(item: Item, permanent?: boolean): void
  update(dt: number, board: Board, player: Player | undefined): void
  skydiveTo(x: number, y: number, board: Board): void
  toIdleState(): void
  toMovingState(): void
  isTargettableBy(
    attacker: IPokemonEntity,
    targetEnemies?: boolean,
    targetAllies?: boolean
  ): boolean
  setTarget(target: IPokemonEntity | null): void
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  physicalDamageReduced: number
  specialDamageReduced: number
  shieldDamageTaken: number
  shieldDone: number
  positionX: number
  positionY: number
  action: PokemonActionState
  index: string
  id: string
  orientation: Orientation
  critChance: number
  maxHP: number
  pp: number
  maxPP: number
  atk: number
  def: number
  speDef: number
  luck: number
  baseTeam: Team
  baseAtk: number
  baseDef: number
  baseSpeDef: number
  hp: number
  shield: number
  team: number
  range: number
  speed: number
  targetX: number
  targetY: number
  targetEntityId: string
  rarity: Rarity
  name: Pkm
  effects: SetSchema<EffectEnum>
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
  stacks: number
  stacksRequired: number
  isSpawn: boolean
  commands: ISimulationCommand[]
  effectsSet: Set<EffectClass>
  inSpotlight: boolean
}

export interface IStatus {
  burn: boolean
  silence: boolean
  fatigue: boolean
  poisonStacks: number
  freeze: boolean
  protect: boolean
  sleep: boolean
  confusion: boolean
  wound: boolean
  resurrection: boolean
  resurrecting: boolean
  paralysis: boolean
  pokerus: boolean
  locked: boolean
  possessed: boolean
  blinded: boolean
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
  fieldCount: number
  fairyCritCount: number
  attackCount: number
  fightingBlockCount: number
  dodgeCount: number
  starDustCount: number
  tripleAttackCount: number
  staticHolderCount: number
  muscleBandCount: number
  machRibbonCount: number
  spellBlockedCount: number
  manaBurnCount: number
  moneyCount: number
}

export interface IPreparationMetadata {
  name: string
  ownerName: string
  passwordProtected: boolean
  noElo: boolean
  type: "preparation"
  gameStartedAt: string | null
  minRank: string | null
  maxRank: string | null
  gameMode: GameMode
  whitelist: string[]
  blacklist: string[]
  playersInfo: string[]
  tournamentId: string | null
  bracketId: string | null
}

export interface IGameMetadata {
  name: string
  ownerName: string
  gameMode: GameMode
  playerIds: string[]
  playersInfo: string[]
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
  banned?: boolean
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
  SURFER = "SURFER",
  POKEMON_RANGER = "POKEMON_RANGER",
  CAMPER = "CAMPER",
  RIVAL = "RIVAL",
  SKIER = "SKIER",
  POKEFAN = "POKEFAN",
  HEX_MANIAC = "HEX_MANIAC",
  MUSICIAN = "MUSICIAN",
  BABYSITTER = "BABYSITTER",
  ALCHEMIST = "ALCHEMIST",
  BERSERKER = "BERSERKER",
  BLOB = "BLOB",
  CHEF = "CHEF",
  HARLEQUIN = "HARLEQUIN",
  TACTICIAN = "TACTICIAN",
  STRATEGIST = "STRATEGIST",
  NURSE = "NURSE",
  GARDIAN = "GARDIAN",
  COLLECTOR = "COLLECTOR",
  DUKE = "DUKE",
  DUCHESS = "DUCHESS",
  CHAMPION = "CHAMPION",
  ELITE_FOUR_MEMBER = "ELITE_FOUR_MEMBER",
  GYM_LEADER = "GYM_LEADER",
  GYM_CHALLENGER = "GYM_CHALLENGER",
  GYM_TRAINER = "GYM_TRAINER",
  ACE_TRAINER = "ACE_TRAINER",
  TYRANT = "TYRANT",
  SURVIVOR = "SURVIVOR",
  GAMBLER = "GAMBLER",
  NATURAL = "NATURAL",
  BOT_BUILDER = "BOT_BUILDER",
  SHINY_SEEKER = "SHINY_SEEKER",
  ARCHEOLOGIST = "ARCHEOLOGIST",
  PRIMAL = "PRIMAL",
  DENTIST = "DENTIST",
  FISHERMAN = "FISHERMAN",
  MOLE = "MOLE",
  BLOSSOMED = "BLOSSOMED",
  SIREN = "SIREN",
  FEARSOME = "FEARSOME",
  GOLDEN = "GOLDEN",
  LUCKY = "LUCKY",
  GIANT = "GIANT",
  DECURION = "DECURION",
  LEGEND = "LEGEND",
  CHOSEN_ONE = "CHOSEN_ONE",
  ANNIHILATOR = "ANNIHILATOR",
  VANQUISHER = "VANQUISHER",
  OUTSIDER = "OUTSIDER",
  GLUTTON = "GLUTTON",
  PICNICKER = "PICNICKER",
  STARGAZER = "STARGAZER",
  BLOODY = "BLOODY",
  ETERNAL = "ETERNAL",
  RUNNER = "RUNNER",
  FINISHER = "FINISHER",
  VICTORIOUS = "VICTORIOUS",
  AQUARIOPHILE = "AQUARIOPHILE",
  POFFIN_MASTER = "POFFIN_MASTER",
  TOP_GUN = "TOP_GUN",
  SCOUT = "SCOUT"
}

export interface IBoardEvent {
  simulationId: string
  effect: BoardEffect
  x: number
  y: number
}

export interface IAttackEvent {
  simulationId: string
  pokemonId: string
  targetX: number
  targetY: number
  travelTime: number
  delay: number
}

export { AttackSprite }
