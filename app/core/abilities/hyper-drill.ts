import { SynergyConfigs } from "../../config/game/synergies"
import { AttackType } from "../../types/enum/Game"
import { type Board, getGroundHoleAt } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HyperDrillStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [10, 20, 40, 50, 100][pokemon.stars - 1] ?? 100
    const {
      player: boardPlayer,
      index,
      depth
    } = getGroundHoleAt(target.simulation, target.positionX, target.positionY)
    const doubleDamage =
      boardPlayer !== undefined && depth === SynergyConfigs.GROUND.maxDepth
    if (boardPlayer) {
      if (!doubleDamage) {
        boardPlayer.groundHoles[index] = depth + 1
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
