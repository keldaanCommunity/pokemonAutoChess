import { giveRandomEgg } from "../../core/eggs"
import {
  Chewtle,
  Drednaw,
  PokemonClasses
} from "../../models/colyseus-models/pokemon"
import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../models/precomputed/precomputed-rarity"
import { IStatus } from "../../types"
import { BOARD_HEIGHT, BOARD_WIDTH, DEFAULT_SPEED } from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Rarity, Team } from "../../types/enum/Game"
import { ArtificialItems, Berries, Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmByIndex, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { WandererBehavior, WandererType } from "../../types/enum/Wanderer"
import { Weather } from "../../types/enum/Weather"
import { isOnBench } from "../../utils/board"
import { distanceC, distanceE, distanceM } from "../../utils/distance"
import { logger } from "../../utils/logger"
import { calcAngleDegrees, clamp, max, min } from "../../utils/number"
import {
  effectInLine,
  OrientationArray,
  OrientationVector
} from "../../utils/orientation"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  randomBetween,
  shuffleArray
} from "../../utils/random"
import { values } from "../../utils/schemas"

import type { Board, Cell } from "../board"
import { OnDamageReceivedEffect, PeriodicEffect } from "../effects/effect"
import { AccelerationEffect, FalinksFormationEffect } from "../effects/passives"
import { getStrongestUnit, PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
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

export class BlueFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const fireLevel = pokemon.player?.synergies.get(Synergy.FIRE)
    const damage = 50 + (fireLevel ?? 0) * 10

    pokemon.commands.push(
      new DelayedCommand(() => {
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
      }, 250)
    )
  }
}

export class FusionBoltStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const electricLevel = pokemon.player?.synergies.get(Synergy.ELECTRIC)
    const damage = 50 + (electricLevel ?? 0) * 10
    pokemon.commands.push(
      new DelayedCommand(() => {
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
      }, 250)
    )
  }
}

export class GlaciateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const iceSynergyLevel = pokemon.player?.synergies.get(Synergy.ICE) ?? 0
    const damage = 50 + iceSynergyLevel * 10
    pokemon.commands.push(
      new DelayedCommand(() => {
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
      }, 300)
    )
  }
}

export class BeatUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    for (let i = 0; i < pokemon.stars; i++) {
      const houndour = PokemonFactory.createPokemonFromName(
        Pkm.HOUNDOUR,
        pokemon.player
      )
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(pokemon)
      if (coord) {
        const entity = pokemon.simulation.addPokemon(
          houndour,
          coord.x,
          coord.y,
          pokemon.team,
          true
        )
        const scale = (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
        entity.maxHP = min(1)(Math.round(houndour.maxHP * scale))
        entity.hp = entity.maxHP
      }
    }
  }
}

export class PaydayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.floor(
      ([30, 60, 90][pokemon.stars - 1] ?? 90) * (1 + (0.5 * pokemon.ap) / 100)
    )

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
    if (death && pokemon.player) {
      pokemon.player.addMoney(pokemon.stars, true, pokemon)
      pokemon.count.moneyCount += pokemon.stars
    }
  }
}

export class PickupStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 30

    if (target.items.size > 0 && pokemon.items.size < 3) {
      const item = target.items.values().next().value
      if (item) {
        target.removeItem(item)
        pokemon.addItem(item)
      }
    } else {
      if (target.player) {
        const moneyStolen = max(target.player.money)(pokemon.stars)
        target.player.addMoney(-moneyStolen, false, target)
        if (pokemon.player) {
          pokemon.player.addMoney(moneyStolen, true, pokemon)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(
      pokemon.hp / 2,
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield = [20, 40, 80][pokemon.stars - 1] ?? 80
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.clearNegativeStatus()
      }
    })
  }
}

export class TeaTimeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [15, 30, 60][pokemon.stars - 1] ?? 60
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        tg.handleHeal(heal, pokemon, 1, crit)
        const berry = values(tg.items).find((item) => Berries.includes(item))
        if (berry) {
          tg.eatBerry(berry)
        }
      }
    })
  }
}

export class PrecipiceBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 100
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (
        (tg && pokemon.team !== tg.team && pokemon.positionY === y) ||
        (tg && pokemon.team !== tg.team && pokemon.positionX === x)
      ) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        pokemon.broadcastAbility({ positionX: x, positionY: y })
      }
    })
  }
}

export class SongOfDesireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

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
          false
        )
        targetCharmed.addAttack(-3, pokemon, 1, crit)
      }
    }
  }
}

export class SlackOffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.status.clearNegativeStatus()
    const healFactor = 0.3
    pokemon.handleHeal(pokemon.maxHP * healFactor, pokemon, 1, crit)
    pokemon.status.triggerSleep(3000, pokemon)
  }
}

export class ConfusingMindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

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
        targetConfused.status.triggerConfusion(
          duration,
          targetConfused,
          pokemon,
          true
        )
      }
    }
  }
}

export class KnowledgeThiefStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
    if (pokemon.player && !pokemon.isGhostOpponent) {
      pokemon.player.experienceManager.addExperience(1)
    }
  }
}

export class WonderGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
        cell.value.status.triggerParalysis(3000, cell.value, pokemon)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [30, 50, 70][pokemon.stars - 1] ?? 70
    pokemon.handleHeal(heal, pokemon, 0.5, crit)
    if (target && target.canBeCopied) {
      pokemon.index = target.index
      pokemon.atk = Math.max(pokemon.atk, target.atk)
      pokemon.range = target.range
      pokemon.def = Math.max(pokemon.def, target.def)
      pokemon.speDef = Math.max(pokemon.speDef, target.speDef)
    }
  }
}

export class JudgementStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = 10
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.ELECTRIC)
      ) {
        ally.addSpeed(buff, pokemon, 1, crit)
      }
    })
  }
}

export class PsychicSurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = 20
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppGain = 25
    const hpGain = 25
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.FAIRY)
      ) {
        ally.addPP(ppGain, pokemon, 1, crit)
        ally.handleHeal(hpGain, pokemon, 1, crit)
      }
    })
  }
}

export class GrassySurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = 5
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.GRASS)
      ) {
        ally.addAttack(buff, pokemon, 1, crit)
      }
    })
  }
}

export class PsychicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 20
    const confusionChance = 0.5
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        if (chance(confusionChance, pokemon)) {
          tg.status.triggerConfusion(1000, tg, pokemon)
        }
      }
    })
  }
}

export class CrabHammerStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    let damage = [40, 80, 120][pokemon.stars - 1] ?? 120
    crit = chance((pokemon.critChance + 30) / 100, pokemon) // can crit by default with a 30% increased crit chance
    super.process(pokemon, board, target, crit)
    let attackType = AttackType.SPECIAL
    if (target.hp / target.maxHP < 0.3) {
      damage = 9999
      attackType = AttackType.TRUE
    }
    target.handleSpecialDamage(damage, board, attackType, pokemon, crit)
  }
}

export class DiamondStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.def
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(
      pokemon.hp,
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          Math.ceil(cell.value.maxHP * 0.5),
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = [2000, 4000, 6000][pokemon.stars - 1] ?? 6000
    const damage = [40, 80, 160][pokemon.stars - 1] ?? 160
    target.status.triggerConfusion(duration, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ElectroBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const runeProtectDuration = 1000
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team) {
        ally.handleHeal(25, pokemon, 1, crit)
        ally.status.clearNegativeStatus()
      }
    })

    if (
      pokemon.player &&
      !pokemon.isGhostOpponent &&
      pokemon.player.life < 100
    ) {
      pokemon.player.life += 1
    }
  }
}

export class AquaJetStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class SchoolingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 0.1 * pokemon.maxHP

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

    if (pokemon.player && !pokemon.isGhostOpponent) {
      pokemon.player.board.forEach((ally, id) => {
        if (ally && ally.name === Pkm.WISHIWASHI && isOnBench(ally)) {
          pokemon.addMaxHP(50, pokemon, 0, false, true)
          pokemon.player!.board.delete(id)
        }
      })
    }
  }
}

export class ElectroWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
          cell.value.addSpeed(-steal, pokemon, 1, crit)
          pokemon.addSpeed(steal, pokemon, 1, crit)
        }
      })
  }
}

export class MysticalFireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAbilityPower(-10, pokemon, 1, crit)
  }
}

export class FlameChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class LeechSeedStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = [3000, 6000, 12000][pokemon.stars - 1] ?? 12000
    const heal = [20, 40, 80][pokemon.stars - 1] ?? 80
    pokemon.handleHeal(heal, pokemon, 1, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}

export class LockOnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.effects.add(EffectEnum.LOCK_ON)
  }
}

export class DisableStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    const duration = [2000, 3000, 4000][pokemon.stars - 1] ?? 4000
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
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class DarkVoidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        let damage = 40
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    if (farthestTarget) {
      const factor = 0.5
      const duration = Math.round(
        ([2000, 4000, 6000][pokemon.stars - 1] ?? 2000) *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      farthestTarget.status.triggerSleep(duration, farthestTarget)
    }
  }
}

export class KingShieldStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = 1500
    const shield = [10, 20, 30][pokemon.stars - 1] ?? 30
    pokemon.status.triggerProtect(duration)
    pokemon.addShield(shield, pokemon, 1, crit)
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      pokemon.moveTo(farthestTarget.positionX, farthestTarget.positionY, board)
    }
    if (pokemon.name === Pkm.AEGISLASH) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addAttack(10, pokemon, 1, crit)
          pokemon.addDefense(-5, pokemon, 1, crit)
          pokemon.addSpecialDefense(-5, pokemon, 1, crit)
          pokemon.name = Pkm.AEGISLASH_BLADE
          pokemon.index = PkmIndex[Pkm.AEGISLASH_BLADE]
          if (pokemon.player) {
            pokemon.player.pokemonsPlayed.add(Pkm.AEGISLASH_BLADE)
          }
        }, 1500)
      )
    } else if (pokemon.name === Pkm.AEGISLASH_BLADE) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addAttack(-10, pokemon, 1, crit)
          pokemon.addDefense(5, pokemon, 1, crit)
          pokemon.addSpecialDefense(5, pokemon, 1, crit)
          pokemon.name = Pkm.AEGISLASH
          pokemon.index = PkmIndex[Pkm.AEGISLASH]
        }, 1500)
      )
    }
  }
}

export class UTurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield = [15, 30, 50][pokemon.stars - 1] ?? 30
    pokemon.moveTo(target.positionX, target.positionY, board)
    pokemon.addShield(shield, pokemon, 1, crit)
    target.status.triggerCharm(1000, target, pokemon, false)
  }
}

export class PoisonJabStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [30, 60, 90][pokemon.stars - 1] ?? 30
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(3000, target, pokemon)
    pokemon.status.triggerPoison(3000, pokemon, pokemon)
    pokemon.moveTo(target.positionX, target.positionY, board)
  }
}

export class ExplosionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
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

    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class ChloroblastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
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

    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        0.5 * pokemon.maxHP,
        board,
        AttackType.TRUE,
        pokemon,
        crit
      )
    }
  }
}

export class ClangorousSoulStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = [2, 4, 8][pokemon.stars - 1] ?? 1

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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = 0
    let defReduction = 0
    switch (pokemon.stars) {
      case 1:
        damage = 20
        defReduction = 4
        break
      case 2:
        damage = 40
        defReduction = 8
        break
      case 3:
        damage = 80
        defReduction = 16
        break
      default:
        break
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addDefense(-defReduction, pokemon, 1, crit)
  }
}

export class BonemerangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60

    const hit = () =>
      effectInLine(board, pokemon, target, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

    hit()
    pokemon.commands.push(new DelayedCommand(hit, 1000))
  }
}

export class ShadowBoneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120

    const hit = () =>
      effectInLine(board, pokemon, target, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          if (chance(0.5, pokemon)) {
            cell.value.addDefense(-6, pokemon, 1, crit)
          }
        }
      })

    hit()
  }
}

export class AuroraBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        let freezeChance = 0
        if (pokemon.effects.has(EffectEnum.CHILLY)) {
          freezeChance = 0.4
        } else if (pokemon.effects.has(EffectEnum.FROSTY)) {
          freezeChance = 0.6
        } else if (pokemon.effects.has(EffectEnum.FREEZING)) {
          freezeChance = 0.8
        } else if (pokemon.effects.has(EffectEnum.SHEER_COLD)) {
          freezeChance = 1.0
        }
        if (chance(freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(2000, target)
        }
      }
    })
  }
}

export class GrowlStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % 3 === 0) {
      const factor = 0.5
      const duration = Math.round(
        2000 *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team != tg.team) {
          tg.status.triggerSleep(duration, tg)
        }
      })
    } else {
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team === tg.team) {
          tg.addShield(10, pokemon, 1, crit)
        }
      })
    }
  }
}

export class FairyWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const ppGain = [5, 10, 20][pokemon.stars - 1] ?? 0
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team === tg.team && tg.id !== pokemon.id) {
        tg.addPP(ppGain, pokemon, 0.5, crit)
      }
    })
  }
}

export class DisarmingVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const radius = [1, 2, 3][pokemon.stars - 1] ?? 3
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      radius
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    const ppStolen = max(40)(target.pp)
    pokemon.addPP(ppStolen, pokemon, 0, false)
    target.addPP(-ppStolen, pokemon, 0, false)
    target.count.manaBurnCount++
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class TropKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    const atkDebuff = [3, 5, 7][pokemon.stars - 1] ?? 7
    target.addAttack(-atkDebuff, pokemon, 1, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrassWhistleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const effect = randomBetween(1, 3)
    switch (effect) {
      case 1:
        target.status.triggerFreeze(3000, target)
        break
      case 2:
        target.status.triggerBurn(5000, target, pokemon)
        break
      case 3:
        target.status.triggerParalysis(7000, target, pokemon)
        break
    }
    const damage = [60, 120, 250][pokemon.stars - 1] ?? 250
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EchoStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [3, 6, 9][pokemon.stars - 1] ?? 9
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(
          pokemon.count.ult * damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class FutureSightStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    const count = 5
    const targets: PokemonEntity[] = board.cells
      .filter<PokemonEntity>(
        (p): p is PokemonEntity => p !== undefined && p.team !== pokemon.team
      )
      .slice(0, count)

    for (const tg of targets) {
      pokemon.broadcastAbility({
        positionX: tg.positionX,
        positionY: tg.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        for (const tg of targets) {
          if (tg.hp > 0) {
            tg.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, 2000)
    )
  }
}

export class PetalDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

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
      pokemon.broadcastAbility({
        positionX: enemy.positionX,
        positionY: enemy.positionY
      })
    })
  }
}

export class HyperVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [25, 50, 100][pokemon.stars - 1] ?? 200
    const confusionDuration = [1000, 2000, 3000][pokemon.stars - 1] ?? 3

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        if (chance(0.3, pokemon)) {
          tg.status.triggerConfusion(confusionDuration, tg, pokemon)
        }
      }
    })
  }
}
export class ShadowCloneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const spawnPosition = board.getClosestAvailablePlace(
      pokemon.positionX,
      pokemon.positionY
    )

    if (spawnPosition) {
      const p = PokemonFactory.createPokemonFromName(pokemon.name, {
        emotion: pokemon.emotion,
        shiny: pokemon.shiny
      })
      let itemStolen: Item | null = null
      if (target.items.size > 0) {
        itemStolen = pickRandomIn(values(target.items))
        target.removeItem(itemStolen)
      }

      const clone = pokemon.simulation.addPokemon(
        p,
        spawnPosition.x,
        spawnPosition.y,
        pokemon.team,
        true
      )
      clone.maxHP = min(1)(
        Math.ceil(
          0.5 *
            pokemon.maxHP *
            (1 + pokemon.ap / 100) *
            (crit ? pokemon.critPower : 1)
        )
      )
      clone.hp = clone.maxHP
      if (itemStolen) clone.addItem(itemStolen)
    }
  }
}

export class VoltSwitchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class AccelerockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    target = destination?.target ?? target
    super.process(pokemon, board, target, crit)
    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board)
      pokemon.setTarget(destination.target)
    }
    target.handleSpecialDamage(
      pokemon.atk,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    const nbEffects = max(Math.floor(pokemon.def / 2))(
      Math.round(5 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1))
    )
    pokemon.addDefense(-2 * nbEffects, pokemon, 0, false)
    pokemon.addSpeed(nbEffects * 5, pokemon, 0, false)
  }
}

export class NuzzleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    target = destination?.target ?? target
    super.process(pokemon, board, target, crit)

    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    const duration = 3000

    if (destination) {
      pokemon.setTarget(destination.target)
      pokemon.moveTo(destination.x, destination.y, board)
    }

    target.status.triggerParalysis(duration, target, pokemon)
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

export class HeadSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [40, 80, 150][pokemon.stars - 1] ?? 150
    const recoil = [10, 20, 40][pokemon.stars - 1] ?? 40

    if (target.status.sleep || target.status.freeze) {
      target.handleSpecialDamage(9999, board, AttackType.TRUE, pokemon, crit)
    } else {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
    if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class DoubleEdgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [55, 110, 220][pokemon.stars - 1] ?? 220
    const recoil = [20, 40, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class RockSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    const armorBreakDuration = [3000, 6000, 9000][pokemon.stars - 1] ?? 9000

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerArmorReduction(armorBreakDuration, target)
  }
}

export class RockTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const debuff = [10, 20, 40][pokemon.stars - 1] ?? 40

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addSpeed(-debuff, pokemon, 0, false)
  }
}

export class RoarOfTimeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const speedBuff = 20
    const candidates = board.cells.filter(
      (cell) => cell && cell.team === pokemon.team && !cell.status.resurection
    ) as PokemonEntity[]
    const strongest = getStrongestUnit(candidates)
    if (strongest) {
      strongest.status.addResurrection(strongest)
      strongest.addSpeed(speedBuff, pokemon, 1, crit)
    }
  }
}

export class HealBlockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const shouldTriggerSpikeAnimation = pokemon.status.spikeArmor
    super.process(pokemon, board, target, crit, !shouldTriggerSpikeAnimation)
    if (pokemon.status.spikeArmor) {
      const damage = 30
      OrientationArray.forEach((orientation) => {
        effectInLine(board, pokemon, orientation, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
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
    const duration =
      pokemon.stars === 3 ? 10000 : pokemon.stars === 2 ? 5000 : 3000
    pokemon.status.triggerSpikeArmor(duration)
  }
}

export class OriginPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 30

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 5)
      .forEach((cell) => {
        if (cell.value && pokemon.team !== cell.value.team) {
          cell.value.addSpecialDefense(-3, pokemon, 0, false)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = [2000, 4000, 6000][pokemon.stars - 1] ?? 6000
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100

    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team != enemy.team) {
        if (
          enemy.status.curseFate ||
          enemy.status.curseTorment ||
          enemy.status.curseVulnerability ||
          enemy.status.curseWeakness
        ) {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
        enemy.status.triggerFatigue(duration, enemy)
      }
    })
  }
}

export class ToxicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = 0.5
    const duration = Math.round(
      [3000, 6000, 9000][pokemon.stars] ??
        9000 *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    const count = pokemon.stars

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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const freezeDuration = 2000
    const damage = [10, 20, 30][pokemon.stars - 1] ?? 30
    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team != enemy.team) {
        enemy.handleSpecialDamage(
          enemy.status.freeze ? damage * 2 : damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        enemy.status.triggerFreeze(freezeDuration, enemy)
      }
    })
  }
}

export class ProtectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = 0.5
    const duration = Math.round(
      ([1000, 3000, 5000][pokemon.stars - 1] ?? 5000) *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
  }
}

export class ObstructStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = 0.5
    const duration = Math.round(
      2000 *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
    pokemon.effects.add(EffectEnum.OBSTRUCT)
    pokemon.commands.push(
      new DelayedCommand(
        () => pokemon.effects.delete(EffectEnum.OBSTRUCT),
        duration
      )
    )
  }
}

export class SingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const timer = Math.round(
      2000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
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

export class IcicleMissileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 50
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
        const targetX = tg.positionX
        const targetY = tg.positionY
        pokemon.broadcastAbility({
          targetX,
          targetY,
          delay: i
        })

        pokemon.commands.push(
          new DelayedCommand(() => {
            const entityHit = board.getEntityOnCell(targetX, targetY)
            if (
              entityHit &&
              entityHit.hp > 0 &&
              entityHit.team !== pokemon.team
            ) {
              entityHit.status.triggerFreeze(3000, tg)
              entityHit.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }, 1500)
        )
      }
    }
  }
}

export class ConfusionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
      target.status.triggerConfusion(timer, target, pokemon)
    }
  }
}

export class FireBlastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 110][pokemon.stars - 1] ?? 110
    const cellsHit = [
      { x: target.positionX, y: target.positionY },
      { x: target.positionX - 1, y: target.positionY },
      { x: target.positionX + 1, y: target.positionY },
      { x: target.positionX, y: target.positionY + 1 },
      { x: target.positionX - 1, y: target.positionY - 1 },
      { x: target.positionX + 1, y: target.positionY - 1 }
    ]
    for (const cell of cellsHit) {
      const entityOnCell = board.getEntityOnCell(cell.x, cell.y)
      if (entityOnCell && entityOnCell.team !== pokemon.team) {
        entityOnCell.handleSpecialDamage(
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

export class FieryDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    pokemon.addAbilityPower(30, pokemon, 0, false)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SeismicTossStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [5, 10, 20][pokemon.stars - 1] ?? 20
    const totalDamage =
      damage * (pokemon.player ? pokemon.player.experienceManager.level : 5)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.atk * pokemon.stars
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death) {
      pokemon.addPP(pokemon.maxPP * 0.5, pokemon, 0, false)
    }
  }
}

export class RockSlideStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [10, 20, 30][pokemon.stars - 1] ?? 30
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        pokemon.broadcastAbility({
          skill: "FLAME_HIT",
          positionX: cell.x,
          positionY: cell.y
        })
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      enemy.commands.push(
        new DelayedCommand(() => {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, 500)
      )
    })
  }
}

export class InfernalParadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)

    const targetsHit = new Set<PokemonEntity>()
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
      pokemon.broadcastAbility({
        skill: "FLAME_HIT",
        positionX: cell.x,
        positionY: cell.y
      })
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      if (chance(0.5, pokemon)) {
        enemy.status.triggerBurn(3000, enemy, pokemon)
      }

      enemy.handleSpecialDamage(30, board, AttackType.SPECIAL, pokemon, crit)
      enemy.commands.push(
        new DelayedCommand(() => {
          enemy.handleSpecialDamage(
            30,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, 500)
      )
    })
  }
}

export class HeatWaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 30][pokemon.stars - 1] ?? 30

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.freezeCooldown = 0
        if (chance(0.1, pokemon)) {
          value.status.triggerBurn(3000, value, pokemon)
        }
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

export class FlameThrowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team != pokemon.team &&
        distanceC(cell.x, cell.y, pokemon.positionX, pokemon.positionY) <= 3
      ) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(4000, cell.value, pokemon)
      }
    })
  }
}

