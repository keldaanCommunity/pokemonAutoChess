import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { useTranslation } from "react-i18next"
import { ItemReport } from "./item-report"
import "./meta-report.css"
import { PokemonReport } from "./pokemon-report"
import MetadataReport from "./metadata-report"

export default function MetaReport() {
  const { t } = useTranslation()

  return (
    <div id="meta-report">
      <MetadataReport />
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
