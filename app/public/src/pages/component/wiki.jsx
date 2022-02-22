import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import WikiButton from './wiki-button';
import WikiContent from './wiki-content';
import WikiItems from './wiki-items';
import WikiTypes from './wiki-types';
import WikiFaq from './wiki-faq';
import WikiItemsCheatSheet from './wiki-items-cheat-sheet';

class Wiki extends Component{

    render(){
        return <div>
            <WikiButton toggleWiki={this.props.toggleWiki} content='Lobby'/>
            <div className="nes-container" style={{backgroundColor:'white',opacity:0.9,margin:'10px'}}>
            <Tabs>
                <TabList>
                    <Tab key='title-faq'>FAQ</Tab>
                    <Tab key='title-pokemon'>POKEMONS</Tab>
                    <Tab key='title-items'>ITEMS</Tab>
                    <Tab key='title-items-cheatsheet'>ITEMS CHEATSHEET</Tab>
                    <Tab key='title-types'>SYNERGIES</Tab>
                </TabList>

                <TabPanel key='faq'>
                    <WikiFaq/>
                </TabPanel>
                <TabPanel key='pokemon'>
                    <WikiContent/>
                </TabPanel>
                <TabPanel key='items'>
                    <WikiItems/>
                </TabPanel>
                <TabPanel key='items-cheatsheet'>
                    <WikiItemsCheatSheet/>
                </TabPanel>
                <TabPanel key='types'>
                    <WikiTypes/>
                </TabPanel>
            </Tabs>
            </div>
        </div>
    }
}

export default Wiki;