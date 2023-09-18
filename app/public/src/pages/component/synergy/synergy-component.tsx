import React from "react"
import { SynergyTriggers } from "../../../../../types/Config"
import { Tooltip } from "react-tooltip"
import SynergyDetailComponent from "./synergy-detail-component"
import SynergyIcon from "../icons/synergy-icon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { useTranslation } from "react-i18next"
import ReactDOM from "react-dom"

export default function SynergyComponent(props: {
  type: Synergy
  value: number
  index: number
}) {
  const { t } = useTranslation()
  const levelReached = SynergyTriggers[props.type]
    .filter((n) => n <= props.value)
    .at(-1)
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 2ch 1fr",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor:
          props.value >= SynergyTriggers[props.type][0]
            ? "#54596b"
            : "rgba(84, 89, 107,0)",
        margin: "5px",
        borderRadius: "12px",
        padding: "5px",
        border:
          props.value >= SynergyTriggers[props.type][0]
            ? "4px solid black"
            : "none",
        cursor: "var(--cursor-hover)"
      }}
      data-tooltip-id={"detail-" + props.type}
    >
      {ReactDOM.createPortal(
        <Tooltip
          id={"detail-" + props.type}
          className="customeTheme"
          place="right"
          data-tooltip-offset={{ bottom: (5 - props.index) * 50 }}
        >
          <SynergyDetailComponent type={props.type} value={props.value} />
        </Tooltip>,
        document.body
      )}

      <SynergyIcon type={props.type} size="40px" />
      <span
        style={{
          fontSize: "32px",
          textShadow: "2px 2px 2px #00000080",
          textAlign: "center"
        }}
      >
        {props.value}
      </span>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          lineHeight: 1.25
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly"
          }}
        >
          {SynergyTriggers[props.type].map((t) => {
            return (
              <span
                key={t}
                style={{
                  color:
                    levelReached === t
                      ? "#f7d51d"
                      : props.value >= t
                      ? "#ffffff"
                      : "#b8b8b8"
                }}
              >
                {t}
              </span>
            )
          })}
        </div>
        <p style={{ margin: "0px", textAlign: "center" }}>
          {t(`synergy.${props.type}`)}
        </p>
      </div>
    </div>
  )
}
