import { useEffect, useState } from "react"
import { t } from "i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { getCurrentGameEvent } from "../../../../../config"
import { TournamentSchema } from "../../../../../models/colyseus-models/tournament"
import { GameEvent } from "../../../../../types/events"
import { useAppSelector } from "../../../hooks"
import { Announcements } from "./announcements"
import { Expeditions } from "./expeditions"
import { TournamentsList } from "./tournaments-list"
import { TwitchStreams } from "./twitch-streams"
import { VictoryRoad } from "./victory-road"

export function EventsMenu() {
  const user = useAppSelector((state) => state.network.profile)
  const tournaments: TournamentSchema[] = useAppSelector(
    (state) => state.lobby.tournaments
  )
  const [showTwitchTab, setShowTwitchTab] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentGameEvent = getCurrentGameEvent()

  const hasTournamentTab = tournaments.length > 0
  const hasExpeditionsTab = currentGameEvent === GameEvent.EXPEDITIONS
  const hasVictoryRoadTab = currentGameEvent === GameEvent.VICTORY_ROAD
  const tabCount =
    1 +
    Number(hasTournamentTab) +
    Number(hasExpeditionsTab) +
    Number(hasVictoryRoadTab) +
    Number(showTwitchTab)

  useEffect(() => {
    let isMounted = true

    async function fetchTwitchStreams() {
      try {
        const response = await fetch("/twitch/streams")
        const data = (await response.json()) as { streams: unknown[] }
        if (isMounted) {
          setShowTwitchTab((data.streams?.length ?? 0) > 0)
        }
      } catch {
        if (isMounted) {
          setShowTwitchTab(false)
        }
      }
    }

    fetchTwitchStreams()
    const interval = setInterval(fetchTwitchStreams, 1000 * 60 * 2)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (selectedIndex >= tabCount) {
      setSelectedIndex(Math.max(0, tabCount - 1))
    }
  }, [selectedIndex, tabCount])

  return (
    <Tabs
      className="my-container events-menu custom-bg hidden-scrollable"
      onSelect={(index) => setSelectedIndex(index)}
      selectedIndex={selectedIndex}
    >
      <h2>{t("events")}</h2>
      <TabList>
        {showTwitchTab && (
          <Tab>
            <span>{t("twitch_streams.title")}</span>
          </Tab>
        )}
        <Tab>
          <span>{t("announcements")}</span>
        </Tab>
        {tournaments.length > 0 && (
          <Tab>
            <span>{t("game_modes.TOURNAMENT")}</span>
          </Tab>
        )}
        {currentGameEvent === GameEvent.EXPEDITIONS && (
          <Tab>
            <span>{t("expeditions.title")}</span>
          </Tab>
        )}
        {currentGameEvent === GameEvent.VICTORY_ROAD && (
          <Tab>
            <span>{t("victory_road.title")}</span>
          </Tab>
        )}
      </TabList>
      {showTwitchTab && (
        <TabPanel>
          <TwitchStreams />
        </TabPanel>
      )}
      <TabPanel>
        <Announcements />
      </TabPanel>
      {tournaments.length > 0 && (
        <TabPanel>
          <TournamentsList />
        </TabPanel>
      )}
      {currentGameEvent === GameEvent.EXPEDITIONS && (
        <TabPanel>
          <Expeditions />
        </TabPanel>
      )}
      {currentGameEvent === GameEvent.VICTORY_ROAD && (
        <TabPanel>
          <VictoryRoad />
        </TabPanel>
      )}
      {!user && <p className="subtitle">{t("loading")}</p>}
    </Tabs>
  )
}
