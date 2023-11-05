import React from "react"
import { Status } from "../../../../../types/enum/Status"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"

export default function WikiStatus() {
  const { t } = useTranslation()
  const statusList: Status[] = [
    Status.ARMOR_REDUCTION,
    Status.BURN,
    Status.CHARM,
    Status.CONFUSION,
    Status.FLINCH,
    Status.FREEZE,
    Status.PARALYSIS,
    Status.POISON,
    Status.PROTECT,
    Status.RESURECTION,
    Status.RUNE_PROTECT,
    Status.SILENCE,
    Status.SLEEP,
    Status.WOUND,
    Status.ELECTRIC_FIELD,
    Status.FAIRY_FIELD,
    Status.GRASS_FIELD,
    Status.PSYCHIC_FIELD
    
  ]
  return (
    <ul className="wiki-status">
      {statusList.map((status) => (
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
