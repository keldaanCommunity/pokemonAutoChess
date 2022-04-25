import {ArraySchema, MapSchema, SetSchema, CollectionSchema} from '@colyseus/schema'
import board from '../core/board'
import Dps from '../core/dps'
import DpsHeal from '../core/dps-heal'
import Count from '../models/colyseus-models/count'
import Status from '../models/colyseus-models/status'
import ExperienceManager from '../models/colyseus-models/experience-manager'
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info'
import LobbyUser from '../models/colyseus-models/lobby-user'
import Message from '../models/colyseus-models/message'
import Synergies from '../models/colyseus-models/synergies'
import PokemonCollection from '../models/colyseus-models/pokemon-collection'
import { AttackType, Orientation, PokemonActionState, Rarity } from './enum/Game'
import { Effect } from './enum/Effect'
import { Ability } from './enum/Ability'
import { Synergy } from './enum/Synergy'
import HistoryItem from '../models/colyseus-models/history-item'

export enum Transfer {
    DRAG_DROP = 'DRAG_DROP',
    DRAG_DROP_COMBINE = 'DRAG_DROP_COMBINE',
    DRAG_DROP_ITEM = 'DRAG_DROP_ITEM',
    SELL_DROP = 'SELL_DROP'
}

export enum ModalMode {
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT'
}

export enum ReadWriteMode {
    WRITE = 'WRITE',
    ERASE = 'ERASE'
}

export interface ICreditNames {
    Contact: string[],
    Discord: string[],
    Name: string[]
}

export interface IMessage {
    name: string
    payload: string
    avatar: string
    time: number
}

export interface IClient {
    auth?:{
        uid: string
    }
}

export interface IDragDropMessage{
    x: number
    y: number
    id: string
}

export interface IDragDropItemMessage{
    x: number
    y: number
    id: string
    bypass?: boolean
}

export interface IDragDropCombineMessage{
    itemA: string
    itemB: string
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
    history: ArraySchema<HistoryItem>
    pokemonCollection: PokemonCollection
}
export interface IPokemon {
    id: string
    name: string
    types: Synergy[]
    rarity: Rarity
    index: string
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
    fossilTimer: number
    shiny: boolean
    emotion: Emotion
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
  attackSprite: string
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
  shiny: boolean
  emotion: Emotion
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

export const EmotionCost: {[key in Emotion] : number} = {
    [Emotion.NORMAL] : 50,
    [Emotion.HAPPY] : 100,
    [Emotion.PAIN] : 110,
    [Emotion.ANGRY] : 120,
    [Emotion.WORRIED] : 130,
    [Emotion.SAD] : 140,
    [Emotion.CRYING] : 150,
    [Emotion.SHOUTING] : 160,
    [Emotion.TEARY_EYED] : 170,
    [Emotion.DETERMINED] : 180,
    [Emotion.JOYOUS] : 190,
    [Emotion.INSPIRED] : 200,
    [Emotion.SURPRISED] : 210,
    [Emotion.DIZZY] : 220,
    [Emotion.SPECIAL0] : 230,
    [Emotion.SPECIAL1] : 240,
    [Emotion.SIGH] : 250,
    [Emotion.STUNNED] : 260,
    [Emotion.SPECIAL2] : 270,
    [Emotion.SPECIAL3] : 280
}