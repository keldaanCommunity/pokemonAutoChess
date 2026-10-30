import { t } from "i18next"
import React, { type ReactNode } from "react"
import { getWeatherConfig } from "../../../../config/game/weathers"
import type { EffectConfig } from "../../../../types/EffectConfig"
import { BoardEffects } from "../../../../types/enum/Effect"
import { Damage, Stat } from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import {
  DocumentedStatuses,
  PositiveStatuses,
  type Status
} from "../../../../types/enum/Status"
import { Synergy } from "../../../../types/enum/Synergy"
import { Weather } from "../../../../types/enum/Weather"
import {
  TechnicalTerms,
  TechnicalTermsWithoutIcons
} from "../../../../types/strings/TechnicalTerm"
import { isIn } from "../../../../utils/array"
import { max, roundToNDigits } from "../../../../utils/number"
import { keys } from "../../../../utils/object"
import SynergyIcon from "../component/icons/synergy-icon"
import { getDescriptionConfig, placeholderRegExp } from "./description-config"
import { cc } from "./jsx"

const DamageTypes = keys(Damage)
const Stats = keys(Stat)
const Weathers = Object.values(Weather)
const Synergies = keys(Synergy)
const Items = keys(Item)

export const iconRegExp = new RegExp(
  `(?<=\\W|^)(?:${[
    ...DamageTypes,
    ...Stats,
    ...DocumentedStatuses,
    ...BoardEffects,
    ...Weathers,
    ...Synergies,
    ...Items,
    ...TechnicalTerms,
    "GOLD",
    "STAR",
    "XP"
  ].join("|")}|\\[[^\\]]+\\])(?=\\W|$)`,
  "g"
)

const descriptionPattern = `${placeholderRegExp.source}|${iconRegExp.source}`
const descriptionRegExp = new RegExp(descriptionPattern, "g")

