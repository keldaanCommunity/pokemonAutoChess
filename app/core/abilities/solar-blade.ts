import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SolarBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (!pokemon.status.light) {
      pokemon.cooldown = 2000
      pokemon.broadcastAbility({
        skill: "SOLAR_BLADE_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
          pokemon.broadcastAbility({
            skill: Ability.SOLAR_BLADE,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            orientation: pokemon.orientation
          })
          const cells = board.getCellsInFront(pokemon, target, 1)
          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.TRUE,
                pokemon,
                crit
              )
            }
          })
        },
        pokemon.status.light ? 0 : 2000
      )
    )
  }
}
