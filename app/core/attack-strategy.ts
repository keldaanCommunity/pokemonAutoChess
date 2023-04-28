import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import { AttackType, Rarity } from "../types/enum/Game"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { Synergy } from "../types/enum/Synergy"
import { AbilityStrategy, Ability } from "../types/enum/Ability"
import PokemonFactory from "../models/pokemon-factory"
import { Pkm } from "../types/enum/Pokemon"
import { pickRandomIn, shuffleArray } from "../utils/random"
import { effectInLine, OrientationArray } from "../utils/orientation"

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

    if (pokemon.items.has(Item.STAR_DUST)) {
      pokemon.handleShield(Math.round(0.5 * pokemon.maxMana), pokemon, false)
      pokemon.count.starDustCount++
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
    damage += multiplier * 20

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    damage += multiplier * 25

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    for (let i = 0; i < pokemon.stars; i++) {
      const houndour = PokemonFactory.createPokemonFromName(Pkm.HOUNDOUR)
      const coord = pokemon.simulation.getClosestAvailablePlaceOnBoard(
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.stars === 2 ? 60 : pokemon.stars === 3 ? 120 : 30

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon
    )
    if (death && pokemon.team === 0 && pokemon.simulation.player) {
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
    target.handleSpecialDamage(
      pokemon.life / 2,
      board,
      AttackType.SPECIAL,
      pokemon
    )
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
        tg.handleShield(shield, pokemon, true)
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
    }
    if (pokemon.stars == 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 120
    }
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (
        (tg && pokemon.team != tg.team && target.positionY == y) ||
        (tg && pokemon.team != tg.team && target.positionX == x)
      ) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    let duration = 6000 * (1 + pokemon.ap / 100)

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
    let damage = 40
    let confusionDuration = 3

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.status.triggerConfusion(confusionDuration * 1000, target)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
        cell.value.status.triggerConfusion(confusionDuration * 1000, cell.value)
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
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    let damage = 30
    if (pokemon.stars == 2) {
      damage = 60
    }
    if (pokemon.stars == 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 120
    }

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        let duration = Math.round(3000 * (1 + pokemon.ap / 100))
        cell.value.status.triggerParalysis(duration, cell.value)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
      }
    })
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

export class IllusionStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const heal = pokemon.stars === 3 ? 120 : pokemon.stars === 2 ? 80 : 40
    pokemon.handleHeal(heal, pokemon, true)
    if (target) {
      pokemon.index = target.index
      pokemon.atk = Math.max(pokemon.atk, target.atk)
      pokemon.range = target.range
      pokemon.def = Math.max(pokemon.def, target.def)
      pokemon.speDef = Math.max(pokemon.speDef, target.speDef)
    }
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

export class MistsySurgeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
  }
}

