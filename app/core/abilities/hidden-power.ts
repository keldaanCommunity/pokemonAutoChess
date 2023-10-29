import PokemonFactory from "../../models/pokemon-factory"
import { Ability } from "../../types/enum/Ability"
import { AttackType, PokemonActionState, Rarity } from "../../types/enum/Game"
import { BasicItems, Item } from "../../types/enum/Item"
import { getUnownsPoolPerStage, Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { pickRandomIn } from "../../utils/random"
import Board from "../board"
import PokemonEntity from "../pokemon-entity"
import PokemonState from "../pokemon-state"
import PRECOMPUTED_TYPE_POKEMONS from "../../models/precomputed/type-pokemons.json"
import { AbilityStrategies } from "./abilities"
import { Transfer } from "../../types"
import { AbilityStrategy } from "./ability-strategy"

export class HiddenPowerStrategy extends AbilityStrategy {
  copyable = false
  process(
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ): void {
    super.process(unown, state, board, target, crit)
    unown.handleDamage({
      damage: unown.life + unown.shield,
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
      const abra = PokemonFactory.createPokemonFromName(Pkm.ABRA, unown.player)
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
    const player = unown.player
    if (player) {
      const x = unown.simulation.room.getFirstAvailablePositionInBench(
        player.id
      )
      if (x !== undefined) {
        const ditto = PokemonFactory.createPokemonFromName(Pkm.DITTO, player)
        ditto.positionX = x
        ditto.positionY = 0
        player.board.set(ditto.id, ditto)
      }
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
    const player = unown.player
    if (player) {
      const x = unown.simulation.room.getFirstAvailablePositionInBench(
        player.id
      )
      if (x !== undefined) {
        egg.positionX = x
        egg.positionY = 0
        egg.evolutionTimer = 1
        player.board.set(egg.id, egg)
      }
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
    const player = unown.player

    if (player) {
      for (let i = 0; i < nbFishes; i++) {
        const pkm = unown.simulation.room.state.shop.fishPokemon(
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
    if (unown.player) {
      unown.player.money += 5
    }
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
    if (unown.player) {
      unown.player.items.add(pickRandomIn(BasicItems))
    }
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
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        unown,
        unown.team
      )
      const sharpedo = unown.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(Pkm.SHARPEDO, unown.player),
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
    const hitmonlee = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.HITMONLEE, unown.player),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    hitmonlee.items.add(Item.RED_ORB)
    hitmonlee.simulation.applyItemsEffects(hitmonlee)
    hitmonlee.pp = hitmonlee.maxPP - 1
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
          pokemon.pp = pokemon.maxPP
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
            AbilityStrategies[Ability.EXPLOSION].process(
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
    unown: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, state, board, target, crit)
    const numberToSpawn = 5
    const bugs = [
      ...PRECOMPUTED_TYPE_POKEMONS[Synergy.BUG].pokemons,
      ...PRECOMPUTED_TYPE_POKEMONS[Synergy.BUG].additionalPokemons
    ] as Pkm[]
    for (let i = 0; i < numberToSpawn; i++) {
      const bug = pickRandomIn(bugs)
      const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        unown,
        unown.team
      )
      unown.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(bug, unown.player),
        coord.x,
        coord.y,
        unown.team,
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
    const geodude = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.GEODUDE, unown.player),
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
      PokemonFactory.createPokemonFromName(Pkm.GRAVELER, unown.player),
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
      PokemonFactory.createPokemonFromName(Pkm.GOLEM, unown.player),
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
    const tapu = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.TAPU_LELE, unown.player),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    tapu.items.add(Item.CHOICE_SPECS)
    tapu.simulation.applyItemsEffects(tapu)
    tapu.pp = tapu.maxPP
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
    const uxie = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.UXIE, unown.player),
      coord.x,
      coord.y,
      unown.team,
      false
    )
    uxie.items.add(Item.AQUA_EGG)
    uxie.simulation.applyItemsEffects(uxie)
    uxie.pp = uxie.maxPP - 1
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
        AbilityStrategies[Ability.THUNDER].process(
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
    const player = unown.player
    if (player) {
      const x = unown.simulation.room.getFirstAvailablePositionInBench(
        player.id
      )
      if (x !== undefined) {
        const synergiesSortedByLevel = Array.from(player.synergies).sort(
          ([s1, v1], [s2, v2]) => v2 - v1
        )
        const topSynergyCount = synergiesSortedByLevel[0][1]
        const topSynergies = synergiesSortedByLevel.filter(
          ([s, v]) => v >= topSynergyCount
        )
        const topSynergy = pickRandomIn(topSynergies)[0]
        const candidates = (
          [
            ...PRECOMPUTED_TYPE_POKEMONS[topSynergy].pokemons,
            ...PRECOMPUTED_TYPE_POKEMONS[topSynergy].additionalPokemons
          ] as Pkm[]
        )
          .map((p) => PokemonFactory.createPokemonFromName(p, player))
          .filter(
            (p) =>
              p.stars === 1 &&
              [Rarity.RARE, Rarity.EPIC, Rarity.ULTRA].includes(p.rarity)
          )

        const pokemon = pickRandomIn(candidates)
        pokemon.positionX = x
        pokemon.positionY = 0
        player.board.set(pokemon.id, pokemon)
        unown.simulation.room.updateEvolution(player.id)
      }
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
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = unown.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        unown,
        unown.team
      )
      const meditite = unown.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(Pkm.MEDITITE, unown.player),
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
    const player = unown.player
    if (player) {
      const stageLevel = unown.simulation.stageLevel
      const candidates = getUnownsPoolPerStage(stageLevel).filter(
        (u) => u !== Pkm.UNOWN_QUESTION
      )
      const nbUnownsObtained = 4
      for (let i = 0; i < nbUnownsObtained; i++) {
        const pkm = pickRandomIn(candidates)
        const x = unown.simulation.room.getFirstAvailablePositionInBench(
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
    const player = pokemon.player!
    if (player) {
      const corners = [
        [0, 0],
        [board.columns - 1, 0],
        [0, board.rows - 1],
        [board.columns - 1, board.rows - 1]
      ]
      const stageLevel = pokemon.simulation.stageLevel
      const candidates = getUnownsPoolPerStage(stageLevel).filter(
        (u) => u !== Pkm.UNOWN_EXCLAMATION
      )
      corners.forEach(([x, y]) => {
        const unownName = pickRandomIn(candidates)
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
}
