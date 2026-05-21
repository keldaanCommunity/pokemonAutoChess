import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Item } from "../../types"
import type { ItemEvolutionRule } from "../../types/EvolutionRules"
import { schemaValues } from "../../utils/schemas"
import { EvolutionHandler } from "./evolution-handler"

export class ItemEvolutionHandler extends EvolutionHandler {
  itemsTriggeringEvolution: Item[]

  constructor(evolutionRule: ItemEvolutionRule) {
    super(evolutionRule)
    this.itemsTriggeringEvolution = evolutionRule.itemsTriggeringEvolution
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    const itemsAndDishes = schemaValues(pokemon.items).concat(
      schemaValues(pokemon.dishes)
    )
    const itemEvolution = itemsAndDishes.find((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )

    const pokemonEvolutionName = this.getEvolution(
      pokemon,
      player,
      itemEvolution
    )
    return itemEvolution != null && pokemonEvolutionName !== pokemon.name
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    const itemEvolution = schemaValues(pokemon.items).find((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )
    const pokemonEvolutionName = this.getEvolution(
      pokemon,
      player,
      itemEvolution
    )
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
