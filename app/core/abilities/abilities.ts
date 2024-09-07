import { Ability } from "../../types/enum/Ability"
import { AbilityStrategy } from "./ability-strategy"
import {
  HiddenPowerAStrategy,
  HiddenPowerBStrategy,
  HiddenPowerCStrategy,
  HiddenPowerDStrategy,
  HiddenPowerEMStrategy,
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
  HiddenPowerQMStrategy,
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
} from "./hidden-power"

import { Transfer } from "../../types"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  DEFAULT_ATK_SPEED,
  EvolutionTime
} from "../../types/Config"
import { Effect } from "../../types/enum/Effect"
import { AttackType, BoardEvent, Team } from "../../types/enum/Game"
import { ArtificialItems, Berries, Item } from "../../types/enum/Item"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { Weather } from "../../types/enum/Weather"

import { createRandomEgg } from "../../models/egg-factory"
import PokemonFactory from "../../models/pokemon-factory"
import Board, { Cell } from "../board"
import { PokemonEntity, getStrongestUnit } from "../pokemon-entity"
import PokemonState from "../pokemon-state"

import { getFirstAvailablePositionInBench } from "../../utils/board"
import { distanceC, distanceM } from "../../utils/distance"
import { repeat } from "../../utils/function"
import { logger } from "../../utils/logger"
import { clamp, max, min } from "../../utils/number"
import { OrientationArray, effectInLine } from "../../utils/orientation"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  randomBetween,
  shuffleArray
} from "../../utils/random"
import { values } from "../../utils/schemas"
import { AbilityCommand } from "../simulation-command"
import { isOnBench } from "../../models/colyseus-models/pokemon"

export class BlueFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 50
    let multiplier = 0
    if (pokemon.effects.has(Effect.BLAZE)) {
      multiplier = 1
    } else if (pokemon.effects.has(Effect.VICTORY_STAR)) {
      multiplier = 2
    } else if (pokemon.effects.has(Effect.DROUGHT)) {
      multiplier = 3
    } else if (pokemon.effects.has(Effect.DESOLATE_LAND)) {
      multiplier = 4
    }
    damage += multiplier * 20

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class FusionBoltStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 50
    let multiplier = 0
    if (pokemon.effects.has(Effect.RISING_VOLTAGE)) {
      multiplier = 1
    } else if (pokemon.effects.has(Effect.OVERDRIVE)) {
      multiplier = 2
    } else if (pokemon.effects.has(Effect.POWER_SURGE)) {
      multiplier = 3
    }
    damage += multiplier * 40

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class BeatUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    for (let i = 0; i < pokemon.stars; i++) {
      const houndour = PokemonFactory.createPokemonFromName(
        Pkm.HOUNDOUR,
        pokemon.player
      )
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        pokemon,
        pokemon.team
      )
      const entity = pokemon.simulation.addPokemon(
        houndour,
        coord.x,
        coord.y,
        pokemon.team,
        true
      )
      entity.hp = Math.round(houndour.hp * (1 + pokemon.ap / 100))
      entity.life = Math.round(houndour.hp * (1 + pokemon.ap / 100))
    }
  }
}

export class PaydayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 30

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death && pokemon.player) {
      pokemon.player.money += pokemon.stars
      pokemon.count.moneyCount += pokemon.stars
    }
  }
}

export class PickupStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 30

    if (target.items.size > 0 && pokemon.items.size < 3) {
      const item = target.items.values().next().value
      target.items.delete(item)
      if (item === Item.MAX_REVIVE && target.status.resurection) {
        target.status.resurection = false
      }
      pokemon.items.add(item)
      pokemon.simulation.applyItemEffect(pokemon, item)
    } else {
      if (target.player) {
        const moneyStolen = max(target.player.money)(pokemon.stars)
        target.player.money -= moneyStolen
        if (pokemon.player) {
          pokemon.player.money += moneyStolen
          pokemon.count.moneyCount += moneyStolen
        }
      }
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MindBlownStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.count.mindBlownCount++
    target.handleSpecialDamage(
      pokemon.life / 2,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class SoftBoiledStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const shield = [30, 60, 120][pokemon.stars - 1] ?? 120
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          positionX: tg.positionX,
          positionY: tg.positionX,
          orientation: pokemon.orientation
        })
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.clearNegativeStatus()
      }
    })
  }
}

export class TeaTimeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = [20, 40, 80][pokemon.stars - 1] ?? 80
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          positionX: tg.positionX,
          positionY: tg.positionX,
          orientation: pokemon.orientation
        })
        tg.handleHeal(heal, pokemon, 1, crit)
        const berry = values(tg.items).find((item) => Berries.includes(item))
        if (berry) {
          tg.eatBerry(berry)
        }
      }
    })
  }
}

export class EarthquakeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 120
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (
        (tg && pokemon.team !== tg.team && pokemon.positionY === y) ||
        (tg && pokemon.team !== tg.team && pokemon.positionX === x)
      ) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        tg.count.earthquakeCount++
      }
    })
  }
}

export class SongOfDesireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const rank = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })

    const duration = 3000
    const count = 2
    for (let i = 0; i < count; i++) {
      const targetCharmed = rank[i]
      if (targetCharmed) {
        targetCharmed.status.triggerCharm(
          duration,
          targetCharmed,
          pokemon,
          true
        )
        targetCharmed.addAttack(-3, pokemon, 1, crit)
      }
    }
  }
}

export class SlackOffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.status.clearNegativeStatus()
    const healFactor =
      pokemon.stars === 3 ? 0.5 : pokemon.stars === 2 ? 0.4 : 0.3
    pokemon.handleHeal(pokemon.hp * healFactor, pokemon, 0.5, crit)
    pokemon.status.triggerSleep(5000, pokemon)
  }
}

export class ConfusingMindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const rank = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })

    const duration = 3000
    const count = 2
    for (let i = 0; i < count; i++) {
      const targetConfused = rank[i]
      if (targetConfused) {
        targetConfused.status.triggerConfusion(duration, targetConfused)
      }
    }
  }
}

export class KnowledgeThiefStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(
        pokemon,
        state,
        board,
        target,
        crit
      )
    }
    if (pokemon.player) {
      pokemon.player.experienceManager.addExperience(1)
    }
  }
}

export class WonderGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    let damage = 30
    if (pokemon.stars == 2) {
      damage = 60
    }
    if (pokemon.stars == 3) {
      damage = 120
    }

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerParalysis(3000, cell.value)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class IllusionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = pokemon.stars === 3 ? 70 : pokemon.stars === 2 ? 50 : 30
    pokemon.handleHeal(heal, pokemon, 0.5, crit)
    if (target) {
      pokemon.index = target.index
      pokemon.atk = Math.max(pokemon.atk, target.atk)
      pokemon.range = target.range + (pokemon.items.has(Item.WIDE_LENS) ? 2 : 0)
      pokemon.def = Math.max(pokemon.def, target.def)
      pokemon.speDef = Math.max(pokemon.speDef, target.speDef)
    }
  }
}

export class JudgementStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let synergyLevelsCount = 0
    const synergies = pokemon.player?.synergies
    if (synergies) {
      pokemon.types.forEach((type) => {
        synergyLevelsCount += synergies.get(type) ?? 0
      })
    }
    const damage = 10 * synergyLevelsCount
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ElectricSurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 10
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        pokemon.team == ally.team &&
        ally.types.has(Synergy.ELECTRIC)
      ) {
        ally.addAttackSpeed(buff, pokemon, 1, crit)
      }
    })
  }
}

export class PsychicSurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 5
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally !== pokemon &&
        pokemon.team == ally.team &&
        ally.types.has(Synergy.PSYCHIC)
      ) {
        ally.addAbilityPower(buff, pokemon, 1, crit)
      }
    })
  }
}

export class MistySurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const ppGain = 30
    const hpGain = 30
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && ally.types.has(Synergy.FAIRY)) {
        ally.addPP(ppGain, pokemon, 1, crit)
        ally.handleHeal(hpGain, pokemon, 1, crit)
      }
    })
  }
}

export class GrassySurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 5
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && ally.types.has(Synergy.GRASS)) {
        ally.addAttack(buff, pokemon, 1, crit)
      }
    })
  }
}

export class PsychicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [40, 80, 160][pokemon.stars - 1] ?? 160
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addPP(-15, pokemon, 0, false)
        cell.value.count.manaBurnCount++
      }
    })
  }
}

export class ChatterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 20
    const confusionChance = 0.5
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        if (chance(confusionChance)) {
          tg.status.triggerConfusion(1000, tg)
        }
      }
    })
  }
}

export class CorruptedNatureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
    } else if (pokemon.stars == 3) {
      damage = 80
    }
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerWound(5000, cell.value, pokemon)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class CrabHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 40
    if (pokemon.stars == 2) {
      damage = 80
    } else if (pokemon.stars == 3) {
      damage = 120
    }
    if (pokemon.items.has(Item.REAPER_CLOTH)) {
      crit = chance((3 * pokemon.critChance) / 100)
    }
    let attackType = AttackType.SPECIAL
    if (target.life / target.hp < 0.3) {
      damage = target.life
      attackType = AttackType.TRUE
    }
    target.handleSpecialDamage(damage, board, attackType, pokemon, crit)
  }
}

export class DiamondStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.round(2 * pokemon.def * (1 + pokemon.ap / 100))
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class DracoEnergyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.handleSpecialDamage(
      pokemon.life,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class DynamaxCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          Math.ceil(targetInLine.hp * 0.5),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class DynamicPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let duration = 1500
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
      duration = 3000
    } else if (pokemon.stars == 3) {
      damage = 80
      duration = 6000
    }
    target.status.triggerConfusion(duration, target)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ElectroBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team && tg.types.has(Synergy.ELECTRIC)) {
        tg.status.triggerRuneProtect(5000)
      }
    })
  }
}

export class AuroraVeilStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const runeProtectDuration = 500
    const shield = [5, 10, 15][pokemon.stars - 1] ?? 15

    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team) {
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.triggerRuneProtect(runeProtectDuration)
      }
    })
  }
}

export class TimeTravelStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team) {
        ally.handleHeal(25, pokemon, 1, crit)
        ally.status.clearNegativeStatus()
      }
    })

    if (pokemon.player && pokemon.player.canRegainLife) {
      pokemon.player.life = max(100)(pokemon.player.life + 1)
    }
  }
}

export class AquaJetStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 20
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3) {
      damage = 80
    }
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class SchoolingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 0.1 * pokemon.hp

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    if (pokemon.player) {
      pokemon.player.board.forEach((ally, id) => {
        if (ally && ally.name === Pkm.WISHIWASHI && isOnBench(ally)) {
          pokemon.addMaxHP(50, pokemon, 0, false)
          pokemon.refToBoardPokemon.hp += 50
          pokemon.player!.board.delete(id)
        }
      })
    }
  }
}

export class ElectroWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const steal = [15, 30, 60][pokemon.stars - 1] ?? 60
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 80
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.addAttackSpeed(-steal, pokemon, 1, crit)
          pokemon.addAttackSpeed(steal, pokemon, 1, crit)
        }
      })
  }
}

export class FireTrickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
    } else if (pokemon.stars == 3) {
      damage = 80
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const teleportationCell = board.getTeleportationCell(
      target.positionX,
      target.positionY
    )
    if (teleportationCell) {
      target.moveTo(teleportationCell.x, teleportationCell.y, board)
    }
  }
}

export class FlameChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)

    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y,
        orientation: pokemon.orientation
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class LeechSeedStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let duration = 3000
    let heal = 20
    if (pokemon.stars == 2) {
      duration = 6000
      heal = 40
    } else if (pokemon.stars == 3) {
      duration = 6000
      heal = 80
    }
    pokemon.handleHeal(heal, pokemon, 1, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}

export class LockOnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.effects.add(Effect.LOCK_ON)
  }
}

export class PsychUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 10
    let duration = 2000
    if (pokemon.stars == 2) {
      damage = 20
      duration = 4000
    } else if (pokemon.stars == 3) {
      damage = 80
      duration = 8000
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(duration, cell.value, pokemon)
      }
    })
  }
}

export class RazorWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(7000, cell.value)
      }
    })
  }
}

export class TwistingNetherStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInRadius(target.positionX, target.positionY, 2)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          80,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const teleportationCell = board.getTeleportationCell(
          cell.value.positionX,
          cell.value.positionY
        )
        if (teleportationCell) {
          cell.value.moveTo(teleportationCell.x, teleportationCell.y, board)
        } else {
          logger.error("unable to teleport pokemon", cell.value)
        }
      }
    })
  }
}

export class DarkVoidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 30
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        if (tg.status.silence) {
          tg.status.triggerSleep(2000, tg)
        }
      }
    })
  }
}

export class OverheatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        let damage = 30
        if (tg.status.burn) {
          damage = Math.round(damage * 1.3)
        }
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class HypnosisStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)
    if (farthestTarget) {
      const duration = Math.round(
        ([2000, 4000, 6000][pokemon.stars - 1] ?? 2000) * (1 + pokemon.ap / 200)
      )
      farthestTarget.status.triggerSleep(duration, farthestTarget)
    }
  }
}

export class KingShieldStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration = 1500
    const shield = [10, 20, 30][pokemon.stars - 1] ?? 30
    pokemon.status.triggerProtect(duration)
    pokemon.addShield(shield, pokemon, 1, crit)
    const farthestTarget = state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      pokemon.moveTo(farthestTarget.positionX, farthestTarget.positionY, board)
    }
  }
}

export class UTurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const shield = [15, 30, 50][pokemon.stars - 1] ?? 30
    pokemon.moveTo(target.positionX, target.positionY, board)
    pokemon.addShield(shield, pokemon, 1, crit)
    target.status.triggerCharm(1000, target, pokemon, false)
  }
}

export class PoisonJabStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [30, 60, 90][pokemon.stars - 1] ?? 30
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)
    if (farthestTarget) {
      farthestTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      farthestTarget.status.triggerPoison(3000, farthestTarget, pokemon)
      pokemon.status.triggerPoison(3000, pokemon, pokemon)
      pokemon.moveTo(farthestTarget.positionX, farthestTarget.positionY, board)
    }
  }
}

export class ExplosionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 50
        break
      case 2:
        damage = 100
        break
      case 3:
        damage = 200
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    pokemon.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class ClangorousSoulStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = [1, 2, 4][pokemon.stars - 1] ?? 1

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.addAttack(buff, pokemon, 1, crit)
        cell.value.addDefense(buff, pokemon, 1, crit)
        cell.value.addSpecialDefense(buff, pokemon, 1, crit)
      }
    })
  }
}

export class LiquidationStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    let reduce = 0
    switch (pokemon.stars) {
      case 1:
        damage = 20
        reduce = 2
        break
      case 2:
        damage = 40
        reduce = 4
        break
      case 3:
        damage = 80
        reduce = 8
        break
      default:
        break
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addDefense(-reduce, pokemon, 1, crit)
  }
}

export class BonemerangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 30
        break
      case 2:
        damage = 60
        break
      case 3:
        damage = 90
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && x == target.positionX) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class AuroraBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 25
        break
      case 2:
        damage = 50
        break
      case 3:
        damage = 100
        break
      default:
        break
    }

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        let freezeChance = 0
        if (pokemon.effects.has(Effect.CHILLY)) {
          freezeChance = 0.4
        } else if (pokemon.effects.has(Effect.FROSTY)) {
          freezeChance = 0.6
        } else if (pokemon.effects.has(Effect.FREEZING)) {
          freezeChance = 0.8
        } else if (pokemon.effects.has(Effect.SHEER_COLD)) {
          freezeChance = 1.0
        }
        if (chance(freezeChance)) {
          targetInLine.status.triggerFreeze(2000, target)
        }
      }
    })
  }
}

