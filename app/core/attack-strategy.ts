import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import { AttackType, Team } from "../types/enum/Game"
import { Weather } from "../types/enum/Weather"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { Synergy } from "../types/enum/Synergy"
import { Ability, CopyableAbility } from "../types/enum/Ability"
import PokemonFactory from "../models/pokemon-factory"
import { Pkm } from "../types/enum/Pokemon"
import {
  chance,
  pickRandomIn,
  randomBetween,
  shuffleArray
} from "../utils/random"
import { effectInLine, OrientationArray } from "../utils/orientation"
import { logger } from "../utils/logger"
import { DEFAULT_ATK_SPEED } from "../types/Config"
import { max, min } from "../utils/number"
import { distanceC, distanceM } from "../utils/distance"
import { Transfer } from "../types"
import { Passive } from "../types/enum/Passive"
import { AbilityStrategy } from "./abilities"

export class AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    pokemon.pp = 0
    pokemon.count.ult += 1

    if (
      ![
        Ability.PYRO_BALL,
        Ability.WHIRLPOOL,
        Ability.SMOKE_SCREEN,
        Ability.ANCHOR_SHOT
      ].includes(pokemon.skill)
    ) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: target.positionX,
        targetY: target.positionY,
        orientation: pokemon.orientation
      })
    }

    if (pokemon.types.includes(Synergy.SOUND)) {
      pokemon.count.soundCount++
      const chimechoBoost = !!board.find(
        (x, y, e) => e.passive === Passive.CHIMECHO && e.team === pokemon.team
      )
      board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
        if (ally && pokemon.team === ally.team) {
          ally.status.sleep = false
          if (
            pokemon.effects.includes(Effect.LARGO) ||
            pokemon.effects.includes(Effect.ALLEGRO) ||
            pokemon.effects.includes(Effect.PRESTO)
          ) {
            ally.addAttack(chimechoBoost ? 2 : 1, false)
          }
          if (
            pokemon.effects.includes(Effect.ALLEGRO) ||
            pokemon.effects.includes(Effect.PRESTO)
          ) {
            ally.addAttackSpeed(chimechoBoost ? 10 : 5, false)
          }
          if (pokemon.effects.includes(Effect.PRESTO)) {
            const manaBoost = chimechoBoost ? 6 : 3
            ally.setPP(ally.pp + manaBoost)
          }
        }
      })
    }

    board.forEach((x, y, pkm) => {
      if (
        pkm?.passive === Passive.WATER_SPRING &&
        pkm &&
        pkm.team !== pokemon.team &&
        pkm.id !== pokemon.id
      ) {
        pkm.setPP(pkm.pp + 5)
        pkm.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pkm.skill,
          positionX: pkm.positionX,
          positionY: pkm.positionY
        })
      }
    })

    if (pokemon.items.has(Item.AQUA_EGG)) {
      pokemon.setPP(pokemon.pp + 20)
    }

    if (pokemon.items.has(Item.STAR_DUST)) {
      pokemon.addShield(Math.round(0.6 * pokemon.maxPP), pokemon, false)
      pokemon.count.starDustCount++
    }

    if (crit) {
      pokemon.onCritical(target, board)
    }

    if (target.status.magicBounce) {
      pokemon.status.triggerSilence(4000, pokemon, target, board)
      pokemon.handleSpecialDamage(
        target.speDef,
        board,
        AttackType.SPECIAL,
        target,
        false
      )
    }
  }
}

export class BlueFlareStrategy extends AttackStrategy {
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
    if (pokemon.effects.includes(Effect.BLAZE)) {
      multiplier = 1
    } else if (pokemon.effects.includes(Effect.VICTORY_STAR)) {
      multiplier = 2
    } else if (pokemon.effects.includes(Effect.DROUGHT)) {
      multiplier = 3
    } else if (pokemon.effects.includes(Effect.DESOLATE_LAND)) {
      multiplier = 4
    }
    damage += multiplier * 20

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
      }
    })
  }
}

export class FusionBoltStrategy extends AttackStrategy {
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
    if (pokemon.effects.includes(Effect.RISING_VOLTAGE)) {
      multiplier = 1
    } else if (pokemon.effects.includes(Effect.OVERDRIVE)) {
      multiplier = 2
    }
    damage += multiplier * 40

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
      }
    })
  }
}

export class BeatUpStrategy extends AttackStrategy {
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
      pokemon.simulation.addPokemon(
        houndour,
        coord.x,
        coord.y,
        pokemon.team,
        true
      )
    }
  }
}

export class PaydayStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 2 ? 60 : pokemon.stars === 3 ? 120 : 30

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death && pokemon.player) {
      pokemon.player.money += pokemon.stars
      pokemon.count.moneyCount++
    }
  }
}

