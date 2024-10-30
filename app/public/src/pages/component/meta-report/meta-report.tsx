import React from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import { useTranslation } from "react-i18next"
import { CompositionReport } from "./composition-report"
import { ItemReport } from "./item-report"
import "./meta-report.css"
import { PokemonReport } from "./pokemon-report"

export default function MetaReport() {
  const { t } = useTranslation()

  return (
    <div id="meta-report">
      <Tabs>
        <TabList>
          {/* <Tab key="team-comps">{t("meta_report")}</Tab> */}

          <Tab key="pokemons">{t("pokemon_report")}</Tab>
          <Tab key="items">{t("item_report")}</Tab>
        </TabList>

        {/* <TabPanel key="team-comps-panel">
          <CompositionReport />
        </TabPanel> */}
        <TabPanel>
          <PokemonReport />
        </TabPanel>
        <TabPanel>
          <ItemReport />
        </TabPanel>
      </Tabs>
    </div>
  )
}
