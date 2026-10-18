import { AbilityConfigs } from "../../../../config/game/abilities"
import { EffectConfigs } from "../../../../config/game/effects"
import { ItemConfigs } from "../../../../config/game/items"
import { PassiveConfigs } from "../../../../config/game/passives"
import { getStatusConfig } from "../../../../config/game/statuses"
import { getWeatherConfig } from "../../../../config/game/weathers"
import { Status } from "../../../../types/enum/Status"
import { Weather } from "../../../../types/enum/Weather"
import { isIn } from "../../../../utils/array"
import { keys } from "../../../../utils/object"

export const placeholderRegExp = /\{\{[^{}]*\}\}/g

export function getDescriptionConfig(path: string) {
  const [category, key] = path.split(".")
  if (!key) return
  if (category === "status_description" && Object.hasOwn(Status, key)) {
    return getStatusConfig(key as Status)
  }
  if (category === "weather_description" && Object.hasOwn(Weather, key)) {
    return getWeatherConfig(key as Weather)
  }
  if (category === "ability_description" && isIn(keys(AbilityConfigs), key)) {
    return AbilityConfigs[key]
  }
  if (category === "effect_description" && Object.hasOwn(EffectConfigs, key)) {
    return EffectConfigs[key as keyof typeof EffectConfigs]
  }
  if (category === "passive_description" && Object.hasOwn(PassiveConfigs, key)) {
    return PassiveConfigs[key as keyof typeof PassiveConfigs]
  }
  if (category === "item_description" && Object.hasOwn(ItemConfigs, key)) {
    return ItemConfigs[key as keyof typeof ItemConfigs]
  }
}

export function getDescriptionError(
  path: string,
  text: string,
  english: string
) {
  if (!getDescriptionConfig(path) || !text) return
  const expected = getPlaceholders(english)
  const actual = getPlaceholders(text)
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    return `Placeholders must match English: ${expected.map((p) => `{{${p}}}`).join(", ")}`
  }
}

function getPlaceholders(template: string) {
  const matches = template.match(placeholderRegExp) ?? []
  const names = matches.map((p) => p.slice(2, -2).trim())
  return [...new Set(names)].sort()
}