export class MindBlownStrategy extends AttackStrategy {
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

export class SoftBoiledStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let shield = 30
    if (pokemon.stars == 2) {
      shield = 60
    } else if (pokemon.stars == 3) {
      shield = 120
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pokemon.skill,
          positionX: tg.positionX,
          positionY: tg.positionX,
          orientation: pokemon.orientation
        })
        tg.addShield(shield, pokemon, true)
        tg.status.clearNegativeStatus()
      }
    })
  }
}

export class EarthquakeStrategy extends AttackStrategy {
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

export class SongOfDesireStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration = 6000 * (1 + pokemon.ap / 100)

    target.status.triggerCharm(duration, target)
  }
}

export class SlackOffStrategy extends AttackStrategy {
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
    pokemon.handleHeal(pokemon.hp * healFactor, pokemon, 0.5)
    pokemon.status.triggerSleep(5000, pokemon)
  }
}

export class ConfusingMindStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration = 6000 * (1 + pokemon.ap / 100)

    target.status.triggerCharm(duration, target)
  }
}

export class KnowledgeThiefStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (CopyableAbility[target.skill]) {
      AbilityStrategy[target.skill].process(pokemon, state, board, target, crit)
    }
  }
}

export class WonderGuardStrategy extends AttackStrategy {
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

export class IllusionStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = pokemon.stars === 3 ? 70 : pokemon.stars === 2 ? 50 : 30
    pokemon.handleHeal(heal, pokemon, 0.5)
    if (target) {
      pokemon.index = target.index
      pokemon.atk = Math.max(pokemon.atk, target.atk)
      pokemon.range = target.range + (pokemon.items.has(Item.WIDE_LENS) ? 2 : 0)
      pokemon.def = Math.max(pokemon.def, target.def)
      pokemon.speDef = Math.max(pokemon.speDef, target.speDef)
    }
  }
}

export class JudgementStrategy extends AttackStrategy {
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

export class ElectricSurgeStrategy extends AttackStrategy {
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
        ally.types.includes(Synergy.ELECTRIC)
      ) {
        ally.addAttackSpeed(buff, true)
      }
    })
  }
}

export class PsychicSurgeStrategy extends AttackStrategy {
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
        ally.types.includes(Synergy.PSYCHIC)
      ) {
        ally.addAbilityPower(buff, true)
      }
    })
  }
}

export class MistySurgeStrategy extends AttackStrategy {
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
        pokemon.team == ally.team &&
        ally.types.includes(Synergy.FAIRY)
      ) {
        ally.addSpecialDefense(buff, true)
      }
    })
  }
}

export class GrassySurgeStrategy extends AttackStrategy {
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
        pokemon.team == ally.team &&
        ally.types.includes(Synergy.GRASS)
      ) {
        ally.addAttack(buff, true)
      }
    })
  }
}

export class ShadowBallStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 180 : pokemon.stars === 2 ? 90 : 45

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.setPP(target.pp - 15)
    target.count.manaBurnCount++
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.setPP(cell.value.pp - 15)
        cell.value.count.manaBurnCount++
      }
    })
  }
}

export class ChatterStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 10
    const confusionChance = max(1)(0.3 * (1 + pokemon.ap / 100))
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

export class CorruptedNatureStrategy extends AttackStrategy {
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
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerWound(5000, cell.value, pokemon, board)
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

export class CrabHammerStrategy extends AttackStrategy {
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

export class DiamondStormStrategy extends AttackStrategy {
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

export class DracoEnergyStrategy extends AttackStrategy {
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

export class DynamaxCannonStrategy extends AttackStrategy {
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

export class DynamicPunchStrategy extends AttackStrategy {
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

export class ElectroBoostStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    board.forEach((x, y, tg) => {
      if (
        tg &&
        pokemon.team == tg.team &&
        tg.types.includes(Synergy.ELECTRIC)
      ) {
        tg.status.triggerRuneProtect(5000)
      }
    })
  }
}

export class AuroraVeilStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const runeProtectDuration = 3000
    let shield = 5
    if (pokemon.stars === 2) {
      shield = 10
    }
    if (pokemon.stars === 3) {
      shield = 15
    }
    shield = Math.round(shield * (1 + pokemon.ap / 100))

    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team) {
        tg.addShield(shield, pokemon, false)
        tg.status.triggerRuneProtect(runeProtectDuration)
      }
    })
  }
}

export class AquaJetStrategy extends AttackStrategy {
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
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )
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

export class ElectroWebStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let steal = 15
    if (pokemon.stars == 2) {
      steal = 30
    } else if (pokemon.stars == 3) {
      steal = 60
    }
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.addAttackSpeed(-steal)
          pokemon.addAttackSpeed(steal)
        }
      })
  }
}

export class FireTrickStrategy extends AttackStrategy {
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

export class FlameChargeStrategy extends AttackStrategy {
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
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )
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

export class LeechSeedStrategy extends AttackStrategy {
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
    pokemon.handleHeal(heal, pokemon, 1)
    target.status.triggerPoison(duration, target, pokemon, board)
  }
}

