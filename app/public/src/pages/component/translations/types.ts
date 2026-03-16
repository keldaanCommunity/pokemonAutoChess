export type TranslationLeaf = string
export type TranslationNode = { [key: string]: TranslationValue }
export type TranslationValue = TranslationLeaf | TranslationNode
export type TranslationMap = { [key: string]: TranslationValue }

export function getNestedValue(obj: TranslationMap, path: string): string {
  const parts = path.split(".")
  let current: TranslationValue = obj
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return ""
    current = (current as TranslationNode)[part]
    if (current === undefined) return ""
  }
  return typeof current === "string" ? current : ""
}

export function applyEditsToObject(
  base: TranslationMap,
  edits: Record<string, string>
): TranslationMap {
  const result: TranslationMap = JSON.parse(JSON.stringify(base))
  for (const [path, value] of Object.entries(edits)) {
    const parts = path.split(".")
    let obj = result as TranslationNode
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]] as TranslationNode
    }
    obj[parts[parts.length - 1]] = value
  }
  return result
}
