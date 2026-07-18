export type TranslationInterpolationValue = string | number
export type TranslationInterpolationParams = Readonly<
  Record<string, TranslationInterpolationValue>
>

const INTERPOLATION_VARIABLE_REGEXP = /{{\s*([^{},\s]+)\s*}}/g

export function getTranslationInterpolationVariables(
  template: string
): string[] {
  return [
    ...new Set(
      Array.from(template.matchAll(INTERPOLATION_VARIABLE_REGEXP), (match) =>
        match[1]!.trim()
      )
    )
  ].sort()
}

export function interpolateTranslationTemplate(
  template: string,
  params: TranslationInterpolationParams
): string {
  return template.replace(
    INTERPOLATION_VARIABLE_REGEXP,
    (placeholder, variable: string) =>
      variable in params ? String(params[variable]) : placeholder
  )
}
