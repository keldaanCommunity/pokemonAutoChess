import {ArraySchema, MapSchema, SetSchema, CollectionSchema} from '@colyseus/schema'
import board from '../core/board'
import Dps from '../core/dps'
import DpsHeal from '../core/dps-heal'
import BattleResult from '../models/colyseus-models/battle-result'
import Count from '../models/colyseus-models/count'
import Status from '../models/colyseus-models/status'
import ExperienceManager from '../models/colyseus-models/experience-manager'
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info'
import LobbyUser from '../models/colyseus-models/lobby-user'
import Message from '../models/colyseus-models/message'
import Synergies from '../models/colyseus-models/synergies'
import { AttackType, Orientation, PokemonActionState, Rarity } from './enum/Game'
import { Effect } from './enum/Effect'
import { Ability } from './enum/Ability'
import { Synergy } from './enum/Synergy'

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
    types: Synergy[]
    rarity: Rarity
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
    attackType: AttackType
    atk: number
    hp: number
    range: number
    stars: number
    maxMana: number
    skill: Ability
    items: SetSchema<string>
    author: string,
    fossilTimer: number
}

export interface ISynergies {  
    syns: MapSchema<number>
    
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

export function instanceofPokemonEntity(obj: IPokemon | IPokemonEntity){
    return 'mana' in obj;
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
  index: number
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
  attackSprite: string
  sheet: string
  rarity: Rarity
  name: string
  effects: Effect[]
  items: SetSchema<string>
  types: Synergy[]
  stars: number
  skill: Ability
  status: Status
  count: Count
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

export interface IPreparationMetadata {
    name: string,
    type: string
}
  