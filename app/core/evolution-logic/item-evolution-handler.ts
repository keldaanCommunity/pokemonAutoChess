import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type { Item } from "../../types"
import type {
  EvolutionType,
  ItemEvolutionContext,
  ItemEvolutionRule
} from "../../types/EvolutionRules"
import { schemaValues } from "../../utils/schemas"
import { EvolutionHandler } from "./evolution-handler"

export class ItemEvolutionHandler extends EvolutionHandler<EvolutionType.ITEM> {
  itemsTriggeringEvolution: Item[]

  constructor(evolutionRule: ItemEvolutionRule) {
    super(evolutionRule)
    this.itemsTriggeringEvolution = evolutionRule.itemsTriggeringEvolution
  }

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: ItemEvolutionContext
  ): boolean {
    const itemsAndDishes = schemaValues(pokemon.items).concat(
      schemaValues(pokemon.dishes)
    )
    const itemEvolution = itemsAndDishes.find((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )

    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    return itemEvolution != null && pokemonEvolutionName !== pokemon.name
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: ItemEvolutionContext
  ): Pokemon {
    const item =
      schemaValues(pokemon.items).find((item) =>
        this.itemsTriggeringEvolution.includes(item)
      ) ?? context.item
    const pokemonEvolutionName = this.getEvolution(pokemon, player, {
      ...context,
      item
    })
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
