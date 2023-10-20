import PokemonFactory from "../app/models/pokemon-factory"
import { Ability } from "../app/types/enum/Ability"
import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"
import { mapToObj } from "../app/utils/map"

const data = new Map<Ability, Pkm[]>()

Object.values(Ability).map((v) => {
  data.set(
    v,
    Object.values(Pkm)
      .filter((p) => p !== Pkm.DEFAULT)
      .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
      .filter((pokemon) => pokemon.skill === v)
      .map((pokemon) => pokemon.name)
  )
})

fs.writeFileSync(
  "../app/models/precomputed/ability.json",
  JSON.stringify(mapToObj(data))
)
