export const THEMES = [
  "default",
  "super",
  "forest",
  "lilac",
  "north",
  "umbra",
  "unown",
  "redocean",
  "origin"
] as const

export type Theme = (typeof THEMES)[number]

export const VIDEO_BG_THEMES: Theme[] = ["umbra", "forest", "redocean"]
