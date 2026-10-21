import { EffectConfigs } from "../../../../config/game/effects"
import { getWeatherConfig } from "../../../../config/game/weathers"
import { Weather } from "../../../../types/enum/Weather"

export const placeholderRegExp = /\{\{[^{}]*\}\}/g

export function getDescriptionConfig(path: string) {
  const [category, key] = path.split(".")
  if (!key) return
  if (category === "weather_description" && Object.hasOwn(Weather, key)) {
    return getWeatherConfig(key as Weather)
  }
  if (category === "effect_description" && Object.hasOwn(EffectConfigs, key)) {
    return EffectConfigs[key as keyof typeof EffectConfigs]
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
