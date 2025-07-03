import { t } from "i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useAppSelector } from "../../../hooks"
import { Announcements } from "./announcements"
import { TournamentsList } from "./tournaments-list"
import { VictoryRoad } from "./victory-road"

export function EventsMenu() {
    const user = useAppSelector((state) => state.network.profile)

    return (
        <Tabs className="my-container events-menu custom-bg hidden-scrollable">
            <h2>{t("events")}</h2>
            <TabList>
                <Tab>{t("announcements")}</Tab>
                <Tab>{t("tournament")}</Tab>
                <Tab>{t("victory_road")}</Tab>
            </TabList>
            <TabPanel>
                <Announcements />
            </TabPanel>
            <TabPanel>
                <TournamentsList />
            </TabPanel>
            <TabPanel>
                <VictoryRoad />
            </TabPanel>
            {!user && <p className="subtitle">{t("loading")}</p>}
        </Tabs>
    )
}
