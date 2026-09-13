import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HeartSwapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
    const boostAP = target.ap
    const speDefLost = target.speDef - target.baseSpeDef
    const apLost = target.ap

    const damage = [60, 80, 100, 200][pokemon.stars - 1] ?? 200
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    if (target.items.has(Item.TWIST_BAND) === false) {
      target.addSpecialDefense(-speDefLost, pokemon, 0, false)
      target.addAbilityPower(-apLost, pokemon, 0, false)
      pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
      pokemon.addAbilityPower(boostAP, pokemon, 0, false)
    }

    pokemon.status.transferNegativeStatus(pokemon, target)
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
  }
}
