import { DubiousGadgets } from "../../types/enum/Item"
import { pickNRandomIn, pickRandomIn } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GizmosAndGadgetsStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Distributes 4 random dubious tools to allies with free item slots. Each item given gives [50,SP] SHIELD to the ally receiving it.
    const nbGadgets = 4
    const allies = board.cells.filter<PokemonEntity>(
      (v): v is PokemonEntity => v != null && v.team === pokemon.team
    )

    const itemsToGive = pickNRandomIn(DubiousGadgets, nbGadgets)
    for (const item of itemsToGive) {
      const freeAllies = allies.filter((a) => a.items.size < 3)
      let allyToGive = pickRandomIn(freeAllies)
      if (!allyToGive) {
        // If not enough free item slots, random other items are dropped.
        const randomAlly = pickRandomIn(allies)
        const randomItem = pickRandomIn(schemaValues(randomAlly.items))
        randomAlly.removeItem(randomItem)
        allyToGive = randomAlly
      }

      allyToGive.addItem(item)
      allyToGive.addShield(50, pokemon, 1, true)
      pokemon.broadcastAbility({
        targetX: allyToGive.positionX,
        targetY: allyToGive.positionY,
        data: { item }
      })
    }
  }
}
