import React from "react"
import Profile from "./profile"
import Search from "./search"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import BotLeaderboard from "./bot-leaderboard"
import PlayerLeaderboard from "./player-leaderboard"
import LevelLeaderboard from "./level-leaderboard"

export default function TabMenu() {
  const dispatch = useAppDispatch()

  const tabIndex: number = useAppSelector((state) => state.lobby.tabIndex)

  const cursorStyle = {
    cursor: "var(--cursor-hover)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    outline: "none",
    color: "white",
    fontSize: "1.5vw"
  }

  const tabStyle = {
    background: 'url("assets/ui/back2.png")',
    margin: "10px",
    flexBasis: "30%",
    height: "90vh",
    overflowY: "scroll",
    backgroundSize: "cover",
    color: "white"
  }

  return (
    <Tabs
      className="nes-container hidden-scrollable"
      style={tabStyle}
      selectedIndex={tabIndex}
      onSelect={(i: number) => dispatch(setTabIndex(i))}
    >
      <TabList>
        <Tab style={cursorStyle}>Elo</Tab>
        <Tab style={cursorStyle}>Level</Tab>
        <Tab style={cursorStyle}>Bots</Tab>
        <Tab style={cursorStyle}>Profile</Tab>
        <Tab style={cursorStyle}>Search</Tab>
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