export class GrassySurgeStrategy extends AttackStrategy {
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
    const damage = pokemon.stars === 3 ? 180 : pokemon.stars === 2 ? 90 : 45

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.setMana(target.mana - 15)
    target.count.manaBurnCount++
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
        cell.value.setMana(cell.value.mana - 15)
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
    const damage = 10
    const chance = 0.3
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    let damage = 20
    if (pokemon.stars == 2) {
      damage = 40
    } else if (pokemon.stars == 3) {
      damage = 80
    }
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerWound(5000, cell.value, board)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    target.handleSpecialDamage(pokemon.life, board, AttackType.SPECIAL, pokemon)
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
        tg.handleSpecialDamage(
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
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
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
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
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
        }
      })

      target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)

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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
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
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
        }
      })

      target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)

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
    let heal = 20
    if (pokemon.stars == 2) {
      duration = 6000
      heal = 40
    } else if (pokemon.stars == 3) {
      duration = 6000
      heal = 80
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    const damage =
      pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL
        ? 80
        : pokemon.stars === 2
        ? 40
        : 20
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.status.triggerParalysis(7000, target)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(7000, cell.value)
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
        cell.value.handleSpecialDamage(80, board, AttackType.SPECIAL, pokemon)
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
          console.error("unable to teleport pokemon", cell.value)
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
          pokemon
        )
      }
    })

    pokemon.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class AuroraBeamStrategy extends AttackStrategy {
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

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
        let freezeChance = 0
        if (pokemon.effects.includes(Effect.SNOW)) {
          freezeChance += 0.1
        }
        if (pokemon.effects.includes(Effect.SHEER_COLD)) {
          freezeChance += 0.3
        }
        if (Math.random() < freezeChance) {
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    let duration = Math.round(2000 * (1 + pokemon.ap / 200))
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.status.triggerSleep(duration, tg)
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
    heal = Math.round(heal * (1 + pokemon.ap / 200))
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team === tg.team && tg.id !== pokemon.id) {
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    let duration = 2000
    if (pokemon.stars === 2) {
      duration = 4000
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      duration = 8000
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
        tg.handleSpecialDamage(
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

export class FutureSightStrategy extends AttackStrategy {
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
        const cells = board.getAdjacentCells(tg.positionX, tg.positionY)
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    let damage = 0
    let count = 0

    switch (pokemon.stars) {
      case 1:
        damage = 15
        count = 2
        break
      case 2:
        damage = 30
        count = 4
        break
      case 3:
        damage = 60
        count = 6
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && count > 0) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
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
      clone.isClone = true
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

    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
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
        if (cell.value && cell.value != pokemon) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon
          )
        }
      })

      target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)

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
      target.handleSpecialDamage(target.life, board, AttackType.TRUE, pokemon)
    } else {
      target.handleSpecialDamage(d, board, AttackType.SPECIAL, pokemon)
    }
    pokemon.handleSpecialDamage(recoil, board, AttackType.TRUE, pokemon)
  }
}

export class RockSmashStrategy extends AttackStrategy {
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

    target.handleSpecialDamage(d, board, AttackType.SPECIAL, pokemon)
    target.status.triggerSilence(s, target, board)
  }
}

export class RockTombStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    let damage = 30
    let debuff = 20
    if (pokemon.stars === 2) {
      damage = 60
      debuff = 40
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 120
      debuff = 60
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.handleAttackSpeed(-debuff)
  }
}

export class RoarOfTimeStrategy extends AttackStrategy {
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

export class SpikeArmorStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 120
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class SeedFlareStrategy extends AttackStrategy {
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
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class NightmareStrategy extends AttackStrategy {
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
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let duration = 5000
    if (pokemon.stars === 2) {
      duration = 10000
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
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
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 0
    let count = 1

    switch (pokemon.stars) {
      case 1:
        timer = 3000
        count = 1
        break
      case 2:
        timer = 6000
        count = 2
        break
      case 3:
        timer = 9000
        count = 3
        break
      default:
        break
    }

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && count > 0) {
        tg.status.triggerPoison(timer, tg, pokemon, board)
        count--
      }
    })
  }
}

export class FreezeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let timer = 1000
    if (pokemon.stars === 2) {
      timer = 2000
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      timer = 4000
    }
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerFreeze(timer, value)
      }
    })
  }
}

export class ProtectStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let duration = Math.round(5000 * (1 + pokemon.ap / 100))
    pokemon.status.triggerProtect(duration)
  }
}

export class SleepStrategy extends AttackStrategy {
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
        timer = 1500
        break
      case 2:
        timer = 3000
        break
      case 3:
        timer = 4500
        break
      default:
        break
    }

    let count = 2
    const rank = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === 0) {
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
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 120
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class SeismicTossStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 7
    if (pokemon.stars === 2) {
      damage = 14
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 28
    }

    let totalDamage = 0
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team == value.team) {
        totalDamage += damage
      }
    })
    target.handleSpecialDamage(totalDamage, board, AttackType.TRUE, pokemon)
  }
}

export class GuillotineStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.atk * pokemon.stars
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon
    )
    if (death) {
      pokemon.setMana(pokemon.maxMana)
    }
  }
}

export class RockSlideStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 120
    }

    if (target.types.includes(Synergy.FLYING)) {
      damage = damage * 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class WheelOfFireStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 20
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 80
    }
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value != pokemon) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
      }
    })
  }
}

