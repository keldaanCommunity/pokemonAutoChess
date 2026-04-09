import { preference, subscribeToPreferences } from "./preferences"

const THEME_LINK_ID = "pac-theme"

export function applyTheme(theme: string) {
  let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null
  if (!theme || theme === "default") {
    link?.remove()
    return
  }
  if (!link) {
    link = document.createElement("link")
    link.id = THEME_LINK_ID
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }
  link.href = `themes/${theme}.css`
}

applyTheme(preference("theme"))
subscribeToPreferences((prefs) => applyTheme(prefs.theme))
