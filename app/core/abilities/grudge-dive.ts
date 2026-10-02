import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GrudgeDiveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Base damage scales with stars: 1★=30, 2★=60, 3★=90, 4★=120, 5★=240
    const damage = [30, 60, 90, 120, 240][pokemon.stars - 1] ?? 240

    // Recoil damage is 20% of base HP
    const recoil = Math.round(pokemon.maxHP * 0.1)

    // Bonus damage per fallen ally scales with stars: 1★=5, 2★=10, 3★=15, 4★=20, 5★=40
    const damagePerFallenAlly = [5, 10, 15, 20, 40][pokemon.stars - 1] ?? 40
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })

    // Deal damage increased by fallen allies
    target.handleSpecialDamage(
      damage + nbFallenAllies * damagePerFallenAlly,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Take recoil damage unless protected by Protective Pads
    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}
