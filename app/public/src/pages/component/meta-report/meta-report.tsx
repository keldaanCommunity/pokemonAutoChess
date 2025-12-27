import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { ItemReport } from "./item-report"
import MetadataReport from "./metadata-report"
import { PokemonReport } from "./pokemon-report"
import { SynergyReport } from "./synergy-report"
import { RegionReport } from "./region-report"
import "./meta-report.css"

export default function MetaReport() {
  const { t } = useTranslation()
  const isAdmin = useAppSelector(
    (state) => state.network.profile?.role === Role.ADMIN
  )

  return (
    <div id="meta-report">
      <Tabs>
        <TabList>
          {/* <Tab key="team-comps">{t("meta_report")}</Tab> */}
          <Tab key="pokemons">{t("pokemon_report")}</Tab>
          <Tab key="items">{t("item_report")}</Tab>
          <Tab key="regions">{t("region_report")}</Tab>
          {isAdmin && <Tab key="types">{t("synergies")}</Tab>}
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
        <TabPanel>
          <RegionReport />
        </TabPanel>
        {isAdmin && (
          <TabPanel>
            <SynergyReport />
          </TabPanel>
        )}
      </Tabs>
    </div>
  )
}
