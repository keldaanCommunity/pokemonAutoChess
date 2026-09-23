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
    const flatShieldPercent =
      [0.125, 0.125, 0.125, 0.25][pokemon.stars - 1] ?? 0.25
    const flatShield = flatShieldPercent * pokemon.maxHP
    const shieldWithAP = flatShield * (2 + pokemon.ap / 100)
    pokemon.addShield(shieldWithAP, pokemon, 0, crit)
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
