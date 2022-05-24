import React from 'react'
import Profile from './profile'
import Search from './search'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setTabIndex } from '../../../stores/LobbyStore'
import BotLeaderboard from './bot-leaderboard'
import PlayerLeaderboard from './player-leaderboard'

export default function TabMenu() {
    const dispatch = useAppDispatch()

    const tabIndex: number = useAppSelector(state=>state.lobby.tabIndex)

    const cursorStyle = {
        cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        outline:'none',
        color:'white'
    }

    const tabStyle = {
        background:'url("assets/ui/shen.jpg")',
        margin:'10px',
        flexBasis:'30%',
        height:'90vh',
        overflowY:'scroll',
        backgroundSize: 'cover',
        color:'white'
    }

    return (
    <Tabs className="nes-container hidden-scrollable" style={tabStyle}
        selectedIndex={tabIndex} onSelect={(i: number) => dispatch(setTabIndex(i))}>
            <TabList>
                <Tab style={cursorStyle}>Players</Tab>
                <Tab style={cursorStyle}>Bots</Tab>
                <Tab style={cursorStyle}>Profile</Tab>
                <Tab style={cursorStyle}>Search</Tab>
            </TabList>
            <TabPanel>
                <PlayerLeaderboard/>
            </TabPanel>
            <TabPanel>
                <BotLeaderboard/>
            </TabPanel>
            <TabPanel>
                <Profile/>
            </TabPanel>
            <TabPanel>
                <Search/>
            </TabPanel>
        </Tabs>)
}