export class HeatWaveStrategy extends AttackStrategy {
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

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine.team != pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class DracoMeteorStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 20
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class BlazeKickStrategy extends AttackStrategy {
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class WishStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const heal = 50
    let count = pokemon.rarity === Rarity.MYTHICAL ? 3 : pokemon.stars

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
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let buff = 1
    pokemon.addAttack(buff * pokemon.baseAtk, true)
  }
}

export class IronDefenseStrategy extends AttackStrategy {
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
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
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

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class IronTailStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 20
    let buff = 1
    if (pokemon.stars === 2) {
      damage = 40
      buff = 3
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 80
      buff = 5
    }
    pokemon.addDefense(buff, true)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class BlastBurnStrategy extends AttackStrategy {
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
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const buff = 0.2
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

export class SmogStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage =
      pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL
        ? 40
        : pokemon.stars === 2
        ? 20
        : 10
    const duration =
      pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL
        ? 6000
        : pokemon.stars === 2
        ? 3000
        : 1500
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
          cell.value.handleSpecialDamage(
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.handleHeal(Math.floor(0.33 * damage), pokemon, true)
  }
}

export class AppleAcidStrategy extends AttackStrategy {
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
    pokemon.addSpecialDefense(-3, true)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class SacredSwordStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 120
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon)
  }
}

export class XScissorStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.stars === 3 ? 80 : pokemon.stars === 2 ? 40 : 20
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon) // twice
  }
}

export class DragonTailStrategy extends AttackStrategy {
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.addDefense(pokemon.stars, true)
    pokemon.addSpecialDefense(pokemon.stars, true)
  }
}

export class DragonBreathStrategy extends AttackStrategy {
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
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon)
    const secondTarget = board.getValue(target.positionX, target.positionY + 1)
    if (secondTarget && secondTarget != pokemon) {
      secondTarget.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon)
    }
  }
}

export class IcicleCrashStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 20
    if (pokemon.stars === 2) {
      damage = 40
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 80
    }

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 80
    let burnDuration = 3000

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.status.triggerBurn(burnDuration, target, pokemon, board)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
        boost = 40
        break
      case 3:
        boost = 60
        break
      default:
        break
    }
    pokemon.handleAttackSpeed(boost, true)
  }
}

export class StompStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.atk * pokemon.stars * 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class DarkPulseStrategy extends AttackStrategy {
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.handleHeal(damage, pokemon, true)
  }
}

export class NightSlashStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 40
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 100
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)

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

    if (target.status.paralysis) {
      damage *= 2
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class StringShotStrategy extends AttackStrategy {
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
        damage = 50
        break
      default:
        break
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.status.triggerParalysis(5000, target)
  }
}

export class PoisonStingStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 30
    if (pokemon.stars === 2) {
      damage = 60
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 120
    }

    if (pokemon.status.poisonStacks > 0) {
      damage = damage * 2
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class LeechLifeStrategy extends AttackStrategy {
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

    const cells = board.getAdjacentCells(target.positionX, target.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
        pokemon.handleHeal(damage, pokemon, true)
      }
    })
  }
}

export class HappyHourStrategy extends AttackStrategy {
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    const potentialCells = [
      [0, 0],
      [0, 5],
      [7, 5],
      [7, 0]
    ]
    shuffleArray(potentialCells)

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
        pokemon.cooldown = 100;
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const buff = 10
    pokemon.addAttack(buff, true)
  }
}

export class SpectralThiefStrategy extends AttackStrategy {
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
    const damage = 50
    if (farthestCoordinate) {
      target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)

      board.swapValue(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      pokemon.positionX = farthestCoordinate.x
      pokemon.positionY = farthestCoordinate.y
      const boostAtk = Math.min(0, target.atk - target.baseAtk)
      const boostDef = Math.min(0, target.def - target.baseSpeDef)
      const boostSpeDef = Math.min(0, target.speDef - target.baseSpeDef)
      target.atk = target.baseAtk
      target.def = target.baseDef
      target.speDef = target.baseSpeDef
      pokemon.addAttack(boostAtk, false)
      pokemon.addDefense(boostDef, false)
      pokemon.addSpecialDefense(boostSpeDef, false)
    }
  }
}

