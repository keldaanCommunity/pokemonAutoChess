import PokemonFactory from '../app/models/pokemon-factory';
import {PKM} from '../app/models/enum';

Object.keys(PKM).forEach(k=>{
    const p = PokemonFactory.createPokemonFromName(PKM[k]);
    console.log(`"${PKM[k]}" = "${p.index}",`);
});