import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { RARITY, RARITY_COLOR } from '../../../../models/enum';
import PokemonWiki from './pokemon-wiki';

class WikiContent extends Component{

    render(){
        return <Tabs>
        <TabList>
            {Object.keys(RARITY).map((r=>{
                return <Tab key={'title-' + r} style={{color:RARITY_COLOR[r]}}>{r}</Tab>
            }))}
        </TabList>

        {Object.keys(RARITY).map((r=>{
            return <TabPanel key={r}>
                <PokemonWiki rarity={r}/>
            </TabPanel>
        }))}
    </Tabs>
    }
}

export default WikiContent;