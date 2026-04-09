export const THEMES = [
  "default",
  "super",
  "forest",
  "lilac",
  "north",
  "unown",
  "origin"
] as const

export type Theme = (typeof THEMES)[number]
