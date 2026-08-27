export type TieredBalance = Readonly<{
  valuePerTier: readonly number[]
  apScaling?: number
  luckScaling?: boolean
  nbDecimals?: number
}>

export type BalanceParameter = number | TieredBalance | readonly TieredBalance[]
export type BalanceConfig = Readonly<Record<string, BalanceParameter>>

type BalanceContext = Readonly<{
  stars: number
  ap: number
  luck: number
}>

export function computeBalance(
  parameter: BalanceParameter,
  context: BalanceContext
): number {
  if (typeof parameter === "number") return parameter

  const balances = Array.isArray(parameter) ? parameter : [parameter]
  return balances.reduce(
    (total, balance) => total + computeTieredBalance(balance, context),
    0
  )
}

function computeTieredBalance(balance: TieredBalance, context: BalanceContext) {
  let result =
    balance.valuePerTier[context.stars - 1] ?? balance.valuePerTier.at(-1) ?? 0

  if (balance.apScaling !== undefined) {
    result *= 1 + (context.ap * balance.apScaling) / 100
  } else if (balance.luckScaling) {
    result =
      result === 0
        ? 0
        : Math.min(100, Math.pow(result / 100, 1 - context.luck / 100) * 100)
  }

  return result
}
