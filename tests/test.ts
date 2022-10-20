import { Pkm } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"

Object.values(Pkm).forEach((p) => {
  const n1 = p
  const n2 = PokemonFactory.createPokemonFromName(p).name
  if (n1 != n2) {
    console.log(n1, n2)
  }
})
