import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
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

  return (
    <div id="meta-report">
      <Tabs>
        <TabList>
          <Tab key="team-comps">{t("meta_report.best_team_compositions")}</Tab>
          <Tab key="cluster-map">{t("meta_report.cluster_map.title")}</Tab>
          <Tab key="dendrogram">{t("meta_report.dendrogram.title")}</Tab>
          <Tab key="pokemons">{t("meta_report.pokemon_report")}</Tab>
          <Tab key="items">{t("meta_report.item_report")}</Tab>
          <Tab key="types">{t("meta_report.synergy_report")}</Tab>
          <Tab key="regions">{t("meta_report.region_report")}</Tab>
          <Tab key="player-report">
            {t("meta_report.player_report", { defaultValue: "Player Report" })}
          </Tab>
          <Tab key="activity-report">
            {t("meta_report.game_activity", { defaultValue: "Game Activity" })}
          </Tab>
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
          <SynergyReport />
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
        <MetadataReport />
      </Tabs>
    </div>
  )
}