export class LockOnStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.status.triggerArmorReduction(4000)
  }
}

export class PsychUpStrategy extends AttackStrategy {
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
    target.status.triggerSilence(duration, target, pokemon, board)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(duration, cell.value, pokemon, board)
      }
    })
  }
}

export class RazorWindStrategy extends AttackStrategy {
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
    target.status.triggerParalysis(7000, target)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(7000, cell.value)
      }
    })
  }
}

export class TwistingNetherStrategy extends AttackStrategy {
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

export class DarkVoidStrategy extends AttackStrategy {
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

export class OverheatStrategy extends AttackStrategy {
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
        let damage = 40
        if (tg.status.burn) {
          damage = Math.round(damage * 1.3)
        }
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class HypnosisStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestTarget = state.getFarthestTargetCoordinate(pokemon, board)
    if (farthestTarget) {
      const x = farthestTarget.x
      const y = farthestTarget.y
      let duration =
        pokemon.stars === 3 ? 6000 : pokemon.stars === 2 ? 4000 : 2000
      const tg = board.getValue(x, y)
      if (tg) {
        duration *= 1 + pokemon.ap / 200
        tg.status.triggerSleep(duration, tg)
      }
    }
  }
}

export class KingShieldStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 1000
        break
      case 2:
        timer = 2000
        break
      case 3:
        timer = 3000
        break
      default:
        break
    }
    pokemon.status.triggerProtect(timer)
    const farthestTarget = state.getFarthestTargetCoordinate(pokemon, board)
    if (farthestTarget) {
      const x = farthestTarget.x
      const y = farthestTarget.y

      const tg = board.getValue(x, y)

      if (tg) {
        pokemon.moveTo(x, y, board)
      }
    }
  }
}

export class PoisonJabStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = [30, 60, 90, 120][pokemon.stars - 1] ?? 30
    const farthestTarget = state.getFarthestTargetCoordinate(pokemon, board)
    if (farthestTarget) {
      const x = farthestTarget.x
      const y = farthestTarget.y

      const tg = board.getValue(x, y)

      if (tg) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        tg.status.triggerPoison(4000, tg, pokemon, board)
        pokemon.status.triggerPoison(4000, pokemon, pokemon, board)
        pokemon.moveTo(x, y, board)
      }
    }
  }
}

export class ExplosionStrategy extends AttackStrategy {
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

export class ClangorousSoulStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let buffAtk = 0
    let buffDef = 0
    switch (pokemon.stars) {
      case 1:
        buffAtk = 2
        buffDef = 1
        break
      case 2:
        buffAtk = 4
        buffDef = 2
        break
      case 3:
        buffAtk = 8
        buffDef = 4
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    pokemon.addAttack(buffAtk, true)
    pokemon.addDefense(buffDef, true)
    pokemon.addSpecialDefense(buffDef, true)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.addAttack(buffAtk, true)
        cell.value.addDefense(buffDef, true)
        cell.value.addSpecialDefense(buffDef, true)
      }
    })
  }
}

export class LiquidationStrategy extends AttackStrategy {
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
        reduce = 1
        break
      case 2:
        damage = 40
        reduce = 2
        break
      case 3:
        damage = 80
        reduce = 4
        break
      default:
        break
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addDefense(-reduce, true)
  }
}

export class BonemerangStrategy extends AttackStrategy {
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
        damage = 40
        break
      case 2:
        damage = 80
        break
      case 3:
        damage = 160
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

export class AuroraBeamStrategy extends AttackStrategy {
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
        if (pokemon.effects.includes(Effect.CHILLY)) {
          freezeChance = 0.1
        } else if (pokemon.effects.includes(Effect.FROSTY)) {
          freezeChance = 0.2
        } else if (pokemon.effects.includes(Effect.FREEZING)) {
          freezeChance = 0.3
        } else if (pokemon.effects.includes(Effect.SHEER_COLD)) {
          freezeChance = 0.4
        }
        if (chance(freezeChance)) {
          targetInLine.status.triggerFreeze(2000, target)
        }
      }
    })
  }
}

export class GrowlStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let d = 0
    switch (pokemon.stars) {
      case 1:
        d = 3000
        break
      case 2:
        d = 6000
        break
      case 3:
        d = 9000
        break
      default:
        break
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.status.triggerWound(d, tg, pokemon, board)
      }
    })
  }
}

