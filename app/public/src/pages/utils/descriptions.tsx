import React, { ReactElement } from "react"
import { Damage, Stat } from "../../../../types/enum/Game"
import { Status } from "../../../../types/enum/Status"
import { StatLabel } from "../../../../types/strings/Stat"
import { StatusDescription, StatusLabel } from "../../../../types/strings/Status"
import { cc } from "./jsx"

export const iconRegExp =
  /(?<=\W|^)(?:PHYSICAL|SPECIAL|TRUE|atk|speed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage|BURN|SILENCE|POISON|FREEZE|PROTECT|SLEEP|CONFUSION|WOUND|RESURECTION|SMOKE|ARMOR_REDUCTION|RUNE_PROTECT|ELECTRIC_FIELD|PSYCHIC_FIELD|\[[^\]]+\])(?=\W|$)/g

export function addIconsToDescription(description: string, stars: number = 0){
  const matchIcon = description.match(iconRegExp)
  if(matchIcon === null) return description;
  const descriptionParts = description.split(iconRegExp)
  return descriptionParts.map((f, i) => {
        const token = matchIcon![i-1]
        let d: ReactElement | null = null
        if (token) {
          if (Object.keys(Damage).includes(token)) {
            d = (
              <span
                key={i}
                className={
                  token === Damage.PHYSICAL ? "damage-physical"
                  : token === Damage.SPECIAL ? "damage-special"
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
              <span key={i} className="description-icon" title={StatusDescription[token].eng}>
                <img src={`assets/icons/${token}.png`} />
                <span className="status-label">{StatusLabel[token].eng}</span>
              </span>
            )
          } else if(/\[[^\]]+\]/.test(token)){
            const array = token.slice(1,-1).split(",")
            d = (
            <span>
                {array.map((v, j) => {
                const separator = j < array.length - 1 ? "/" : "";
                return (
                    <span key={j}>
                    <span className={cc({ "stat-label": stars !== undefined && j !== stars - 1 })}>{v}</span>
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