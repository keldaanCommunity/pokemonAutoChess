import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type {
  EvolutionType,
  MoneyEvolutionContext,
  MoneyEvolutionRule
} from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

export class MoneyEvolutionHandler extends EvolutionHandler<EvolutionType.MONEY> {
  moneyRequired: number
  constructor(evolutionRule: MoneyEvolutionRule) {
    super(evolutionRule)
    this.moneyRequired = evolutionRule.moneyRequired
  }

  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: MoneyEvolutionContext
  ): boolean {
    if (player.board.has(pokemon.id) === false) return false
    return context.money !== undefined && context.money >= this.moneyRequired
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: MoneyEvolutionContext
  ): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
