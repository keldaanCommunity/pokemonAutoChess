import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TauntStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Gain 25% (AP scaling=0.5) of max HP as shield, and force adjacent enemies to choose you as target
    const shield = ([25, 25, 25, 50][pokemon.stars - 1] ?? 50) / 100 * pokemon.maxHP
    pokemon.addShield(shield, pokemon, 0.5, crit)
    const enemiesTaunted = board.cells.filter(
      (enemy): enemy is PokemonEntity =>
        enemy != null &&
        enemy.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          target.positionX,
          target.positionY
        ) <= enemy.range
    )
    enemiesTaunted.forEach((enemy) => {
      enemy.setTarget(pokemon)
      pokemon.broadcastAbility({
        skill: "TAUNT_HIT",
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
    })
  }
}
