import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { giveRandomEgg } from "../eggs"
import { getHatchTime } from "../evolution-logic/hatch-time"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class EggBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .forEach((v) => {
        if (v) {
          const kill = v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (
            kill.death &&
            !pokemon.isGhostOpponent &&
            pokemon.player &&
            chance(0.25, pokemon)
          ) {
            const egg = giveRandomEgg(pokemon.player, false)
            if (egg) {
              egg.stacks = getHatchTime(egg, pokemon.player) - 1
            }
          }
          v.status.triggerArmorReduction(4000, v)
        }
      })
  }
}
