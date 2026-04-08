export const THEMES = [
  "default",
  "super",
  "forest",
  "lilac",
  "north",
  "origin"
] as const

export type Theme = (typeof THEMES)[number]
