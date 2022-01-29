import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { PRECOMPUTED_RARITY_POKEMONS_ALL } from '../../../../models/enum';
import PokemonFactory from '../../../../models/pokemon-factory';
import PokemonDetail from './pokemon-detail';

class PokemonWiki extends Component {
  render() {
    return (            
    <Tabs>
        <TabList>
            {PRECOMPUTED_RARITY_POKEMONS_ALL[this.props.rarity].map((pkm=>{
                let pokemon = PokemonFactory.createPokemonFromName(pkm);
                return <Tab key={'title-' + pkm}>
                    <img src={"assets/avatar/" + pokemon.name + ".png"}></img>
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
