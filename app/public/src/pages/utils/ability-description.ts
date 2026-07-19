import type { TFunction } from "i18next"
import {
  type AbilityConfig,
  getAbilityConfig
} from "../../../../config/game/abilities"
import type { Ability } from "../../../../types/enum/Ability"

const INTERPOLATION_VARIABLE_REGEXP = /{{\s*([^{},\s]+)\s*}}/g

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
  targetTemplate: string
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
  if (expected.join("|") === actual.join("|")) return undefined

  return `Placeholders must match English: ${expected.map((name) => `{{${name}}}`).join(", ")}`
}

function getConfigFromDescriptionPath(path: string): AbilityConfig | undefined {
  const [section, ability] = path.split(".")
  return section === "ability_description" && ability
    ? getAbilityConfig(ability as Ability)
    : undefined
}
