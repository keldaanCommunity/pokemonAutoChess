import React, { ReactElement } from "react"
import { Damage, Stat } from "../../../../types/enum/Game"
import { StatLabel } from "../../../../types/strings/Stat"
import { cc } from "./jsx"

export const iconRegExp =
  /(?<=\W)(?:PHYSICAL|SPECIAL|TRUE|atk|speed|critChance|critDamage|def|hp|mana|range|shield|speDef|spellDamage|\[[^\]]+\])(?=\W)/g

export function addIconsToDescription(description: string, stars: number = 0){
  const matchIcon = description.match(iconRegExp)
  console.log({ matchIcon })
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
              <span key={i}>
                <img src={`assets/icons/${token}.png`} style={{verticalAlign: "sub"}} />
                <span className="stat-label"> {StatLabel[token].eng}</span>
              </span>
            )
          } else if(/\[[^\]]+\]/.test(token)){
            const array = token.slice(1,-1).split(",")
            console.log({ array })
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