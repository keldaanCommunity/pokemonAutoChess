import React from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import WikiAbility from "./wiki-ability"
import WikiPokemons from "./wiki-pokemons"
import { WikiDungeon } from "./wiki-dungeon"
import WikiFaq from "./wiki-faq"
import WikiItems from "./wiki-items"
import WikiStatistic from "./wiki-statistic"
import WikiStatus from "./wiki-status"
import WikiTutorials from "./wiki-tutorials"
import WikiTypes from "./wiki-types"
import WikiWeather from "./wiki-weather"
import "./wiki.css"

export default function Wiki({
  inGame = false,
  inSidebar = false,
}: {
  inGame: boolean
  inSidebar?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div id="wiki-page" className={inSidebar ? "wiki-sidebar" : ""}>
      <div className="my-container">
        <Tabs>
          <TabList>
            {!inGame && (
              <>
                <Tab key="title-faq">{t("faq.faq")}</Tab>
                <Tab key="title-tutorials">{t("how_to_play")}</Tab>
              </>
            )}
            <Tab key="title-pokemon">{t("pokemons_label")}</Tab>
            <Tab key="title-ability">{t("abilities_label")}</Tab>
            <Tab key="title-items">{t("items_label")}</Tab>
            <Tab key="title-types">{t("synergies_label")}</Tab>
            <Tab key="title-statistic">{t("statistics_label")}</Tab>
            <Tab key="title-status">{t("status_label")}</Tab>
            <Tab key="title-weather">{t("weather_label")}</Tab>
            <Tab key="title-dungeon">{t("dungeon_label")}</Tab>
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
          <TabPanel key="dungeon">
            <WikiDungeon />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}
