import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import { AttackType } from "../types/enum/Game"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { Synergy } from "../types/enum/Synergy"
import { Ability, AbilityStrategy } from "../types/enum/Ability"
import PokemonFactory from "../models/pokemon-factory"
import { Pkm } from "../types/enum/Pokemon"

export class AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    pokemon.setMana(0)
    pokemon.count.ult += 1

    if (pokemon.types.includes(Synergy.SOUND)) {
      let atk = 0
      if (pokemon.effects.includes(Effect.LARGO)) {
        atk += 3
      } else if (pokemon.effects.includes(Effect.ALLEGRO)) {
        atk += 5
      } else if (pokemon.effects.includes(Effect.PRESTO)) {
        atk += 7
      }
      if (atk > 0) {
        board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
          if (
            tg &&
            pokemon.team == tg.team &&
            tg.types.includes(Synergy.SOUND)
          ) {
            tg.count.soundCount++
            tg.addAttack(atk, true)
          }
        })
      }
    }

    if (pokemon.items.has(Item.AQUA_EGG)) {
      pokemon.setMana(pokemon.mana + 20)
    }
  }
}

export class BlueFlareStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    damage += multiplier * 25

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class FusionBoltStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 50
    let multiplier = 0
    if (pokemon.effects.includes(Effect.EERIE_IMPULSE)) {
      multiplier = 1
    } else if (pokemon.effects.includes(Effect.RISING_VOLTAGE)) {
      multiplier = 2
    } else if (pokemon.effects.includes(Effect.OVERDRIVE)) {
      multiplier = 3
    }
    damage += multiplier * 30

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class BeatUpStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    for (let i = 0; i < pokemon.stars; i++) {
      const houndour = PokemonFactory.createPokemonFromName(Pkm.HOUNDOUR)
      const coord = pokemon.simulation.getFirstAvailablePlaceOnBoard(true)
      pokemon.simulation.addPokemon(houndour, coord.x, coord.y, pokemon.team)
    }
  }
}

export class PaydayStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.stars === 2 ? 60 : pokemon.stars === 3 ? 120 : 30

    const victim = target.handleSpellDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon
    )
    if (victim && pokemon.team === 0 && pokemon.simulation.player) {
      pokemon.simulation.player.money += pokemon.stars
      pokemon.count.moneyCount++
    }
  }
}

export class MindBlownStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    target.count.mindBlownCount++
    target.handleSpellDamage(pokemon.life / 2, board, AttackType.TRUE, pokemon)
  }
}

export class SoftBoiledStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let shield = 30
    if (pokemon.stars == 2) {
      shield = 60
    } else if (pokemon.stars == 3) {
      shield = 120
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        tg.handleShield(shield, pokemon)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 30
    if (pokemon.stars == 2) {
      damage = 60
    } else if (pokemon.stars == 3) {
      damage = 120
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (
        (tg && pokemon.team != tg.team && target.positionY == y) ||
        (tg && pokemon.team != tg.team && target.positionX == x)
      ) {
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let duration = 3000
    if (pokemon.stars == 2) {
      duration = 6000
    } else if (pokemon.stars == 3) {
      duration = 12000
    }
    target.status.triggerConfusion(duration, target)
  }
}

export class ConfusingMindStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    let damage = 20
    let confusion = 1.5
    if (pokemon.stars == 2) {
      damage = 40
      confusion = 3
    } else if (pokemon.stars == 3) {
      damage = 80
      confusion = 6
    }
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
        cell.value.status.triggerConfusion(confusion * 1000, cell.value)
      }
    })
  }
}

export class KnowledgeThiefStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    if (target.skill !== Ability.KNOWLEDGE_THIEF) {
      AbilityStrategy[target.skill].process(pokemon, state, board, target)
    }
  }
}

export class WonderGuardStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
  }
}

export class SynchroStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
  }
}

export class ProteanStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
  }
}

export class ElectricSurgeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
  }
}

export class PsychicSurgeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
  }
}