export class RelicSongStrategy extends AttackStrategy {
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

export class DisarmingVoiceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let heal = 0
    switch (pokemon.stars) {
      case 1:
        heal = 10
        break
      case 2:
        heal = 20
        break
      case 3:
        heal = 40
        break
      default:
        break
    }
    heal = Math.round(heal * (1 + pokemon.ap / 200))
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team === tg.team && tg.id !== pokemon.id) {
        tg.setPP(tg.pp + heal)
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
export class HighJumpKickStrategy extends AttackStrategy {
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
    pokemon.setPP(target.pp)
    target.setPP(0)
    target.count.manaBurnCount++
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrassWhistleStrategy extends AttackStrategy {
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

export class TriAttackStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let duration = 2000,
      damage = 25
    if (pokemon.stars === 2) {
      duration = 3000
      damage = 50
    }
    if (pokemon.stars === 3) {
      duration = 5000
      damage = 100
    }
    target.status.triggerFreeze(duration, target)
    target.status.triggerWound(duration, target, pokemon, board)
    target.status.triggerBurn(duration, target, pokemon, board)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EchoStrategy extends AttackStrategy {
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

export class FutureSightStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

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

export class PetalDanceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let damage = 0
    let count = 0

    switch (pokemon.stars) {
      case 1:
        damage = 20
        count = 3
        break
      case 2:
        damage = 30
        count = 4
        break
      case 3:
        damage = 50
        count = 5
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && count > 0) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        count--
        tg.count.petalDanceCount++
      }
    })
  }
}

export class HyperVoiceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let damage = 0
    let confusion = 0

    switch (pokemon.stars) {
      case 1:
        damage = 50
        confusion = 1
        break
      case 2:
        damage = 100
        confusion = 2
        break
      case 3:
        damage = 200
        confusion = 3
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        tg.status.triggerConfusion(confusion * 1000, tg)
      }
    })
  }
}
export class ShadowCloneStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

    if (farthestCoordinate) {
      const p = PokemonFactory.createPokemonFromName(pokemon.name)
      pokemon.items.forEach((i) => {
        p.items.add(i)
      })
      const clone = pokemon.simulation.addPokemon(
        p,
        farthestCoordinate.x,
        farthestCoordinate.y,
        pokemon.team
      )
      clone.life = 0.8 * pokemon.life
      clone.addShield(30, clone, true)
      clone.isClone = true
    }
  }
}

export class VoltSwitchStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage =
      pokemon.stars === 4
        ? 180
        : pokemon.stars === 3
        ? 120
        : pokemon.stars === 2
        ? 120
        : 60
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

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

export class HeadSmashStrategy extends AttackStrategy {
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

export class RockSmashStrategy extends AttackStrategy {
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
    target.status.triggerSilence(s, target, pokemon, board)
  }
}

export class RockTombStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let damage = 30
    let debuff = 10
    if (pokemon.stars === 2) {
      damage = 60
      debuff = 20
    }
    if (pokemon.stars === 3) {
      damage = 120
      debuff = 40
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAttackSpeed(-debuff, false)
  }
}

export class RoarOfTimeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let candidate = pokemon
    board.forEach((x: number, y: number, pkm: PokemonEntity | undefined) => {
      if (
        pkm &&
        pokemon.team == pkm.team &&
        pkm.items.size > candidate.items.size &&
        !pkm.status.resurection
      ) {
        candidate = pkm
      }
    })

    candidate.status.resurection = true
  }
}

export class HealBlockStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 5000
        break
      case 2:
        timer = 10000
        break
      case 3:
        timer = 15000
        break
      default:
        break
    }
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerWound(timer, cell.value, pokemon, board)
      }
    })
  }
}

export class SpikeArmorStrategy extends AttackStrategy {
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

export class OriginPulseStrategy extends AttackStrategy {
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
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class SeedFlareStrategy extends AttackStrategy {
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
        tg.addSpecialDefense(-2, true)
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class NightmareStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let duration =
      pokemon.stars === 3 ? 8000 : pokemon.stars === 2 ? 4000 : 2000
    duration = Math.round(duration * (1 + pokemon.ap / 200))

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerPoison(duration, value, pokemon, board)
      }
    })
  }
}

export class BurnStrategy extends AttackStrategy {
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
        value.status.triggerBurn(duration, value, pokemon, board)
      }
    })
  }
}

export class SilenceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 2000
        break
      case 2:
        timer = 4000
        break
      case 3:
        timer = 8000
        break
      default:
        break
    }
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerSilence(timer, value, pokemon, board)
      }
    })
  }
}

export class PoisonStrategy extends AttackStrategy {
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
        enemy.status.triggerPoison(duration, enemy, pokemon, board)
      }
    }
  }
}

export class FreezeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let timer = 1000
    if (pokemon.stars === 2) {
      timer = 2000
    }
    if (pokemon.stars === 3) {
      timer = 3000
    }
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerFreeze(timer, value)
      }
    })
  }
}

export class BlizzardStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const freezeDuration = 3000
    const damage = 15
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

export class ProtectStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const duration = Math.round(5000 * (1 + pokemon.ap / 200))
    pokemon.status.triggerProtect(duration)
  }
}

export class SleepStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const timer = 2500
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

export class ConfusionStrategy extends AttackStrategy {
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
      target.status.triggerConfusion(timer, target)
    }
  }
}

