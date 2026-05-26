import type { MapSchema } from "@colyseus/schema"
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
  STACK = "stack"
}

interface EvolutionRuleCommon {
  type: EvolutionRuleType
  divergentEvolution?: DivergentEvolution
}

export type DivergentEvolution<AdditionalArgs extends any[] = any[]> = (
  pokemon: IPokemon,
  player: IPlayer,
  ...additionalArgs: AdditionalArgs
) => Pkm

export type CountEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.COUNT
  numberRequired: number
  divergentEvolution?: DivergentEvolution<[number]>
}

export type ItemEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.ITEM
  itemsTriggeringEvolution: Item[]
  divergentEvolution?: DivergentEvolution<[Item]>
}
export type StateEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.STATE
  condition: (pokemon: IPokemon, player: IPlayer, state: GameState) => boolean
}

export type PlacementEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.PLACEMENT
  condition: (
    pokemon: IPokemon,
    player: IPlayer,
    board: MapSchema<IPokemon>
  ) => boolean
}

export type MoneyEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.MONEY
  moneyRequired: number
}

export type HatchEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.HATCH
}

export type StackEvolutionRule = EvolutionRuleCommon & {
  type: EvolutionRuleType.STACK
}

export type EvolutionRule =
  | CountEvolutionRule
  | ItemEvolutionRule
  | StateEvolutionRule
  | PlacementEvolutionRule
  | MoneyEvolutionRule
  | HatchEvolutionRule
  | StackEvolutionRule
