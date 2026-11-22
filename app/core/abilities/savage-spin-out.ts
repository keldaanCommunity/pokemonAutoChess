import { AttackType } from "../../types/enum/Game"
import { type Board, type Cell, effectInOrientation } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SavageSpinOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const HP_THRESHOLD_TO_EJECT = 100
    const damage = [40, 70, 100, 130, 200][pokemon.stars - 1]
    const targetDamage = [15, 20, 25, 30, 50][pokemon.stars - 1]

    pokemon.cooldown = 2000
    target.cooldown = 2000

    pokemon.commands.push(
      new DelayedCommand(() => {
        board
          .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2, false)
          .forEach((cell) => {
            if (
              cell.value &&
              cell.value.team !== pokemon.team &&
              cell.value.id !== target.id
            ) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                true
              )
              target.handleSpecialDamage(
                targetDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                true
              )
              pokemon.broadcastAbility({
                skill: "BUG_HIT",
                targetX: cell.value.positionX,
                targetY: cell.value.positionY
              })
            }
          })
      }, 600)
    )

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target.hp <= 0) {
          pokemon.pp = pokemon.maxPP
          return
        }
        let farthestEmptyCell: Cell | null = null
        let blocked = false
        effectInOrientation(board, pokemon, target, (cell) => {
          if (cell.value && cell.value.id !== target.id) {
            blocked = true
          } else {
            farthestEmptyCell = cell
          }
        })

        const canBeMoved = farthestEmptyCell != null && target.canBeMoved
        const willEject =
          canBeMoved &&
          !blocked &&
          !target.status.resurrection &&
          !target.status.magicBounce &&
          !target.status.protect &&
          (target.hp < HP_THRESHOLD_TO_EJECT ||
            board.cells.filter(
              (e) => e?.team === target.team && e.id !== target.id
            ).length === 0)

        if (willEject) {
          // eject from the board
          pokemon.broadcastAbility({ skill: "BOARD_EJECT_ORIENTED" })
          target.cooldown = 9999
          const { death } = target.handleSpecialDamage(
            9999,
            board,
            AttackType.TRUE,
            pokemon,
            crit
          )
          if (!death) {
            // force death even with shiny charm
            pokemon.state.triggerDeath(target, pokemon, board, AttackType.TRUE)
          }
        } else {
          // push as far as possible
          const damageMultiplier = [5, 5, 5, 10][pokemon.stars - 1] ?? 10
          const damage = damageMultiplier * pokemon.atk
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          if (canBeMoved && farthestEmptyCell) {
            const { x, y } = farthestEmptyCell as Cell
            const initialTargetX = target.positionX
            const initialTargetY = target.positionY
            target.moveTo(x, y, board, true)
            pokemon.moveTo(initialTargetX, initialTargetY, board, true)
          }
        }
      }, 1200)
    )
  }
}
