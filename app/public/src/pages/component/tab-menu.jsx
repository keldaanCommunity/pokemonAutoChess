import React, { Component } from 'react';
import Leaderboard from './leaderboard';
import Profile from './profile';
import Search from './search';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class TabMenu extends Component {

    constructor(){
        super();
    }

    render() {

        const cursorStyle = {
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
        }

        const tabStyle = {
            backgroundColor: 'rgba(255, 255, 255, .6)',
            margin:'10px',
            flexBasis:'30%',
            height:'90vh',
            overflowY:'scroll'
        }
        return (
        <Tabs className="nes-container" style={tabStyle}
            selectedIndex={this.props.tabIndex} onSelect={i => this.props.setTabIndex(i)}>
                <TabList>
                    <Tab style={cursorStyle}>Leaderboard</Tab>
                    <Tab style={cursorStyle}>Profile</Tab>
                    <Tab style={cursorStyle}>Search</Tab>
                </TabList>

                <TabPanel>
                    <Leaderboard
                        infos={this.props.leaderboard}
                        displayInfo={this.props.displayInfo}
                    />
                </TabPanel>
                <TabPanel>
                    <Profile 
                        user={this.props.user}
                        changeAvatar={this.props.changeAvatar}
                        changeName={this.props.changeName}
                    />
                </TabPanel>
                <TabPanel>
                    <Search
                        searchName={this.props.searchName}
                        user={this.props.searchedUser}
                    />
                </TabPanel>
            </Tabs>
        );
  }
}
export default TabMenu;