export class HydroPumpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 100
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
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

export class SolarBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    if (pokemon.simulation.weather === Weather.SUN || pokemon.status.light) {
      damage = damage * 2
      pokemon.addPP(20, pokemon, 0, false)
    }
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerBurn(3000, cell.value, pokemon)
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

export class ThunderShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ThunderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    const enemies = board.cells.filter(
      (cell) => cell && cell.team !== pokemon.team
    ) as PokemonEntity[]
    const targets = pickNRandomIn(enemies, 3)
    targets.forEach((tg, index) => {
      tg.commands.push(
        new DelayedCommand(() => {
          if (chance(0.3, pokemon)) {
            tg.status.triggerParalysis(3000, tg, pokemon)
          }
          tg.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          tg.broadcastAbility({
            skill: Ability.THUNDER_SHOCK,
            targetX: tg.positionX,
            targetY: tg.positionY
          })
        }, index * 500)
      )
    })
  }
}

export class DracoMeteorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    if (target.status.burn) {
      damage = Math.round(damage * 1.3)
    }
    target.status.triggerBurn(2000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WishStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = 50
    const count = pokemon.stars

    const allies = board.cells
      .filter(
        (cell): cell is PokemonEntity =>
          cell != null && cell.team === pokemon.team
      )
      .sort((a, b) => b.maxHP - b.hp - (a.maxHP - a.hp))
      .slice(0, count)

    for (const ally of allies) {
      ally.handleHeal(heal, pokemon, 1, crit)
      ally.addLuck(20, pokemon, 1, crit)
    }
  }
}

export class LunarBlessingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && ally.hp < ally.maxHP) {
        ally.handleHeal(0.25 * ally.maxHP, pokemon, 1, crit)
        ally.status.clearNegativeStatus()
      }
    })
  }
}

export class NaturalGiftStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const heal = [30, 60, 120][pokemon.stars - 1] ?? 120

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      lowestHealthAlly.status.triggerRuneProtect(pokemon.stars * 1000)
      pokemon.broadcastAbility({
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class MeditateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = 1
    pokemon.addAttack(buff * pokemon.baseAtk, pokemon, 1, crit)
  }
}

export class CosmicPowerMoonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const apGain = 25
    board.forEach((x, y, ally) => {
      if (ally && ally.id !== pokemon.id && ally.team === pokemon.team) {
        ally.addAbilityPower(apGain, pokemon, 1, crit)
      }
    })
  }
}

export class CosmicPowerSunStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkBuffMultiplier = 0.25
    board.forEach((x, y, ally) => {
      if (ally && ally.id !== pokemon.id && ally.team === pokemon.team) {
        ally.addAttack(atkBuffMultiplier * ally.baseAtk, pokemon, 1, crit)
      }
    })
  }
}

export class DefenseCurlStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = [5, 10, 15][pokemon.stars - 1] ?? 15
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
    pokemon.resetCooldown(250)
  }
}

export class IronHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = [5, 10, 15][pokemon.stars - 1] ?? 15
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
    target.handleSpecialDamage(
      pokemon.def + pokemon.speDef,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class IronDefenseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.def
    const cellsHit = board.getCellsInFront(pokemon, target, 1)

    for (const cell of cellsHit) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY,
          pokemon,
          undefined
        )
        const destination = board.getKnockBackPlace(
          cell.value.positionX,
          cell.value.positionY,
          orientation
        )

        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board)
          cell.value.cooldown = 500
        }
        cell.value.handleSpecialDamage(
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

export class BlastBurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.effects.add(EffectEnum.CHARGE)
  }
}

export class TailwindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = [5, 10, 15][pokemon.stars - 1] ?? 15
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addSpeed(buff, pokemon, 1, crit)
      }
    })
  }
}

export class SludgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = Math.round(
      ([2000, 3000, 4000][pokemon.stars - 1] ?? 4000) *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 60
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
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

export class DischargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
        cell.value.status.triggerParalysis(5000, cell.value, pokemon)
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

export class DiveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    const shield = [15, 30, 60][pokemon.stars - 1] ?? 60
    const freezeDuration = 1000
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    pokemon.addShield(shield, pokemon, 0, false)

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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

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

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          pokemon.broadcastAbility({
            targetX: cell.x,
            targetY: cell.y
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
        board.addBoardEffect(x, y, EffectEnum.SMOKE, pokemon.simulation)
      })
    }
  }
}

export class BiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 120][pokemon.stars - 1] ?? 120
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    pokemon.handleHeal(Math.ceil(0.3 * takenDamage), pokemon, 0, false)
    if (takenDamage > 0) target.status.triggerFlinch(5000, target, pokemon)
  }
}

export class AppleAcidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = 50
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          cell.value.speDef === 0 ? damage * 2 : damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
      }
    })
  }
}

export class GravAppleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 80
    target.handleSpecialDamage(
      target.def === 0 ? damage * 2 : damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
  }
}

export class NutrientsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const heal = 40

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      lowestHealthAlly.addDefense(2, pokemon, 1, crit)
      lowestHealthAlly.addSpecialDefense(2, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class SyrupBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 50

    const highestSpeedEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => b.speed - a.speed)[0]

    if (highestSpeedEnemy) {
      const speedDebuff = 30
      highestSpeedEnemy.addSpeed(-speedDebuff, pokemon, 1, crit)
      highestSpeedEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: highestSpeedEnemy.positionX,
        targetY: highestSpeedEnemy.positionY
      })
    }
  }
}

export class FickleBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 60

    const highestSpeedEnemies = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => b.speed - a.speed)

    let numberOfBeam = 0
    for (let i = 0; i < 5; i++) {
      chance(0.5, pokemon) && numberOfBeam++
    }

    for (let i = 0; i < numberOfBeam; i++) {
      const enemy = highestSpeedEnemies[i % highestSpeedEnemies.length]
      if (enemy) {
        enemy.status.triggerParalysis(2000, enemy, pokemon, false)
        enemy.handleSpecialDamage(50, board, AttackType.SPECIAL, pokemon, crit)
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })
      }
    }
  }
}

export class PsybeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 25

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(0.5, pokemon)) {
          cell.value.status.triggerConfusion(4000, cell.value, pokemon)
        }
      }
    })
  }
}

export class HydroSteamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [35, 70, 140][pokemon.stars - 1] ?? 140

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    const cellsHit = [[pokemon.positionX + dx, pokemon.positionY + dy]]
    for (const o of orientations) {
      cellsHit.push([
        pokemon.positionX + dx + OrientationVector[o][0],
        pokemon.positionY + dy + +OrientationVector[o][1]
      ])
    }

    cellsHit.forEach((cell) => {
      const value = board.getEntityOnCell(cell[0], cell[1])
      if (value && value.team !== pokemon.team) {
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        value.status.triggerBurn(4000, value, pokemon)
      }
    })
  }
}

export class CavernousChompStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Deals 40/80/160 damage to the target. If the user is able to KO the target with its ability, it becomes Enraged for 1/2/3 seconds.
    const damage = [40, 80, 160][pokemon.stars - 1] ?? 160
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death) {
      const enragedDuration = [1000, 2000, 3000][pokemon.stars - 1] ?? 3000
      pokemon.status.triggerRage(enragedDuration, pokemon)
    }
  }
}

export class PresentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const chance = Math.pow(Math.random(), 1 - pokemon.luck / 100)
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

export class SacredSwordGrassStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbRemainingAllies = board.cells.filter(
      (p) => p && p.team === pokemon.team
    ).length
    const damage = 80 + 10 * nbRemainingAllies
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class SacredSwordIronStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const damage = 80 + 15 * nbFallenAllies
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class SacredSwordCavernStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const numberOfEnemiesInOurSide = board.cells.filter(
      (cell) =>
        cell &&
        cell.team !== pokemon.team &&
        (pokemon.team === Team.BLUE_TEAM
          ? cell.positionY < 3
          : cell.positionY > 2)
    ).length
    const damage = 80 + 20 * numberOfEnemiesInOurSide
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class SecretSwordStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 150
    const damageType =
      pokemon.count.fightingBlockCount >= 20
        ? AttackType.TRUE
        : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon, crit)
  }
}

export class MetalBurstStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.floor(30 + 3 * pokemon.count.fightingBlockCount)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class ThunderCageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerLocked(3000, cell.value)
          cell.value.status.triggerParalysis(3000, cell.value, pokemon)
          cell.value.handleSpecialDamage(
            60,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class LeafBladeStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, true)
    const damage = pokemon.atk
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, true)
  }
}

export class WaterfallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield = [50, 100, 150][pokemon.stars - 1] ?? 150
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus()
    board.clearBoardEffect(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.simulation
    )
  }
}

export class XScissorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit) // twice
  }
}

export class DragonTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    const defenseBuff = [2, 4, 6][pokemon.stars - 1] ?? 6
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addDefense(defenseBuff, pokemon, 1, crit)
    pokemon.addSpecialDefense(defenseBuff, pokemon, 1, crit)
  }
}

export class AquaTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    const shield = [30, 60, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addShield(shield, pokemon, 1, crit)
  }
}

export class DragonBreathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    const maxRange = pokemon.range + 1

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team !== pokemon.team &&
        distanceC(pokemon.positionX, pokemon.positionY, cell.x, cell.y) <=
          maxRange
      ) {
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

export class IcicleCrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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

export class IngrainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [15, 30, 60][pokemon.stars - 1] ?? 15
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 15
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
        cell.value.status.triggerLocked(lockedDuration, cell.value)
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

export class TormentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const boost = [20, 35, 50][pokemon.stars - 1] ?? 60
    pokemon.addSpeed(boost, pokemon, 1, crit)
    pokemon.resetCooldown(500)
  }
}

export class StompStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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

export class HornDrillStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageFactor = [3, 4, 5][pokemon.stars - 1] ?? 5
    let damage = pokemon.atk * damageFactor
    const executeChance =
      0.3 * (1 + min(0)((pokemon.atk - target.atk) / target.atk))
    if (chance(executeChance, pokemon)) {
      damage = 9999
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ShadowBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    board.forEach((x: number, y: number, v: PokemonEntity | undefined) => {
      if (v && pokemon.team != v.team) {
        v.addSpecialDefense(-2, pokemon, 0, false)
      }
    })
  }
}

export class BugBuzzStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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

    target.status.triggerParalysis(5000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EntanglingThreadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team !== cell.value.team) {
        cell.value.status.triggerParalysis(4000, cell.value, pokemon)
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

export class VenoshockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    pokemon.handleHeal(takenDamage, pokemon, 0, false)
  }
}

export class HappyHourStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, false) // crit is handled with TELEPORT_NEXT_ATTACK effect

    const potentialCells = [
      [0, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1],
      [board.columns - 1, 0]
    ]
    shuffleArray(potentialCells)

    for (let i = 0; i < potentialCells.length; i++) {
      const entity = board.getEntityOnCell(
        potentialCells[i][0],
        potentialCells[i][1]
      )
      if (entity === undefined) {
        pokemon.moveTo(potentialCells[i][0], potentialCells[i][1], board)
        pokemon.effects.add(EffectEnum.TELEPORT_NEXT_ATTACK)
        break
      }
    }
  }
}

export class NastyPlotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = 10
    pokemon.addAttack(buff, pokemon, 1, crit)
    pokemon.resetCooldown(250)
  }
}

export class TakeHeartStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(8, pokemon, 1, crit)
    pokemon.addSpecialDefense(8, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus()
    pokemon.resetCooldown(100)
  }
}

export class HeartSwapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
    const boostAP = target.ap
    target.speDef = target.baseSpeDef
    target.ap = 0
    pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
    pokemon.addAbilityPower(boostAP, pokemon, 0, false)
    target.handleSpecialDamage(100, board, AttackType.SPECIAL, pokemon, crit)

    pokemon.status.transferNegativeStatus(pokemon, target)
    pokemon.status.clearNegativeStatus()
  }
}

export class SpectralThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const damage = 50
    if (farthestCoordinate) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      const PkmClass = PokemonClasses[PkmByIndex[target.index]]
      if (!PkmClass)
        return logger.error(
          `Spectral Thief: No class found for ${target.name} [index ${target.index}]`
        )

      const base = new PkmClass(target.name)
      const boostAtk = min(0)(target.atk - target.baseAtk)
      const boostSpeed = min(0)(target.speed - base.speed)
      const boostDef = min(0)(target.def - target.baseDef)
      const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
      const boostAP = target.ap
      const boostHP = min(0)(target.maxHP - base.hp)
      const boostCritChance = min(0)(target.critChance - base.critChance)
      const boostCritPower = min(0)(target.critPower - base.critPower)
      const boostLuck = min(0)(target.luck - base.luck)

      target.addAttack(-boostAtk, pokemon, 0, false)
      target.addSpeed(-boostSpeed, pokemon, 0, false)
      target.addDefense(-boostDef, pokemon, 0, false)
      target.addSpecialDefense(-boostSpeDef, pokemon, 0, false)
      target.addAbilityPower(-boostAP, pokemon, 0, false)
      target.addMaxHP(-boostHP, pokemon, 0, false)
      target.addCritChance(-boostCritChance, pokemon, 0, false)
      target.addCritPower(-boostCritPower, pokemon, 0, false)
      target.addLuck(-boostLuck, pokemon, 0, false)

      pokemon.addAttack(boostAtk, pokemon, 0, false)
      pokemon.addDefense(boostDef, pokemon, 0, false)
      pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
      pokemon.addAbilityPower(boostAP, pokemon, 0, false)
      pokemon.addSpeed(boostSpeed, pokemon, 0, false)
      pokemon.addMaxHP(boostHP, pokemon, 0, false)
      pokemon.addCritChance(boostCritChance, pokemon, 0, false)
      pokemon.addCritPower(boostCritPower, pokemon, 0, false)
      pokemon.addLuck(boostLuck, pokemon, 0, false)
    }
  }
}

export class StoredPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const PkmClass = PokemonClasses[PkmByIndex[target.index]]
    const baseSpeed = PkmClass ? new PkmClass(target.name).speed : DEFAULT_SPEED
    const boostSpeed = min(0)(pokemon.speed / baseSpeed - 1)
    const boostAtk = min(0)(pokemon.atk / pokemon.baseAtk - 1)
    const boostDef = min(0)(pokemon.def / pokemon.baseDef - 1)
    const boostSpeDef = min(0)(pokemon.speDef / pokemon.baseSpeDef - 1)
    const boostAP = min(0)(pokemon.ap / 100 - 1)

    const damage = Math.round(
      20 * (1 + boostAtk + boostDef + boostSpeDef + boostSpeed + boostAP)
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = 15
    if (pokemon.stars === 2) {
      damage = 30
    }
    if (pokemon.stars === 3) {
      damage = 60
    }

    target.items.forEach((item) => {
      pokemon.addItem(item)
      target.removeItem(item)
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class KnockOffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 90 + target.items.size * 30

    target.items.forEach((item) => {
      target.removeItem(item)
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class StunSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 20
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerParalysis(5000, cell.value, pokemon)
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

export class MeteorMashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 25

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(3000, cell.value, pokemon)
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

export class FleurCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 120
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(2000, cell.value, pokemon)
      }
    })
  }
}

export class WildboltStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(4000, cell.value, pokemon)
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

export class BleakwindStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerFreeze(2000, cell.value)
      }
    })
  }
}

export class SpringtideStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 80

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerCharm(2000, cell.value, pokemon)
      }
    })
  }
}

export class FakeTearsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [5, 10, 15][pokemon.stars - 1] ?? 15

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerArmorReduction(3000, value)
        pokemon.broadcastAbility({ positionX: x, positionY: y })
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 25, 50][pokemon.stars - 1] ?? 15
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    cells.forEach((cell) => {
      const entity = cell.value
      if (entity && entity.team !== pokemon.team) {
        entity.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      } else if (entity && entity.team === pokemon.team && entity.status.burn) {
        entity.status.healBurn(entity)
        entity.effects.add(EffectEnum.IMMUNITY_BURN)
        entity.commands.push(
          new DelayedCommand(() => {
            entity.effects.delete(EffectEnum.IMMUNITY_BURN)
          }, 3000)
        )
      }
    })
  }
}

export class DragonDartsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    if (target.hp <= 0) {
      pokemon.addPP(40, pokemon, 0, false)
    }
  }
}

export class MetronomeStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const threshold = Math.pow(Math.random(), 1 + pokemon.luck / 100)
    let rarity = Rarity.COMMON
    if (threshold < 1 / 8) {
      rarity = Rarity.ULTRA
    } else if (threshold < 2 / 8) {
      rarity = Rarity.LEGENDARY
    } else if (threshold < 3 / 8) {
      rarity = Rarity.EPIC
    } else if (threshold < 4 / 8) {
      rarity = Rarity.UNIQUE
    } else if (threshold < 5 / 8) {
      rarity = Rarity.RARE
    } else if (threshold < 6 / 8) {
      rarity = Rarity.SPECIAL
    } else if (threshold < 7 / 8) {
      rarity = Rarity.UNCOMMON
    } else {
      rarity = Rarity.COMMON
    }

    const pokemonOptions = PRECOMPUTED_POKEMONS_PER_RARITY[rarity]
    if (rarity === Rarity.SPECIAL) {
      pokemonOptions.push(...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.HATCH])
    }

    const skillOptions = [
      ...new Set(pokemonOptions.map((p) => getPokemonData(p).skill))
    ]

    const skill = pickRandomIn(
      skillOptions.filter((s) => AbilityStrategies[s].copyable)
    )

    pokemon.broadcastAbility({ skill })
    AbilityStrategies[skill].process(pokemon, board, target, crit)
  }
}

export class SkyAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: Ability.SKY_ATTACK,
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target?.hp > 0) {
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

export class SkyAttackShadowStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: Ability.SKY_ATTACK,
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target?.hp > 0) {
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target && destination.target.hp > 0) {
            const damage = 0.5 * pokemon.maxHP
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const boost = [10, 20, 30][pokemon.stars - 1] ?? 30
    pokemon.addSpeed(boost, pokemon, 1, crit)
  }
}

export class SpiritShackleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerWound(4000, cell.value, pokemon)
      }
    })
  }
}

export class WaterShurikenStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 60][pokemon.stars - 1] ?? 60
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
      effectInLine(board, pokemon, orientation, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
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

export class RazorLeafStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
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

export class PsychoCutStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        for (let i = 0; i < 3; i++) {
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

export class ShadowSneakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 120
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (takenDamage > 0) {
      pokemon.handleHeal(Math.round(takenDamage * 0.3), pokemon, 0, crit)
    }
  }
}

export class ForecastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      if (p && pokemon.team === p.team) {
        p.addShield(10, pokemon, 1, crit)
        if (pokemon.name === Pkm.CASTFORM_SUN) {
          p.addAttack(4, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_RAIN) {
          p.addPP(8, pokemon, 1, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.resetCooldown(100)
  }
}

export class MegaPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = 60
    if (pokemon.def > target.def) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MawashiGeriStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = 60
    if (pokemon.atk > target.atk) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    let farthestEmptyCell: Cell | null = null
    effectInLine(board, pokemon, target, (cell) => {
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })
    if (farthestEmptyCell != null) {
      const { x, y } = farthestEmptyCell as Cell
      target.moveTo(x, y, board)
    }
  }
}

export class HeadbuttStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    if (target.shield > 0) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(5000, target, pokemon)
  }
}

export class TripleKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(15, pokemon, 1, crit)
    pokemon.addSpecialDefense(10, pokemon, 1, crit)
    pokemon.addSpeed(20, pokemon, 0, false)
  }
}

export class DeathWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}

export class HexStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    let attackBuff = [3, 5, 7][pokemon.stars - 1] ?? 7
    let hpBuff = [10, 20, 40][pokemon.stars - 1] ?? 40
    if (pokemon.simulation.weather === Weather.SUN) {
      attackBuff *= 2 // grows twice as fast if sunny weather
      hpBuff *= 2
    }
    pokemon.addAttack(attackBuff, pokemon, 1, crit)
    pokemon.addMaxHP(hpBuff, pokemon, 1, crit)
    pokemon.resetCooldown(250)
  }
}

export class HealOrderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const damage = pokemon.stars === 3 ? 65 : pokemon.stars === 2 ? 45 : 25

    cells.forEach((cell) => {
      if (cell.value) {
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          pokemon.broadcastAbility({
            skill: "ATTACK_ORDER",
            positionX: cell.x,
            positionY: cell.y
          })
        } else {
          cell.value.handleHeal(damage, pokemon, 1, crit)
          pokemon.broadcastAbility({
            skill: "HEAL_ORDER",
            positionX: cell.x,
            positionY: cell.y
          })
        }
      }
    })
  }
}

export class ShellTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.shield > 0) {
      const damage = 50 + pokemon.shield
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
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
      pokemon.shield = 0
    } else {
      const shield = 75
      pokemon.addShield(shield, pokemon, 1, crit)
    }
  }
}

export class DigStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class FireSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 50
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 30, 50][pokemon.stars - 1] ?? 50
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SplashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // does nothing, intentionally
  }
}

export class CounterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.max(1, Math.round((pokemon.maxHP - pokemon.hp) * 0.5))
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.status.triggerPoison(5000, target, pokemon)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class SilverWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    pokemon.addAttack(1, pokemon, 0, false)
    pokemon.addDefense(1, pokemon, 0, false)
    pokemon.addSpecialDefense(1, pokemon, 0, false)
    pokemon.addSpeed(10, pokemon, 0, false)
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
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class IcyWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const speedDebuff = [10, 20, 40][pokemon.stars - 1] ?? 40

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addSpeed(-speedDebuff, pokemon, 0, false)
      }
    })
  }
}

export class GigatonHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = 100
    if (pokemon.stars === 2) {
      damage = 200
    }
    if (pokemon.stars === 3) {
      damage = 400
    }
    pokemon.status.triggerFatigue(6000, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AcrobaticsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const travelDistance = 4 - pokemon.items.size
    const candidateDestinationCells = board
      .getCellsInRadius(pokemon.targetX, pokemon.targetY, pokemon.range)
      .filter((cell) => cell.value === undefined)
      .sort(
        (a, b) =>
          Math.abs(
            travelDistance -
              distanceM(a.x, a.y, pokemon.positionX, pokemon.positionY)
          ) -
          Math.abs(
            travelDistance -
              distanceM(b.x, b.y, pokemon.positionX, pokemon.positionY)
          )
      )
    if (candidateDestinationCells.length > 0) {
      const destination = candidateDestinationCells[0]
      pokemon.moveTo(destination.x, destination.y, board)
    }
  }
}

export class AbsorbStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const multiplier = 2
    const defenseBoost = [2, 5, 10][pokemon.stars - 1] ?? 10

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

