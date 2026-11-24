import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type GameState from "../../rooms/states/game-state"
import type {
  EvolutionRuleType,
  StateEvolutionContext,
  StateEvolutionRule
} from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

type EvolutionCondition = (
  pokemon: Pokemon,
  player: Player,
  state: GameState
) => boolean

export class StateEvolutionHandler extends EvolutionHandler<EvolutionRuleType.STATE> {
  condition: EvolutionCondition
  constructor(evolutionRule: StateEvolutionRule) {
    super(evolutionRule)
    this.condition = evolutionRule.condition
  }

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: StateEvolutionContext
  ): boolean {
    if (player.board.has(pokemon.id) === false) return false
    if (!context.state) return false
    return this.condition(pokemon, player, context.state)
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: StateEvolutionContext
  ): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
