import * as d3 from "d3"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import {
  fetchDendrogram,
  IBranchProfile,
  IClusterProfile,
  IDendrogram
} from "../../../../../models/mongo-models/dendrogram"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import "./dendrogram-chart.css"

export function DendrogramChart() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(true)
  const [dendrogram, setDendrogram] = useState<IDendrogram | null>(null)
  const [hoveredCluster, setHoveredCluster] = useState<IClusterProfile | null>(
    null
  )
  const [selectedCluster, setSelectedCluster] =
    useState<IClusterProfile | null>(null)
  const [hoveredBranch, setHoveredBranch] = useState<IBranchProfile | null>(
    null
  )
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 })
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const gRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null)

  useEffect(() => {
    fetchDendrogram().then((res) => {
      setLoading(false)
      setDendrogram(res)
    })
  }, [])

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setDimensions({
          width: Math.max(rect.width - 300, 600),
          height: Math.max(rect.height - 40, 500)
        })
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // Get color for a branch based on synergy
  const getSynergyColor = useCallback((synergy: string | undefined): string => {
    if (!synergy) return "#4a9eff"
    const upperSynergy = synergy.toUpperCase() as Synergy
    return SYNERGY_COLORS[upperSynergy] || "#4a9eff"
  }, [])

  // Get dominant synergy from synergies record (for cluster profiles)
  const getDominantSynergy = useCallback(
    (synergies: Record<string, number> | undefined): string | undefined => {
      if (!synergies || Object.keys(synergies).length === 0) return undefined
      const sorted = Object.entries(synergies).sort((a, b) => b[1] - a[1])
      return sorted[0]?.[0]
    },
    []
  )

  // Draw dendrogram
  useEffect(() => {
    if (!dendrogram || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 50, right: 30, bottom: 100, left: 70 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    // Create main group with zoom capability
    const mainG = svg.append("g").attr("class", "main-group")

    const g = mainG
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    gRef.current = g

    // Setup zoom - apply to mainG, not g
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on("zoom", (event) => {
        mainG.attr("transform", event.transform)
      })

    svg.call(zoom)
    zoomRef.current = zoom

    // Get bounds from icoord/dcoord
    const allX = dendrogram.icoord.flat()
    const allY = dendrogram.dcoord.flat()

    const xMin = Math.min(...allX)
    const xMax = Math.max(...allX)
    const yMin = 0
    const yMax = Math.max(...allY)

    // Create scales
    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width])
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0])

    // Build a map from branch index to branch profile (pre-computed in Python)
    const branchProfileMap = new Map<number, IBranchProfile>()
    if (dendrogram.branch_profiles && dendrogram.branch_profiles.length > 0) {
      dendrogram.branch_profiles.forEach((profile) => {
        branchProfileMap.set(profile.branch_index, profile)
      })
    }

    // Build a map from leaf X position to cluster profile
    const leafXPositions: number[] = []
    dendrogram.icoord.forEach((xCoords, i) => {
      const yCoords = dendrogram.dcoord[i]
      if (yCoords[0] === 0) leafXPositions.push(xCoords[0])
      if (yCoords[3] === 0) leafXPositions.push(xCoords[3])
    })
    const uniqueLeafX = [...new Set(leafXPositions)].sort((a, b) => a - b)

    // Map leaf X to cluster profile
    const leafXToProfile = new Map<number, IClusterProfile>()
    uniqueLeafX.forEach((leafX, idx) => {
      if (dendrogram.cluster_profiles[idx]) {
        leafXToProfile.set(leafX, dendrogram.cluster_profiles[idx])
      }
    })

    // Draw background grid
    g.append("g")
      .attr("class", "grid")
      .selectAll("line.horizontal")
      .data(yScale.ticks(10))
      .enter()
      .append("line")
      .attr("class", "horizontal")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#333")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-dasharray", "2,2")

    // Draw the dendrogram branches (inverted U shapes)
    const branchesGroup = g.append("g").attr("class", "branches")
    // Icons group drawn after branches so they appear on top
    const iconsGroup = g.append("g").attr("class", "branch-icons")

    // First pass: draw all branches
    dendrogram.icoord.forEach((xCoords, i) => {
      const yCoords = dendrogram.dcoord[i]

      // Get pre-computed branch profile if available
      const branchProfile = branchProfileMap.get(i)
      const dominantSynergy = branchProfile?.synergy
      const color = getSynergyColor(dominantSynergy)

      // Create path data for the inverted U shape
      const pathData = `
        M ${xScale(xCoords[0])} ${yScale(yCoords[0])}
        L ${xScale(xCoords[1])} ${yScale(yCoords[1])}
        L ${xScale(xCoords[2])} ${yScale(yCoords[2])}
        L ${xScale(xCoords[3])} ${yScale(yCoords[3])}
      `

      branchesGroup
        .append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("opacity", 0.85)
        .attr("class", "branch")
        .attr("data-index", i)
        .attr("data-synergy", dominantSynergy || "")
        .style("cursor", "pointer")
        .on("mouseover", function () {
          d3.select(this).attr("stroke-width", 4).attr("opacity", 1)
          if (branchProfile) setHoveredBranch(branchProfile)
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", 2).attr("opacity", 0.85)
          setHoveredBranch(null)
        })
    })

    // Second pass: draw all icons on top of branches
    dendrogram.icoord.forEach((xCoords, i) => {
      const yCoords = dendrogram.dcoord[i]
      const branchProfile = branchProfileMap.get(i)
      const dominantSynergy = branchProfile?.synergy
      const color = getSynergyColor(dominantSynergy)

      // Add a synergy icon at the merge point
      const mergeX = (xCoords[1] + xCoords[2]) / 2
      const mergeY = yCoords[1]
      // Icon size scales with merge height (higher in hierarchy = larger icon)
      const normalizedHeight = mergeY / yMax
      const iconSize = 10 + normalizedHeight * 30 // Range: 10px to 40px
      const hoverScale = 1.3

      if (dominantSynergy) {
        iconsGroup
          .append("image")
          .attr("href", `assets/types/${dominantSynergy.toUpperCase()}.svg`)
          .attr("x", xScale(mergeX) - iconSize / 2)
          .attr("y", yScale(mergeY) - iconSize / 2)
          .attr("width", iconSize)
          .attr("height", iconSize)
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this)
              .attr("width", iconSize * hoverScale)
              .attr("height", iconSize * hoverScale)
              .attr("x", xScale(mergeX) - (iconSize * hoverScale) / 2)
              .attr("y", yScale(mergeY) - (iconSize * hoverScale) / 2)
            if (branchProfile) setHoveredBranch(branchProfile)
          })
          .on("mouseout", function () {
            d3.select(this)
              .attr("width", iconSize)
              .attr("height", iconSize)
              .attr("x", xScale(mergeX) - iconSize / 2)
              .attr("y", yScale(mergeY) - iconSize / 2)
            setHoveredBranch(null)
          })
      } else {
        iconsGroup
          .append("circle")
          .attr("cx", xScale(mergeX))
          .attr("cy", yScale(mergeY))
          .attr("r", 5)
          .attr("fill", color)
          .attr("stroke", "#222")
          .attr("stroke-width", 1.5)
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this).attr("r", 8).attr("stroke-width", 2)
            if (branchProfile) setHoveredBranch(branchProfile)
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", 5).attr("stroke-width", 1.5)
            setHoveredBranch(null)
          })
      }
    })

    // Draw leaf labels at the bottom
    const leafLabelsGroup = g.append("g").attr("class", "leaf-labels")

    // Draw leaf markers and labels
    uniqueLeafX.forEach((leafX, idx) => {
      const profile = leafXToProfile.get(leafX)
      const synergy = getDominantSynergy(profile?.synergies)
      const color = getSynergyColor(synergy)
      const leafIconSize = 14
      const leafHoverScale = 1.4

      // Leaf synergy icon
      if (synergy) {
        leafLabelsGroup
          .append("image")
          .attr("href", `assets/types/${synergy.toUpperCase()}.svg`)
          .attr("x", xScale(leafX) - leafIconSize / 2)
          .attr("y", height + 8 - leafIconSize / 2)
          .attr("width", leafIconSize)
          .attr("height", leafIconSize)
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this)
              .attr("width", leafIconSize * leafHoverScale)
              .attr("height", leafIconSize * leafHoverScale)
              .attr("x", xScale(leafX) - (leafIconSize * leafHoverScale) / 2)
              .attr("y", height + 8 - (leafIconSize * leafHoverScale) / 2)
            if (profile) setHoveredCluster(profile)
          })
          .on("mouseout", function () {
            d3.select(this)
              .attr("width", leafIconSize)
              .attr("height", leafIconSize)
              .attr("x", xScale(leafX) - leafIconSize / 2)
              .attr("y", height + 8 - leafIconSize / 2)
            setHoveredCluster(null)
          })
          .on("click", function () {
            if (profile) setSelectedCluster(profile)
          })
      } else {
        // Fallback circle if no synergy
        leafLabelsGroup
          .append("circle")
          .attr("cx", xScale(leafX))
          .attr("cy", height + 8)
          .attr("r", 6)
          .attr("fill", color)
          .attr("stroke", "#222")
          .attr("stroke-width", 1.5)
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this).attr("r", 9).attr("stroke-width", 2)
            if (profile) setHoveredCluster(profile)
          })
          .on("mouseout", function () {
            d3.select(this).attr("r", 6).attr("stroke-width", 1.5)
            setHoveredCluster(null)
          })
          .on("click", function () {
            if (profile) setSelectedCluster(profile)
          })
      }
    })
  }, [dendrogram, dimensions, getSynergyColor, getDominantSynergy])

  const displayedCluster = hoveredCluster || selectedCluster

  return (
    <div className="dendrogram-container" ref={containerRef}>
      {loading ? (
        <div className="dendrogram-loading">{t("dendrogram.loading")}</div>
      ) : !dendrogram ? (
        <div className="dendrogram-no-data">{t("dendrogram.no_data")}</div>
      ) : (
        <>
          <div className="dendrogram-chart-wrapper">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
            />
          </div>
          <div className="dendrogram-info-panel">
            <h3>{t("dendrogram.title")}</h3>
            <p className="dendrogram-info-text">
              {t("dendrogram.description")}
            </p>
            <div className="dendrogram-stats">
              <div className="stat-item">
                <label>{t("dendrogram.total_clusters")}:</label>
                <span>{dendrogram.n_clusters}</span>
              </div>
              <div className="stat-item">
                <label>{t("dendrogram.total_matches")}:</label>
                <span>{dendrogram.n_samples}</span>
              </div>
              <div className="stat-item">
                <label>{t("dendrogram.linkage_method")}:</label>
                <span>{dendrogram.linkage_method}</span>
              </div>
              <div className="stat-item">
                <label>{t("dendrogram.branches")}:</label>
                <span>{dendrogram.icoord.length}</span>
              </div>
            </div>

            {hoveredBranch && (
              <div className="branch-detail-panel">
                <h4>
                  {t("dendrogram.branch")} #{hoveredBranch.branch_index + 1}
                </h4>
                <div className="branch-stats">
                  <div className="stat-item">
                    <label>{t("dendrogram.branch_total_matches")}:</label>
                    <span>{hoveredBranch.total_size}</span>
                  </div>
                  <div className="stat-item">
                    <label>{t("dendrogram.branch_contains_clusters")}:</label>
                    <span>{hoveredBranch.leaf_cluster_ids.length}</span>
                  </div>
                </div>
                {hoveredBranch.synergy && (
                  <div className="synergies-container">
                    <div className="synergy-item-display">
                      <SynergyIcon
                        type={hoveredBranch.synergy.toUpperCase() as Synergy}
                        size="32px"
                      />
                      <span>{hoveredBranch.synergy}</span>
                    </div>
                  </div>
                )}
                {hoveredBranch.top_pokemons &&
                  hoveredBranch.top_pokemons.length > 0 && (
                    <div className="pokemon-grid">
                      {hoveredBranch.top_pokemons.map((pokemon, idx) => (
                        <div key={idx} className="pokemon-container-item">
                          <div className="pokemon-portrait-wrapper">
                            <PokemonPortrait
                              portrait={PkmIndex[pokemon.name as Pkm]}
                            />
                          </div>
                          <div className="pokemon-frequency">
                            {pokemon.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {displayedCluster && (
              <div className="cluster-detail-panel">
                <h4>
                  {hoveredCluster
                    ? t("dendrogram.hovered_cluster")
                    : t("dendrogram.selected_cluster")}{" "}
                  {t("dendrogram.cluster")} #{displayedCluster.cluster_id}
                </h4>
                <div className="cluster-size">
                  <label>{t("dendrogram.cluster_size")}:</label>
                  <span>
                    {displayedCluster.size} {t("dendrogram.matches")}
                  </span>
                </div>
                {displayedCluster.synergies &&
                  Object.keys(displayedCluster.synergies).length > 0 && (
                    <div className="synergies-container">
                      {Object.entries(displayedCluster.synergies)
                        .sort((a, b) => b[1] - a[1])
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
                {displayedCluster.top_pokemons &&
                  displayedCluster.top_pokemons.length > 0 && (
                    <div className="pokemon-grid">
                      {displayedCluster.top_pokemons
                        .slice(0, 10)
                        .map((pokemon, idx) => (
                          <div key={idx} className="pokemon-container-item">
                            <div className="pokemon-portrait-wrapper">
                              <PokemonPortrait
                                portrait={PkmIndex[pokemon.name as Pkm]}
                              />
                            </div>
                            <div className="pokemon-frequency">
                              {(pokemon.frequency * 100).toFixed(0)}%
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
