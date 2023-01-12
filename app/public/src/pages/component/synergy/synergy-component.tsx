import React from "react"
import { TypeTrigger } from "../../../../../types/Config"
import ReactTooltip from "react-tooltip"
import SynergyDetailComponent from "./synergy-detail-component"
import SynergyIcon from "../icons/synergy-icon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { SynergyName } from "../../../../../types/strings/Synergy"

export default function SynergyComponent(props: {
  type: Synergy
  isFirst: boolean
  value: number
}) {
  return (
    <div
      style={{
        display: "flex",
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
        offset={{ bottom: props.isFirst ? 110 : 0 }}
      >
        <SynergyDetailComponent type={props.type} value={props.value} />
      </ReactTooltip>

      <SynergyIcon type={props.type} size="40px" />
      <h4>{props.value}</h4>
      <div
        style={{
          display: "flex",
          flexFlow: "column"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          {TypeTrigger[props.type].map((t) => {
            return (
              <span
                key={t}
                style={{ color: props.value >= t ? "#fff" : "#e8e8e8" }}
              >
                {t}
              </span>
            )
          })}
        </div>
        <p style={{ margin: "0px" }}>{SynergyName[props.type]["eng"]}</p>
      </div>
    </div>
  )
}
