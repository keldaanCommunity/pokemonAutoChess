import { AttackType } from "../../types/enum/Game"
import { randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TriAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const effect = randomBetween(1, 3)
    const element = effect === 1 ? "ice" : effect === 2 ? "fire" : "electric"
    switch (effect) {
      case 1:
        target.status.triggerFreeze(3000, target, pokemon)
        break
      case 2:
        target.status.triggerBurn(5000, target, pokemon)
        break
      case 3:
        target.status.triggerParalysis(7000, target, pokemon)
        break
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      ap: Math.round(pokemon.ap * (crit ? pokemon.critPower : 1)),
      data: { element }
    })
    const damage = [60, 120, 250, 500][pokemon.stars - 1] ?? 500
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