export class IceBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage = [10, 20, 30][pokemon.stars - 1] ?? 30
    const multiplier = [0.5, 1, 1.5][pokemon.stars - 1] ?? 1.5
    const speDefBoost = 10

    pokemon.addSpecialDefense(speDefBoost, pokemon, 0, false)
    target.handleSpecialDamage(
      baseDamage + multiplier * pokemon.speDef,
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(pokemon.baseAtk, pokemon, 1, crit)
    pokemon.status.triggerConfusion(3000, pokemon, pokemon)
  }
}

export class MagmaStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const targetsHit = new Set<string>()
    const baseDamage = 100
    let power = 1

    const propagate = (currentTarget: PokemonEntity) => {
      targetsHit.add(currentTarget.id)
      pokemon.broadcastAbility({
        skill: Ability.MAGMA_STORM,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY,
        ap: Math.round(pokemon.ap * power)
      })
      currentTarget.handleSpecialDamage(
        baseDamage * power,
        board,
        AttackType.SPECIAL,
        pokemon,
        false
      )

      power -= 0.2
      if (power <= 0) return
      pokemon.commands.push(
        new DelayedCommand(() => {
          const board = pokemon.simulation.board
          const nextEnemies = board
            .getAdjacentCells(currentTarget.positionX, currentTarget.positionY)
            .filter(
              (cell) =>
                cell.value &&
                cell.value.team === currentTarget.team &&
                !targetsHit.has(cell.value.id)
            )
          nextEnemies.forEach((enemy) => {
            if (
              enemy &&
              enemy.value &&
              enemy.value.hp > 0 &&
              !pokemon.simulation.finished
            ) {
              propagate(enemy.value)
            }
          })
        }, 250)
      )
    }

    propagate(target)
  }
}

export class SlashingClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const status = pickRandomIn(["poison", "sleep", "paralysis"])
    switch (status) {
      case "poison":
        target.status.triggerPoison(3000, target, pokemon)
        break
      case "sleep":
        target.status.triggerSleep(3000, target)
        break
      case "paralysis":
        target.status.triggerParalysis(3000, target, pokemon)
        break
    }

    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class FakeOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 150][pokemon.stars - 1] ?? 150
    if (pokemon.ap >= 0) target.status.triggerFlinch(3000, target)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(-30, pokemon, 0, false)
  }
}

export class FellStingerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 4 * pokemon.baseAtk
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death && !pokemon.isSpawn) {
      pokemon.addAttack(0.3 * pokemon.baseAtk, pokemon, 0, false)
    }
  }
}

export class EruptionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 50, 70][pokemon.stars - 1] ?? 30
    const numberOfProjectiles =
      pokemon.stars === 1 ? 20 : pokemon.stars === 2 ? 30 : 45

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getEntityOnCell(x, y)
          if (value && value.team !== pokemon.team) {
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            value.status.triggerBurn(5000, value, pokemon)
          }
          pokemon.broadcastAbility({ targetX: x, targetY: y })
        }, i * 100)
      )
    }
  }
}

export class HailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 50
    const numberOfProjectiles = [10, 20, 30][pokemon.stars - 1] ?? 30

    for (let i = 0; i < numberOfProjectiles; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y =
        target.positionY >= 3
          ? randomBetween(3, BOARD_HEIGHT - 1)
          : randomBetween(0, 3)
      const enemyHit = board.getEntityOnCell(x, y)
      if (enemyHit && enemyHit.team !== pokemon.team) {
        enemyHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        enemyHit.effects.add(EffectEnum.HAIL)
        enemyHit.status.triggerFreeze(1000, enemyHit)
      }
      pokemon.broadcastAbility({
        skill: "HAIL_PROJECTILE",
        targetX: x,
        targetY: y
      })
      board.addBoardEffect(x, y, EffectEnum.HAIL, pokemon.simulation)
    }
  }
}

export class MistBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 25

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY
        ) <= 4
      ) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addAbilityPower(-30, pokemon, 0, false)
      }
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.addAbilityPower(-30, pokemon, 0, false)
          }
        })
      }, 1000)
    )
  }
}

export class LusterPurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 30

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY
        ) <= 4
      ) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addSpecialDefense(-5, pokemon, 0, false)
      }
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.addSpecialDefense(-5, pokemon, 0, false)
          }
        })
      }, 1000)
    )
  }
}

export class MudBubbleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}

export class LinkCableStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate && farthestTarget) {
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      pokemon.setTarget(farthestTarget)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (pokemon.hp <= 0) return
        const partner = board.find(
          (x, y, entity) =>
            entity.skill === Ability.LINK_CABLE &&
            entity.id !== pokemon.id &&
            entity.team === pokemon.team
        )
        if (partner) {
          const damage = 50
          const targetsHit = new Set<PokemonEntity>()
          effectInLine(board, pokemon, partner, (cell) => {
            if (cell.value != null && cell.value.team !== pokemon.team) {
              targetsHit.add(cell.value)
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
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_link",
            targetX: partner.positionX,
            targetY: partner.positionY
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_discharge",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_discharge",
            positionX: partner.positionX,
            positionY: partner.positionY,
            delay: 200
          })
        } else {
          const damage = 25
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
          pokemon.broadcastAbility({ skill: "LINK_CABLE_discharge" })
        }
      }, 300)
    )
  }
}

export class MagicBounceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.status.triggerMagicBounce(5000)
  }
}

export class ReflectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.status.triggerReflect(2000)
  }
}
export class ShellSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    pokemon.addSpeed(20, pokemon, 0, false)
    pokemon.addDefense(-2, pokemon, 0, false)
    pokemon.addSpecialDefense(-2, pokemon, 0, false)
  }
}

export class HelpingHandStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
        ally.effects.add(EffectEnum.DOUBLE_DAMAGE)
        ally.addShield(shield, pokemon, 1, crit)
        pokemon.broadcastAbility({
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damagePerGhost = 20

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbGhosts = 7 * (1 + pokemon.ap / 100)
    for (let i = 0; i < nbGhosts; i++) {
      const randomTarget = pickRandomIn(enemies)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            targetX: randomTarget.positionX,
            targetY: randomTarget.positionY
          })
          if (randomTarget?.hp > 0) {
            randomTarget.handleSpecialDamage(
              damagePerGhost,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit,
              false
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10

    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    const targetsHit: Set<PokemonEntity> = new Set()

    pokemon.broadcastAbility({
      targetX: farthestTarget.positionX,
      targetY: farthestTarget.positionY
    })

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.status.triggerBurn(2000, enemy, pokemon)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class WhirlpoolStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit, true)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        targetsHit.add(cell.value)
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
        break // only first enemy in the line is hit
      }
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      for (let i = 0; i < 4; i++) {
        enemy.handleSpecialDamage(
          Math.ceil(pokemon.atk * 1.25),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class AnchorShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit, true)
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
      pokemon.broadcastAbility({
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
      farthestTarget.cooldown = min(750)(farthestTarget.cooldown)
    }
  }
}

export class SmogStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = pokemon.stars === 1 ? 10 : pokemon.stars === 2 ? 20 : 40

    cells.forEach((cell) => {
      board.addBoardEffect(cell.x, cell.y, EffectEnum.SMOKE, pokemon.simulation)
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

export class CottonGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const shield = [15, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.addDefense(3, pokemon, 1, crit)
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.COTTON_BALL,
        pokemon.simulation
      )
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSleep(1000, cell.value)
      }
    })
  }
}

export class LavaPlumeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80

    cells.forEach((cell) => {
      board.addBoardEffect(cell.x, cell.y, EffectEnum.EMBER, pokemon.simulation)
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      }
    })
  }
}

export class ShelterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defGain = [5, 10, 15][pokemon.stars - 1] ?? 15
    pokemon.addDefense(defGain, pokemon, 1, crit)
    const cells = board.getCellsInFront(pokemon, target)
    cells.forEach((cell) => {
      board.addBoardEffect(cell.x, cell.y, EffectEnum.SMOKE, pokemon.simulation)
    })
  }
}

export class MagnetRiseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbAlliesBuffed = [2, 4, 6][pokemon.stars - 1] ?? 6
    const alliesBuffed = (
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY)
        .map((cell) => cell.value)
        .filter((mon) => mon && mon.team === pokemon.team) as PokemonEntity[]
    )
      .sort((a, b) => a.hp - b.hp)
      .slice(0, nbAlliesBuffed)

    alliesBuffed.push(pokemon)
    alliesBuffed.forEach((ally) => {
      ally.status.triggerProtect(2000)
      ally.addDodgeChance(0.1, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })
  }
}

export class AttractStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const targets = pickNRandomIn(
      board.cells.filter((v) => v && v.team !== pokemon.team),
      pokemon.stars
    )
    targets?.forEach((t) => {
      if (t) {
        pokemon.broadcastAbility({
          targetX: t.positionX,
          targetY: t.positionY
        })
        t?.status.triggerCharm(1000, t, pokemon, true)
      }
    })
  }
}

export class WaterPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [75, 150][pokemon.stars - 1] ?? 150
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .concat(target)
      .forEach((v) => {
        if (v) {
          v.status.triggerConfusion(2000, v, pokemon)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class ParabolicChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = pokemon.stars > 1 ? 50 : 25
    const overHeal = Math.max(0, heal + pokemon.hp - pokemon.maxHP)
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

export class TeeterDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addSpeed(20, pokemon, 1, crit)
    board.cells
      .filter((v) => v !== undefined)
      .forEach((v) => v && v.status.triggerConfusion(3000, v, pokemon))
  }
}

export class CloseCombatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addDefense(-2, pokemon, 0, false)
    pokemon.addSpecialDefense(-2, pokemon, 0, false)
    target.handleSpecialDamage(130, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AssistStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
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
      pokemon.broadcastAbility({ skill })
      AbilityStrategies[skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}

export class FissureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const numberOfRifts = [2, 3, 4][pokemon.stars - 1] ?? 4
    const damage = [25, 50, 75][pokemon.stars - 1] ?? 75
    for (let i = 0; i < numberOfRifts; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y = randomBetween(0, BOARD_HEIGHT - 1)
      const cells = board.getAdjacentCells(x, y)
      cells.push({ x, y, value: board.getEntityOnCell(x, y) })

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
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      })
    }
  }
}

export class AssuranceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25

    target.handleSpecialDamage(
      pokemon.hp / pokemon.maxHP < 0.5 ? damage * 2 : damage,
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [20, 40, 80][pokemon.stars - 1] ?? 80
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(target, board)
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
        value: board.getEntityOnCell(
          mostSurroundedCoordinate.x,
          mostSurroundedCoordinate.y
        )
      })

      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus()
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
    }
  }
}

export class LungeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.POISON_GAS,
        pokemon.simulation
      )

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerPoison(3000, cell.value, pokemon)
      }
    })
  }
}

export class BraveBirdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.status.triggerArmorReduction(3000, enemy)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class StealthRocksStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target, pokemon.stars)
    const damage = 50

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STEALTH_ROCKS,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
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

export class SpikesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbSpikes = Math.round(6 * (1 + pokemon.ap / 100))
    const cells = pickNRandomIn(
      board.getCellsInFront(pokemon, target, 3),
      nbSpikes
    )
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.SPIKES,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })

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

export class StickyWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target, 2)
    const damage = pokemon.stars === 3 ? 70 : pokemon.stars === 2 ? 35 : 20

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STICKY_WEB,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
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

export class CottonSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const NB_MAX_TARGETS = 3
    const speedDebuff = [10, 20, 30][pokemon.stars - 1] ?? 30
    const enemies = board.cells
      .filter<PokemonEntity>(
        (v): v is PokemonEntity => v != null && v.team !== pokemon.team
      )
      .sort((a, b) => {
        const distanceA = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          a.positionX,
          a.positionY
        )
        const distanceB = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          b.positionX,
          b.positionY
        )
        return distanceA - distanceB
      })
    const nearestEnemies = enemies.slice(0, NB_MAX_TARGETS)

    nearestEnemies.forEach((enemy) => {
      enemy.addSpeed(-speedDebuff, pokemon, 1, crit)
      board.addBoardEffect(
        enemy.positionX,
        enemy.positionY,
        EffectEnum.COTTON_BALL,
        pokemon.simulation
      )
      pokemon.broadcastAbility({
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
    })
  }
}

export class StruggleBugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(5, pokemon, 1, crit)
    pokemon.addSpecialDefense(5, pokemon, 1, crit)
    pokemon.addSpeed(10, pokemon, 1, crit)
    pokemon.addAbilityPower(20, pokemon, 0, false)
  }
}

export class TailGlowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flip = pokemon.team === Team.RED_TEAM
    for (let dx = -1; dx <= 1; dx++) {
      const x = target.positionX + dx
      if (x < 0 || x >= board.columns) continue
      for (
        let y = flip ? 0 : board.rows;
        flip ? y < board.rows : y > 0;
        y += flip ? 1 : -1
      ) {
        const entityOnCell = board.getEntityOnCell(x, y)
        if (entityOnCell && entityOnCell.team !== pokemon.team) {
          entityOnCell.handleSpecialDamage(
            60,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // move the entity to the next cell in the direction of the laser
          const newY = y + (flip ? -1 : 1)
          if (
            newY >= 0 &&
            newY < board.rows &&
            !board.getEntityOnCell(x, newY)
          ) {
            entityOnCell.moveTo(x, newY, board)
          }
        }
      }
    }
  }
}

export class NightShadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.ceil(
      ([0.25, 0.33, 0.5][pokemon.stars - 1] ?? 0.5) *
        target.maxHP *
        (1 + (0.5 * pokemon.ap) / 100)
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

export class SuperFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.ceil(
      0.25 * target.maxHP * (1 + (0.5 * pokemon.ap) / 100)
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

export class ChargeBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, false)
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
      pokemon.broadcastAbility({
        skill: "LINK_CABLE_link",
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const debuff = [-2, -4, -8][pokemon.stars - 1] ?? -8
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addDefense(debuff, pokemon, 1, crit)
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      }
    })
  }
}

export class SandTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const statusDuration = [3000, 5000, 8000][pokemon.stars - 1] ?? 8000
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40

    target.status.triggerParalysis(statusDuration, target, pokemon)
    target.status.triggerSilence(statusDuration, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WhirlwindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const x = target.positionX
    const y = target.positionY
    const damage = [40, 80, 120][pokemon.stars - 1] ?? 120
    target.flyAway(board)
    pokemon.broadcastAbility({
      positionX: x,
      positionY: y,
      targetX: target.positionX,
      targetY: target.positionY
    })
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AcidSprayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    let tg: PokemonEntity | undefined = target
    const affectedTargetsIds = new Array<string>()
    for (let i = 0; i < 5; i++) {
      if (tg) {
        pokemon.broadcastAbility({
          targetX: tg.positionX,
          targetY: tg.positionY
        })
        tg.addSpecialDefense(-5, pokemon, 0, false)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.index = PkmIndex[Pkm.HOOPA_UNBOUND]
    pokemon.skill = Ability.HYPERSPACE_FURY
    pokemon.addAttack(10, pokemon, 0, false)
    pokemon.addMaxHP(100, pokemon, 0, false)
    pokemon.toMovingState()
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(Pkm.HOOPA_UNBOUND)
    }
  }
}

export class HyperspaceFuryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbHits = Math.round(
      4 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < nbHits; i++) {
      target.addDefense(-1, pokemon, 0, false)
      target.addSpecialDefense(-1, pokemon, 0, false)
      target.handleSpecialDamage(
        15,
        board,
        AttackType.SPECIAL,
        pokemon,
        false,
        false
      )
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      orientation: nbHits // use orientation field for the number of hits
    })
  }
}

export class SnipeShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [40, 80, 160][pokemon.stars - 1] ?? 160
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestTarget) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestTarget.positionX,
        farthestTarget.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class AirSlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25
    target.status.triggerFlinch(7000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EggBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .forEach((v) => {
        if (v) {
          const kill = v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (
            kill.death &&
            !pokemon.isGhostOpponent &&
            pokemon.player &&
            chance(0.25, pokemon)
          ) {
            giveRandomEgg(pokemon.player, false)
          }
          v.status.triggerArmorReduction(4000, v)
        }
      })
  }
}

export class BodySlamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(0.3 * pokemon.maxHP * (1 + pokemon.ap / 100))
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((cell) => cell.value)
      .filter((entity) => entity?.team === target.team)
      .concat(target)
      .forEach((enemy) => {
        if (enemy) {
          enemy.status.triggerParalysis(3000, enemy, pokemon)
        }
      })
    target.handleSpecialDamage(100, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class BarbBarrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

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
            pokemon.broadcastAbility({
              targetX: v.positionX,
              targetY: v.positionY,
              orientation: v.orientation
            })
          }
        })
    }

    const damage = [20, 40, 60, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class FloralHealingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (pokemon.items.has(Item.COMFEY) === false) {
      // if comfey is hold item, we explicitely not trigger super.process() so that the pokemon doesn't get twice the oncast effects
      super.process(pokemon, board, target, crit)
    }
    pokemon.handleHeal(pokemon.maxPP, pokemon, 0, false)
  }
}

export class MagicPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const damage = pokemon.atk * 1.5

    for (let i = 0; i <= nbFallenAllies; i++) {
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

export class SlashStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    const increasedCrit = [30, 60, 90][pokemon.stars - 1] ?? 90
    crit = chance((pokemon.critChance + increasedCrit) / 100, pokemon) // can crit by default with increased crit chance
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class OutrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.status.triggerConfusion(2000, pokemon, pokemon)
    const damage = Math.round(
      ([1.5, 2, 2.5][pokemon.stars - 1] ?? 2.5) * pokemon.atk
    )
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team && v?.id !== target.id)
      .concat(target)
      .forEach((v) => {
        if (v) {
          pokemon.broadcastAbility({
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // deals 80 special damage. Double damage if attacker got more atk speed than target.
    const damage = 80 * (pokemon.speed > target.speed ? 2 : 1)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const goldDamage = pokemon.player?.money ? pokemon.player?.money : 0
    const damage = 20 + goldDamage
    if (pokemon.player) {
      pokemon.player.addMoney(2, true, pokemon)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.handleHeal(0.25 * pokemon.maxHP, pokemon, 1, crit)
  }
}

export class TranseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.skill = Ability.HEADBUTT
    pokemon.index = PkmIndex[Pkm.DARMANITAN]
    pokemon.name = Pkm.DARMANITAN
    pokemon.changePassive(Passive.DARMANITAN)
    pokemon.skill = Ability.HEADBUTT
    pokemon.handleHeal(Math.round(0.3 * pokemon.maxHP), pokemon, 0, false)
    pokemon.addAttack(10, pokemon, 0, false)
    pokemon.addSpeed(20, pokemon, 0, false)
    pokemon.addDefense(-10, pokemon, 0, false)
    pokemon.addSpecialDefense(-10, pokemon, 0, false)
    pokemon.range = min(1)(pokemon.range - 4)
    pokemon.toMovingState()
    pokemon.cooldown = 0
    pokemon.effects.delete(EffectEnum.SPECIAL_ATTACKS)
  }
}

export class CurseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    const highestHp = Math.max(...enemies.map((p) => p.maxHP))
    const enemiesWithHighestHP = enemies.filter((p) => p.maxHP === highestHp)
    const cursedEnemy = pickRandomIn(enemiesWithHighestHP)
    if (cursedEnemy) {
      const factor = 0.2
      const curseDelay = min(0)(
        ([8000, 5000, 3000][pokemon.stars - 1] ?? 3000) *
          (1 - (factor * pokemon.ap) / 100) *
          (crit ? 1 - (pokemon.critPower - 1) * factor : 1)
      )
      cursedEnemy.status.triggerCurse(curseDelay, cursedEnemy)
    }
  }
}

export class DoomDesireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          pokemon.broadcastAbility({
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
          pokemon.pp = pokemon.maxPP // cast again immediately if target is dead
        }
      }, 2000)
    )
    pokemon.resetCooldown(200)
  }
}

export class PoltergeistStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(50 + (target.hp / target.maxHP) * 200)
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

export class AuraSphereStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100][pokemon.stars - 1] ?? 25
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerSilence(3000, cell.value, pokemon)
      }
    })
  }
}

export class SketchStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
  }
}

export class LovelyKissStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

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
        ([2000, 4000, 6000][pokemon.stars - 1] ?? 2000) *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      target.status.triggerSleep(duration, target)
    }
  }
}

export class OverdriveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (target && target.canBeCopied) {
      pokemon.index = target.index
      pokemon.rarity = target.rarity
      pokemon.stars = target.stars
      pokemon.skill = target.skill
      pokemon.changePassive(target.passive)
      pokemon.baseAtk = target.atk
      pokemon.baseDef = target.def
      pokemon.baseSpeDef = target.speDef
      pokemon.baseRange = target.baseRange
      pokemon.atk = target.atk
      pokemon.speed = target.speed
      pokemon.def = target.def
      pokemon.speDef = target.speDef
      pokemon.ap = target.ap
      pokemon.maxPP = target.maxPP
      pokemon.speed = target.speed
      pokemon.critChance = target.critChance
      pokemon.critPower = target.critPower
      pokemon.range = target.range
      pokemon.shiny = target.shiny
      pokemon.emotion = target.emotion
      pokemon.dodge = target.dodge
    }
  }
}

export class PsychicFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.atk = Math.min(target.atk, target.baseAtk)
    target.def = Math.min(target.def, target.baseDef)
    target.speDef = Math.min(target.speDef, target.baseSpeDef)
    target.handleSpecialDamage(
      80,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class ShedTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.addShield(80, pokemon, 1, crit)
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(lowestHealthAlly)
      if (coord) {
        const substitute = PokemonFactory.createPokemonFromName(
          Pkm.SUBSTITUTE,
          pokemon.player
        )
        pokemon.moveTo(coord.x, coord.y, board)
        pokemon.simulation.addPokemon(substitute, x, y, pokemon.team, true)
        for (const pokemonTargetingCaster of board.cells.filter(
          (p) => p?.targetEntityId === pokemon.id
        )) {
          pokemonTargetingCaster!.targetEntityId = substitute.id
        }
      }
    }
  }
}

export class ShadowPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.orientation = board.orientation(
          coord.x,
          coord.y,
          pokemon.positionX,
          pokemon.positionY,
          pokemon,
          lowestHealthEnemy
        )
        pokemon.moveTo(coord.x, coord.y, board)
      }
      pokemon.effects.add(EffectEnum.SHADOW_PUNCH_NEXT_ATTACK)
    }
  }
}

export class MagnetBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    const centerDamage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const lockDuration = 1500

    target.handleSpecialDamage(
      centerDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    target.status.triggerLocked(lockDuration, target)

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
        cell.value.status.triggerLocked(lockDuration, cell.value)
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
        .map(([x, y]) => board.getEntityOnCell(x, y))
        .filter((enemy) => enemy && enemy.team === target.team)
      const [destX, destY] = cell.to
      if (
        attractedEnemies.length > 0 &&
        board.getEntityOnCell(destX, destY) === undefined
      ) {
        const attractedEnemy = pickRandomIn(attractedEnemies)!
        attractedEnemy.moveTo(destX, destY, board)
        attractedEnemy.status.triggerLocked(lockDuration, attractedEnemy)
      }
    })
  }
}

