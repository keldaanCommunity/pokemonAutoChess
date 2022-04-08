import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { RARITY_COLOR } from '../../../../../models/enum';
import { Rarity } from '../../../../../types/enum/Game';
import PokemonWiki from './wiki-pokemon';

class WikiContent extends Component{

    render(){
        
        return (

            <Tabs>
                <TabList>
                    {Object.keys(Rarity).filter((v) => isNaN(Number(v))).map( (r)=>{                        
                        return <Tab key={'title-' + r} style={{color:RARITY_COLOR[Rarity[r]]}}>{r}</Tab>
                    })}
                </TabList>

                {Object.keys(Rarity).filter((v) => isNaN(Number(v))).map( (r)=>{
                    return (
                        <TabPanel key={r}>
                            <PokemonWiki rarity={r}/>
                        </TabPanel>
                    )
                    
                })}
            </Tabs>
        )
    }
}

export default WikiContent;