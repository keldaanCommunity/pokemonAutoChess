import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { chance, pickNRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ThunderStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
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
