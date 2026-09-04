import { DEFAULT_SPEED } from "../../config"
import { PokemonClasses } from "../../models/colyseus-models/pokemon"
import { AttackType } from "../../types/enum/Game"
import { PkmByIndex } from "../../types/enum/Pokemon"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StoredPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const PkmClass = PokemonClasses[PkmByIndex[target.index]]
    const baseSpeed = PkmClass ? new PkmClass(target.name).speed : DEFAULT_SPEED
    const boostSpeed = min(0)(pokemon.speed / baseSpeed - 1)
    const boostAtk = min(0)(pokemon.atk / pokemon.baseAtk - 1)
    const boostDef = min(0)(pokemon.def / pokemon.baseDef - 1)
    const boostSpeDef = min(0)(pokemon.speDef / pokemon.baseSpeDef - 1)
    const boostAP = min(0)(pokemon.ap / 100 - 1)

    const damage = Math.round(
      ([10, 15, 20, 40][pokemon.stars - 1] ?? 40) * (1 + boostAtk + boostDef + boostSpeDef + boostSpeed + boostAP)
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
