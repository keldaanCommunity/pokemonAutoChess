import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CDN_URL } from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';
import PokemonDetail from './wiki-pokemon-detail';
import { Emotion } from '../../../../../types';
import PRECOMPUTED_RARITY_POKEMONS_ALL from '../../../../../models/precomputed/type-rarity-all.json';
import tracker from '../../../../dist/client/assets/pokemons/tracker.json';
import { Convert } from '../../../../../public/dist/client/assets/pokemons/ITracker';
import { Rarity } from '../../../../../types/enum/Game';

const metadata = Convert.toITracker(JSON.stringify(tracker));
let credits;

export default function PokemonWiki(props: {rarity: Rarity}){
    return (            
        <Tabs>
            <TabList>
                {PRECOMPUTED_RARITY_POKEMONS_ALL[props.rarity].map((pkm=>{
                    const pokemon = PokemonFactory.createPokemonFromName(pkm);
                    return <Tab key={'title-' + pkm}>
                        <img src={`${CDN_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}></img>
                    </Tab>
                }))}
            </TabList>
    
            {PRECOMPUTED_RARITY_POKEMONS_ALL[props.rarity].map((pkm=>{
                let m;
                const pokemon = PokemonFactory.createPokemonFromName(pkm);
                const pathIndex = pokemon.index.split('-');
                if(pathIndex.length == 1){
                    m = metadata[pokemon.index];
                }
                else if(pathIndex.length == 2){
                    m = metadata[pathIndex[0]].subgroups[pathIndex[1]];
                }
                return <TabPanel key={pkm}>
                    <PokemonDetail pokemon={pkm} m={m}/>
                </TabPanel>
            }))}
        </Tabs>
        );
}