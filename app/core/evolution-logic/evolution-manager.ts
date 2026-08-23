import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type { IPlayer } from "../../types"
import {
  type CountEvolutionRule,
  type EvolutionRule,
  EvolutionRuleType,
  type HatchEvolutionRule,
  type MoneyEvolutionRule,
  type PlacementEvolutionRule,
  type StackEvolutionRule,
  type StateEvolutionRule
} from "../../types/EvolutionRules"
import { PokemonActionState } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { OnEvolutionEffect } from "../effects/effect"
import { PassiveEffects } from "../effects/passives"
import { CountEvolutionHandler } from "./count-evolution-handler"
import type { EvolutionHandler } from "./evolution-handler"
import { HatchEvolutionHandler } from "./hatch-evolution-handler"
import { getHatchTime } from "./hatch-time"
import { ItemEvolutionHandler } from "./item-evolution-handler"
import { MoneyEvolutionHandler } from "./money-evolution-handler"
import { PlacementEvolutionHandler } from "./placement-evolution-handler"
import { StackEvolutionHandler } from "./stack-evolution-handler"
import { StateEvolutionHandler } from "./state-evolution-handler"

export const EvolutionManager = {
  getHandler(evolutionRule: EvolutionRule): EvolutionHandler<any[]> {
    switch (evolutionRule.type) {
      case EvolutionRuleType.ITEM:
        return new ItemEvolutionHandler(evolutionRule)
      case EvolutionRuleType.STATE:
        return new StateEvolutionHandler(evolutionRule as StateEvolutionRule)
      case EvolutionRuleType.MONEY:
        return new MoneyEvolutionHandler(evolutionRule as MoneyEvolutionRule)
      case EvolutionRuleType.PLACEMENT:
        return new PlacementEvolutionHandler(
          evolutionRule as PlacementEvolutionRule
        )
      case EvolutionRuleType.HATCH:
        return new HatchEvolutionHandler(evolutionRule as HatchEvolutionRule)
      case EvolutionRuleType.STACK:
        return new StackEvolutionHandler(evolutionRule as StackEvolutionRule)
      case EvolutionRuleType.COUNT:
      default:
        return new CountEvolutionHandler(evolutionRule as CountEvolutionRule)
    }
  },

  tryEvolve(
    pokemon: Pokemon,
    player: Player,
    ...additionalArgs: unknown[]
  ): void | Pokemon {
    const handler = this.getHandler(pokemon.evolutionRule)
    if (handler.canEvolve(pokemon, player, ...additionalArgs)) {
      const pokemonEvolved = this.evolve(pokemon, player, ...additionalArgs)
      return pokemonEvolved
    }
  },

  evolve(
    pokemon: Pokemon,
    player: Player,
    ...additionalArgs: unknown[]
  ): Pokemon {
    const handler = this.getHandler(pokemon.evolutionRule)
    const pokemonEvolved = handler.evolve(pokemon, player, ...additionalArgs)
    this.afterEvolve(pokemonEvolved, pokemon, player, ...additionalArgs)
    return pokemonEvolved
  },

  afterEvolve(
    pokemonEvolved: Pokemon,
    pokemonBeforeEvolution: Pokemon,
    player: Player,
    ...additionalArgs: unknown[]
  ) {
    player.updateSynergies()
    if (pokemonBeforeEvolution.supercharged) pokemonEvolved.supercharged = true // preserve supercharged state on evolution

    if (pokemonEvolved.passive in PassiveEffects) {
      PassiveEffects[pokemonEvolved.passive]!.forEach((effect) => {
        if (effect instanceof OnEvolutionEffect) {
          effect.apply({ pokemonEvolved, player })
        }
      })
    }

    player.board.forEach((pokemon) => {
      if (
        (pokemon.passive === Passive.COSMOG ||
          pokemon.passive === Passive.COSMOEM) &&
        pokemonEvolved.passive !== Passive.COSMOG &&
        pokemonEvolved.passive !== Passive.COSMOEM
      ) {
        pokemon.addMaxHP(10)
        pokemon.stacks++
        this.tryEvolve(pokemon, player)
      }
    })

    // check evolutions again if it can evolve twice in a row
    this.tryEvolve(pokemonEvolved, player, ...additionalArgs)
  },

  getEvolution(
    pokemon: Pokemon,
    player: IPlayer,
    ...additionalArgs: unknown[]
  ): Pkm {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.getEvolution(pokemon, player, ...additionalArgs)
  },

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    ...additionalArgs: unknown[]
  ): boolean {
    const handler = this.getHandler(pokemon.evolutionRule)
    return handler.canEvolve(pokemon, player, ...additionalArgs)
  },

  canEvolveIfGettingOne(pokemon: Pokemon, player: Player): boolean {
    if (pokemon.evolutionRule.type !== EvolutionRuleType.COUNT) return false
    const handler = this.getHandler(
      pokemon.evolutionRule
    ) as CountEvolutionHandler
    return handler.canEvolveIfGettingOne(pokemon, player)
  },

  updateHatch(pokemon: Pokemon, player: Player) {
    if (pokemon.evolutionRule.type !== EvolutionRuleType.HATCH) return
    pokemon.stacks++
    const willHatch = this.canEvolve(pokemon, player)
    if (willHatch) {
      pokemon.action = PokemonActionState.HOP
      setTimeout(() => {
        this.tryEvolve(pokemon, player)
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
  }
}
