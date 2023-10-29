import React, { Dispatch, SetStateAction } from "react"
import { IMeta } from "../../../../../models/mongo-models/meta"
import * as d3 from "d3"
import { rankType } from "./team-comp"
import { Synergy } from "../../../../../types/enum/Synergy"
import { clamp } from "../../../../../utils/number"
import "./meta-chart.css"

export function MetaChart(props: {
  meta: IMeta[]
  setSelectedComposition: Dispatch<SetStateAction<string | undefined>>
}) {
  const width = 900,
    height = 700,
    margin = 50

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

  return (
    <svg
      width={width}
      height={height}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      {props.meta
        .sort((a, b) => b.count - a.count)
        .map((d, i) => {
          const synergy = (Object.keys(d.types) as Synergy[]).sort((a, b) => {
            return rankType(a, b, d.types)
          })[0]
          const size = clamp(d.count, 40, 120)
          return (
            <image
              key={d.cluster_id}
              x={x(d.x) - margin}
              y={y(d.y) - margin}
              width={size}
              height={size}
              href={`assets/types/${synergy}.svg`}
              className="meta-svg-icon"
              onClick={(e) => {
                props.setSelectedComposition(d.cluster_id)
              }}
            />
          )
        })}
    </svg>
  )
}
