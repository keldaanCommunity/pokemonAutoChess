import type { IPlayer, IPokemon } from "."
import type { Item } from "./enum/Item"
import type { Pkm } from "./enum/Pokemon"

export type EvolutionRuleType =
  | "count"
  | "item"
  | "condition"
  | "hatch"
  | "stack"

interface EvolutionRuleCommon {
  type: Readonly<EvolutionRuleType>
  divergentEvolution?: DivergentEvolution
}

export type DivergentEvolution<AdditionalArgs extends any[] = any[]> = (
  pokemon: IPokemon,
  player: IPlayer,
  ...additionalArgs: AdditionalArgs
) => Pkm

export type CountEvolutionRule = EvolutionRuleCommon & {
  type: "count"
  numberRequired: number,
  divergentEvolution?: DivergentEvolution<[number]>
}

export type ItemEvolutionRule = EvolutionRuleCommon & {
  type: "item"
  itemsTriggeringEvolution: Item[]
  divergentEvolution?: DivergentEvolution<[Item]>
}
export type ConditionEvolutionRule = EvolutionRuleCommon & {
  type: "condition"
  condition: (pokemon: IPokemon, player: IPlayer, stageLevel: number) => boolean
}

export type HatchEvolutionRule = EvolutionRuleCommon & {
  type: "hatch"
}

export type StackEvolutionRule = EvolutionRuleCommon & {
  type: "stack"
}

export type EvolutionRule =
  | CountEvolutionRule
  | ItemEvolutionRule
  | ConditionEvolutionRule
  | HatchEvolutionRule
  | StackEvolutionRule
