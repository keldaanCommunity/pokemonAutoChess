import type { MapSchema } from "@colyseus/schema"
import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type {
  EvolutionRuleType,
  PlacementEvolutionContext,
  PlacementEvolutionRule
} from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

type PlacementCondition = (
  pokemon: Pokemon,
  player: Player,
  board: MapSchema<Pokemon>
) => boolean

export class PlacementEvolutionHandler extends EvolutionHandler<EvolutionRuleType.PLACEMENT> {
  condition: PlacementCondition
  constructor(evolutionRule: PlacementEvolutionRule) {
    super(evolutionRule)
    this.condition = evolutionRule.condition
  }

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: PlacementEvolutionContext
  ): boolean {
    if (player.board.has(pokemon.id) === false) return false
    if (!context.board) return false
    return this.condition(pokemon, player, context.board)
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: PlacementEvolutionContext
  ): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
