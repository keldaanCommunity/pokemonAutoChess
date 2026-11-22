import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DrainPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const animation = {
      skill: pokemon.skill,
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1)),
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      orientation: pokemon.orientation,
      targetX: target.positionX,
      targetY: target.positionY
    }
    super.process(pokemon, board, target, crit, true)
    const damageMultiplier = [2, 2, 3, 4][pokemon.stars - 1] ?? 4
    const healMultiplier = 2
    const result = target.handleSpecialDamage(
      pokemon.atk * damageMultiplier,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    const { healReceived } = pokemon.handleHeal(
      result.takenDamage * healMultiplier,
      pokemon,
      0,
      false
    )
    pokemon.broadcastAbility({
      ...animation,
      data: { healReceived }
    })
  }
}