export class FireBlastStrategy extends AttackStrategy {
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

export class SeismicTossStrategy extends AttackStrategy {
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

export class GuillotineStrategy extends AttackStrategy {
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
      pokemon.setPP(pokemon.maxPP)
    }
  }
}

export class RockSlideStrategy extends AttackStrategy {
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

    if (target.types.includes(Synergy.FLYING)) {
      damage = damage * 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WheelOfFireStrategy extends AttackStrategy {
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

    const coord = state.getFarthestTargetCoordinate(pokemon, board)

    if (coord) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        coord.x,
        coord.y
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

export class HeatWaveStrategy extends AttackStrategy {
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

export class HydroPumpStrategy extends AttackStrategy {
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

export class SolarBeamStrategy extends AttackStrategy {
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
      pokemon.setPP(pokemon.pp + 40)
    }
    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        if (pokemon.simulation.weather === Weather.SUN) {
          targetInLine.status.triggerBurn(3000, targetInLine, pokemon, board)
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

export class ThunderStrategy extends AttackStrategy {
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

export class DracoMeteorStrategy extends AttackStrategy {
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

export class BlazeKickStrategy extends AttackStrategy {
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

export class WishStrategy extends AttackStrategy {
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
        ally.handleHeal(heal, pokemon, 1)
        count -= 1
      }
    })
  }
}

export class CalmMindStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 1
    pokemon.addAttack(buff * pokemon.baseAtk, true)
  }
}

export class CosmicPowerStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const apGain = Math.round(20 * (1 + pokemon.ap / 100))
    board.forEach((x, y, ally) => {
      if (ally && ally.team === pokemon.team) {
        ally.addAbilityPower(apGain, false)
      }
    })
  }
}

export class IronDefenseStrategy extends AttackStrategy {
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
    pokemon.addDefense(buff, true)
    pokemon.addSpecialDefense(buff, true)
  }
}

export class SoakStrategy extends AttackStrategy {
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

    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.setPP(ally.pp + 10)
      }
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class IronTailStrategy extends AttackStrategy {
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
    pokemon.addDefense(buff, true)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class BlastBurnStrategy extends AttackStrategy {
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

export class ChargeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 0.2
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        pokemon.team == ally.team &&
        ally.types.includes(Synergy.ELECTRIC)
      ) {
        ally.addAttack(pokemon.baseAtk * buff, true)
        ally.addAttackSpeed(buff * 100, true)
      }
    })
  }
}

export class SmogStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = pokemon.stars === 3 ? 6 : pokemon.stars === 2 ? 4 : 2
    pokemon.addDefense(buff, true)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerPoison(3000, cell.value, pokemon, board)
      }
    })
  }
}

export class DischargeStrategy extends AttackStrategy {
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

export class DiveStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 60 : pokemon.stars === 2 ? 30 : 15
    const freezeDuration = 1500
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

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

export class SmokeScreenStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const duration = 2000
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordinateAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )

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
          cell.value.status.triggerBurn(duration, cell.value, pokemon, board)
          cell.value.status.triggerArmorReduction(duration)
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: pokemon.skill,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: cell.x,
            targetY: cell.y,
            orientation: pokemon.orientation
          })
        }
      })
    }
  }
}

export class BiteStrategy extends AttackStrategy {
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
        damage = 40
        break
      case 2:
        damage = 80
        break
      case 3:
        damage = 120
        break
      default:
        break
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.handleHeal(Math.floor(0.3 * damage), pokemon, 1)
  }
}

export class AppleAcidStrategy extends AttackStrategy {
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
    pokemon.addDefense(-3, true)
    pokemon.addSpecialDefense(-3, true)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class PresentStrategy extends AttackStrategy {
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
       300 damage: 10%
       heal 80HP: 20%
    */
    if (chance < 0.2) {
      target.handleHeal(80, pokemon, 0)
    } else if (chance < 0.6) {
      target.handleSpecialDamage(80, board, AttackType.SPECIAL, pokemon, crit)
    } else if (chance < 0.9) {
      target.handleSpecialDamage(150, board, AttackType.SPECIAL, pokemon, crit)
    } else {
      target.handleSpecialDamage(300, board, AttackType.SPECIAL, pokemon, crit)
    }
  }
}

export class SacredSwordStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 90
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class LeafBladeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, true)
    target.handleSpecialDamage(
      pokemon.atk,
      board,
      AttackType.SPECIAL,
      pokemon,
      true
    )
  }
}

export class WaterfallStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const shield = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    pokemon.addShield(shield, pokemon, true)
  }
}

export class XScissorStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit) // twice
  }
}

export class DragonTailStrategy extends AttackStrategy {
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
    pokemon.addDefense(pokemon.stars, true)
    pokemon.addSpecialDefense(pokemon.stars, true)
  }
}

