import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HeatCrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Crashes into the target, knocking it back and dealing [40,60,80,SP] SPECIAL. Does more damage the more ATK the user has compared to the target.
    let damage = [40, 60, 80, 160][pokemon.stars - 1] ?? 160
    const attackDifference = pokemon.atk - target.atk
    damage += attackDifference * 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const knockbackCell = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      pokemon.orientation
    )
    if (knockbackCell) {
      target.moveTo(knockbackCell.x, knockbackCell.y, board, true)
      target.cooldown = 500
    }
  }
}