export class ShadowBallStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.stars === 3 ? 300 : pokemon.stars === 2 ? 100 : 50

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.setMana(target.mana - 30)
    target.count.manaBurnCount++
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
        cell.value.setMana(cell.value.mana - 30)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 5
    let chance = 0.2

    if (pokemon.stars === 2) {
      damage = 10
      chance = 0.3
    } else if (pokemon.stars === 3) {
      damage = 15
      chance = 0.4
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
        if (Math.random() < chance) {
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 10
    if (pokemon.stars == 2) {
      damage = 20
    } else if (pokemon.stars == 3) {
      damage = 40
    }
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerWound(6000, cell.value, board)
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class CrabHammerStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 30
    if (pokemon.stars == 2) {
      damage = 60
    } else if (pokemon.stars == 3) {
      damage = 120
    }
    if (target.life / target.hp < 0.3) {
      damage = target.life
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class DiamondStormStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 3
    if (pokemon.stars === 2) {
      buff = 6
    } else if (pokemon.stars === 3) {
      buff = 9
    }
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    pokemon.addDefense(buff, true)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team === pokemon.team) {
        cell.value.addDefense(buff, true)
      }
    })
  }
}

export class DracoEnergyStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    target.handleSpellDamage(pokemon.life, board, AttackType.SPECIAL, pokemon)
  }
}

export class DynamaxCannonStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && x == target.positionX) {
        tg.handleSpellDamage(
          Math.ceil(tg.life * 0.8),
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class ElectroBoostStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let duration = 1250
    if (pokemon.stars === 2) {
      duration = 2500
    } else if (pokemon.stars === 3) {
      duration = 3500
    }
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team) {
        tg.status.triggerRuneProtect(duration)
      }
    })
  }
}

export class AquaJetStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
    } else if (pokemon.stars == 3) {
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
        if (cell.value && cell.value != pokemon) {
          cell.value.handleSpellDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
        }
      })

      target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)

      board.swapValue(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      pokemon.positionX = farthestCoordinate.x
      pokemon.positionY = farthestCoordinate.y
    }
  }
}

export class ElectroWebStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
          cell.value.handleAttackSpeed(-steal)
          pokemon.handleAttackSpeed(steal)
        }
      })
  }
}

export class FireTrickStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
    } else if (pokemon.stars == 3) {
      damage = 80
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    const teleportationCell = board.getTeleportationCell(
      target.positionX,
      target.positionY
    )
    if (teleportationCell) {
      board.swapValue(
        target.positionX,
        target.positionY,
        teleportationCell.row,
        teleportationCell.column
      )
      target.positionX = teleportationCell.row
      target.positionY = teleportationCell.column
    }
  }
}

export class FlameChargeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
    } else if (pokemon.stars == 3) {
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
        if (cell.value && cell.value != pokemon) {
          cell.value.handleSpellDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
        }
      })

      target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)

      board.swapValue(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      pokemon.positionX = farthestCoordinate.x
      pokemon.positionY = farthestCoordinate.y
    }
  }
}

export class LeechSeedStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let duration = 3000
    let heal = 10
    if (pokemon.stars == 2) {
      duration = 6000
      heal = 20
    } else if (pokemon.stars == 3) {
      duration = 6000
      heal = 40
    }
    pokemon.handleHeal(heal, pokemon, true)
    target.status.triggerPoison(duration, target, pokemon, board)
  }
}

export class LockOnStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    target.status.triggerArmorReduction(8000)
  }
}

export class PsychUpStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 10
    let duration = 2000
    if (pokemon.stars == 2) {
      damage = 20
      duration = 4000
    } else if (pokemon.stars == 3) {
      damage = 80
      duration = 8000
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.status.triggerSilence(duration, target, board)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(duration, cell.value, board)
      }
    })
  }
}

export class RazorWindStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSmoke(7000, cell.value)
      }
    })
  }
}

export class TwistingNeitherStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2
    )
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpellDamage(80, board, AttackType.SPECIAL, pokemon)
        const teleportationCell = board.getTeleportationCell(
          cell.value.positionX,
          cell.value.positionY
        )
        if (teleportationCell) {
          board.swapValue(
            cell.value.positionX,
            cell.value.positionY,
            teleportationCell.row,
            teleportationCell.column
          )
          cell.value.positionX = teleportationCell.row
          cell.value.positionY = teleportationCell.column
        } else {
          console.log("ERROR: unable to teleport pokemon")
        }
      }
    })
  }
}
export class KingShieldStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 1000
        break
      case 2:
        timer = 2000
        break
      case 3:
        timer = 4000
        break
      default:
        break
    }
    pokemon.status.triggerProtect(timer)
    const farthestTarget = state.getFarthestTargetCoordinate(pokemon, board)
    if (farthestTarget) {
      const x = farthestTarget.x
      const y = farthestTarget.y
      const oldX = pokemon.positionX
      const oldY = pokemon.positionY

      const tg = board.getValue(x, y)

      if (tg) {
        tg.positionX = oldX
        tg.positionY = oldY
      }
      board.swapValue(pokemon.positionX, pokemon.positionY, x, y)
      pokemon.positionX = x
      pokemon.positionY = y
    }
  }
}