export class DragonBreathStrategy extends AttackStrategy {
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

export class IcicleCrashStrategy extends AttackStrategy {
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

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
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

export class SteamEruptionStrategy extends AttackStrategy {
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

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerBurn(burnDuration, target, pokemon, board)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(burnDuration, cell.value, pokemon, board)
      }
    })
  }
}

export class RootStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let heal = 0

    switch (pokemon.stars) {
      case 1:
        heal = 20
        break
      case 2:
        heal = 30
        break
      case 3:
        heal = 40
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    pokemon.handleHeal(heal, pokemon, 1)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.handleHeal(heal, pokemon, 1)
      }
    })
  }
}

export class TormentStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let boost = 0

    switch (pokemon.stars) {
      case 1:
        boost = 20
        break
      case 2:
        boost = 40
        break
      case 3:
        boost = 60
        break
      default:
        break
    }
    pokemon.addAttackSpeed(boost, true)
    pokemon.cooldown = 500 / pokemon.atkSpeed
  }
}

export class StompStrategy extends AttackStrategy {
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

export class PaybackStrategy extends AttackStrategy {
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
    pokemon.handleHeal(damage, pokemon, 1)
  }
}

export class NightSlashStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 40
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3) {
      damage = 100
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    board.forEach((x: number, y: number, v: PokemonEntity | undefined) => {
      if (v && pokemon.team != v.team) {
        v.addDefense(-1, true)
      }
    })
  }
}

export class BugBuzzStrategy extends AttackStrategy {
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

export class StringShotStrategy extends AttackStrategy {
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

export class StickyWebStrategy extends AttackStrategy {
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

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerParalysis(4000, target)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
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

export class PoisonStingStrategy extends AttackStrategy {
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

export class LeechLifeStrategy extends AttackStrategy {
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

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.handleHeal(damage, pokemon, 1)

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.handleHeal(damage, pokemon, 1)
      }
    })
  }
}

export class HappyHourStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        buff = 2
        break
      case 2:
        buff = 5
        break
      case 3:
        buff = 8
        break
      default:
        break
    }
    buff = Math.round(buff * (1 + pokemon.ap / 100))
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addAttack(buff, false)
      }
    })
  }
}

export class TeleportStrategy extends AttackStrategy {
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
        pokemon.effects.push(Effect.TELEPORT_NEXT_ATTACK)
        break
      }
    }
  }
}

export class NastyPlotStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buff = 10
    pokemon.addAttack(buff, true)
  }
}

export class SpectralThiefStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )
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
      const boostAtk = min(0)(target.atk - target.baseAtk)
      const boostAtkSpeed = min(0)(target.atkSpeed - DEFAULT_ATK_SPEED)
      const boostDef = min(0)(target.def - target.baseSpeDef)
      const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
      const boostAP = target.ap

      target.atk = target.baseAtk
      target.def = target.baseDef
      target.speDef = target.baseSpeDef
      pokemon.addAttack(boostAtk, false)
      pokemon.addDefense(boostDef, false)
      pokemon.addSpecialDefense(boostSpeDef, false)
      pokemon.addAbilityPower(boostAP, false)
      pokemon.addAttackSpeed(boostAtkSpeed, false)
    }
  }
}

export class ThiefStrategy extends AttackStrategy {
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

    // update artificial synergy bonuses
    if (pokemon.effects.includes(Effect.DUBIOUS_DISC)) {
      pokemon.addAttack(4 * l, true)
      pokemon.addShield(20 * l, pokemon)
    }

    if (pokemon.effects.includes(Effect.LINK_CABLE)) {
      pokemon.addAttack(7 * l, true)
      pokemon.addShield(30 * l, pokemon)
    }

    if (pokemon.effects.includes(Effect.GOOGLE_SPECS)) {
      pokemon.addAttack(10 * l, true)
      pokemon.addShield(50 * l, pokemon)
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class StunSporeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let debuff = 0
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        debuff = 10
        damage = 5
        break
      case 2:
        debuff = 20
        damage = 10
        break
      case 3:
        debuff = 40
        damage = 20
        break
      default:
        break
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAttackSpeed(-debuff, false)
  }
}

export class MeteorMashStrategy extends AttackStrategy {
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
        damage = 50
        break
      case 3:
        damage = 70
        break
      default:
        break
    }

    pokemon.addAttack(5, true)
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

export class HurricaneStrategy extends AttackStrategy {
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
        targetInLine.status.triggerParalysis(4000, targetInLine)
      }
    })
  }
}

export class FakeTearsStrategy extends AttackStrategy {
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
        damage = 3
        break
      case 2:
        damage = 6
        break
      case 3:
        damage = 9
        break
      default:
        break
    }

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerArmorReduction(3000)
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

export class SparklingAriaStrategy extends AttackStrategy {
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
        cell.value.status.healBurn()
      }
    })
  }
}

export class DragonDartsStrategy extends AttackStrategy {
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
        damage = 25
        break
      case 3:
        damage = 50
        break
      default:
        break
    }

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
      pokemon.setPP(pokemon.pp + 40)
    }
  }
}

