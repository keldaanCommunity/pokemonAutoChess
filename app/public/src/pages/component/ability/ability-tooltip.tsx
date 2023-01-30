import React, { ReactElement } from "react"
import { Ability } from "../../../../../types/enum/Ability"
import { Damage } from "../../../../../types/enum/Game"
import { AbilityDescription } from "../../../../../types/strings/Ability"
import { StatLabel } from "../../../../../types/strings/Stat"
import "./ability-tooltip.css"

export function AbilityTooltip(props: { ability: Ability; stars?: number }) {
  let description = AbilityDescription[props.ability].eng
  if (props.stars) {
    const match = [...description.matchAll(/\[[^\]]*\]/g)]
    match.forEach((v) => {
      const array = JSON.parse(v[0])
      if (Array.isArray(array) && array[props.stars! - 1] !== undefined) {
        description = description.replace(v[0], array[props.stars! - 1])
      }
    })
  } else {
    description = description.replace(/,/g, "/")
    description = description.replace(/\[/g, "")
    description = description.replace(/\]/g, "")
  }
  const matchDamage = [
    ...description.matchAll(
      /PHYSICAL|SPECIAL|TRUE|atk|atkSpeed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage/g
    )
  ]
  let descriptionWithDamage = description.split(
    /PHYSICAL|SPECIAL|TRUE|atk|atkSpeed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage/
  )
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
          } else {
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
