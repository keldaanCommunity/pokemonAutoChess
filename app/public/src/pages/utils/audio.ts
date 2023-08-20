import { getPreferences } from "../../preferences"

export const SOUNDS = {
  BUTTON_CLICK: "buttonclick.mp3",
  BUTTON_HOVER: "buttonhover.mp3",
  CAROUSEL_UNLOCK: "carouselunlock.mp3",
  FINISH1: "finish1.mp3",
  FINISH2: "finish2.mp3",
  FINISH3: "finish3.mp3",
  FINISH4: "finish4.mp3",
  FINISH5: "finish5.mp3",
  FINISH6: "finish6.mp3",
  FINISH7: "finish7.mp3",
  FINISH8: "finish8.mp3",
  JOIN_ROOM: "joinroom.mp3",
  LEAVE_ROOM: "leaveroom.mp3",
  NEW_ROOM: "newroom.mp3",
  SET_READY: "setready.mp3",
  START_GAME: "startgame.mp3"
} as const

type Soundkey = (typeof SOUNDS)[keyof typeof SOUNDS]

const AUDIO_ELEMENTS: { [K in Soundkey]?: HTMLAudioElement } = {}

export function preloadSounds() {
  Object.values(SOUNDS).forEach(
    (sound) => (AUDIO_ELEMENTS[sound] = new Audio(`assets/sounds/${sound}`))
  )
}

function setupSounds() {
  document.body.addEventListener("mouseover", (e) => {
    if (e.target instanceof HTMLButtonElement) {
      playSound(SOUNDS.BUTTON_HOVER)
    }
  })
  document.body.addEventListener("click", (e) => {
    if (e.target instanceof HTMLButtonElement) {
      playSound(SOUNDS.BUTTON_CLICK)
    }
  })
}

preloadSounds()
setupSounds()

export function playSound(key: Soundkey) {
  if (AUDIO_ELEMENTS[key]) {
    AUDIO_ELEMENTS[key]!.volume = getPreferences().sfxVolume / 100
    AUDIO_ELEMENTS[key]!.play()
  }
}