export class ExplosionStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })

    pokemon.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class ClangorousSoulStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.addDefense(-reduce, true)
  }
}

export class BonemerangStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && x == target.positionX) {
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class GrowlStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let d = 0
    switch (pokemon.stars) {
      case 1:
        d = 4000
        break
      case 2:
        d = 8000
        break
      case 3:
        d = 16000
        break
      default:
        break
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.status.triggerWound(d, tg, board)
      }
    })
  }
}

export class RelicSongStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let d = 0
    switch (pokemon.stars) {
      case 1:
        d = 1000
        break
      case 2:
        d = 2000
        break
      case 3:
        d = 4000
        break
      default:
        break
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.status.triggerSleep(d, tg)
      }
    })
  }
}

export class DisarmingVoiceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        tg.setMana(tg.mana + heal)
      }
    })
  }
}
export class HighJumpKickStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    pokemon.setMana(target.mana)
    target.setMana(0)
    target.count.manaBurnCount++
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class GrassWhistleStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let duration = 0
    switch (pokemon.stars) {
      case 1:
        duration = 2000
        break
      case 2:
        duration = 4000
        break
      case 3:
        duration = 8000
        break
      default:
        break
    }
    target.status.triggerFreeze(duration, target)
    target.status.triggerWound(duration, target, board)
    target.status.triggerBurn(duration, target, pokemon, board)
  }
}

export class EchoStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    let damage = 0
    let additional = 0

    switch (pokemon.stars) {
      case 1:
        damage = 3
        additional = 1
        break
      case 2:
        damage = 6
        additional = 2
        break
      case 3:
        damage = 9
        additional = 4
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpellDamage(
          damage + pokemon.echo * additional,
          board,
          AttackType.SPECIAL,
          pokemon
        )
      }
    })

    pokemon.echo++
  }
}

export class PetalDanceStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    let damage = 0
    let count = 0

    switch (pokemon.stars) {
      case 1:
        damage = 30
        count = 2
        break
      case 2:
        damage = 60
        count = 3
        break
      case 3:
        damage = 120
        count = 4
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && count > 0) {
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

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
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const farthestCoordinate = state.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      board
    )

    if (farthestCoordinate) {
      const clone = pokemon.simulation.addPokemonEntity(
        pokemon,
        farthestCoordinate.x,
        farthestCoordinate.y,
        pokemon.team
      )
      clone.life = pokemon.life
    }
  }
}

export class VoltSwitchStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

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
        if (cell.value && cell.value != pokemon) {
          cell.value.handleSpellDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
        }
      })

      target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)

      board.swapValue(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      pokemon.positionX = farthestCoordinate.x
      pokemon.positionY = farthestCoordinate.y
    }
  }
}

export class HeadSmashStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    let d = 0
    let recoil = 0
    switch (pokemon.stars) {
      case 1:
        d = 40
        recoil = 5
        break
      case 2:
        d = 80
        recoil = 10
        break
      case 3:
        d = 150
        recoil = 15
        break
      default:
        break
    }
    if (target.status.sleep || target.status.freeze) {
      target.handleSpellDamage(target.life, board, AttackType.TRUE, pokemon)
    } else {
      target.handleSpellDamage(d, board, AttackType.SPECIAL, pokemon)
    }
    pokemon.handleSpellDamage(recoil, board, AttackType.TRUE, pokemon)
  }
}

export class RockSmashStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

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

    target.handleSpellDamage(d, board, AttackType.SPECIAL, pokemon)
    target.status.triggerSilence(s, target, board)
  }
}

export class RockTombStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    let factor = 0
    switch (pokemon.stars) {
      case 1:
        factor = 30
        break
      case 2:
        factor = 60
        break
      case 3:
        factor = 120
        break
      default:
        break
    }

    target.handleSpellDamage(factor, board, AttackType.SPECIAL, pokemon)
    target.handleAttackSpeed(-factor)
  }
}

export class RoarOfTimeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

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
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

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
        cell.value.status.triggerWound(timer, cell.value, board)
      }
    })
  }
}

