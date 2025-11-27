import { t } from "i18next"
import React, { ReactElement } from "react"
import { Damage, Stat } from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import { PositiveStatuses, Status } from "../../../../types/enum/Status"
import { Synergy } from "../../../../types/enum/Synergy"
import { Weather } from "../../../../types/enum/Weather"
import { max, roundToNDigits } from "../../../../utils/number"
import SynergyIcon from "../component/icons/synergy-icon"
import { cc } from "./jsx"

const DamageTypes = Object.keys(Damage)
const Stats = Object.keys(Stat)
const Statuses = Object.keys(Status)
const Weathers = Object.keys(Weather)
const Synergies = Object.keys(Synergy)
const Items = Object.keys(Item)
const TechnicalTerms = [
  "STRONGEST",
  "ADJACENT",
  "ADJACENT_IN_THE_SAME_ROW",
  "CONE",
  "BOARD_EFFECT"
]

export const iconRegExp = new RegExp(
  `(?<=\\W|^)(?:${[
    ...DamageTypes,
    ...Stats,
    ...Statuses,
    ...Weathers,
    ...Synergies,
    ...Items,
    ...TechnicalTerms,
    "GOLD",
    "STAR"
  ].join("|")}|\\[[^\\]]+\\])(?=\\W|$)`,
  "g"
)

export function addIconsToDescription(
  description: string,
  stats?: { ap: number; luck: number; stars: number; stages?: number }
) {
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
            <span
              className={cc("status-label", {
                positive: PositiveStatuses.includes(token as Status)
              })}
            >
              {t(`status.${token}`)}
            </span>
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
      } else if (TechnicalTerms.includes(token)) {
        d = (
          <span
            className="description-icon technical-term"
            title={t(`technical_terms_definitions.${token}`)}
          >
            <img src={`assets/ui/${token.toLowerCase()}.svg`} />
            <i className="technical-term-label">
              {t(`technical_terms.${token}`)}
            </i>
          </span>
        )
      } else if (/\[[^\]]+\]/.test(token)) {
        const array = token.slice(1, -1).split(",")
        let scaleType: "AP" | "LUCK" | null = null
        let scaleFactor = 1
        let nbDigits = 0
        if (array.at(-1)?.includes("ND")) {
          nbDigits = Number(array.pop()?.replace("ND=", "")) || 0
        } else if (array.at(-1)?.includes("SP")) {
          scaleType = "AP"
          scaleFactor = Number(array.pop()?.replace("SP=", "")) || 1
        } else if (array.at(-1)?.includes("LK")) {
          scaleType = "LUCK"
          scaleFactor = Number(array.pop()?.replace("LK=", "")) || 1
        }

        d = (
          <span
            className={cc("description-icon", {
              "scales-ap": scaleType === "AP",
              "scales-luck": scaleType === "LUCK"
            })}
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
              const separator =
                j < Math.min(stats?.stages ?? 4, array.length) - 1 ? "/" : ""
              let value: number | string = roundToNDigits(Number(v), nbDigits)
              if (Number.isNaN(value)) {
                // In case of non-numeric value, just return as is
                value = v
              } else if (scaleType === "AP") {
                value = roundToNDigits(
                  Number(v) * (1 + ((stats?.ap ?? 0) * scaleFactor) / 100),
                  nbDigits
                )
              } else if (scaleType === "LUCK") {
                value = roundToNDigits(
                  max(100)(
                    Math.pow(Number(v) / 100, 1 - (stats?.luck ?? 0) / 100) *
                      100
                  ),
                  nbDigits
                )
              }

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
      <React.Fragment key={i}>
        {d}
        {f}
      </React.Fragment>
    )
  })
}

