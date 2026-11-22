import { subscribeToPreference } from "./preferences"

subscribeToPreference(
  "customCursors",
  (enabled) => {
    document.documentElement.classList.toggle("custom-cursors", enabled)
  },
  true
)