export class OriginPulseStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 60

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class SeedFlareStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 30

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.addSpecialDefense(-2, true)
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class NightmareStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
        value.status.triggerPoison(timer, value, pokemon, board)
      }
    })
  }
}

export class BurnStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 5000
        break
      case 2:
        timer = 10000
        break
      case 3:
        timer = 20000
        break
      default:
        break
    }
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerBurn(timer, value, pokemon, board)
        value.status.triggerWound(timer, value, board)
      }
    })
  }
}

export class SilenceStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
        value.status.triggerSilence(timer, value, board)
      }
    })
  }
}

export class PoisonStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 4000
        break
      case 2:
        timer = 8000
        break
      case 3:
        timer = 16000
        break
      default:
        break
    }
    target.status.triggerPoison(timer, target, pokemon, board)
  }
}

export class FreezeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 1000
        break
      case 2:
        timer = 2000
        break
      case 3:
        timer = 4000
        break
      default:
        break
    }
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerFreeze(timer, value)
      }
    })
  }
}

export class ProtectStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 3000
        break
      case 2:
        timer = 5000
        break
      case 3:
        timer = 7000
        break
      default:
        break
    }
    pokemon.status.triggerProtect(timer)
  }
}

export class SleepStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 3000
        break
      case 2:
        timer = 5000
        break
      case 3:
        timer = 10000
        break
      default:
        break
    }
    target.status.triggerSleep(timer, target)
  }
}

export class ConfusionStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    switch (pokemon.stars) {
      case 1:
        timer = 3000
        break
      case 2:
        timer = 6000
        break
      case 3:
        timer = 12000
        break
      default:
        break
    }

    target.status.triggerConfusion(timer, target)
  }
}

export class FireBlastStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class SeismicTossStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team == value.team) {
        damage += pokemon.stars
      }
    })
    damage = damage * 5
    target.handleSpellDamage(damage, board, AttackType.TRUE, pokemon)
  }
}

export class GuillotineStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.atk * pokemon.stars
    const victim = target.handleSpellDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon
    )
    if (victim) {
      pokemon.setMana(pokemon.maxMana)
    }
  }
}

export class RockSlideStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    if (target.types.includes(Synergy.FLYING)) {
      damage = damage * 2
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class WheelOfFireStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value != pokemon) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class HeatWaveStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    const secondTarget = board.getValue(target.positionX, target.positionY + 1)
    const thirdTarget = board.getValue(target.positionX, target.positionY + 2)
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    }
    if (thirdTarget && thirdTarget != pokemon) {
      thirdTarget.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    }
  }
}

export class HydroPumpStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    const secondTarget = board.getValue(target.positionX, target.positionY + 1)
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    }
  }
}

export class ThunderStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class DracoMeteorStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class BlazeKickStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class WishStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const heal = 50
    let count = pokemon.stars

    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        pokemon.team == ally.team &&
        count > 0 &&
        ally.life < ally.hp
      ) {
        ally.handleHeal(heal, pokemon, true)
        count -= 1
      }
    })
  }
}

export class CalmMindStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        buff = 0.5
        break
      case 2:
        buff = 1
        break
      case 3:
        buff = 2
        break
      default:
        break
    }

    pokemon.addAttack(buff * pokemon.baseAtk, true)
  }
}

export class IronDefenseStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        buff = 3
        break
      case 2:
        buff = 6
        break
      case 3:
        buff = 12
        break
      default:
        break
    }
    pokemon.addDefense(buff, true)
    pokemon.addSpecialDefense(buff, true)
  }
}

export class SoakStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
        ally.setMana(ally.mana + 10)
      }
    })

    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class IronTailStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        damage = 20
        buff = 1
        break
      case 2:
        damage = 40
        buff = 3
        break
      case 3:
        damage = 80
        buff = 5
        break
      default:
        break
    }
    pokemon.addDefense(buff, true)
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class BlastBurnStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class ChargeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        buff = 0.1
        break
      case 2:
        buff = 0.2
        break
      case 3:
        buff = 0.4
        break
      default:
        break
    }

    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        pokemon.team == ally.team &&
        ally.types.includes(Synergy.ELECTRIC)
      ) {
        ally.addAttack(pokemon.baseAtk * buff, true)
      }
    })
  }
}

