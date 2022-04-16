import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { PRECOMPUTED_RARITY_POKEMONS_ALL, CDN_URL } from '../../../../../models/enum';
import PokemonFactory from '../../../../../models/pokemon-factory';
import PokemonDetail from '../pokemon-detail';
import { Emotion } from '../../../../../types';

class PokemonWiki extends Component {
  render() {
    return (            
    <Tabs>
        <TabList>
            {PRECOMPUTED_RARITY_POKEMONS_ALL[this.props.rarity].map((pkm=>{
                let pokemon = PokemonFactory.createPokemonFromName(pkm);
                return <Tab key={'title-' + pkm}>
                    <img src={`${CDN_URL}${pokemon.index.replace('-','/')}/${Emotion.NORMAL}.png`}></img>
                </Tab>
            }))}
        </TabList>

        {PRECOMPUTED_RARITY_POKEMONS_ALL[this.props.rarity].map((pkm=>{
            return <TabPanel key={pkm}>
                <PokemonDetail pokemon={pkm}/>
            </TabPanel>
        }))}
    </Tabs>
    );
  }
}
export default PokemonWiki;
