import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsychoShiftStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const farthestEnemy = pokemon.state.getFarthestTarget(pokemon, board)
    pokemon.broadcastAbility({
      positionX: target.positionX,
      positionY: target.positionY,
      targetX: farthestEnemy?.positionX,
      targetY: farthestEnemy?.positionY
    })

    const damage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120

    if (farthestEnemy && farthestEnemy.id !== target.id) {
      farthestEnemy.moveTo(target.positionX, target.positionY, board, true)
      farthestEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
