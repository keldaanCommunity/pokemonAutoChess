import fs from "fs"
import { Ability } from "../app/types/enum/Ability"
import { Passive } from "../app/types/enum/Passive"
import { Pkm } from "../app/types/enum/Pokemon"
import { mapToObj } from "../app/utils/map"
import { precomputedPokemons } from "./precomputed-pokemons"

console.time("precompute-ability")

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

fs.writeFileSync(
  "../app/models/precomputed/pokemons-per-ability.json",
  JSON.stringify(mapToObj(data))
)

console.timeEnd("precompute-ability")
