import React from "react"
import { useTranslation } from "react-i18next"
import { Synergy } from "../../../../../types/enum/Synergy"
import "./synergy-icon.css"

export default function SynergyIcon(props: { type: Synergy; size?: string }) {
  const { t } = useTranslation()
  return (
    <img
      src={"assets/types/" + props.type + ".svg"}
      alt={props.type}
      title={t("synergy." + props.type)}
      className="synergy-icon"
      style={{
        width: props.size ?? "40px",
        height: props.size ?? "40px"
      }}
    />
  )
}
