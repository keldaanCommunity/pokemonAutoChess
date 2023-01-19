import React from "react"
import Profile from "./profile"
import Search from "./search"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import BotLeaderboard from "./bot-leaderboard"
import PlayerLeaderboard from "./player-leaderboard"
import LevelLeaderboard from "./level-leaderboard"
import "react-tabs/style/react-tabs.css"
import "./tab-menu.css";

export default function TabMenu() {
  const dispatch = useAppDispatch()

  const tabIndex: number = useAppSelector((state) => state.lobby.tabIndex)

  return (
    <Tabs
      className="nes-container user-menu hidden-scrollable"
      selectedIndex={tabIndex}
      onSelect={(i: number) => dispatch(setTabIndex(i))}
    >
      <TabList>
        <Tab>Elo</Tab>
        <Tab>Level</Tab>
        <Tab>Bots</Tab>
        <Tab>Profile</Tab>
        <Tab>Search</Tab>
      </TabList>
      <TabPanel>
        <PlayerLeaderboard />
      </TabPanel>
      <TabPanel>
        <LevelLeaderboard />
      </TabPanel>
      <TabPanel>
        <BotLeaderboard />
      </TabPanel>
      <TabPanel>
        <Profile />
      </TabPanel>
      <TabPanel>
        <Search />
      </TabPanel>
    </Tabs>
  )
}
