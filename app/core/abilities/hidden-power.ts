import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmFamily, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { pickRandomIn } from "../../utils/random"
import { AttackStrategy } from "../attack-strategy"
import Board from "../board"
import PokemonEntity from "../pokemon-entity"
import PokemonState from "../pokemon-state"
import PRECOMPUTED_TYPE_POKEMONS from "../../models/precomputed/type-pokemons.json"
import { OnFishPokemonCommand } from "../../rooms/commands/game-commands"
import ItemFactory from "../../models/item-factory"
import { AbilityStrategy } from "."

export class HiddenPowerStrategy extends AttackStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ): void {
    super.process(unown, state, board, target, crit)
    unown.handleDamage({
      damage: unown.life,
      board,
      attackType: AttackType.TRUE,
      attacker: null,
      shouldTargetGainMana: false
    })
  }
}

export class HiddenPowerAStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const corners = [
      [0, 0],
      [board.columns - 1, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1]
    ]
    corners.forEach(([x, y]) => {
      const player = unown.simulation.player!
      const abra = PokemonFactory.createPokemonFromName(
        Pkm.ABRA,
        player.pokemonCollection.get(PkmIndex[Pkm.ABRA])
      )
      const coord = unown.simulation.getClosestAvailablePlaceOnBoardTo(
        x,
        y,
        unown.team
      )
      unown.simulation.addPokemon(abra, coord.x, coord.y, unown.team, false)
    })
  }
}

export class HiddenPowerBStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team != enemy.team) {
        enemy.status.triggerBurn(30000, enemy, unown, board)
      }
    })
  }
}

export class HiddenPowerCStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          if (pokemon.items.size < 3) {
            pokemon.items.add(Item.AMULET_COIN)
            pokemon.simulation.applyItemEffect(pokemon, Item.AMULET_COIN)
          }
        }
      }
    )
  }
}

export class HiddenPowerDStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const player = unown.simulation.player!
    const x = player.simulation.room.getFirstAvailablePositionInBench(player.id)
    if (x !== undefined) {
      const ditto = PokemonFactory.createPokemonFromName(
        Pkm.DITTO,
        player.pokemonCollection.get(PkmIndex[Pkm.DITTO])
      )
      ditto.positionX = x
      ditto.positionY = 0
      player.board.set(ditto.id, ditto)
    }
  }
}

export class HiddenPowerEStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const egg = PokemonFactory.createRandomEgg()
    const player = unown.simulation.player!
    const x = player.simulation.room.getFirstAvailablePositionInBench(player.id)
    if (x !== undefined) {
      egg.positionX = x
      egg.positionY = 0
      egg.evolutionTimer = 1
      player.board.set(egg.id, egg)
    }
  }
}

export class HiddenPowerFStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    unown.simulation.room.dispatcher.dispatch(
      new OnFishPokemonCommand().setPayload({
        player: unown.simulation.player!,
        fishingLevel: 3
      })
    )
  }
}

export class HiddenPowerGStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const player = unown.simulation.player!
    player.money += 5
  }
}

export class HiddenPowerHStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          pokemon.handleHeal(pokemon.hp - pokemon.life, unown, 1)
        }
      }
    )
  }
}

export class HiddenPowerIStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const player = unown.simulation.player!
    player.items.add(ItemFactory.createBasicRandomItem())
  }
}

export class HiddenPowerJStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const numberToSpawn = 2
    const player = unown.simulation.player!
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        unown,
        unown.team
      )
      const sharpedo = unown.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(
          Pkm.SHARPEDO,
          player.pokemonCollection.get(PkmIndex[Pkm.SHARPEDO])
        ),
        coord.x,
        coord.y,
        unown.team,
        false
      )
      sharpedo.items.add(Item.RAZOR_CLAW)
      sharpedo.simulation.applyItemsEffects(sharpedo)
    }
  }
}

export class HiddenPowerKStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      unown,
      unown.team
    )
    const player = unown.simulation.player!
    const hitmonlee = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(
        Pkm.HITMONLEE,
        player.pokemonCollection.get(PkmIndex[Pkm.HITMONLEE])
      ),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    hitmonlee.items.add(Item.RED_ORB)
    hitmonlee.simulation.applyItemsEffects(hitmonlee)
    hitmonlee.mana = hitmonlee.maxMana - 1
  }
}

export class HiddenPowerLStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          if (pokemon.items.size < 3) {
            pokemon.items.add(Item.MAX_REVIVE)
            pokemon.simulation.applyItemEffect(pokemon, Item.MAX_REVIVE)
          }
        }
      }
    )
  }
}

export class HiddenPowerMStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          pokemon.mana = pokemon.maxMana
        }
      }
    )
  }
}

export class HiddenPowerNStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          const target = board.getValue(pokemon.targetX, pokemon.targetY)
          if (target) {
            AbilityStrategy[Ability.EXPLOSION].process(
              pokemon,
              pokemon.state,
              board,
              target,
              false
            )
          }
        }
      }
    )
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
        if (value.items.size < 3) {
          value.items.add(Item.ORAN_BERRY)
          value.simulation.applyItemEffect(value, Item.ORAN_BERRY)
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
    const player = pokemon.simulation.player!
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
        PokemonFactory.createPokemonFromName(
          bug,
          player.pokemonCollection.get(PkmIndex[bug])
        ),
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
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    unown.simulation.room.state.time = 0
  }
}

