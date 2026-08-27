import React, { type ReactNode } from "react"
import {
  type BalanceParameter,
  computeBalance,
  type TieredBalance
} from "../../../../config/game/balance"
import { roundToNDigits } from "../../../../utils/number"
import { cc } from "./jsx"

export type DescriptionStats = {
  ap: number
  luck: number
  stars: number
  stages?: number
  showAbilityTiers?: boolean
}

export function renderBalance(
  parameter: BalanceParameter,
  stats?: DescriptionStats
): ReactNode {
  if (typeof parameter === "number") return parameter

  const balances = Array.isArray(parameter) ? parameter : [parameter]
  return balances.map((balance, index) => (
    <React.Fragment key={index}>
      {index > 0 ? " + " : null}
      {renderTieredBalance(balance, stats)}
    </React.Fragment>
  ))
}

function renderTieredBalance(balance: TieredBalance, stats?: DescriptionStats) {
  const showSelectedTier = stats?.stars !== undefined && !stats.showAbilityTiers
  const maxTier = stats?.stages ? stats.stages + 1 : 5
  const tiers = showSelectedTier
    ? [stats.stars]
    : balance.valuePerTier.slice(0, maxTier).map((_, index) => index + 1)
  const displayedValues = tiers.map((stars) =>
    roundToNDigits(
      computeBalance(balance, {
        stars,
        ap: stats?.ap ?? 0,
        luck: stats?.luck ?? 0
      }),
      balance.nbDecimals ?? 0
    )
  )

  return (
    <span
      className={cc("description-icon", {
        "scales-ap": balance.apScaling !== undefined,
        "scales-luck": balance.luckScaling === true
      })}
    >
      {balance.apScaling !== undefined ? (
        <img
          src="assets/icons/AP.png"
          alt="Ability Power"
          title="Scales with Ability Power"
        />
      ) : null}
      {balance.luckScaling ? (
        <img src="assets/icons/LUCK.png" alt="Luck" title="Scales with Luck" />
      ) : null}
      {displayedValues.map((displayedValue, index) => {
        const tier = stats?.stars
        const active =
          showSelectedTier ||
          tier === undefined ||
          balance.valuePerTier.length === 1 ||
          index === tier - 1 ||
          (tier > displayedValues.length &&
            index === displayedValues.length - 1)

        return (
          <span key={index} className="ability-value">
            <span className={cc({ active })}>{displayedValue}</span>
            {index < displayedValues.length - 1 ? "/" : ""}
          </span>
        )
      })}
    </span>
  )
}