export class GrowlStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const atkDebuff = [3, 5, 7][pokemon.stars - 1] ?? 7
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerFlinch(3000, cell.value, pokemon)
          cell.value.addAttack(-atkDebuff, pokemon, 1, crit)
        }
      })
  }
}

export class RelicSongStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (pokemon.count.ult % 3 === 0) {
      const duration = Math.round(2000 * (1 + pokemon.ap / 200))
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team != tg.team) {
          tg.status.triggerSleep(duration, tg)
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: pokemon.skill,
            positionX: tg.positionX,
            positionY: tg.positionX,
            orientation: tg.orientation
          })
        }
      })
    }
  }
}

export class FairyWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const ppGain = [5, 10, 20][pokemon.stars - 1] ?? 0
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team === tg.team && tg.id !== pokemon.id) {
        tg.addPP(ppGain, pokemon, 1, crit)
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          positionX: tg.positionX,
          positionY: tg.positionY,
          orientation: tg.orientation
        })
      }
    })
  }
}

export class DisarmingVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerCharm(1000, target, pokemon, true)
      }
    })
  }
}

export class HighJumpKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    pokemon.addPP(target.pp, pokemon, 0, false)
    target.addPP(-target.pp, pokemon, 0, false)
    target.count.manaBurnCount++
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrassWhistleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let n = 0
    switch (pokemon.stars) {
      case 1:
        n = 1
        break
      case 2:
        n = 2
        break
      case 3:
        n = 4
        break
      default:
        break
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && n > 0) {
        tg.status.triggerSleep(2000, tg)
        n--
      }
    })
  }
}

export class TriAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const effect = randomBetween(1, 3)
    switch (effect) {
      case 1:
        target.status.triggerFreeze(2000, target)
        break
      case 2:
        target.status.triggerBurn(5000, target, pokemon)
        break
      case 3:
        target.status.triggerParalysis(5000, target)
        break
    }
  }
}

export class EchoStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let damage = 0
    let additional = 0

    switch (pokemon.stars) {
      case 1:
        damage = 3
        additional = 3
        break
      case 2:
        damage = 6
        additional = 6
        break
      case 3:
        damage = 9
        additional = 9
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(
          damage + pokemon.echo * additional,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    pokemon.echo++
  }
}

export class FutureSightStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)

    let damage = 0
    let count = 0

    switch (pokemon.stars) {
      case 1:
        damage = 15
        count = 5
        break
      case 2:
        damage = 30
        count = 5
        break
      case 3:
        damage = 60
        count = 5
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && count > 0) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        count--
        tg.count.futureSightCount++
      }
    })
  }
}

export class PetalDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)

    const damage = [20, 30, 50][pokemon.stars - 1] ?? 50
    const count = [3, 4, 5][pokemon.stars - 1] ?? 5

    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    const enemiesHit = enemies
      .sort(
        (a, b) =>
          distanceM(
            a.positionX,
            a.positionY,
            pokemon.positionX,
            pokemon.positionY
          ) -
          distanceM(
            b.positionX,
            b.positionY,
            pokemon.positionX,
            pokemon.positionY
          )
      )
      .slice(0, count)

    enemiesHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      enemy.count.petalDanceCount++
    })
  }
}

export class HyperVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const damage = [40, 80, 200][pokemon.stars - 1] ?? 200
    const confusionDuration = [1000, 2000, 3000][pokemon.stars - 1] ?? 3

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        tg.status.triggerConfusion(confusionDuration, tg)
      }
    })
  }
}
export class ShadowCloneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate) {
      const p = PokemonFactory.createPokemonFromName(pokemon.name)
      if (pokemon.items.size > 0) {
        const itemGiven = pickRandomIn(values(pokemon.items))
        p.items.add(itemGiven)
        pokemon.items.delete(itemGiven)
        if (itemGiven === Item.MAX_REVIVE && pokemon.status.resurection) {
          pokemon.status.resurection = false
        }
      }

      const clone = pokemon.simulation.addPokemon(
        p,
        farthestCoordinate.x,
        farthestCoordinate.y,
        pokemon.team
      )
      clone.hp = min(1)(Math.ceil(0.5 * pokemon.hp * (1 + pokemon.ap / 100)))
      clone.life = clone.hp
      clone.isClone = true
    }
  }
}

export class VoltSwitchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class AccelerockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate) {
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      const targetCoordinates = state.getNearestTargetAtRangeCoordinates(
        pokemon,
        board
      )
      if (targetCoordinates) {
        pokemon.targetX = targetCoordinates.x
        pokemon.targetY = targetCoordinates.y
        const target = board.getValue(targetCoordinates.x, targetCoordinates.y)
        if (target) {
          target.handleSpecialDamage(
            pokemon.atk,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
      }
    }

    const defLost = max(pokemon.def)(Math.round(5 * (1 + pokemon.ap / 100)))
    pokemon.addDefense(-defLost, pokemon, 0, false)
    pokemon.addAttackSpeed(defLost * 5, pokemon, 0, false)
    pokemon.cooldown = 0
  }
}

export class NuzzleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestTarget && farthestCoordinate) {
      const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
      const duration = [3000, 4000, 5000][pokemon.stars - 1] ?? 5000

      farthestTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
      farthestTarget.status.triggerParalysis(duration, farthestTarget)
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class HeadSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let damage, recoil
    if (pokemon.stars === 3) {
      damage = 150
      recoil = 15
    } else if (pokemon.stars === 2) {
      damage = 80
      recoil = 10
    } else {
      damage = 40
      recoil = 5
    }

    if (target.status.sleep || target.status.freeze) {
      target.handleSpecialDamage(
        target.life,
        board,
        AttackType.TRUE,
        pokemon,
        crit
      )
    } else {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
    pokemon.handleSpecialDamage(recoil, board, AttackType.TRUE, pokemon, crit)
  }
}

export class DoubleEdgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const damage = [55, 110, 220][pokemon.stars - 1] ?? 220
    const recoil = [20, 40, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    pokemon.handleSpecialDamage(
      recoil,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
  }
}

export class RockSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let d = 0
    let s = 0
    switch (pokemon.stars) {
      case 1:
        d = 20
        s = 3000
        break
      case 2:
        d = 40
        s = 6000
        break
      case 3:
        d = 80
        s = 9000
        break
      default:
        break
    }

    target.handleSpecialDamage(d, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerSilence(s, target, pokemon)
  }
}

export class RockTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const debuff = [10, 20, 40][pokemon.stars - 1] ?? 40

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAttackSpeed(-debuff, pokemon, 0, false)
  }
}

export class RoarOfTimeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const atkSpeedBuff = 20
    const candidates = board.cells.filter(
      (cell) => cell && cell.team === pokemon.team && !cell.status.resurection
    ) as PokemonEntity[]
    const strongest = getStrongestUnit(candidates)
    if (strongest) {
      strongest.status.resurection = true
      strongest.addAttackSpeed(atkSpeedBuff, pokemon, 1, true)
    }
  }
}

export class HealBlockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        cell.value.status.triggerWound(5000, cell.value, pokemon)
      }
    })
  }
}

export class SpikeArmorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration =
      pokemon.stars === 3 ? 10000 : pokemon.stars === 2 ? 5000 : 3000
    pokemon.status.triggerSpikeArmor(duration)
  }
}

export class OriginPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 100
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class SeedFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 30

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 5)
      .forEach((cell) => {
        if (cell.value && pokemon.team !== cell.value.team) {
          cell.value.addSpecialDefense(-2, pokemon, 0, false)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class NightmareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration = [1500, 3000, 8000][pokemon.stars - 1] ?? 8000
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100

    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team != enemy.team) {
        if (enemy.status.flinch || enemy.status.sleep || enemy.status.silence) {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
        enemy.status.triggerSilence(duration, enemy, pokemon)
      }
    })
  }
}

export class BurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let duration = 5000
    if (pokemon.stars === 2) {
      duration = 10000
    }
    if (pokemon.stars === 3) {
      duration = 20000
    }
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerBurn(duration, value, pokemon)
      }
    })
  }
}

export class PoisonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let duration = 0
    let count = 1

    switch (pokemon.stars) {
      case 1:
        duration = 3000
        count = 1
        break
      case 2:
        duration = 6000
        count = 2
        break
      case 3:
        duration = 9000
        count = 3
        break
      default:
        break
    }

    duration = Math.round(duration * (1 + pokemon.ap / 200))

    const closestEnemies = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team !== enemy.team) {
        closestEnemies.push(enemy)
      }
    })
    closestEnemies.sort((a, b) => {
      const distanceA = distanceC(
        a.positionX,
        a.positionY,
        pokemon.positionX,
        pokemon.positionY
      )
      const distanceB = distanceC(
        b.positionX,
        b.positionY,
        pokemon.positionX,
        pokemon.positionY
      )
      return distanceA - distanceB
    })

    for (let i = 0; i < count; i++) {
      const enemy = closestEnemies[i]
      if (enemy) {
        enemy.status.triggerPoison(duration, enemy, pokemon)
      }
    }
  }
}

export class BlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const freezeDuration = 2000
    const damage = [5, 10, 15][pokemon.stars - 1] ?? 15
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team != enemy.team) {
        enemy.status.triggerFreeze(freezeDuration, enemy)
        enemy.handleSpecialDamage(
          enemy.status.freeze ? damage * 2 : damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class ProtectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration = Math.round(
      ([1000, 3000, 5000][pokemon.stars - 1] ?? 5000) * (1 + pokemon.ap / 200)
    )
    pokemon.status.triggerProtect(duration)
  }
}

export class SleepStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const timer = Math.round(2000 * (1 + pokemon.ap / 100))
    const count = pokemon.stars
    const rank = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })
    for (let i = 0; i < count; i++) {
      const tg = rank[i]
      if (tg) {
        tg.status.triggerSleep(timer, tg)
      }
    }
  }
}

export class ConfusionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let timer = 0,
      damage = 0
    switch (pokemon.stars) {
      case 1:
        timer = 3000
        damage = 75
        break
      case 2:
        timer = 5000
        damage = 150
        break
      case 3:
        timer = 7000
        damage = 300
        break
      default:
        break
    }

    if (target.status.confusion) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      target.status.triggerSilence(timer, target, pokemon)
      target.status.triggerConfusion(timer, target)
    }
  }
}

export class FireBlastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 120
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SeismicTossStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 7
    if (pokemon.stars === 2) {
      damage = 14
    }
    if (pokemon.stars === 3) {
      damage = 28
    }

    let totalDamage = 0
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team == value.team) {
        totalDamage += damage
      }
    })
    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.TRUE,
      pokemon,
      crit
    )
  }
}

export class GuillotineStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.atk * pokemon.stars
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death) {
      pokemon.addPP(pokemon.maxPP, pokemon, 0, false)
    }
  }
}

export class RockSlideStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 120
    }

    if (target.types.has(Synergy.FLYING)) {
      damage = damage * 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WheelOfFireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [10, 20, 30][pokemon.stars - 1] ?? 30
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: "FLAME_HIT",
          positionX: cell.value.positionX,
          positionY: cell.value.positionY
        })

        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class InfernalParadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        const enemy = cell.value
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: "FLAME_HIT",
          positionX: enemy.positionX,
          positionY: enemy.positionY
        })

        if (Math.random() > 0.5) {
          enemy.status.triggerBurn(3000, cell.value, pokemon)
        }

        repeat(2)(() =>
          enemy.handleSpecialDamage(
            30,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        )
      }
    })
  }
}

export class HeatWaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 20
        break
      case 2:
        damage = 40
        break
      case 3:
        damage = 80
        break
      default:
        break
    }

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team != pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class HydroPumpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 25
        break
      case 2:
        damage = 50
        break
      case 3:
        damage = 100
        break
      default:
        break
    }

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class SolarBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    if (pokemon.simulation.weather === Weather.SUN) {
      damage = damage * 2
      pokemon.addPP(40, pokemon, 0, false)
    }
    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        if (pokemon.simulation.weather === Weather.SUN) {
          targetInLine.status.triggerBurn(3000, targetInLine, pokemon)
        }

        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class ThunderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 30
        break
      case 2:
        damage = 60
        break
      case 3:
        damage = 120
        break
      default:
        break
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class DracoMeteorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 50
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class BlazeKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    if (target.status.burn) {
      damage = Math.round(damage * 1.3)
    } else {
      target.status.triggerBurn(2000, target, pokemon)
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WishStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = 50
    let count = pokemon.stars

    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        pokemon.team == ally.team &&
        count > 0 &&
        ally.life < ally.hp
      ) {
        ally.handleHeal(heal, pokemon, 1, crit)
        count -= 1
      }
    })
  }
}

export class LunarBlessingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && ally.life < ally.hp) {
        ally.handleHeal(0.25 * pokemon.hp, pokemon, 1, crit)
        ally.status.clearNegativeStatus()
      }
    })
  }
}

export class NaturalGiftStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.life / a.hp - b.life / b.hp)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(
        pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30,
        pokemon,
        1,
        crit
      )
      lowestHealthAlly.status.triggerRuneProtect(pokemon.stars * 1000)
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.NATURAL_GIFT,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class CalmMindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 1
    pokemon.addAttack(buff * pokemon.baseAtk, pokemon, 1, crit)
  }
}

export class CosmicPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const apGain = 20
    board.forEach((x, y, ally) => {
      if (ally && ally.team === pokemon.team) {
        ally.addAbilityPower(apGain, pokemon, 1, crit)
      }
    })
  }
}

export class DefenseCurlStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let buff = 3
    if (pokemon.stars === 2) {
      buff = 6
    }
    if (pokemon.stars === 3) {
      buff = 12
    }
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
  }
}

export class IronDefenseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const shield = [20, 40, 80][pokemon.stars - 1] ?? 80
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && y === pokemon.positionY) {
        ally.addShield(shield, pokemon, 1, crit)
      }
    })
  }
}

export class SoakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addPP(10, pokemon, 0, false)
      }
    })
  }
}

export class IronTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 20
    let buff = 1
    if (pokemon.stars === 2) {
      damage = 40
      buff = 3
    }
    if (pokemon.stars === 3) {
      damage = 80
      buff = 5
    }
    pokemon.addDefense(buff, pokemon, 0, false)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class BlastBurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 30
        break
      case 2:
        damage = 60
        break
      case 3:
        damage = 120
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class ChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 0.25
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        pokemon.team == ally.team &&
        ally.types.has(Synergy.ELECTRIC)
      ) {
        ally.addAttack(ally.baseAtk * buff, pokemon, 1, crit)
        ally.addAttackSpeed(buff * 100, pokemon, 1, crit)
      }
    })
  }
}

export class SludgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const nbStacks = pokemon.stars === 1 ? 2 : pokemon.stars === 2 ? 3 : 4
    const duration = Math.round(
      3000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    const cells = board.getCellsInFront(pokemon, target)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        for (let i = 0; i < nbStacks; i++) {
          cell.value.status.triggerPoison(duration, cell.value, pokemon)
        }
      }
    })
  }
}

export class SludgeWaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const duration =
      pokemon.stars === 3 ? 6000 : pokemon.stars === 2 ? 4000 : 2000
    const damage = pokemon.stars === 3 ? 30 : pokemon.stars === 2 ? 20 : 10
    const potentials = board.cells
      .filter((p) => p && p.team !== pokemon.team)
      .sort((a, b) => b!.life - a!.life)
    const mostHpEnnemy = potentials[0]
    if (mostHpEnnemy) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: mostHpEnnemy.positionX,
        targetY: mostHpEnnemy.positionY,
        orientation: pokemon.orientation
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        mostHpEnnemy.positionX,
        mostHpEnnemy.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.status.triggerPoison(duration, cell.value, pokemon)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    }
  }
}

export class DischargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 25
        break
      case 2:
        damage = 50
        break
      case 3:
        damage = 75
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerParalysis(5000, cell.value)
      }
    })
  }
}

