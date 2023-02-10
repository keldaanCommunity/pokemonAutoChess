import React, { ReactElement } from "react"
import { Ability } from "../../../../../types/enum/Ability"
import { Damage, Stat } from "../../../../../types/enum/Game"
import { AbilityDescription } from "../../../../../types/strings/Ability"
import { StatLabel } from "../../../../../types/strings/Stat"
import { cc } from "../../utils/jsx"
import "./ability-tooltip.css"

export const iconRegExp =
  /PHYSICAL|SPECIAL|TRUE|atk|speed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage|\[[^\]]*\]/

export function AbilityTooltip(props: { ability: Ability; stars?: number }) {
  const description = AbilityDescription[props.ability].eng
  const matchDamage = [...description.matchAll(new RegExp(iconRegExp, "g"))]
  let descriptionWithDamage = description.split(iconRegExp)
  return (
    <p>
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
          } else {
            const array = JSON.parse(token[0])
            if (Array.isArray(array)) {
              d = (
                <span>
                  {array.map((v, j) => {
                    const separator = j < array.length - 1 ? "/" : "";
                    return (
                      <span key={j}>
                        <span className={cc({ "stat-label": props.stars !== undefined && j !== props.stars - 1 })}>{v}</span>
                        {separator}
                      </span>
                    )
                  })}
                </span>
              )
            }
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
