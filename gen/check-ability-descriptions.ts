import { execFileSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { createInstance } from "i18next"
import {
  AbilityDefinitions,
  MigratedAbilities,
  type MigratedAbility
} from "../app/config/game/ability-definitions"
import type { Ability } from "../app/types/enum/Ability"
import {
  getTranslationInterpolationVariables,
  interpolateTranslationTemplate,
  type TranslationInterpolationParams
} from "../app/utils/translation"

type TranslationFile = {
  ability_description?: Partial<Record<Ability, string>>
}

const REPOSITORY_ROOT = path.resolve(__dirname, "..")
const LOCALES_ROOT = path.join(
  REPOSITORY_ROOT,
  "app/public/dist/client/locales"
)
const ABILITY_DEFINITIONS_ROOT = path.join(
  REPOSITORY_ROOT,
  "app/config/game/ability-definitions"
)
const DEFINITION_INFRASTRUCTURE_FILES = new Set([
  "define-ability.ts",
  "index.ts",
  "registry.generated.ts"
])
const COMPARE_WITH_GIT = process.argv.includes("--compare-git")
const LIST_UNMIGRATED = process.argv.includes("--list-unmigrated")
const MAX_UNMIGRATED_NUMERIC_DESCRIPTIONS = 528
const EXPECTED_NUMERIC_CORRECTIONS = new Set([
  "bg.PROTECT",
  "de.STRUGGLE_BUG",
  "es.STRUGGLE_BUG",
  "fr.STRUGGLE_BUG",
  "it.STRUGGLE_BUG",
  "ko.STRUGGLE_BUG",
  "nl.PROTECT",
  "pt.STRUGGLE_BUG",
  "th.STRUGGLE_BUG",
  "zh.FREEZING_GLARE",
  "zh.STRUGGLE_BUG"
])

const errors: string[] = []
let descriptionsChecked = 0
let fallbackDescriptionsChecked = 0
let baselineDescriptionsChecked = 0
let numericCorrectionsChecked = 0
const fallbackDescriptions: string[] = []
const headTranslationCache = new Map<string, TranslationFile>()
const i18nextInstances = new Map<string, ReturnType<typeof createInstance>>()

function readTranslationFile(filePath: string): TranslationFile {
  return JSON.parse(readFileSync(filePath, "utf8")) as TranslationFile
}

function readHeadTranslationFile(relativePath: string): TranslationFile {
  const cached = headTranslationCache.get(relativePath)
  if (cached) return cached

  const content = execFileSync(
    "git",
    ["show", `HEAD:${relativePath.replaceAll("\\", "/")}`],
    { cwd: REPOSITORY_ROOT, encoding: "utf8" }
  )
  const translation = JSON.parse(content) as TranslationFile
  headTranslationCache.set(relativePath, translation)
  return translation
}

function sameVariables(left: string[], right: string[]): boolean {
  return left.join("|") === right.join("|")
}

function descriptionShape(description: string): string {
  return description.replace(/\[[^\]]+\]|\d+(?:[.,]\d+)?/g, "<value>")
}

function renderWithI18next(
  locale: string,
  translation: TranslationFile,
  englishTranslation: TranslationFile,
  ability: MigratedAbility
): string {
  let instance = i18nextInstances.get(locale)
  if (!instance) {
    instance = createInstance()
    void instance.init({
      lng: locale,
      fallbackLng: "en",
      initAsync: false,
      resources: {
        en: { translation: englishTranslation },
        ...(locale === "en" ? {} : { [locale]: { translation } })
      },
      interpolation: { escapeValue: false }
    })
    i18nextInstances.set(locale, instance)
  }
  const translate = instance.t.bind(instance) as (
    key: string,
    params: TranslationInterpolationParams
  ) => string
  return translate(
    `ability_description.${ability}`,
    AbilityDefinitions[ability].descriptionParameters
  )
}

const locales = readdirSync(LOCALES_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const relativePath = path.join(
      "app/public/dist/client/locales",
      entry.name,
      "translation.json"
    )
    return {
      name: entry.name,
      relativePath,
      translation: readTranslationFile(path.join(REPOSITORY_ROOT, relativePath))
    }
  })

const englishTranslation = locales.find(
  (locale) => locale.name === "en"
)?.translation
if (!englishTranslation) {
  throw new Error("Missing English translation file")
}

const migratedAbilitySet = new Set<Ability>(MigratedAbilities)
const unmigratedNumericDescriptions = Object.entries(
  englishTranslation.ability_description ?? {}
)
  .filter(
    ([ability, description]) =>
      /\d/.test(description) && !migratedAbilitySet.has(ability as Ability)
  )
  .map(([ability]) => ability as Ability)
  .sort()

const definitionFiles = readdirSync(ABILITY_DEFINITIONS_ROOT)
  .filter(
    (fileName) =>
      fileName.endsWith(".ts") && !DEFINITION_INFRASTRUCTURE_FILES.has(fileName)
  )
  .sort()