export class DiveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    const shield = [10, 20, 40][pokemon.stars - 1] ?? 40
    const freezeDuration = 1000
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    pokemon.addShield(shield, pokemon, 1, crit)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )

      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerFreeze(freezeDuration, cell.value)
        }
      })
    }
  }
}

export class SmokeScreenStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )

      const backRow = mostSurroundedCoordinate.y <= 2 ? 0 : 5
      const midRow = mostSurroundedCoordinate.y <= 2 ? 1 : 4
      const frontRow = mostSurroundedCoordinate.y <= 2 ? 2 : 3
      let chosenRowForSmoke = frontRow

      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: pokemon.positionX,
        targetY: pokemon.positionY,
        orientation: pokemon.orientation
      })

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: pokemon.skill,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: cell.x,
            targetY: cell.y,
            orientation: pokemon.orientation
          })

          if (cell.y === backRow) chosenRowForSmoke = backRow
          if (cell.y === midRow && chosenRowForSmoke !== backRow)
            chosenRowForSmoke = midRow
        }
      })

      const smokeCells = [
        [pokemon.positionX - 1, chosenRowForSmoke],
        [pokemon.positionX, chosenRowForSmoke],
        [pokemon.positionX + 1, chosenRowForSmoke]
      ].filter(
        ([x, y]) =>
          y >= 0 &&
          y < board.rows &&
          x >= 0 &&
          x < board.columns &&
          !(x === pokemon.positionX && y === pokemon.positionY)
      )

      smokeCells.forEach(([x, y]) => {
        const index = y * board.columns + x
        if (board.effects[index] !== Effect.GAS) {
          board.effects[index] = Effect.GAS
          pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
            simulationId: pokemon.simulation.id,
            type: BoardEvent.GAS,
            x,
            y
          })
        }

        const enemy = board.getValue(x, y)
        if (enemy) {
          enemy.effects.add(Effect.GAS)
        }
      })
    }
  }
}

export class BiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [40, 80, 120][pokemon.stars - 1] ?? 120
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    pokemon.handleHeal(Math.ceil(0.3 * takenDamage), pokemon, 1, crit)
    if (takenDamage > 0) target.status.triggerFlinch(5000, target, pokemon)
  }
}

export class AppleAcidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addDefense(-5, pokemon, 1, crit)
        cell.value.addSpecialDefense(-5, pokemon, 1, crit)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PsybeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 25

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(0.5)) {
          targetInLine.status.triggerConfusion(4000, targetInLine)
        }
      }
    })
  }
}

export class PresentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const chance = Math.random()
    /* 80 damage: 40%
       150 damage: 30%
       300 damage: 20%
       heal 50HP: 10%
    */
    if (chance < 0.1) {
      target.handleHeal(50, pokemon, 0, false)
    } else if (chance < 0.5) {
      target.handleSpecialDamage(80, board, AttackType.SPECIAL, pokemon, crit)
    } else if (chance < 0.8) {
      target.handleSpecialDamage(150, board, AttackType.SPECIAL, pokemon, crit)
    } else {
      target.handleSpecialDamage(300, board, AttackType.SPECIAL, pokemon, crit)
    }
  }
}

export class SacredSwordStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 100
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class LeafBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, true)
    const damage = Math.round(pokemon.atk * (1 + pokemon.ap / 100))
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      true,
      false
    )
  }
}

export class WaterfallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const shield = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus()
    board.effects[pokemon.positionY * board.columns + pokemon.positionX] =
      undefined
    pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
      simulationId: pokemon.simulation.id,
      type: "clear",
      x: pokemon.positionX,
      y: pokemon.positionY
    })
  }
}

export class XScissorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit) // twice
  }
}

export class DragonTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    const buff = [1, 2, 3][pokemon.stars - 1] ?? 3
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
  }
}

export class AquaTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    const shield = [30, 60, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addShield(shield, pokemon, 1, crit)
  }
}

export class DragonBreathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    const secondTarget = board.getValue(target.positionX, target.positionY + 1)
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.TRUE,
        pokemon,
        crit
      )
    }
  }
}

export class IcicleCrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 20
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3) {
      damage = 80
    }

    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class SteamEruptionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 80
    const burnDuration = 3000

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(burnDuration, cell.value, pokemon)
      }
    })
  }
}

export class RootStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = [10, 20, 40][pokemon.stars - 1] ?? 10
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 10
    const lockedDuration = 4000

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.handleHeal(heal, pokemon, 1, crit)
      } else if (cell.value && pokemon.team !== cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerLocked(lockedDuration, cell.value)
      }
    })
  }
}

export class TormentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const boost = [20, 40, 60][pokemon.stars - 1] ?? 60
    pokemon.addAttackSpeed(boost, pokemon, 1, crit)
    pokemon.cooldown = 500 / pokemon.atkSpeed
  }
}

export class StompStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damageFactor = 3
    if (pokemon.stars === 2) {
      damageFactor = 4
    } else if (pokemon.stars === 3) {
      damageFactor = 5
    }
    const damage = pokemon.atk * damageFactor
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class PaybackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 15
        break
      case 2:
        damage = 30
        break
      case 3:
        damage = 60
        break
      default:
        break
    }
    if (pokemon.life < 0.5 * pokemon.hp) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ShadowBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [40, 60, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    board.forEach((x: number, y: number, v: PokemonEntity | undefined) => {
      if (v && pokemon.team != v.team) {
        v.addSpecialDefense(-1, pokemon, 0, false)
      }
    })
  }
}

export class BugBuzzStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 20
        break
      case 2:
        damage = 40
        break
      case 3:
        damage = 80
        break
      default:
        break
    }

    if (target.status.paralysis) {
      damage *= 2
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class StringShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 10
        break
      case 2:
        damage = 20
        break
      case 3:
        damage = 50
        break
      default:
        break
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerParalysis(5000, target)
  }
}

export class EntanglingThreadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 10
        break
      case 2:
        damage = 20
        break
      case 3:
        damage = 40
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team !== cell.value.team) {
        cell.value.status.triggerParalysis(4000, target)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PoisonStingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 120
    }

    if (pokemon.status.poisonStacks > 0) {
      damage = damage * 2
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class LeechLifeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 20
        break
      case 2:
        damage = 40
        break
      case 3:
        damage = 80
        break
      default:
        break
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.handleHeal(damage, pokemon, 1, crit)
  }
}

export class HappyHourStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = [2, 5, 8][pokemon.stars - 1] ?? 8
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addAttack(buff, pokemon, 1, crit)
      }
    })
  }
}

export class TeleportStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, false) // crit is handled with TELEPORT_NEXT_ATTACK effect

    const potentialCells = [
      [0, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1],
      [board.columns - 1, 0]
    ]
    shuffleArray(potentialCells)

    for (let i = 0; i < potentialCells.length; i++) {
      const entity = board.getValue(potentialCells[i][0], potentialCells[i][1])
      if (entity === undefined) {
        pokemon.moveTo(potentialCells[i][0], potentialCells[i][1], board)
        pokemon.effects.add(Effect.TELEPORT_NEXT_ATTACK)
        break
      }
    }
  }
}

export class NastyPlotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 10
    pokemon.addAttack(buff, pokemon, 1, crit)
    pokemon.cooldown = 250
  }
}

export class TakeHeartStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttack(8, pokemon, 1, crit)
    pokemon.addSpecialDefense(4, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus()
    pokemon.cooldown = 250
  }
}

export class SpectralThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const damage = 80
    if (farthestCoordinate) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      const boostAtk = min(0)(target.atk - target.baseAtk)
      const boostAtkSpeed = min(0)(target.atkSpeed - DEFAULT_ATK_SPEED)
      const boostDef = min(0)(target.def - target.baseSpeDef)
      const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
      const boostAP = target.ap

      target.atk = target.baseAtk
      target.def = target.baseDef
      target.speDef = target.baseSpeDef
      pokemon.addAttack(boostAtk, pokemon, 0, false)
      pokemon.addDefense(boostDef, pokemon, 0, false)
      pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
      pokemon.addAbilityPower(boostAP, pokemon, 0, false)
      pokemon.addAttackSpeed(boostAtkSpeed, pokemon, 0, false)
    }
  }
}

export class ThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 15
    if (pokemon.stars === 2) {
      damage = 30
    }
    if (pokemon.stars === 3) {
      damage = 60
    }

    const l = target.items.size
    target.items.forEach((item) => {
      if (pokemon.items.size < 3) {
        pokemon.items.add(item)
        pokemon.simulation.applyItemEffect(pokemon, item)
      }
      target.items.delete(item)
      if (item === Item.MAX_REVIVE && target.status.resurection) {
        target.status.resurection = false
      }
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class KnockOffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 90 + target.items.size * 30

    target.items.forEach((item) => {
      target.items.delete(item)
      if (item === Item.MAX_REVIVE && target.status.resurection) {
        target.status.resurection = false
      }
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class StunSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 20
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerParalysis(5000, cell.value)
        }
      })
  }
}

export class MeteorMashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const nbHits = 3
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.addAttack(2, pokemon, 1, crit)
    for (let n = 0; n < nbHits; n++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class HurricaneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 25

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerParalysis(4000, targetInLine)
      }
    })
  }
}

export class FleurCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 120
    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
    pokemon.addAbilityPower(-20, pokemon, 0, false)
  }
}

export class SandsearStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerBurn(2000, targetInLine, pokemon)
      }
    })
  }
}

export class WildboltStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerParalysis(4000, targetInLine)
      }
    })
  }
}

export class BleakwindStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerFreeze(2000, targetInLine)
      }
    })
  }
}

export class SpringtideStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerCharm(4000, targetInLine, pokemon)
      }
    })
  }
}

export class FakeTearsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [3, 6, 9][pokemon.stars - 1] ?? 3

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerArmorReduction(3000, value)
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          positionX: value.positionX,
          positionY: value.positionX,
          orientation: value.orientation
        })
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class SparklingAriaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 60 : pokemon.stars === 2 ? 30 : 15

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      } else if (
        cell.value &&
        cell.value.team === pokemon.team &&
        cell.value.status.burn
      ) {
        cell.value.status.healBurn(cell.value)
      }
    })
  }
}

export class DragonDartsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 10

    for (let n = 0; n < 3; n++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
    if (target.life <= 0) {
      pokemon.addPP(40, pokemon, 0, false)
    }
  }
}

export class MetronomeStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const skill = pickRandomIn(
      (Object.keys(Ability) as Ability[]).filter(
        (a) => AbilityStrategies[a].copyable
      )
    )

    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: skill,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY,
      orientation: pokemon.orientation
    })

    AbilityStrategies[skill].process(pokemon, state, board, target, crit)
  }
}

export class SkyAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new AbilityCommand(() => {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.SKY_ATTACK,
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new AbilityCommand(() => {
          if (destination.target?.life > 0) {
            const damage = 120
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, 1000)
      )
    }
  }
}

export class FlyingPressStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new AbilityCommand(() => {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.FLYING_PRESS,
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new AbilityCommand(() => {
          if (destination.target && destination.target.life > 0) {
            const damage = 0.3 * pokemon.hp
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, 1000)
      )
    }
  }
}

export class AgilityStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const boost = [10, 20, 30][pokemon.stars - 1] ?? 30
    pokemon.addAttackSpeed(boost, pokemon, 1, crit)
    pokemon.cooldown = 0
  }
}

export class SpiritShackleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 30
        break
      case 2:
        damage = 60
        break
      case 3:
        damage = 90
        break
      default:
        break
    }

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerWound(4000, targetInLine, pokemon)
      }
    })
  }
}

export class WaterShurikenStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 20
        break
      case 2:
        damage = 40
        break
      case 3:
        damage = 60
        break
      default:
        break
    }

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    orientations.forEach((orientation) => {
      effectInLine(board, pokemon, orientation, (targetInLine) => {
        if (targetInLine.team !== pokemon.team) {
          targetInLine.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    })
  }
}

export class ShadowSneakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 50
    const damageType = target.status.silence
      ? AttackType.TRUE
      : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon, crit)
  }
}

export class PlasmaFistStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 120
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.handleHeal(damage * 0.25, pokemon, 1, crit)
  }
}

export class ForecastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      if (p && pokemon.team === p.team) {
        p.addShield(10, pokemon, 1, crit)
        if (pokemon.name === Pkm.CASTFORM_SUN) {
          p.addAttack(3, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_RAIN) {
          p.addPP(5, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_HAIL) {
          p.addDefense(2, pokemon, 1, crit)
          p.addSpecialDefense(2, pokemon, 1, crit)
        }
      }
    })
  }
}

export class MachPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 50
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.cooldown = 100
  }
}

export class UppercutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 60
    if (pokemon.def > target.def) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MawashiGeriStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 60
    if (pokemon.atk > target.atk) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class TripleKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 60

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    let count = 0
    cells.forEach((cell) => {
      if (cell.value && pokemon.team !== cell.value.team) {
        count++
        if (count <= 3) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
      }
    })
  }
}

export class GeomancyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttack(15, pokemon, 1, crit)
    pokemon.addSpecialDefense(5, pokemon, 1, crit)
    pokemon.addAttackSpeed(20, pokemon, 0, false)
  }
}

export class DeathWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 150
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (takenDamage > 0) {
      pokemon.handleHeal(Math.round(0.75 * takenDamage), pokemon, 0, false)
    }
  }
}

export class MimicStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(
        pokemon,
        state,
        board,
        target,
        crit
      )
    }
  }
}

export class HexStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    if (target.status.hasNegativeStatus()) {
      damage = damage * 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrowthStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let attackBuff = 5
    let hpBuff = [10, 20, 30][pokemon.stars - 1] ?? 30
    if (pokemon.simulation.weather === Weather.SUN) {
      attackBuff *= 2 // grows twice as fast if sunny weather
      hpBuff *= 2
    }
    pokemon.addAttack(attackBuff, pokemon, 1, crit)
    pokemon.addMaxHP(hpBuff, pokemon, 1, crit)
  }
}

export class HealOrderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const damage = pokemon.stars === 3 ? 65 : pokemon.stars === 2 ? 45 : 25

    cells.forEach((cell) => {
      if (cell.value) {
        if (cell.value.team !== pokemon.team) {
          cell.value.count.attackOrderCount++
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else {
          cell.value.count.healOrderCount++
          cell.value.handleHeal(damage, pokemon, 1, crit)
        }
      }
    })
  }
}

export class ShellTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.effects.add(Effect.SHELL_TRAP)
  }
}

export class DigStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class FireSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(3000, target, pokemon)
      }
    })
  }
}

export class SearingShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 40
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(3000, target, pokemon)
      }
    })
  }
}

export class PeckStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [10, 20, 30][pokemon.stars - 1] ?? 30
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SplashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    // does nothing, intentionally
  }
}

export class CounterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.max(0, pokemon.hp - pokemon.life)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PoisonPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 120
    }

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.status.triggerPoison(5000, target, pokemon)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class SilverWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 120
    }

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    pokemon.addAttack(1, pokemon, 0, false)
    pokemon.addDefense(1, pokemon, 0, false)
    pokemon.addSpecialDefense(1, pokemon, 0, false)
    pokemon.addAttackSpeed(10, pokemon, 0, false)
    pokemon.addAbilityPower(10, pokemon, 0, false)

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class IcyWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const attackSpeedDebuff = [10, 20, 40][pokemon.stars - 1] ?? 40

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.addAttackSpeed(-attackSpeedDebuff, pokemon, 0, false)
      }
    })
  }
}

export class GigatonHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 100
    if (pokemon.stars === 2) {
      damage = 200
    }
    if (pokemon.stars === 3) {
      damage = 400
    }
    pokemon.status.triggerSilence(6000, pokemon, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AcrobaticsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 20
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3) {
      damage = 80
    }
    if (pokemon.items.size === 0) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AbsorbStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 120
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team === pokemon.team) {
        cell.value.handleHeal(damage * 0.1, pokemon, 1, crit)
      }
    })
  }
}

