import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { ItemReport } from "./item-report"
import MetadataReport from "./metadata-report"
import { PokemonReport } from "./pokemon-report"
import "./meta-report.css"

export default function MetaReport() {
  const { t } = useTranslation()

  return (
    <div id="meta-report">
      <Tabs>
        <TabList>
          {/* <Tab key="team-comps">{t("meta_report")}</Tab> */}
          <Tab key="pokemons">{t("pokemon_report")}</Tab>
          <Tab key="items">{t("item_report")}</Tab>
          <MetadataReport />
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
