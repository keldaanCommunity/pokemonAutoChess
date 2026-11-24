import type { MapSchema } from "@colyseus/schema"
import type Player from "../models/colyseus-models/player"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import type GameState from "../rooms/states/game-state"
import type { IPlayer, IPokemon } from "."
import type { Item } from "./enum/Item"
import type { Pkm } from "./enum/Pokemon"

export enum EvolutionRuleType {
  COUNT = "count",
  ITEM = "item",
  STATE = "state",
  MONEY = "money",
  PLACEMENT = "placement",
  HATCH = "hatch",
  STACK = "stack",
  MEGA = "mega"
}

export type CountEvolutionContext = {
  type: EvolutionRuleType.COUNT
  state: GameState
  stageLevel: number
}

export type ItemEvolutionContext = {
  type: EvolutionRuleType.ITEM
  item: Item
}

export type StateEvolutionContext = {
  type: EvolutionRuleType.STATE
  state: GameState
}

export type MoneyEvolutionContext = {
  type: EvolutionRuleType.MONEY
  money: number
}

export type PlacementEvolutionContext = {
  type: EvolutionRuleType.PLACEMENT
  board: MapSchema<Pokemon>
}

export type HatchEvolutionContext = {
  type: EvolutionRuleType.HATCH
}

export type StackEvolutionContext = {
  type: EvolutionRuleType.STACK
}

export type MegaEvolutionContext = {
  type: EvolutionRuleType.MEGA
  megaStoneUsed: boolean
}

export type EvolutionContextMap = {
  [EvolutionRuleType.COUNT]: CountEvolutionContext
  [EvolutionRuleType.ITEM]: ItemEvolutionContext
  [EvolutionRuleType.STATE]: StateEvolutionContext
  [EvolutionRuleType.MONEY]: MoneyEvolutionContext
  [EvolutionRuleType.PLACEMENT]: PlacementEvolutionContext
  [EvolutionRuleType.HATCH]: HatchEvolutionContext
  [EvolutionRuleType.STACK]: StackEvolutionContext
  [EvolutionRuleType.MEGA]: MegaEvolutionContext
}

export type EvolutionContext = EvolutionContextMap[EvolutionRuleType]

export type DivergentEvolution<K extends EvolutionRuleType> = (
  pokemon: IPokemon,
  player: Player,
  context: EvolutionContextMap[K]
) => Pkm

interface EvolutionRuleCommon<K extends EvolutionRuleType> {
  type: K
  divergentEvolution?: DivergentEvolution<K>
}

export type CountEvolutionRule =
  EvolutionRuleCommon<EvolutionRuleType.COUNT> & {
    type: EvolutionRuleType.COUNT
    numberRequired: number
  }

export type ItemEvolutionRule = EvolutionRuleCommon<EvolutionRuleType.ITEM> & {
  type: EvolutionRuleType.ITEM
  itemsTriggeringEvolution: Item[]
}
export type StateEvolutionRule =
  EvolutionRuleCommon<EvolutionRuleType.STATE> & {
    type: EvolutionRuleType.STATE
    condition: (pokemon: IPokemon, player: IPlayer, state: GameState) => boolean
  }

export type PlacementEvolutionRule =
  EvolutionRuleCommon<EvolutionRuleType.PLACEMENT> & {
    type: EvolutionRuleType.PLACEMENT
    condition: (
      pokemon: Pokemon,
      player: IPlayer,
      board: MapSchema<Pokemon>
    ) => boolean
  }

export type MoneyEvolutionRule =
  EvolutionRuleCommon<EvolutionRuleType.MONEY> & {
    type: EvolutionRuleType.MONEY
    moneyRequired: number
  }

export type HatchEvolutionRule =
  EvolutionRuleCommon<EvolutionRuleType.HATCH> & {
    type: EvolutionRuleType.HATCH
  }

export type StackEvolutionRule =
  EvolutionRuleCommon<EvolutionRuleType.STACK> & {
    type: EvolutionRuleType.STACK
  }

export type MegaEvolutionRule = EvolutionRuleCommon<EvolutionRuleType.MEGA> & {
  type: EvolutionRuleType.MEGA
}

export type EvolutionRule =
  | CountEvolutionRule
  | ItemEvolutionRule
  | StateEvolutionRule
  | PlacementEvolutionRule
  | MoneyEvolutionRule
  | HatchEvolutionRule
  | StackEvolutionRule
  | MegaEvolutionRule
