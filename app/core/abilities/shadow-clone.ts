import PokemonFactory from "../../models/pokemon-factory"
import type { Item } from "../../types/enum/Item"
import { min } from "../../utils/number"
import { pickRandomIn } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ShadowCloneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const spawnPosition = board.getClosestAvailablePlace(
      pokemon.positionX,
      pokemon.positionY
    )

    if (spawnPosition) {
      const p = PokemonFactory.createPokemonFromName(pokemon.name, {
        emotion: pokemon.emotion,
        shiny: pokemon.shiny
      })
      let itemStolen: Item | null = null
      if (target.items.size > 0) {
        itemStolen = pickRandomIn(schemaValues(target.items))
        target.removeItem(itemStolen)
      }

      const clone = pokemon.simulation.addPokemon(
        p,
        spawnPosition.x,
        spawnPosition.y,
        pokemon.team,
        true
      )
      const hpPct = [0.5, 0.5, 0.9, 1.0][pokemon.stars - 1] ?? 1.0
      clone.maxHP = min(1)(
        Math.ceil(
          hpPct *
            pokemon.maxHP *
            (1 + pokemon.ap / 100) *
            (crit ? pokemon.critPower : 1)
        )
      )
      clone.hp = clone.maxHP
      if (itemStolen) clone.addItem(itemStolen)
    }
  }
}
