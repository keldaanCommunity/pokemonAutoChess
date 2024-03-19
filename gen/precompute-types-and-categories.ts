import fs from "fs"
import { RarityCost } from "../app/types/Config"
import { Ability } from "../app/types/enum/Ability"
import { Rarity } from "../app/types/enum/Game"
import { Passive } from "../app/types/enum/Passive"
import { Pkm, PkmFamily } from "../app/types/enum/Pokemon"
import { Synergy } from "../app/types/enum/Synergy"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-types-and-categories")

const data: Partial<
  Record<
    Synergy,
    {
      pokemons: Pkm[]
      uniquePokemons: Pkm[]
      legendaryPokemons: Pkm[]
      additionalPokemons: Pkm[]
      specialPokemons: Pkm[]
    }
  >
> = {}

precomputedPokemons
  .filter(
    (pokemon) =>
      pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE
  )
  .forEach((pokemon) => {
    pokemon.types.forEach((type: Synergy) => {
      if (type in data === false) {
        data[type] = {
          pokemons: [],
          uniquePokemons: [],
          legendaryPokemons: [],
          additionalPokemons: [],
          specialPokemons: []
        }
      }

      if (pokemon.rarity === Rarity.UNIQUE) {
        data[type]!.uniquePokemons.push(pokemon.name)
      } else if (pokemon.rarity === Rarity.LEGENDARY) {
        data[type]!.legendaryPokemons.push(pokemon.name)
      } else if (pokemon.rarity === Rarity.SPECIAL) {
        data[type]!.specialPokemons.push(pokemon.name)
      } else if (pokemon.additional) {
        if (!data[type]!.additionalPokemons.includes(PkmFamily[pokemon.name])) {
          data[type]!.additionalPokemons.push(pokemon.name)
        }
      } else if (!data[type]!.pokemons.includes(PkmFamily[pokemon.name])) {
        data[type]!.pokemons.push(pokemon.name)
      }
    })
  })

const sortByRarity = (a, b) => RarityCost[a.rarity] - RarityCost[b.rarity]

Object.keys(data).forEach((type) => {
  data[type].pokemons.sort(sortByRarity)
  data[type].additionalPokemons.sort(sortByRarity)
})

//logger.debug(data)

fs.writeFileSync(
  "../app/models/precomputed/pokemons-per-type-and-category.json",
  JSON.stringify(data)
)

console.timeEnd("precompute-types-and-categories")
