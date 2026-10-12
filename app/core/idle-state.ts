import type Player from "../models/colyseus-models/player"
import { PokemonActionState } from "../types/enum/Game"
import { Passive } from "../types/enum/Passive"
import { AbilityStrategies } from "./abilities/abilities"
import { castAbility } from "./abilities/cast"
import type { Board } from "./board"
import type { PokemonEntity } from "./pokemon-entity"
import PokemonState from "./pokemon-state"

export class IdleState extends PokemonState {
  name = "idle"

  update(pokemon: PokemonEntity, dt: number, board: Board, player: Player) {
    super.update(pokemon, dt, board, player)

    if (
      pokemon.status.tree &&
      pokemon.maxPP > 0 &&
      pokemon.pp >= pokemon.maxPP
    ) {
      pokemon.status.tree = false
    } else if (
      pokemon.passive === Passive.INANIMATE &&
      pokemon.maxPP > 0 &&
      pokemon.pp >= pokemon.maxPP
    ) {
      // CAST ABILITY FOR INANIMATE ENTITIES THAT HAVE A PP BAR
      castAbility(AbilityStrategies[pokemon.skill], pokemon, board, null)
    }

    if (pokemon.canMove) {
      pokemon.toMovingState()
    }

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 500
    } else {
      pokemon.cooldown -= dt
      if (pokemon.status.skydiving && pokemon.cooldown <= 500) {
        // just landed, 500ms remaining cooldown to reposition
        // only used by special cases like Sudowoodo + Comet Shard
        pokemon.status.skydiving = false
      }
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    if (pokemon.status.tree) {
      pokemon.action = PokemonActionState.IDLE
    } else if (pokemon.status.resurrecting) {
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
    pokemon.setTarget(null)
  }
}
