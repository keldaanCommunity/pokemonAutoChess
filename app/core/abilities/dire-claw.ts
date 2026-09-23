import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DireClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const status = pickRandomIn(["poison", "sleep", "paralysis"])
    switch (status) {
      case "poison":
        target.status.triggerPoison(3000, target, pokemon)
        break
      case "sleep":
        target.status.triggerSleep(3000, target)
        break
      case "paralysis":
        target.status.triggerParalysis(3000, target, pokemon)
        break
    }

    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
