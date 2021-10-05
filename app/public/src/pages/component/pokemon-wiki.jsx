import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { PKM, RARITY } from '../../../../models/enum';
import PokemonFactory from '../../../../models/pokemon-factory';
import PokemonDetail from './pokemon-detail';

class PokemonWiki extends Component {
  render() {
    return (            
    <Tabs>
        <TabList>
            {Object.values(PKM).map((pkm=>{
                let pokemon = PokemonFactory.createPokemonFromName(pkm);
                if(pokemon.rarity == this.props.rarity){
                    return <Tab key={'title-' + pkm}>
                        <img src={"assets/avatar/" + pokemon.name + ".png"}></img>
                    </Tab>
                }
            }))}
        </TabList>

        {Object.values(PKM).map((pkm=>{
            let pokemon = PokemonFactory.createPokemonFromName(pkm);
            if(pokemon.rarity == this.props.rarity){
                return <TabPanel key={pkm}>
                    <PokemonDetail pokemon={pkm}/>
                </TabPanel>
            }
        }))}
    </Tabs>
    );
  }
}
export default PokemonWiki;