export class RolloutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const multiplier = 5
    const defenseBoost = 5

    pokemon.addDefense(defenseBoost, pokemon, 1, crit)
    target.handleSpecialDamage(
      multiplier * pokemon.def,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class ThrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttack(pokemon.baseAtk, pokemon, 1, crit)
    pokemon.status.triggerConfusion(3000, pokemon)
  }
}

export class MagmaStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.status.triggerMagmaStorm(target, pokemon)
  }
}

export class SlashingClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 60 : pokemon.stars === 2 ? 30 : 15
    if (target.status.wound) {
      damage = Math.ceil(damage * 1.3)
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerWound(5000, target, pokemon)
  }
}

export class DireClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const status = pickRandomIn(["poison", "sleep", "paralysis"])
    switch (status) {
      case "poison":
        target.status.triggerPoison(3000, target, pokemon)
        break
      case "sleep":
        target.status.triggerSleep(3000, target)
        break
      case "paralysis":
        target.status.triggerParalysis(3000, target)
        break
    }
  }
}

export class FakeOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [50, 100, 150][pokemon.stars - 1] ?? 150
    if (pokemon.ap >= 0) target.status.triggerFlinch(3000, target)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(-30, pokemon, 0, false)
  }
}

export class FellStingerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [20, 40, 70][pokemon.stars - 1] ?? 30
    const victim = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (victim.death && !pokemon.isClone) {
      pokemon.addAbilityPower(5, pokemon, 0, false)
      pokemon.addAttack(1, pokemon, 0, false)
      pokemon.addMaxHP(10, pokemon, 0, false)
      pokemon.handleHeal(10, pokemon, 0, false)
      pokemon.refToBoardPokemon.atk += 1
      pokemon.refToBoardPokemon.ap += 5
      pokemon.refToBoardPokemon.hp += 10
    }
  }
}

export class EruptionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 50, 70][pokemon.stars - 1] ?? 30
    const numberOfProjectiles =
      pokemon.stars === 1 ? 20 : pokemon.stars === 2 ? 30 : 45

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new AbilityCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getValue(x, y)
          if (value && value.team !== pokemon.team) {
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.ERUPTION,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: x,
            targetY: y
          })
        }, i * 100)
      )
    }
  }
}

export class HailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 50
    const numberOfProjectiles = [10, 20, 30][pokemon.stars - 1] ?? 30

    for (let i = 0; i < numberOfProjectiles; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y =
        target.positionY >= 3
          ? randomBetween(3, BOARD_HEIGHT - 1)
          : randomBetween(0, 3)
      const enemyHit = board.getValue(x, y)
      if (enemyHit && enemyHit.team !== pokemon.team) {
        enemyHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        enemyHit.effects.add(Effect.HAIL)
        enemyHit.status.triggerFreeze(1000, enemyHit)
      }
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: "HAIL_PROJECTILE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: x,
        targetY: y
      })

      const index = y * board.columns + x
      if (board.effects[index] !== Effect.HAIL) {
        board.effects[index] = Effect.HAIL
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.HAIL,
          x,
          y
        })
      }
    }
  }
}

export class MistBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 30

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (
        targetInLine != null &&
        targetInLine.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          targetInLine.positionX,
          targetInLine.positionY
        ) <= 4
      ) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.addAbilityPower(-30, pokemon, 0, false)
      }
    })

    pokemon.commands.push(
      new AbilityCommand(() => {
        effectInLine(board, pokemon, target, (targetInLine) => {
          if (targetInLine != null && targetInLine.team !== pokemon.team) {
            targetInLine.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            targetInLine.addAbilityPower(-30, pokemon, 0, false)
          }
        })
      }, 1000)
    )
  }
}

export class LusterPurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 30

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (
        targetInLine != null &&
        targetInLine.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          targetInLine.positionX,
          targetInLine.positionY
        ) <= 4
      ) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.addSpecialDefense(-3, pokemon, 0, false)
      }
    })

    pokemon.commands.push(
      new AbilityCommand(() => {
        effectInLine(board, pokemon, target, (targetInLine) => {
          if (targetInLine != null && targetInLine.team !== pokemon.team) {
            targetInLine.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            targetInLine.addSpecialDefense(-3, pokemon, 0, false)
          }
        })
      }, 1000)
    )
  }
}

export class MudBubbleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}

export class LinkCableStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestTarget = state.getFarthestTarget(pokemon, board)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate && farthestTarget) {
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      pokemon.targetX = farthestTarget.positionX
      pokemon.targetY = farthestTarget.positionY
    }

    pokemon.commands.push(
      new AbilityCommand(() => {
        if (pokemon.life <= 0) return
        const partner = board.find(
          (x, y, entity) =>
            entity.skill === Ability.LINK_CABLE &&
            entity.id !== pokemon.id &&
            entity.team === pokemon.team
        )
        if (partner) {
          const damage = 50
          const targetsHit = new Set<PokemonEntity>()
          effectInLine(board, pokemon, partner, (targetInLine) => {
            if (targetInLine != null && targetInLine.team !== pokemon.team) {
              targetsHit.add(targetInLine)
            }
          })
          board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                targetsHit.add(cell.value)
              }
            })
          board
            .getAdjacentCells(partner.positionX, partner.positionY)
            .forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                targetsHit.add(cell.value)
              }
            })

          targetsHit.forEach((target) => {
            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          })
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: "LINK_CABLE_link",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: partner.positionX,
            targetY: partner.positionY
          })
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: "LINK_CABLE_discharge",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: pokemon.targetX,
            targetY: pokemon.targetY
          })
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: "LINK_CABLE_discharge",
            positionX: partner.positionX,
            positionY: partner.positionY,
            targetX: partner.targetX,
            targetY: partner.targetY
          })
        } else {
          const damage = 50
          const cells = board.getAdjacentCells(
            pokemon.positionX,
            pokemon.positionY
          )
          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: "LINK_CABLE_discharge",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: pokemon.targetX,
            targetY: pokemon.targetY
          })
        }
      }, 300)
    )
  }
}

export class MagicBounceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.status.triggerMagicBounce(5000)
  }
}

export class ShellSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 1 ? 15 : 30
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
    pokemon.addAbilityPower(20, pokemon, 0, false)
    pokemon.addAttack(2, pokemon, 0, false)
    pokemon.addAttackSpeed(20, pokemon, 0, false)
    pokemon.addDefense(-1, pokemon, 0, false)
    pokemon.addSpecialDefense(-1, pokemon, 0, false)
  }
}

export class HelpingHandStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const nbAlliesBuffed = 2
    const shield = [30, 60, 100][pokemon.stars - 1] ?? 100
    const allies = new Array<{ pkm: PokemonEntity; distance: number }>()
    board.forEach((x, y, cell) => {
      if (cell && cell.team === pokemon.team && pokemon.id !== cell.id) {
        allies.push({
          pkm: cell,
          distance: distanceM(
            pokemon.positionX,
            pokemon.positionY,
            cell.positionX,
            cell.positionY
          )
        })
      }
    })
    allies.sort((a, b) => a.distance - b.distance)
    for (let i = 0; i < nbAlliesBuffed; i++) {
      const ally = allies[i]?.pkm
      if (ally) {
        ally.status.doubleDamage = true
        ally.addShield(shield, pokemon, 1, crit)
        ally.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.HELPING_HAND,
          positionX: ally.positionX,
          positionY: ally.positionY
        })
      }
    }
  }
}

export class AstralBarrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damagePerGhost = 20

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbGhosts = 3 * (1 + (2 * pokemon.ap) / 100)
    for (let i = 0; i < nbGhosts; i++) {
      const randomTarget = pickRandomIn(enemies)
      pokemon.commands.push(
        new AbilityCommand(() => {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.ASTRAL_BARRAGE,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: randomTarget.positionX,
            targetY: randomTarget.positionY,
            orientation: pokemon.orientation
          })
          if (randomTarget?.life > 0) {
            randomTarget.handleSpecialDamage(
              damagePerGhost,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, 100 * i)
      )
    }
  }
}

export class PyroBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10

    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: pokemon.skill,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: farthestTarget.positionX,
      targetY: farthestTarget.positionY,
      orientation: pokemon.orientation
    })

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        cell.value.status.triggerBurn(2000, cell.value, pokemon)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class WhirlpoolStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit, true)

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: cell.x,
          targetY: cell.y,
          orientation: pokemon.orientation
        })
        for (let i = 0; i < 4; i++) {
          cell.value.handleSpecialDamage(
            Math.ceil(pokemon.atk * 1.25),
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        break
      }
    }
  }
}

export class AnchorShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit, true)
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const emptyCellsAround = shuffleArray(
      adjacentCells
        .filter((v) => v.value === undefined)
        .map((v) => ({ x: v.x, y: v.y }))
    )
    if (emptyCellsAround.length > 0) {
      const destination = emptyCellsAround[0]
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.ANCHOR_SHOT,
        targetX: farthestTarget.positionX,
        targetY: farthestTarget.positionY
      })
      farthestTarget.moveTo(destination.x, destination.y, board)
      farthestTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      farthestTarget.cooldown = min(500)(farthestTarget.cooldown)
    }
  }
}

export class SmogStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = pokemon.stars === 1 ? 10 : pokemon.stars === 2 ? 20 : 40

    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.GAS) {
        board.effects[index] = Effect.GAS
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.GAS,
          x: cell.x,
          y: cell.y
        })
      }

      if (cell.value) {
        cell.value.effects.add(Effect.GAS)
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }
    })
  }
}

export class ShelterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const defGain = [3, 6, 12][pokemon.stars - 1] ?? 12
    pokemon.addDefense(defGain, pokemon, 1, crit)
    const cells = board.getCellsInFront(pokemon, target)
    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.GAS) {
        board.effects[index] = Effect.GAS
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.GAS,
          x: cell.x,
          y: cell.y
        })
      }

      if (cell.value) {
        cell.value.effects.add(Effect.GAS)
      }
    })
  }
}

export class MagnetRiseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const nbAlliesBuffed = [2, 4, 6][pokemon.stars - 1] ?? 6
    const alliesBuffed = (
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY)
        .map((cell) => cell.value)
        .filter((mon) => mon && mon.team === pokemon.team) as PokemonEntity[]
    )
      .sort((a, b) => a.life - b.life)
      .slice(0, nbAlliesBuffed)

    alliesBuffed.push(pokemon)
    alliesBuffed.forEach((ally) => {
      ally.status.triggerProtect(2000)
      ally.addDodgeChance(0.1, pokemon, 1, crit)
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: ally.simulation.id,
        skill: Ability.MAGNET_RISE,
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })
  }
}

export class AttractStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const targets = pickNRandomIn(
      board.cells.filter((v) => v && v.team !== pokemon.team),
      pokemon.stars
    )
    targets?.forEach((t) => {
      if (t) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.ATTRACT,
          positionX: t.positionX,
          positionY: t.positionY
        })
        t?.status.triggerCharm(1000, t, pokemon, true)
      }
    })
  }
}

export class WaterPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [75, 150][pokemon.stars - 1] ?? 75
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .concat(target)
      .forEach((v) => {
        if (v) {
          v.status.triggerConfusion(2000, v)
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class PlayRoughStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.status.triggerCharm(2500, target, pokemon, false)
    target.handleSpecialDamage(
      pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class AerialAceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class ParabolicChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = pokemon.stars > 1 ? 50 : 25
    const overHeal = Math.max(0, heal + pokemon.life - pokemon.hp)
    pokemon.handleHeal(heal, pokemon, 0, false)
    target.handleSpecialDamage(
      (pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25) + overHeal,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class SuperFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 90 : pokemon.stars === 2 ? 60 : 30
    if (target.types.has(Synergy.GRASS)) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class TeeterDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttackSpeed(20, pokemon, 1, crit)
    board.cells
      .filter((v) => v !== undefined)
      .forEach((v) => v && v.status.triggerConfusion(3000, v))
  }
}

export class CloseCombatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addDefense(-3, pokemon, 0, false)
    pokemon.addSpecialDefense(-3, pokemon, 0, false)
    target.handleSpecialDamage(130, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AssistStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const skill = pickRandomIn(
      board.cells
        .filter(
          (v) =>
            v &&
            v.team === pokemon.team &&
            v.skill &&
            AbilityStrategies[v.skill].copyable
        )
        .map((v) => v?.skill)
    )
    if (skill) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: target.positionX,
        targetY: target.positionY,
        orientation: pokemon.orientation
      })
      AbilityStrategies[skill].process(pokemon, state, board, target, crit)
    }
  }
}

export class FissureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const numberOfRifts = pokemon.stars === 3 ? 4 : pokemon.stars === 2 ? 3 : 2
    for (let i = 0; i < numberOfRifts; i++) {
      const x_ = randomBetween(0, BOARD_WIDTH - 1)
      const y_ = randomBetween(0, BOARD_HEIGHT - 1)
      const cells = board.getAdjacentCells(x_, y_)
      cells.push({ x: x_, y: y_, value: board.getValue(x_, y_) })

      cells.forEach((cell) => {
        if (cell && cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            pokemon.stars === 3 ? 75 : pokemon.stars === 2 ? 50 : 25,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.FISSURE,
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: cell.x,
          targetY: cell.y
        })
      })
    }
  }
}

export class AssuranceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25

    target.handleSpecialDamage(
      pokemon.life / pokemon.hp < 0.5 ? damage * 2 : damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class AquaRingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(target, board)
    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )

      const cells = board.getAdjacentCells(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y
      )
      cells.push({
        x: mostSurroundedCoordinate.x,
        y: mostSurroundedCoordinate.y,
        value: board.getValue(
          mostSurroundedCoordinate.x,
          mostSurroundedCoordinate.y
        )
      })

      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus()
          cell.value.handleHeal(
            pokemon.stars === 3 ? 50 : pokemon.stars === 2 ? 30 : 20,
            pokemon,
            1,
            crit
          )
        }
      })
    }
  }
}

export class LungeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const enemiesSortedByAttack = board.cells
      .filter((enemy) => enemy && enemy.team !== pokemon.team)
      .sort((a, b) => b!.atk - a!.atk) as PokemonEntity[]

    let cellToGo: Cell | undefined
    let enemy: PokemonEntity | undefined
    while (cellToGo == null && enemiesSortedByAttack.length > 0) {
      enemy = enemiesSortedByAttack.shift()
      if (enemy) {
        cellToGo = board
          .getAdjacentCells(enemy.positionX, enemy.positionY)
          .find((cell) => cell.value == null)
      }
    }

    if (cellToGo) {
      pokemon.moveTo(cellToGo.x, cellToGo.y, board)
      if (enemy) {
        enemy.addAttack(-5, pokemon, 1, crit)
        enemy.handleSpecialDamage(
          50,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
      }
    }
  }
}

export class PoisonGasStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.POISON_GAS) {
        board.effects[index] = Effect.POISON_GAS
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.POISON_GAS,
          x: cell.x,
          y: cell.y
        })
      }

      if (cell.value) {
        cell.value.effects.add(Effect.POISON_GAS)
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerPoison(3000, cell.value, pokemon)
        }
      }
    })
  }
}

