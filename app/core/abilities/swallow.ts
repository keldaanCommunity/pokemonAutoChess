import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SwallowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Store power and boosts its DEF and SPE_DEF by 1 up to 3 times.
    // If below 25% HP, swallow instead, restoring [20,SP]% of max HP per stack.
    // If over 3 stacks, spit up, dealing [40,80,150,300,SP] SPECIAL to the 3 cells in front
    if (pokemon.hp < pokemon.maxHP * 0.25 && pokemon.count.ult > 0) {
      const heal =
        (([0, 20, 40, 60][pokemon.count.ult] ?? 60) * pokemon.maxHP) / 100
      pokemon.handleHeal(heal, pokemon, 1, crit)
      pokemon.count.ult = 0
      pokemon.broadcastAbility({ skill: Ability.RECOVER })
    } else if (pokemon.count.ult >= 3) {
      const damage = [40, 80, 150, 300][pokemon.stars - 1] ?? 300
      const cells = board.getCellsInFront(pokemon, target, 1)
      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
      pokemon.broadcastAbility({ skill: Ability.SWALLOW })
      pokemon.count.ult = 0
    } else {
      pokemon.addDefense(3, pokemon, 0, false)
      pokemon.addSpecialDefense(3, pokemon, 0, false)
    }
  }
}