// Function to process HTML strings and add icons
export function addIconsToHtml(
  htmlString: string,
  stats?: { ap: number; luck: number; stars: number; stages?: number }
): string {
  // Create a temporary DOM element to work with the HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlString

  // Function to process text nodes and add icon markup
  const processTextNode = (textNode: Text) => {
    const text = textNode.textContent || ""
    const matchIcon = text.match(iconRegExp)

    if (!matchIcon) return

    const descriptionParts = text.split(iconRegExp)
    let newHTML = ""

    descriptionParts.forEach((part, i) => {
      const token = matchIcon[i - 1]
      let iconHTML = ""

      if (token) {
        if (token === "GOLD") {
          iconHTML =
            '<img class="description-icon icon-money" src="/assets/icons/money.svg" alt="$" />'
        } else if (token === "STAR") {
          iconHTML =
            '<img class="description-icon icon-star" src="/assets/ui/star.svg" alt="⭐" />'
        } else if (DamageTypes.includes(token)) {
          const className =
            token === Damage.PHYSICAL
              ? "damage-physical"
              : token === Damage.SPECIAL
                ? "damage-special"
                : "damage-true"
          iconHTML = `<span class="${className}">${t(`damage.${token}`)}</span>`
        } else if (Stats.includes(token as Stat)) {
          iconHTML = `<span class="description-icon stat">
            <img src="assets/icons/${token}.png" />
            <span class="stat-label">${t(`stat.${token}`)}</span>
          </span>`
        } else if (Statuses.includes(token as Status)) {
          const isPositive = PositiveStatuses.includes(token as Status)
          iconHTML = `<span class="description-icon status" title="${t(`status_description.${token}`)}">
            <img src="assets/icons/${token}.svg" />
            <span class="status-label${isPositive ? " positive" : ""}">${t(`status.${token}`)}</span>
          </span>`
        } else if (Weathers.includes(token as Weather)) {
          iconHTML = `<span class="description-icon weather" title="${t(`weather_description.${token}`)}">
            <img src="assets/icons/weather/${token.toLowerCase()}.svg" />
            <span class="weather-label">${t(`weather.${token}`)}</span>
          </span>`
        } else if (Items.includes(token as Item)) {
          iconHTML = `<span class="description-icon item" title="${t(`item_description.${token}`)}">
            <img src="assets/item/${token}.png" />
            <span class="item-label">${t(`item.${token}`)}</span>
          </span>`
        } else if (Synergies.includes(token as Synergy)) {
          iconHTML = `<span class="description-icon synergy">
            <img src="assets/types/${token}.svg" style="width: 1.5em; height: 1.5em;" />
            <span class="synergy-label">${t(`synergy.${token}`)}</span>
          </span>`
        } else if (TechnicalTerms.includes(token)) {
          iconHTML = `<span class="description-icon technical-term" title="${t(`technical_terms_definitions.${token}`)}">
            <img src="assets/ui/${token.toLowerCase()}.svg" />
            <i class="technical-term-label">${t(`technical_terms.${token}`)}</i>
          </span>`
        } else if (/\[[^\]]+\]/.test(token)) {
          const array = token.slice(1, -1).split(",")
          let scaleType: "AP" | "LUCK" | null = null
          let scaleFactor = 1
          let nbDigits = 0

          if (array.at(-1)?.includes("ND")) {
            nbDigits = Number(array.pop()?.replace("ND=", "")) || 0
          } else if (array.at(-1)?.includes("SP")) {
            scaleType = "AP"
            scaleFactor = Number(array.pop()?.replace("SP=", "")) || 1
          } else if (array.at(-1)?.includes("LK")) {
            scaleType = "LUCK"
            scaleFactor = Number(array.pop()?.replace("LK=", "")) || 1
          }

          const scaleClass =
            scaleType === "AP"
              ? " scales-ap"
              : scaleType === "LUCK"
                ? " scales-luck"
                : ""
          let scaleIcon = ""
          if (scaleType === "AP") {
            scaleIcon =
              '<img src="assets/icons/AP.png" alt="Ability Power" title="Scales with Ability Power" />'
          } else if (scaleType === "LUCK") {
            scaleIcon =
              '<img src="assets/icons/LUCK.png" alt="Luck" title="Scales with Luck" />'
          }

          let valuesHTML = ""
          array.slice(0, stats?.stages).forEach((v, j) => {
            const separator =
              j < Math.min(stats?.stages ?? 4, array.length) - 1 ? "/" : ""
            let value: number | string = roundToNDigits(Number(v), nbDigits)

            if (Number.isNaN(value)) {
              value = v
            } else if (scaleType === "AP") {
              value = roundToNDigits(
                Number(v) * (1 + ((stats?.ap ?? 0) * scaleFactor) / 100),
                nbDigits
              )
            } else if (scaleType === "LUCK") {
              value = roundToNDigits(
                max(100)(
                  Math.pow(Number(v) / 100, 1 - (stats?.luck ?? 0) / 100) * 100
                ),
                nbDigits
              )
            }

            const tier = stats?.stars
            const active =
              tier === undefined ||
              array.length === 1 ||
              j === tier - 1 ||
              (tier > array.length && j === array.length - 1)

            valuesHTML += `<span class="ability-value">
              <span class="${active ? "active" : ""}">${value}</span>
              ${separator}
            </span>`
          })

          iconHTML = `<span class="description-icon${scaleClass}">
            ${scaleIcon}
            ${valuesHTML}
          </span>`
        }
      }

      newHTML += iconHTML + part
    })

    // Replace the text node with the new HTML
    const newElement = document.createElement("span")
    newElement.innerHTML = newHTML
    textNode.parentNode?.replaceChild(newElement, textNode)
  }

  // Walk through all text nodes in the DOM
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT)

  const textNodes: Text[] = []
  let node: Text | null
  while ((node = walker.nextNode() as Text)) {
    textNodes.push(node)
  }

  // Process text nodes in reverse order to avoid issues with DOM manipulation
  textNodes.reverse().forEach(processTextNode)

  return tempDiv.innerHTML
}
