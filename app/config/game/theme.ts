import { Title } from "../../types"
import { IUserMetadataUnpacked } from "../../types/interfaces/UserMetadata"
import { invertKeysValues, values } from "../../utils/object"
import { GADGETS } from "./gadgets"

export const THEMES = [
  "default",
  "super",
  "lilac",
  "north",
  "unown",
  "umbra",
  "forest",
  "redsea",
  "origin"
] as const

export type Theme = (typeof THEMES)[number]

export const VIDEO_BG_THEMES: Theme[] = ["umbra", "forest", "redsea"]

export const TITLE_BY_THEME = {
  unown: Title.ARCHEOLOGIST,
  forest: Title.POKEMON_RANGER,
  umbra: Title.DELINQUENT,
  redsea: Title.FISHERMAN,
  origin: Title.MUSEUM_DIRECTOR
} satisfies Partial<Record<Theme, Title>>

export const THEME_BY_TITLE = invertKeysValues(TITLE_BY_THEME)

export const TITLES_UNLOCKING_THEMES = values(TITLE_BY_THEME)
export type TitleUnlockingTheme = (typeof TITLES_UNLOCKING_THEMES)[number]

export function isThemeUnlocked(
  theme: Theme,
  profile: IUserMetadataUnpacked
): boolean {
  if (profile.level < GADGETS.palette.levelRequired) return false
  const requiredTitle = TITLE_BY_THEME[theme]
  if (!requiredTitle) return true
  return profile.titles.includes(requiredTitle)
}
