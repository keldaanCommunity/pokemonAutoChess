import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class LightThatBurnsTheSkyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Gets PROTECT for 1 second
    // then [50,100,150,200,300,SP] SPECIAL and BURN for 5 seconds enemies within a 2-tile radius. The other enemies are BLINDED for 5 seconds."
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({ skill: "LIGHT_THAT_BURNS_THE_SKY_CHARGE" })
    pokemon.status.triggerProtect(1000)
    pokemon.cooldown = 1200
    pokemon.simulation.commands.push(
      new DelayedCommand(() => {
        pokemon.broadcastAbility()
        const damage = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
        const enemiesBurn = new Set()
        board
          .getCellsInRadius(pokemon.positionX, pokemon.positionY, 2, false)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              cell.value.status.triggerBurn(5000, cell.value, pokemon)
              enemiesBurn.add(cell.value.id)
            }
          })
        board.cells
          .filter(
            (entity): entity is PokemonEntity =>
              entity != null &&
              entity.team !== pokemon.team &&
              enemiesBurn.has(entity.id) === false
          )
          .forEach((enemy) => {
            enemy?.status.triggerBlinded(5000, enemy, pokemon)
          })
      }, 1000)
    )
  }
}
