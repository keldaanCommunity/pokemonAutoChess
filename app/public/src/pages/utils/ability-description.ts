import type { TFunction } from "i18next"
import {
  type AbilityConfig,
  getAbilityConfig
} from "../../../../config/game/abilities"
import type { Ability } from "../../../../types/enum/Ability"

const INTERPOLATION_VARIABLE_REGEXP = /{{\s*([^{},\s]+)\s*}}/g
const DYNAMIC_VALUE_FORMAT_REGEXP = /\[[^\]\n]*{{\s*[^{}]+\s*}}[^\]\n]*\]/g

export function translateAbilityDescription(
  t: TFunction,
  ability: Ability
): string {
  const abilityConfig = getAbilityConfig(ability)
  return abilityConfig
    ? t(`ability_description.${ability}`, abilityConfig)
    : t(`ability_description.${ability}`)
}

export function resolveDescriptionPreview(
  path: string,
  template: string
): string {
  const abilityConfig = getConfigFromDescriptionPath(path)
  if (!abilityConfig) return template

  return template.replace(
    INTERPOLATION_VARIABLE_REGEXP,
    (placeholder, variable: string) =>
      variable in abilityConfig ? String(abilityConfig[variable]) : placeholder
  )
}

export function getDescriptionPlaceholderError(
  path: string,
  targetTemplate: string,
  englishTemplate?: string
): string | undefined {
  const abilityConfig = getConfigFromDescriptionPath(path)
  if (!abilityConfig || !targetTemplate) return undefined

  const expected = Object.keys(abilityConfig).sort()
  const actual = [
    ...new Set(
      Array.from(
        targetTemplate.matchAll(INTERPOLATION_VARIABLE_REGEXP),
        (match) => match[1]!.trim()
      )
    )
  ].sort()
  if (expected.join("|") !== actual.join("|")) {
    return `Placeholders must match English: ${expected.map((name) => `{{${name}}}`).join(", ")}`
  }

  if (englishTemplate) {
    const expectedFormats = getDynamicValueFormats(englishTemplate)
    const actualFormats = getDynamicValueFormats(targetTemplate)
    if (expectedFormats.join("|") !== actualFormats.join("|")) {
      return `Dynamic value formatting must match English (including SP/LK): ${expectedFormats.join(", ")}`
    }
  }

  return undefined
}

function getDynamicValueFormats(template: string): string[] {
  return [
    ...new Set(
      Array.from(template.matchAll(DYNAMIC_VALUE_FORMAT_REGEXP), (match) =>
        match[0].replace(/\s/g, "")
      )
    )
  ].sort()
}

function getConfigFromDescriptionPath(path: string): AbilityConfig | undefined {
  const [section, ability] = path.split(".")
  return section === "ability_description" && ability
    ? getAbilityConfig(ability as Ability)
    : undefined
}
