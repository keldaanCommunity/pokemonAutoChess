import PokemonFactory from '../app/models/pokemon-factory'
import {Pkm} from '../app/types/enum/Pokemon'

Object.keys(Pkm).forEach(k=>{
    const p = PokemonFactory.createPokemonFromName(Pkm[k])
    console.log(`"${Pkm[k]}" = "${p.index}",`)
})