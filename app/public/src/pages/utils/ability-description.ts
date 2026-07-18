import type { TFunction } from "i18next"
import {
  getAbilityDescriptionParameters,
  isMigratedAbility
} from "../../../../config/game/ability-definitions"
import type { Ability } from "../../../../types/enum/Ability"
import {
  getTranslationInterpolationVariables,
  interpolateTranslationTemplate
} from "../../../../utils/translation"

export function translateAbilityDescription(
  t: TFunction,
  ability: Ability
): string {
  const params = getAbilityDescriptionParameters(ability)
  return params
    ? t(`ability_description.${ability}`, params)
    : t(`ability_description.${ability}`)
}

export function resolveDescriptionPreview(
  path: string,
  template: string
): string {
  const [section, key] = path.split(".")
  if (
    section !== "ability_description" ||
    !key ||
    !isMigratedAbility(key as Ability)
  ) {
    return template
  }

  return interpolateTranslationTemplate(
    template,
    getAbilityDescriptionParameters(key as Ability)!
  )
}

export function getDescriptionPlaceholderError(
  path: string,
  targetTemplate: string
): string | undefined {
  const [section, key] = path.split(".")
  if (
    section !== "ability_description" ||
    !key ||
    !isMigratedAbility(key as Ability) ||
    !targetTemplate
  ) {
    return undefined
  }

  const expected = Object.keys(
    getAbilityDescriptionParameters(key as Ability)!
  ).sort()
  const actual = getTranslationInterpolationVariables(targetTemplate)
  if (expected.join("|") === actual.join("|")) return undefined

  return `Placeholders must match English: ${expected.map((name) => `{{${name}}}`).join(", ")}`
}