export class NightSlashStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class KowtowCleaveStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({ skill: Ability.SHIELDS_UP })
    const pkm = pickRandomIn([
      Pkm.MINIOR_KERNEL_BLUE,
      Pkm.MINIOR_KERNEL_GREEN,
      Pkm.MINIOR_KERNEL_ORANGE,
      Pkm.MINIOR_KERNEL_RED
    ])
    pokemon.index = PkmIndex[pkm]
    pokemon.name = pkm
    pokemon.skill = Ability.SHIELDS_UP
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(pkm)
    }
  }
}

export class ShieldsUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({ skill: Ability.SHIELDS_UP })
    pokemon.index = PkmIndex[Pkm.MINIOR]
    pokemon.name = Pkm.MINIOR
    pokemon.skill = Ability.SHIELDS_DOWN
  }
}

export class AuraWheelStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.name === Pkm.MORPEKO) {
      pokemon.name = Pkm.MORPEKO_HANGRY
      pokemon.index = PkmIndex[Pkm.MORPEKO_HANGRY]
      if (pokemon.player) {
        pokemon.player.pokemonsPlayed.add(Pkm.MORPEKO_HANGRY)
      }
    } else {
      pokemon.name = Pkm.MORPEKO
      pokemon.index = PkmIndex[Pkm.MORPEKO]
    }
    pokemon.addSpeed(10, pokemon, 0, false)

    target.handleSpecialDamage(
      60,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    pokemon.resetCooldown(500)
  }
}

export class LickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerConfusion(3000, target, pokemon)
    target.status.triggerParalysis(3000, target, pokemon)
    const damage = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
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

export class FurySwipesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const scale = (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    const min = Math.round(2 * scale)
    const max = Math.round(5 * scale)
    const nbAttacks = clamp(
      Math.floor(
        Math.random() * (1 + pokemon.luck / 100) * (max - min + 1) + min
      ),
      min,
      max
    )
    for (let n = 0; n < nbAttacks; n++) {
      target.handleSpecialDamage(
        Math.ceil(pokemon.atk),
        board,
        AttackType.PHYSICAL,
        pokemon,
        false,
        false
      )
    }
  }
}

export class TickleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
          cell.value.addAttack(-attackLost, pokemon, 1, crit)
          cell.value.addDefense(-defLost, pokemon, 1, crit)
        }
      })
  }
}

export class AromatherapyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const adjacentAllies: PokemonEntity[] = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter<Cell & { value: PokemonEntity }>(
        (cell): cell is Cell & { value: PokemonEntity } =>
          cell.value != null && cell.value.team === pokemon.team
      )
      .map((cell) => cell.value)
    const nbEnemiesDetected = board
      .getCellsInRange(pokemon.positionX, pokemon.positionY, 2)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team).length

    const protectDuration = Math.round(
      500 *
        nbEnemiesDetected *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    adjacentAllies.forEach((ally) => {
      ally.status.triggerProtect(protectDuration)
    })
  }
}

export class SpacialRendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 100
    const rowToTarget = target.positionY
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team && !p.status.skydiving
    )
    const n = enemies.length
    for (let i = 0; i < Math.floor(n / 2); i++) {
      enemies[i]!.toMovingState()
      enemies[n - 1 - i]!.toMovingState()
      board.swapCells(
        enemies[i]!.positionX,
        enemies[i]!.positionY,
        enemies[n - 1 - i]!.positionX,
        enemies[n - 1 - i]!.positionY
      )
    }

    for (let x = 0; x < BOARD_WIDTH; x++) {
      const targetHit = board.getEntityOnCell(x, rowToTarget)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let synergyLevelsCount = 0
    const synergies = pokemon.player?.synergies
    if (synergies) {
      pokemon.types.forEach((type) => {
        synergyLevelsCount += synergies.get(type) ?? 0
      })
    }

    const damage = 15 * synergyLevelsCount
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
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
    pokemon.addAbilityPower(10, pokemon, 0, false)
  }
}

export class SunsteelStrikeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.skydiveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            positionX: mostSurroundedCoordinate.x,
            positionY: mostSurroundedCoordinate.y,
            targetX: mostSurroundedCoordinate.x,
            targetY: mostSurroundedCoordinate.y
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          const cells = board.getAdjacentCells(
            mostSurroundedCoordinate.x,
            mostSurroundedCoordinate.y
          )
          pokemon.broadcastAbility({
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null) {
        if (cell.value.team !== pokemon.team) {
          cell.value.status.triggerParalysis(3000, cell.value, pokemon)
          cell.value.handleSpecialDamage(
            100,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else {
          cell.value.addShield(100, pokemon, 1, crit)
        }
      }
    })
  }
}

export class BloodMoonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(2 * pokemon.atk)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerWound(3000, cell.value, pokemon)
      }
    })
  }
}

export class MantisBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.stars === 1 ? 10 : pokemon.stars === 2 ? 20 : 40

    for (const damageType of [
      AttackType.PHYSICAL,
      AttackType.SPECIAL,
      AttackType.TRUE
    ]) {
      target.handleSpecialDamage(damage, board, damageType, pokemon, crit, true)
    }
  }
}

export class SpiritBreakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let executeChance =
      ([0.1, 0.2, 0.3][pokemon.stars - 1] ?? 0.3) *
      (1 + min(0)((pokemon.hp - target.hp) / target.hp))
    if (target.types.has(Synergy.ICE)) executeChance = 0
    else if (target.status.freeze) executeChance = 1

    let damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    if (chance(executeChance, pokemon)) damage = 9999
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.stars === 3 ? 100 : pokemon.stars === 2 ? 50 : 25
    const duration =
      pokemon.stars === 3 ? 4000 : pokemon.stars === 2 ? 2000 : 1000
    target.status.triggerArmorReduction(duration, target)
    target.status.triggerParalysis(duration, target, pokemon)
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

export class IceHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerFreeze(3000, target)
    pokemon.status.triggerParalysis(3000, pokemon, pokemon)
    const damage = [50, 100][pokemon.stars - 1] ?? 100
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

export class FacadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 40
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      pokemon.broadcastAbility({
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
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class PsychoBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 150
    for (const positionX of [
      target.positionX - 1,
      target.positionX,
      target.positionX + 1
    ]) {
      const tg = board.getEntityOnCell(positionX, target.positionY)
      if (tg && tg.team !== pokemon.team) {
        pokemon.broadcastAbility({
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
  }
}

export class PollenPuffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp - b.hp)[0]

    if (lowestHealthAlly) {
      const heal = [30, 60, 120][pokemon.stars - 1] ?? 120
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      pokemon.broadcastAbility({
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class PsystrikeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const furthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    const targetsHit: Set<PokemonEntity> = new Set()
    pokemon.broadcastAbility({
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
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) {
      targetsHit.add(furthestTarget) // guarantee at least the furthest target is hit
    }
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(80, board, AttackType.SPECIAL, pokemon, crit)

      const teleportationCell = board.getTeleportationCell(
        enemy.positionX,
        enemy.positionY,
        enemy.team
      )
      if (teleportationCell) {
        enemy.moveTo(teleportationCell.x, teleportationCell.y, board)
      }
    })
  }
}

export class DreamEaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const sleepingTarget = board.find(
      (x, y, entity) => entity.status.sleep && entity.team !== pokemon.team
    )

    if (sleepingTarget) {
      pokemon.broadcastAbility({
        targetX: sleepingTarget.positionX,
        targetY: sleepingTarget.positionY
      })
      const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
        sleepingTarget,
        board,
        1
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board)
      }
      const damage = [45, 90, 150][pokemon.stars - 1] ?? 150
      const { takenDamage } = sleepingTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
      pokemon.handleHeal(takenDamage, pokemon, 0, false)
    } else {
      const duration = Math.round(
        ([3000, 4000, 5000][pokemon.stars - 1] ?? 5000) * (1 + pokemon.ap / 100)
      )
      target.status.triggerSleep(duration, target)
      pokemon.broadcastAbility({
        targetX: target.positionX,
        targetY: target.positionY
      })
      pokemon.pp = pokemon.maxPP
    }
  }
}

export class SparkStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = pokemon.stars === 1 ? 40 : 80

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    let previousTarget = target
    let currentTarget = target
    let n = 0
    while (n <= 4) {
      const newTarget = board
        .getAdjacentCells(currentTarget.positionX, currentTarget.positionY)
        .find(
          (cell) =>
            cell.value &&
            cell.value.team === target.team &&
            cell.value !== previousTarget
        )?.value

      if (newTarget) {
        pokemon.broadcastAbility({
          targetX: newTarget.positionX,
          targetY: newTarget.positionY,
          positionX: currentTarget.positionX,
          positionY: currentTarget.positionY,
          delay: n
        })
        damage = Math.ceil(damage / 2)
        newTarget.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        previousTarget = currentTarget
        currentTarget = newTarget
        n++
      } else {
        break
      }
    }
  }
}

export class CrunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
      pokemon.handleHeal(Math.ceil(0.5 * target.maxHP), pokemon, 0, false)
    }
  }
}

export class CrossPoisonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const freezeDuration = [1000, 1500, 2000][pokemon.stars - 1] ?? 2000
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerFreeze(freezeDuration, target)
  }
}

export class ThunderFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    target.status.triggerParalysis(3000, target, pokemon)
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

export class TailWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defLoss = -0.3 * target.def
    target.addDefense(defLoss, pokemon, 1, crit)
  }
}

export class PsyshieldBashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 40, 50, 60][pokemon.stars - 1] ?? 60

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      pokemon.broadcastAbility({
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
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    pokemon.status.triggerProtect(1000)

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class TorchSongStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Blow out [4,SP] raging flames to random opponents. Each flame deals 50% of ATK as SPECIAL, with [30,LK]% chance to BURN for 2 seconds, and buff the user AP by [1,2,3].
    const damagePerFlame = 0.5 * pokemon.atk
    const apGainPerFlame = [1, 2, 3][pokemon.stars - 1] ?? 3

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbFlames = Math.round(
      4 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < nbFlames; i++) {
      const randomTarget = pickRandomIn(enemies)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            targetX: randomTarget.positionX,
            targetY: randomTarget.positionY
          })
          pokemon.addAbilityPower(apGainPerFlame, pokemon, 0, false)
          if (randomTarget?.hp > 0) {
            randomTarget.handleSpecialDamage(
              damagePerFlame,
              board,
              AttackType.SPECIAL,
              pokemon,
              false,
              false
            )
            if (chance(0.3, pokemon)) {
              randomTarget.status.triggerBurn(2000, randomTarget, pokemon)
            }
          }
        }, 100 * i)
      )
    }
  }
}

export class PowerWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60][pokemon.stars - 1] ?? 60

    const furthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    const targetsHit: Set<PokemonEntity> = new Set()
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      furthestTarget.positionX,
      furthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
        pokemon.broadcastAbility({
          skill: "POWER_WHIP/hit",
          positionX: cell.x,
          positionY: cell.y
        })
      }
    })

    if (targetsHit.size === 0) targetsHit.add(furthestTarget) // guarantee at least the furthest target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

class DarkHarvestEffect extends PeriodicEffect {
  duration: number
  constructor(duration: number, pokemon: PokemonEntity) {
    super(
      (pokemon) => {
        pokemon.broadcastAbility({ skill: Ability.DARK_HARVEST })
        const board = pokemon.simulation.board
        const crit = pokemon.effects.has(EffectEnum.ABILITY_CRIT)
          ? chance(pokemon.critChance / 100, pokemon)
          : false
        const darkHarvestDamage = [5, 10, 20][pokemon.stars - 1] ?? 20
        const healFactor = 0.3
        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const { takenDamage } = cell.value.handleSpecialDamage(
                darkHarvestDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                true
              )
              pokemon.handleHeal(
                Math.round(takenDamage * healFactor),
                pokemon,
                0,
                false
              )
            }
          })
        if (this.duration <= 0) {
          pokemon.effectsSet.delete(this)
          pokemon.effects.delete(EffectEnum.DARK_HARVEST)
        } else {
          this.duration -= this.intervalMs
        }
      },
      EffectEnum.DARK_HARVEST,
      1000
    )

    this.timer = 0 // delay the first tick
    this.duration = duration + this.intervalMs

    if (pokemon.effects.has(EffectEnum.DARK_HARVEST)) {
      // merge with existing effect if not finished before the next cast
      pokemon.effectsSet.delete(this)
      for (const effect of pokemon.effectsSet) {
        if (effect instanceof DarkHarvestEffect) {
          effect.duration = Math.max(this.duration, effect.duration)
          effect.timer = this.timer
          break
        }
      }
    } else {
      pokemon.effects.add(EffectEnum.DARK_HARVEST)
    }
  }
}

export class DarkHarvestStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      pokemon.effectsSet.add(new DarkHarvestEffect(3200, pokemon))
      pokemon.status.triggerSilence(3200, pokemon, pokemon)
    }
  }
}

export class StoneEdgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = pokemon.stars === 1 ? 5000 : 8000
    if (pokemon.effects.has(EffectEnum.STONE_EDGE)) return // ignore if already active

    pokemon.status.triggerSilence(duration, pokemon, pokemon)
    pokemon.effects.add(EffectEnum.STONE_EDGE)
    pokemon.addCritChance(20, pokemon, 1, false)
    pokemon.range += 2
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addCritChance(-20, pokemon, 1, false)
        pokemon.range = min(pokemon.baseRange)(pokemon.range - 2)
        pokemon.effects.delete(EffectEnum.STONE_EDGE)
      }, duration)
    )
  }
}

export class PsyShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppBurn =
      ([20, 40, 80][pokemon.stars - 1] ?? 80) * (1 + pokemon.ap / 100)
    const ppStolen = max(target.pp)(ppBurn)
    const extraPP = ppBurn - ppStolen

    target.addPP(-ppStolen, pokemon, 0, false)
    pokemon.addShield(ppBurn, pokemon, 0, false)
    if (extraPP > 0) {
      target.handleSpecialDamage(
        extraPP,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        false
      )
    }
  }
}

export class HeavySlamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    const shield = [15, 30, 60][pokemon.stars - 1] ?? 60
    if (pokemon.maxHP > target.maxHP) {
      damage = Math.round(
        damage * (1 + (0.5 * (pokemon.maxHP - target.maxHP)) / target.maxHP)
      )
    }
    pokemon.addShield(shield, pokemon, 0, false)
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

export class BulldozeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 45, 85][pokemon.stars - 1] ?? 85
    const speedReduction = 10
    const adjacentsCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )

    for (const cell of adjacentsCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY,
          pokemon,
          undefined
        )
        const destination = board.getKnockBackPlace(
          cell.value.positionX,
          cell.value.positionY,
          orientation
        )

        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board)
          cell.value.cooldown = 500
        }

        cell.value.addSpeed(-speedReduction, pokemon, 0, false)

        cell.value.handleSpecialDamage(
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

export class RapidSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 50][pokemon.stars - 1] ?? 50
    const buffAmount = Math.round(0.5 * pokemon.atk)

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    pokemon.addDefense(buffAmount, pokemon, 1, crit)
    pokemon.addSpecialDefense(buffAmount, pokemon, 1, crit)
  }
}

export class BounceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbBounces = [1, 2, 3][pokemon.stars - 1] ?? 3
    for (let i = 0; i < nbBounces; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const destination =
            board.getFarthestTargetCoordinateAvailablePlace(pokemon)
          if (destination && pokemon.maxHP > 0) {
            pokemon.broadcastAbility({})
            pokemon.moveTo(destination.x, destination.y, board)
            const adjacentCells = board.getAdjacentCells(
              destination.x,
              destination.y
            )
            adjacentCells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                const damage = [10, 20, 30][pokemon.stars - 1] ?? 30
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
        }, i * 500)
      )
    }
  }
}

export class GunkShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100][pokemon.stars - 1] ?? 100
    const baseDuration = [2000, 4000][pokemon.stars - 1] ?? 4000
    const duration = Math.round(
      baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}

export class AncientPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(25, pokemon, 0, false)
  }
}

export class MuddyWaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage = [40, 80][pokemon.stars - 1] ?? 80
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
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
      pokemon.broadcastAbility({
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    const damage = 50
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STEALTH_ROCKS,
        pokemon.simulation
      )

      pokemon.broadcastAbility({
        skill: Ability.STEALTH_ROCKS,
        positionX: cell.x,
        positionY: cell.y
      })
    })
  }
}

export class FlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const duration =
      ([2000, 4000, 6000][pokemon.stars - 1] ?? 6000) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 3)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerBlinded(duration, cell.value)
        }
      })
  }
}

export class RockHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defLoss = [5, 10][pokemon.stars - 1] ?? 10
    target.addDefense(-defLoss, pokemon, 0, false)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const result = target.handleSpecialDamage(
      pokemon.atk * 2,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    pokemon.handleHeal(result.takenDamage * 2, pokemon, 0, false)
  }
}

export class FairyLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerLocked(5000, target)

    const cells = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell && cell.value && cell.value.team !== pokemon.team)

    cells.forEach((cell) => {
      pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      cell.value?.handleSpecialDamage(
        Math.round(90 / cells.length),
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class GravityStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const lockDuration = Math.round(
      2000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    board.forEach((x, y, unitOnCell) => {
      if (unitOnCell && unitOnCell.team !== pokemon.team) {
        unitOnCell.status.triggerLocked(lockDuration, unitOnCell)
      }
    })
  }
}

export class InfestationStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const numberOfBugAllies = board.cells.filter(
      (entity) =>
        entity && entity.team === pokemon.team && entity.types.has(Synergy.BUG)
    ).length
    const damage = numberOfBugAllies * 10
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    if (pokemon.player && pokemon.count.ult === 1) {
      const bugsOnBench = values(pokemon.player?.board).filter(
        (p) => p && p.types.has(Synergy.BUG) && isOnBench(p)
      )
      const mostPowerfulBug = getStrongestUnit(bugsOnBench)
      if (mostPowerfulBug) {
        pokemon.broadcastAbility({
          positionX: mostPowerfulBug.positionX,
          positionY: pokemon.team === Team.RED_TEAM ? 8 : 0,
          targetX: pokemon.positionX,
          targetY: pokemon.positionY
        })
        pokemon.commands.push(
          new DelayedCommand(
            () => {
              const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
                pokemon,
                board
              )
              if (coord) {
                pokemon.simulation.addPokemon(
                  mostPowerfulBug,
                  coord.x,
                  coord.y,
                  pokemon.team,
                  true
                )
              }
            },
            distanceM(
              pokemon.positionX,
              pokemon.positionY,
              mostPowerfulBug.positionX,
              mostPowerfulBug.positionY
            ) *
              150 -
              30
          )
        )
      }
    }
  }
}

export class GulpMissileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    let missilePkm = Pkm.ARROKUDA
    let missilePkmString = "arrokuda"

    const damage = 55

    if (chance(0.2, pokemon)) {
      missilePkm = Pkm.PIKACHU
      missilePkmString = "pikachu"
    }

    pokemon.broadcastAbility({
      skill: `GULP_MISSILE/${missilePkmString}`
    })

    const missile = PokemonFactory.createPokemonFromName(
      missilePkm,
      pokemon.player
    )
    if (pokemon.player) pokemon.player.pokemonsPlayed.add(missilePkm)

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
            target,
            board
          )
          if (coord) {
            const entity = pokemon.simulation.addPokemon(
              missile,
              coord.x,
              coord.y,
              pokemon.team,
              true
            )

            entity.pp = entity.maxPP

            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
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
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.status.triggerParalysis(3000, pokemon, pokemon)
    const damage = pokemon.stars === 3 ? 200 : pokemon.stars === 2 ? 100 : 50
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class PurifyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [15, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.status.clearNegativeStatus()
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}

export class PastelVeilStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const shield = [20, 40, 80][pokemon.stars - 1] ?? 80
    const farthestCoordinate = board.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      true
    )
    const alliesHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          alliesHit.add(cell.value)
        }
      })

      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (alliesHit.size === 0) alliesHit.add(pokemon) // guarantee at least the user is hit
    alliesHit.forEach((ally) => {
      ally.status.clearNegativeStatus()
      ally.addShield(shield, pokemon, 1, crit)
    })
  }
}

export class CharmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const attackReduce = [2, 3, 4][pokemon.stars - 1] ?? 4
    target.addAttack(-attackReduce, pokemon, 1, crit)
    target.status.triggerCharm(3000, target, pokemon, false)
  }
}

export class EntrainmentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const ppGained = 10
    pokemon.addPP(ppGained, pokemon, 1, crit)
    if (target.skill !== Ability.ENTRAINMENT) {
      target.skill = Ability.ENTRAINMENT
    } else {
      const potentialTargets: { x: number; y: number; value: PokemonEntity }[] =
        []
      board.forEach(
        (x: number, y: number, value: PokemonEntity | undefined) => {
          if (value && value.team !== pokemon.team && value.hp > 0) {
            potentialTargets.push({ x, y, value })
          }
        }
      )
      potentialTargets.sort(
        (a, b) =>
          distanceC(pokemon.positionX, pokemon.positionY, a.x, a.y) -
          distanceC(pokemon.positionX, pokemon.positionY, b.x, b.y)
      )
      if (potentialTargets.length > 0) {
        potentialTargets[0].value.skill = Ability.ENTRAINMENT
      }
    }
  }
}

export class OctazookaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.ceil(pokemon.atk * 3)

    pokemon.count.attackCount++ // trigger attack animation
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    target.status.triggerBlinded(4000, target)
  }
}

export class PsychoShiftStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const farthestEnemy = pokemon.state.getFarthestTarget(pokemon, board)
    pokemon.broadcastAbility({
      positionX: target.positionX,
      positionY: target.positionY,
      targetX: farthestEnemy?.positionX,
      targetY: farthestEnemy?.positionY
    })

    if (farthestEnemy && farthestEnemy.id !== target.id) {
      const x = farthestEnemy.positionX
      const y = farthestEnemy.positionY
      farthestEnemy.moveTo(target.positionX, target.positionY, board)
      target.moveTo(x, y, board)
      farthestEnemy.handleSpecialDamage(
        60,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }

    target.handleSpecialDamage(60, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GlaiveRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    pokemon.status.triggerArmorReduction(6000, pokemon)
    const destinationRow =
      pokemon.team === Team.RED_TEAM
        ? pokemon.positionY <= 1
          ? BOARD_HEIGHT - 1
          : 0
        : pokemon.positionY >= BOARD_HEIGHT - 2
          ? 0
          : BOARD_HEIGHT - 1

    const destination = board.getClosestAvailablePlace(
      pokemon.positionX,
      destinationRow
    )
    const enemiesHit = new Set<PokemonEntity>()
    if (destination) {
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: destination.x,
        targetY: destination.y
      })

      pokemon.moveTo(destination.x, destination.y, board)
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        destination.x,
        destination.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          enemiesHit.add(cell.value)
        }
      })
    }

    if (enemiesHit.size === 0) enemiesHit.add(target) // ensure to at least hit the target
    enemiesHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class FoulPlayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      pokemon.stars === 3
        ? target.atk * 6
        : pokemon.stars === 2
          ? target.atk * 4
          : target.atk * 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class DoubleIronBashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(pokemon.atk * 1.5)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    target.status.triggerFlinch(3000, pokemon)
  }
}

