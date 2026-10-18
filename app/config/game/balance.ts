export type TieredBalance = Readonly<{
  valuePerTier: readonly number[]
  apScaling?: number
  luckScaling?: boolean
  nbDecimals?: number
}>

export type BalanceParameter = number | TieredBalance
export type BalanceConfig = Readonly<Record<string, BalanceParameter>>