export class ThiefStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 15
    if (pokemon.stars === 2) {
      damage = 30
    }
    if (pokemon.stars === 3 || pokemon.rarity === Rarity.MYTHICAL) {
      damage = 60
    }

    const l = target.items.size
    target.items.forEach((item) => {
      if (pokemon.items.size < 3) {
        pokemon.items.add(item)
      }
      target.items.delete(item)
    })

    if (pokemon.effects.includes(Effect.DUBIOUS_DISC)) {
      pokemon.addAttack(4 * l, true)
      pokemon.handleShield(20 * l, pokemon)
    }

    if (pokemon.effects.includes(Effect.LINK_CABLE)) {
      pokemon.addAttack(7 * l, true)
      pokemon.handleShield(30 * l, pokemon)
    }

    if (pokemon.effects.includes(Effect.GOOGLE_SPECS)) {
      pokemon.addAttack(10 * l, true)
      pokemon.handleShield(50 * l, pokemon)
    }

    // pokemon.simulation.applyItemsEffects(pokemon);
    // target.simulation.applyItemsEffects(target);
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class StunSporeStrategy extends AttackStrategy {
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
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    target.handleAttackSpeed(-debuff)
  }
}

export class MeteorMashStrategy extends AttackStrategy {
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
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
        value.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
      }
    })
  }
}

export class SparklingAriaStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = pokemon.stars === 3 ? 60 : pokemon.stars === 2 ? 30 : 15

    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
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
      target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    }
    if (target.life <= 0) {
      pokemon.setMana(pokemon.mana + 40)
    }
  }
}

export class MetronomeStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)

    const strategy = pickRandomIn(
      Object.values(AbilityStrategy) as AttackStrategy[]
    )
    strategy.process(pokemon, state, board, target)
  }
}

export class SkyAttackStrategy extends AttackStrategy {
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
    const damage = 120
    if (farthestCoordinate) {
      target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)

      board.swapValue(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      pokemon.positionX = farthestCoordinate.x
      pokemon.positionY = farthestCoordinate.y
      pokemon.status.triggerProtect(500)
    }
  }
}

export class AgilityStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let boost = 0

    switch (pokemon.stars) {
      case 1:
        boost = 5
        break
      case 2:
        boost = 10
        break
      case 3:
        boost = 15
        break
    }
    pokemon.handleAttackSpeed(boost, true)
  }
}

export class SpiritShackleStrategy extends AttackStrategy {
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

    effectInLine(board, pokemon, target, (targetInLine) => {
      if (targetInLine.team !== pokemon.team) {
        targetInLine.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon
        )
        targetInLine.status.triggerWound(4000, targetInLine, board)
      }
    })
  }
}

export class WaterShurikenStrategy extends AttackStrategy {
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
        damage = 60
        break
      default:
        break
    }

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
            pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 60
    const damageType = pokemon.status.silence
      ? AttackType.TRUE
      : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon)
  }
}

export class PlasmaFistStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    const damage = 120
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    pokemon.handleHeal(damage / 2, pokemon, true)
  }
}

export class ForecastStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      if (p && pokemon.team === p.team) {
        p.handleShield(10, pokemon, true)
        if (pokemon.name === Pkm.CASTFORM_SUN) {
          p.addAttack(5, true)
        }
        if (pokemon.name === Pkm.CASTFORM_RAIN) {
          p.setMana(p.mana + Math.round(20 * (1 + pokemon.ap / 100)))
        }
        if (pokemon.name === Pkm.CASTFORM_HAIL) {
          p.addDefense(5, true)
          p.addSpecialDefense(5, true)
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 50
    if (pokemon.def > target.def) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class MawashiGeriStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 50
    if (pokemon.atk > target.atk) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
  }
}

export class TripleKickStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 50

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
            pokemon
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
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    pokemon.addAttack(15, true)
    pokemon.addSpecialDefense(5, true)
    pokemon.handleAttackSpeed(30, false)
  }
}

export class DeathWingStrategy extends AttackStrategy {
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity
  ) {
    super.process(pokemon, state, board, target)
    let damage = 150
    const { takenDamage } = target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon)
    if(takenDamage > 0){
      pokemon.handleHeal(Math.round(0.75 * takenDamage), pokemon, false)
    }
  }
}