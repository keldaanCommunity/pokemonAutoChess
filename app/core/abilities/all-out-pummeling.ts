import { AttackType, Orientation, Team } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class AllOutPummelingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const shield = [30, 60, 100, 150, 200][pokemon.stars - 1] ?? 200
    pokemon.addShield(shield, pokemon, 0, false)

    // Strikes a series of punches and kicks that deals 8x [50,SP] SPECIAL split between the enemies in front of the user
    for (let i = 0; i < 8; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const enemiesHit = board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .filter(
              (c) => c.value && c.value.team !== pokemon.team && c.value.hp > 0
            )
            .map((c) => c.value)
          const enemyHit = pickRandomIn(enemiesHit) ?? target
          const damage = [30, 40, 50, 60, 100][pokemon.stars - 1] ?? 100
          enemyHit.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          pokemon.broadcastAbility({
            skill: pickRandomIn([
              "ALL_OUT_PUMMELING_PUNCH",
              "ALL_OUT_PUMMELING_PUNCH2",
              "ALL_OUT_PUMMELING_KICK",
              "ALL_OUT_PUMMELING_KICK2"
            ]),
            targetX: enemyHit.positionX,
            targetY: enemyHit.positionY
          })
        }, i * 100)
      )
    }

    const direction =
      pokemon.positionY < target.positionY
        ? Orientation.UP
        : pokemon.positionY > target.positionY
          ? Orientation.DOWN
          : pokemon.team === Team.RED_TEAM
            ? Orientation.DOWN
            : Orientation.UP
    const down = direction === Orientation.DOWN

    pokemon.commands.push(
      new DelayedCommand(() => {
        // finish by a devastating punch that deals [50,100,150,300,SP] SPECIAL and knocks back all enemies in a 3-wide column
        for (let dx = -1; dx <= 1; dx++) {
          const x = pokemon.positionX + dx
          if (x < 0 || x >= board.columns) continue
          for (
            let y = down ? 0 : board.rows - 1;
            down ? y <= pokemon.positionY : y >= pokemon.positionY;
            y += down ? 1 : -1
          ) {
            const entityOnCell = board.getEntityOnCell(x, y)
            if (entityOnCell && entityOnCell.team !== pokemon.team) {
              const damage = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
              entityOnCell.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              // knockback the entity to the farthest cell
              let newY = y + (down ? -1 : 1)
              while (
                newY >= 0 &&
                newY < board.rows &&
                board.getEntityOnCell(x, newY) == null
              ) {
                newY += down ? -1 : 1
              }

              if (
                newY >= 0 &&
                newY < board.rows &&
                board.getEntityOnCell(x, newY) == null
              ) {
                entityOnCell.moveTo(x, newY, board, true)
              }
            }
          }
        }
        pokemon.broadcastAbility({
          ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
        })
      }, 1000)
    )

    pokemon.resetCooldown(1500)
  }
}
