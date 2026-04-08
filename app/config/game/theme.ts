export const THEMES = ["default", "super", "forest", "north", "origin"] as const

export type Theme = (typeof THEMES)[number]
