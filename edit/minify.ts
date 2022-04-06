import { PKM } from '../app/models/enum';
import fs from 'fs';
import PokemonFactory from '../app/models/pokemon-factory';

const pkmaIndexes = [];
const indexes = [];

function zeroPad(num: number) {
    return ('0000'+num).slice(-4);
}

Object.values(PKM).forEach(pkm => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    const zeroPaddedIndex = zeroPad(pokemon.index);
    if(!pkmaIndexes.includes(zeroPaddedIndex)){
        pkmaIndexes.push(zeroPaddedIndex);
    }
});

pkmaIndexes.forEach(id=>{
    try{
        const buffer = fs.readFileSync(`sheets/${id}.json`);
        const json = JSON.parse(buffer.toString());
        fs.writeFileSync(`sheets/${id}.json`, JSON.stringify(json, null, 0));
        indexes.push(id);
    }
    catch(error){
        console.log('error id#', id);
    }
});

console.log(JSON.stringify(indexes));