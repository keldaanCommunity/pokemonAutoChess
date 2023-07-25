import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { AttackType, PokemonActionState } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Pkm, PkmIndex, Unowns } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { pickRandomIn } from "../../utils/random"
import { AttackStrategy } from "../attack-strategy"
import Board from "../board"
import PokemonEntity from "../pokemon-entity"
import PokemonState from "../pokemon-state"
import PRECOMPUTED_TYPE_POKEMONS from "../../models/precomputed/type-pokemons.json"
import ItemFactory from "../../models/item-factory"
import { AbilityStrategy } from "."
import { Transfer } from "../../types"

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
      const abra = PokemonFactory.createPokemonFromName(Pkm.ABRA, player)
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
      const ditto = PokemonFactory.createPokemonFromName(Pkm.DITTO, player)
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
    const fishingLevel = 3
    const nbFishes = 2
    const player = unown.simulation.player!

    for (let i = 0; i < nbFishes; i++) {
      const pkm = player.simulation.room.state.shop.fishPokemon(
        player,
        fishingLevel
      )
      const fish = PokemonFactory.createPokemonFromName(pkm, player)
      const x = unown.simulation.room.getFirstAvailablePositionInBench(
        player.id
      )
      fish.positionX = x !== undefined ? x : -1
      fish.positionY = 0
      fish.action = PokemonActionState.FISH
      player.board.set(fish.id, fish)
      unown.simulation.room.updateEvolution(player.id)
      unown.simulation.room.clock.setTimeout(() => {
        fish.action = PokemonActionState.IDLE
      }, 1000)
    }
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
        PokemonFactory.createPokemonFromName(Pkm.SHARPEDO, player),
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
      PokemonFactory.createPokemonFromName(Pkm.HITMONLEE, player),
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
            pokemon.simulation.room.broadcast(Transfer.ABILITY, {
              id: pokemon.simulation.id,
              skill: Ability.EXPLOSION,
              positionX: pokemon.positionX,
              positionY: pokemon.positionY,
              targetX: target.positionX,
              targetY: target.positionY,
              orientation: pokemon.orientation
            })
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
        PokemonFactory.createPokemonFromName(bug, player),
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
    unown.simulation.redTeam.clear()
    unown.simulation.blueTeam.clear()
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
      PokemonFactory.createPokemonFromName(Pkm.GEODUDE, player),
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
      PokemonFactory.createPokemonFromName(Pkm.GRAVELER, player),
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
      PokemonFactory.createPokemonFromName(Pkm.GOLEM, player),
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
      PokemonFactory.createPokemonFromName(Pkm.TAPU_LELE, player),
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
      PokemonFactory.createPokemonFromName(Pkm.UXIE, player),
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
        unown.simulation.room.broadcast(Transfer.ABILITY, {
          id: unown.simulation.id,
          skill: Ability.THUNDER,
          positionX: unown.positionX,
          positionY: unown.positionY,
          targetX: enemy.positionX,
          targetY: enemy.positionY,
          orientation: unown.orientation
        })
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
      const pokemon = PokemonFactory.createPokemonFromName(pkm, player)
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
        PokemonFactory.createPokemonFromName(Pkm.MEDITITE, player),
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
    const nbUnownsObtained = 4
    for (let i = 0; i < nbUnownsObtained; i++) {
      const pkm = pickRandomIn(Unowns)
      const x = player.simulation.room.getFirstAvailablePositionInBench(
        player.id
      )
      if (x !== undefined) {
        const pokemon = PokemonFactory.createPokemonFromName(pkm, player)
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
    const corners = [
      [0, 0],
      [board.columns - 1, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1]
    ]
    corners.forEach(([x, y]) => {
      const unownName = pickRandomIn(Unowns)
      const unown = PokemonFactory.createPokemonFromName(unownName, player)
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
