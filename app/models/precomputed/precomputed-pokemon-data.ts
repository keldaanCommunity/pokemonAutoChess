import { Ability } from "../../types/enum/Ability"
import { Rarity } from "../../types/enum/Game"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmFamily, PkmIndex } from "../../types/enum/Pokemon"
import type { Synergy } from "../../types/enum/Synergy"
import type { IPokemonData } from "../../types/interfaces/PokemonData"
import { mapToObj } from "../../utils/map"
import { schemaValues } from "../../utils/schemas"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-pokemon-data")

const data = new Map<Pkm, Omit<IPokemonData, "name" | "index">>()

function canEvolveInto(pkm: Pkm, targetEvolution: Pkm): boolean {
  const pokemon = precomputedPokemons.find((p) => p.name === pkm)
  if (!pokemon) return false
  if (pokemon.evolution === Pkm.DEFAULT && pokemon.evolutions.length === 0)
    return false
  if (pokemon.evolution === targetEvolution) return true
  if (pokemon.evolutions.includes(targetEvolution)) return true
  if (
    pokemon.evolution !== Pkm.DEFAULT &&
    pokemon.evolution != null &&
    pokemon.evolution !== pkm
  ) {
    return canEvolveInto(pokemon.evolution, targetEvolution)
  }
  if (pokemon.evolutions.length > 0) {
    for (const evolution of pokemon.evolutions) {
      if (canEvolveInto(evolution, targetEvolution)) return true
    }
  }
  return false
}

precomputedPokemons.forEach((pokemon) => {
  const familyMembers = [...precomputedPokemons].filter(
    (p) =>
      PkmFamily[p.name] === PkmFamily[pokemon.name] &&
      p.skill !== Ability.DEFAULT
  )

  const stages = Math.max(
    ...familyMembers
      .filter((p) => {
        /*console.log(
          `Checking if ${pokemon.name} can evolve into ${p.name}`,
          canEvolveInto(pokemon.name, p.name)
        )*/
        return canEvolveInto(pokemon.name, p.name)
      })
      .map((p) => p.stars),
    pokemon.stars
  )

  data.set(pokemon.name, {
    skill: pokemon.skill,
    passive: pokemon.passive,
    stars: pokemon.stars,
    rarity: pokemon.rarity,
    additional: pokemon.additional,
    regional: pokemon.regional,
    hp: pokemon.hp,
    pp: pokemon.maxPP,
    range: pokemon.range,
    types: schemaValues(pokemon.types) as Synergy[],
    evolution: pokemon.evolution === Pkm.DEFAULT ? null : pokemon.evolution,
    evolutions: pokemon.evolutions,
    stages
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
    pp: 100,
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

export function getRegularsTier1(pokemons: Pkm[]) {
  return pokemons.filter((p) => {
    const pokemonData = getPokemonData(p)
    return (
      pokemonData.stars === 1 &&
      pokemonData.skill !== Ability.DEFAULT &&
      !pokemonData.additional &&
      !pokemonData.regional
    )
  })
}

export function getAdditionalsTier1(pokemons: Pkm[]) {
  return pokemons.filter((p) => {
    const pokemonData = getPokemonData(p)
    return (
      pokemonData.stars === 1 &&
      pokemonData.skill !== Ability.DEFAULT &&
      pokemonData.additional &&
      !pokemonData.regional
    )
  })
}