export class RoarStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    let farthestEmptyCell: Cell | null = null
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && target.id !== cell.value.id) {
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        board.swapCells(
          target.positionX,
          target.positionY,
          cell.value.positionX,
          cell.value.positionY
        )
      }
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })

    if (farthestEmptyCell) {
      const { x, y } = farthestEmptyCell as Cell
      board.swapCells(target.positionX, target.positionY, x, y)
    }
  }
}

export class IvyCudgelStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 100
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (pokemon.passive === Passive.OGERPON_TEAL) {
      const nbAdjacentEnemies = board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .filter((cell) => cell.value && cell.value.team !== pokemon.team).length
      pokemon.addAttack(6 * nbAdjacentEnemies, pokemon, 1, crit)
    } else if (pokemon.passive === Passive.OGERPON_WELLSPRING) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .forEach((cell) => {
          if (cell.value && cell.value.team === pokemon.team) {
            cell.value.addPP(25, pokemon, 1, crit)
            cell.value.handleHeal(50, pokemon, 1, crit)
          }
        })
    } else if (pokemon.passive === Passive.OGERPON_HEARTHFLAME) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              20,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.status.triggerBurn(5000, pokemon, cell.value)
          }
        })
    } else if (pokemon.passive === Passive.OGERPON_CORNERSTONE) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.status.triggerFlinch(5000, pokemon, cell.value)
          }
        })
      const factor = 0.5
      const protectDuration = Math.round(
        2000 *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      pokemon.status.triggerProtect(protectDuration)
    }
  }
}

export class ForcePalmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const additionalDamage = target.status.paralysis ? 40 : 0
    const damage = Math.round(60 + target.maxHP * 0.1 + additionalDamage)
    if (target.status.paralysis) {
      let farthestEmptyCell: Cell | null = null
      effectInLine(board, pokemon, target, (cell) => {
        if (!cell.value) {
          farthestEmptyCell = cell
        }
      })
      if (farthestEmptyCell != null) {
        const { x, y } = farthestEmptyCell as Cell
        target.moveTo(x, y, board)
      }
    } else {
      target.status.triggerParalysis(6000, target, pokemon)
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SteelWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = ([10, 20, 40][pokemon.stars - 1] ?? 40) + 2 * pokemon.def
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // ensure to at least hit the target
    targetsHit.forEach((enemy) => {
      pokemon.addDefense(1, pokemon, 0, false)
      enemy.addDefense(-1, pokemon, 0, false)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

class BideEffect extends PeriodicEffect {
  duration: number
  damageReceived: number = 0
  constructor(
    pokemon: PokemonEntity,
    duration: number,
    board: Board,
    crit: boolean
  ) {
    super(
      (pokemon) => {
        if (this.duration <= 0) {
          this.procDamage(pokemon, board, crit)
          pokemon.effectsSet.delete(this)
          pokemon.effectsSet.delete(damageMonitor)
        } else {
          this.duration -= this.intervalMs
        }
      },
      Ability.BIDE,
      1000
    )
    this.duration = duration
    const damageMonitor = new OnDamageReceivedEffect(({ damage }) => {
      this.damageReceived += damage
    }, Ability.BIDE)
    pokemon.effectsSet.add(damageMonitor)
  }
  procDamage(pokemon: PokemonEntity, board: Board, crit: boolean) {
    pokemon.broadcastAbility({ skill: Ability.BIDE })
    const damage = 2 * this.damageReceived
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

export class BideStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.effectsSet.add(new BideEffect(pokemon, 3000, board, crit))
  }
}

export class YawnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const opponentsTargetingMe = board.cells.filter<PokemonEntity>(
      (entity): entity is PokemonEntity =>
        entity != null &&
        entity.team !== pokemon.team &&
        entity.targetEntityId === pokemon.id
    )

    opponentsTargetingMe.forEach((opponent) => {
      opponent.status.triggerFatigue(3000, pokemon)
      opponent.addAbilityPower(-20, pokemon, 0, false)
    })

    const shield = [15, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.resetCooldown(1000)
  }
}

export class WiseYawnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Find ally with lowest current health
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp - b.hp)[0]

    if (lowestHealthAlly) {
      // Find enemies targeting the lowest health ally
      const opponentsTargetingLowestHealthAlly =
        board.cells.filter<PokemonEntity>(
          (entity): entity is PokemonEntity =>
            entity != null &&
            entity.team !== lowestHealthAlly.team &&
            entity.targetEntityId === lowestHealthAlly.id
        )

      // Apply fatigue and AP reduction to attackers
      opponentsTargetingLowestHealthAlly.forEach((opponent) => {
        opponent.status.triggerFatigue(3000, pokemon)
        opponent.addAbilityPower(-20, pokemon, 0, false)
      })

      // Shield the lowest health ally
      const shield = [15, 30, 60][pokemon.stars - 1] ?? 60
      lowestHealthAlly.addShield(shield, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class ShoreUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let healFactor = [0.2, 0.25][pokemon.stars - 1] ?? 0.25
    if (pokemon.simulation.weather === Weather.SANDSTORM) {
      healFactor += 0.1
    }
    pokemon.handleHeal(healFactor * pokemon.maxHP, pokemon, 1, crit)
  }
}

export class PoisonStingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let maxStacks = 3
    if (pokemon.effects.has(EffectEnum.VENOMOUS)) {
      maxStacks = 4
    }
    if (pokemon.effects.has(EffectEnum.TOXIC)) {
      maxStacks = 5
    }

    const nbStacksToApply = [2, 3, 4][pokemon.stars - 1] ?? 4
    const currentStacks = target.status.poisonStacks
    const extraDamage =
      currentStacks + nbStacksToApply > maxStacks
        ? (currentStacks + nbStacksToApply - maxStacks) *
          ([25, 50, 100][pokemon.stars - 1] ?? 100)
        : 0
    for (let i = 0; i < nbStacksToApply; i++) {
      target.status.triggerPoison(4000, target, pokemon)
    }
    if (extraDamage > 0) {
      target.handleSpecialDamage(
        extraDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class WoodHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 4 * pokemon.atk
    const recoil = pokemon.atk

    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )

        if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
          pokemon.handleSpecialDamage(
            recoil,
            board,
            AttackType.PHYSICAL,
            pokemon,
            false,
            false
          )
        }
      }, 500)
    )
  }
}

export class TrickOrTreatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    if (target.items.size > 0) {
      const item = values(target.items)[0]!
      target.removeItem(item)
      pokemon.addItem(item)
    } else {
      // transforms the unit into magikarp for X seconds, replacing its ability with splash
      const originalAbility = target.skill
      const originalAttack = target.atk
      const originalDefense = target.def
      const originalSpecialDefense = target.speDef
      const originalIndex = target.index
      const duration = Math.round(
        3000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
      )
      target.index = PkmIndex[Pkm.MAGIKARP]
      target.skill = Ability.SPLASH
      target.atk = 1
      target.def = 1
      target.speDef = 1
      target.commands.push(
        new DelayedCommand(() => {
          target.skill = originalAbility
          target.atk = originalAttack
          target.def = originalDefense
          target.speDef = originalSpecialDefense
          target.index = originalIndex
        }, duration)
      )
    }
  }
}

export class FreezingGlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          80,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(0.5, pokemon)) {
          cell.value.status.triggerFreeze(3000, pokemon)
        }
      }
    })
  }
}

export class ThunderousKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 60][pokemon.stars - 1] ?? 60
    const defenseDebuff = 10

    target.status.triggerFlinch(4000, pokemon)
    target.addDefense(-defenseDebuff, pokemon, 1, crit)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    let farthestEmptyCell: Cell | null = null
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && target.id !== cell.value.id) {
        if (cell.value.team !== pokemon.team) {
          cell.value.status.triggerFlinch(4000, pokemon)
          cell.value.addDefense(-defenseDebuff, pokemon, 1, crit)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.PHYSICAL,
            pokemon,
            crit
          )
        }
        board.swapCells(
          target.positionX,
          target.positionY,
          cell.value.positionX,
          cell.value.positionY
        )
      }
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })

    if (farthestEmptyCell) {
      const { x, y } = farthestEmptyCell as Cell
      board.swapCells(target.positionX, target.positionY, x, y)
    }
  }
}

export class FieryWrathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 30

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        if (chance(0.5, pokemon)) {
          value.status.triggerFlinch(4000, value)
        }
        pokemon.broadcastAbility({
          positionX: x,
          positionY: y,
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

export class ViseGripStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    target.status.triggerLocked(4000, target)
    pokemon.status.triggerLocked(4000, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const defGain = target.def * 1
    const spedefGain = target.speDef * 1
    pokemon.addDefense(defGain, pokemon, 1, crit)
    pokemon.addSpecialDefense(spedefGain, pokemon, 1, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addDefense(-defGain, pokemon, 1, crit)
        pokemon.addSpecialDefense(-spedefGain, pokemon, 1, crit)
      }, 4000)
    )
  }
}

export class LandsWrathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkDamage = Math.round(pokemon.atk * (1 + pokemon.ap / 100))
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          40 + atkDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          false
        )
        cell.value.addDefense(-5, pokemon, 1, crit)
        cell.value.addSpecialDefense(-5, pokemon, 1, crit)
        pokemon.broadcastAbility({
          skill: "LANDS_WRATH/hit",
          positionX: cell.x,
          positionY: cell.y
        })
      }
    })
  }
}

export class ThousandArrowsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 60
    const numberOfProjectiles = 33

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getEntityOnCell(x, y)
          if (value && value.team !== pokemon.team) {
            value.status.triggerLocked(1000, value)
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
          pokemon.broadcastAbility({
            skill: Ability.THOUSAND_ARROWS,
            positionX: x,
            positionY: BOARD_HEIGHT - 1,
            targetX: x,
            targetY: y
          })
        }, i * 100)
      )
    }
  }
}

export class CoreEnforcerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const cellsHit = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter(
        (cell) => cell.y !== target.positionY || cell.x === target.positionX
      ) // Z shape

    cellsHit.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(3000, cell.value)
        cell.value.handleSpecialDamage(
          80,
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

export class BurnUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 100, 200][pokemon.stars - 1] ?? 200
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.status.triggerBurn(3000, pokemon, pokemon)
  }
}

export class PowerHugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80][pokemon.stars - 1] ?? 80
    target.status.triggerLocked(3000, target)
    target.status.triggerParalysis(3000, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MortalSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 30, 40][pokemon.stars - 1] ?? 40

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )

    // Find all enemies targeting this unit
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        const abilityTarget = cell.value

        const enemyTarget = board.getEntityOnCell(
          abilityTarget.targetX,
          abilityTarget.targetY
        )

        if (enemyTarget === pokemon) {
          abilityTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          abilityTarget.status.triggerPoison(4000, abilityTarget, pokemon)

          // Push targets back 1 tile
          let newY = -1
          if (
            pokemon.team === Team.BLUE_TEAM &&
            abilityTarget.positionY + 1 < BOARD_HEIGHT
          ) {
            newY = abilityTarget.positionY + 1
          } else if (abilityTarget.positionY - 1 > 0) {
            newY = abilityTarget.positionY - 1
          }

          if (
            newY !== -1 &&
            board.getEntityOnCell(
              abilityTarget.positionX,
              abilityTarget.positionY + 1
            ) === undefined
          ) {
            abilityTarget.moveTo(abilityTarget.positionX, newY, board)
            abilityTarget.cooldown = 500
          }
        }
      }
    })
  }
}

export class MetalClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    const atkBuff = [2, 4, 6][pokemon.stars - 1] ?? 6
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    pokemon.addAttack(atkBuff, pokemon, 1, crit)
  }
}

export class FirestarterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    const speedBuff = [10, 20, 40][pokemon.stars - 1] ?? 40

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell, i) => {
        if (
          cell.x === farthestCoordinate.x &&
          cell.y === farthestCoordinate.y
        ) {
          pokemon.commands.push(
            new DelayedCommand(() => {
              pokemon.addSpeed(speedBuff, pokemon, 1, crit)
            }, 500)
          )
        } else {
          pokemon.commands.push(
            new DelayedCommand(() => {
              board.addBoardEffect(
                cell.x,
                cell.y,
                EffectEnum.EMBER,
                pokemon.simulation
              )
              pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })

              if (cell.value && cell.value.team != pokemon.team) {
                targetsHit.add(cell.value)
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }, i * 50)
          )
          pokemon.commands.push(
            new DelayedCommand(
              () => {
                board.addBoardEffect(
                  cell.x,
                  cell.y,
                  EffectEnum.EMBER,
                  pokemon.simulation
                )
              },
              400 + i * 50
            )
          )
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) {
      // ensure to at least hit the target
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

export class BoneArmorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board)
      }
      const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
      const defBuff = [4, 8, 12][pokemon.stars - 1] ?? 12
      const attack = target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      if (attack.takenDamage > 0) {
        pokemon.handleHeal(attack.takenDamage, pokemon, 0, false)
      }
      if (attack.death) {
        pokemon.addDefense(defBuff, pokemon, 0, false)
        pokemon.addSpecialDefense(defBuff, pokemon, 0, false)
      }
    }
  }
}

export class TopsyTurvyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 80, 100][pokemon.stars - 1] ?? 100
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (target.atk !== target.baseAtk) {
          const d = target.atk - target.baseAtk
          target.addAttack(-2 * d, pokemon, 0, false)
        }
        if (target.ap !== 0) {
          target.addAbilityPower(-2 * target.ap, pokemon, 0, false)
        }
        if (target.def !== target.baseDef) {
          const d = target.def - target.baseDef
          target.addDefense(-2 * d, pokemon, 0, false)
        }
        if (target.speDef !== target.baseSpeDef) {
          const d = target.speDef - target.baseSpeDef
          target.addSpecialDefense(-2 * d, pokemon, 0, false)
        }
      }, 500)
    )
  }
}

export class RageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const rageDuration = 3000
    pokemon.status.triggerRage(rageDuration, pokemon)

    //gain 1 attack for each 10% of max HP missing
    const missingHp = pokemon.maxHP - pokemon.hp
    const atkBoost =
      pokemon.baseAtk * 0.1 * Math.floor(missingHp / (pokemon.maxHP / 10))
    pokemon.addAttack(atkBoost, pokemon, 1, crit)
  }
}

export class BrickBreakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 1.5 * pokemon.atk
    if (target.status.protect) {
      target.status.protect = false
      target.status.protectCooldown = 0
    }
    if (target.status.reflect) {
      target.status.reflect = false
      target.status.reflectCooldown = 0
    }
    if (target.status.magicBounce) {
      target.status.magicBounce = false
      target.status.magicBounceCooldown = 0
    }
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    target.status.triggerArmorReduction(4000, target)
  }
}

export class TauntStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Gain 25% (AP scaling=0.5) of max HP as shield, and force adjacent enemies to choose you as target
    const shield = 0.25 * pokemon.maxHP
    pokemon.addShield(shield, pokemon, 0.5, crit)
    const enemiesTaunted = board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
    enemiesTaunted.forEach((enemy) => {
      enemy.setTarget(pokemon)
      pokemon.broadcastAbility({
        skill: "TAUNT_HIT",
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
    })
  }
}

export class BulkUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Increase base Attack and base Defense by 40%
    const atkBoost = Math.ceil(0.5 * pokemon.baseAtk)
    const defBoost = Math.ceil(0.5 * pokemon.baseDef)
    pokemon.addAttack(atkBoost, pokemon, 1, crit)
    pokemon.addDefense(defBoost, pokemon, 1, crit)
  }
}

export class CutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Deal [40,SP]% of target max HP as special damage. Inflicts WOUND for 5 seconds
    const damage = 0.4 * target.maxHP
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerWound(5000, target, pokemon)
  }
}

export class FlyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.status.triggerProtect(2000)
      pokemon.broadcastAbility({
        skill: "FLYING_TAKEOFF",
        targetX: destination.target.positionX,
        targetY: destination.target.positionY
      })
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: "FLYING_SKYDIVE",
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target && destination.target.hp > 0) {
            const damage = 4 * pokemon.atk
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

export class SurfStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean,
    preventDefaultAnim?: boolean,
    tierLevel = pokemon.stars
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80][tierLevel - 1] ?? 80
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      pokemon.broadcastAbility({
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
          targetsHit.add(cell.value)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // Push targets back 1 tile horizontally
          const surfAngle = calcAngleDegrees(
            farthestCoordinate.x - pokemon.positionX,
            farthestCoordinate.y - pokemon.positionY
          )
          const targetAngle = calcAngleDegrees(
            cell.value.positionX - pokemon.positionX,
            cell.value.positionY - pokemon.positionY
          )

          const dx =
            (surfAngle > 180 ? -1 : 1) * (targetAngle < surfAngle ? +1 : -1)

          const newX = cell.x + dx
          if (
            board.isOnBoard(newX, cell.y) &&
            board.getEntityOnCell(newX, cell.y) === undefined
          ) {
            cell.value.moveTo(newX, cell.y, board)
            cell.value.cooldown = 500
          }
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) {
      // ensure to at least hit the target
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

export class StrengthStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 2 * (pokemon.atk + pokemon.def + pokemon.speDef) + pokemon.ap
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

export class HardenStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defGain = [4, 8, 12][pokemon.stars - 1] ?? 12
    pokemon.addDefense(defGain, pokemon, 1, crit)
  }
}

export class ColumnCrushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const pillar = board.cells.find(
      (entity) =>
        entity &&
        entity.team === pokemon.team &&
        [Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE].includes(
          entity.name
        )
    )
    if (pillar) {
      // If a pillar is already on the board, jumps to it and throw the pillar at the closest target, dealing [50,100,150,SP] + the remaining HP of the pillar as SPECIAL
      const pillarX = pillar.positionX
      const pillarY = pillar.positionY
      const remainingHp = pillar.hp
      const pillarType = pillar.name
      const team =
        pillar.team === Team.BLUE_TEAM
          ? pillar.simulation.blueTeam
          : pillar.simulation.redTeam
      pillar.shield = 0
      pillar.handleSpecialDamage(9999, board, AttackType.TRUE, null, false)
      pokemon.moveTo(pillarX, pillarY, board)
      pokemon.resetCooldown(800)

      pokemon.commands.push(
        new DelayedCommand(() => {
          const damage =
            ([50, 100, 150][pokemon.stars - 1] ?? 150) + remainingHp

          let enemyHit
          const targetCoordinate = pokemon.state.getNearestTargetAtSight(
            pokemon,
            board
          )
          if (targetCoordinate) {
            enemyHit = targetCoordinate.target
          }
          if (!enemyHit) {
            enemyHit = board.cells.find(
              (entity) => entity && entity.team !== pokemon.team
            )
          }
          if (enemyHit) {
            pokemon.setTarget(enemyHit)
            const landingX = enemyHit.positionX
            const landingY = enemyHit.positionY
            const travelTime =
              distanceE(
                pillarX,
                pillarY,
                enemyHit.positionX,
                enemyHit.positionY
              ) * 160

            pokemon.broadcastAbility({
              positionX: pillar.positionX,
              positionY: pillar.positionY,
              targetX: enemyHit.positionX,
              targetY: enemyHit.positionY,
              orientation: [
                Pkm.PILLAR_WOOD,
                Pkm.PILLAR_IRON,
                Pkm.PILLAR_CONCRETE
              ].indexOf(pillarType)
            })

            pokemon.commands.push(
              new DelayedCommand(() => {
                pokemon.broadcastAbility({
                  skill: Ability.ROCK_SMASH,
                  positionX: landingX,
                  positionY: landingY,
                  targetX: landingX,
                  targetY: landingY
                })

                if (enemyHit && enemyHit.hp > 0) {
                  enemyHit.handleSpecialDamage(
                    damage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              }, travelTime)
            )
          }
        }, 500)
      )
    } else {
      //Builds a pillar of 100/200/300 HP and 1/3/5 DEF and SPE_DEF on the closest empty spot.
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(pokemon)
      if (!coord) return
      const pillarType =
        [Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE][
          pokemon.stars - 1
        ] ?? Pkm.PILLAR_CONCRETE
      const pillar = PokemonFactory.createPokemonFromName(
        pillarType,
        pokemon.player
      )

      pokemon.simulation.addPokemon(
        pillar,
        coord.x,
        coord.y,
        pokemon.team,
        true
      )
    }
  }
}

export class WonderRoomStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        const enemy = cell.value
        if (enemy && enemy.team !== pokemon.team) {
          enemy.effects.add(EffectEnum.WONDER_ROOM)
          enemy.commands.push(
            new DelayedCommand(() => {
              enemy.effects.delete(EffectEnum.WONDER_ROOM)
            }, 5000)
          )
        }
      })
  }
}

export class DarkLariatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    //The user swings both arms and hits the target several times while moving behind them. Each hit deals [100,SP]% ATK as SPECIAL. Number of hits increase with SPEED. Target is FLINCH during the attack.
    const hits = Math.round((0.4 + 0.007 * pokemon.speed) * 3)
    target.status.triggerFlinch(1000, target, pokemon)
    for (let i = 0; i < hits; i++) {
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            if (target.hp > 0) {
              const damage = 1 * pokemon.atk
              target.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              if (pokemon.effects.has(EffectEnum.VICTORY_STAR)) {
                pokemon.addAttack(1, pokemon, 0, false)
              } else if (pokemon.effects.has(EffectEnum.DROUGHT)) {
                pokemon.addAttack(2, pokemon, 0, false)
              } else if (pokemon.effects.has(EffectEnum.DESOLATE_LAND)) {
                pokemon.addAttack(3, pokemon, 0, false)
              }
            }
          },
          Math.round((i * 1000) / hits)
        )
      )
    }
    const dx = target.positionX - pokemon.positionX
    const dy = target.positionY - pokemon.positionY
    const freeCellBehind = board.getClosestAvailablePlace(
      target.positionX + dx,
      target.positionY + dy
    )
    pokemon.broadcastAbility({
      targetX: freeCellBehind?.x ?? pokemon.positionX,
      targetY: freeCellBehind?.y ?? pokemon.positionY
    })

    if (freeCellBehind) {
      pokemon.moveTo(freeCellBehind.x, freeCellBehind.y, board)
      pokemon.resetCooldown(500)
    }
  }
}

export class BoltBeakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          target.handleSpecialDamage(
            target.pp > 40 ? 160 : 80,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, 250)
    )
  }
}

