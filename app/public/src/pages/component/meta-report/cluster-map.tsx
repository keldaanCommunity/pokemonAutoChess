import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  fetchMetaV2,
  IMetaV2
} from "../../../../../models/mongo-models/meta-v2"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import "./cluster-map.css"
import { MetaChart } from "./meta-chart"

export function ClusterMap() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(true)
  const [meta, setMeta] = useState<IMetaV2[]>([])
  const [selectedComposition, setSelectedComposition] = useState<
    string | undefined
  >()
  const [hoveredCluster, setHoveredCluster] = useState<IMetaV2 | undefined>()

  useEffect(() => {
    fetchMetaV2().then((res) => {
      setLoading(false)
      setMeta(res)
    })
  }, [])

  const selectedClusterData = meta.find(
    (m) => m.cluster_id === selectedComposition
  )

  const displayedCluster = hoveredCluster || selectedClusterData

  return (
    <div className="cluster-map-container">
      {loading ? (
        <div className="cluster-map-loading">{t("cluster_map.loading")}</div>
      ) : (
        <>
          <div className="cluster-map-chart-wrapper">
            <MetaChart
              meta={meta}
              setSelectedComposition={setSelectedComposition}
              setHoveredCluster={setHoveredCluster}
              selectedCluster={selectedComposition}
            />
          </div>
          <div className="cluster-map-info-panel">
            <h3>{t("cluster_map.title")}</h3>
            <p className="cluster-map-info-text">
              {t("cluster_map.description")}
            </p>
            <div className="cluster-map-stats">
              <div className="stat-item">
                <label>{t("cluster_map.total_clusters")}:</label>
                <span>{meta.length}</span>
              </div>
              <div className="stat-item">
                <label>{t("cluster_map.total_matches")}:</label>
                <span>{meta.reduce((sum, m) => sum + m.count, 0)}</span>
              </div>
            </div>

            {displayedCluster && (
              <div className="cluster-detail-panel">
                <h4>
                  {hoveredCluster
                    ? t("cluster_map.hovered_cluster")
                    : t("cluster_map.selected_cluster")}{" "}
                  {t("cluster_map.cluster")} #{displayedCluster.cluster_id}
                </h4>
                {displayedCluster.synergies && (
                  <div className="synergies-container">
                    {Object.entries(displayedCluster.synergies)
                      .sort((a, b) => (b[1] as number) - (a[1] as number))
                      .slice(0, 3)
                      .map(([type, level]) => (
                        <div key={type} className="synergy-item-display">
                          <SynergyIcon
                            type={type.toUpperCase() as Synergy}
                            size="32px"
                          />
                          <span>{level}</span>
                        </div>
                      ))}
                  </div>
                )}
                <div className="cluster-stats">
                  <div className="stat-item">
                    <label>{t("cluster_map.rank")}:</label>
                    <span>{displayedCluster.mean_rank.toFixed(2)}</span>
                  </div>
                  <div className="stat-item">
                    <label>{t("cluster_map.winrate")}:</label>
                    <span>{displayedCluster.winrate.toFixed(2)}%</span>
                  </div>
                  <div className="stat-item">
                    <label>{t("cluster_map.popularity")}:</label>
                    <span>{displayedCluster.ratio.toFixed(2)}%</span>
                  </div>
                  <div className="stat-item">
                    <label>{t("cluster_map.count")}:</label>
                    <span>{displayedCluster.count}</span>
                  </div>
                </div>
                {displayedCluster.mean_team?.pokemons && (
                  <div className="pokemon-grid">
                    {Object.entries(displayedCluster.mean_team.pokemons)
                      .sort(
                        (a, b) =>
                          (b[1]?.frequency ?? 0) - (a[1]?.frequency ?? 0)
                      )
                      .slice(0, 10)
                      .map(([pokemonName, data]) => (
                        <div
                          key={pokemonName}
                          className="pokemon-container-item"
                        >
                          <div className="pokemon-portrait-wrapper">
                            <PokemonPortrait
                              portrait={PkmIndex[pokemonName as Pkm]}
                            />
                          </div>
                          <div className="pokemon-frequency">
                            {((data?.frequency ?? 0) * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
