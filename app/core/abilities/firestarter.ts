import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FirestarterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const speedBuff = [10, 20, 40, 80][pokemon.stars - 1] ?? 80

    const flyAwayCell = pokemon.flyAway(board, false)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (flyAwayCell) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        flyAwayCell.x,
        flyAwayCell.y
      )
      cells.forEach((cell, i) => {
        if (cell.x === flyAwayCell.x && cell.y === flyAwayCell.y) {
          pokemon.commands.push(
            new DelayedCommand(() => {
              pokemon.addSpeed(speedBuff, pokemon, 1, crit)
            }, 500)
          )
        } else {
          pokemon.commands.push(
            new DelayedCommand(() => {
              board.addBoardEffect(
                cell.x,
                cell.y,
                EffectEnum.EMBER,
                pokemon.simulation
              )
              pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })

              if (cell.value && cell.value.team != pokemon.team) {
                targetsHit.add(cell.value)
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }, i * 50)
          )
          pokemon.commands.push(
            new DelayedCommand(
              () => {
                board.addBoardEffect(
                  cell.x,
                  cell.y,
                  EffectEnum.EMBER,
                  pokemon.simulation
                )
              },
              400 + i * 50
            )
          )
        }
      })
    }

    if (targetsHit.size === 0) {
      // ensure to at least hit the target
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}
