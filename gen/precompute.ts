import { Ability } from "../app/types/enum/Ability"
import { Rarity } from "../app/types/enum/Game"
import { Pkm, PkmFamily } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"
import fs from "fs"
import { Synergy } from "../app/types/enum/Synergy"
import { logger } from "../app/utils/logger"

const data: Partial<
  Record<
    Synergy,
    {
      pokemons: Pkm[]
      uniquePokemons: Pkm[]
      legendaryPokemons: Pkm[]
      mythicalPokemons: Pkm[]
      additionalPokemons: Pkm[]
    }
  >
> = {}

Object.values(Pkm).forEach((pkm) => {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)

  // ignore specials and pokemons not implemented yet
  if (pokemon.rarity === Rarity.SPECIAL || pokemon.skill === Ability.DEFAULT)
    return

  pokemon.types.forEach((type: Synergy) => {
    if (type in data === false) {
      data[type] = {
        pokemons: [],
        uniquePokemons: [],
        legendaryPokemons: [],
        mythicalPokemons: [],
        additionalPokemons: []
      }
    }

    if (pokemon.rarity === Rarity.UNIQUE) {
      data[type]!.uniquePokemons.push(pokemon.name)
    } else if (pokemon.rarity === Rarity.LEGENDARY) {
      data[type]!.legendaryPokemons.push(pokemon.name)
    } else if (pokemon.rarity === Rarity.MYTHICAL) {
      data[type]!.mythicalPokemons.push(pokemon.name)
    } else if (pokemon.additional) {
      if (!data[type]!.additionalPokemons.includes(PkmFamily[pkm])) {
        data[type]!.additionalPokemons.push(pokemon.name)
      }
    } else if (!data[type]!.pokemons.includes(PkmFamily[pkm])) {
      data[type]!.pokemons.push(pokemon.name)
    }
  })
})

Object.keys(data).forEach((type) => {
  const sortByRarity = (a, b) => {
    const aIndex = PokemonFactory.getBuyPrice(a)
    const bIndex = PokemonFactory.getBuyPrice(b)
    return aIndex - bIndex
  }
  data[type].pokemons.sort(sortByRarity)
  data[type].additionalPokemons.sort(sortByRarity)
})

logger.debug(data)

fs.writeFileSync(
  "../app/models/precomputed/type-pokemons.json",
  JSON.stringify(data)
)
