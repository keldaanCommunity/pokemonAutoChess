import { PokemonActionState } from "../types/enum/Game"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"

export class IdleState extends PokemonState {
  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    climate: string
  ): boolean {
    super.update(pokemon, dt, board, climate)
    if (!pokemon.status.freeze && !pokemon.status.sleep) {
      pokemon.toMovingState()
    }
    return false
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    pokemon.action = PokemonActionState.SLEEP
    pokemon.cooldown = 0
  }

  onExit(pokemon: PokemonEntity) {
    super.onExit(pokemon)
    pokemon.targetX = -1
    pokemon.targetY = -1
  }
}
