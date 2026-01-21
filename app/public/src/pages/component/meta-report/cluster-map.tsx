import { useEffect, useState } from "react"
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
import { rankType } from "./team-comp"

export function ClusterMap() {
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

  return (
    <div className="cluster-map-container">
      {loading ? (
        <div className="cluster-map-loading">Loading...</div>
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
          {(hoveredCluster || selectedClusterData) && (
            <div className="cluster-info-panel-fixed">
              {selectedClusterData && (
                <div className="cluster-info">
                  <h4>Selected Cluster</h4>
                  {selectedClusterData.synergies && (
                    <div className="synergies-container">
                      {Object.keys(selectedClusterData.synergies)
                        .filter(
                          (type) =>
                            selectedClusterData.synergies[type as Synergy]
                        )
                        .sort((a, b) =>
                          rankType(
                            a as Synergy,
                            b as Synergy,
                            selectedClusterData.synergies
                          )
                        )
                        .slice(0, 3)
                        .map((type) => (
                          <div key={type} className="synergy-item-display">
                            <SynergyIcon
                              type={type.toUpperCase() as Synergy}
                              size="32px"
                            />
                            <span>
                              {selectedClusterData.synergies[type as Synergy]}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="info-stat">
                    <label>Rank:</label>
                    <span>{selectedClusterData.mean_rank.toFixed(2)}</span>
                  </div>
                  <div className="info-stat">
                    <label>Winrate:</label>
                    <span>{selectedClusterData.winrate.toFixed(2)}%</span>
                  </div>
                  <div className="info-stat">
                    <label>Popularity:</label>
                    <span>{selectedClusterData.ratio.toFixed(2)}%</span>
                  </div>
                  <div className="info-stat">
                    <label>Count:</label>
                    <span>{selectedClusterData.count}</span>
                  </div>
                  {selectedClusterData.mean_team?.pokemons && (
                    <div className="mean-team-section">
                      <p className="mean-team-label">Mean Team:</p>
                      <div className="mean-team-grid">
                        {Object.entries(selectedClusterData.mean_team.pokemons)
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
                              {data?.items && data.items.length > 0 && (
                                <div className="pokemon-items-container">
                                  {data.items.slice(0, 2).map((item, i) => (
                                    <img
                                      key={i}
                                      src={`/assets/item/${item}.png`}
                                      className="pokemon-item-icon"
                                      data-tooltip-id="item-detail-tooltip"
                                      data-tooltip-content={item}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {hoveredCluster && !selectedClusterData && (
                <div className="cluster-info hover-info">
                  <h4>Hover Info</h4>
                  {hoveredCluster.synergies && (
                    <div className="synergies-container">
                      {Object.keys(hoveredCluster.synergies)
                        .filter(
                          (type) => hoveredCluster.synergies[type as Synergy]
                        )
                        .sort((a, b) =>
                          rankType(
                            a as Synergy,
                            b as Synergy,
                            hoveredCluster.synergies
                          )
                        )
                        .slice(0, 3)
                        .map((type) => (
                          <div key={type} className="synergy-item-display">
                            <SynergyIcon
                              type={type.toUpperCase() as Synergy}
                              size="32px"
                            />
                            <span>
                              {hoveredCluster.synergies[type as Synergy]}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="info-stat">
                    <label>Rank:</label>
                    <span>{hoveredCluster.mean_rank.toFixed(2)}</span>
                  </div>
                  <div className="info-stat">
                    <label>Winrate:</label>
                    <span>{hoveredCluster.winrate.toFixed(2)}%</span>
                  </div>
                  <div className="info-stat">
                    <label>Popularity:</label>
                    <span>{hoveredCluster.ratio.toFixed(2)}%</span>
                  </div>
                  <div className="info-stat">
                    <label>Count:</label>
                    <span>{hoveredCluster.count}</span>
                  </div>
                  {hoveredCluster.mean_team?.pokemons && (
                    <div className="mean-team-section">
                      <p className="mean-team-label">Mean Team:</p>
                      <div className="mean-team-grid">
                        {Object.entries(hoveredCluster.mean_team.pokemons)
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
                              {data?.items && data.items.length > 0 && (
                                <div className="pokemon-items-container">
                                  {data.items.slice(0, 2).map((item, i) => (
                                    <img
                                      key={i}
                                      src={`/assets/item/${item}.png`}
                                      className="pokemon-item-icon"
                                      data-tooltip-id="item-detail-tooltip"
                                      data-tooltip-content={item}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
