import * as d3 from "d3"
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { SYNERGY_COLORS } from "../../../../../config"
import { IMetaV2 } from "../../../../../models/mongo-models/meta-v2"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { rankType } from "./team-comp"
import "./meta-chart.css"

const ALPHA_FILL = "4D" // Hex for ~0.3 alpha

export function MetaChart(props: {
  meta: IMetaV2[]
  setSelectedComposition: Dispatch<SetStateAction<string | undefined>>
  setHoveredCluster: Dispatch<SetStateAction<IMetaV2 | undefined>>
  selectedCluster?: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = React.useState<d3.ZoomTransform | null>(
    null
  )
  const [hoveredCluster, setHoveredCluster] = React.useState<
    string | undefined
  >()
  const [dimensions, setDimensions] = React.useState({
    width: 700,
    height: 700
  })

  const margin = 20
  const width = dimensions.width
  const height = dimensions.height

  React.useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setDimensions({
          width: Math.max(rect.width, 300),
          height: Math.max(rect.height, 300)
        })
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const x = d3
    .scaleLinear()
    .domain([
      Math.min(...props.meta.map((m) => m.x)),
      Math.max(...props.meta.map((m) => m.x))
    ])
    .nice()
    .range([margin, width - margin])
  const y = d3
    .scaleLinear()
    .domain([
      Math.min(...props.meta.map((m) => m.y)),
      Math.max(...props.meta.map((m) => m.y))
    ])
    .nice()
    .range([height - margin, margin])

  useEffect(() => {
    if (!svgRef.current) return

    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
      setTransform(event.transform)
    })

    d3.select(svgRef.current).call(zoom)
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          cursor: "grab"
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform={
            transform
              ? `translate(${transform.x},${transform.y}) scale(${transform.k})`
              : ""
          }
        >
          {props.meta
            .sort((a, b) => b.count - a.count)
            .map((d, i) => {
              // Render convex hull if available
              if (d.hull && d.hull.length > 0) {
                const synergies = d.synergies ? Object.keys(d.synergies) : []
                const sortedSynergies = (synergies as Synergy[]).sort(
                  (a, b) => {
                    return rankType(a, b, d.synergies || {})
                  }
                )
                const synergy =
                  (sortedSynergies[0]?.toUpperCase() as Synergy) || undefined
                const hullPoints = d.hull
                  .map((point) => `${x(point[0])},${y(point[1])}`)
                  .join(" ")

                const fillColor =
                  synergy && SYNERGY_COLORS[synergy]
                    ? `${SYNERGY_COLORS[synergy]}${ALPHA_FILL}`
                    : "rgba(100, 150, 255, 0.3)"
                const strokeColor =
                  SYNERGY_COLORS[synergy] ?? "rgb(100, 150, 255)"

                const isSelected = props.selectedCluster === d.cluster_id
                const isHovered = hoveredCluster === d.cluster_id

                return (
                  <g key={`hull-${d.cluster_id}`}>
                    <polygon
                      points={hullPoints}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2"
                      className={`hull-polygon ${isHovered ? "hovered" : ""} ${
                        isSelected ? "selected" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        props.setSelectedComposition(d.cluster_id)
                      }}
                      onMouseEnter={() => {
                        setHoveredCluster(d.cluster_id)
                        props.setHoveredCluster(d)
                      }}
                      onMouseLeave={() => {
                        setHoveredCluster(undefined)
                        if (props.selectedCluster !== d.cluster_id) {
                          props.setHoveredCluster(undefined)
                        }
                      }}
                    />
                    {d.mean_team?.pokemons &&
                      (() => {
                        const pokemonEntries = Object.entries(
                          d.mean_team.pokemons
                        )
                        const top3Pokemon = pokemonEntries
                          .sort(
                            (a, b) =>
                              (b[1]?.frequency ?? 0) - (a[1]?.frequency ?? 0)
                          )
                          .slice(0, 3)

                        const baseSize = 40
                        const pokemonRadius = baseSize / 2
                        const containerRadius = baseSize / 2

                        return (
                          <g
                            transform={`translate(${x(d.x)}, ${y(d.y)}) scale(${
                              transform ? 1 / transform.k : 1
                            })`}
                          >
                            <defs>
                              {top3Pokemon.map((_, idx) => (
                                <clipPath
                                  key={`clip-${d.cluster_id}-${idx}`}
                                  id={`clip-pokemon-${d.cluster_id}-${idx}`}
                                >
                                  <circle cx={0} cy={0} r={pokemonRadius} />
                                </clipPath>
                              ))}
                            </defs>

                            {/* Render top 3 Pokemon in a triangle */}
                            {top3Pokemon.map((entry, idx) => {
                              const angle = (idx * 120 - 90) * (Math.PI / 180)
                              const px = containerRadius * Math.cos(angle)
                              const py = containerRadius * Math.sin(angle)
                              const pokemonName = entry[0]

                              return (
                                <g key={`poke-${d.cluster_id}-${idx}`}>
                                  <circle
                                    cx={px}
                                    cy={py}
                                    r={pokemonRadius}
                                    fill="white"
                                    style={{ pointerEvents: "none" }}
                                  />
                                  <g transform={`translate(${px}, ${py})`}>
                                    <image
                                      x={-pokemonRadius}
                                      y={-pokemonRadius}
                                      width={pokemonRadius * 2}
                                      height={pokemonRadius * 2}
                                      xlinkHref={getPortraitSrc(
                                        PkmIndex[
                                          pokemonName as keyof typeof PkmIndex
                                        ]
                                      )}
                                      clipPath={`url(#clip-pokemon-${d.cluster_id}-${idx})`}
                                      className="pokemon-portrait"
                                      style={{ pointerEvents: "none" }}
                                    />
                                  </g>
                                </g>
                              )
                            })}
                          </g>
                        )
                      })()}
                  </g>
                )
              }
              return null
            })}
        </g>
      </svg>
    </div>
  )
}
