import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type { IPlayer } from "../../types"
import type {
  ConditionEvolutionRule,
  CountEvolutionRule,
  EvolutionRule,
  HatchEvolutionRule,
  ItemEvolutionRule,
  StackEvolutionRule
} from "../../types/EvolutionRules"
import type { Pkm } from "../../types/enum/Pokemon"
import { ConditionEvolutionHandler } from "./condition-evolution-handler"
import { CountEvolutionHandler } from "./count-evolution-handler"
import type { EvolutionHandler } from "./evolution-handler"
import { HatchEvolutionHandler } from "./hatch-evolution-handler"
import { ItemEvolutionHandler } from "./item-evolution-handler"
import { StackEvolutionHandler } from "./stack-evolution-handler"

export const EvolutionManager = {
  getHandler(evolutionRule: EvolutionRule): EvolutionHandler {
    switch (evolutionRule.type) {
      case "item":
        return new ItemEvolutionHandler(evolutionRule as ItemEvolutionRule)
      case "condition":
        return new ConditionEvolutionHandler(
          evolutionRule as ConditionEvolutionRule
        )
      case "hatch":
        return new HatchEvolutionHandler(evolutionRule as HatchEvolutionRule)
      case "stack":
        return new StackEvolutionHandler(evolutionRule as StackEvolutionRule)
      case "count":
      default:
        return new CountEvolutionHandler(evolutionRule as CountEvolutionRule)
    }
  },

  tryEvolve(
    pokemon: Pokemon,
    player: Player,
    stageLevel: number
  ): void | Pokemon {
    const handler = this.getHandler(pokemon.evolutionRule)
    if (handler.canEvolve(pokemon, player, stageLevel)) {
      const pokemonEvolved = handler.evolve(pokemon, player, stageLevel)
      if (pokemon.supercharged) pokemonEvolved.supercharged = true
      handler.afterEvolve(pokemonEvolved, player, stageLevel)
      return pokemonEvolved
    }
  },

  getEvolution(
    pokemon: Pokemon,
    player: IPlayer,
    ...additionalArgs: unknown[]
  ): Pkm {
    if (pokemon.evolutionRule.divergentEvolution) {
      return pokemon.evolutionRule.divergentEvolution(
        pokemon,
        player,
        ...additionalArgs
      )
    }
    return pokemon.evolution
  },

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.canEvolve(pokemon, player, stageLevel)
  },

  canEvolveIfGettingOne(pokemon: Pokemon, player: Player): boolean {
    if (pokemon.evolutionRule.type !== "count") return false
    const handler = this.getHandler(
      pokemon.evolutionRule
    ) as CountEvolutionHandler
    return handler.canEvolveIfGettingOne(pokemon, player)
  },

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.evolve(pokemon, player, stageLevel)
  },

  afterEvolve(pokemon: Pokemon, player: Player, stageLevel: number) {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.afterEvolve(pokemon, player, stageLevel)
  },

  updateHatch(pokemon: Pokemon, player: Player, stageLevel: number) {
    if (pokemon.evolutionRule.type !== "hatch") return
    const handler = this.getHandler(pokemon.evolutionRule) as HatchEvolutionHandler
    return handler.updateHatch(pokemon, player, stageLevel)
  }
}
