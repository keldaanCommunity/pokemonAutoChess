import { AttackType } from "../../types/enum/Game"
import { average } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class GigavoltHavocStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // A powerful electric current hits in a 4x4 zone centered on the enemy team, dealing 5 times [15,25,60,100,SP] SPECIAL and burning 25 PP over 2 seconds.
    // Enemies in the center of the zone take an additional [50,100,150,200,300,SP] SPECIAL burst.
    const damageZone = [15, 25, 40, 60, 100][pokemon.stars - 1] ?? 100
    const damageBurst = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
    const ppBurn = 5

    const enemies = board.cells.filter<PokemonEntity>(
      (v): v is PokemonEntity => v != null && v.team !== pokemon.team
    )
    const avgCenter = {
      x: average(...enemies.map((e) => e.positionX)),
      y: average(...enemies.map((e) => e.positionY))
    }

    const zone = {
      x: Math.round(avgCenter.x - 1.5),
      y: Math.round(avgCenter.y - 1.5),
      w: 4,
      h: 4
    }
    pokemon.broadcastAbility({
      targetX: zone.x + 2,
      targetY: zone.y + 2
    })

    for (let y = zone.y; y < zone.y + zone.h; y++) {
      for (let x = zone.x; x < zone.x + zone.w; x++) {
        if (board.isOnBoard(x, y)) {
          const isOnCenter =
            x > zone.x &&
            x < zone.x + zone.w - 1 &&
            y > zone.y &&
            y < zone.y + zone.h - 1
          const entityOnCell = board.getEntityOnCell(x, y)
          if (
            isOnCenter &&
            entityOnCell &&
            entityOnCell.team !== pokemon.team
          ) {
            entityOnCell.handleSpecialDamage(
              damageBurst,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }
    }

    const nbHits = 5,
      totalDuration = 2000
    for (let hit = 0; hit < nbHits; hit++) {
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            for (let y = zone.y; y < zone.y + zone.h; y++) {
              for (let x = zone.x; x < zone.x + zone.w; x++) {
                if (board.isOnBoard(x, y)) {
                  const entityOnCell = board.getEntityOnCell(x, y)
                  if (entityOnCell && entityOnCell.team !== pokemon.team) {
                    entityOnCell.handleSpecialDamage(
                      damageZone,
                      board,
                      AttackType.SPECIAL,
                      pokemon,
                      crit
                    )
                    entityOnCell.addPP(-ppBurn, pokemon, 0, false)
                  }
                }
              }
            }
          },
          (hit * totalDuration) / nbHits
        )
      )
    }
  }
}
