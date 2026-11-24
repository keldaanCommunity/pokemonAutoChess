import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type { IPokemon } from "../../types"
import {
  type EvolutionContext,
  type EvolutionRule,
  EvolutionRuleType
} from "../../types/EvolutionRules"
import { PokemonActionState } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { CountEvolutionHandler } from "./count-evolution-handler"
import type { EvolutionHandler } from "./evolution-handler"
import { triggerOnEvolutionHooks } from "./evolution-hooks"
import { HatchEvolutionHandler } from "./hatch-evolution-handler"
import { getHatchTime } from "./hatch-time"
import { ItemEvolutionHandler } from "./item-evolution-handler"
import { MegaEvolutionHandler } from "./mega-evolution"
import { MoneyEvolutionHandler } from "./money-evolution-handler"
import { PlacementEvolutionHandler } from "./placement-evolution-handler"
import { StackEvolutionHandler } from "./stack-evolution-handler"
import { StateEvolutionHandler } from "./state-evolution-handler"

export const EvolutionManager = {
  getHandler(
    evolutionRule: EvolutionRule
  ): EvolutionHandler<EvolutionRuleType> {
    switch (evolutionRule.type) {
      case EvolutionRuleType.ITEM:
        return new ItemEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.STATE:
        return new StateEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.MONEY:
        return new MoneyEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.PLACEMENT:
        return new PlacementEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.HATCH:
        return new HatchEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.STACK:
        return new StackEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.MEGA:
        return new MegaEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      case EvolutionRuleType.COUNT:
        return new CountEvolutionHandler(
          evolutionRule
        ) as EvolutionHandler<EvolutionRuleType>
      default:
        throw new TypeError("Unknown evolution rule type")
    }
  },

  tryEvolve(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContext
  ): Pokemon | null {
    if (this.canEvolve(pokemon, player, context)) {
      return this.evolve(pokemon, player, context)
    }
    return null
  },

  evolve(pokemon: Pokemon, player: Player, context: EvolutionContext): Pokemon {
    const handler = this.getHandler(pokemon.evolutionRule)
    const pokemonEvolved = handler.evolve(pokemon, player, context)
    this.afterEvolve(pokemonEvolved, pokemon, player, context)
    return pokemonEvolved
  },

  afterEvolve(
    pokemonEvolved: Pokemon,
    pokemonBeforeEvolution: Pokemon,
    player: Player,
    context: EvolutionContext
  ) {
    player.updateSynergies()
    if (pokemonBeforeEvolution.supercharged) pokemonEvolved.supercharged = true // preserve supercharged state on evolution

    triggerOnEvolutionHooks(pokemonEvolved, player)

    // check evolutions again if it can evolve twice in a row
    this.tryEvolve(pokemonEvolved, player, context)
  },

  getEvolution(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContext
  ): Pkm {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.getEvolution(pokemon, player, context)
  },

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContext
  ): boolean {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.canEvolve(pokemon, player, context)
  },

  canEvolveIfGettingOne(pokemon: Pokemon, player: Player): boolean {
    if (pokemon.evolutionRule.type !== EvolutionRuleType.COUNT) return false
    const handler = new CountEvolutionHandler(pokemon.evolutionRule)
    return handler.canEvolveIfGettingOne(pokemon, player)
  },

  updateHatch(pokemon: Pokemon, player: Player) {
    if (pokemon.evolutionRule.type !== EvolutionRuleType.HATCH) return
    pokemon.stacks++
    const willHatch = this.canEvolve(pokemon, player, {
      type: EvolutionRuleType.HATCH
    })
    if (willHatch) {
      pokemon.action = PokemonActionState.HOP
      setTimeout(() => {
        this.tryEvolve(pokemon, player, { type: EvolutionRuleType.HATCH })
      }, 2000)
    } else if (pokemon.name === Pkm.EGG) {
      const hatchTime = getHatchTime(pokemon, player)
      if (pokemon.stacks >= hatchTime) {
        pokemon.action = PokemonActionState.HOP
      } else if (pokemon.stacks >= hatchTime - 1) {
        pokemon.action = PokemonActionState.EMOTE
      } else {
        pokemon.action = PokemonActionState.IDLE
      }
    }
  },

  isFinal(pokemon: IPokemon): boolean {
    /* true if should be excluded from shops when obtained */
    if (
      pokemon.passive === Passive.CORSOLA ||
      pokemon.passive === Passive.AVALUGG
    )
      return false
    return (
      !pokemon.hasEvolution ||
      pokemon.evolutionRule.type !== EvolutionRuleType.COUNT
    )
  }
}
