import React from "react"
import { Effect } from "../../../../../types/enum/Effect"
import { EffectDescription } from "../../../../../types/strings/Effect"
import { addIconsToDescription } from "../../utils/descriptions"
import "./synergy-description.css"

export const effectRegExp =
  /PHYSICAL|SPECIAL|TRUE|atk|speed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage/

export function SynergyDescription(props: { effect: Effect }) {
  const description = EffectDescription[props.effect].eng
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
