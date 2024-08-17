import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setBotLeaderboard, setLeaderboard, setLevelLeaderboard, setTabIndex } from "../../../stores/LobbyStore"
import BotLeaderboard from "./bot-leaderboard"
import LevelLeaderboard from "./level-leaderboard"
import PlayerLeaderboard from "./player-leaderboard"
import "./leaderboard-menu.css"

export default function LeaderboardMenu() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const tabIndex: number = useAppSelector((state) => state.lobby.tabIndex)

  useEffect(() => {
    fetch("/leaderboards").then(res => res.json()).then(data => {
      dispatch(setLeaderboard(data.leaderboard))
      dispatch(setBotLeaderboard(data.botLeaderboard))
      dispatch(setLevelLeaderboard(data.levelLeaderboard))
    })
  }, [])

  return (
    <Tabs
      className="my-container user-menu custom-bg hidden-scrollable"
      selectedIndex={tabIndex}
      onSelect={(i: number) => {
        dispatch(setTabIndex(i))
      }}
    >
      <h2>{t("leaderboard")}</h2>
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