export class DischargeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 40
        break
      case 2:
        damage = 60
        break
      case 3:
        damage = 80
        break
      default:
        break
    }

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class DiveStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.stars === 3 ? 40 : pokemon.stars === 2 ? 20 : 10
    const duration =
      pokemon.stars === 3 ? 6000 : pokemon.stars === 2 ? 3000 : 1500
    const mostSurroundedCoordinate =
      state.getMostSurroundedCoordianteAvailablePlace(pokemon, board)

    if (mostSurroundedCoordinate) {
      board.swapValue(
        pokemon.positionX,
        pokemon.positionY,
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y
      )
      pokemon.positionX = mostSurroundedCoordinate.x
      pokemon.positionY = mostSurroundedCoordinate.y

      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpellDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
          cell.value.status.triggerFreeze(duration, cell.value)
        }
      })
    }
  }
}

export class BiteStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.handleHeal(Math.floor(damage / 2), pokemon, true)
  }
}

export class AppleAcidStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.handleHeal(Math.floor(damage / 2), pokemon)
  }
}

export class DragonTailStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.addDefense(pokemon.stars, true)
    pokemon.addSpecialDefense(pokemon.stars, true)
  }
}

export class DragonBreathStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target.handleSpellDamage(damage, board, AttackType.TRUE, pokemon)
    const secondTarget = board.getValue(target.positionX, target.positionY + 1)
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleSpellDamage(damage, board, AttackType.TRUE, pokemon)
    }
  }
}

export class IcicleCrashStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class SteamEruptionStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
        cell.value.status.triggerBurn(3000, cell.value, pokemon, board)
      }
    })
  }
}

export class RootStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    pokemon.handleHeal(heal, pokemon, true)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.handleHeal(heal, pokemon, true)
      }
    })
  }
}

export class TormentStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let boost = 1

    switch (pokemon.stars) {
      case 1:
        boost = 20
        break
      case 2:
        boost = 30
        break
      case 3:
        boost = 60
        break
      default:
        break
    }
    pokemon.handleAttackSpeed(boost)
  }
}

export class StompStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.atk * pokemon.stars * 2
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class DarkPulseStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 30
        break
      case 2:
        damage = 50
        break
      case 3:
        damage = 90
        break
      default:
        break
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.handleHeal(damage, pokemon, true)
  }
}

export class NightSlashStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0

    switch (pokemon.stars) {
      case 1:
        damage = 40
        break
      case 2:
        damage = 60
        break
      case 3:
        damage = 100
        break
      default:
        break
    }

    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)

    board.forEach((x: number, y: number, v: PokemonEntity | undefined) => {
      if (v && pokemon.team != v.team) {
        v.addDefense(-1, true)
      }
    })
  }
}

export class BugBuzzStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class PoisonStingStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    if (pokemon.status.poison) {
      damage = damage * 2
    }

    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class LeechLifeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
        pokemon.handleHeal(damage, pokemon, true)
      }
    })
  }
}

export class HappyHourStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        buff = 3
        break
      case 2:
        buff = 6
        break
      case 3:
        buff = 9
        break
      default:
        break
    }
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addAttack(buff, true)
      }
    })
  }
}

export class TeleportStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    pokemon.addAttack(pokemon.stars, true)

    const potentialCells = [
      [0, 0],
      [0, 5],
      [7, 5],
      [7, 0]
    ]
    this.shuffleArray(potentialCells)

    for (let i = 0; i < potentialCells.length; i++) {
      const entity = board.getValue(potentialCells[i][0], potentialCells[i][1])
      if (entity === undefined) {
        board.swapValue(
          pokemon.positionX,
          pokemon.positionY,
          potentialCells[i][0],
          potentialCells[i][1]
        )
        pokemon.positionX = potentialCells[i][0]
        pokemon.positionY = potentialCells[i][1]
        break
      }
    }
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }
}

export class NastyPlotStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 0
    switch (pokemon.stars) {
      case 1:
        buff = 5
        break
      case 2:
        buff = 10
        break
      case 3:
        buff = 20
        break
      default:
        break
    }
    pokemon.addAttack(buff, true)
  }
}

