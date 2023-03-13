import React, { ReactElement } from "react"
import { Damage, Stat } from "../../../../types/enum/Game"
import { Status } from "../../../../types/enum/Status"
import { StatLabel } from "../../../../types/strings/Stat"
import {
  StatusDescription,
  StatusLabel
} from "../../../../types/strings/Status"
import { cc } from "./jsx"

export const iconRegExp =
  /(?<=\W|^)(?:PHYSICAL|SPECIAL|TRUE|atk|speed|critChance|critDamage|def|hp|mana|range|shield|speDef|ap|BURN|SILENCE|POISON|FREEZE|PROTECT|SLEEP|CONFUSION|WOUND|RESURECTION|PARALYSIS|ARMOR_REDUCTION|GRASS_FIELD|FAIRY_FIELD|RUNE_PROTECT|ELECTRIC_FIELD|PSYCHIC_FIELD|\[[^\]]+\])(?=\W|$)/g

export function addIconsToDescription(description: string, stars: number = 0, ap: number = 0) {
  const matchIcon = description.match(iconRegExp)
  if (matchIcon === null) return description
  const descriptionParts = description.split(iconRegExp)
  return descriptionParts.map((f, i) => {
    const token = matchIcon![i - 1]
    let d: ReactElement | null = null
    if (token) {
      if (Object.keys(Damage).includes(token)) {
        d = (
          <span
            key={i}
            className={
              token === Damage.PHYSICAL
                ? "damage-physical"
                : token === Damage.SPECIAL
                ? "damage-special"
                : "damage-true"
            }
          >
            {token.toLowerCase()} damage
          </span>
        )
      } else if (Object.values(Stat).includes(token as Stat)) {
        d = (
          <span key={i} className="description-icon">
            <img src={`assets/icons/${token}.png`} />
            <span className="stat-label">{StatLabel[token].eng}</span>
          </span>
        )
      } else if (Object.values(Status).includes(token as Status)) {
        d = (
          <span
            key={i}
            className="description-icon"
            title={StatusDescription[token].eng}
          >
            <img src={`assets/icons/${token}.png`} />
            <span className="status-label">{StatusLabel[token].eng}</span>
          </span>
        )
      } else if (/\[[^\]]+\]/.test(token)) {
        const array = token.slice(1, -1).split(",")
        let scale = 0
        if(array.at(-1)?.includes("SP")){
          scale = Number(array.pop()?.replace("SP=","")) || 1
        }
        
        d = (
          <span className={cc("description-icon", { "scales-ap": scale > 0 })}>
            {scale > 0 && <img src="assets/icons/ap.png" alt="Ability Power" title="Scales with Ability Power"></img>}
            {array.map((v, j) => {
              const separator = j < array.length - 1 ? "/" : ""
              const value = ap > 0 ? Math.round(Number(v) * (1 + scale * ap/100)) : v
              return (
                <span key={j} className="ability-value">
                  <span
                    className={cc({
                      "active": stars === undefined || array.length === 1 || j === stars - 1
                    })}
                  >
                    {value}
                  </span>
                  {separator}
                </span>
              )
            })}
          </span>
        )
      }
    }

    return (
      <span key={i}>
        {d} {f}
      </span>
    )
  })
}
