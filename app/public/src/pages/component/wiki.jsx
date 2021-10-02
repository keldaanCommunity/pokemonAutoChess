import React, { Component } from 'react';
import WikiButton from './wiki-button';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { RARITY, RARITY_COLOR } from '../../../../models/enum';
import PokemonWiki from './pokemon-wiki';

class Wiki extends Component{

    render(){
        return <div>
            <WikiButton toggleWiki={this.props.toggleWiki} content='Lobby'/>
            <div className="nes-container" style={{backgroundColor:'white',opacity:0.9,margin:'10px'}}>
            <Tabs>
                <TabList>
                    {Object.keys(RARITY).map((r=>{
                        return <Tab key={'title-' + r} style={{color:RARITY_COLOR[r]}}>{r}</Tab>
                    }))}
                </TabList>

                {Object.keys(RARITY).map((r=>{
                    return <TabPanel key={r}>{r}
                        <PokemonWiki rarity={r}/>
                    </TabPanel>
                }))}
            </Tabs>
            </div>
        </div>
    }
}

export default Wiki;