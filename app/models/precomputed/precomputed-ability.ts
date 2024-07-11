import { Ability } from "../../types/enum/Ability"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { mapToObj } from "../../utils/map"
import { precomputedPokemons } from "../../../gen/precomputed-pokemons"

const data = new Map<Ability, Pkm[]>()

Object.values(Ability).map((ability) => {
  data.set(
    ability,
    precomputedPokemons
      .filter(
        (pokemon) =>
          pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE
      )
      .filter((pokemon) => pokemon.skill === ability)
      .map((pokemon) => pokemon.name)
  )
})

export const PRECOMPUTED_POKEMONS_PER_ABILITY = mapToObj(data) as {
  [key in Ability]: Pkm[]
}
