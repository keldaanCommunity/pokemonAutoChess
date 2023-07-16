import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { AttackStrategy } from "../attack-strategy"
import Board from "../board"
import PokemonEntity from "../pokemon-entity"
import PokemonState from "../pokemon-state"

export class HiddenPowerStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ): void {
    super.process(pokemon, state, board, target, crit)
    pokemon.handleDamage({
      damage: pokemon.life,
      board,
      attackType: AttackType.TRUE,
      attacker: null,
      shouldTargetGainMana: false
    })
  }
}

export class HiddenPowerAStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerBStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerCStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerDStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerEStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerFStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerGStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerHStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerIStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerJStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerKStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerLStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerMStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerNStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerOStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerPStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerQStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerRStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerSStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerTStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerUStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerVStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerWStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerXStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerYStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerZStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerQMStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export class HiddenPowerEMStrategy extends HiddenPowerStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
  }
}

export const HiddenPowerAbilities: Ability[] = [
  Ability.HIDDEN_POWER_A,
  Ability.HIDDEN_POWER_B,
  Ability.HIDDEN_POWER_C,
  Ability.HIDDEN_POWER_D,
  Ability.HIDDEN_POWER_E,
  Ability.HIDDEN_POWER_F,
  Ability.HIDDEN_POWER_G,
  Ability.HIDDEN_POWER_H,
  Ability.HIDDEN_POWER_I,
  Ability.HIDDEN_POWER_J,
  Ability.HIDDEN_POWER_K,
  Ability.HIDDEN_POWER_L,
  Ability.HIDDEN_POWER_M,
  Ability.HIDDEN_POWER_N,
  Ability.HIDDEN_POWER_O,
  Ability.HIDDEN_POWER_P,
  Ability.HIDDEN_POWER_Q,
  Ability.HIDDEN_POWER_R,
  Ability.HIDDEN_POWER_S,
  Ability.HIDDEN_POWER_T,
  Ability.HIDDEN_POWER_U,
  Ability.HIDDEN_POWER_V,
  Ability.HIDDEN_POWER_W,
  Ability.HIDDEN_POWER_X,
  Ability.HIDDEN_POWER_Y,
  Ability.HIDDEN_POWER_Z
]

export const HiddenPowerStrategies: (typeof HiddenPowerStrategy)[] = [
  HiddenPowerAStrategy,
  HiddenPowerBStrategy,
  HiddenPowerCStrategy,
  HiddenPowerDStrategy,
  HiddenPowerEStrategy,
  HiddenPowerFStrategy,
  HiddenPowerGStrategy,
  HiddenPowerHStrategy,
  HiddenPowerIStrategy,
  HiddenPowerJStrategy,
  HiddenPowerKStrategy,
  HiddenPowerLStrategy,
  HiddenPowerMStrategy,
  HiddenPowerNStrategy,
  HiddenPowerOStrategy,
  HiddenPowerPStrategy,
  HiddenPowerQStrategy,
  HiddenPowerRStrategy,
  HiddenPowerSStrategy,
  HiddenPowerTStrategy,
  HiddenPowerUStrategy,
  HiddenPowerVStrategy,
  HiddenPowerWStrategy,
  HiddenPowerXStrategy,
  HiddenPowerYStrategy,
  HiddenPowerZStrategy
]