export class FreezeDryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          const damage = 70 * (1 + pokemon.ap / 100) + pokemon.speDef
          const killDamage = 30 * (1 + pokemon.ap / 100) + pokemon.speDef * 0.5
          const x = target.positionX
          const y = target.positionY
          const attackResult = target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            false // ap boost already computed
          )
          if (attackResult.death) {
            const cells = board.getAdjacentCells(x, y, false)
            cells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                pokemon.broadcastAbility({
                  positionX: x,
                  positionY: y,
                  targetX: cell.x,
                  targetY: cell.y
                })
                cell.value.handleSpecialDamage(
                  killDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit,
                  false // ap boost already computed
                )
              }
            })
          }
        }
      }, 250)
    )
  }
}

export class DragonPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 20

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          board
            .getAdjacentCells(target.positionX, target.positionY, false)
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .forEach((cell) => {
              if (cell.value) {
                pokemon.broadcastAbility({
                  positionX: target.positionX,
                  positionY: target.positionY,
                  targetX: cell.x,
                  targetY: cell.y
                })
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                pokemon.commands.push(
                  new DelayedCommand(() => {
                    if (pokemon && cell.value) {
                      board
                        .getAdjacentCells(
                          cell.value.positionX,
                          cell.value.positionY,
                          false
                        )
                        .filter((c) => c.value && c.value.team !== pokemon.team)
                        .forEach((c) => {
                          pokemon.broadcastAbility({
                            positionX: cell.x,
                            positionY: cell.y,
                            targetX: c.x,
                            targetY: c.y
                          })
                          c.value?.handleSpecialDamage(
                            damage,
                            board,
                            AttackType.SPECIAL,
                            pokemon,
                            crit
                          )
                        })
                    }
                  }, 400)
                )
              }
            })
        }
      }, 400)
    )
  }
}

export class FrostBreathStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [35, 70, 140][pokemon.stars - 1] ?? 140

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    const cellsHit = [[pokemon.positionX + dx, pokemon.positionY + dy]]
    for (const o of orientations) {
      cellsHit.push([
        pokemon.positionX + dx + OrientationVector[o][0],
        pokemon.positionY + dy + +OrientationVector[o][1]
      ])
    }

    cellsHit.forEach((cell) => {
      const value = board.getEntityOnCell(cell[0], cell[1])
      if (value && value.team !== pokemon.team) {
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(0.5, pokemon)) {
          value.status.triggerFreeze(2000, value)
        }
      }
    })
  }
}

export class DrillRunStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const nextX = target.positionX + dx
    const nextY = target.positionY + dy

    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    pokemon.moveTo(target.positionX, target.positionY, board)

    if (board.isOnBoard(nextX, nextY)) {
      const nextEntity = board.getEntityOnCell(nextX, nextY)
      if (nextEntity?.team === target.team) {
        pokemon.targetX = nextX
        pokemon.targetY = nextY
        pokemon.targetEntityId = nextEntity.id
        pokemon.pp = pokemon.maxPP
      }
    }
  }
}

export class DrillPeckStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const nextX = target.positionX + dx
    const nextY = target.positionY + dy

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.moveTo(target.positionX, target.positionY, board)

    if (board.isOnBoard(nextX, nextY)) {
      const nextEntity = board.getEntityOnCell(nextX, nextY)
      if (nextEntity?.team === target.team) {
        pokemon.targetX = nextX
        pokemon.targetY = nextY
        pokemon.targetEntityId = nextEntity.id
        pokemon.pp = pokemon.maxPP
      }
    }
  }
}

export class SaltCureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Adjacent allies gain [10,20,40,SP] SHIELD and their status afflictions cured. Adjacent WATER, STEEL or GHOST enemies suffer from BURN for 5 seconds.
    const shield = [10, 20, 40][pokemon.stars - 1] ?? 40
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    cells.forEach((cell) => {
      if (cell.value) {
        if (cell.value.team === pokemon.team) {
          cell.value.addShield(shield, pokemon, 1, crit)
          cell.value.status.clearNegativeStatus()
        } else {
          if (
            cell.value.types.has(Synergy.WATER) ||
            cell.value.types.has(Synergy.STEEL) ||
            cell.value.types.has(Synergy.GHOST)
          ) {
            cell.value.status.triggerBurn(5000, cell.value, pokemon)
          }
        }
      }
    })
  }
}

export class SpicyExtractStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Make 1/2/3 closest allies RAGE for [2,SP] seconds
    const nbAllies = [1, 2, 3][pokemon.stars - 1] ?? 3
    const rageDuration =
      2000 * (1 + pokemon.ap / 100) * (crit ? 1 + (pokemon.critPower - 1) : 1)
    const allies = board.cells
      .filter<PokemonEntity>(
        (cell): cell is PokemonEntity =>
          cell !== undefined &&
          cell !== pokemon &&
          cell.team === pokemon.team &&
          cell.hp > 0
      )
      .sort(
        (a, b) =>
          distanceE(
            a.positionX,
            a.positionY,
            pokemon.positionX,
            pokemon.positionY
          ) -
          distanceE(
            b.positionX,
            b.positionY,
            pokemon.positionX,
            pokemon.positionY
          )
      )
      .slice(0, nbAllies)
    allies.forEach((ally) => {
      ally.status.triggerRage(rageDuration, ally)
    })
  }
}

export class SweetScentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Enemies in a 3-range radius can no longer dodge attacks, lose [3,SP] SPE_DEF and have [30,LK]% chance to be CHARM for 1 second
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      3
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        if (chance(0.3, pokemon)) {
          cell.value.status.triggerCharm(1000, cell.value, pokemon, false)
        }
        cell.value.addSpecialDefense(-6, pokemon, 1, crit)
        cell.value.addSpeed(-12, pokemon, 1, crit)
        cell.value.addDodgeChance(-cell.value.dodge, pokemon, 0, false)
      }
    })
  }
}

export class SwallowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Store power and boosts its DEF and SPE_DEF by 1 up to 3 times.
    // If below 25% HP, swallow instead, restoring [20,SP]% of max HP per stack.
    // If over 3 stacks, spit up, dealing [40,80,150,SP] SPECIAL to the 3 cells in front
    if (pokemon.hp < pokemon.maxHP * 0.25 && pokemon.count.ult > 0) {
      const heal =
        (([0, 20, 40, 60][pokemon.count.ult] ?? 60) * pokemon.maxHP) / 100
      pokemon.handleHeal(heal, pokemon, 1, crit)
      pokemon.count.ult = 0
      pokemon.broadcastAbility({ skill: Ability.RECOVER })
    } else if (pokemon.count.ult >= 3) {
      const damage = [40, 80, 150][pokemon.stars - 1] ?? 150
      const cells = board.getCellsInFront(pokemon, target, 1)
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
      pokemon.broadcastAbility({ skill: Ability.SWALLOW })
      pokemon.count.ult = 0
    } else {
      pokemon.addDefense(3, pokemon, 0, false)
      pokemon.addSpecialDefense(3, pokemon, 0, false)
    }
  }
}

export class StockpileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (pokemon.count.ult % 4 === 0) {
      // If over 3 stacks, spit up, propelling the user to the backline and dealing 50% of max HP as SPECIAL to the target
      const damage = Math.ceil(0.5 * pokemon.maxHP)
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      // move to backline
      const corner = board.getTeleportationCell(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )
      if (corner) {
        pokemon.broadcastAbility({
          skill: Ability.STOCKPILE,
          targetX: corner.x,
          targetY: corner.y
        })
        pokemon.moveTo(corner.x, corner.y, board)
      }
      // retrieve base stats
      pokemon.maxHP = pokemon.baseHP
      pokemon.hp = Math.min(pokemon.hp, pokemon.maxHP)
      pokemon.addSpeed(30, pokemon, 0, false)
    } else {
      pokemon.addMaxHP(50, pokemon, 1, crit)
      pokemon.addSpeed(-10, pokemon, 0, false)
    }
  }
}

export class DecorateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const atkBoost = [1, 2, 3][pokemon.stars - 1] ?? 8
    const apBoost = [10, 20, 30][pokemon.stars - 1] ?? 50
    const nearestAllies = pokemon.state.getNearestAllies(pokemon, board)
    const strongestNearestAlly = getStrongestUnit(nearestAllies)
    if (strongestNearestAlly) {
      pokemon.broadcastAbility({
        targetX: strongestNearestAlly.positionX,
        targetY: strongestNearestAlly.positionY
      })
      strongestNearestAlly.addAttack(atkBoost, pokemon, 1, crit)
      strongestNearestAlly.addAbilityPower(apBoost, pokemon, 1, crit)

      if (pokemon.name === Pkm.ALCREMIE_VANILLA) {
        strongestNearestAlly.addShield(80, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_RUBY) {
        strongestNearestAlly.addSpeed(30, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_MATCHA) {
        strongestNearestAlly.addMaxHP(40, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_MINT) {
        strongestNearestAlly.handleHeal(40, pokemon, 1, crit)
        strongestNearestAlly.addSpecialDefense(15, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_LEMON) {
        strongestNearestAlly.addCritChance(40, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_SALTED) {
        strongestNearestAlly.handleHeal(40, pokemon, 1, crit)
        strongestNearestAlly.addDefense(15, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_RUBY_SWIRL) {
        strongestNearestAlly.addAttack(10, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_CARAMEL_SWIRL) {
        strongestNearestAlly.addCritPower(80, pokemon, 1, crit)
      } else if (pokemon.name === Pkm.ALCREMIE_RAINBOW_SWIRL) {
        strongestNearestAlly.addPP(60, pokemon, 1, crit)
      }
    }
  }
}

export class DragonClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    //Deal 30/60/120 special damage to the lowest health adjacent enemy and Wound them for 4 seconds.
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let lowestHp = 9999
    let lowestHpTarget: PokemonEntity | undefined
    for (const cell of cells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        if (cell.value.maxHP < lowestHp) {
          lowestHp = cell.value.maxHP
          lowestHpTarget = cell.value
        }
      }
    }
    if (!lowestHpTarget) {
      lowestHpTarget = target
    }
    lowestHpTarget.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    lowestHpTarget.status.triggerWound(4000, lowestHpTarget, pokemon)
    pokemon.setTarget(lowestHpTarget)
  }
}

export class HornAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = ([3, 4, 5][pokemon.stars - 1] ?? 5) * pokemon.atk
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerArmorReduction(8000, target)
  }
}

export class HornLeechStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 2 * pokemon.atk
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    // heal for 50% of the damage dealt
    const heal = Math.round(takenDamage * 0.5)
    const overheal = min(0)(heal - (pokemon.maxHP - pokemon.hp))
    pokemon.handleHeal(heal, pokemon, 0, false)
    if (overheal > 0) {
      pokemon.addShield(Math.round(overheal * 0.5), pokemon, 0, false)
    }
  }
}

export class MudShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // The user hurls mud at the target, dealing 25/50/75 damage and reducing their attack speed by 10/20/30%.
    const damage = [25, 50, 75][pokemon.stars - 1] ?? 75
    const speedDebuff = [10, 20, 30][pokemon.stars - 1] ?? 30
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addSpeed(-speedDebuff, pokemon, 1, crit)
  }
}

export class MalignantChainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = Math.round(
      3000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    target.status.triggerPossessed(duration, target, pokemon)
    const nbStacks = 3
    for (let i = 0; i < nbStacks; i++) {
      target.status.triggerPoison(duration, target, pokemon)
    }
  }
}

export class FilletAwayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // lose 50% of max HP and gain 10 attack and 20 speed
    const lostMaxHP = Math.floor(pokemon.maxHP * 0.3)
    pokemon.addMaxHP(-lostMaxHP, pokemon, 0, false)

    pokemon.addAttack(10, pokemon, 1, crit)
    pokemon.addSpeed(20, pokemon, 1, crit)
    pokemon.status.triggerProtect(1000)
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board)
    }
  }
}

export class RoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [20, 40, 80][pokemon.stars - 1] ?? 80
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board)
    }
    pokemon.status.triggerSleep(1000, pokemon)
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}

export class UltraThrustersStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80][pokemon.stars - 1] ?? 80
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerBurn(2000, cell.value, pokemon)
        }
      })

    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )

    pokemon.broadcastAbility({
      skill: Ability.ULTRA_THRUSTERS,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: corner?.x ?? pokemon.targetX,
      targetY: corner?.y ?? pokemon.targetY,
      orientation: pokemon.orientation
    })

    if (corner) {
      pokemon.orientation = board.orientation(
        corner.x,
        corner.y,
        pokemon.positionX,
        pokemon.positionY,
        pokemon,
        target
      )
      pokemon.moveTo(corner.x, corner.y, board)
      pokemon.resetCooldown(600)
    }
  }
}

export class ElectroBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    let projectileSpeedRemaining = pokemon.speed
    const delay = Math.round(200 * (50 / pokemon.speed))
    const targetsHit = new Set<PokemonEntity>()
    const bounce = (
      currentTarget: PokemonEntity,
      prevTarget: PokemonEntity
    ) => {
      const distance = distanceM(
        prevTarget.positionX,
        prevTarget.positionY,
        currentTarget.positionX,
        currentTarget.positionY
      )
      pokemon.broadcastAbility({
        positionX: prevTarget.positionX,
        positionY: prevTarget.positionY,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY,
        delay: delay * distance
      })

      const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
      currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      targetsHit.add(currentTarget)
      const possibleTargets = board.cells.filter<PokemonEntity>(
        (cell): cell is PokemonEntity =>
          cell !== undefined &&
          cell.team !== pokemon.team &&
          !targetsHit.has(cell)
      )
      if (possibleTargets.length === 0) return
      const distances = possibleTargets.map((cell) =>
        distanceM(
          cell.positionX,
          cell.positionY,
          currentTarget.positionX,
          currentTarget.positionY
        )
      )
      const minDistance = Math.min(...distances)
      const closestTarget = possibleTargets[distances.indexOf(minDistance)]

      if (closestTarget && projectileSpeedRemaining > 0) {
        const nextTarget = possibleTargets[0]
        projectileSpeedRemaining -= 30
        pokemon.commands.push(
          new DelayedCommand(
            () => bounce(nextTarget, currentTarget),
            delay * minDistance
          )
        )
      }
    }

    bounce(target, pokemon)
  }
}

export class ElectroShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (pokemon.simulation.weather !== Weather.STORM) {
      pokemon.cooldown = 2000
      pokemon.broadcastAbility({
        skill: "ELECTRO_SHOT_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage = [80, 100, 120][pokemon.stars - 1] ?? 120
          const apBoost = 40
          pokemon.addAbilityPower(apBoost, pokemon, 0, false)
          pokemon.broadcastAbility({
            skill: Ability.ELECTRO_SHOT,
            targetX: target.positionX,
            targetY: target.positionY
          })
          effectInLine(board, pokemon, target, (cell) => {
            if (cell.value != null && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
        },
        pokemon.simulation.weather === Weather.STORM ? 0 : 2000
      )
    )
  }
}

export class FlowerTrickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 40, 85][pokemon.stars - 1] ?? 85
    const startingCritCount = target.count.crit
    pokemon.commands.push(
      new DelayedCommand(() => {
        const currentCritCount = target.count.crit
        const numberOfCrits = currentCritCount - startingCritCount
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
        for (const cell of cells) {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.broadcastAbility({
              skill: "FLOWER_TRICK_EXPLOSION",
              positionX: cell.value.positionX,
              positionY: cell.value.positionY
            })
            cell.value.handleSpecialDamage(
              damage + 15 * numberOfCrits,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, 3000)
    )
  }
}

export class SolarBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (!pokemon.status.light) {
      pokemon.cooldown = 2000
      pokemon.broadcastAbility({
        skill: "SOLAR_BLADE_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
          pokemon.broadcastAbility({
            skill: Ability.SOLAR_BLADE,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            orientation: pokemon.orientation
          })
          const cells = board.getCellsInFront(pokemon, target, 1)
          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.TRUE,
                pokemon,
                crit
              )
            }
          })
        },
        pokemon.status.light ? 0 : 2000
      )
    )
  }
}

export class ScaleShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.status.triggerArmorReduction(2000, pokemon)
    const scalePositions = new Array<{ x: number; y: number; delay: number }>()

    const adjacentCells = [
      [pokemon.positionX, pokemon.positionY - 1],
      [pokemon.positionX, pokemon.positionY + 1],
      [pokemon.positionX - 1, pokemon.positionY],
      [pokemon.positionX + 1, pokemon.positionY],
      [pokemon.positionX - 1, pokemon.positionY - 1],
      [pokemon.positionX + 1, pokemon.positionY - 1],
      [pokemon.positionX - 1, pokemon.positionY + 1],
      [pokemon.positionX + 1, pokemon.positionY + 1]
    ]

    let inc = 0
    for (const cell of adjacentCells) {
      const [x, y] = cell
      const delay = 2000 + inc
      scalePositions.push({
        x,
        y,
        delay
      })
      inc += 100
      pokemon.broadcastAbility({
        skill: "SCALE_SHOT_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: x,
        targetY: y,
        delay: delay
      })
      const entityOnCell = board.getEntityOnCell(x, y)
      if (entityOnCell && entityOnCell.team !== pokemon.team) {
        entityOnCell.status.triggerArmorReduction(2000, entityOnCell)
        entityOnCell.handleSpecialDamage(
          40,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }

    for (const { x, y, delay } of scalePositions) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
          if (farthestTarget) {
            pokemon.broadcastAbility({
              positionX: x,
              positionY: y,
              targetX: farthestTarget.positionX,
              targetY: farthestTarget.positionY
            })
            const cellsBetween = board.getCellsBetween(
              x,
              y,
              farthestTarget.positionX,
              farthestTarget.positionY
            )
            for (const cell of cellsBetween) {
              if (cell.value && cell.value.team !== pokemon.team) {
                cell.value.handleSpecialDamage(
                  cell.value.id === farthestTarget.id ? 20 : 10,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }
          }
        }, delay)
      )
    }
  }
}

export class BitterBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 70
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let nbEnemiesHit = 0
    for (const cell of adjacentCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        nbEnemiesHit++
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
    pokemon.handleHeal(pokemon.maxHP * 0.1 * nbEnemiesHit, pokemon, 0, false)
  }
}

export class ArmorCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const mainDamage = 50
    const secondaryDamage = 30
    const finalDamage = 15
    const numberOfTargets = 2

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          mainDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const possibleTargets = new Array<PokemonEntity>()
        board.forEach((x, y, entity) => {
          if (entity && entity.team !== pokemon.team && entity !== target) {
            possibleTargets.push(entity)
          }
        })
        possibleTargets.sort(
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
        const targets = possibleTargets.slice(0, numberOfTargets)
        targets.forEach((tg) => {
          pokemon.broadcastAbility({
            positionX: target.positionX,
            positionY: target.positionY,
            targetX: tg.positionX,
            targetY: tg.positionY,
            delay: 1
          })
          pokemon.commands.push(
            new DelayedCommand(() => {
              tg.handleSpecialDamage(
                secondaryDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              pokemon.broadcastAbility({
                positionX: tg.positionX,
                positionY: tg.positionY,
                targetX: target.positionX,
                targetY: target.positionY,
                delay: 2
              })
              pokemon.commands.push(
                new DelayedCommand(() => {
                  target.handleSpecialDamage(
                    finalDamage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }, 300)
              )
            }, 300)
          )
        })
      }, 300)
    )
  }
}

export class SuctionHealStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [15, 30, 60][pokemon.stars - 1] ?? 60
    const cells = board.getCellsInFront(pokemon, target)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        const attack = cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
        pokemon.handleHeal(attack.takenDamage * 0.5, pokemon, 0, false)
      }
    })
  }
}

export class BehemothBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 100 + pokemon.atk
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      undefined
    )

    const destination = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      orientation
    )

    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board)
    }
  }
}

export class HeatCrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Crashes into the target, knocking it back and dealing [40,60,80,SP] SPECIAL. Does more damage the more ATK the user has compared to the target.
    let damage = [40, 60, 80][pokemon.stars - 1] ?? 80
    const attackDifference = pokemon.atk - target.atk
    damage += attackDifference * 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const knockbackCell = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      pokemon.orientation
    )
    if (knockbackCell) {
      target.moveTo(knockbackCell.x, knockbackCell.y, board)
      target.cooldown = 500
    }
  }
}

export class LaserBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % 2 === 1) {
      // Spins laser blade around, moving behind their target, gaining [30,SP] SHIELD and dealing [30,SP] SPECIAL to target and adjacent enemies on the path.
      const damage = 25
      const shield = 25
      const enemiesHit = new Set<PokemonEntity>()
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .concat(
          board.getAdjacentCells(target.positionX, target.positionY, false)
        )
        .map((cell) => cell.value)
        .filter(
          (entity): entity is PokemonEntity =>
            entity != null && entity.team !== pokemon.team
        )
        .forEach((enemy) => enemiesHit.add(enemy))
      pokemon.moveTo(target.positionX, target.positionY, board)
      pokemon.addShield(shield, pokemon, 1, crit)
      enemiesHit.forEach((enemy) => {
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      })
    } else {
      // Spins laser blade in front of them, dealing 2 times [30,SP] + ATK as SPECIAL
      const damage = 25 + pokemon.atk
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, 300)
      )
    }
  }
}

export class ArmThrustStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal 2 to 5 hits (luck based increasing with AP) each dealing 100% of the user's ATK as physical damage. Each hit has the same individual crit chance.
    const damage = pokemon.atk
    const nbHits = clamp(
      Math.floor(2 + Math.random() * 3 * (1 + pokemon.luck / 100)),
      2,
      5
    )
    pokemon.broadcastAbility({
      skill: Ability.ARM_THRUST,
      delay: nbHits
    })
    for (let i = 0; i < nbHits; i++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.PHYSICAL,
        pokemon,
        chance(pokemon.critChance / 100, pokemon)
      )
    }
  }
}

export class DrumBeatingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    switch (pokemon.count.ult % 3) {
      case 0: {
        // give 10/20/40 speed to the entire team
        const speed = [10, 20, 40][pokemon.stars - 1] ?? 40
        board.forEach((x, y, entity) => {
          if (entity && entity.team === pokemon.team) {
            entity.addSpeed(speed, pokemon, 1, crit)
          }
        })
        break
      }
      case 1: {
        // give 10/20/40 shield to the entire team
        const shield = [10, 20, 40][pokemon.stars - 1] ?? 40
        board.forEach((x, y, entity) => {
          if (entity && entity.team === pokemon.team) {
            entity.addShield(shield, pokemon, 1, crit)
          }
        })
        break
      }
      case 2:
      default: {
        // deal 10/20/40 special damage to the opponent team
        const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
        board.forEach((x, y, entity) => {
          if (entity && entity.team !== pokemon.team) {
            entity.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        break
      }
    }
  }
}

export class SurgingStrikesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // strikes the target with a flowing motion three times in a row, dealing [100,SP]% of ATK each as SPECIAL. Always deal critical hits.
    super.process(pokemon, board, target, true)
    const damage = pokemon.atk
    const nbHits = 3
    for (let i = 0; i < nbHits; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            true
          )
        }, i * 200)
      )
    }
    pokemon.cooldown += 200 * nbHits
  }
}

