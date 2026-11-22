import type { MapSchema } from "@colyseus/schema"
import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Item } from "../../types"
import type { PlacementEvolutionRule } from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

type PlacementCondition = (
  pokemon: Pokemon,
  player: Player,
  board: MapSchema<Pokemon>
) => boolean

export class PlacementEvolutionHandler extends EvolutionHandler<
  [MapSchema<Pokemon>]
> {
  condition: PlacementCondition
  constructor(evolutionRule: PlacementEvolutionRule) {
    super(evolutionRule)
    this.condition = evolutionRule.condition
  }

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    board: MapSchema<Pokemon>
  ): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    if (player.board.has(pokemon.id) === false) return false
    return this.condition(pokemon, player, board)
  }

  evolve(pokemon: Pokemon, player: Player, board: MapSchema<Pokemon>): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, board)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