export class HiddenPowerRStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    let coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      unown,
      unown.team
    )
    const player = unown.simulation.player!
    const geodude = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(
        Pkm.GEODUDE,
        player.pokemonCollection.get(PkmIndex[Pkm.GEODUDE])
      ),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    geodude.items.add(Item.ROCKY_HELMET)
    geodude.simulation.applyItemsEffects(geodude)

    coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      unown,
      unown.team
    )
    const graveler = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(
        Pkm.GRAVELER,
        player.pokemonCollection.get(PkmIndex[Pkm.GRAVELER])
      ),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    graveler.items.add(Item.ROCKY_HELMET)
    graveler.simulation.applyItemsEffects(graveler)

    coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      unown,
      unown.team
    )
    const golem = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(
        Pkm.GOLEM,
        player.pokemonCollection.get(PkmIndex[Pkm.GOLEM])
      ),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    golem.items.add(Item.ROCKY_HELMET)
    golem.simulation.applyItemsEffects(golem)
  }
}

export class HiddenPowerSStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team != enemy.team) {
        enemy.status.triggerFreeze(4000, enemy)
      }
    })
  }
}

export class HiddenPowerTStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      unown,
      unown.team
    )
    const player = unown.simulation.player!
    const tapu = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(
        Pkm.TAPU_LELE,
        player.pokemonCollection.get(PkmIndex[Pkm.TAPU_LELE])
      ),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    tapu.items.add(Item.CHOICE_SPECS)
    tapu.simulation.applyItemsEffects(tapu)
    tapu.mana = tapu.maxMana
  }
}

export class HiddenPowerUStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
      unown,
      unown.team
    )
    const player = unown.simulation.player!
    const uxie = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(
        Pkm.UXIE,
        player.pokemonCollection.get(PkmIndex[Pkm.UXIE])
      ),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    uxie.items.add(Item.AQUA_EGG)
    uxie.simulation.applyItemsEffects(uxie)
    uxie.mana = uxie.maxMana - 1
  }
}

export class HiddenPowerVStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team !== enemy.team) {
        AbilityStrategy[Ability.THUNDER].process(
          unown,
          unown.state,
          board,
          enemy,
          false
        )
      }
    })
  }
}

export class HiddenPowerWStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const player = unown.simulation.player!
    const topSynergy = Array.from(player.synergies).sort(
      ([s1, v1], [s2, v2]) => v2 - v1
    )[0][0]
    const candidates = [
      ...PRECOMPUTED_TYPE_POKEMONS[topSynergy].pokemons,
      ...PRECOMPUTED_TYPE_POKEMONS[topSynergy].additionalPokemons
    ] as Pkm[]
    const pkm = pickRandomIn(candidates)

    const x = player.simulation.room.getFirstAvailablePositionInBench(player.id)
    if (x !== undefined) {
      const pokemon = PokemonFactory.createPokemonFromName(
        pkm,
        player.pokemonCollection.get(PkmIndex[pkm])
      )
      pokemon.positionX = x
      pokemon.positionY = 0
      player.board.set(pokemon.id, pokemon)
    }
  }
}

export class HiddenPowerXStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          if (pokemon.items.size < 3) {
            pokemon.items.add(Item.XRAY_VISION)
            pokemon.simulation.applyItemEffect(pokemon, Item.XRAY_VISION)
          }
        }
      }
    )
  }
}

export class HiddenPowerYStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const numberToSpawn = 2
    const player = unown.simulation.player!
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        unown,
        unown.team
      )
      const meditite = unown.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(
          Pkm.MEDITITE,
          player.pokemonCollection.get(PkmIndex[Pkm.MEDITITE])
        ),
        coord.x,
        coord.y,
        unown.team,
        false
      )
      meditite.items.add(Item.SOUL_DEW)
      meditite.simulation.applyItemsEffects(meditite)
    }
  }
}

export class HiddenPowerZStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team != enemy.team) {
        enemy.status.triggerSleep(5000, enemy)
      }
    })
  }
}

export class HiddenPowerQMStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const player = unown.simulation.player!
    const unowns = (Object.keys(PkmFamily) as Pkm[]).filter(
      (pkm) => PkmFamily[pkm] === Pkm.UNOWN_A
    )
    const nbUnownsObtained = 4
    for (let i = 0; i < nbUnownsObtained; i++) {
      const pkm = pickRandomIn(unowns)
      const x = player.simulation.room.getFirstAvailablePositionInBench(
        player.id
      )
      if (x !== undefined) {
        const pokemon = PokemonFactory.createPokemonFromName(
          pkm,
          player.pokemonCollection.get(PkmIndex[pkm])
        )
        pokemon.positionX = x
        pokemon.positionY = 0
        player.board.set(pokemon.id, pokemon)
      }
    }
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
    const player = pokemon.simulation.player!
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
      const unownName = pickRandomIn(unowns)
      const unown = PokemonFactory.createPokemonFromName(
        unownName,
        player.pokemonCollection.get(PkmIndex[unownName])
      )
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
