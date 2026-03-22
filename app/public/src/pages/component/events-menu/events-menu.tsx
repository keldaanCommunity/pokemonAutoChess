import { t } from "i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { getCurrentGameEvent } from "../../../../../config"
import { TournamentSchema } from "../../../../../models/colyseus-models/tournament"
import { GameEvent } from "../../../../../types/events"
import { useAppSelector } from "../../../hooks"
import { Announcements } from "./announcements"
import { Expeditions } from "./expeditions"
import { TournamentsList } from "./tournaments-list"
import { VictoryRoad } from "./victory-road"

export function EventsMenu() {
  const user = useAppSelector((state) => state.network.profile)
  const tournaments: TournamentSchema[] = useAppSelector(
    (state) => state.lobby.tournaments
  )
  const currentGameEvent = getCurrentGameEvent()

  return (
    <Tabs className="my-container events-menu custom-bg hidden-scrollable">
      <h2>{t("events")}</h2>
      <TabList>
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
