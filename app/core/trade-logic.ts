import { type IPokemon, ItemComponents, ShinyItems } from "../types"
import { Rarity } from "../types/enum/Game"
import { NonPkm } from "../types/enum/Pokemon"
import { isIn } from "../utils/array"
import { schemaValues } from "../utils/schemas"

export function canBeTraded(pokemon: IPokemon | null): boolean {
  return pokemon != null && NonPkm.includes(pokemon.name) === false
}

export function computeTradeCooldown(
  pokemonA: IPokemon,
  pokemonB: IPokemon
): number {
  const baseCooldown = 4

  const itemsCooldown = [
    ...schemaValues(pokemonA.items),
    ...schemaValues(pokemonB.items)
  ].reduce((total, item) => {
    if (isIn(ItemComponents, item)) return total + 1
    if (isIn(ShinyItems, item)) return total + 6
    return total + 2
  }, 0)

  const rarityCooldown =
    rarityCooldowns[pokemonA.rarity] + rarityCooldowns[pokemonB.rarity]

  const starCooldown =
    starCooldowns[pokemonA.stars - 1] + starCooldowns[pokemonB.stars - 1]

  return Math.round(
    (baseCooldown + itemsCooldown + rarityCooldown + starCooldown) / 2
  )
}

export const rarityCooldowns: Record<Rarity, number> = {
  [Rarity.SPECIAL]: 3,
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 1,
  [Rarity.RARE]: 2,
  [Rarity.EPIC]: 3,
  [Rarity.ULTRA]: 4,
  [Rarity.HATCH]: 3,
  [Rarity.UNIQUE]: 5,
  [Rarity.LEGENDARY]: 10
}

export const starCooldowns = [0, 1, 2, 3, 5]
