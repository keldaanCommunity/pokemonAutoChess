import type { MapSchema } from "@colyseus/schema"
import type Player from "../models/colyseus-models/player"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import type GameState from "../rooms/states/game-state"
import type { IPlayer, IPokemon } from "."
import type { Item } from "./enum/Item"
import type { Pkm } from "./enum/Pokemon"

export enum EvolutionType {
  COUNT = "count", // evolves when having multiple copies of the unit
  ITEM = "item", // evolves when given an item
  STATE = "state", // evolves based on a condition of the game state
  MONEY = "money", // evolves when gaining money
  PLACEMENT = "placement", // evolves based on a condition on the board placement
  HATCH = "hatch", // evolves naturally with hatch condition
  STACK = "stack", // evolves based on a number of stacks reachedd
  MEGA = "mega", // mega evolution with mega key stone
  ONE_TIME_EFFECT = "effect" // various game effects where we specifically want the evolution to always occure but only once
}

export type DivergentEvolution<K extends EvolutionType> = (
  pokemon: IPokemon,
  player: Player,
  context: EvolutionContextMap[K]
) => Pkm

export interface IEvolutionRule<K extends EvolutionType> {
  type: K
  divergentEvolution?: DivergentEvolution<K>
}

export type CountEvolutionRule = IEvolutionRule<EvolutionType.COUNT> & {
  numberRequired: number
}

export type ItemEvolutionRule = IEvolutionRule<EvolutionType.ITEM> & {
  itemsTriggeringEvolution: Item[]
}
export type StateEvolutionRule = IEvolutionRule<EvolutionType.STATE> & {
  condition: (pokemon: IPokemon, player: IPlayer, state: GameState) => boolean
}

export type PlacementEvolutionRule = IEvolutionRule<EvolutionType.PLACEMENT> & {
  condition: (
    pokemon: Pokemon,
    player: IPlayer,
    board: MapSchema<Pokemon>
  ) => boolean
}

export type MoneyEvolutionRule = IEvolutionRule<EvolutionType.MONEY> & {
  moneyRequired: number
}

export type HatchEvolutionRule = IEvolutionRule<EvolutionType.HATCH>
export type StackEvolutionRule = IEvolutionRule<EvolutionType.STACK>
export type MegaEvolutionRule = IEvolutionRule<EvolutionType.MEGA>

export type EvolutionRule =
  | CountEvolutionRule
  | ItemEvolutionRule
  | StateEvolutionRule
  | PlacementEvolutionRule
  | MoneyEvolutionRule
  | HatchEvolutionRule
  | StackEvolutionRule
  | MegaEvolutionRule

export type EvolutionRuleMap = {
  [EvolutionType.COUNT]: CountEvolutionRule
  [EvolutionType.ITEM]: ItemEvolutionRule
  [EvolutionType.STATE]: StateEvolutionRule
  [EvolutionType.MONEY]: MoneyEvolutionRule
  [EvolutionType.PLACEMENT]: PlacementEvolutionRule
  [EvolutionType.HATCH]: HatchEvolutionRule
  [EvolutionType.STACK]: StackEvolutionRule
  [EvolutionType.MEGA]: MegaEvolutionRule
  [EvolutionType.ONE_TIME_EFFECT]: IEvolutionRule<EvolutionType.ONE_TIME_EFFECT>
}

interface IEvolutionContext<T extends EvolutionType> {
  type: T
  afterEvolveCheck?: boolean /* true when the evolution is considered immediately after another evolution, for state-based evo rules for example */
}

export type CountEvolutionContext = IEvolutionContext<EvolutionType.COUNT> & {
  /*
  some count-based evolutions have divergent evo rules using state
  but state cannot be passed client side
  and count evolutions are considered client side for portraits for example
  that's why the sate is optional in CountEvolutionContext
  */
  state?: GameState 
  stageLevel: number;
}
export type ItemEvolutionContext = IEvolutionContext<EvolutionType.ITEM> & {
  item: Item
}
export type StateEvolutionContext = IEvolutionContext<EvolutionType.STATE> & {
  state: GameState
}
export type MoneyEvolutionContext = IEvolutionContext<EvolutionType.MONEY> & {
  money: number
}
export type PlacementEvolutionContext =
  IEvolutionContext<EvolutionType.PLACEMENT> & {
    board: MapSchema<Pokemon>
  }
export type HatchEvolutionContext = IEvolutionContext<EvolutionType.HATCH>
export type StackEvolutionContext = IEvolutionContext<EvolutionType.STACK>
export type MegaEvolutionContext = IEvolutionContext<EvolutionType.MEGA> & {
  megaStoneUsed: boolean
}
export type OneTimeEffectEvolutionContext =
  IEvolutionContext<EvolutionType.ONE_TIME_EFFECT>

export type EvolutionContextMap = {
  [EvolutionType.COUNT]: CountEvolutionContext
  [EvolutionType.ITEM]: ItemEvolutionContext
  [EvolutionType.STATE]: StateEvolutionContext
  [EvolutionType.MONEY]: MoneyEvolutionContext
  [EvolutionType.PLACEMENT]: PlacementEvolutionContext
  [EvolutionType.HATCH]: HatchEvolutionContext
  [EvolutionType.STACK]: StackEvolutionContext
  [EvolutionType.MEGA]: MegaEvolutionContext
  [EvolutionType.ONE_TIME_EFFECT]: OneTimeEffectEvolutionContext
}

export type EvolutionContext = EvolutionContextMap[EvolutionType]