export class ThiefStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 5
        break
      case 2:
        damage = 10
        break
      case 3:
        damage = 20
        break
      default:
        break
    }
    const l = target.items.size
    target.items.forEach((item) => {
      if (pokemon.items.size < 3) {
        pokemon.items.add(item)
      }
      target.items.delete(item)
    })

    if (pokemon.effects.includes(Effect.HONE_CLAWS)) {
      pokemon.addAttack(4 * l, true)
      pokemon.handleShield(20 * l, pokemon)
    }

    if (pokemon.effects.includes(Effect.ASSURANCE)) {
      pokemon.addAttack(7 * l, true)
      pokemon.handleShield(30 * l, pokemon)
    }

    if (pokemon.effects.includes(Effect.BEAT_UP)) {
      pokemon.addAttack(10 * l, true)
      pokemon.handleShield(50 * l, pokemon)
    }

    // pokemon.simulation.applyItemsEffects(pokemon);
    // target.simulation.applyItemsEffects(target);
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class StunSporeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let debuff = 0
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        debuff = 50
        damage = 5
        break
      case 2:
        debuff = 100
        damage = 10
        break
      case 3:
        debuff = 200
        damage = 20
        break
      default:
        break
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.handleAttackSpeed(-debuff)
  }
}

export class MeteorMashStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
        cell.value.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class HurricaneStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 0
    switch (pokemon.stars) {
      case 1:
        damage = 10
        break
      case 2:
        damage = 20
        break
      case 3:
        damage = 30
        break
      default:
        break
    }
    target.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    const secondTarget = board.getValue(target.positionX, target.positionY + 1)
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleSpellDamage(damage, board, AttackType.SPECIAL, pokemon)
    }
  }
}

export class MetronomeStrategy extends AttackStrategy {
  constructor() {
    super()
  }

  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const skills = [
      FireBlastStrategy,
      WheelOfFireStrategy,
      SeismicTossStrategy,
      GuillotineStrategy,
      RockSlideStrategy,
      HeatWaveStrategy,
      ThunderStrategy,
      HydroPumpStrategy,
      DracoMeteorStrategy,
      BlazeKickStrategy,
      WishStrategy,
      CalmMindStrategy,
      IronDefenseStrategy,
      SoakStrategy,
      IronTailStrategy,
      BlastBurnStrategy,
      ChargeStrategy,
      DischargeStrategy,
      BiteStrategy,
      DragonTailStrategy,
      DragonBreathStrategy,
      IcicleCrashStrategy,
      RootStrategy,
      TormentStrategy,
      StompStrategy,
      DarkPulseStrategy,
      NightSlashStrategy,
      BugBuzzStrategy,
      PoisonStingStrategy,
      LeechLifeStrategy,
      HappyHourStrategy,
      TeleportStrategy,
      NastyPlotStrategy,
      ThiefStrategy,
      StunSporeStrategy,
      MeteorMashStrategy,
      HurricaneStrategy,
      BurnStrategy,
      SleepStrategy,
      FreezeStrategy,
      ConfusionStrategy,
      ProtectStrategy,
      PoisonStrategy,
      SilenceStrategy,
      OriginPulseStrategy,
      SeedFlareStrategy,
      HealBlockStrategy,
      RoarOfTimeStrategy,
      RockTombStrategy,
      RockSmashStrategy,
      HeadSmashStrategy,
      VoltSwitchStrategy,
      ShadowCloneStrategy,
      HyperVoiceStrategy,
      PetalDanceStrategy,
      EchoStrategy,
      TriAttackStrategy,
      GrassWhistleStrategy,
      HighJumpKickStrategy,
      DisarmingVoiceStrategy,
      RelicSongStrategy,
      GrowlStrategy,
      BonemerangStrategy,
      ClangorousSoulStrategy,
      NightmareStrategy,
      ExplosionStrategy,
      KingShieldStrategy,
      CorruptedNatureStrategy,
      TwistingNeitherStrategy,
      PsychUpStrategy,
      RazorWindStrategy,
      LeechSeedStrategy,
      FlameChargeStrategy,
      FireTrickStrategy,
      ElectroWebStrategy,
      ElectroBoostStrategy,
      DynamaxCannonStrategy,
      DynamicPunchStrategy,
      DracoEnergyStrategy,
      CrabHammerStrategy,
      DiamondStormStrategy,
      ConfusingMindStrategy,
      SongOfDesireStrategy,
      MindBlownStrategy,
      PaydayStrategy,
      AuroraVeilStrategy,
      FusionBoltStrategy,
      BlueFlareStrategy,
      SoftBoiledStrategy,
      BeatUpStrategy,
      EarthquakeStrategy,
      SteamEruptionStrategy
    ]
    const strategy = new skills[Math.floor(Math.random() * skills.length)]()
    strategy.process(pokemon, state, board, target)
  }
}
