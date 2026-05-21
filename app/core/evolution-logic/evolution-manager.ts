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
import { PokemonActionState } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { OnEvolutionEffect } from "../effects/effect"
import { PassiveEffects } from "../effects/passives"
import { ConditionEvolutionHandler } from "./condition-evolution-handler"
import { CountEvolutionHandler } from "./count-evolution-handler"
import type { EvolutionHandler } from "./evolution-handler"
import { HatchEvolutionHandler } from "./hatch-evolution-handler"
import { getHatchTime } from "./hatch-time";
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
      return pokemonEvolved
    }
  },

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    const handler = this.getHandler(pokemon.evolutionRule)
    const pokemonEvolved = handler.evolve(pokemon, player, stageLevel)
    this.afterEvolve(pokemonEvolved, pokemon, player, stageLevel)
    return pokemonEvolved
  },

  afterEvolve(
    pokemonEvolved: Pokemon,
    pokemonBeforeEvolution: Pokemon,
    player: Player,
    stageLevel: number
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
        this.tryEvolve(pokemon, player, stageLevel)
      }
    })

    // check evolutions again if it can evolve twice in a row
    this.tryEvolve(pokemonEvolved, player, stageLevel)
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

  updateHatch(pokemon: Pokemon, player: Player, stageLevel: number) {
    if (pokemon.evolutionRule.type !== "hatch") return
    const handler = this.getHandler(
      pokemon.evolutionRule
    ) as HatchEvolutionHandler
    pokemon.stacks++
    const willHatch = this.canEvolve(pokemon, player, stageLevel)
    if (willHatch) {
      pokemon.action = PokemonActionState.HOP
      setTimeout(() => {
        this.tryEvolve(pokemon, player, stageLevel)
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
