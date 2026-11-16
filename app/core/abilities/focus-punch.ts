import { AttackType } from "../../types/enum/Game"
import type { Board, Cell } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FocusPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.cooldown = 1000
    pokemon.broadcastAbility({
      skill: "FOCUS_PUNCH_CHARGE",
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })
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
        pokemon.broadcastAbility({ skill: "FOCUS_PUNCH" })

        const canBeMoved = farthestEmptyCell != null && target.canBeMoved
        const willEject =
          canBeMoved &&
          !blocked &&
          !target.status.resurrection &&
          !target.status.magicBounce &&
          !target.status.protect

        if (willEject) {
          // eject from the board
          pokemon.broadcastAbility({ skill: "FOCUS_PUNCH_EJECT" })
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
      }, 900)
    )
  }
}
