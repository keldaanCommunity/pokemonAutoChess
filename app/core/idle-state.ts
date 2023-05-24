import { Ability } from "../types/enum/Ability"
import { PokemonActionState } from "../types/enum/Game"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"

export class IdleState extends PokemonState {
  update(pokemon: PokemonEntity, dt: number, board: Board, climate: string) {
    super.update(pokemon, dt, board, climate)

    if (pokemon.status.tree) {
      if (pokemon.mana >= pokemon.maxMana) {
        pokemon.mana = 0
        pokemon.status.tree = false
        pokemon.toMovingState()
      }
    } else if (!pokemon.status.freeze && !pokemon.status.sleep) {
      pokemon.toMovingState()
    }

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 500
      if (pokemon.skill === Ability.MIMIC && pokemon.status.tree) {
        pokemon.addAttack(1)
      }
    } else {
      pokemon.cooldown -= dt
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    pokemon.action = pokemon.status.tree
      ? PokemonActionState.IDLE
      : PokemonActionState.SLEEP
    pokemon.cooldown = 0
  }

  onExit(pokemon: PokemonEntity) {
    super.onExit(pokemon)
    pokemon.targetX = -1
    pokemon.targetY = -1
  }
}
