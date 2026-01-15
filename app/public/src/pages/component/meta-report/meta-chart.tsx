import * as d3 from "d3"
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { IMetaV2 } from "../../../../../models/mongo-models/meta-v2"
import { Synergy } from "../../../../../types/enum/Synergy"
import { clamp } from "../../../../../utils/number"
import "./meta-chart.css"
import { rankType } from "./team-comp"

// Synergy color mapping for convex hulls - extracted from SVG fill colors
const SYNERGY_COLORS: Record<Synergy, string> = {
  NORMAL: "rgba(255, 254, 254, 0.3)",
  FIRE: "rgba(255, 144, 36, 0.3)",
  WATER: "rgba(45, 162, 253, 0.3)",
  GRASS: "rgba(23, 179, 0, 0.3)",
  ELECTRIC: "rgba(253, 255, 74, 0.3)",
  ICE: "rgba(195, 228, 238, 0.3)",
  FIGHTING: "rgba(243, 50, 24, 0.3)",
  POISON: "rgba(136, 215, 160, 0.3)",
  GROUND: "rgba(198, 150, 74, 0.3)",
  FLYING: "rgba(178, 233, 255, 0.3)",
  PSYCHIC: "rgba(185, 85, 210, 0.3)",
  BUG: "rgba(255, 254, 102, 0.3)",
  ROCK: "rgba(231, 229, 175, 0.3)",
  GHOST: "rgba(135, 109, 173, 0.3)",
  DRAGON: "rgba(184, 115, 51, 0.3)",
  DARK: "rgba(166, 166, 166, 0.3)",
  STEEL: "rgba(219, 219, 219, 0.3)",
  FAIRY: "rgba(255, 175, 209, 0.3)",
  FIELD: "rgba(222, 138, 78, 0.3)",
  AQUATIC: "rgba(20, 200, 200, 0.3)",
  MONSTER: "rgba(0, 180, 100, 0.3)",
  AMORPHOUS: "rgba(229, 178, 244, 0.3)",
  WILD: "rgba(178, 35, 52, 0.3)",
  SOUND: "rgba(255, 96, 149, 0.3)",
  FLORA: "rgba(255, 96, 241, 0.3)",
  BABY: "rgba(255, 215, 154, 0.3)",
  HUMAN: "rgba(253, 187, 139, 0.3)",
  LIGHT: "rgba(255, 248, 150, 0.3)",
  GOURMET: "rgba(255, 132, 115, 0.3)",
  FOSSIL: "rgba(210, 211, 91, 0.3)",
  ARTIFICIAL: "rgba(237, 237, 237, 0.3)"
}

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
                    ? SYNERGY_COLORS[synergy]
                    : "rgba(100, 150, 255, 0.3)"
                const strokeColor =
                  synergy && SYNERGY_COLORS[synergy]
                    ? SYNERGY_COLORS[synergy].replace("0.3", "1")
                    : "rgb(100, 150, 255)"

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
                    {synergy && (
                      <g
                        transform={`translate(${x(d.x)}, ${y(d.y)}) scale(${
                          transform ? 1 / transform.k : 1
                        })`}
                      >
                        <image
                          x={-clamp(d.count, 8, 30) / 2}
                          y={-clamp(d.count, 8, 30) / 2}
                          width={clamp(d.count, 8, 30)}
                          height={clamp(d.count, 8, 30)}
                          href={`assets/types/${synergy}.svg`}
                          className="synergy-icon"
                          style={{ pointerEvents: "none" }}
                        />
                      </g>
                    )}
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
