import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class IcicleMissileStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = 50
    const count = [1, 2, 3, 5][pokemon.stars - 1] ?? 5
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
        const targetX = tg.positionX
        const targetY = tg.positionY
        pokemon.broadcastAbility({
          targetX,
          targetY,
          delay: i
        })

        pokemon.commands.push(
          new DelayedCommand(() => {
            const entityHit = board.getEntityOnCell(targetX, targetY)
            if (
              entityHit &&
              entityHit.hp > 0 &&
              entityHit.team !== pokemon.team
            ) {
              entityHit.status.triggerFreeze(2000, tg, pokemon)
              entityHit.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }, 1000)
        )
      }
    }
  }
}
