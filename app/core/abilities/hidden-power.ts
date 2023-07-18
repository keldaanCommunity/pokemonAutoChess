import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmFamily } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { pickRandomIn } from "../../utils/random"
import { AttackStrategy } from "../attack-strategy"
import Board from "../board"
import PokemonEntity from "../pokemon-entity"
import PokemonState from "../pokemon-state"
import PRECOMPUTED_TYPE_POKEMONS from "../../models/precomputed/type-pokemons.json"
import { OnFishPokemonCommand } from "../../rooms/commands/game-commands"

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
    const corners = [
      [0, 0],
      [board.columns - 1, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1]
    ]
    corners.forEach(([x, y]) => {
      const abra = PokemonFactory.createPokemonFromName(Pkm.ABRA)
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardTo(
        x,
        y,
        pokemon.team
      )
      pokemon.simulation.addPokemon(abra, coord.x, coord.y, pokemon.team, false)
    })
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
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerBurn(30000, value, pokemon, board)
      }
    })
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
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team === value.team) {
        if (pokemon.items.size < 3) {
          pokemon.items.add(Item.AMULET_COIN)
          pokemon.simulation.applyItemEffect(pokemon, Item.AMULET_COIN)
        }
      }
    })
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
    pokemon.simulation.room.dispatcher.dispatch(new OnFishPokemonCommand().setPayload({
      player: pokemon.simulation.player,
      fishingLevel: 3
    }))
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
    const numberToSpawn = 2
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        pokemon,
        pokemon.team
      )
      const sharpedo = pokemon.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(Pkm.SHARPEDO),
        coord.x,
        coord.y,
        pokemon.team,
        false
      )
      sharpedo.items.add(Item.RAZOR_CLAW)
      sharpedo.simulation.applyItemsEffects(sharpedo)
    }
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
    const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      pokemon,
      pokemon.team
    )
    const hitmonlee = pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.HITMONLEE),
      coord.x,
      coord.y,
      pokemon.team,
      false
    )
    hitmonlee.items.add(Item.RED_ORB)
    hitmonlee.simulation.applyItemsEffects(hitmonlee)
    hitmonlee.mana = hitmonlee.maxMana - 1
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
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team === value.team) {
        if (pokemon.items.size < 3) {
          pokemon.items.add(Item.ORAN_BERRY)
          pokemon.simulation.applyItemEffect(pokemon, Item.ORAN_BERRY)
        }
      }
    })
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
    const numberToSpawn = 5
    const bugs = [
      ...PRECOMPUTED_TYPE_POKEMONS[Synergy.BUG].pokemons,
      ...PRECOMPUTED_TYPE_POKEMONS[Synergy.BUG].additionalPokemons
    ] as Pkm[]
    for (let i = 0; i < numberToSpawn; i++) {
      const bug = pickRandomIn(bugs)
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        pokemon,
        pokemon.team
      )
      pokemon.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(bug),
        coord.x,
        coord.y,
        pokemon.team,
        false
      )
    }
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
    let coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      pokemon,
      pokemon.team
    )
    const geodude = pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.GEODUDE),
      coord.x,
      coord.y,
      pokemon.team,
      false
    )
    geodude.items.add(Item.ROCKY_HELMET)
    geodude.simulation.applyItemsEffects(geodude)

    coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      pokemon,
      pokemon.team
    )
    const graveler = pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.GRAVELER),
      coord.x,
      coord.y,
      pokemon.team,
      false
    )
    graveler.items.add(Item.ROCKY_HELMET)
    graveler.simulation.applyItemsEffects(graveler)

    coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      pokemon,
      pokemon.team
    )
    const golem = pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.GOLEM),
      coord.x,
      coord.y,
      pokemon.team,
      false
    )
    golem.items.add(Item.ROCKY_HELMET)
    golem.simulation.applyItemsEffects(golem)
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
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerFreeze(4000, value)
      }
    })
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
    const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      pokemon,
      pokemon.team
    )
    const tapu = pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.TAPU_LELE),
      coord.x,
      coord.y,
      pokemon.team,
      false
    )
    tapu.items.add(Item.CHOICE_SPECS)
    tapu.simulation.applyItemsEffects(tapu)
    tapu.mana = tapu.maxMana
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
    const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      pokemon,
      pokemon.team
    )
    const uxie = pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.UXIE),
      coord.x,
      coord.y,
      pokemon.team,
      false
    )
    uxie.items.add(Item.AQUA_EGG)
    uxie.simulation.applyItemsEffects(uxie)
    uxie.mana = uxie.maxMana - 1
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
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team === value.team) {
        if (pokemon.items.size < 3) {
          pokemon.items.add(Item.XRAY_VISION)
          pokemon.simulation.applyItemEffect(pokemon, Item.XRAY_VISION)
        }
      }
    })
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
    const numberToSpawn = 2
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        pokemon,
        pokemon.team
      )
      const meditite = pokemon.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(Pkm.MEDITITE),
        coord.x,
        coord.y,
        pokemon.team,
        false
      )
      meditite.items.add(Item.SOUL_DEW)
      meditite.simulation.applyItemsEffects(meditite)
    }
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
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerSleep(5000, value)
      }
    })
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
    const unowns = (Object.keys(PkmFamily) as Pkm[]).filter(
      (pkm) => PkmFamily[pkm] === Pkm.UNOWN_A
    )
    const corners = [
      [0, 0],
      [board.columns - 1, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1]
    ]
    corners.forEach(([x, y]) => {
      const unown = PokemonFactory.createPokemonFromName(pickRandomIn(unowns))
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardTo(
        x,
        y,
        pokemon.team
      )
      pokemon.simulation.addPokemon(
        unown,
        coord.x,
        coord.y,
        pokemon.team,
        false
      )
    })
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
