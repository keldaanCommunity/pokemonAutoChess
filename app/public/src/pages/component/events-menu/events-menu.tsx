import { t } from "i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useAppSelector } from "../../../hooks"
import { Announcements } from "./announcements"
import { TournamentsList } from "./tournaments-list"
import { VictoryRoad } from "./victory-road"
import { TournamentSchema } from "../../../../../models/colyseus-models/tournament"
import "./events-menu.css"

export function EventsMenu() {
    const user = useAppSelector((state) => state.network.profile)
    const tournaments: TournamentSchema[] = useAppSelector((state) => state.lobby.tournaments)

    return (
        <Tabs className="my-container events-menu custom-bg hidden-scrollable">
            <h2>{t("events")}</h2>
            <TabList>
                <Tab><img src="/assets/ui/megaphone.svg" alt="" /><span>{t("announcements")}</span></Tab>
                {tournaments.length > 0 && <Tab><img src="/assets/ui/tournament.svg" alt="" /><span>{t("tournament")}</span></Tab>}
                <Tab><img src="/assets/ui/leaderboard.svg" alt="" /><span>{t("victory_road")}</span></Tab>
            </TabList>
            <TabPanel>
                <Announcements />
            </TabPanel>
            {tournaments.length > 0 && <TabPanel>
                <TournamentsList />
            </TabPanel>}
            <TabPanel>
                <VictoryRoad />
            </TabPanel>
            {!user && <p className="subtitle">{t("loading")}</p>}
        </Tabs>
    )
}
