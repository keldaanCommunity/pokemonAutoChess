import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CDN_PORTRAIT_URL } from '../../../../../types';
import PokemonFactory from '../../../../../models/pokemon-factory';
import WikiPokemonDetail from './wiki-pokemon-detail';
import { Emotion, PrecomputedRaritPokemonyAll } from '../../../../../types';
import { ITracker } from '../../../../../types/ITracker';
import PRECOMPUTED_RARITY_POKEMONS_ALL from '../../../../../models/precomputed/type-rarity-all.json';
import tracker from '../../../../dist/client/assets/pokemons/tracker.json';
import { Rarity } from '../../../../../types/enum/Game';

const metadata = tracker as unknown as { [key: string]: ITracker };
const precomputed = PRECOMPUTED_RARITY_POKEMONS_ALL as PrecomputedRaritPokemonyAll;

export default function WikiPokemon(props: {rarity: Rarity}){
    return (            
        <Tabs>
            <TabList>
                {precomputed[props.rarity].map((pkm=>{
                    const pokemon = PokemonFactory.createPokemonFromName(pkm);
                    return <Tab key={'title-' + pkm}>
                        <img src={`${CDN_PORTRAIT_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}></img>
                    </Tab>
                }))}
            </TabList>
    
            {precomputed[props.rarity].map((pkm=>{
                let m: ITracker | undefined = undefined;
                const pokemon = PokemonFactory.createPokemonFromName(pkm);
                const pathIndex = pokemon.index.split('-');
                if(pathIndex.length == 1){
                    m = metadata[pokemon.index];
                }
                else if(pathIndex.length == 2){
                    m = metadata[pathIndex[0]].subgroups[pathIndex[1]];
                }
                return <TabPanel key={pkm}>
                    <WikiPokemonDetail pokemon={pkm} m={m}/>
                </TabPanel>
            }))}
        </Tabs>
        );
}