import { AbilityConfigs } from "../../../../config/game/abilities"
import type { BalanceConfig } from "../../../../config/game/balance"
import { EffectConfigs } from "../../../../config/game/effects"
import { ItemConfigs } from "../../../../config/game/items"
import { PassiveConfigs } from "../../../../config/game/passives"
import { StatusConfigs } from "../../../../config/game/statuses"
import { SynergyConfigs } from "../../../../config/game/synergies"
import { WeatherConfigs } from "../../../../config/game/weathers"

const INTERPOLATION_VARIABLE_REGEXP = /{{\s*([^{},\s]+)\s*}}/g
const DescriptionConfigs: Record<
  string,
  Partial<Record<string, BalanceConfig>>
> = {
  ability_description: AbilityConfigs,
  item_description: ItemConfigs,
  passive_description: PassiveConfigs,
  status_description: StatusConfigs,
  synergy_description: SynergyConfigs,
  effect_description: EffectConfigs,
  weather_description: WeatherConfigs
}

export function getDescriptionError(
  path: string,
  targetTemplate: string
): string | undefined {
  const descriptionConfig = getDescriptionConfig(path)
  if (!descriptionConfig || !targetTemplate) return undefined

  const expected = Object.keys(descriptionConfig).sort()
  const actual = [
    ...new Set(
      Array.from(
        targetTemplate.matchAll(INTERPOLATION_VARIABLE_REGEXP),
        (match) => match[1]!.trim()
      )
    )
  ].sort()
  if (expected.join("|") !== actual.join("|")) {
    return `Placeholders must match config: ${expected.map((name) => `{{${name}}}`).join(", ")}`
  }

  return undefined
}

export function getDescriptionConfig(path: string): BalanceConfig | undefined {
  const [section, key] = path.split(".")
  if (!key) return undefined
  return DescriptionConfigs[section]?.[key]
}
