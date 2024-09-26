import { loadPreferences } from "../../preferences"

export function enterFullScreen() {
  if (document.fullscreenEnabled && loadPreferences().fullscreen) {
    document.documentElement.requestFullscreen()
  }
}

export function exitFullScreen() {
  if (document.fullscreenEnabled) {
    document.exitFullscreen()
  }
}

export function toggleFullScreen() {
  if (!document.fullscreenElement) {
    enterFullScreen()
  } else {
    exitFullScreen()
  }
}