export class BraveBirdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const flyAwayCell = board.getFlyAwayCell(
      pokemon.positionX,
      pokemon.positionY
    )
    if (flyAwayCell) {
      pokemon.moveTo(flyAwayCell.x, flyAwayCell.y, board)
      const adjacentEmptyCells = board
        .getAdjacentCells(flyAwayCell.x, flyAwayCell.y)
        .filter((v) => v.value === undefined)
      if (adjacentEmptyCells.length > 0) {
        const cell = adjacentEmptyCells[0]
        target.moveTo(cell.x, cell.y, board)
        target.handleSpecialDamage(
          pokemon.stars === 3 ? 90 : pokemon.stars === 2 ? 60 : 30,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class MagicalLeafStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        cell.value.status.triggerArmorReduction(3000, cell.value)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class StealthRocksStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target, 2)
    const damage = 50

    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.STEALTH_ROCKS) {
        board.effects[index] = Effect.STEALTH_ROCKS
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.STEALTH_ROCKS,
          x: cell.x,
          y: cell.y
        })
      }

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.STEALTH_ROCKS,
        positionX: cell.x,
        positionY: cell.y
      })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.effects.add(Effect.STEALTH_ROCKS)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class SpikesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const nbSpikes = Math.round(6 * (1 + pokemon.ap / 100))
    const cells = pickNRandomIn(
      board.getCellsInFront(pokemon, target, 3),
      nbSpikes
    )
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100

    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.SPIKES) {
        board.effects[index] = Effect.SPIKES
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.SPIKES,
          x: cell.x,
          y: cell.y
        })
      }

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.SPIKES,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: cell.x,
        targetY: cell.y
      })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.effects.add(Effect.SPIKES)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class StickyWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target, 2)
    const damage = pokemon.stars === 3 ? 70 : pokemon.stars === 2 ? 35 : 20

    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.STICKY_WEB) {
        board.effects[index] = Effect.STICKY_WEB
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.STICKY_WEB,
          x: cell.x,
          y: cell.y
        })
      }

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.STICKY_WEB,
        positionX: cell.x,
        positionY: cell.y
      })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.effects.add(Effect.STICKY_WEB)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class StruggleBugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addAbilityPower(-50, pokemon, 0, false)
        cell.value.handleSpecialDamage(
          30,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class QuiverDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttack(5, pokemon, 1, crit)
    pokemon.addSpecialDefense(5, pokemon, 1, crit)
    pokemon.addAttackSpeed(20, pokemon, 1, crit)
    pokemon.addAbilityPower(20, pokemon, 0, false)
  }
}

export class TailGlowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    pokemon.addAbilityPower(50, pokemon, 0, false)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          30,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PrismaticLaserStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const affectedCells = board.cells.filter(
      (v) =>
        v &&
        v.team !== pokemon.team &&
        (v.positionX === pokemon.positionX ||
          v.positionX === pokemon.positionX - 1 ||
          v.positionX === pokemon.positionX + 1)
    )

    affectedCells.forEach((tg) => {
      if (tg) {
        tg.handleSpecialDamage(80, board, AttackType.SPECIAL, pokemon, crit)
        const teleportationCell = board.getTeleportationCell(
          tg.positionX,
          tg.positionY
        )
        if (teleportationCell) {
          tg.moveTo(teleportationCell.x, teleportationCell.y, board)
        } else {
          logger.error("unable to teleport pokemon", tg)
        }
      }
    })
  }
}

export class NightShadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.ceil(
      ([0.25, 0.33, 0.5][pokemon.stars - 1] ?? 0.5) *
        target.hp *
        (1 + (0.5 * pokemon.ap) / 100)
    )
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class ChargeBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, false)
    const chain = [target]
    const NB_MAX_TARGETS = 3
    for (
      let n = 1, x = target.positionX, y = target.positionY;
      n < NB_MAX_TARGETS;
      n++
    ) {
      const nextCell = board
        .getAdjacentCells(x, y)
        .find(
          (cell) =>
            cell.value &&
            cell.value.team === target.team &&
            !chain.includes(cell.value)
        )
      if (nextCell) {
        chain.push(nextCell.value!)
        x = nextCell.x
        y = nextCell.y
      }
    }

    for (let i = 0; i < chain.length; i++) {
      const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
      chain[i].handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      const previous = i === 0 ? pokemon : chain[i - 1]
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: "LINK_CABLE_link", // reuse anim
        positionX: previous.positionX,
        positionY: previous.positionY,
        targetX: chain[i].positionX,
        targetY: chain[i].positionY
      })
    }
  }
}

export class PopulationBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 10
    const numberOfAttacks = Math.round(
      ([4, 8, 12, 16][pokemon.stars - 1] ?? 8) * (1 + pokemon.ap / 100)
    )
    for (let i = 0; i < numberOfAttacks; i++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        false
      )
    }
  }
}

export class ScreechStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const debuff = pokemon.stars === 3 ? -4 : pokemon.stars === 2 ? -2 : -1
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addDefense(debuff, pokemon, 1, crit)
        cell.value.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.SCREECH,
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
      }
    })
  }
}

export class SandTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.status.triggerParalysis(
      pokemon.stars === 3 ? 8000 : pokemon.stars === 2 ? 5000 : 3000,
      target
    )
    target.status.triggerSilence(
      pokemon.stars === 3 ? 8000 : pokemon.stars === 2 ? 5000 : 3000,
      target,
      pokemon
    )
    target.handleSpecialDamage(
      pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
  }
}

export class WhirlwindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const x = target.positionX
    const y = target.positionY
    target.flyAway(board)
    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: Ability.WHIRLWIND,
      positionX: x,
      positionY: y,
      targetX: target.positionX,
      targetY: target.positionY
    })
    target.handleSpecialDamage(
      pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 80 : 40,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
  }
}

export class EmptyLightStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    let tg: PokemonEntity | undefined = target
    const affectedTargetsIds = new Array<string>()
    for (let i = 0; i < 5; i++) {
      if (tg) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.EMPTY_LIGHT,
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: tg.positionX,
          targetY: tg.positionY
        })
        tg.addSpecialDefense(-3, pokemon, 0, false)
        tg.handleSpecialDamage(33, board, AttackType.SPECIAL, pokemon, crit)
        affectedTargetsIds.push(tg.id)
        const cells = board.getAdjacentCells(tg.positionX, tg.positionY)
        tg = cells
          .filter(
            (v) =>
              v.value &&
              v.value.team !== pokemon.team &&
              !affectedTargetsIds.includes(v.value.id)
          )
          .map((v) => v.value)[0]
      } else {
        break
      }
    }
  }
}

export class UnboundStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.index = PkmIndex[Pkm.HOOPA_UNBOUND]
    pokemon.skill = Ability.HYPERSPACE_FURY
    pokemon.addAttack(10, pokemon, 0, false)
    pokemon.addMaxHP(100, pokemon, 0, false)
    pokemon.toMovingState()
  }
}

export class HyperSpaceFury extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const nbHits = 4 * (1 + pokemon.ap / 100)
    for (let i = 0; i < nbHits; i++) {
      target.addDefense(-1, pokemon, 0, false)
      target.handleSpecialDamage(
        15,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
    }
    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: Ability.HYPERSPACE_FURY,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY,
      orientation: nbHits // use orientation field for the number of hits
    })
  }
}

export class SnipeShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    const farthestTarget = state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, state, board, farthestTarget, crit)

    if (farthestTarget) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestTarget.positionX,
        farthestTarget.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    }
  }
}

export class AirSlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25
    target.status.triggerFlinch(7000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EggsplosionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 140 : pokemon.stars === 2 ? 80 : 40
    const kill = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (kill.death && Math.random() < 0.3) {
      const egg = createRandomEgg(false)
      const player = pokemon.player
      if (player) {
        const x = getFirstAvailablePositionInBench(player.board)
        if (x !== undefined) {
          egg.positionX = x
          egg.positionY = 0
          egg.evolutionRule.evolutionTimer = EvolutionTime.EGG_HATCH
          player.board.set(egg.id, egg)
        }
      }
    }
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .concat(target)
      .forEach((v) => {
        if (v) {
          v.status.triggerArmorReduction(4000, v)
        }
      })
  }
}

export class BodySlamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.round(0.3 * pokemon.hp * (1 + pokemon.hp / 100))
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
  }
}

export class VineWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .concat(target)
      .forEach((v) => {
        if (v) {
          v.status.triggerFlinch(3000, v, pokemon)
        }
      })
    target.handleSpecialDamage(100, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class BarbBarrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      board
        .getAdjacentCells(target.positionX, target.positionY)
        .map((v) => v.value)
        .filter((v) => v?.team === target.team)
        .concat(target)
        .forEach((v) => {
          if (v) {
            v.status.triggerPoison(3000, v, pokemon)
            pokemon.simulation.room.broadcast(Transfer.ABILITY, {
              id: pokemon.simulation.id,
              skill: Ability.BARB_BARRAGE,
              positionX: pokemon.positionX,
              positionY: pokemon.positionY,
              targetX: v.positionX,
              targetY: v.positionY,
              orientation: v.orientation
            })
          }
        })
      target.handleSpecialDamage(
        pokemon.stars === 3 ? 60 : pokemon.stars === 2 ? 30 : 15,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class FloralHealingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // we explicitely not trigger super.process() so that the pokemon doesn't get twice the oncast effects
    pokemon.handleHeal(pokemon.maxPP, pokemon, 0, false)
  }
}

export class MagicPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const shield = [10, 20, 40][pokemon.stars - 1] ?? 40
    const silenceDuration = [2000, 3000, 4000][pokemon.stars - 1] ?? 4000
    pokemon.addShield(shield, pokemon, 1, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerSilence(silenceDuration, cell.value, pokemon)
        }
      })
  }
}

export class RetaliateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const nbAlliesAlive = board.cells.filter(
      (entity) => entity && entity.team === pokemon.team
    ).length
    const nbFallenAllies =
      (pokemon.player?.boardSize ?? nbAlliesAlive) - nbAlliesAlive
    const damage =
      ([15, 30, 60][pokemon.stars - 1] ?? 60) +
      ([10, 15, 25][pokemon.stars - 1] ?? 15) * nbFallenAllies
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class SlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const increasedCrit = crit
      ? crit
      : pokemon.stars === 3
        ? chance(0.9)
        : pokemon.stars === 2
          ? chance(0.6)
          : chance(0.3)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      increasedCrit
    )
  }
}

export class OutrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    pokemon.status.triggerConfusion(2000, pokemon)
    const damage = Math.round(
      ([1, 1.5, 2][pokemon.stars - 1] ?? 2) * pokemon.atk
    )
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .concat(target)
      .forEach((v) => {
        if (v) {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.OUTRAGE,
            targetX: v.positionX,
            targetY: v.positionY
          })
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class FishiousRendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    // deals 80 special damage. Double damage if attacker got more atk speed than target.
    const damage = 80 * (pokemon.atkSpeed > target.atkSpeed ? 2 : 1)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class GoldRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const goldDamage = pokemon.player?.money ? pokemon.player?.money : 0
    const damage = 20 + goldDamage
    if (pokemon.player) {
      pokemon.player.money += 2
    }
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class MakeItRainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const goldDamage = pokemon.player?.money ? pokemon.player?.money : 0
    const damage = 100 + goldDamage

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class RecoverStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    pokemon.handleHeal(0.25 * pokemon.hp, pokemon, 1, crit)
  }
}

export class CurseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    enemies.sort((a, b) => (a.status.curse ? +1 : b.hp - a.hp))
    const enemyWithHighestHP = enemies[0]
    const curseDelay =
      ([12000, 8000, 4000][pokemon.stars - 1] ?? 4000) *
      (1 - (0.2 * pokemon.ap) / 100)
    enemyWithHighestHP.status.triggerCurse(curseDelay)
  }
}

export class DoomDesireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    pokemon.commands.push(
      new AbilityCommand(() => {
        if (target && target.life > 0) {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.JUDGEMENT,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: target.positionX,
            targetY: target.positionY
          })
          target.handleSpecialDamage(
            150,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        } else {
          pokemon.addPP(60, pokemon, 0, false)
        }
      }, 2000)
    )
  }
}

export class PoltergeistStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    target.items.forEach(
      (item) => (damage += ArtificialItems.includes(item) ? 40 : 20)
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class CrushGripStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.round(20 + (pokemon.life / pokemon.hp) * 180)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit,
      true
    )
  }
}

export class AuraSphereStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 25
    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.status.triggerSilence(3000, targetInLine, pokemon)
      }
    })
  }
}

export class SketchStrategy extends AbilityStrategy {
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

export class LovelyKissStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    if (target.status.sleep) {
      const damage = [50, 100, 150][pokemon.stars - 1] ?? 50
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      const duration = Math.round(
        ([2000, 4000, 6000][pokemon.stars - 1] ?? 2000) * (1 + pokemon.ap / 100)
      )
      target.status.triggerSleep(duration, target)
    }
  }
}

export class OverdriveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getCellsInRadius(target.positionX, target.positionY, 3)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        const distance = distanceC(
          cell.x,
          cell.y,
          pokemon.positionX,
          pokemon.positionY
        )
        const damage = pokemon.atk * (1.2 - 0.2 * (distance - 1))
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
      }
    })
  }
}

export class TransformStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (target) {
      pokemon.index = target.index
      pokemon.rarity = target.rarity
      pokemon.stars = target.stars
      pokemon.skill = target.skill
      pokemon.passive = target.passive
      pokemon.baseAtk = target.atk
      pokemon.baseDef = target.def
      pokemon.baseSpeDef = target.speDef
      pokemon.baseRange = target.baseRange
      pokemon.atk = target.atk
      pokemon.atkSpeed = target.atkSpeed
      pokemon.def = target.def
      pokemon.speDef = target.speDef
      pokemon.attackType = target.attackType
      pokemon.ap = target.ap
      pokemon.maxPP = target.maxPP
      pokemon.atkSpeed = target.atkSpeed
      pokemon.critChance = target.critChance
      pokemon.critPower = target.critPower
      pokemon.range = target.range
      pokemon.attackSprite = target.attackSprite
      pokemon.shiny = target.shiny
      pokemon.emotion = target.emotion
      pokemon.dodge = target.dodge
    }
  }
}

export class PsychicFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.handleSpecialDamage(
      100,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit,
      true
    )
    target.atk = Math.min(target.atk, target.baseAtk)
    target.def = Math.min(target.def, target.baseDef)
    target.speDef = Math.min(target.speDef, target.baseSpeDef)
  }
}

export class ShedTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.life / a.hp - b.life / b.hp)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.addShield(80, pokemon, 1, crit)
      const substitute = PokemonFactory.createPokemonFromName(
        Pkm.SUBSTITUTE,
        pokemon.player
      )
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        lowestHealthAlly,
        lowestHealthAlly.team
      )
      pokemon.moveTo(coord.x, coord.y, board)
      pokemon.simulation.addPokemon(substitute, x, y, pokemon.team, true)
    }
  }
}

export class ShadowPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.life / a.hp - b.life / b.hp)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoardToPokemon(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      pokemon.orientation = board.orientation(
        coord.x,
        coord.y,
        pokemon.positionX,
        pokemon.positionY,
        pokemon,
        lowestHealthEnemy
      )
      pokemon.moveTo(coord.x, coord.y, board)
      pokemon.effects.add(Effect.SHADOW_PUNCH_NEXT_ATTACK)
    }
  }
}