export class WickedBlowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 80AP true damage to the target. Always deal a critical hit.
    super.process(pokemon, board, target, true)
    const damage = 60
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, true)
  }
}

export class VictoryDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, true)
    // gain 3 Attack, 3 Defense and 10 Speed.
    pokemon.addAttack(3, pokemon, 1, crit)
    pokemon.addDefense(3, pokemon, 1, crit)
    pokemon.addSpeed(10, pokemon, 1, crit)
  }
}

export class BoomBurstStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 60 special damage to all adjacent units including allies
    super.process(pokemon, board, target, crit)
    const damage = 60
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerFlinch(4000, cell.value, pokemon)
        }
      })
  }
}

export class FollowMeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Jump to a free cell far away and gain [40,SP] SHIELD. Enemies that were targeting the user are CHARM for 3 seconds.
    const cellToJump = board.getFlyAwayCell(
      pokemon.positionX,
      pokemon.positionY
    )
    if (cellToJump) {
      const enemiesTargetingPokemon = board.cells.filter<PokemonEntity>(
        (entity): entity is PokemonEntity =>
          entity != null &&
          entity.targetEntityId === pokemon.id &&
          entity.team !== pokemon.team
      )
      enemiesTargetingPokemon.forEach((enemy) => {
        enemy.status.triggerCharm(3000, enemy, pokemon, false)
      })
      pokemon.moveTo(cellToJump.x, cellToJump.y, board)
      pokemon.addShield(40, pokemon, 1, crit)
    }
  }
}

export class AfterYouStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Gives [15,SP] PP and [10,SP] SPEED buff to the strongest closest ally.
    const nearestAllies = pokemon.state.getNearestAllies(pokemon, board)
    const strongestNearestAlly = getStrongestUnit(nearestAllies)
    if (strongestNearestAlly) {
      strongestNearestAlly.addPP(15, pokemon, 1, crit)
      strongestNearestAlly.addSpeed(10, pokemon, 1, crit)
    }
  }
}

export class TwinBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Fires out two beams that hit the furthest enemies, dealing 30/60 special damage to all enemies in a line.
    const damage = [30, 60, 100][pokemon.stars - 1] ?? 100
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      effectInLine(board, pokemon, farthestTarget, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
      pokemon.broadcastAbility({
        skill: Ability.TWIN_BEAM,
        targetX: farthestTarget.positionX,
        targetY: farthestTarget.positionY
      })

      const oppositeFarthestTarget = pokemon.state.getFarthestTarget(
        farthestTarget,
        board,
        pokemon
      )
      if (oppositeFarthestTarget) {
        effectInLine(board, pokemon, oppositeFarthestTarget, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.broadcastAbility({
          skill: Ability.TWIN_BEAM,
          targetX: oppositeFarthestTarget.positionX,
          targetY: oppositeFarthestTarget.positionY
        })
      }
    }
  }
}

export class SwaggerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Confuses and enrage the target for 2 seconds
    const duration = Math.round(
      2000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    target.status.triggerConfusion(duration, target, pokemon)
    target.status.triggerRage(duration, target)
  }
}

export class EncoreStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const abilitiesCast =
      pokemon.team === Team.BLUE_TEAM
        ? pokemon.simulation.blueAbilitiesCast
        : pokemon.simulation.redAbilitiesCast
    const lastAbilityUsed = abilitiesCast?.findLast(
      (ability) =>
        ability !== Ability.ENCORE && AbilityStrategies[ability]?.copyable
    )
    if (lastAbilityUsed) {
      AbilityStrategies[lastAbilityUsed].process(pokemon, board, target, crit)
    }
  }
}

export class ChainCrazedStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Self inflict poison and gain 20 speed, 15 attack and 10 defense
    pokemon.status.triggerPoison(3000, pokemon, pokemon)
    pokemon.addSpeed(20, pokemon, 0, false)
    pokemon.addAttack(15, pokemon, 1, crit)
    pokemon.addDefense(10, pokemon, 1, crit)
  }
}

export class MindBendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Target is Possessed for 2 seconds. If Rune Protect or already possessed, takes 100 special damage instead.
    if (target.status.runeProtect || target.status.possessed) {
      target.handleSpecialDamage(100, board, AttackType.SPECIAL, pokemon, crit)
    } else {
      const duration = Math.round(
        2000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
      )
      target.status.triggerPossessed(duration, target, pokemon)
    }
  }
}

export class SteamrollerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = Math.round(
      ([0.4, 0.8, 1.5][pokemon.stars - 1] ?? 1.5) * pokemon.speed
    )

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit = new Set<PokemonEntity>()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell, i) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      if (chance(0.5, pokemon)) {
        enemy.status.triggerFlinch(3000, enemy, pokemon)
      }
    })
  }
}
export class MagnetPullStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.player) {
      const randomSteelPkm = pokemon.simulation.room.state.shop.magnetPull(
        pokemon,
        pokemon.player
      )
      pokemon.simulation.room.spawnWanderingPokemon(
        {
          pkm: randomSteelPkm,
          behavior: WandererBehavior.SPECTATE,
          type: WandererType.CATCHABLE
        },
        pokemon.player
      )
    }
  }
}

export class SpinOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round([0.25, 0.5, 1][pokemon.stars - 1] * pokemon.speed)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerBlinded(1000, target)

    // move back to your own backline
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.moveTo(corner.x, corner.y, board)
        }, 100)
      )
    }

    const accelerationEffect = [...pokemon.effectsSet.values()].find(
      (effect) => effect instanceof AccelerationEffect
    )
    if (accelerationEffect) {
      pokemon.addSpeed(
        -accelerationEffect.accelerationStacks * 20,
        pokemon,
        0,
        false
      )
      accelerationEffect.accelerationStacks = 0
    }
  }
}

export class RockArtilleryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const numberOfRocks = [10, 15, 25][pokemon.stars - 1] ?? 25
    const damage = [20, 30, 40][pokemon.stars - 1] ?? 40

    const enemies = board.cells.filter(
      (cell) => cell && cell.team !== pokemon.team
    ) as PokemonEntity[]

    for (let i = 0; i < numberOfRocks; i++) {
      const randomEnemy = pickRandomIn(enemies)
      if (randomEnemy) {
        const adjacentCells = board.getAdjacentCells(
          randomEnemy.positionX,
          randomEnemy.positionY,
          true
        )
        const targetCell = pickRandomIn(adjacentCells)

        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: targetCell.x,
              targetY: targetCell.y
            })
            if (targetCell.value && targetCell.value.team !== pokemon.team) {
              targetCell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }, i * 100)
        )
      }
    }
  }
}

export class ZingZapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 90
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(3000, target, pokemon)

    if (target.status.paralysis) {
      pokemon.addShield(40, pokemon, 1, crit)
    }

    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      undefined
    )

    const destination = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      orientation
    )

    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board)
    }
  }
}

export class TackleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 60][pokemon.stars - 1] ?? 60
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class NoRetreatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFalinks =
      [...pokemon.effectsSet.values()].find(
        (e) => e instanceof FalinksFormationEffect
      )?.stacks ?? 0
    if (nbFalinks > 0) {
      //Gain 1 ATK, 1 DEF, 1 SPE_DEF and 5 SPEED per Falinks on your team. Troopers tackle target for [20,SP] SPECIAL each.
      pokemon.addAttack(nbFalinks, pokemon, 0, false)
      pokemon.addDefense(nbFalinks, pokemon, 0, false)
      pokemon.addSpecialDefense(nbFalinks, pokemon, 0, false)
      pokemon.addSpeed(nbFalinks * 5, pokemon, 0, false)

      for (let i = 0; i < nbFalinks; i++) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            target.handleSpecialDamage(
              20,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }, i * 100)
        )
      }
    }
  }
}

export class StaticShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 70
    const heal = 30
    const shield = 30

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const fairyCount = adjacentCells.filter(
      (cell) => cell.value && cell.value.types.has(Synergy.FAIRY)
    ).length

    if (fairyCount > 0) {
      pokemon.handleHeal(heal * fairyCount, pokemon, 1, crit)
    }

    const electricCount = adjacentCells.filter(
      (cell) => cell.value && cell.value.types.has(Synergy.ELECTRIC)
    ).length

    if (electricCount > 0) {
      pokemon.addShield(shield * electricCount, pokemon, 1, crit)
    }
  }
}

export class SandSpitStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120][pokemon.stars - 1] ?? 120
    const cellsHit = board.getCellsInFront(pokemon, target, 1)

    for (const cell of cellsHit) {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBlinded(2000, cell.value)
      }
    }
  }
}

export class HyperDrillStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [10, 30, 50][pokemon.stars - 1] ?? 50
    const boardPlayer = target.simulation.bluePlayer
    let doubleDamage = false
    if (boardPlayer) {
      const index = target.positionY * BOARD_WIDTH + target.positionX
      if (boardPlayer.groundHoles[index] === 5) {
        doubleDamage = true
      } else {
        boardPlayer.groundHoles[index] =
          (boardPlayer.groundHoles[index] ?? 0) + 1
      }
      pokemon.broadcastAbility({
        targetX: target.positionX,
        targetY: target.positionY,
        delay: boardPlayer.groundHoles[index] // delay will hold the ground hole depth info
      })
    }

    if (target.status.protect) {
      target.status.protect = false
      target.status.protectCooldown = 0
    }
    target.handleSpecialDamage(
      damage * (doubleDamage ? 2 : 1),
      board,
      AttackType.TRUE,
      pokemon,
      crit
    )
  }
}

export class TerrainPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const fieldEffects: (keyof IStatus)[] = [
      "fairyField",
      "electricField",
      "grassField",
      "psychicField"
    ] as const
    type FieldEffect = (typeof fieldEffects)[number]
    const getFieldEffect = (pkm: PokemonEntity): FieldEffect | null =>
      fieldEffects.find((field) => pkm.status[field] === true) ?? null

    const userField = getFieldEffect(pokemon)
    if (userField === null) pokemon.status.grassField = true

    const adjacentFieldsByPkm: Map<PokemonEntity, Set<FieldEffect>> = new Map()
    const pokemonsWithField: Map<PokemonEntity, FieldEffect> = new Map()

    // 1. collect adjacent fields
    board.forEach((x, y, entity) => {
      if (!entity) return
      const activeField = getFieldEffect(entity)
      if (activeField) {
        pokemonsWithField.set(entity, activeField)
        const adjacentAlliesWithoutField = board
          .getAdjacentCells(x, y)
          .map((cell) => cell.value)
          .filter(
            (e): e is PokemonEntity =>
              e != null && e.team === entity.team && getFieldEffect(e) === null
          )
        for (const ally of adjacentAlliesWithoutField) {
          const adjacentFields =
            adjacentFieldsByPkm.get(ally) ?? new Set<FieldEffect>()
          adjacentFields.add(activeField)
          adjacentFieldsByPkm.set(ally, adjacentFields)
        }
      }
    })

    // 2. propagate fields
    adjacentFieldsByPkm.forEach((fields, pkm) => {
      const field = pickRandomIn([...fields])
      switch (field) {
        case "fairyField":
          pkm.status.fairyField = true
          break
        case "electricField":
          pkm.status.electricField = true
          break
        case "grassField":
          pkm.status.grassField = true
          break
        case "psychicField":
          pkm.status.psychicField = true
          break
      }
      pokemonsWithField.set(pkm, getFieldEffect(pkm)!)
    })

    // 3. trigger additional field effects
    /*
    Grass field: heal 5% of max HP
    Electric Field: gain 10 Speed
    Psychic Field: gain 10 PP
    Fairy Field: gain 5% of max HP as Shield
    */
    pokemonsWithField.forEach((field, pkm) => {
      switch (field) {
        case "grassField":
          pkm.handleHeal(0.05 * pkm.maxHP, pokemon, 1, crit)
          break
        case "electricField":
          pkm.addSpeed(10, pokemon, 1, crit)
          break
        case "psychicField":
          pkm.addPP(10, pokemon, 1, crit)
          break
        case "fairyField":
          pkm.addShield(0.05 * pkm.maxHP, pokemon, 1, crit)
          break
      }
    })
  }
}

export class AxeKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Leap to the enemy with the highest PP then deal [30,60,100,SP] SPECIAL and burn [15,SP] PP. Has [30,LK]% chance to inflict CONFUSION for 3 seconds
    const highestPPEnemies = board.cells
      .filter(
        (e): e is PokemonEntity => e !== undefined && e.team !== pokemon.team
      )
      .sort((a, b) => b!.pp - a!.pp)
    let highestPPEnemy: PokemonEntity | null = null
    let freeSpot: { x: number; y: number } | null = null
    do {
      highestPPEnemy = highestPPEnemies.shift() ?? null
      freeSpot = highestPPEnemy
        ? board.getClosestAvailablePlace(
            highestPPEnemy.positionX,
            highestPPEnemy.positionY
          )
        : null
    } while (highestPPEnemies.length > 0 && (!highestPPEnemy || !freeSpot))

    if (highestPPEnemy && freeSpot) {
      pokemon.moveTo(freeSpot.x, freeSpot.y, board)
      const damage = [25, 50, 100][pokemon.stars - 1] ?? 100
      highestPPEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      highestPPEnemy.addPP(-15, pokemon, 1, crit)
      if (chance(0.3, pokemon)) {
        highestPPEnemy.status.triggerConfusion(3000, highestPPEnemy, pokemon)
      }
    }
  }
}

export class ExpandingForceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // User gains PSYCHIC_FIELD, or spreads it to a nearby ally.
    if (!pokemon.status.psychicField) {
      pokemon.status.psychicField = true
    } else {
      // Find nearby ally without PSYCHIC_FIELD and give it to them
      const nearbyAllies = board.cells
        .filter(
          (ally): ally is PokemonEntity =>
            !!ally && ally.team === pokemon.team && !ally.status.psychicField
        )
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

      if (nearbyAllies.length > 0) {
        const chosen = nearbyAllies[0]
        chosen.status.psychicField = true
      }
    }

    // All allies in a PSYCHIC_FIELD: deal [10,20,40,SP] SPECIAL to adjacent enemies
    const damage = [10, 20, 40][pokemon.stars - 1] ?? 40
    board.cells
      .filter(
        (ally): ally is PokemonEntity =>
          !!ally && ally.team === pokemon.team && ally.status.psychicField
      )
      .forEach((ally) => {
        ally.broadcastAbility({ skill: Ability.EXPANDING_FORCE })
        board
          .getAdjacentCells(ally.positionX, ally.positionY)
          .forEach((cell) => {
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
      })
  }
}

export class SpiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppDrain = [20, 40, 60][pokemon.stars - 1] ?? 60

    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      skill: Ability.PSYCHIC_FANGS
    })

    // Drain PP from target
    target.addPP(-ppDrain, pokemon, 1, crit) //addPP handles pp underflow, ap, crit

    const adjacentAllies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter((cell) => cell.value && cell.value.team === pokemon.team)
      .map((cell) => cell.value)

    // Redistribute PP to adjacent allies
    if (adjacentAllies.length > 0) {
      for (const ally of adjacentAllies) {
        if (ally) {
          pokemon.broadcastAbility({
            targetX: ally.positionX,
            targetY: ally.positionY
          })
          ally.addPP(ppDrain / adjacentAllies.length, pokemon, 1, crit) //divide by number of allies to redistribute
        }
      }
    }
  }
}

export class GrudgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const duration = 3000
    const damage = [18, 36, 52][pokemon.stars - 1] ?? 52

    // Apply SILENCE status to the target
    target.status.triggerSilence(duration, target, pokemon)

    // Deal damage to all enemies affected by SILENCE
    board.cells
      .filter(
        (enemy): enemy is PokemonEntity =>
          !!enemy && enemy.team !== pokemon.team && enemy.status.silence
      )
      .forEach((enemy) => {
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      })
  }
}

export class OctolockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 90][pokemon.stars - 1] ?? 90
    const duration = 3000

    // Deal SPECIAL damage
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    // Apply LOCKED status for 3 seconds
    target.status.triggerLocked(duration, target)

    // Apply ARMOR_BREAK status for 3 seconds
    target.status.triggerArmorReduction(duration, target)
  }
}

export class JawLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage = Math.round(pokemon.atk * 1.25)
    const bonusDamage = [10, 15, 20][pokemon.stars - 1] ?? 20
    const totalDamage = baseDamage + bonusDamage
    const heal = [25, 50, 100][pokemon.stars - 1] ?? 100

    // Check if target is already locked (already bitten)
    const alreadyBitten =
      (pokemon instanceof Chewtle || pokemon instanceof Drednaw) &&
      pokemon.jawLockTargets.includes(target.id)

    // Apply LOCKED status for 3 seconds
    target.status.triggerLocked(3000, target)

    // Deal damage
    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Add the target id to the jawLockTargets
    ;(pokemon instanceof Chewtle || pokemon instanceof Drednaw) &&
      pokemon.jawLockTargets.push(target.id)

    // If target was already bitten, heal the user
    if (alreadyBitten) {
      pokemon.handleHeal(heal, pokemon, 1, crit)
    }
  }
}

export class LastRespectsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Reduction factor for curse delay based on AP and crit
    const factor = 0.2

    // Base damage scales with star level: 1★=30, 2★=60, 3★=90
    const damage = [30, 60, 90][pokemon.stars - 1] ?? 90

    // Calculate curse delay with AP and crit scaling
    // Base delays: 1★=8s, 2★=5s, 3★=3s, reduced by AP and crit power
    const curseDelay = min(0)(
      ([10000, 8000, 5000][pokemon.stars - 1] ?? 5000) *
        (1 - (factor * pokemon.ap) / 100) *
        (crit ? 1 - (pokemon.critPower - 1) * factor : 1)
    )

    // Find all adjacent enemies that aren't already cursed
    const cells = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter((c) => c.value?.team === target.team && !c.value?.status.curse)
      .map((c) => c.value)

    // Pick a random uncursed ally to curse, fallback to original target
    const curseTarget = pickRandomIn(cells)
    const damageTarget = curseTarget || target

    // Broadcast ability animation
    pokemon.broadcastAbility({
      targetX: damageTarget.positionX,
      targetY: damageTarget.positionY,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })

    // Deal immediate damage to the target
    damageTarget.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Apply curse status that will KO after the calculated delay
    curseTarget?.status.triggerCurse(curseDelay, curseTarget)
  }
}

export class BurningJealousyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = 70
    const burnDuration = 5000

    // Get target and adjacent enemies
    const targets = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value!)

    targets.forEach((enemy) => {
      // Deal SPECIAL damage to all targets
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.broadcastAbility({
        targetX: enemy.positionX,
        targetY: enemy.positionY,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })

      // Only enemies with ATK buffs lose them and get burned
      if (enemy.atk > enemy.baseAtk) {
        // Remove ATK buffs (subtract the buff amount)
        enemy.addAttack(-(enemy.atk - enemy.baseAtk), enemy, 0, false)

        // Inflict BURN for 5 seconds
        enemy.status.triggerBurn(burnDuration, enemy, pokemon)
      }
    })
  }
}

export class FirstImpressionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    // Base damage: 1★=45, 2★=90
    const damage = [45, 90][pokemon.stars - 1] ?? 90

    // Base flinch duration: 1★=3s, 2★=5s, scaled by AP and crit
    let duration = [3000, 5000][pokemon.stars - 1] ?? 5000
    duration = Math.round(
      duration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )

    // Deal damage and apply flinch status
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(duration, target, pokemon)

    // Find a cell to fly away to after the attack
    const flyAwayCell = board.getFlyAwayCell(
      pokemon.positionX,
      pokemon.positionY
    )

    // Store original position before moving
    const x = pokemon.positionX
    const y = pokemon.positionY

    if (flyAwayCell) {
      // Move pokemon to the fly away position
      pokemon.moveTo(flyAwayCell.x, flyAwayCell.y, board)

      // If original position is now empty, spawn a random bug pokemon
      if (board.getEntityOnCell(x, y) === undefined) {
        // Get all 1-star bug pokemon from common/uncommon rarities with abilities
        const possibleBugsPkm = [
          ...PRECOMPUTED_POKEMONS_PER_RARITY.COMMON,
          ...PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON
        ].filter((pkm) => {
          const data = getPokemonData(pkm)
          return (
            data.stars === 1 &&
            data.skill !== Ability.DEFAULT &&
            data.types.includes(Synergy.BUG)
          )
        })

        // Pick a random bug pokemon from the filtered list
        const randomBugPkm = pickRandomIn<Pkm>(possibleBugsPkm)

        // Create the bug pokemon instance
        const randomBug = PokemonFactory.createPokemonFromName(
          randomBugPkm,
          pokemon.player
        )

        // Add the bug pokemon to the original position
        pokemon.simulation.addPokemon(randomBug, x, y, pokemon.team, true)
      }
    }
  }
}

export class BaredFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    // Deal 140% of ATK as SPECIAL damage
    const damage = Math.round(pokemon.atk * 1.6)
    const speedSteal = 10

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    // Steal 10 SPEED from target and give it to attacker
    target.addSpeed(-speedSteal, pokemon, 1, crit)
    pokemon.addSpeed(speedSteal, pokemon, 1, crit)
  }
}

export class GrudgeDiveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Base damage scales with stars: 1★=30, 2★=60, 3★=90, 4★=120
    const damage = [30, 60, 90, 120][pokemon.stars - 1] ?? 120

    // Recoil damage is 20% of base HP
    const recoil = Math.round(pokemon.maxHP * 0.1)

    // Bonus damage per fallen ally scales with stars: 1★=5, 2★=10, 3★=15, 4★=20
    const damagePerFallenAlly = [5, 10, 15, 20][pokemon.stars - 1] ?? 20
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })

    // Deal damage increased by fallen allies
    target.handleSpecialDamage(
      damage + nbFallenAllies * damagePerFallenAlly,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Take recoil damage unless protected by Protective Pads
    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class SoulTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Gain [25,50,108] SHIELD, then enemies within a 2-tile radius lose [10,SP] PP and get FATIGUE for [2,SP,ND=1] seconds and choose the user as the target.
    const shieldAmount = [25, 50, 108][pokemon.stars - 1] ?? 108
    const fatigueDuration = Math.round(
      2000 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    pokemon.addShield(shieldAmount, pokemon, 0, false)
    const enemies = board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
    enemies.forEach((cell) => {
      const enemy = cell.value!
      enemy.addPP(-10, pokemon, 1, crit)
      enemy.status.triggerFatigue(fatigueDuration, enemy)
    })
  }
}

