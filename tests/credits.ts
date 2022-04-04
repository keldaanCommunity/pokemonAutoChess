import {PKM} from '../app/models/enum';
import PokemonFactory from '../app/models/pokemon-factory';

const t = {};

Object.keys(PKM).forEach(key=>{
    const p = PokemonFactory.createPokemonFromName(PKM[key]);
    t[PKM[key]] = p.author;

});

console.log(t);