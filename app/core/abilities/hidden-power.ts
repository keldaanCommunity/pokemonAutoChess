import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY } from "../../models/precomputed/precomputed-types-and-categories"
import { IPokemon } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { AttackType, Rarity } from "../../types/enum/Game"
import { Berries, Dishes, Item, ItemComponents } from "../../types/enum/Item"
import { getUnownsPoolPerStage, Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { getFirstAvailablePositionInBench } from "../../utils/board"
import { clamp, min } from "../../utils/number"
import { pickNRandomIn, pickRandomIn, randomWeighted } from "../../utils/random"
import type { Board } from "../board"
import { giveRandomEgg } from "../eggs"
import { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { AbilityStrategy } from "./ability-strategy"

export class HiddenPowerStrategy extends AbilityStrategy {
  copyable = false
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ): void {
    super.process(unown, board, target, crit)
    unown.state.triggerDeath(unown, null, board, AttackType.TRUE)
  }
}

export class HiddenPowerAStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const corners = [
      [0, 0],
      [board.columns - 1, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1]
    ]
    corners.forEach(([x, y]) => {
      const coord = unown.simulation.getClosestFreeCellTo(x, y, unown.team)
      if (!coord) return
      const abra = PokemonFactory.createPokemonFromName(Pkm.ABRA, unown.player)
      unown.simulation.addPokemon(abra, coord.x, coord.y, unown.team, true)
    })
  }
}

export class HiddenPowerBStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team != enemy.team) {
        enemy.status.triggerBurn(30000, enemy, unown)
      }
    })
  }
}

export class HiddenPowerCStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          pokemon.addItem(Item.AMULET_COIN)
        }
      }
    )
  }
}

export class HiddenPowerDStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const player = unown.player
    if (player && !unown.isGhostOpponent) {
      const x = getFirstAvailablePositionInBench(player.board)
      if (x !== null) {
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    if (!unown.isGhostOpponent && unown.player) {
      const egg = giveRandomEgg(unown.player, false)
      if (!egg) return
      egg.evolutionRule.evolutionTimer =
        egg.evolutionRule.getHatchTime(egg, unown.player) - 1
    }
  }
}

export class HiddenPowerFStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const nbFishes = 2
    const player = unown.player

    if (player && !unown.isGhostOpponent && !player.isBot) {
      for (let i = 0; i < nbFishes; i++) {
        const fish = unown.simulation.room.state.shop.pickFish(
          player,
          Item.SUPER_ROD
        )
        unown.simulation.room.spawnOnBench(player, fish, "fishing")
      }
    }
  }
}

export class HiddenPowerGStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    if (unown.player && !unown.isGhostOpponent) {
      unown.player.addMoney(5, true, unown)
    }
  }
}

export class HiddenPowerHStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          pokemon.handleHeal(pokemon.hp - pokemon.life, unown, 1, crit)
        }
      }
    )
  }
}

export class HiddenPowerIStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    if (unown.player && !unown.isGhostOpponent) {
      unown.player.items.push(pickRandomIn(ItemComponents))
    }
  }
}

export class HiddenPowerJStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const numberToSpawn = 2
    for (let i = 0; i < numberToSpawn; i++) {
      const coord = unown.simulation.getClosestFreeCellToPokemonEntity(unown)
      if (coord) {
        const sharpedo = unown.simulation.addPokemon(
          PokemonFactory.createPokemonFromName(Pkm.SHARPEDO, unown.player),
          coord.x,
          coord.y,
          unown.team,
          true
        )
        sharpedo.addItem(Item.RAZOR_CLAW)
      }
    }
  }
}

export class HiddenPowerKStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const coord = unown.simulation.getClosestFreeCellToPokemonEntity(unown)
    if (!coord) return
    const hitmonlee = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.HITMONLEE, unown.player),
      coord.x,
      coord.y,
      unown.team,
      true
    )
    hitmonlee.addItem(Item.RED_ORB)
    hitmonlee.pp = hitmonlee.maxPP - 1
  }
}

export class HiddenPowerLStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team !== pokemon.team) {
          pokemon.status.triggerLocked(5000, pokemon)
        }
      }
    )
  }
}

export class HiddenPowerMStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          const target = board.getEntityOnCell(pokemon.targetX, pokemon.targetY)
          if (target) {
            pokemon.addShield(50, unown, 1, false)
            AbilityStrategies[Ability.EXPLOSION].process(
              pokemon,
              board,
              target,
              false
            )
            pokemon.broadcastAbility({
              skill: Ability.EXPLOSION,
              targetX: target.positionX,
              targetY: target.positionY
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.player) {
      pokemon.player.board.forEach((p: IPokemon) => {
        if (p.canEat) {
          p.meal = pickRandomIn(Dishes as unknown as Item[])
        }
      })
    }
  }
}

