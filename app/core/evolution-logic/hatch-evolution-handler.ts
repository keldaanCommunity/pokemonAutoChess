import { EvolutionTime, GoldenEggItems } from "../../config"
import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Item } from "../../types"
import type { HatchEvolutionRule } from "../../types/EvolutionRules"
import { EffectEnum } from "../../types/enum/Effect"
import { PokemonActionState } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"
import { EvolutionHandler } from "./evolution-handler"

export class HatchEvolutionHandler extends EvolutionHandler {
  constructor(evolutionRule: HatchEvolutionRule) {
    super(evolutionRule.divergentEvolution)
  }

  getHatchTime(pokemon: Pokemon, player: Player): number {
    if (pokemon.name === Pkm.EGG) {
      return player.effects.has(EffectEnum.BREEDER) ||
        player.effects.has(EffectEnum.GOLDEN_EGGS)
        ? EvolutionTime.EGG_HATCH - 1
        : EvolutionTime.EGG_HATCH
    }
    return EvolutionTime.EVOLVE_HATCH
  }

  updateHatch(pokemon: Pokemon, player: Player, stageLevel: number) {
    pokemon.stacks++
    const willHatch = this.canEvolve(pokemon, player, stageLevel)
    if (willHatch) {
      pokemon.action = PokemonActionState.HOP
      setTimeout(() => {
        this.tryEvolve(pokemon, player, stageLevel)
      }, 2000)
    } else if (pokemon.name === Pkm.EGG) {
      const hatchTime = this.getHatchTime(pokemon, player)
      if (pokemon.stacks >= hatchTime) {
        pokemon.action = PokemonActionState.HOP
      } else if (pokemon.stacks >= hatchTime - 1) {
        pokemon.action = PokemonActionState.EMOTE
      } else {
        pokemon.action = PokemonActionState.IDLE
      }
    }
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    if (!player.board.has(pokemon.id)) return false // egg has been sold in the meantime
    pokemon.stacksRequired = this.getHatchTime(pokemon, player)
    return pokemon.stacks >= pokemon.stacksRequired
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    pokemon.stacks = 0 // prevent trying to evolve twice in a row
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )

    if (pokemonEvolved != null && pokemon.name === Pkm.EGG && pokemon.shiny) {
      player.items.push(pickRandomIn(GoldenEggItems))
    }

    return pokemonEvolved
  }
}
