import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { TYPE } from '../../../../models/enum';
import WikiType from './wiki-type';

class WikiTypes extends Component{

    render(){
        return <Tabs>
        <TabList>
            {Object.keys(TYPE).map((r=>{
                return <Tab key={'title-' + r}> <img src={"assets/types/" + r + ".png"}></img></Tab>
            }))}
        </TabList>

        {Object.keys(TYPE).map((r=>{
            return <TabPanel key={r}>
                <WikiType type={r}/>
            </TabPanel>
        }))}
    </Tabs>
    }
}

export default WikiTypes;