import { precomputedPokemonsImplemented } from "../../../gen/precomputed-pokemons"
import { Ability } from "../../types/enum/Ability"
import { Pkm } from "../../types/enum/Pokemon"
import { mapToObj } from "../../utils/map"

const data = new Map<Ability, Pkm[]>()

Object.values(Ability).map((ability) => {
  data.set(
    ability,
    precomputedPokemonsImplemented
      .filter((pokemon) => pokemon.skill === ability)
      .map((pokemon) => pokemon.name)
  )
})

export const PRECOMPUTED_POKEMONS_PER_ABILITY = mapToObj(data) as {
  [key in Ability]: Pkm[]
}
