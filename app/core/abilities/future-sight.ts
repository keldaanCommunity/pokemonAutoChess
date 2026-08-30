import { AttackType } from "../../types/enum/Game"
import { pickNRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FutureSightStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 30, 50, 80][pokemon.stars - 1] ?? 80
    const count = [3, 4, 5, 6][pokemon.stars - 1] ?? 6
    const enemies = board.cells.filter<PokemonEntity>(
      (p): p is PokemonEntity => p !== undefined && p.team !== pokemon.team
    )
    const targets: PokemonEntity[] = pickNRandomIn(enemies, count)

    for (const tg of targets) {
      pokemon.broadcastAbility({
        skill: "FUTURE_SIGHT",
        targetX: tg.positionX,
        targetY: tg.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        for (const tg of targets) {
          pokemon.broadcastAbility({
            targetX: tg.positionX,
            targetY: tg.positionY,
            skill: "FUTURE_SIGHT_HIT"
          })
          if (tg.hp > 0) {
            tg.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
          board.getAdjacentCells(tg.positionX, tg.positionY).forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                Math.round(damage * 0.2),
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
        }
      }, 2000)
    )
  }
}
