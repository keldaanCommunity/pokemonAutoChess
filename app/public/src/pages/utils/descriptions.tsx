import { t } from "i18next"
import React, { ReactElement } from "react"
import { Damage, Stat } from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import { Status } from "../../../../types/enum/Status"
import { Synergy } from "../../../../types/enum/Synergy"
import { Weather } from "../../../../types/enum/Weather"
import { roundToNDigits } from "../../../../utils/number"
import SynergyIcon from "../component/icons/synergy-icon"
import { cc } from "./jsx"

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
    ...Items,
    "GOLD",
    "STAR"
  ].join("|")}|\\[[^\\]]+\\])(?=\\W|$)`,
  "g"
)

export function addIconsToDescription(description: string, stats?: { ap: number, luck: number, stars: number, stages?: number }) {
  const matchIcon = description.match(iconRegExp)
  if (matchIcon === null) return description
  const descriptionParts = description.split(iconRegExp)
  return descriptionParts.map((f, i) => {
    const token = matchIcon![i - 1]
    let d: ReactElement | null = null
    if (token) {
      if (token === "GOLD") {
        d = (
          <img
            className="description-icon icon-money"
            src="/assets/icons/money.svg"
            alt="$"
          />
        )
      } else if (token === "STAR") {
        d = (
          <img
            className="description-icon icon-star"
            src="/assets/ui/star.svg"
            alt="⭐"
          />
        )
      } else if (DamageTypes.includes(token)) {
        d = (
          <span
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
          <span className="description-icon stat">
            <img src={`assets/icons/${token}.png`} />
            <span className="stat-label">{t(`stat.${token}`)}</span>
          </span>
        )
      } else if (Statuses.includes(token as Status)) {
        d = (
          <span
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
            className="description-icon item"
            title={t(`item_description.${token}`)}
          >
            <img src={`assets/item/${token}.png`} />
            <span className="item-label">{t(`item.${token}`)}</span>
          </span>
        )
      } else if (Synergies.includes(token as Synergy)) {
        d = (
          <span className="description-icon synergy">
            <SynergyIcon type={token as Synergy} size="1.5em" />
            <span className="synergy-label">{t(`synergy.${token}`)}</span>
          </span>
        )
      } else if (/\[[^\]]+\]/.test(token)) {
        const array = token.slice(1, -1).split(",")
        let scaleType: "AP" | "LUCK" | null = null
        let scaleFactor = 1
        let nbDigits = 0
        if (array.at(-1)?.includes("ND")) {
          nbDigits = Number(array.pop()?.replace("ND=", "")) || 0
        }
        if (array.at(-1)?.includes("SP")) {
          scaleType = "AP"
          scaleFactor = Number(array.pop()?.replace("SP=", "")) || 1
        }
        if (array.at(-1)?.includes("LK")) {
          scaleType = "LUCK"
          scaleFactor = Number(array.pop()?.replace("LK=", "")) || 1
        }

        d = (
          <span
            className={cc("description-icon", { "scales-ap": scaleType === "AP", "scales-luck": scaleType === "LUCK" })}
          >
            {scaleType === "AP" && (
              <img
                src="assets/icons/AP.png"
                alt="Ability Power"
                title="Scales with Ability Power"
              ></img>
            )}
            {scaleType === "LUCK" && (
              <img
                src="assets/icons/LUCK.png"
                alt="Luck"
                title="Scales with Luck"
              ></img>
            )}
            {array.slice(0, stats?.stages).map((v, j) => {
              const separator = j < Math.min(stats?.stages ?? 3, array.length) - 1 ? "/" : ""
              let scaleValue = 0
              if (scaleType === "AP") scaleValue = stats?.ap ?? 0
              if (scaleType === "LUCK") scaleValue = stats?.luck ?? 0
              const value = roundToNDigits(Number(v) * (1 + scaleValue * scaleFactor / 100), nbDigits)
              const tier = stats?.stars
              const active =
                tier === undefined ||
                array.length === 1 ||
                j === tier - 1 ||
                (tier > array.length && j === array.length - 1)
              return (
                <span key={j} className="ability-value">
                  <span className={cc({ active })}>{value}</span>
                  {separator}
                </span>
              )
            })}
          </span>
        )
      }
    }

    return (
      <React.Fragment key={i}>{d}{f}</React.Fragment>
    )
  })
}
