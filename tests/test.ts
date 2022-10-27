import { Pkm } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"

Object.values(Pkm).forEach((p) => {
  const pkm = PokemonFactory.createPokemonFromName(p)
  if(pkm.stars === 2 && pkm.final){
    console.log(pkm.name)
  }
})
