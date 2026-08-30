import { BOARD_WIDTH } from "../../config"
import { SynergyConfigs } from "../../config/game/synergies"
import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
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
    const damage = [10, 30, 50, 100][pokemon.stars - 1] ?? 100
    const boardPlayer = target.simulation.bluePlayer
    let doubleDamage = false
    if (boardPlayer) {
      const index = target.positionY * BOARD_WIDTH + target.positionX
      const maxDepth = SynergyConfigs[Synergy.GROUND].maxDepth
      if (boardPlayer.groundHoles[index] === maxDepth) {
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