export class MetronomeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const skill = pickRandomIn(
      (Object.keys(Ability) as Ability[]).filter((a) => CopyableAbility[a])
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

    AbilityStrategy[skill].process(pokemon, state, board, target, crit)
  }
}

export class SkyAttackStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )
    const damage = 120
    if (farthestCoordinate) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      pokemon.status.triggerProtect(500)
    }
  }
}

export class AgilityStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let boost = 0

    switch (pokemon.stars) {
      case 1:
        boost = 10
        break
      case 2:
        boost = 20
        break
      case 3:
        boost = 30
        break
    }

    pokemon.addAttackSpeed(boost, true)
    pokemon.cooldown = 0
  }
}

export class SpiritShackleStrategy extends AttackStrategy {
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
        targetInLine.status.triggerWound(4000, targetInLine, pokemon, board)
      }
    })
  }
}

export class WaterShurikenStrategy extends AttackStrategy {
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

export class ShadowSneakStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 60
    const damageType = target.status.silence
      ? AttackType.TRUE
      : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon, crit)
  }
}

export class PlasmaFistStrategy extends AttackStrategy {
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
    pokemon.handleHeal(damage * 0.25, pokemon, 1)
  }
}

export class ForecastStrategy extends AttackStrategy {
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
        p.addShield(10, pokemon, true)
        if (pokemon.name === Pkm.CASTFORM_SUN) {
          p.addAttack(3, true)
        }
        if (pokemon.name === Pkm.CASTFORM_RAIN) {
          p.setPP(p.pp + Math.round(20 * (1 + pokemon.ap / 100)))
        }
        if (pokemon.name === Pkm.CASTFORM_HAIL) {
          p.addDefense(2, true)
          p.addSpecialDefense(2, true)
        }
      }
    })
  }
}

export class MachPunchStrategy extends AttackStrategy {
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

export class UppercutStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 80
    if (pokemon.def > target.def) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MawashiGeriStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = 80
    if (pokemon.atk > target.atk) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class TripleKickStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = 50

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
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
            crit
          )
        }
      }
    })
  }
}

export class GeomancyStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttack(15, true)
    pokemon.addSpecialDefense(5, true)
    pokemon.addAttackSpeed(30, false)
  }
}

export class DeathWingStrategy extends AttackStrategy {
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
      pokemon.handleHeal(Math.round(0.75 * takenDamage), pokemon, 0)
    }
  }
}

export class MimicStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    if (CopyableAbility[target.skill]) {
      AbilityStrategy[target.skill].process(pokemon, state, board, target, crit)
    }
  }
}

export class HexStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    let damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    if (
      target.status.burn ||
      target.status.confusion ||
      target.status.freeze ||
      target.status.paralysis ||
      target.status.poisonStacks > 0 ||
      target.status.silence ||
      target.status.sleep ||
      target.status.wound
    ) {
      damage = damage * 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrowthStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)

    const attackBuff = Math.floor(10 * (1 + pokemon.ap / 100))
    pokemon.addAttack(attackBuff)

    if (pokemon.simulation.weather === Weather.SUN) {
      pokemon.addAttack(attackBuff) // grows twice as fast if sunny weather
    }
  }
}

export class HealOrderStrategy extends AttackStrategy {
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
          cell.value.handleHeal(damage, pokemon, 1)
        }
      }
    })
  }
}

export class ShellTrapStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    target.status.triggerSilence(3000, target, pokemon, board)
    target.setPP(target.pp - 40)

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.setPP(cell.value.pp - 40)
      }
    })
  }
}

export class DigStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10

    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

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

export class FireSpinStrategy extends AttackStrategy {
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
      damage = 100
    }

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerBurn(3000, target, pokemon, board)
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(3000, target, pokemon, board)
      }
    })
  }
}

export class SearingShotStrategy extends AttackStrategy {
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
        cell.value.status.triggerBurn(3000, target, pokemon, board)
      }
    })
  }
}

export class PeckStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 30 : pokemon.stars === 2 ? 20 : 10
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SplashStrategy extends AttackStrategy {
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

export class CounterStrategy extends AttackStrategy {
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

export class PoisonPowderStrategy extends AttackStrategy {
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

    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.status.triggerPoison(5000, target, pokemon, board)
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

export class SilverWindStrategy extends AttackStrategy {
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

    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

    pokemon.addAttack(1)
    pokemon.addDefense(1)
    pokemon.addSpecialDefense(1)
    pokemon.addAttackSpeed(10)
    pokemon.addAbilityPower(10)

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

export class IcyWindStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    const debuff = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAttackSpeed(-debuff)
  }
}

export class GigatonHammerStrategy extends AttackStrategy {
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
    pokemon.status.triggerSilence(6000, pokemon, pokemon, board)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AcrobaticsStrategy extends AttackStrategy {
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

export class AbsorbStrategy extends AttackStrategy {
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
    pokemon.handleHeal(damage * 0.1, pokemon, 1)

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team === pokemon.team) {
        cell.value.handleHeal(damage * 0.1, pokemon, 1)
      }
    })
  }
}

