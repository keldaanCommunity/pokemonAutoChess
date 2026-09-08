import { BOARD_HEIGHT } from "../../config"
import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MortalSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const poisonDuration = [4000, 4000, 8000, 16000][pokemon.stars - 1] ?? 16000

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
          abilityTarget.status.triggerPoison(poisonDuration, abilityTarget, pokemon)

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
            abilityTarget.moveTo(abilityTarget.positionX, newY, board, true)
            abilityTarget.cooldown = 500
          }
        }
      }
    })
  }
}
