import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type GameState from "../../rooms/states/game-state"
import { Item } from "../../types"
import type { StateEvolutionRule } from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

type EvolutionCondition = (
  pokemon: Pokemon,
  player: Player,
  state: GameState
) => boolean

export class StateEvolutionHandler extends EvolutionHandler<[GameState]> {
  condition: EvolutionCondition
  constructor(evolutionRule: StateEvolutionRule) {
    super(evolutionRule)
    this.condition = evolutionRule.condition
  }

  canEvolve(pokemon: Pokemon, player: Player, state: GameState): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    if (player.board.has(pokemon.id) === false) return false
    return this.condition(pokemon, player, state)
  }

  evolve(pokemon: Pokemon, player: Player, state: GameState): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, state)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
