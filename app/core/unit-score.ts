import { RarityCost } from "../config/game/shop"
import type { IPokemon, IPokemonEntity } from "../types"
import { pickRandomIn } from "../utils/random"

export function getUnitScore(pokemon: IPokemonEntity | IPokemon) {
  let score = 0
  score += 100 * pokemon.items.size
  score += 10 * pokemon.stars
  score += RarityCost[pokemon.rarity]
  return score
}

export function getStrongestUnit<T extends IPokemon | IPokemonEntity>(
  pokemons: T[]
): T {
  /*
    strongest is defined as:
    1) number of items
    2) stars level
    3) rarity cost
    */
  const pokemonScores = pokemons.map((pokemon) => getUnitScore(pokemon))
  const bestScore = Math.max(...pokemonScores)
  return pickRandomIn(pokemons.filter((p, i) => pokemonScores[i] === bestScore))
}
