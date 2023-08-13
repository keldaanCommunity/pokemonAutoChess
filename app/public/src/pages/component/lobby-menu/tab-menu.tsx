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
import CurrentUsers from "../available-user-menu/current-users"

export default function TabMenu() {
  const dispatch = useAppDispatch()

  const { tabIndex, users } = useAppSelector((state) => ({
    tabIndex: state.lobby.tabIndex,
    users: state.lobby.users
  }))

  return (
    <Tabs
      className="nes-container user-menu hidden-scrollable"
      selectedIndex={tabIndex}
      onSelect={(i: number) => {
        dispatch(setTabIndex(i))
      }}
    >
      <TabList>
        <Tab>
          {t("online")}: {users.length}
        </Tab>
        <Tab>{t("elo")}</Tab>
        <Tab>{t("level")}</Tab>
        <Tab>{t("bots")}</Tab>
        <Tab>{t("search")}</Tab>
      </TabList>
      <TabPanel>
        <CurrentUsers />
      </TabPanel>
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
        <Search />
      </TabPanel>
    </Tabs>
  )
}
