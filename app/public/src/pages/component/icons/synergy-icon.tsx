import React from "react"
import { useTranslation } from "react-i18next"
import { Synergy } from "../../../../../types/enum/Synergy"
import "./synergy-icon.css"

export default function SynergyIcon(props: {
  type: Synergy
  size?: string
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <img
      src={"assets/types/" + props.type + ".svg"}
      alt={props.type}
      title={t("synergy." + props.type)}
      className={`synergy-icon${props.className ? " " + props.className : ""}`}
      style={{
        width: props.size,
        height: props.size
      }}
    />
  )
}
