import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../../../config"
import type { Ability } from "../../../../../types/enum/Ability"

export type PreviewCell = { x: number; y: number }
export type AbilityPreviewData = Record<string, unknown>
export type AbilityPreviewPreset =
  | "target"
  | "adjacent"
  | "enemies"
  | "allies"
  | "none"

export type AbilityPreviewOptions = {
  caster: PreviewCell
  target: PreviewCell | null
  flip: boolean
  data: AbilityPreviewData
  ability?: Ability
}

export function isPreviewCell(value: unknown): value is PreviewCell {
  if (!value || typeof value !== "object" || !("x" in value) || !("y" in value))
    return false
  return (
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    Number.isInteger(value.x) &&
    Number.isInteger(value.y) &&
    value.x >= 0 &&
    value.x < BOARD_WIDTH &&
    value.y >= 0 &&
    value.y < BOARD_HEIGHT
  )
}

export function createAbilityPreviewPreset(
  preset: AbilityPreviewPreset,
  caster: PreviewCell,
  target: PreviewCell | null
): AbilityPreviewData {
  if (preset === "none") return { targets: [], allies: [] }
  const center = preset === "allies" || preset === "enemies" ? caster : target
  if (!center) return preset === "allies" ? { allies: [] } : { targets: [] }
  if (preset === "target") return { targets: [center] }

  const cells: PreviewCell[] = []
  for (let y = center.y - 1; y <= center.y + 1; y++) {
    for (let x = center.x - 1; x <= center.x + 1; x++) {
      const cell = { x, y }
      if (!isPreviewCell(cell)) continue
      if (x === caster.x && y === caster.y) continue
      cells.push(cell)
    }
  }
  return preset === "allies" ? { allies: cells } : { targets: cells }
}

export function parseAbilityPreviewData(text: string): AbilityPreviewData {
  const value: unknown = JSON.parse(text)
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Ability data must be a JSON object.")
  }
  return value as AbilityPreviewData
}