export class MagnetBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    const centerDamage = [20, 40, 80][pokemon.stars - 1] ?? 80

    target.handleSpecialDamage(
      centerDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    const mappingAttractCell = [
      {
        to: [target.positionX - 1, target.positionY],
        from: [[target.positionX - 2, target.positionY]]
      },
      {
        to: [target.positionX + 1, target.positionY],
        from: [[target.positionX + 2, target.positionY]]
      },
      {
        to: [target.positionX, target.positionY - 1],
        from: [[target.positionX, target.positionY - 2]]
      },
      {
        to: [target.positionX, target.positionY + 1],
        from: [[target.positionX, target.positionY + 2]]
      },
      {
        to: [target.positionX - 1, target.positionY - 1],
        from: [
          [target.positionX - 2, target.positionY - 1],
          [target.positionX - 2, target.positionY - 2],
          [target.positionX - 1, target.positionY - 2]
        ]
      },
      {
        to: [target.positionX + 1, target.positionY - 1],
        from: [
          [target.positionX + 2, target.positionY - 1],
          [target.positionX + 2, target.positionY - 2],
          [target.positionX + 1, target.positionY - 2]
        ]
      },
      {
        to: [target.positionX - 1, target.positionY + 1],
        from: [
          [target.positionX - 2, target.positionY + 1],
          [target.positionX - 2, target.positionY + 2],
          [target.positionX - 1, target.positionY + 2]
        ]
      },
      {
        to: [target.positionX + 1, target.positionY + 1],
        from: [
          [target.positionX + 2, target.positionY + 1],
          [target.positionX + 2, target.positionY + 2],
          [target.positionX + 1, target.positionY + 2]
        ]
      }
    ]

    mappingAttractCell.forEach((cell) => {
      const attractedEnemies = cell.from
        .map(([x, y]) => board.getValue(x, y))
        .filter((enemy) => enemy && enemy.team === target.team)
      const [destX, destY] = cell.to
      if (
        attractedEnemies.length > 0 &&
        board.getValue(destX, destY) === undefined
      ) {
        const attractedEnemy = pickRandomIn(attractedEnemies)!
        attractedEnemy.moveTo(destX, destY, board)
      }
    })
  }
}

export class NightSlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    crit = crit || chance(pokemon.critChance)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class KowtowCleaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    crit = chance(pokemon.critChance / 100) // can crit by default
    super.process(pokemon, state, board, target, crit)
    const nbAllies =
      board.cells.filter((p) => p && p.team === pokemon.team).length - 1
    const nbFallenAllies = min(0)(
      (pokemon.player?.experienceManager.level ?? 0) - nbAllies
    )
    const damage = Math.round(
      pokemon.atk * (1.5 + nbFallenAllies * 0.2 * (1 + pokemon.ap / 100))
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}

export class ShieldsDownStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: Ability.SHIELDS_UP,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })
    const pkm = pickRandomIn([
      Pkm.MINIOR_KERNEL_BLUE,
      Pkm.MINIOR_KERNEL_GREEN,
      Pkm.MINIOR_KERNEL_ORANGE,
      Pkm.MINIOR_KERNEL_RED
    ])
    pokemon.index = PkmIndex[pkm]
    pokemon.name = pkm
    pokemon.skill = Ability.SHIELDS_UP
  }
}

export class ShieldsUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: Ability.SHIELDS_UP,
      positionX: pokemon.positionX,
      positionY: pokemon.positionX
    })
    pokemon.index = PkmIndex[Pkm.MINIOR]
    pokemon.name = Pkm.MINIOR
    pokemon.skill = Ability.SHIELDS_DOWN
  }
}

export class AuraWheelStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (pokemon.name === Pkm.MORPEKO) {
      pokemon.name = Pkm.MORPEKO_HANGRY
      pokemon.index = PkmIndex[Pkm.MORPEKO_HANGRY]
    } else {
      pokemon.name = Pkm.MORPEKO
      pokemon.index = PkmIndex[Pkm.MORPEKO]
    }
    pokemon.addAttackSpeed(10, pokemon, 1, crit)

    target.handleSpecialDamage(
      60,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class LickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerConfusion(3000, target)
    target.status.triggerParalysis(3000, target)
  }
}

export class FurySwipesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const nbAttacks = randomBetween(
      Math.round(2 * (1 + pokemon.ap / 100)),
      Math.round(5 * (1 + pokemon.ap / 100))
    )
    for (let n = 0; n < nbAttacks; n++) {
      target.handleSpecialDamage(
        Math.ceil(pokemon.atk),
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class TickleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const attackLost = 3
    const defLost = 3
    const nbMaxEnemiesHit = [1, 2][pokemon.stars - 1] ?? 2
    let nbEnemiesHit = 0
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (
          cell.value &&
          cell.value.team !== pokemon.team &&
          nbEnemiesHit < nbMaxEnemiesHit
        ) {
          nbEnemiesHit++
          cell.value.addAttack(-attackLost, pokemon, 1, true)
          cell.value.addDefense(-defLost, pokemon, 1, true)
        }
      })
  }
}

export class AromatherapyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = [20, 40, 80][pokemon.stars - 1] ?? 20
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus()
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
  }
}

export class DetectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let nbAdjacentEnemies = 0
    const adjacentAllies: PokemonEntity[] = []
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          nbAdjacentEnemies++
        } else if (cell.value && cell.value.team === pokemon.team) {
          adjacentAllies.push(cell.value)
        }
      })

    adjacentAllies.forEach((ally) =>
      ally.status.triggerProtect(
        Math.round(500 * nbAdjacentEnemies * (1 + pokemon.ap / 100))
      )
    )
  }
}

export class SpacialRendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 100
    const enemies = board.cells.filter((p) => p && p.team !== pokemon.team)
    const n = enemies.length
    for (let i = 0; i < Math.floor(n / 2); i++) {
      board.swapValue(
        enemies[i]!.positionX,
        enemies[i]!.positionY,
        enemies[n - 1 - i]!.positionX,
        enemies[n - 1 - i]!.positionY
      )
    }

    const y = clamp(target.positionY, 2, BOARD_HEIGHT - 2)
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const targetHit = board.getValue(x, y)
      if (targetHit && targetHit.team !== pokemon.team) {
        targetHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class MultiAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const silvallyType = values(pokemon.types).at(-1)
    const synergies = pokemon.player?.synergies
    let synergyLevelCount = 0

    if (synergies && silvallyType && synergies.has(silvallyType)) {
      synergyLevelCount = synergies.get(silvallyType)!
    }
    const damage = 15 * synergyLevelCount

    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((v) => v.value)
      .forEach((v) => {
        if (v && v.team !== pokemon.team) {
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class PetalBlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board
      .getCellsInRange(pokemon.positionX, pokemon.positionY, 1)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            30,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
      })
    pokemon.addAbilityPower(10, pokemon, 0, false)
  }
}

export class SunsteelStrikeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.skydiveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      pokemon.commands.push(
        new AbilityCommand(() => {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.SUNSTEEL_STRIKE,
            positionX: mostSurroundedCoordinate.x,
            positionY: mostSurroundedCoordinate.y,
            targetX: mostSurroundedCoordinate.x,
            targetY: mostSurroundedCoordinate.y
          })
        }, 500)
      )

      pokemon.commands.push(
        new AbilityCommand(() => {
          const cells = board.getAdjacentCells(
            mostSurroundedCoordinate.x,
            mostSurroundedCoordinate.y
          )

          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.SEARING_SHOT,
            positionX: mostSurroundedCoordinate.x,
            positionY: mostSurroundedCoordinate.y,
            targetX: mostSurroundedCoordinate.x,
            targetY: mostSurroundedCoordinate.y
          })

          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                80,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              cell.value.status.triggerBurn(3000, cell.value, pokemon)
            }
          })
        }, 1000)
      )
    }
  }
}

export class MoongeistBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null) {
        if (targetInLine.team !== pokemon.team) {
          targetInLine.handleSpecialDamage(
            100,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          targetInLine.status.triggerParalysis(3000, targetInLine)
        } else {
          targetInLine.addShield(100, pokemon, 1, crit)
        }
      }
    })
  }
}

export class BloodMoonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.round(2 * pokemon.atk)
    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null) {
        if (targetInLine.team !== pokemon.team) {
          targetInLine.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          targetInLine.status.triggerWound(3000, targetInLine, pokemon)
        }
      }
    })
  }
}

export class MantisBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 1 ? 30 : pokemon.stars === 2 ? 60 : 120

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit,
      true
    )

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      true
    )
  }
}

export class SpiritBreakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    const apDebuff = -20
    target.addAbilityPower(apDebuff, pokemon, 1, crit)
  }
}

export class SheerColdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let executeChance = clamp(
      0,
      0.3 * (1 + pokemon.ap / 100) +
        min(0)((pokemon.life - target.life) / target.life),
      1
    )
    if (target.types.has(Synergy.ICE)) executeChance = 0
    else if (target.status.freeze) executeChance = 1

    let damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    if (chance(executeChance)) damage = 9999
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class ZapCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25
    const duration =
      pokemon.stars === 3 ? 4000 : pokemon.stars === 2 ? 2000 : 1000
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerArmorReduction(duration, target)
    target.status.triggerParalysis(duration, target)
  }
}

export class IceHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 2 ? 100 : 50
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerFreeze(3000, target)
    pokemon.status.triggerParalysis(3000, pokemon)
  }
}

export class FacadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20

    if (pokemon.status.hasNegativeStatus()) {
      damage *= 2
    }
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class ExtremeSpeedStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = 40
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (farthestCoordinate) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.EXTREME_SPEED,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })

      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.PHYSICAL,
            pokemon,
            crit
          )
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export class PsychoBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = 140
    ;[target.positionX - 1, target.positionX, target.positionX + 1].forEach(
      (positionX) => {
        const tg = board.getValue(positionX, target.positionY)
        if (tg && tg.team !== pokemon.team) {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.PSYCHO_BOOST,
            positionX: tg.positionX,
            positionY: tg.positionY
          })

          tg.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )

          pokemon.addAbilityPower(-20, pokemon, 0, false)
        }
      }
    )
  }
}

export class PollenPuffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.life - b.life)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(
        pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30,
        pokemon,
        1,
        crit
      )
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.POLLEN_PUFF,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class PsystrikeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const furthestTarget = state.getFarthestTarget(pokemon, board)
    if (furthestTarget) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.PSYSTRIKE,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: furthestTarget.positionX,
        targetY: furthestTarget.positionY
      })

      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        furthestTarget.positionX,
        furthestTarget.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            100,
            board,
            AttackType.PHYSICAL,
            pokemon,
            crit
          )

          const teleportationCell = board.getTeleportationCell(
            cell.value.positionX,
            cell.value.positionY
          )
          if (teleportationCell) {
            cell.value.moveTo(teleportationCell.x, teleportationCell.y, board)
          } else {
            logger.error("unable to teleport pokemon", cell.value)
          }
        }
      })
    }
  }
}

export class DreamEaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = pokemon.stars === 1 ? 45 : 90
    const duration = pokemon.stars === 1 ? 2500 : 5000

    const sleepingTarget = board.find(
      (x, y, entity) => entity.status.sleep && entity.team !== pokemon.team
    )

    if (sleepingTarget) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.DREAM_EATER,
        targetX: sleepingTarget.positionX,
        targetY: sleepingTarget.positionY
      })
      const coord = state.getNearestAvailablePlaceCoordinates(
        sleepingTarget,
        board,
        1
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board)
      }
      const { takenDamage } = sleepingTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
      pokemon.handleHeal(takenDamage, pokemon, 1, crit)
    } else {
      target.status.triggerSleep(duration, target)
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.DREAM_EATER,
        targetX: target.positionX,
        targetY: target.positionY
      })
    }
  }
}

export class SparkStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    let damage = pokemon.stars === 1 ? 40 : 80

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: Ability.SPARK,
      targetX: target.positionX,
      targetY: target.positionY,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })

    let previousTarget = target

    let n = 0
    while (n <= 4) {
      const bounceTarget = board
        .getAdjacentCells(target.positionX, target.positionY)
        .filter((cell) => cell.value && cell.value.team === target.team)
        .map((c) => c.value)[0]
      if (bounceTarget) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.SPARK,
          targetX: bounceTarget.positionX,
          targetY: bounceTarget.positionY,
          positionX: previousTarget.positionX,
          positionY: previousTarget.positionY,
          delay: n
        })
        bounceTarget.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        previousTarget = bounceTarget
        damage /= 2
        n++
      } else {
        n = 999
      }
    }
  }
}

export class CrunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [40, 80, 150][pokemon.stars - 1] ?? 150
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    if (death) {
      pokemon.handleHeal(Math.ceil(0.5 * target.hp), pokemon, 0, crit)
    }
  }
}

export class CrossPoisonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
          cell.value.status.triggerPoison(2000, cell.value, pokemon)
        }
      })
  }
}

export class FireFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerBurn(2000, target, pokemon)
  }
}

export class IceFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerFreeze(1000, target)
  }
}

export class ThunderFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerParalysis(3000, target)
  }
}

export class TailWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const defLoss = -0.3 * target.def
    target.addDefense(defLoss, pokemon, 1, crit)
  }
}

export class PsyshieldBashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 60

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (farthestCoordinate) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.PSYSHIELD_BASH,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })

      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      pokemon.status.triggerProtect(1000)
    }
  }
}

export class TorchSongStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = pokemon.stars === 3 ? 30 : pokemon.stars === 2 ? 20 : 10
    const count = pokemon.stars
    const apBoost = 10

    const scorchedEnnemiesId = new Set<string>()

    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    const enemiesHit = enemies
      .sort((a, b) => b.items.size - a.items.size)
      .slice(0, count) as PokemonEntity[]

    enemiesHit.forEach((enemy) => {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: "TORCH_SONG_CAST",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
      const cells = board
        .getAdjacentCells(enemy.positionX, enemy.positionY, true)
        .concat({ x: enemy.positionX, y: enemy.positionY, value: enemy })
      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.TORCH_SONG,
            positionX: cell.value.positionX,
            positionY: cell.value.positionY
          })
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (
            cell.value.status.burn ||
            cell.value.status.curse ||
            cell.value.status.silence
          ) {
            scorchedEnnemiesId.add(cell.value.id)
          }
        }
      })
    })

    pokemon.addAbilityPower(
      scorchedEnnemiesId.size * apBoost,
      pokemon,
      0,
      false
    )
  }
}

export class PowerWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const damage = [30, 60][pokemon.stars - 1] ?? 60

    const furthestTarget = state.getFarthestTarget(pokemon, board)
    if (furthestTarget) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.POWER_WHIP,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })

      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        furthestTarget.positionX,
        furthestTarget.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: "POWER_WHIP/hit",
            positionX: cell.value.positionX,
            positionY: cell.value.positionY
          })
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    }
  }
}

export class DarkHarvestStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)

    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      pokemon.status.triggerDarkHarvest(3200)
      pokemon.status.triggerSilence(3200, pokemon, pokemon)
    }
  }
}

export class PsyShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const ppBurn = [20, 40, 80][pokemon.stars - 1] ?? 80
    const ppStolen = max(target.pp)(ppBurn)
    const extraPP = ppBurn - ppStolen

    target.addPP(-ppStolen, pokemon, 1, crit)
    pokemon.addShield(ppBurn, pokemon, 1, crit)
    if (extraPP > 0) {
      target.handleSpecialDamage(
        extraPP,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
    }
  }
}

export class HeavySlamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    if (pokemon.hp > target.hp) {
      damage = Math.round(damage * (1 + (pokemon.hp - target.hp) / target.hp))
    }
    pokemon.addShield(damage, pokemon, 1, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class RapidSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 2 ? 50 : 20
    const statBuff = pokemon.stars === 2 ? 0.3 : 0.2
    const buffAmount = Math.round(statBuff * pokemon.atk)

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    pokemon.addDefense(buffAmount, pokemon, 1, true)
    pokemon.addSpecialDefense(buffAmount, pokemon, 1, true)
  }
}

export class BounceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const nbBounces = Math.round(
      [1, 2, 3][pokemon.stars - 1] * (1 + pokemon.ap / 100)
    )
    for (let i = 0; i < nbBounces; i++) {
      pokemon.commands.push(
        new AbilityCommand(() => {
          const destination =
            board.getFarthestTargetCoordinateAvailablePlace(pokemon)
          if (destination && pokemon.hp > 0) {
            pokemon.simulation.room.broadcast(Transfer.ABILITY, {
              id: pokemon.simulation.id,
              skill: Ability.BOUNCE,
              positionX: pokemon.positionX,
              positionY: pokemon.positionY
            })
            pokemon.moveTo(destination.x, destination.y, board)
            const adjacentCells = board.getAdjacentCells(
              destination.x,
              destination.y
            )
            adjacentCells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                const damage = 10
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            })
          }
        }, i * 400)
      )
    }
  }
}

