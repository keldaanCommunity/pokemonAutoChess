import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PlasmaFlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    // Define base damage per flash
    const damage = [5, 10, 20, 40][pokemon.stars - 1] ?? 40

    // Calculate total number of flashes based on pokemon's ult count
    const flashCount = 4 + pokemon.count.ult

    // Loop through each flash
    for (let i = 0; i < flashCount; i++) {
      // Add a delayed command for each flash
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Animate the flash ability
          pokemon.broadcastAbility({
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: target.positionX,
            targetY: target.positionY
          })

          // Deal special damage to the target
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, 100 * i) // Delay each flash by 100ms * index
      )
    }
  }
}
