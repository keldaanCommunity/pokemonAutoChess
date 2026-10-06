import { useState } from "react"
import ReactDOM from "react-dom"
import { Tooltip } from "react-tooltip"
import { sortSynergies } from "../../../../../models/colyseus-models/synergies"
import type { Synergy } from "../../../../../types/enum/Synergy"
import SynergyComponent from "./synergy-component"
import SynergyDetailComponent from "./synergy-detail-component"
import "./synergies.css"

export default function Synergies(props: {
  synergies: [Synergy, number][]
  tooltipPortal: boolean
}) {
  const [hoveredSynergy, setHoveredSynergy] = useState<Synergy | null>(null)
  const synergies = sortSynergies(new Map(props.synergies)).filter(
    ([type, value]) => value > 0
  )

  const tooltip = (
    <Tooltip
      id="detail-synergy"
      hidden={hoveredSynergy === null}
      className="custom-theme-tooltip"
      place="right-start"
      delayShow={100}
      delayHide={0}
    >
      {hoveredSynergy && (
        <SynergyDetailComponent
          type={hoveredSynergy}
          value={props.synergies.find((e) => e[0] == hoveredSynergy)![1]}
        />
      )}
    </Tooltip>
  )

  return (
    <div className="synergies-list">
      {synergies.map(([type, level], index) => {
        return (
          <SynergyComponent
            key={type}
            type={type}
            value={level}
            index={index}
            onMouseEnter={() => setHoveredSynergy(type as Synergy)}
            onMouseLeave={() => setHoveredSynergy(null)}
          />
        )
      })}
      {props.tooltipPortal
        ? ReactDOM.createPortal(tooltip, document.body)
        : tooltip}
    </div>
  )
}
