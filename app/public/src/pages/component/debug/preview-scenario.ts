import { Ability } from "../../../../../types/enum/Ability"
import { DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { Orientation } from "../../../../../types/enum/Game"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Status } from "../../../../../types/enum/Status"
import { Weather } from "../../../../../types/enum/Weather"
import {
  type AbilityPreviewData,
  isPreviewCell,
  type PreviewCell
} from "./ability-preview"

export const EXTRA_PREVIEW_STATUSES = {
  POISONED_BADLY: "Badly poisoned",
  BALM_MUSHROOM: "Balm Mushroom",
  STELLAR: "Stellar",
  "BOOST/ATK": "Boost Attack",
  "BOOST/DEF": "Boost Defense",
  "BOOST/SPE_DEF": "Boost Special Defense",
  "BOOST/SHIELD": "Boost Shield",
  "BOOST/SPEED": "Boost Speed",
  "BOOST/AP": "Boost AP"
}

export type PreviewStatus = Status | keyof typeof EXTRA_PREVIEW_STATUSES | ""

export type PreviewScenario = {
  pokemon: Pkm
  orientation: Orientation
  animation: string
  shiny: boolean
  speed?: number
  status?: PreviewStatus
  caster: PreviewCell
  targetMode: "auto" | "custom" | "none"
  customTarget: PreviewCell
  flip: boolean
  map: DungeonPMDO | "plain"
  weather: Weather
  data: AbilityPreviewData
  ability?: Ability.HYPER_BEAM
}

export const DEFAULT_SCENARIO: PreviewScenario = {
  pokemon: Pkm.RATTATA,
  orientation: Orientation.DOWNLEFT,
  animation: "Idle",
  shiny: false,
  status: "",
  caster: { x: 3, y: 3 },
  targetMode: "auto",
  customTarget: { x: 4, y: 3 },
  flip: false,
  map: "plain",
  weather: Weather.NEUTRAL,
  data: {}
}

export const PREVIEW_ANIMATIONS = [
  "Idle",
  "Walk",
  "Sleep",
  "Eat",
  "Hurt",
  "Hop",
  "Attack",
  "Ability",
  "Emote"
]

export function isPreviewStatus(value: unknown): value is PreviewStatus {
  return (
    typeof value === "string" &&
    (value === "" ||
      Object.keys(EXTRA_PREVIEW_STATUSES).includes(value) ||
      Object.values<string>(Status).includes(value))
  )
}

function isScenario(value: unknown): value is PreviewScenario {
  if (!value || typeof value !== "object") return false
  const scenario: Partial<PreviewScenario> = value
  return (
    scenario.pokemon !== undefined &&
    Object.values(Pkm).includes(scenario.pokemon) &&
    scenario.orientation !== undefined &&
    Object.values(Orientation).includes(scenario.orientation) &&
    typeof scenario.animation === "string" &&
    PREVIEW_ANIMATIONS.includes(scenario.animation) &&
    typeof scenario.shiny === "boolean" &&
    (scenario.speed === undefined ||
      (typeof scenario.speed === "number" &&
        Number.isFinite(scenario.speed) &&
        scenario.speed >= 0 &&
        scenario.speed <= 300)) &&
    (scenario.ability === undefined ||
      scenario.ability === Ability.HYPER_BEAM) &&
    (scenario.status === undefined || isPreviewStatus(scenario.status)) &&
    isPreviewCell(scenario.caster) &&
    (scenario.targetMode === "auto" ||
      scenario.targetMode === "custom" ||
      scenario.targetMode === "none") &&
    isPreviewCell(scenario.customTarget) &&
    typeof scenario.flip === "boolean" &&
    (scenario.map === "plain" ||
      (scenario.map !== undefined &&
        Object.values(DungeonPMDO).includes(scenario.map))) &&
    scenario.weather !== undefined &&
    Object.values(Weather).includes(scenario.weather) &&
    !!scenario.data &&
    typeof scenario.data === "object" &&
    !Array.isArray(scenario.data)
  )
}

export function readPreviewScenario(search: string): PreviewScenario {
  const encoded = new URLSearchParams(search).get("preview")
  if (encoded === null) return DEFAULT_SCENARIO
  const scenario: unknown = JSON.parse(encoded)
  if (!isScenario(scenario)) throw new Error("Invalid preview scenario.")
  return scenario
}

export function previewScenarioUrl(href: string, scenario: PreviewScenario) {
  const url = new URL(href)
  url.searchParams.set("preview", JSON.stringify(scenario))
  return url.href
}