export class EerieSpellStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [10, 20, 40][pokemon.stars - 1] ?? 45
    const healAmount = [15, 30, 45][pokemon.stars - 1] ?? 60
    const visited = new Set<string>()
    let currentTarget: PokemonEntity | undefined = target
    let lastTarget: PokemonEntity = pokemon

    // Queue 4 bounces with 300ms delays
    for (let i = 0; i < 4; i++) {
      if (currentTarget) {
        visited.add(currentTarget.id)

        // Animate wave from last position to current target
        pokemon.broadcastAbility({
          positionX: lastTarget.positionX,
          positionY: lastTarget.positionY,
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY,
          delay: 300 * i
        })

        lastTarget = currentTarget

        // Heal allies, damage enemies
        if (currentTarget.team === pokemon.team) {
          currentTarget.handleHeal(healAmount, pokemon, 1, crit)
        } else {
          currentTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }

      // Find next target with lowest HP
      currentTarget = board.cells
        .filter((c) => c instanceof PokemonEntity)
        .filter((c) => !visited.has(c.id))
        .sort((a, b) => a.hp - b.hp)[0]
    }
  }
}

export class ShellSideArmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const poisonDuration =
      ([2000, 3000][pokemon.stars - 1] ?? 3000) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)

    const apBoost = [10, 20][pokemon.stars - 1] ?? 20
    const visited = new Set<string>()
    let currentTarget: PokemonEntity | undefined = target
    let lastTarget: PokemonEntity = pokemon

    // Queue 4 bounces with 300ms delays, prioritizing high HP targets
    for (let i = 0; i < 4; i++) {
      if (currentTarget) {
        visited.add(currentTarget.id)

        // Animate wave from last position to current target
        pokemon.broadcastAbility({
          positionX: lastTarget.positionX,
          positionY: lastTarget.positionY,
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY,
          delay: 300 * i,
          orientation: lastTarget.orientation
        })

        lastTarget = currentTarget

        // Poison enemies, boost allies' AP
        if (currentTarget.team === pokemon.team) {
          currentTarget.addAbilityPower(apBoost, pokemon, 0, false)
        } else {
          currentTarget.status.triggerPoison(
            poisonDuration,
            currentTarget,
            pokemon
          )
        }
      }

      // Find next target with highest HP
      currentTarget = board.cells
        .filter((c) => c instanceof PokemonEntity)
        .filter((c) => !visited.has(c.id))
        .sort((a, b) => b.hp - a.hp)[0]
    }
  }
}

export class TripleDiveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = [15, 30, 45][pokemon.stars - 1] ?? 45

    // Find 3 lowest HP enemies
    const enemies = board.cells
      .filter(
        (entity): entity is PokemonEntity =>
          entity instanceof PokemonEntity && entity.team !== pokemon.team
      )
      .sort((a, b) => a.hp - b.hp)
      .slice(0, 3)

    // Perform triple dive with 400ms delays
    enemies.forEach((enemy, i) => {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (enemy) {
            const availableAdjacentPlace = board.getClosestAvailablePlace(
              enemy.positionX,
              enemy.positionY
            )

            if (availableAdjacentPlace) {
              pokemon.moveTo(
                availableAdjacentPlace.x,
                availableAdjacentPlace.y,
                board
              )
            }

            pokemon.broadcastAbility({
              positionX: pokemon.positionX,
              positionY: pokemon.positionY,
              targetX: enemy.positionX,
              targetY: enemy.positionY
            })

            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, 400 * i)
      )
    })
  }
}

export class MoonblastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = 20
    let currentTarget: PokemonEntity | undefined = target
    let moonsRemaining = 6
    let moonIndex = 0

    function sendMoon() {
      if (!currentTarget) return
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY
      })

      moonIndex++

      const { death } = currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      moonsRemaining--

      // If target died, find closest enemy and gain bonus moon
      if (death) {
        const closestEnemy = board.cells
          .filter(
            (entity): entity is PokemonEntity =>
              entity instanceof PokemonEntity &&
              entity.team !== pokemon.team &&
              entity.hp > 0
          )
          .sort(
            (a, b) =>
              distanceC(
                a.positionX,
                a.positionY,
                (currentTarget || pokemon).positionX,
                (currentTarget || pokemon).positionY
              ) -
              distanceC(
                b.positionX,
                b.positionY,
                (currentTarget || pokemon).positionX,
                (currentTarget || pokemon).positionY
              )
          )[0]

        if (closestEnemy) {
          currentTarget = closestEnemy
          moonsRemaining++ // Gain 1 additional moon when switching targets
        } else {
          currentTarget = undefined
        }
      }

      if (moonsRemaining > 0 && currentTarget) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            sendMoon()
          }, 200)
        )
      }
    }

    sendMoon()
  }
}

export * from "./hidden-power"

export const AbilityStrategies: { [key in Ability]: AbilityStrategy } = {
  [Ability.SONG_OF_DESIRE]: new SongOfDesireStrategy(),
  [Ability.CONFUSING_MIND]: new ConfusingMindStrategy(),
  [Ability.KNOWLEDGE_THIEF]: new KnowledgeThiefStrategy(),
  [Ability.WONDER_GUARD]: new WonderGuardStrategy(),
  [Ability.CRABHAMMER]: new CrabHammerStrategy(),
  [Ability.KING_SHIELD]: new KingShieldStrategy(),
  [Ability.U_TURN]: new UTurnStrategy(),
  [Ability.EXPLOSION]: new ExplosionStrategy(),
  [Ability.CHLOROBLAST]: new ChloroblastStrategy(),
  [Ability.NIGHTMARE]: new NightmareStrategy(),
  [Ability.CLANGOROUS_SOUL]: new ClangorousSoulStrategy(),
  [Ability.BONEMERANG]: new BonemerangStrategy(),
  [Ability.SHADOW_BONE]: new ShadowBoneStrategy(),
  [Ability.GROWL]: new GrowlStrategy(),
  [Ability.RELIC_SONG]: new RelicSongStrategy(),
  [Ability.FAIRY_WIND]: new FairyWindStrategy(),
  [Ability.DISARMING_VOICE]: new DisarmingVoiceStrategy(),
  [Ability.HIGH_JUMP_KICK]: new HighJumpKickStrategy(),
  [Ability.TROP_KICK]: new TropKickStrategy(),
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
  [Ability.FLAMETHROWER]: new FlameThrowerStrategy(),
  [Ability.THUNDER_SHOCK]: new ThunderShockStrategy(),
  [Ability.THUNDER]: new ThunderStrategy(),
  [Ability.HYDRO_PUMP]: new HydroPumpStrategy(),
  [Ability.DRACO_METEOR]: new DracoMeteorStrategy(),
  [Ability.BLAZE_KICK]: new BlazeKickStrategy(),
  [Ability.WISH]: new WishStrategy(),
  [Ability.LUNAR_BLESSING]: new LunarBlessingStrategy(),
  [Ability.MEDITATE]: new MeditateStrategy(),
  [Ability.IRON_DEFENSE]: new IronDefenseStrategy(),
  [Ability.DEFENSE_CURL]: new DefenseCurlStrategy(),
  [Ability.IRON_HEAD]: new IronHeadStrategy(),
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
  [Ability.INGRAIN]: new IngrainStrategy(),
  [Ability.TORMENT]: new TormentStrategy(),
  [Ability.STOMP]: new StompStrategy(),
  [Ability.HORN_DRILL]: new HornDrillStrategy(),
  [Ability.NIGHT_SLASH]: new NightSlashStrategy(),
  [Ability.KOWTOW_CLEAVE]: new KowtowCleaveStrategy(),
  [Ability.BUG_BUZZ]: new BugBuzzStrategy(),
  [Ability.STRING_SHOT]: new StringShotStrategy(),
  [Ability.ENTANGLING_THREAD]: new EntanglingThreadStrategy(),
  [Ability.VENOSHOCK]: new VenoshockStrategy(),
  [Ability.LEECH_LIFE]: new LeechLifeStrategy(),
  [Ability.HAPPY_HOUR]: new HappyHourStrategy(),
  [Ability.TELEPORT]: new TeleportStrategy(),
  [Ability.NASTY_PLOT]: new NastyPlotStrategy(),
  [Ability.THIEF]: new ThiefStrategy(),
  [Ability.STUN_SPORE]: new StunSporeStrategy(),
  [Ability.METEOR_MASH]: new MeteorMashStrategy(),
  [Ability.HURRICANE]: new HurricaneStrategy(),
  [Ability.SING]: new SingStrategy(),
  [Ability.CONFUSION]: new ConfusionStrategy(),
  [Ability.BLIZZARD]: new BlizzardStrategy(),
  [Ability.PROTECT]: new ProtectStrategy(),
  [Ability.OBSTRUCT]: new ObstructStrategy(),
  [Ability.TOXIC]: new ToxicStrategy(),
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
  [Ability.MYSTICAL_FIRE]: new MysticalFireStrategy(),
  [Ability.FLAME_CHARGE]: new FlameChargeStrategy(),
  [Ability.LEECH_SEED]: new LeechSeedStrategy(),
  [Ability.LOCK_ON]: new LockOnStrategy(),
  [Ability.DISABLE]: new DisableStrategy(),
  [Ability.RAZOR_WIND]: new RazorWindStrategy(),
  [Ability.PRECIPICE_BLADES]: new PrecipiceBladesStrategy(),
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
  [Ability.SPIKY_SHIELD]: new SpikeArmorStrategy(),
  [Ability.FUTURE_SIGHT]: new FutureSightStrategy(),
  [Ability.FAKE_TEARS]: new FakeTearsStrategy(),
  [Ability.SPARKLING_ARIA]: new SparklingAriaStrategy(),
  [Ability.DRAGON_DARTS]: new DragonDartsStrategy(),
  [Ability.GRASSY_SURGE]: new GrassySurgeStrategy(),
  [Ability.MISTY_SURGE]: new MistySurgeStrategy(),
  [Ability.SKY_ATTACK]: new SkyAttackStrategy(),
  [Ability.SKY_ATTACK_SHADOW]: new SkyAttackShadowStrategy(),
  [Ability.ILLUSION]: new IllusionStrategy(),
  [Ability.SLUDGE]: new SludgeStrategy(),
  [Ability.SLUDGE_WAVE]: new SludgeWaveStrategy(),
  [Ability.AURORA_BEAM]: new AuroraBeamStrategy(),
  [Ability.AGILITY]: new AgilityStrategy(),
  [Ability.SPIRIT_SHACKLE]: new SpiritShackleStrategy(),
  [Ability.WATER_SHURIKEN]: new WaterShurikenStrategy(),
  [Ability.SHADOW_SNEAK]: new ShadowSneakStrategy(),
  [Ability.MACH_PUNCH]: new MachPunchStrategy(),
  [Ability.MEGA_PUNCH]: new MegaPunchStrategy(),
  [Ability.TRIPLE_KICK]: new TripleKickStrategy(),
  [Ability.MAWASHI_GERI]: new MawashiGeriStrategy(),
  [Ability.FORECAST]: new ForecastStrategy(),
  [Ability.SACRED_SWORD_GRASS]: new SacredSwordGrassStrategy(),
  [Ability.SACRED_SWORD_CAVERN]: new SacredSwordCavernStrategy(),
  [Ability.SACRED_SWORD_IRON]: new SacredSwordIronStrategy(),
  [Ability.SECRET_SWORD]: new SecretSwordStrategy(),
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
  [Ability.COSMIC_POWER_MOON]: new CosmicPowerMoonStrategy(),
  [Ability.COSMIC_POWER_SUN]: new CosmicPowerSunStrategy(),
  [Ability.POISON_POWDER]: new PoisonPowderStrategy(),
  [Ability.SILVER_WIND]: new SilverWindStrategy(),
  [Ability.ICY_WIND]: new IcyWindStrategy(),
  [Ability.GIGATON_HAMMER]: new GigatonHammerStrategy(),
  [Ability.ACROBATICS]: new AcrobaticsStrategy(),
  [Ability.ABSORB]: new AbsorbStrategy(),
  [Ability.ROLLOUT]: new RolloutStrategy(),
  [Ability.ICE_BALL]: new IceBallStrategy(),
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
  [Ability.ACID_SPRAY]: new AcidSprayStrategy(),
  [Ability.UNBOUND]: new UnboundStrategy(),
  [Ability.HYPERSPACE_FURY]: new HyperspaceFuryStrategy(),
  [Ability.SNIPE_SHOT]: new SnipeShotStrategy(),
  [Ability.AIR_SLASH]: new AirSlashStrategy(),
  [Ability.EGG_BOMB]: new EggBombStrategy(),
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
  [Ability.FLASH]: new FlashStrategy(),
  [Ability.ROCK_HEAD]: new RockHeadStrategy(),
  [Ability.TAKE_HEART]: new TakeHeartStrategy(),
  [Ability.HEART_SWAP]: new HeartSwapStrategy(),
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
  [Ability.PASTEL_VEIL]: new PastelVeilStrategy(),
  [Ability.CHARM]: new CharmStrategy(),
  [Ability.ENTRAINMENT]: new EntrainmentStrategy(),
  [Ability.OCTAZOOKA]: new OctazookaStrategy(),
  [Ability.PSYCHO_SHIFT]: new PsychoShiftStrategy(),
  [Ability.GLAIVE_RUSH]: new GlaiveRushStrategy(),
  [Ability.FOUL_PLAY]: new FoulPlayStrategy(),
  [Ability.DOUBLE_IRON_BASH]: new DoubleIronBashStrategy(),
  [Ability.STONE_EDGE]: new StoneEdgeStrategy(),
  [Ability.ROAR]: new RoarStrategy(),
  [Ability.INFESTATION]: new InfestationStrategy(),
  [Ability.IVY_CUDGEL]: new IvyCudgelStrategy(),
  [Ability.FORCE_PALM]: new ForcePalmStrategy(),
  [Ability.METAL_BURST]: new MetalBurstStrategy(),
  [Ability.THUNDER_CAGE]: new ThunderCageStrategy(),
  [Ability.HEADBUTT]: new HeadbuttStrategy(),
  [Ability.STEEL_WING]: new SteelWingStrategy(),
  [Ability.YAWN]: new YawnStrategy(),
  [Ability.FIERY_DANCE]: new FieryDanceStrategy(),
  [Ability.BIDE]: new BideStrategy(),
  [Ability.SHORE_UP]: new ShoreUpStrategy(),
  [Ability.POISON_STING]: new PoisonStingStrategy(),
  [Ability.TRANSE]: new TranseStrategy(),
  [Ability.GLACIATE]: new GlaciateStrategy(),
  [Ability.WOOD_HAMMER]: new WoodHammerStrategy(),
  [Ability.TRICK_OR_TREAT]: new TrickOrTreatStrategy(),
  [Ability.FREEZING_GLARE]: new FreezingGlareStrategy(),
  [Ability.THUNDEROUS_KICK]: new ThunderousKickStrategy(),
  [Ability.FIERY_WRATH]: new FieryWrathStrategy(),
  [Ability.VISE_GRIP]: new ViseGripStrategy(),
  [Ability.LAVA_PLUME]: new LavaPlumeStrategy(),
  [Ability.LANDS_WRATH]: new LandsWrathStrategy(),
  [Ability.THOUSAND_ARROWS]: new ThousandArrowsStrategy(),
  [Ability.CORE_ENFORCER]: new CoreEnforcerStrategy(),
  [Ability.BURN_UP]: new BurnUpStrategy(),
  [Ability.POWER_HUG]: new PowerHugStrategy(),
  [Ability.MORTAL_SPIN]: new MortalSpinStrategy(),
  [Ability.METAL_CLAW]: new MetalClawStrategy(),
  [Ability.FIRESTARTER]: new FirestarterStrategy(),
  [Ability.BONE_ARMOR]: new BoneArmorStrategy(),
  [Ability.TOPSY_TURVY]: new TopsyTurvyStrategy(),
  [Ability.RAGE]: new RageStrategy(),
  [Ability.BRICK_BREAK]: new BrickBreakStrategy(),
  [Ability.TAUNT]: new TauntStrategy(),
  [Ability.BULK_UP]: new BulkUpStrategy(),
  [Ability.CUT]: new CutStrategy(),
  [Ability.FLY]: new FlyStrategy(),
  [Ability.SURF]: new SurfStrategy(),
  [Ability.STRENGTH]: new StrengthStrategy(),
  [Ability.HARDEN]: new HardenStrategy(),
  [Ability.COLUMN_CRUSH]: new ColumnCrushStrategy(),
  [Ability.WONDER_ROOM]: new WonderRoomStrategy(),
  [Ability.DARK_LARIAT]: new DarkLariatStrategy(),
  [Ability.BOLT_BEAK]: new BoltBeakStrategy(),
  [Ability.FREEZE_DRY]: new FreezeDryStrategy(),
  [Ability.DRAGON_PULSE]: new DragonPulseStrategy(),
  [Ability.FROST_BREATH]: new FrostBreathStrategy(),
  [Ability.SALT_CURE]: new SaltCureStrategy(),
  [Ability.SPICY_EXTRACT]: new SpicyExtractStrategy(),
  [Ability.SWEET_SCENT]: new SweetScentStrategy(),
  [Ability.SWALLOW]: new SwallowStrategy(),
  [Ability.NUTRIENTS]: new NutrientsStrategy(),
  [Ability.SYRUP_BOMB]: new SyrupBombStrategy(),
  [Ability.GRAV_APPLE]: new GravAppleStrategy(),
  [Ability.FICKLE_BEAM]: new FickleBeamStrategy(),
  [Ability.DECORATE]: new DecorateStrategy(),
  [Ability.DRAGON_CLAW]: new DragonClawStrategy(),
  [Ability.TAILWIND]: new TailwindStrategy(),
  [Ability.HORN_ATTACK]: new HornAttackStrategy(),
  [Ability.RAZOR_LEAF]: new RazorLeafStrategy(),
  [Ability.MUD_SHOT]: new MudShotStrategy(),
  [Ability.MALIGNANT_CHAIN]: new MalignantChainStrategy(),
  [Ability.FILLET_AWAY]: new FilletAwayStrategy(),
  [Ability.ELECTRO_SHOT]: new ElectroShotStrategy(),
  [Ability.FLOWER_TRICK]: new FlowerTrickStrategy(),
  [Ability.SOLAR_BLADE]: new SolarBladeStrategy(),
  [Ability.SCALE_SHOT]: new ScaleShotStrategy(),
  [Ability.BULLDOZE]: new BulldozeStrategy(),
  [Ability.BITTER_BLADE]: new BitterBladeStrategy(),
  [Ability.ARMOR_CANNON]: new ArmorCannonStrategy(),
  [Ability.SUCTION_HEAL]: new SuctionHealStrategy(),
  [Ability.ROOST]: new RoostStrategy(),
  [Ability.BEHEMOTH_BLADE]: new BehemothBladeStrategy(),
  [Ability.HEAT_CRASH]: new HeatCrashStrategy(),
  [Ability.LASER_BLADE]: new LaserBladeStrategy(),
  [Ability.ICICLE_MISSILE]: new IcicleMissileStrategy(),
  [Ability.ARM_THRUST]: new ArmThrustStrategy(),
  [Ability.DRUM_BEATING]: new DrumBeatingStrategy(),
  [Ability.PSYCHO_CUT]: new PsychoCutStrategy(),
  [Ability.SURGING_STRIKES]: new SurgingStrikesStrategy(),
  [Ability.WICKED_BLOW]: new WickedBlowStrategy(),
  [Ability.VICTORY_DANCE]: new VictoryDanceStrategy(),
  [Ability.BOOMBURST]: new BoomBurstStrategy(),
  [Ability.FOLLOW_ME]: new FollowMeStrategy(),
  [Ability.AFTER_YOU]: new AfterYouStrategy(),
  [Ability.COTTON_SPORE]: new CottonSporeStrategy(),
  [Ability.TWIN_BEAM]: new TwinBeamStrategy(),
  [Ability.SWAGGER]: new SwaggerStrategy(),
  [Ability.ENCORE]: new EncoreStrategy(),
  [Ability.REFLECT]: new ReflectStrategy(),
  [Ability.STORED_POWER]: new StoredPowerStrategy(),
  [Ability.CHAIN_CRAZED]: new ChainCrazedStrategy(),
  [Ability.MIND_BEND]: new MindBendStrategy(),
  [Ability.COTTON_GUARD]: new CottonGuardStrategy(),
  [Ability.STEAMROLLER]: new SteamrollerStrategy(),
  [Ability.MAGNET_PULL]: new MagnetPullStrategy(),
  [Ability.SPIN_OUT]: new SpinOutStrategy(),
  [Ability.ULTRA_THRUSTERS]: new UltraThrustersStrategy(),
  [Ability.ELECTRO_BALL]: new ElectroBallStrategy(),
  [Ability.HORN_LEECH]: new HornLeechStrategy(),
  [Ability.DRILL_RUN]: new DrillRunStrategy(),
  [Ability.DRILL_PECK]: new DrillPeckStrategy(),
  [Ability.ROCK_ARTILLERY]: new RockArtilleryStrategy(),
  [Ability.ZING_ZAP]: new ZingZapStrategy(),
  [Ability.NO_RETREAT]: new NoRetreatStrategy(),
  [Ability.TACKLE]: new TackleStrategy(),
  [Ability.STATIC_SHOCK]: new StaticShockStrategy(),
  [Ability.SAND_SPIT]: new SandSpitStrategy(),
  [Ability.HYPER_DRILL]: new HyperDrillStrategy(),
  [Ability.TERRAIN_PULSE]: new TerrainPulseStrategy(),
  [Ability.AXE_KICK]: new AxeKickStrategy(),
  [Ability.EXPANDING_FORCE]: new ExpandingForceStrategy(),
  [Ability.STOCKPILE]: new StockpileStrategy(),
  [Ability.SPITE]: new SpiteStrategy(),
  [Ability.GRUDGE]: new GrudgeStrategy(),
  [Ability.JAW_LOCK]: new JawLockStrategy(),
  [Ability.LAST_RESPECTS]: new LastRespectsStrategy(),
  [Ability.OCTOLOCK]: new OctolockStrategy(),
  [Ability.BURNING_JEALOUSY]: new BurningJealousyStrategy(),
  [Ability.FIRST_IMPRESSION]: new FirstImpressionStrategy(),
  [Ability.BARED_FANGS]: new BaredFangsStrategy(),
  [Ability.GRUDGE_DIVE]: new GrudgeDiveStrategy(),
  [Ability.SOUL_TRAP]: new SoulTrapStrategy(),
  [Ability.WISE_YAWN]: new WiseYawnStrategy(),
  [Ability.EERIE_SPELL]: new EerieSpellStrategy(),
  [Ability.SHELL_SIDE_ARM]: new ShellSideArmStrategy(),
  [Ability.TRIPLE_DIVE]: new TripleDiveStrategy(),
  [Ability.MOONBLAST]: new MoonblastStrategy(),
  [Ability.HYDRO_STEAM]: new HydroSteamStrategy(),
  [Ability.CAVERNOUS_CHOMP]: new CavernousChompStrategy()
}
