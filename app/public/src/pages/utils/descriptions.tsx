import React, { ReactElement } from "react"
import { Damage, Stat } from "../../../../types/enum/Game"
import { Status } from "../../../../types/enum/Status"
import { Synergy } from "../../../../types/enum/Synergy"
import { Weather } from "../../../../types/enum/Weather"
import SynergyIcon from "../component/icons/synergy-icon"
import { cc } from "./jsx"
import { t } from "i18next"
import { Item } from "../../../../types/enum/Item"

const DamageTypes = Object.keys(Damage)
const Stats = Object.keys(Stat)
const Statuses = Object.keys(Status)
const Weathers = Object.keys(Weather)
const Synergies = Object.keys(Synergy)
const Items = Object.keys(Item)

export const iconRegExp = new RegExp(
  `(?<=\\W|^)(?:${[
    ...DamageTypes,
    ...Stats,
    ...Statuses,
    ...Weathers,
    ...Synergies,
    ...Items
  ].join("|")}|\\[[^\\]]+\\])(?=\\W|$)`,
  "g"
)

const oldRegEx =
  /(?<=\W|^)(?:PHYSICAL|SPECIAL|TRUE|ATK|ATK_SPEED|CRIT_CHANCE|CRIT_DAMAGE|DEF|HP|PP|RANGE|SHIELD|SPE_DEF|AP|BURN|SILENCE|POISON|FREEZE|PROTECT|SLEEP|CONFUSION|WOUND|RESURECTION|PARALYSIS|ARMOR_REDUCTION|GRASS_FIELD|FAIRY_FIELD|RUNE_PROTECT|ELECTRIC_FIELD|PSYCHIC_FIELD|SUN|RAIN|WINDY|SNOW|SANDSTORM|MISTY|STORM|NEUTRAL|NIGHT|NORMAL|GRASS|FIRE|WATER|ELECTRIC|FIGHTING|PSYCHIC|DARK|STEEL|GROUND|POISON|DRAGON|FIELD|MONSTER|HUMAN|AQUATIC|BUG|FLYING|FLORA|ROCK|GHOST|FAIRY|ICE|FOSSIL|SOUND|ARTIFICIAL|BABY|\[[^\]]+\])(?=\W|$)/g
console.log({ iconRegExp, oldRegEx })

export function addIconsToDescription(description: string, tier = 0, ap = 0) {
  const matchIcon = description.match(iconRegExp)
  if (matchIcon === null) return description
  const descriptionParts = description.split(iconRegExp)
  return descriptionParts.map((f, i) => {
    const token = matchIcon![i - 1]
    let d: ReactElement | null = null
    if (token) {
      if (DamageTypes.includes(token)) {
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
            {t(`damage.${token}`)}
          </span>
        )
      } else if (Stats.includes(token as Stat)) {
        d = (
          <span key={i} className="description-icon stat">
            <img src={`assets/icons/${token}.png`} />
            <span className="stat-label">{t(`stat.${token}`)}</span>
          </span>
        )
      } else if (Statuses.includes(token as Status)) {
        d = (
          <span
            key={i}
            className="description-icon status"
            title={t(`status_description.${token}`)}
          >
            <img src={`assets/icons/${token}.svg`} />
            <span className="status-label">{t(`status.${token}`)}</span>
          </span>
        )
      } else if (Weathers.includes(token as Weather)) {
        d = (
          <span
            key={i}
            className="description-icon weather"
            title={t(`weather_description.${token}`)}
          >
            <img src={`assets/icons/weather/${token.toLowerCase()}.svg`} />
            <span className="weather-label">{t(`weather.${token}`)}</span>
          </span>
        )
      } else if (Items.includes(token as Item)) {
        d = (
          <span
            key={i}
            className="description-icon item"
            title={t(`item_description.${token}`)}
          >
            <img src={`assets/item/${token}.png`} />
            <span className="item-label">{t(`item.${token}`)}</span>
          </span>
        )
      } else if (Synergies.includes(token as Synergy)) {
        d = (
          <span key={i} className="description-icon synergy">
            <SynergyIcon key={i} type={token as Synergy} size="20px" />
            <span className="synergy-label">{t(`synergy.${token}`)}</span>
          </span>
        )
      } else if (/\[[^\]]+\]/.test(token)) {
        const array = token.slice(1, -1).split(",")
        let scale = 0
        if (array.at(-1)?.includes("SP")) {
          scale = Number(array.pop()?.replace("SP=", "")) || 1
        }

        d = (
          <span className={cc("description-icon", { "scales-ap": scale > 0 })}>
            {scale > 0 && (
              <img
                src="assets/icons/AP.png"
                alt="Ability Power"
                title="Scales with Ability Power"
              ></img>
            )}
            {array.map((v, j) => {
              const separator = j < array.length - 1 ? "/" : ""
              const value =
                ap > 0 ? Math.round(Number(v) * (1 + (scale * ap) / 100)) : v
              return (
                <span key={j} className="ability-value">
                  <span
                    className={cc({
                      active:
                        tier === undefined ||
                        array.length === 1 ||
                        j === tier - 1
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
