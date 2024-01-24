import React from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTabIndex } from "../../../stores/LobbyStore"
import BotLeaderboard from "./bot-leaderboard"
import LevelLeaderboard from "./level-leaderboard"
import PlayerLeaderboard from "./player-leaderboard"
import "./tab-menu.css"

export default function TabMenu() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const tabIndex: number = useAppSelector((state) => state.lobby.tabIndex)

  return (
    <Tabs
      className="nes-container user-menu custom-bg hidden-scrollable"
      selectedIndex={tabIndex}
      onSelect={(i: number) => {
        dispatch(setTabIndex(i))
      }}
    >
      <h1>{t("leaderboard")}</h1>
      <TabList>
        <Tab>{t("elo")}</Tab>
        <Tab>{t("level")}</Tab>
        <Tab>{t("bots")}</Tab>
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
    </Tabs>
  )
}
