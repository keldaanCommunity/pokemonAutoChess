import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ITEM } from '../../../../../models/enum';
import WikiItem from '../wiki-item';

class WikiItems extends Component{

    render(){
        return <Tabs>
        <TabList>
            {Object.keys(ITEM).map((r=>{
                return <Tab key={'title-' + r}> <img src={"assets/item/" + r + ".png"}></img></Tab>
            }))}
        </TabList>

        {Object.keys(ITEM).map((r=>{
            return <TabPanel key={r}>
                <WikiItem item={r}/>
            </TabPanel>
        }))}
    </Tabs>
    }
}

export default WikiItems;