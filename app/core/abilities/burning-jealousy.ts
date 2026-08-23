import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BurningJealousyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [30, 50, 70, 140][pokemon.stars - 1] ?? 140
    const burnDuration = 5000

    // Get target and adjacent enemies
    const targets = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value!)

    targets.forEach((enemy) => {
      // Deal SPECIAL damage to all targets
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.broadcastAbility({
        targetX: enemy.positionX,
        targetY: enemy.positionY,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })

      // Only enemies with ATK buffs lose them and get burned
      if (enemy.atk > enemy.baseAtk) {
        // Remove ATK buffs (subtract the buff amount)
        enemy.addAttack(-(enemy.atk - enemy.baseAtk), enemy, 0, false)

        // Inflict BURN for 5 seconds
        enemy.status.triggerBurn(burnDuration, enemy, pokemon)
      }
    })
  }
}
