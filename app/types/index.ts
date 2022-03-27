import {ArraySchema, MapSchema, SetSchema, CollectionSchema} from '@colyseus/schema'
import board from '../core/board'
import BattleResult from '../models/colyseus-models/battle-result'
import ExperienceManager from '../models/colyseus-models/experience-manager'
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info'
import LobbyUser from '../models/colyseus-models/lobby-user'
import Message from '../models/colyseus-models/message'
import Synergies from '../models/colyseus-models/synergies'

export interface IMessage {
    name: string
    payload: string
    avatar: string
    time: number
}

export interface ICustomLobbyState {
    messages : ArraySchema<Message>
    users : MapSchema<LobbyUser>
    leaderboard : ArraySchema<LeaderboardInfo>
    botLeaderboard : ArraySchema<LeaderboardInfo>
}

export interface IGameState {
    afterGameId: string
    roundTime: number
    phase: string
    players: MapSchema<IPlayer>
    stageLevel: number
    mapName: string
}
export interface IPlayer {
    id: string
    name: string
    avatar: string
    board: MapSchema<IPokemon>
    shop: string[]
    simulation: ISimulation
    experienceManager: ExperienceManager
    synergies: Synergies
    itemsProposition: string[]
    money: number
    life: number
    shopLocked: boolean
    streak: number
    interest: number
    opponentName: string
    opponentAvatar: string
    boardSize: number
    items: CollectionSchema<string>
    rank: number
    exp: number
    elo: number
    alive: boolean
    tileset: string
    history: ArraySchema<BattleResult>
}
export interface IPokemon {
    id: string
    name: string
    types: string[]
    rarity: string
    sheet: string
    index: number
    evolution:string
    positionX: number
    positionY: number
    cost: number
    attackSprite: string
    atkSpeed: number
    def: number
    speDef: number
    attackType: string
    atk: number
    hp: number
    range: number
    stars: number
    maxMana: number
    skill: string
    items: SetSchema<string>
    author: string,
    fossilTimer: number
}

export interface ISynergies {
    NORMAL: number;
    GRASS: number;
    FIRE: number;
    WATER: number;
    ELECTRIC: number;
    FIGHTING: number;
    PSYCHIC: number;
    DARK: number;
    METAL: number;
    GROUND: number;
    POISON: number;
    DRAGON: number;
    FIELD: number;
    MONSTER: number;
    HUMAN: number;
    AQUATIC: number;
    BUG: number;
    FLYING: number;
    FLORA: number;
    MINERAL: number;
    GHOST: number;
    FAIRY: number;
    ICE: number;
    FOSSIL: number;
    SOUND: number;
  }

export interface IExperienceManager {
    level: number
    experience: number
    expNeeded: number
    maxLevel: number
}

export interface ISimulation {
    climate: string
    blueEffects: string[]
    redEffects: string[]
    blueTeam: MapSchema<IPokemonEntity>
    redTeam: MapSchema<IPokemonEntity>
    blueDpsMeter: MapSchema<IDps>
    redDpsMeter: MapSchema<IDps>
    blueHealDpsMeter: MapSchema<IDpsHeal>
    redHealDpsMeter: MapSchema<IDpsHeal>
}

export interface IDps {
    changeDamage(physicalDamage: number, specialDamage: number, trueDamage: number)
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

export interface IPokemonEntity {
  handleShield(shieldBonus: number, pokemon: IPokemonEntity)
  update(dt: number, board: board, climate: string)
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  shieldDone: number
  positionX: number
  positionY: number
  action: string
  index: number
  id: string
  orientation: string
  critChance: number
  hp: number
  mana: number
  maxMana: number
  atk: number
  def: number
  speDef: number
  attackType: string
  life: number
  shield: number
  team: number
  range: number
  atkSpeed: number
  atkSpeedBonus: number
  targetX: number
  targetY: number
  attackSprite: string
  sheet: string
  rarity: string
  name: string
  effects: string[]
  items: SetSchema<string>
  types: string[]
  stars: number
  skill: string
  status: IStatus
  count: ICount
  critDamage: number
  spellDamage: number
  healDone: number
}

export interface IStatus {
    triggerRuneProtect()
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
}