export class GunkShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 2 ? 100 : 50
    const baseDuration = pokemon.stars === 2 ? 4000 : 2000
    const duration = Math.round(baseDuration * (1 + pokemon.ap / 100))

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}

export class AncientPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 2 ? 80 : 40
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(25, pokemon, 1, crit)
  }
}

export class MuddyWaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = pokemon.stars === 2 ? 80 : 40
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerArmorReduction(4000, cell.value)
        cell.value.status.triggerWound(4000, cell.value, pokemon)
      }
    })
  }
}

export class MoonDreamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)
    const duration =
      pokemon.stars === 1 ? 3000 : pokemon.stars === 2 ? 6000 : 9000

    const shield = [10, 20, 30][pokemon.stars - 1] ?? 30
    const count = 3

    const allies = board.cells.filter(
      (p) => p && p.team === pokemon.team && p.id !== pokemon.id
    ) as PokemonEntity[]
    const alliesHit = allies
      .sort(
        (a, b) =>
          distanceM(
            a.positionX,
            a.positionY,
            pokemon.targetX,
            pokemon.targetY
          ) -
          distanceM(b.positionX, b.positionY, pokemon.targetX, pokemon.targetY)
      )
      .slice(0, count)

    alliesHit.forEach((ally) => {
      ally.addShield(shield, pokemon, 1, crit)
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.MOON_DREAM,
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })

    target.status.triggerSleep(duration, target)
  }
}

export class StoneAxeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    const damage = 50
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)

    cells.forEach((cell) => {
      const index = cell.y * board.columns + cell.x
      if (board.effects[index] !== Effect.STEALTH_ROCKS) {
        board.effects[index] = Effect.STEALTH_ROCKS
        pokemon.simulation.room.broadcast(Transfer.BOARD_EVENT, {
          simulationId: pokemon.simulation.id,
          type: BoardEvent.STEALTH_ROCKS,
          x: cell.x,
          y: cell.y
        })
      }

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: Ability.STEALTH_ROCKS,
        positionX: cell.x,
        positionY: cell.y
      })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.effects.add(Effect.STEALTH_ROCKS)
      }
    })
  }
}

export class CameraFlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    target.status.triggerParalysis(2000, target)
  }
}

export class RockHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = Math.round(1.2 * (pokemon.atk + pokemon.def))

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class CrushClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const defLoss = [-3, -6][pokemon.stars - 1] ?? -6
    target.addDefense(defLoss, pokemon, 0, false)
    for (let i = 0; i < 2; i++) {
      target.handleSpecialDamage(
        pokemon.atk,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit,
        true
      )
    }
  }
}

export class FireLashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.status.triggerArmorReduction(4000, target)
    target.handleSpecialDamage(
      120,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class DrainPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const result = target.handleSpecialDamage(
      pokemon.atk * 2,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    pokemon.handleHeal(result.takenDamage * 4, pokemon, 0, false)
  }
}

export class FairyLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const cells = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell && cell.value && cell.value.team !== pokemon.team)

    cells.forEach((cell) => {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        targetX: cell.value?.positionX,
        targetY: cell.value?.positionY
      })
      cell.value?.handleSpecialDamage(
        Math.round(90 / cells.length),
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
    target.status.triggerLocked(5000, target)
  }
}

export class GravityStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const lockDuration = 2000 * (1 + pokemon.ap / 100)
    board.forEach((x, y, unitOnCell) => {
      if (unitOnCell && unitOnCell.team !== pokemon.team) {
        unitOnCell.status.triggerLocked(lockDuration, target)
      }
    })
  }
}

export class GulpMissileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let missilePkm = Pkm.ARROKUDA
    let missilePkmString = "arrokuda"

    const damage = 55

    if (chance(0.3)) {
      missilePkm = Pkm.PIKACHU
      missilePkmString = "pikachu"
    }

    pokemon.simulation.room.broadcast(Transfer.ABILITY, {
      id: pokemon.simulation.id,
      skill: `GULP_MISSILE/${missilePkmString}`,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })

    const missile = PokemonFactory.createPokemonFromName(
      missilePkm,
      pokemon.player
    )

    pokemon.commands.push(
      new AbilityCommand(
        () => {
          const coord = state.getNearestAvailablePlaceCoordinates(target, board)
          if (coord) {
            const entity = pokemon.simulation.addPokemon(
              missile,
              coord.x,
              coord.y,
              pokemon.team,
              true
            )

            entity.pp = entity.maxPP

            const cells = board.getAdjacentCells(
              target.positionX,
              target.positionY,
              true
            )

            cells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            })
          }
        },
        distanceM(
          target.positionX,
          target.positionY,
          pokemon.positionX,
          pokemon.positionY
        ) *
          150 -
          30
      )
    )
  }
}

export class DoubleShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const damage = pokemon.stars === 3 ? 200 : pokemon.stars === 2 ? 100 : 50

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    pokemon.status.triggerParalysis(3000, pokemon)
  }
}

export class PurifyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = [15, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.handleHeal(heal, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus()
  }
}

export class PastelVeilStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit, true)

    const shield = [20, 40, 80][pokemon.stars - 1] ?? 80
    const farthestCoordinate = board.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      true
    )
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus()
          cell.value.addShield(shield, pokemon, 1, crit)
        }
      })

      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y,
        orientation: pokemon.orientation
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }
  }
}

export * from "./hidden-power"

