import PokemonCollectionItem from './pokemon-collection-item';
import PokemonFactory from '../../../../../models/pokemon-factory';
import React from 'react';
import { PKM, SPECIAL_SKILL } from '../../../../../models/enum';
import {useAppSelector} from '../../../hooks';
import tracker from '../../../../dist/client/assets/pokemons/tracker.json';
import { Convert } from '../../../../../types/ITracker';
import { Pokemon } from '../../../../../models/colyseus-models/pokemon';

const metadata = Convert.toITracker(JSON.stringify(tracker));

export default function PokemonCarousel(props: {type: string}){
    const pokemonCollection = useAppSelector(state=>state.lobby.user.pokemonCollection);
    const elligiblePokemons = [];
    Object.values(PKM).forEach(v=>{
        const pkm = PokemonFactory.createPokemonFromName(v);
        if(!(pkm.skill == SPECIAL_SKILL.DEFAULT || !pkm.types.includes(props.type))){
            elligiblePokemons.push(pkm);
        }
    });

    return <div style={{display:'flex', flexWrap:'wrap'}}>
        {elligiblePokemons.map(pkm=>{
        const pathIndex = pkm.index.split('-');
        let m;
            if(pathIndex.length == 1){
                m = metadata[pkm.index];
            }
            else if(pathIndex.length == 2){
                m = metadata[pathIndex[0]].subgroups[pathIndex[1]];
            }
            return <PokemonCollectionItem key={`${pkm.index}-${props.type}`} index={pkm.index} metadata={m} config={pokemonCollection.get(pkm.index)}/>;
        })}
    </div>
}