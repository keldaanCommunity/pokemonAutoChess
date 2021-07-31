import React, { Component } from 'react';
import Leaderboard from './leaderboard';
import Profile from './profile';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class TabMenu extends Component {
  render() {
    return (
    <Tabs className="nes-container" style={{
        backgroundColor: 'rgba(255, 255, 255, .6)',
        margin:'10px',
        flexBasis:'30%'
        }}>
            <TabList>
            <Tab>Leaderboard</Tab>
            <Tab>Profile</Tab>
            </TabList>

            <TabPanel>
                <Leaderboard
                    infos={this.props.leaderboard}
                />
            </TabPanel>
            <TabPanel>
                <Profile 
                    user={this.props.user}
                    changeAvatar={this.props.changeAvatar}
                    changeName={this.props.changeName}
                />
            </TabPanel>
        </Tabs>
    );
  }
}
export default TabMenu;