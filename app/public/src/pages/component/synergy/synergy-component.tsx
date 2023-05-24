import React from "react"
import { TypeTrigger } from "../../../../../types/Config"
import ReactTooltip from "react-tooltip"
import SynergyDetailComponent from "./synergy-detail-component"
import SynergyIcon from "../icons/synergy-icon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { SynergyName } from "../../../../../types/strings/Synergy"

export default function SynergyComponent(props: {
  type: Synergy,
  value: number,
  index: number
}) {
  const levelReached = TypeTrigger[props.type].filter(n => n <= props.value).at(-1)
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 2ch 1fr",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor:
          props.value >= TypeTrigger[props.type][0]
            ? "#54596b"
            : "rgba(84, 89, 107,0)",
        margin: "5px",
        borderRadius: "12px",
        padding: "5px",
        border:
          props.value >= TypeTrigger[props.type][0]
            ? "4px solid black"
            : "none",
        cursor: "var(--cursor-hover)"
      }}
      data-tip
      data-for={"detail-" + props.type}
    >
      <ReactTooltip
        id={"detail-" + props.type}
        className="customeTheme"
        effect="solid"
        place="right"
        offset={{ bottom: (5-props.index)*50 }}
      >
        <SynergyDetailComponent type={props.type} value={props.value} />
      </ReactTooltip>

      <SynergyIcon type={props.type} size="40px" />
      <span style={{ fontSize: "32px", textShadow: "2px 2px 2px #00000080", textAlign: "center" }}>{props.value}</span>
      <div
        style={{
          display: "flex",
          flexFlow: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly"
          }}
        >
          {TypeTrigger[props.type].map((t) => {
            return (
              <span
                key={t}
                style={{ color: levelReached === t ? "#f7d51d" : props.value >= t ? "#ffffff" : "#b8b8b8" }}
              >
                {t}
              </span>
            )
          })}
        </div>
        <p style={{ margin: "0px", textAlign: "center" }}>{SynergyName[props.type]["eng"]}</p>
      </div>
    </div>
  )
}
