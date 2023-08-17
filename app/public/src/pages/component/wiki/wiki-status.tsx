import React from "react"
import { Status } from "../../../../../types/enum/Status"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"

export default function WikiStatus() {
  const { t } = useTranslation()
  return (
    <ul className="wiki-status">
      {Object.values(Status).map((status) => (
        <li key={status} className="nes-container">
          <img src={`assets/status/demo/${status}.png`} alt={status} />
          <h2>{addIconsToDescription(status)}</h2>
          <p className="description">
            {addIconsToDescription(t(`status_description.${status}`))}
          </p>
        </li>
      ))}
    </ul>
  )
}
