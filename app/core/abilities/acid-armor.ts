import { distanceC } from "../../utils/distance";
import type { Board } from "../board";
import { OnDamageReceivedEffect } from "../effects/effect";
import type { PokemonEntity } from "../pokemon-entity";
import { AbilityStrategy } from "./ability-strategy";

export class AcidArmorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defGain = [3, 6, 12, 25][pokemon.stars - 1] ?? 25
    pokemon.addDefense(defGain, pokemon, 1, crit)
    let count = 4
    const acidHitEffect = new OnDamageReceivedEffect(
      ({ pokemon, attacker }) => {
        if (
          attacker &&
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            attacker.positionX,
            attacker.positionY
          ) === 1
        ) {
          attacker.addDefense(-1, pokemon, 0, false)
        }
        count--
        if (count <= 0) {
          pokemon.effectsSet.delete(acidHitEffect)
        }
      }
    )
    pokemon.effectsSet.add(acidHitEffect)
  }
}
