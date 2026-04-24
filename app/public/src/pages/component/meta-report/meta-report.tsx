import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { ActivityReport } from "./activity-report"
import { ClusterMap } from "./cluster-map"
import { CompositionReport } from "./composition-report"
import { DendrogramChart } from "./dendrogram-chart"
import { ItemReport } from "./item-report"
import MetadataReport from "./metadata-report"
import { PlayerReport } from "./player-report"
import { PokemonReport } from "./pokemon-report"
import { RegionReport } from "./region-report"
import { SynergyReport } from "./synergy-report"
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
          <Tab key="team-comps">{t("meta_report")}</Tab>
          <Tab key="cluster-map">{t("cluster_map.title")}</Tab>
          <Tab key="dendrogram">{t("dendrogram.title")}</Tab>
          <Tab key="pokemons">{t("pokemon_report")}</Tab>
          <Tab key="items">{t("item_report")}</Tab>
          <Tab key="regions">{t("region_report")}</Tab>
          <Tab key="player-report">
            {t("player_report", { defaultValue: "Player Report" })}
          </Tab>
          <Tab key="activity-report">
            {t("game_activity", { defaultValue: "Game Activity" })}
          </Tab>
          {isAdmin && <Tab key="types">{t("synergies")}</Tab>}
        </TabList>

        <TabPanel key="team-comps-panel">
          <CompositionReport />
        </TabPanel>
        <TabPanel key="cluster-map-panel">
          <ClusterMap />
        </TabPanel>
        <TabPanel key="dendrogram-panel">
          <DendrogramChart />
        </TabPanel>
        <TabPanel>
          <PokemonReport />
        </TabPanel>
        <TabPanel>
          <ItemReport />
        </TabPanel>
        <TabPanel>
          <RegionReport />
        </TabPanel>
        <TabPanel>
          <PlayerReport />
        </TabPanel>
        <TabPanel>
          <ActivityReport />
        </TabPanel>
        {isAdmin && (
          <TabPanel>
            <SynergyReport />
          </TabPanel>
        )}
        <MetadataReport />
      </Tabs>
    </div>
  )
}