export class RolloutStrategy extends AttackStrategy {
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

    pokemon.addDefense(defenseBoost, true)
    target.handleSpecialDamage(
      multiplier * pokemon.def,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class ThrashStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    pokemon.addAttack(Math.ceil(1.1 * pokemon.baseAtk), false)
    pokemon.status.triggerConfusion(3000, pokemon)
  }
}

export class MagmaStormStrategy extends AttackStrategy {
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

export class SlashingClawStrategy extends AttackStrategy {
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
    target.status.triggerWound(5000, target, pokemon, board)
  }
}

export class EruptionStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 60 : 30
    const numberOfProjectiles =
      pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 30 : 20

    for (let i = 0; i < numberOfProjectiles; i++) {
      const x = randomBetween(0, board.rows)
      const y = randomBetween(0, board.columns)
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
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerBurn(5000, target, pokemon, board)
  }
}

export class MistBallStrategy extends AttackStrategy {
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
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.addAbilityPower(-30)
      }
    })

    pokemon.simulation.room.clock.setTimeout(() => {
      effectInLine(board, pokemon, target, (targetInLine) => {
        if (targetInLine != null && targetInLine.team !== pokemon.team) {
          targetInLine.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          targetInLine.addAbilityPower(-30)
        }
      })
    }, 1000)
  }
}

export class LusterPurgeStrategy extends AttackStrategy {
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
      if (targetInLine != null && targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        targetInLine.addSpecialDefense(-3)
      }
    })

    pokemon.simulation.room.clock.setTimeout(() => {
      effectInLine(board, pokemon, target, (targetInLine) => {
        if (targetInLine != null && targetInLine.team !== pokemon.team) {
          targetInLine.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          targetInLine.addSpecialDefense(-3)
        }
      })
    }, 1000)
  }
}

export class MudBubbleStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const heal = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    pokemon.handleHeal(heal, pokemon, 1)
  }
}

export class LinkCableStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestTargetCoordinate = state.getFarthestTargetCoordinate(
      pokemon,
      board
    )
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

    if (farthestCoordinate && farthestTargetCoordinate) {
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board)
      pokemon.targetX = farthestTargetCoordinate.x
      pokemon.targetY = farthestTargetCoordinate.y
    }

    pokemon.simulation.room.clock.setTimeout(() => {
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
  }
}

export class MagicBounceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const timer =
      pokemon.stars === 3 ? 12000 : pokemon.stars === 2 ? 6000 : 3000
    pokemon.status.triggerMagicBounce(timer)
  }
}

export class ShellSmashStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 1 ? 15 : 30
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
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
    pokemon.addAbilityPower(20, false)
    pokemon.addAttack(2, false)
    pokemon.addAttackSpeed(20, false)
    pokemon.addDefense(-1, false)
    pokemon.addSpecialDefense(-1, false)
  }
}

export class HelpingHandStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const buffs = pokemon.stars === 3 ? 6 : pokemon.stars === 2 ? 4 : 2
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
    for (let i = 0; i < buffs; i++) {
      const ally = allies[i]?.pkm
      if (ally) {
        ally.status.doubleDamage = true
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

export class AstralBarrageStrategy extends AttackStrategy {
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
      setTimeout(() => {
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
    }
  }
}

export class PyroBallStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10

    const farthestCoordinate = state.getFarthestTargetCoordinate(pokemon, board)
    if (farthestCoordinate) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y,
        orientation: pokemon.orientation
      })

      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.status.triggerBurn(2000, cell.value, pokemon, board)
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

export class WhirlpoolStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const farthestCoordinate = state.getFarthestTargetCoordinate(pokemon, board)

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
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
              AttackType.PHYSICAL,
              pokemon,
              crit
            )
          }
          break
        }
      }
    }
  }
}

export class AnchorShotStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, state, board, target, crit)
    const damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    const farthestCoordinate = state.getFarthestTargetCoordinate(pokemon, board)
    if (farthestCoordinate) {
      const farthestTarget = board.getValue(
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      if (farthestTarget) {
        const adjacentCells = board.getAdjacentCells(
          pokemon.positionX,
          pokemon.positionY
        )
        const potentials = shuffleArray(
          adjacentCells
            .filter((v) => v.value === undefined)
            .map((v) => ({ x: v.x, y: v.y }))
        )
        if (potentials.length > 0) {
          const potential = potentials[0]
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
            skill: Ability.ANCHOR_SHOT,
            targetX: farthestTarget.positionX,
            targetY: farthestTarget.positionY
          })
          farthestTarget.moveTo(potential.x, potential.y, board)
          farthestTarget.handleSpecialDamage(
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
}
