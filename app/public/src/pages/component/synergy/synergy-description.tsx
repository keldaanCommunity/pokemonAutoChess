import React, { ReactElement } from "react"
import { Effect } from "../../../../../types/enum/Effect"
import { Damage, Stat } from "../../../../../types/enum/Game"
import { EffectDescription } from "../../../../../types/strings/Effect"
import { StatLabel } from "../../../../../types/strings/Stat"
import "./synergy-description.css"

export const effectRegExp =
  /PHYSICAL|SPECIAL|TRUE|atk|speed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage/

export function SynergyDescription(props: { effect: Effect }) {
  const description = EffectDescription[props.effect].eng
  const matchDamage = [...description.matchAll(new RegExp(effectRegExp, "g"))]
  let descriptionWithDamage = description.split(effectRegExp)
  return (
    <p className="synergy-description">
      {descriptionWithDamage.map((f, i) => {
        const token = matchDamage[i - 1]
        let d: ReactElement | null = null
        if (token && token[0]) {
          if (Object.keys(Damage).includes(token[0])) {
            d = (
              <span
                key={i}
                className={
                  token[0] === Damage.PHYSICAL
                    ? "damage-physical"
                    : token[0] === Damage.SPECIAL
                    ? "damage-special"
                    : "damage-true"
                }
              >
                {token[0].toLowerCase()} damage
              </span>
            )
          } else if (Object.values(Stat).includes(token[0] as Stat)) {
            d = (
              <span key={i}>
                <img src={`assets/icons/${token[0]}.png`} />
                <span className="stat-label"> {StatLabel[token[0]].eng}</span>
              </span>
            )
          }
        }

        return (
          <span key={i}>
            {d} {f}
          </span>
        )
      })}
    </p>
  )
}