const registeredDefinitionFiles = MigratedAbilities.map(
  (ability) => `${ability.toLowerCase().replaceAll("_", "-")}.ts`
).sort()
if (definitionFiles.join("|") !== registeredDefinitionFiles.join("|")) {
  errors.push(
    `Ability definition files do not match the generated registry. Files: ${definitionFiles.join(", ")}; registry: ${registeredDefinitionFiles.join(", ")}`
  )
}
if (
  unmigratedNumericDescriptions.length > MAX_UNMIGRATED_NUMERIC_DESCRIPTIONS
) {
  errors.push(
    `Numeric-description migration regressed from at most ${MAX_UNMIGRATED_NUMERIC_DESCRIPTIONS} remaining entries to ${unmigratedNumericDescriptions.length}`
  )
}

for (const ability of MigratedAbilities) {
  const definitionFileName = ability.toLowerCase().replaceAll("_", "-")
  const params = AbilityDefinitions[ability].descriptionParameters
  const expectedVariables = Object.keys(params).sort()
  if (englishTranslation.ability_description?.[ability] === undefined) {
    errors.push(`${ability}: missing English ability description`)
  }
  const abilityFile = path.join(
    REPOSITORY_ROOT,
    "app/core/abilities",
    `${ability.toLowerCase().replaceAll("_", "-")}.ts`
  )
  const abilitySource = readFileSync(abilityFile, "utf8")

  if (
    !abilitySource.includes(
      `config/game/ability-definitions/${definitionFileName}`
    ) ||
    !abilitySource.includes("balance")
  ) {
    errors.push(
      `${ability}: runtime implementation does not reference its shared ability definition`
    )
  }

  for (const locale of locales) {
    const { name, relativePath, translation } = locale
    const localizedTemplate = translation.ability_description?.[ability]
    const englishTemplate = englishTranslation.ability_description?.[ability]
    if (englishTemplate === undefined) continue
    const template = localizedTemplate ?? englishTemplate

    if (localizedTemplate === undefined) {
      fallbackDescriptionsChecked += 1
      fallbackDescriptions.push(`${name}.${ability}`)
    } else {
      descriptionsChecked += 1
    }
    const actualVariables = getTranslationInterpolationVariables(template)
    if (!sameVariables(expectedVariables, actualVariables)) {
      errors.push(
        `${name}.${ability}: expected placeholders ${expectedVariables.join(", ")}; found ${actualVariables.join(", ")}`
      )
    }

    const rendered = interpolateTranslationTemplate(template, params)
    const runtimeRendered = renderWithI18next(
      name,
      translation,
      englishTranslation,
      ability
    )
    if (runtimeRendered !== rendered) {
      errors.push(
        `${name}.${ability}: i18next output differs from validated interpolation\n  expected: ${rendered}\n  i18next:  ${runtimeRendered}`
      )
    }
    const unresolved = getTranslationInterpolationVariables(rendered)
    if (unresolved.length > 0) {
      errors.push(
        `${name}.${ability}: unresolved placeholders ${unresolved.join(", ")}`
      )
    }

    if (COMPARE_WITH_GIT) {
      const headLocaleTranslation = readHeadTranslationFile(relativePath)
      const headLocalizedTemplate =
        headLocaleTranslation.ability_description?.[ability]
      const headEnglishTemplate = readHeadTranslationFile(
        path.join("app/public/dist/client/locales/en/translation.json")
      ).ability_description?.[ability]
      const baselineTemplate = headLocalizedTemplate ?? headEnglishTemplate

      if (
        localizedTemplate === undefined &&
        headLocalizedTemplate !== undefined
      ) {
        errors.push(
          `${name}.${ability}: localized description was removed and would now fall back to English`
        )
      }
      if (baselineTemplate === undefined) {
        errors.push(
          `${name}.${ability}: missing from HEAD and English baselines`
        )
        continue
      }

      const baseline = interpolateTranslationTemplate(baselineTemplate, params)
      baselineDescriptionsChecked += 1
      if (rendered !== baseline) {
        const correctionKey = `${name}.${ability}`
        if (
          EXPECTED_NUMERIC_CORRECTIONS.has(correctionKey) &&
          descriptionShape(rendered) === descriptionShape(baseline)
        ) {
          numericCorrectionsChecked += 1
        } else {
          errors.push(
            `${name}.${ability}: rendered output changed during migration\n  before: ${baseline}\n  after:  ${rendered}`
          )
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Ability description validation failed:\n")
  errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
} else {
  console.log(
    `Validated ${descriptionsChecked} descriptions for ${MigratedAbilities.length} migrated abilities.`
  )
  console.log(
    `Validated ${fallbackDescriptionsChecked} English fallbacks for missing localized descriptions.`
  )
  if (fallbackDescriptions.length > 0) {
    console.log(`Fallbacks: ${fallbackDescriptions.sort().join(", ")}`)
  }
  if (COMPARE_WITH_GIT) {
    console.log(
      `Confirmed ${baselineDescriptionsChecked - numericCorrectionsChecked} rendered descriptions are unchanged from HEAD.`
    )
    if (numericCorrectionsChecked > 0) {
      console.log(
        `Confirmed ${numericCorrectionsChecked} expected numeric corrections without wording changes.`
      )
    }
  }
  console.log(
    `${unmigratedNumericDescriptions.length} English ability descriptions containing numeric literals remain unmigrated.`
  )
  if (LIST_UNMIGRATED && unmigratedNumericDescriptions.length > 0) {
    console.log(unmigratedNumericDescriptions.join("\n"))
  }
}
