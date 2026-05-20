import type { IPokemon } from "../../types"
import type { StackEvolutionRule } from "../../types/EvolutionRules"
import { ConditionEvolutionHandler } from "./condition-evolution-handler"

export class StackEvolutionHandler extends ConditionEvolutionHandler {
  constructor(evolutionRule: StackEvolutionRule) {
    super({
      ...evolutionRule,
      condition: (pokemon: IPokemon) => {
        return pokemon.stacks >= pokemon.stacksRequired
      }
    })
  }
}
