import Player from "../models/colyseus-models/player"
import { PokemonActionState } from "../types/enum/Game"
import { Passive } from "../types/enum/Passive"
import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"
import PokemonState from "./pokemon-state"

export class IdleState extends PokemonState {
  name = "idle"

  update(pokemon: PokemonEntity, dt: number, board: Board, player: Player) {
    super.update(pokemon, dt, board, player)

    if (pokemon.status.tree) {
      if (pokemon.maxPP > 0 && pokemon.pp >= pokemon.maxPP && pokemon.canMove) {
        pokemon.status.tree = false
        pokemon.toMovingState()
      }
    } else if (pokemon.canMove) {
      pokemon.toMovingState()
    }

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 500
      if (pokemon.passive === Passive.SUDOWOODO && pokemon.status.tree) {
        pokemon.addAttack(pokemon.stars === 1 ? 1 : 2, pokemon, 0, false)
      }
    } else {
      pokemon.cooldown -= dt
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    if (pokemon.status.tree) {
      pokemon.action = PokemonActionState.IDLE
    } else if (pokemon.status.resurecting) {
      pokemon.action = PokemonActionState.HURT
    } else if (
      (pokemon.status.sleep || pokemon.status.freeze) &&
      pokemon.passive !== Passive.INANIMATE
    ) {
      pokemon.action = PokemonActionState.SLEEP
    } else {
      pokemon.action = PokemonActionState.IDLE
    }
    pokemon.cooldown = 0
  }

  onExit(pokemon: PokemonEntity) {
    super.onExit(pokemon)
    pokemon.targetX = -1
    pokemon.targetY = -1
  }
}
