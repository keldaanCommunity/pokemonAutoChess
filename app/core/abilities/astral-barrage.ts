import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import { getMoveSpeed } from "../move-speed"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class AstralBarrageStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board, false)
    }

    const damagePerGhost = 20

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbGhosts =
      ([3, 5, 7, 13][pokemon.stars - 1] ?? 13) * (1 + pokemon.ap / 100)
    const delay = Math.round(500 / getMoveSpeed(pokemon)) / (nbGhosts + 1)

    for (let i = 0; i < nbGhosts; i++) {
      const randomTarget = pickRandomIn(enemies)
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            pokemon.broadcastAbility({
              targetX: randomTarget.positionX,
              targetY: randomTarget.positionY
            })
            if (randomTarget?.hp > 0) {
              randomTarget.handleSpecialDamage(
                damagePerGhost,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                false
              )
            }
          },
          delay * (i + 1)
        )
      )
    }
  }
}
