import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import WikiType from './wiki-type';
import { Synergy } from '../../../../../types/enum/Synergy';

class WikiTypes extends Component{

    render(){
        return <Tabs>
        <TabList>
            {Object.keys(Synergy).map((r=>{
                console.log('synergies', r)
                return <Tab key={'title-' + r}> <img src={"assets/types/" + r + ".png"}></img></Tab>
            }))}
        </TabList>

        {Object.keys(Synergy).map((r=>{
            return <TabPanel key={r}>
                <WikiType type={Synergy[r]}/>
            </TabPanel>
        }))}
    </Tabs>
    }
}

export default WikiTypes;