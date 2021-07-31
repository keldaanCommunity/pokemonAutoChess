import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Tileset from './tileset';
import { MAP_TYPE } from '../../../../models/enum';

class TilesetMenu extends Component {
  render() {
    return (
    <Tabs>
        <TabList>
            {Object.keys(MAP_TYPE).map(this.createTab.bind(this))}
        </TabList>
        {Object.keys(MAP_TYPE).map(this.createTabPanel.bind(this))}
    </Tabs>
    );
  }

  createTab(type){
    return (
        <Tab>{type}</Tab>
    );
  }

  createTabPanel(type){
    return(
        <TabPanel>
            <Tileset type={type} wins={this.props.mapWin[type]} changeMap={this.props.changeMap}/>
        </TabPanel>
    );
  }
}
export default TilesetMenu;



