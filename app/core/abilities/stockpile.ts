import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StockpileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (pokemon.count.ult % 4 === 0) {
      // If over 3 stacks, spit up, propelling the user to the backline and dealing 50% of max HP as SPECIAL to the target
      const damage = Math.ceil(([0.5, 0.5, 0.5, 1.0][pokemon.stars - 1] ?? 1.0) * pokemon.maxHP)
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      // move to backline
      const corner = board.getTeleportationCell(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )
      if (corner) {
        pokemon.broadcastAbility({
          skill: Ability.STOCKPILE,
          targetX: corner.x,
          targetY: corner.y
        })
        pokemon.moveTo(corner.x, corner.y, board, false)
      }
      // retrieve base stats
      pokemon.maxHP = pokemon.baseHP
      pokemon.hp = Math.min(pokemon.hp, pokemon.maxHP)
      pokemon.addSpeed(30, pokemon, 0, false)
    } else {
      pokemon.addMaxHP([30, 40, 50, 100][pokemon.stars - 1] ?? 100, pokemon, 1, crit)
      pokemon.addSpeed(-10, pokemon, 0, false)
    }
  }
}
