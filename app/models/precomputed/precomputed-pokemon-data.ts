import { IPokemonData } from "../../types/interfaces/PokemonData"
import { Pkm, PkmFamily, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { mapToObj } from "../../utils/map"
import { values } from "../../utils/schemas"
import { precomputedPokemons } from "../../../gen/precomputed-pokemons"
import { Ability } from "../../types/enum/Ability"
import { Rarity } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"

console.time("precompute-pokemon-data")

const data = new Map<Pkm, Omit<IPokemonData, "name" | "index">>()

precomputedPokemons.forEach((pokemon) => {
  data.set(pokemon.name, {
    skill: pokemon.skill,
    passive: pokemon.passive,
    stars: pokemon.stars,
    rarity: pokemon.rarity,
    additional: pokemon.additional,
    regional: pokemon.regional,
    hp: pokemon.hp,
    range: pokemon.range,
    types: values(pokemon.types) as Synergy[],
    evolution: pokemon.evolution === Pkm.DEFAULT ? null : pokemon.evolution,
    evolutions: pokemon.evolutions,
    stages:
      pokemon.stages ??
      Math.max(
        ...precomputedPokemons
          .filter((p) => PkmFamily[p.name] === PkmFamily[pokemon.name])
          .filter((p) => p.skill !== Ability.DEFAULT)
          .map((p) => p.stars)
      )
  })
})

export const PRECOMPUTED_POKEMONS_DATA = mapToObj(data) as {
  [pkm in Pkm]?: Omit<IPokemonData, "name" | "index">
}

export const PRECOMPUTED_REGIONAL_MONS: Pkm[] = Object.values(Pkm)
  .filter((p) => {
    const { regional, skill, passive } = getPokemonData(p)
    return regional && (skill !== Ability.DEFAULT || passive !== Passive.NONE)
  })
  .sort((a, b) => getPokemonData(a).stars - getPokemonData(b).stars)

console.timeEnd("precompute-pokemon-data")

export function getPokemonData(name: Pkm): IPokemonData {
  if (name in PRECOMPUTED_POKEMONS_DATA)
    return { name, index: PkmIndex[name], ...PRECOMPUTED_POKEMONS_DATA[name]! }
  //console.error(`Precomputed data not found for ${name}`)
  return {
    name: Pkm.DEFAULT,
    index: PkmIndex[Pkm.DEFAULT],
    additional: false,
    regional: false,
    hp: 10,
    range: 1,
    rarity: Rarity.SPECIAL,
    stars: 1,
    stages: 1,
    skill: Ability.DEFAULT,
    passive: Passive.NONE,
    types: [],
    evolution: null,
    evolutions: []
  }
}
