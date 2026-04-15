import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import WikiAbility from "./wiki-ability"
import WikiData from "./wiki-data"
import WikiFaq from "./wiki-faq"
import WikiItems from "./wiki-items"
import WikiPokemons from "./wiki-pokemons"
import WikiRegions from "./wiki-regions"
import WikiStages from "./wiki-stages"
import WikiStatistic from "./wiki-statistic"
import WikiStatus from "./wiki-status"
import WikiTown from "./wiki-town"
import WikiTutorials from "./wiki-tutorials"
import WikiTypes from "./wiki-types"
import WikiWeather from "./wiki-weather"
import "./wiki.css"

export default function Wiki({ inGame = false }: { inGame: boolean }) {
  const { t } = useTranslation()
  return (
    <div id="wiki-page" onKeyDown={(e) => e.stopPropagation()}>
      <Tabs>
        <TabList>
          {!inGame && (
            <>
              <Tab key="title-faq">{t("wiki.faq.faq")}</Tab>
              <Tab key="title-tutorials">{t("wiki.nav.how_to_play")}</Tab>
            </>
          )}
          <Tab key="title-pokemon">{t("wiki.nav.pokemons_label")}</Tab>
          <Tab key="title-ability">{t("wiki.nav.abilities_label")}</Tab>
          <Tab key="title-items">{t("wiki.nav.items_label")}</Tab>
          <Tab key="title-types">{t("wiki.nav.synergies_label")}</Tab>
          <Tab key="title-statistic">{t("wiki.nav.statistics_label")}</Tab>
          <Tab key="title-status">{t("status_label")}</Tab>
          <Tab key="title-weather">{t("wiki.nav.weather_label")}</Tab>
          <Tab key="title-stages">{t("stages")}</Tab>
          <Tab key="title-town">{t("wiki.nav.town_label")}</Tab>
          <Tab key="title-dungeon">{t("wiki.nav.dungeon_label")}</Tab>
          <Tab key="title-data">{t("wiki.nav.data_label")}</Tab>
        </TabList>

        {!inGame && (
          <>
            <TabPanel key="faq">
              <WikiFaq />
            </TabPanel>
            <TabPanel key="tutorials">
              <WikiTutorials />
            </TabPanel>
          </>
        )}
        <TabPanel key="pokemon">
          <WikiPokemons />
        </TabPanel>
        <TabPanel key="ability">
          <WikiAbility />
        </TabPanel>
        <TabPanel key="items">
          <WikiItems />
        </TabPanel>
        <TabPanel key="types">
          <WikiTypes />
        </TabPanel>
        <TabPanel key="statistic">
          <WikiStatistic />
        </TabPanel>
        <TabPanel key="status">
          <WikiStatus />
        </TabPanel>
        <TabPanel key="weather">
          <WikiWeather />
        </TabPanel>
        <TabPanel key="stages">
          <WikiStages />
        </TabPanel>
        <TabPanel key="town">
          <WikiTown />
        </TabPanel>
        <TabPanel key="dungeon">
          <WikiRegions />
        </TabPanel>
        <TabPanel key="data">
          <WikiData />
        </TabPanel>
      </Tabs>
    </div>
  )
}