export const AbilityStrategies: { [key in Ability]: AbilityStrategy } = {
  [Ability.SONG_OF_DESIRE]: new SongOfDesireStrategy(),
  [Ability.CONFUSING_MIND]: new ConfusingMindStrategy(),
  [Ability.KNOWLEDGE_THIEF]: new KnowledgeThiefStrategy(),
  [Ability.WONDER_GUARD]: new WonderGuardStrategy(),
  [Ability.CORRUPTED_NATURE]: new CorruptedNatureStrategy(),
  [Ability.CRABHAMMER]: new CrabHammerStrategy(),
  [Ability.KING_SHIELD]: new KingShieldStrategy(),
  [Ability.U_TURN]: new UTurnStrategy(),
  [Ability.EXPLOSION]: new ExplosionStrategy(),
  [Ability.NIGHTMARE]: new NightmareStrategy(),
  [Ability.CLANGOROUS_SOUL]: new ClangorousSoulStrategy(),
  [Ability.BONEMERANG]: new BonemerangStrategy(),
  [Ability.GROWL]: new GrowlStrategy(),
  [Ability.RELIC_SONG]: new RelicSongStrategy(),
  [Ability.FAIRY_WIND]: new FairyWindStrategy(),
  [Ability.DISARMING_VOICE]: new DisarmingVoiceStrategy(),
  [Ability.HIGH_JUMP_KICK]: new HighJumpKickStrategy(),
  [Ability.GRASS_WHISTLE]: new GrassWhistleStrategy(),
  [Ability.TRI_ATTACK]: new TriAttackStrategy(),
  [Ability.ECHO]: new EchoStrategy(),
  [Ability.PETAL_DANCE]: new PetalDanceStrategy(),
  [Ability.HYPER_VOICE]: new HyperVoiceStrategy(),
  [Ability.SHADOW_CLONE]: new ShadowCloneStrategy(),
  [Ability.VOLT_SWITCH]: new VoltSwitchStrategy(),
  [Ability.NUZZLE]: new NuzzleStrategy(),
  [Ability.FIRE_BLAST]: new FireBlastStrategy(),
  [Ability.WHEEL_OF_FIRE]: new WheelOfFireStrategy(),
  [Ability.SEISMIC_TOSS]: new SeismicTossStrategy(),
  [Ability.GUILLOTINE]: new GuillotineStrategy(),
  [Ability.ROCK_SLIDE]: new RockSlideStrategy(),
  [Ability.HEAT_WAVE]: new HeatWaveStrategy(),
  [Ability.THUNDER]: new ThunderStrategy(),
  [Ability.HYDRO_PUMP]: new HydroPumpStrategy(),
  [Ability.DRACO_METEOR]: new DracoMeteorStrategy(),
  [Ability.BLAZE_KICK]: new BlazeKickStrategy(),
  [Ability.WISH]: new WishStrategy(),
  [Ability.LUNAR_BLESSING]: new LunarBlessingStrategy(),
  [Ability.CALM_MIND]: new CalmMindStrategy(),
  [Ability.IRON_DEFENSE]: new IronDefenseStrategy(),
  [Ability.DEFENSE_CURL]: new DefenseCurlStrategy(),
  [Ability.METRONOME]: new MetronomeStrategy(),
  [Ability.SOAK]: new SoakStrategy(),
  [Ability.IRON_TAIL]: new IronTailStrategy(),
  [Ability.BLAST_BURN]: new BlastBurnStrategy(),
  [Ability.CHARGE]: new ChargeStrategy(),
  [Ability.DISCHARGE]: new DischargeStrategy(),
  [Ability.BITE]: new BiteStrategy(),
  [Ability.DRAGON_TAIL]: new DragonTailStrategy(),
  [Ability.DRAGON_BREATH]: new DragonBreathStrategy(),
  [Ability.ICICLE_CRASH]: new IcicleCrashStrategy(),
  [Ability.ROOT]: new RootStrategy(),
  [Ability.TORMENT]: new TormentStrategy(),
  [Ability.STOMP]: new StompStrategy(),
  [Ability.PAYBACK]: new PaybackStrategy(),
  [Ability.NIGHT_SLASH]: new NightSlashStrategy(),
  [Ability.KOWTOW_CLEAVE]: new KowtowCleaveStrategy(),
  [Ability.BUG_BUZZ]: new BugBuzzStrategy(),
  [Ability.STRING_SHOT]: new StringShotStrategy(),
  [Ability.ENTANGLING_THREAD]: new EntanglingThreadStrategy(),
  [Ability.VENOSHOCK]: new PoisonStingStrategy(),
  [Ability.LEECH_LIFE]: new LeechLifeStrategy(),
  [Ability.HAPPY_HOUR]: new HappyHourStrategy(),
  [Ability.TELEPORT]: new TeleportStrategy(),
  [Ability.NASTY_PLOT]: new NastyPlotStrategy(),
  [Ability.THIEF]: new ThiefStrategy(),
  [Ability.STUN_SPORE]: new StunSporeStrategy(),
  [Ability.METEOR_MASH]: new MeteorMashStrategy(),
  [Ability.HURRICANE]: new HurricaneStrategy(),
  [Ability.BURN]: new BurnStrategy(),
  [Ability.SLEEP]: new SleepStrategy(),
  [Ability.CONFUSION]: new ConfusionStrategy(),
  [Ability.BLIZZARD]: new BlizzardStrategy(),
  [Ability.PROTECT]: new ProtectStrategy(),
  [Ability.POISON]: new PoisonStrategy(),
  [Ability.ORIGIN_PULSE]: new OriginPulseStrategy(),
  [Ability.SEED_FLARE]: new SeedFlareStrategy(),
  [Ability.HEAL_BLOCK]: new HealBlockStrategy(),
  [Ability.ROAR_OF_TIME]: new RoarOfTimeStrategy(),
  [Ability.ROCK_TOMB]: new RockTombStrategy(),
  [Ability.ROCK_SMASH]: new RockSmashStrategy(),
  [Ability.HEAD_SMASH]: new HeadSmashStrategy(),
  [Ability.DOUBLE_EDGE]: new DoubleEdgeStrategy(),
  [Ability.DEFAULT]: new AbilityStrategy(),
  [Ability.DIAMOND_STORM]: new DiamondStormStrategy(),
  [Ability.DRACO_ENERGY]: new DracoEnergyStrategy(),
  [Ability.DYNAMAX_CANNON]: new DynamaxCannonStrategy(),
  [Ability.DYNAMIC_PUNCH]: new DynamicPunchStrategy(),
  [Ability.ELECTRO_BOOST]: new ElectroBoostStrategy(),
  [Ability.ELECTRO_WEB]: new ElectroWebStrategy(),
  [Ability.FIRE_TRICK]: new FireTrickStrategy(),
  [Ability.FLAME_CHARGE]: new FlameChargeStrategy(),
  [Ability.LEECH_SEED]: new LeechSeedStrategy(),
  [Ability.LOCK_ON]: new LockOnStrategy(),
  [Ability.PSYCH_UP]: new PsychUpStrategy(),
  [Ability.RAZOR_WIND]: new RazorWindStrategy(),
  [Ability.TWISTING_NETHER]: new TwistingNetherStrategy(),
  [Ability.EARTHQUAKE]: new EarthquakeStrategy(),
  [Ability.SOFT_BOILED]: new SoftBoiledStrategy(),
  [Ability.ELECTRIC_SURGE]: new ElectricSurgeStrategy(),
  [Ability.PSYCHIC_SURGE]: new PsychicSurgeStrategy(),
  [Ability.MIND_BLOWN]: new MindBlownStrategy(),
  [Ability.PAYDAY]: new PaydayStrategy(),
  [Ability.PICKUP]: new PickupStrategy(),
  [Ability.BEAT_UP]: new BeatUpStrategy(),
  [Ability.BLUE_FLARE]: new BlueFlareStrategy(),
  [Ability.FUSION_BOLT]: new FusionBoltStrategy(),
  [Ability.AURORA_VEIL]: new AuroraVeilStrategy(),
  [Ability.AQUA_JET]: new AquaJetStrategy(),
  [Ability.JUDGEMENT]: new JudgementStrategy(),
  [Ability.CHATTER]: new ChatterStrategy(),
  [Ability.LIQUIDATION]: new LiquidationStrategy(),
  [Ability.STEAM_ERUPTION]: new SteamEruptionStrategy(),
  [Ability.APPLE_ACID]: new AppleAcidStrategy(),
  [Ability.SHADOW_BALL]: new ShadowBallStrategy(),
  [Ability.DIVE]: new DiveStrategy(),
  [Ability.SPIKE_ARMOR]: new SpikeArmorStrategy(),
  [Ability.FUTURE_SIGHT]: new FutureSightStrategy(),
  [Ability.FAKE_TEARS]: new FakeTearsStrategy(),
  [Ability.SPARKLING_ARIA]: new SparklingAriaStrategy(),
  [Ability.DRAGON_DARTS]: new DragonDartsStrategy(),
  [Ability.GRASSY_SURGE]: new GrassySurgeStrategy(),
  [Ability.MISTY_SURGE]: new MistySurgeStrategy(),
  [Ability.SKY_ATTACK]: new SkyAttackStrategy(),
  [Ability.ILLUSION]: new IllusionStrategy(),
  [Ability.SLUDGE]: new SludgeStrategy(),
  [Ability.SLUDGE_WAVE]: new SludgeWaveStrategy(),
  [Ability.AURORA_BEAM]: new AuroraBeamStrategy(),
  [Ability.AGILITY]: new AgilityStrategy(),
  [Ability.SPIRIT_SHACKLE]: new SpiritShackleStrategy(),
  [Ability.WATER_SHURIKEN]: new WaterShurikenStrategy(),
  [Ability.SHADOW_SNEAK]: new ShadowSneakStrategy(),
  [Ability.MACH_PUNCH]: new MachPunchStrategy(),
  [Ability.UPPERCUT]: new UppercutStrategy(),
  [Ability.TRIPLE_KICK]: new TripleKickStrategy(),
  [Ability.MAWASHI_GERI]: new MawashiGeriStrategy(),
  [Ability.FORECAST]: new ForecastStrategy(),
  [Ability.SACRED_SWORD]: new SacredSwordStrategy(),
  [Ability.X_SCISSOR]: new XScissorStrategy(),
  [Ability.PLASMA_FIST]: new PlasmaFistStrategy(),
  [Ability.SPECTRAL_THIEF]: new SpectralThiefStrategy(),
  [Ability.GEOMANCY]: new GeomancyStrategy(),
  [Ability.DEATH_WING]: new DeathWingStrategy(),
  [Ability.SLACK_OFF]: new SlackOffStrategy(),
  [Ability.DARK_VOID]: new DarkVoidStrategy(),
  [Ability.OVERHEAT]: new OverheatStrategy(),
  [Ability.HYPNOSIS]: new HypnosisStrategy(),
  [Ability.MIMIC]: new MimicStrategy(),
  [Ability.HEX]: new HexStrategy(),
  [Ability.GROWTH]: new GrowthStrategy(),
  [Ability.HEAL_ORDER]: new HealOrderStrategy(),
  [Ability.SHELL_TRAP]: new ShellTrapStrategy(),
  [Ability.DIG]: new DigStrategy(),
  [Ability.FIRE_SPIN]: new FireSpinStrategy(),
  [Ability.SEARING_SHOT]: new SearingShotStrategy(),
  [Ability.PECK]: new PeckStrategy(),
  [Ability.SPLASH]: new SplashStrategy(),
  [Ability.COUNTER]: new CounterStrategy(),
  [Ability.COSMIC_POWER]: new CosmicPowerStrategy(),
  [Ability.POISON_POWDER]: new PoisonPowderStrategy(),
  [Ability.SILVER_WIND]: new SilverWindStrategy(),
  [Ability.ICY_WIND]: new IcyWindStrategy(),
  [Ability.GIGATON_HAMMER]: new GigatonHammerStrategy(),
  [Ability.ACROBATICS]: new AcrobaticsStrategy(),
  [Ability.ABSORB]: new AbsorbStrategy(),
  [Ability.ROLLOUT]: new RolloutStrategy(),
  [Ability.THRASH]: new ThrashStrategy(),
  [Ability.SOLAR_BEAM]: new SolarBeamStrategy(),
  [Ability.MAGMA_STORM]: new MagmaStormStrategy(),
  [Ability.SLASHING_CLAW]: new SlashingClawStrategy(),
  [Ability.ERUPTION]: new EruptionStrategy(),
  [Ability.MIST_BALL]: new MistBallStrategy(),
  [Ability.LUSTER_PURGE]: new LusterPurgeStrategy(),
  [Ability.MUD_BUBBLE]: new MudBubbleStrategy(),
  [Ability.LINK_CABLE]: new LinkCableStrategy(),
  [Ability.MAGIC_BOUNCE]: new MagicBounceStrategy(),
  [Ability.HIDDEN_POWER_A]: new HiddenPowerAStrategy(),
  [Ability.HIDDEN_POWER_B]: new HiddenPowerBStrategy(),
  [Ability.HIDDEN_POWER_C]: new HiddenPowerCStrategy(),
  [Ability.HIDDEN_POWER_D]: new HiddenPowerDStrategy(),
  [Ability.HIDDEN_POWER_E]: new HiddenPowerEStrategy(),
  [Ability.HIDDEN_POWER_F]: new HiddenPowerFStrategy(),
  [Ability.HIDDEN_POWER_G]: new HiddenPowerGStrategy(),
  [Ability.HIDDEN_POWER_H]: new HiddenPowerHStrategy(),
  [Ability.HIDDEN_POWER_I]: new HiddenPowerIStrategy(),
  [Ability.HIDDEN_POWER_J]: new HiddenPowerJStrategy(),
  [Ability.HIDDEN_POWER_K]: new HiddenPowerKStrategy(),
  [Ability.HIDDEN_POWER_L]: new HiddenPowerLStrategy(),
  [Ability.HIDDEN_POWER_M]: new HiddenPowerMStrategy(),
  [Ability.HIDDEN_POWER_N]: new HiddenPowerNStrategy(),
  [Ability.HIDDEN_POWER_O]: new HiddenPowerOStrategy(),
  [Ability.HIDDEN_POWER_P]: new HiddenPowerPStrategy(),
  [Ability.HIDDEN_POWER_Q]: new HiddenPowerQStrategy(),
  [Ability.HIDDEN_POWER_R]: new HiddenPowerRStrategy(),
  [Ability.HIDDEN_POWER_S]: new HiddenPowerSStrategy(),
  [Ability.HIDDEN_POWER_T]: new HiddenPowerTStrategy(),
  [Ability.HIDDEN_POWER_U]: new HiddenPowerUStrategy(),
  [Ability.HIDDEN_POWER_V]: new HiddenPowerVStrategy(),
  [Ability.HIDDEN_POWER_W]: new HiddenPowerWStrategy(),
  [Ability.HIDDEN_POWER_X]: new HiddenPowerXStrategy(),
  [Ability.HIDDEN_POWER_Y]: new HiddenPowerYStrategy(),
  [Ability.HIDDEN_POWER_Z]: new HiddenPowerZStrategy(),
  [Ability.HIDDEN_POWER_QM]: new HiddenPowerQMStrategy(),
  [Ability.HIDDEN_POWER_EM]: new HiddenPowerEMStrategy(),
  [Ability.POISON_JAB]: new PoisonJabStrategy(),
  [Ability.SHELL_SMASH]: new ShellSmashStrategy(),
  [Ability.HELPING_HAND]: new HelpingHandStrategy(),
  [Ability.ASTRAL_BARRAGE]: new AstralBarrageStrategy(),
  [Ability.WATERFALL]: new WaterfallStrategy(),
  [Ability.PYRO_BALL]: new PyroBallStrategy(),
  [Ability.WHIRLPOOL]: new WhirlpoolStrategy(),
  [Ability.SMOKE_SCREEN]: new SmokeScreenStrategy(),
  [Ability.PRESENT]: new PresentStrategy(),
  [Ability.LEAF_BLADE]: new LeafBladeStrategy(),
  [Ability.ANCHOR_SHOT]: new AnchorShotStrategy(),
  [Ability.SMOG]: new SmogStrategy(),
  [Ability.PSYCHIC]: new PsychicStrategy(),
  [Ability.PSYBEAM]: new PsybeamStrategy(),
  [Ability.MAGNET_RISE]: new MagnetRiseStrategy(),
  [Ability.ATTRACT]: new AttractStrategy(),
  [Ability.WATER_PULSE]: new WaterPulseStrategy(),
  [Ability.PLAY_ROUGH]: new PlayRoughStrategy(),
  [Ability.AERIAL_ACE]: new AerialAceStrategy(),
  [Ability.PARABOLIC_CHARGE]: new ParabolicChargeStrategy(),
  [Ability.SUPER_FANG]: new SuperFangStrategy(),
  [Ability.TEETER_DANCE]: new TeeterDanceStrategy(),
  [Ability.CLOSE_COMBAT]: new CloseCombatStrategy(),
  [Ability.ASSIST]: new AssistStrategy(),
  [Ability.FISSURE]: new FissureStrategy(),
  [Ability.ASSURANCE]: new AssuranceStrategy(),
  [Ability.AQUA_RING]: new AquaRingStrategy(),
  [Ability.POISON_GAS]: new PoisonGasStrategy(),
  [Ability.BRAVE_BIRD]: new BraveBirdStrategy(),
  [Ability.MAGICAL_LEAF]: new MagicalLeafStrategy(),
  [Ability.STEALTH_ROCKS]: new StealthRocksStrategy(),
  [Ability.TAIL_GLOW]: new TailGlowStrategy(),
  [Ability.STRUGGLE_BUG]: new StruggleBugStrategy(),
  [Ability.PRISMATIC_LASER]: new PrismaticLaserStrategy(),
  [Ability.NATURAL_GIFT]: new NaturalGiftStrategy(),
  [Ability.NIGHT_SHADE]: new NightShadeStrategy(),
  [Ability.CHARGE_BEAM]: new ChargeBeamStrategy(),
  [Ability.POPULATION_BOMB]: new PopulationBombStrategy(),
  [Ability.SCREECH]: new ScreechStrategy(),
  [Ability.SAND_TOMB]: new SandTombStrategy(),
  [Ability.WHIRLWIND]: new WhirlwindStrategy(),
  [Ability.EMPTY_LIGHT]: new EmptyLightStrategy(),
  [Ability.UNBOUND]: new UnboundStrategy(),
  [Ability.HYPERSPACE_FURY]: new HyperSpaceFury(),
  [Ability.SNIPE_SHOT]: new SnipeShotStrategy(),
  [Ability.AIR_SLASH]: new AirSlashStrategy(),
  [Ability.EGGSPLOSION]: new EggsplosionStrategy(),
  [Ability.BODY_SLAM]: new BodySlamStrategy(),
  [Ability.FLORAL_HEALING]: new FloralHealingStrategy(),
  [Ability.VINE_WHIP]: new VineWhipStrategy(),
  [Ability.BARB_BARRAGE]: new BarbBarrageStrategy(),
  [Ability.INFERNAL_PARADE]: new InfernalParadeStrategy(),
  [Ability.MAGIC_POWDER]: new MagicPowderStrategy(),
  [Ability.RETALIATE]: new RetaliateStrategy(),
  [Ability.SLASH]: new SlashStrategy(),
  [Ability.OUTRAGE]: new OutrageStrategy(),
  [Ability.LUNGE]: new LungeStrategy(),
  [Ability.KNOCK_OFF]: new KnockOffStrategy(),
  [Ability.FISHIOUS_REND]: new FishiousRendStrategy(),
  [Ability.RECOVER]: new RecoverStrategy(),
  [Ability.CURSE]: new CurseStrategy(),
  [Ability.GOLD_RUSH]: new GoldRushStrategy(),
  [Ability.MAKE_IT_RAIN]: new MakeItRainStrategy(),
  [Ability.TIME_TRAVEL]: new TimeTravelStrategy(),
  [Ability.POLTERGEIST]: new PoltergeistStrategy(),
  [Ability.CRUSH_GRIP]: new CrushGripStrategy(),
  [Ability.AURASPHERE]: new AuraSphereStrategy(),
  [Ability.SKETCH]: new SketchStrategy(),
  [Ability.OVERDRIVE]: new OverdriveStrategy(),
  [Ability.LOVELY_KISS]: new LovelyKissStrategy(),
  [Ability.TRANSFORM]: new TransformStrategy(),
  [Ability.PSYCHIC_FANGS]: new PsychicFangsStrategy(),
  [Ability.SHED_TAIL]: new ShedTailStrategy(),
  [Ability.SHIELDS_DOWN]: new ShieldsDownStrategy(),
  [Ability.SHIELDS_UP]: new ShieldsUpStrategy(),
  [Ability.SANDSEAR_STORM]: new SandsearStormStrategy(),
  [Ability.WILDBOLT_STORM]: new WildboltStormStrategy(),
  [Ability.BLEAKWIND_STORM]: new BleakwindStormStrategy(),
  [Ability.SPRINGTIDE_STORM]: new SpringtideStormStrategy(),
  [Ability.AURA_WHEEL]: new AuraWheelStrategy(),
  [Ability.LICK]: new LickStrategy(),
  [Ability.FURY_SWIPES]: new FurySwipesStrategy(),
  [Ability.TICKLE]: new TickleStrategy(),
  [Ability.AROMATHERAPY]: new AromatherapyStrategy(),
  [Ability.DETECT]: new DetectStrategy(),
  [Ability.SPACIAL_REND]: new SpacialRendStrategy(),
  [Ability.MULTI_ATTACK]: new MultiAttackStrategy(),
  [Ability.STICKY_WEB]: new StickyWebStrategy(),
  [Ability.ACCELEROCK]: new AccelerockStrategy(),
  [Ability.PETAL_BLIZZARD]: new PetalBlizzardStrategy(),
  [Ability.SUNSTEEL_STRIKE]: new SunsteelStrikeStrategy(),
  [Ability.MOONGEIST_BEAM]: new MoongeistBeamStrategy(),
  [Ability.MANTIS_BLADES]: new MantisBladesStrategy(),
  [Ability.FLEUR_CANNON]: new FleurCannonStrategy(),
  [Ability.DOOM_DESIRE]: new DoomDesireStrategy(),
  [Ability.SPIRIT_BREAK]: new SpiritBreakStrategy(),
  [Ability.SHEER_COLD]: new SheerColdStrategy(),
  [Ability.PSYCHO_BOOST]: new PsychoBoostStrategy(),
  [Ability.ZAP_CANNON]: new ZapCannonStrategy(),
  [Ability.EXTREME_SPEED]: new ExtremeSpeedStrategy(),
  [Ability.ICE_HAMMER]: new IceHammerStrategy(),
  [Ability.POLLEN_PUFF]: new PollenPuffStrategy(),
  [Ability.PSYSTRIKE]: new PsystrikeStrategy(),
  [Ability.FACADE]: new FacadeStrategy(),
  [Ability.DREAM_EATER]: new DreamEaterStrategy(),
  [Ability.SPARK]: new SparkStrategy(),
  [Ability.CRUNCH]: new CrunchStrategy(),
  [Ability.CROSS_POISON]: new CrossPoisonStrategy(),
  [Ability.SHELTER]: new ShelterStrategy(),
  [Ability.FIRE_FANG]: new FireFangStrategy(),
  [Ability.ICE_FANG]: new IceFangStrategy(),
  [Ability.THUNDER_FANG]: new ThunderFangStrategy(),
  [Ability.TAIL_WHIP]: new TailWhipStrategy(),
  [Ability.PSYSHIELD_BASH]: new PsyshieldBashStrategy(),
  [Ability.QUIVER_DANCE]: new QuiverDanceStrategy(),
  [Ability.TORCH_SONG]: new TorchSongStrategy(),
  [Ability.POWER_WHIP]: new PowerWhipStrategy(),
  [Ability.DARK_HARVEST]: new DarkHarvestStrategy(),
  [Ability.PSYSHOCK]: new PsyShockStrategy(),
  [Ability.HEAVY_SLAM]: new HeavySlamStrategy(),
  [Ability.AQUA_TAIL]: new AquaTailStrategy(),
  [Ability.HAIL]: new HailStrategy(),
  [Ability.RAPID_SPIN]: new RapidSpinStrategy(),
  [Ability.BOUNCE]: new BounceStrategy(),
  [Ability.GUNK_SHOT]: new GunkShotStrategy(),
  [Ability.BLOOD_MOON]: new BloodMoonStrategy(),
  [Ability.TEA_TIME]: new TeaTimeStrategy(),
  [Ability.SPIKES]: new SpikesStrategy(),
  [Ability.SHADOW_PUNCH]: new ShadowPunchStrategy(),
  [Ability.MAGNET_BOMB]: new MagnetBombStrategy(),
  [Ability.MUDDY_WATER]: new MuddyWaterStrategy(),
  [Ability.ANCIENT_POWER]: new AncientPowerStrategy(),
  [Ability.MOON_DREAM]: new MoonDreamStrategy(),
  [Ability.STONE_AXE]: new StoneAxeStrategy(),
  [Ability.CAMERA_FLASH]: new CameraFlashStrategy(),
  [Ability.ROCK_HEAD]: new RockHeadStrategy(),
  [Ability.TAKE_HEART]: new TakeHeartStrategy(),
  [Ability.CRUSH_CLAW]: new CrushClawStrategy(),
  [Ability.FIRE_LASH]: new FireLashStrategy(),
  [Ability.FAIRY_LOCK]: new FairyLockStrategy(),
  [Ability.FLYING_PRESS]: new FlyingPressStrategy(),
  [Ability.DRAIN_PUNCH]: new DrainPunchStrategy(),
  [Ability.GRAVITY]: new GravityStrategy(),
  [Ability.DIRE_CLAW]: new DireClawStrategy(),
  [Ability.FAKE_OUT]: new FakeOutStrategy(),
  [Ability.PURIFY]: new PurifyStrategy(),
  [Ability.FELL_STINGER]: new FellStingerStrategy(),
  [Ability.GULP_MISSILE]: new GulpMissileStrategy(),
  [Ability.SCHOOLING]: new SchoolingStrategy(),
  [Ability.DOUBLE_SHOCK]: new DoubleShockStrategy(),
  [Ability.PASTEL_VEIL]: new PastelVeilStrategy()
}
