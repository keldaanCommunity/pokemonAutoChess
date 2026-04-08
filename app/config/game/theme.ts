export const THEMES = ["default", "super", "forest", "origin"] as const

export type Theme = (typeof THEMES)[number]
