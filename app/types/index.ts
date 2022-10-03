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
import { Item } from './enum/Item'
import { Pkm } from './enum/Pokemon'
import { Pokemon } from '../models/colyseus-models/pokemon'


export const CDN_PORTRAIT_URL = 'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/'

export const CDN_URL = 'https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master'

export type PrecomputedTypePokemon = {
    [key in Synergy] : {
        pokemons: Pkm[],
        mythicalPokemons: Pkm[]
    }
}

export type PrecomputedRaritPokemonyAll = {
    [key in Rarity]: Pkm[]
}

export type PrecomputedTypePokemonAll = {
    [key in Synergy]: Pkm[]
}

export type Langage = {
    eng: string,
    esp: string,
    prt: string,
    fra: string
}


export enum Transfer {
    DRAG_DROP = 'DRAG_DROP',
    DRAG_DROP_COMBINE = 'DRAG_DROP_COMBINE',
    DRAG_DROP_ITEM = 'DRAG_DROP_ITEM',
    SELL_DROP = 'SELL_DROP',
    CHANGE_SELECTED_EMOTION = 'CHANGE_SELECTED_EMOTION',
    NEW_MESSAGE = 'NEW_MESSAGE',
    BOT_CREATION = 'BOT_CREATION',
    SEARCH = 'SEARH',
    CHANGE_NAME = 'CHANGE_NAME',
    CHANGE_AVATAR = 'CHANGE_AVATAR',
    REQUEST_META = 'REQUEST_META',
    REQUEST_META_ITEMS = 'REQUEST_META_ITEMS',
    REQUEST_BOT_DATA = 'REQUEST_BOT_DATA',
    REQUEST_BOT_MONITOR = 'REQUEST_BOT_MONITOR',
    REQUEST_BOT_LIST = 'REQUEST_BOT_LIST',
    OPEN_BOOSTER = 'OPEN_BOOSTER',
    ADD_BOT = 'ADD_BOT',
    REMOVE_BOT = 'REMOVE_BOT',
    TOGGLE_READY = 'TOGGLE_READY',
    REQUEST_TILEMAP = 'REQUEST_TILEMAP',
    REFRESH = 'REFRESH',
    LOCK = 'LOCK',
    LEVEL_UP = 'LEVEL_UP',
    SHOP = 'SHOP',
    ITEM = 'ITEM',
    GAME_START = 'GAME_START',
    CHANGE_ROOM_NAME = 'CHANGE_ROOM_NAME',
    BUY_EMOTION = 'BUY_EMOTION',
    BOOSTER_CONTENT = 'BOOSTER_CONTENT',
    PASTEBIN_URL = 'PASTEBIN_URL',
    USER = 'USER',
    MESSAGES = 'MESSAGES',
    DRAG_DROP_FAILED = 'DRAG_DROP_FAILED',
    BROADCAST_EMOTE = 'BROADCAST_EMOTE',
    BROADCAST_INFO = 'BROADCAST_INFO',
    REQUEST_META_POKEMONS = 'REQUEST_META_POKEMONS',
    SEARCH_BY_ID = 'SEARCH_BY_ID',
    SUGGESTIONS = 'SUGGESTIONS'
}

export enum AttackSprite {
    WATER_MELEE = 'WATER/melee',
    ROCK_MELEE = 'ROCK/melee',
    NORMAL_MELEE = 'NORMAL/melee',
    ELECTRIC_MELEE = 'ELECTRIC/melee',
    DRAGON_MELEE = 'DRAGON/melee',
    FIGHTING_RANGE = 'FIGHTING/range',
    DRAGON_RANGE = 'DRAGON/range',
    FIGHTING_MELEE = 'FIGHTING/melee',
    FIRE_MELEE = 'FIRE/melee',
    PSYCHIC_RANGE = 'PSYCHIC/range',
    FIRE_RANGE = 'FIRE/range',
    GRASS_RANGE = 'GRASS/range',
    WATER_RANGE = 'WATER/range',
    FLYING_RANGE = 'FLYING/range',
    ICE_MELEE = 'ICE/melee',
    GHOST_RANGE = 'GHOST/range',
    FAIRY_RANGE = 'FAIRY/range',
    ELECTRIC_RANGE = 'ELECTRIC/range',
    POISON_MELEE = 'POISON/melee',
    GRASS_MELEE = 'GRASS/melee',
    FAIRY_MELEE = 'FAIRY/melee',
    POISON_RANGE = 'POISON/range',
    BUG_MELEE = 'BUG/melee',
    FLYING_MELEE = 'FLYING/melee'
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
    id: Item
    bypass?: boolean
}

export interface IDragDropCombineMessage{
    itemA: Item
    itemB: Item
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
    return 'mana' in obj
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
    name: string,
    type: string
}

export enum Emotion {
    NORMAL = 'Normal',
    HAPPY = 'Happy',
    PAIN = 'Pain',
    ANGRY = 'Angry',
    WORRIED = 'Worried',
    SAD = 'Sad',
    CRYING = 'Crying',
    SHOUTING = 'Shouting',
    TEARY_EYED = 'Teary-Eyed',
    DETERMINED = 'Determined',
    JOYOUS = 'Joyous',
    INSPIRED = 'Inspired',
    SURPRISED = 'Surprised',
    DIZZY = 'Dizzy',
    SPECIAL0 = 'Special0',
    SPECIAL1 = 'Special1',
    SIGH = 'Sigh',
    STUNNED = 'Stunned',
    SPECIAL2 = 'Special2',
    SPECIAL3 = 'Special3'
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

export interface ISuggestionUser{
    name: string
    elo: number
    level: number
    id: string
    avatar: string
}