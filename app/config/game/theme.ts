import { GADGETS } from "../../core/gadgets"
import { Title } from "../../types"
import { IUserMetadataUnpacked } from "../../types/interfaces/UserMetadata"

export const THEMES = [
  "default",
  "super",
  "lilac",
  "north",
  "unown",
  "umbra",
  "forest",
  "redocean",
  "origin"
] as const

export type Theme = (typeof THEMES)[number]

export const VIDEO_BG_THEMES: Theme[] = ["umbra", "forest", "redocean"]

export const TITLE_BY_THEME: Partial<Record<Theme, Title>> = {
  unown: Title.ARCHEOLOGIST,
  forest: Title.POKEMON_RANGER,
  umbra: Title.DELINQUENT,
  redocean: Title.FISHERMAN,
  origin: Title.MUSEUM_DIRECTOR
}

export const THEME_BY_TITLE: Partial<Record<Title, Theme>> = Object.fromEntries(
  Object.entries(TITLE_BY_THEME).map(([theme, title]) => [title, theme])
) as Partial<Record<Title, Theme>>

export const TITLES_UNLOCKING_THEMES: Title[] = Object.values(
  TITLE_BY_THEME
) as Title[]

export function isThemeUnlocked(
  theme: Theme,
  profile: IUserMetadataUnpacked
): boolean {
  if (profile.level < GADGETS.PALETTE.levelRequired) return false
  const requiredTitle = TITLE_BY_THEME[theme]
  if (!requiredTitle) return true
  return profile.titles.includes(requiredTitle)
}
