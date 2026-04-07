import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

type JsonObject = Record<string, unknown>

const LOCALES_ROOT = path.resolve(
  __dirname,
  "../app/public/dist/client/locales"
)
const REFERENCE_LOCALE = "en"
const TRANSLATION_FILE = "translation.json"

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function collectLeafPaths(
  value: unknown,
  currentPath = "",
  result = new Set<string>()
): Set<string> {
  if (!isPlainObject(value)) {
    if (currentPath) {
      result.add(currentPath)
    }
    return result
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const nextPath = currentPath ? `${currentPath}.${key}` : key
    collectLeafPaths(nestedValue, nextPath, result)
  }

  return result
}

function readTranslation(locale: string): JsonObject {
  const filePath = path.join(LOCALES_ROOT, locale, TRANSLATION_FILE)
  const content = readFileSync(filePath, "utf-8")
  const parsed = JSON.parse(content) as unknown

  if (!isPlainObject(parsed)) {
    throw new Error(`Invalid translation object for locale "${locale}".`)
  }

  return parsed
}

function printDivider(char = "-", width = 80): void {
  console.log(char.repeat(width))
}

function formatLocaleHeader(locale: string, count: number): string {
  const suffix = count === 1 ? "label" : "labels"
  return `${locale.toUpperCase()}  |  ${count} extra ${suffix}`
}

function run(): void {
  const localeEntries = readdirSync(LOCALES_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  if (!localeEntries.includes(REFERENCE_LOCALE)) {
    throw new Error(
      `Reference locale "${REFERENCE_LOCALE}" was not found in ${LOCALES_ROOT}.`
    )
  }

  const referenceKeys = collectLeafPaths(readTranslation(REFERENCE_LOCALE))

  console.log("Checking translation labels against English reference")
  console.log(`Reference locale: ${REFERENCE_LOCALE}`)
  console.log(`Locales root: ${LOCALES_ROOT}`)
  printDivider("=")

  let localesWithExtras = 0
  let totalExtraLabels = 0

  for (const locale of localeEntries) {
    if (locale === REFERENCE_LOCALE) {
      continue
    }

    const localeKeys = collectLeafPaths(readTranslation(locale))
    const extraKeys = [...localeKeys]
      .filter((key) => !referenceKeys.has(key))
      .sort((a, b) => a.localeCompare(b))

    totalExtraLabels += extraKeys.length

    if (extraKeys.length === 0) {
      console.log(formatLocaleHeader(locale, 0))
      console.log("  No extra labels.")
      printDivider()
      continue
    }

    localesWithExtras += 1
    console.log(formatLocaleHeader(locale, extraKeys.length))
    extraKeys.forEach((key) => console.log(`  - ${key}`))
    printDivider()
  }

  printDivider("=")
  console.log(`Locales scanned: ${localeEntries.length - 1}`)
  console.log(`Locales with extras: ${localesWithExtras}`)
  console.log(`Total extra labels: ${totalExtraLabels}`)
}

run()