export class HiddenPowerPStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const numberToSpawn = 5
    const bugs = PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[Synergy.BUG]
    const candidates = [...bugs.pokemons, ...bugs.additionalPokemons].filter(
      (p) => getPokemonData(p).stars === 1
    ) as Pkm[]
    const stageLevel = unown.simulation.stageLevel
    const commonWeight = min(0)(2 - stageLevel / 10)
    const uncommonWeight = min(0)(2 - stageLevel / 20)
    const rareWeight = 1
    const epicWeight = stageLevel / 10
    const ultraWeight = stageLevel / 20
    const candidatesWeights: { [pkm in Pkm]?: number } = {}
    candidates.forEach((p) => {
      const data = getPokemonData(p)
      if (data.rarity === Rarity.COMMON) {
        candidatesWeights[p] = commonWeight
      } else if (data.rarity === Rarity.UNCOMMON) {
        candidatesWeights[p] = uncommonWeight
      } else if (data.rarity === Rarity.RARE) {
        candidatesWeights[p] = rareWeight
      } else if (data.rarity === Rarity.EPIC) {
        candidatesWeights[p] = epicWeight
      } else if (data.rarity === Rarity.ULTRA) {
        candidatesWeights[p] = ultraWeight
      }
    })

    for (let i = 0; i < numberToSpawn; i++) {
      const bug = randomWeighted(candidatesWeights) ?? Pkm.WEEDLE
      const coord = unown.simulation.getClosestFreeCellToPokemonEntity(unown)
      if (coord) {
        unown.simulation.addPokemon(
          PokemonFactory.createPokemonFromName(bug, unown.player),
          coord.x,
          coord.y,
          unown.team,
          true
        )
      }
    }
  }
}

export class HiddenPowerQStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    unown.simulation.redTeam.clear()
    unown.simulation.blueTeam.clear()
  }
}

export class HiddenPowerRStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    if (unown.player && !unown.isGhostOpponent) {
      unown.player.shopFreeRolls += 6
    }
  }
}

export class HiddenPowerSStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    unown.simulation.triggerTidalWave(unown.team, 2, true)
  }
}

export class HiddenPowerTStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    if (unown.player && !unown.isGhostOpponent) {
      const player = unown.player
      pickNRandomIn(Berries, 3).forEach((item) => {
        player.items.push(item)
      })
    }
  }
}

export class HiddenPowerUStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const coord = unown.simulation.getClosestFreeCellToPokemonEntity(unown)
    if (!coord) return
    const uxie = unown.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.UXIE, unown.player),
      coord.x,
      coord.y,
      unown.team,
      true
    )
    uxie.addItem(Item.AQUA_EGG)
    uxie.pp = uxie.maxPP - 1
  }
}

export class HiddenPowerVStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team !== enemy.team) {
        AbilityStrategies[Ability.THUNDER_SHOCK].process(
          unown,
          board,
          enemy,
          false
        )
        unown.broadcastAbility({
          skill: Ability.THUNDER_SHOCK,
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })
      }
    })
  }
}

export class HiddenPowerWStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const player = unown.player
    if (player && !unown.isGhostOpponent) {
      const x = getFirstAvailablePositionInBench(player.board)
      if (x !== null) {
        const topSynergy = pickRandomIn(player.synergies.getTopSynergies())
        const monsOfThatSynergy =
          PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY[topSynergy]
        const candidates = [
          ...monsOfThatSynergy.pokemons,
          ...monsOfThatSynergy.additionalPokemons
        ].filter((p) => getPokemonData(p).stars === 1) as Pkm[]
        const stageLevel = unown.simulation.stageLevel
        const rareWeight = clamp(1.5 - stageLevel / 10, 0, 1)
        const epicWeight = clamp(
          stageLevel < 10 ? stageLevel / 10 : 2 - stageLevel / 10,
          0,
          1
        )
        const ultraWeight = min(0)(-1 + stageLevel / 10)
        const candidatesWeights: { [pkm in Pkm]?: number } = {}
        candidates.forEach((p) => {
          const data = getPokemonData(p)
          if (data.rarity === Rarity.RARE) {
            candidatesWeights[p] = rareWeight
          } else if (data.rarity === Rarity.EPIC) {
            candidatesWeights[p] = epicWeight
          } else if (data.rarity === Rarity.ULTRA) {
            candidatesWeights[p] = ultraWeight
          }
        })

        const pkm =
          randomWeighted(candidatesWeights) ??
          monsOfThatSynergy.pokemons[0] ??
          Pkm.KECLEON
        const pokemon = PokemonFactory.createPokemonFromName(pkm, player)
        pokemon.positionX = x
        pokemon.positionY = 0
        player.board.set(pokemon.id, pokemon)
        unown.simulation.room.checkEvolutionsAfterPokemonAcquired(player.id)
      }
    }
  }
}

export class HiddenPowerXStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach(
      (x: number, y: number, pokemon: PokemonEntity | undefined) => {
        if (pokemon && unown.team === pokemon.team) {
          pokemon.addItem(Item.XRAY_VISION)
        }
      }
    )
  }
}

export class HiddenPowerYStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && unown.team === ally.team) {
        AbilityStrategies[Ability.MEDITATE].process(ally, board, ally, false)
      }
    })
  }
}

export class HiddenPowerZStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && unown.team != enemy.team) {
        enemy.status.triggerFreeze(2000, enemy)
      }
    })
  }
}

export class HiddenPowerQMStrategy extends HiddenPowerStrategy {
  process(
    unown: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(unown, board, target, crit)
    const player = unown.player
    if (player && !unown.isGhostOpponent) {
      const stageLevel = unown.simulation.stageLevel
      const candidates = getUnownsPoolPerStage(stageLevel).filter(
        (u) => u !== Pkm.UNOWN_QUESTION
      )
      const nbUnownsObtained = 4
      for (let i = 0; i < nbUnownsObtained; i++) {
        const pkm = pickRandomIn(candidates)
        const x = getFirstAvailablePositionInBench(player.board)
        if (x !== null) {
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
      const coord = pokemon.simulation.getClosestFreeCellTo(x, y, pokemon.team)
      if (!coord) return
      const unownName = pickRandomIn(candidates)
      const unown = PokemonFactory.createPokemonFromName(
        unownName,
        pokemon.player
      )
      pokemon.simulation.addPokemon(unown, coord.x, coord.y, pokemon.team, true)
    })
  }
}
