import { t } from "i18next"
import {
  type AbilityConfig,
  getAbilityConfig
} from "../../../../config/game/abilities"
import type { Ability } from "../../../../types/enum/Ability"

const INTERPOLATION_VARIABLE_REGEXP = /{{\s*([^{},\s]+)\s*}}/g
export function translateAbilityDescription(
  ability: Ability,
  template?: string
): string {
  const abilityConfig = getAbilityConfig(ability)
  const key = template ?? `ability_description.${ability}`
  return t(key, { defaultValue: key, ...abilityConfig })
}

export function resolveDescriptionPreview(
  path: string,
  template: string
): string {
  const ability = getAbilityFromDescriptionPath(path)
  return ability ? translateAbilityDescription(ability, template) : template
}

export function getDescriptionError(
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
  if (expected.join("|") !== actual.join("|")) {
    return `Placeholders must match ability config: ${expected.map((name) => `{{${name}}}`).join(", ")}`
  }

  return undefined
}

function getConfigFromDescriptionPath(path: string): AbilityConfig | undefined {
  const ability = getAbilityFromDescriptionPath(path)
  return ability ? getAbilityConfig(ability) : undefined
}

function getAbilityFromDescriptionPath(path: string): Ability | undefined {
  const [section, ability] = path.split(".")
  return section === "ability_description" && ability
    ? (ability as Ability)
    : undefined
}
