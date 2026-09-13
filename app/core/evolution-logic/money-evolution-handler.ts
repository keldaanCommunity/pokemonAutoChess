import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Item } from "../../types"
import type { MoneyEvolutionRule } from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

export class MoneyEvolutionHandler extends EvolutionHandler<[number]> {
  moneyRequired: number
  constructor(evolutionRule: MoneyEvolutionRule) {
    super(evolutionRule)
    this.moneyRequired = evolutionRule.moneyRequired
  }

  canEvolve(pokemon: Pokemon, player: Player, money: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    if (player.board.has(pokemon.id) === false) return false
    return money >= this.moneyRequired
  }

  evolve(pokemon: Pokemon, player: Player, money: number): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, money)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
