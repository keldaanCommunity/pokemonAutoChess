import { PokemonClasses } from "../../models/colyseus-models/pokemon"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { PkmByIndex } from "../../types/enum/Pokemon"
import { logger } from "../../utils/logger"
import { min } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SpectralThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const damage = [30, 40, 50, 100][pokemon.stars - 1] ?? 100
    if (farthestCoordinate) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
      const PkmClass = PokemonClasses[PkmByIndex[target.index]]
      if (!PkmClass)
        return logger.error(
          `Spectral Thief: No class found for ${target.name} [index ${target.index}]`
        )

      if (target.items.has(Item.TWIST_BAND) === false) {
        const base = new PkmClass(target.name)
        const boostAtk = min(0)(target.atk - target.baseAtk)
        const boostSpeed = min(0)(target.speed - base.speed)
        const boostDef = min(0)(target.def - target.baseDef)
        const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
        const boostAP = target.ap
        const boostHP = min(0)(target.maxHP - base.hp)
        const boostCritChance = min(0)(target.critChance - base.critChance)
        const boostCritPower = min(0)(target.critPower - base.critPower)
        const boostLuck = min(0)(target.luck - base.luck)

        target.addAttack(-boostAtk, pokemon, 0, false)
        target.addSpeed(-boostSpeed, pokemon, 0, false)
        target.addDefense(-boostDef, pokemon, 0, false)
        target.addSpecialDefense(-boostSpeDef, pokemon, 0, false)
        target.addAbilityPower(-boostAP, pokemon, 0, false)
        target.addMaxHP(-boostHP, pokemon, 0, false)
        target.addCritChance(-boostCritChance, pokemon, 0, false)
        target.addCritPower(-boostCritPower, pokemon, 0, false)
        target.addLuck(-boostLuck, pokemon, 0, false)

        pokemon.addAttack(boostAtk, pokemon, 0, false)
        pokemon.addDefense(boostDef, pokemon, 0, false)
        pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
        pokemon.addAbilityPower(boostAP, pokemon, 0, false)
        pokemon.addSpeed(boostSpeed, pokemon, 0, false)
        pokemon.addMaxHP(boostHP, pokemon, 0, false)
        pokemon.addCritChance(boostCritChance, pokemon, 0, false)
        pokemon.addCritPower(boostCritPower, pokemon, 0, false)
        pokemon.addLuck(boostLuck, pokemon, 0, false)
      }
    }
  }
}
