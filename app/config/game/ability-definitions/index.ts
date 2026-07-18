import type { Ability } from "../../../types/enum/Ability"
import type { TranslationInterpolationParams } from "../../../utils/translation"
import { AbilityDefinitions } from "./registry.generated"

export * from "./define-ability"
export { AbilityDefinitions }

export type MigratedAbility = keyof typeof AbilityDefinitions

export const MigratedAbilities = Object.freeze(
  Object.keys(AbilityDefinitions) as MigratedAbility[]
)

export function isMigratedAbility(
  ability: Ability
): ability is MigratedAbility {
  return Object.prototype.hasOwnProperty.call(AbilityDefinitions, ability)
}

export function getAbilityDescriptionParameters(
  ability: Ability
): TranslationInterpolationParams | undefined {
  return isMigratedAbility(ability)
    ? AbilityDefinitions[ability].descriptionParameters
    : undefined
}
