import type { Ability } from "../../../types/enum/Ability"
import type { TranslationInterpolationParams } from "../../../utils/translation"

export type AbilityTierValues = readonly [number, ...number[]]

export type AbilityDefinition<
  TAbility extends Ability,
  TBalance extends object,
  TDescriptionParameters extends TranslationInterpolationParams
> = Readonly<{
  ability: TAbility
  balance: TBalance
  descriptionParameters: TDescriptionParameters
}>

export function defineAbility<
  const TAbility extends Ability,
  const TBalance extends object,
  const TDescriptionParameters extends TranslationInterpolationParams
>(definition: {
  ability: TAbility
  balance: TBalance
  describe: (balance: TBalance) => TDescriptionParameters
}): AbilityDefinition<TAbility, TBalance, TDescriptionParameters> {
  return Object.freeze({
    ability: definition.ability,
    balance: definition.balance,
    descriptionParameters: definition.describe(definition.balance)
  })
}

export function getAbilityTierValue(
  values: AbilityTierValues,
  stars: number
): number {
  return values[stars - 1] ?? values[values.length - 1]
}

export function tiered(
  values: AbilityTierValues,
  scaling?: "SP" | "LK"
): string {
  return `[${[...values, ...(scaling ? [scaling] : [])].join(",")}]`
}

export function millisecondsToSeconds(milliseconds: number): number {
  return milliseconds / 1000
}

export function bonusMultiplierToPercent(multiplier: number): number {
  return Math.round((multiplier - 1) * 100 * 1e10) / 1e10
}
