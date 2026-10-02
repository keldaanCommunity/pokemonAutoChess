import { WandererBehavior, WandererType } from "../../types/enum/Wanderer"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MagnetPullStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    if (pokemon.player) {
      const randomSteelPkm = pokemon.simulation.room.state.shop.magnetPull(
        pokemon,
        pokemon.player
      )
      pokemon.player.spawnWanderingPokemon({
        pkm: randomSteelPkm,
        behavior: WandererBehavior.SPECTATE,
        type: WandererType.CATCHABLE
      })
    }
  }
}
