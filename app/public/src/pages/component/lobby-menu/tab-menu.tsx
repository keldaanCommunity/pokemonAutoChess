import React from "react"
import Profile from "./profile"
import Search from "./search"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import BotLeaderboard from "./bot-leaderboard"
import PlayerLeaderboard from "./player-leaderboard"
import LevelLeaderboard from "./level-leaderboard"
import { t } from "i18next"
import "react-tabs/style/react-tabs.css"
import "./tab-menu.css"

export default function TabMenu() {
  const dispatch = useAppDispatch()

  const tabIndex: number = useAppSelector((state) => state.lobby.tabIndex)

  return (
    <Tabs
      className="nes-container user-menu hidden-scrollable"
      selectedIndex={tabIndex}
      onSelect={(i: number) => {
        dispatch(setTabIndex(i))
      }}
    >
      <TabList>
        <Tab>{t("elo")}</Tab>
        <Tab>{t("level")}</Tab>
        <Tab>{t("bots")}</Tab>
        <Tab>{t("profile")}</Tab>
        <Tab>{t("search")}</Tab>
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
