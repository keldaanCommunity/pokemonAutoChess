import { AttackType } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"
import { getAttackTimings } from "../attacking-state"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AttackCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class AmalgamateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Merge with the closest other Ditto ally on board, combining their max HP, current HP, ATK, DEF and SPE_DEF.
    const dittoAllies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter(
        (cell) =>
          cell.value !== undefined &&
          cell.value.team === pokemon.team &&
          cell.value.name === Pkm.DITTO &&
          cell.value.id !== pokemon.id
      )
      .map((cell) => cell.value as PokemonEntity)
    if (dittoAllies.length < 1) {
      // performs a regular attack instead
      pokemon.count.attackCount++
      const { delayBeforeShoot, travelTime } = getAttackTimings(pokemon)
      pokemon.commands.push(
        new AttackCommand(delayBeforeShoot + travelTime, pokemon, target, board)
      )
      return
    }
    const closestDitto = pickRandomIn(dittoAllies)

    const dittoAbsorbing = pokemon.hp > closestDitto.hp ? pokemon : closestDitto
    const dittoMerged = pokemon.hp > closestDitto.hp ? closestDitto : pokemon
    // Perform the amalgamation
    dittoAbsorbing.maxHP += dittoMerged.maxHP
    dittoAbsorbing.handleHeal(dittoMerged.hp, dittoAbsorbing, 0, false)
    dittoAbsorbing.addAttack(dittoMerged.atk, pokemon, 0, false)
    dittoAbsorbing.addDefense(dittoMerged.def, pokemon, 0, false)
    dittoAbsorbing.addSpecialDefense(dittoMerged.speDef, pokemon, 0, false)
    dittoMerged.handleSpecialDamage(9999, board, AttackType.TRUE, null, false)

    // if there's another ditto on board with items, try to get them ?
    while (dittoMerged.items.size > 0 && dittoAbsorbing.items.size < 3) {
      const itemToTransfer = dittoMerged.items.values().next().value
      if (itemToTransfer === undefined) break
      dittoMerged.removeItem(itemToTransfer)
      dittoAbsorbing.addItem(itemToTransfer)
    }
  }
}