export function addIconsToDescription(
  description: string,
  params?: {
    ap?: number
    luck?: number
    stars?: number
    stages?: number
    showAbilityTiers?: boolean
    config?: EffectConfig
  }
) {
  const pattern = params?.config ? descriptionRegExp : iconRegExp
  const matchIcon = description.match(pattern)
  if (matchIcon === null) return description
  const descriptionParts = description.split(pattern)
  const capitalize = (str) => str[0].toUpperCase() + str.substring(1)
  return descriptionParts.map((part, i) => {
    const token = matchIcon![i - 1]
    let replacement: ReactNode = null
    const isAtStartOfSentence =
      i === 0 ||
      descriptionParts[i - 1].trim().endsWith(".") ||
      descriptionParts[i - 1].length === 0

    if (token) {
      if (token.startsWith("{{")) {
        const key = token.slice(2, -2).trim()
        const config = params?.config
        const value = config && Object.hasOwn(config, key) ? config[key] : undefined
        if (typeof value === "number") {
          replacement = value
        } else if (value) {
          const values: (number | string)[] = value.valuePerTier
            ? [...value.valuePerTier]
            : [value.value]
          if (value.apScaling !== undefined) values.push(`SP=${value.apScaling}`)
          else if (value.luckScaling) values.push("LK")
          if (value.nbDecimals !== undefined) values.push(`ND=${value.nbDecimals}`)
          replacement = addIconsToDescription(`[${values.join(",")}]`, params)
        } else {
          replacement = token
        }
      } else if (token === "GOLD") {
        replacement = (
          <img
            className="description-icon icon-money"
            src="/assets/icons/money.svg"
            alt="$"
          />
        )
      } else if (token === "STAR") {
        replacement = (
          <img
            className="description-icon icon-star"
            src="/assets/ui/star.svg"
            alt="⭐"
          />
        )
      } else if (token === "XP") {
        replacement = (
          <span className="description-icon stat">
            <img src={`assets/icons/${token}.png`} />
            <span className="stat-label">{t(`stat.${token}`)}</span>
          </span>
        )
      } else if (isIn(DamageTypes, token)) {
        replacement = (
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
      } else if (isIn(Stats, token)) {
        replacement = (
          <span className="description-icon stat">
            <img src={`assets/icons/${token}.png`} />
            <span className="stat-label">{t(`stat.${token}`)}</span>
          </span>
        )
      } else if (isIn(DocumentedStatuses, token)) {
        const path = `status_description.${token}` as const
        replacement = (
          <span
            className="description-icon status"
            title={t(path, getDescriptionConfig(path))}
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
      } else if (isIn(BoardEffects, token)) {
        const path = `effect_description.${token}` as const
        const title = t(path, getDescriptionConfig(path))
        replacement = (
          <span
            className="description-icon board-effect"
            title={title}
          >
            <img src={`assets/icons/effects/${token}.svg`} />
            <span className="board-effect-label">{t(`effect.${token}`)}</span>
          </span>
        )
      } else if (isIn(Weathers, token)) {
        replacement = (
          <span
            className="description-icon weather"
            title={t(`weather_description.${token}`, getWeatherConfig(token))}
          >
            <img src={`assets/icons/weather/${token.toLowerCase()}.svg`} />
            <span className="weather-label">{t(`weather.${token}`)}</span>
          </span>
        )
      } else if (isIn(Items, token)) {
        const path = `item_description.${token}` as const
        replacement = (
          <span
            className="description-icon item"
            title={t(path, getDescriptionConfig(path))}
          >
            <img src={`assets/item/${token}.png`} />
            <span className="item-label">{t(`item.${token}`)}</span>
          </span>
        )
      } else if (isIn(Synergies, token)) {
        replacement = (
          <span className="description-icon synergy">
            <SynergyIcon type={token as Synergy} size="1.5em" />
            <span className="synergy-label">{t(`synergy.${token}`)}</span>
          </span>
        )
      } else if (isIn(TechnicalTerms, token)) {
        replacement = (
          <span
            className="description-icon technical-term"
            title={t(`technical_terms_definitions.${token}`)}
          >
            {TechnicalTermsWithoutIcons.includes(token) ? null : (
              <img src={`assets/ui/${token.toLowerCase()}.svg`} />
            )}
            <i className="technical-term-label">
              {isAtStartOfSentence
                ? capitalize(t(`technical_terms.${token}`))
                : t(`technical_terms.${token}`)}
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
        }
        if (array.at(-1)?.includes("SP")) {
          scaleType = "AP"
          scaleFactor = Number(array.pop()?.replace("SP=", "")) || 1
        } else if (array.at(-1)?.includes("LK")) {
          scaleType = "LUCK"
          scaleFactor = Number(array.pop()?.replace("LK=", "")) || 1
        }

        const tier = params?.stars
        const maxTier = params?.stages ? params.stages + 1 : 5
        const tierValues =
          params?.stars && !params?.showAbilityTiers && array.length > 1
            ? [array[params.stars - 1]] // only show relevant tier
            : array.slice(0, maxTier) // show tier scaling

        replacement = (
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
            {tierValues.map((v, j) => {
              const separator = j < tierValues.length - 1 ? "/" : ""
              let value: number | string = roundToNDigits(Number(v), nbDigits)
              if (Number.isNaN(value)) {
                // In case of non-numeric value, just return as is
                value = v
              } else if (scaleType === "AP") {
                value = roundToNDigits(
                  Number(v) * (1 + ((params?.ap ?? 0) * scaleFactor) / 100),
                  nbDigits
                )
              } else if (scaleType === "LUCK") {
                value = roundToNDigits(
                  max(100)(
                    Math.pow(Number(v) / 100, 1 - (params?.luck ?? 0) / 100) *
                      100
                  ),
                  nbDigits
                )
              }

              const active =
                tier === undefined ||
                array.length === 1 ||
                j === tier - 1 ||
                (tier > tierValues.length && j === tierValues.length - 1)
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

    const boldParts = part.split(/\*\*(.+?)\*\*/g)
    const content =
      boldParts.length > 1
        ? boldParts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="description-important">
                {part}
              </strong>
            ) : (
              part
            )
          )
        : part

    return (
      <React.Fragment key={i}>
        {replacement}
        {content}
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
        } else if (token === "XP") {
          iconHTML = `<span className="description-icon stat">
            <img src={${`assets/icons/${token}.png`}} />
            <span className="stat-label">{${t(`stat.${token}`)}}</span>
          </span>`
        } else if (isIn(DamageTypes, token)) {
          const className =
            token === Damage.PHYSICAL
              ? "damage-physical"
              : token === Damage.SPECIAL
                ? "damage-special"
                : "damage-true"
          iconHTML = `<span class="${className}">${t(`damage.${token}`)}</span>`
        } else if (isIn(Stats, token)) {
          iconHTML = `<span class="description-icon stat">
            <img src="assets/icons/${token}.png" />
            <span class="stat-label">${t(`stat.${token}`)}</span>
          </span>`
        } else if (isIn(DocumentedStatuses, token)) {
          const isPositive = PositiveStatuses.includes(token as Status)
          const path = `status_description.${token}` as const
          iconHTML = `<span class="description-icon status" title="${t(path, getDescriptionConfig(path))}">
            <img src="assets/icons/${token}.svg" />
            <span class="status-label${isPositive ? " positive" : ""}">${t(`status.${token}`)}</span>
          </span>`
        } else if (isIn(BoardEffects, token)) {
          const path = `effect_description.${token}` as const
          const title = t(path, getDescriptionConfig(path))
          iconHTML = `<span class="description-icon board-effect" title="${title}">
            <img src="assets/icons/effects/${token}.svg" />
            <span class="board-effect-label">${t(`effect.${token}`)}</span>
          </span>`
        } else if (isIn(Weathers, token)) {
          iconHTML = `<span class="description-icon weather" title="${t(`weather_description.${token}`, getWeatherConfig(token))}">
            <img src="assets/icons/weather/${token.toLowerCase()}.svg" />
            <span class="weather-label">${t(`weather.${token}`)}</span>
          </span>`
        } else if (isIn(Items, token)) {
          const path = `item_description.${token}` as const
          iconHTML = `<span class="description-icon item" title="${t(path, getDescriptionConfig(path))}" data-tooltip-id="item-detail-tooltip" data-tooltip-content="${token}">
            <img src="assets/item/${token}.png" />
            <span class="item-label">${t(`item.${token}`)}</span>
          </span>`
        } else if (isIn(Synergies, token)) {
          iconHTML = `<span class="description-icon synergy">
            <img src="assets/types/${token}.svg" style="width: 1.5em; height: 1.5em;" />
            <span class="synergy-label">${t(`synergy.${token}`)}</span>
          </span>`
        } else if (isIn(TechnicalTerms, token)) {
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
          }
          if (array.at(-1)?.includes("SP")) {
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
