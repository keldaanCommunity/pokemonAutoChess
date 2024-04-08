import { DungeonMusic } from "../../../../types/enum/Dungeon"
import GameScene from "../../game/scenes/game-scene"
import { preferences } from "../../preferences"

export const SOUNDS = {
  BUTTON_CLICK: "buttonclick.ogg",
  BUTTON_HOVER: "buttonhover.ogg",
  CAROUSEL_UNLOCK: "carouselunlock.ogg",
  FINISH1: "finish1.ogg",
  FINISH2: "finish2.ogg",
  FINISH3: "finish3.ogg",
  FINISH4: "finish4.ogg",
  FINISH5: "finish5.ogg",
  FINISH6: "finish6.ogg",
  FINISH7: "finish7.ogg",
  FINISH8: "finish8.ogg",
  JOIN_ROOM: "joinroom.ogg",
  LEAVE_ROOM: "leaveroom.ogg",
  NEW_ROOM: "newroom.ogg",
  SET_READY: "setready.ogg",
  START_GAME: "startgame.ogg"
} as const

type Soundkey = (typeof SOUNDS)[keyof typeof SOUNDS]

const AUDIO_ELEMENTS: { [K in Soundkey]?: HTMLAudioElement } = {}

export function preloadSounds() {
  Object.values(SOUNDS).forEach(
    (sound) => (AUDIO_ELEMENTS[sound] = new Audio(`assets/sounds/${sound}`))
  )
}

export function preloadMusic(scene: Phaser.Scene, dungeonMusic: DungeonMusic) {
  scene.load.audio("music_" + dungeonMusic, [
    `https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChessMusic/main/ogg/${encodeURIComponent(
      dungeonMusic
    )}.ogg`
  ])
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
    AUDIO_ELEMENTS[key]!.volume = preferences.sfxVolume / 100
    AUDIO_ELEMENTS[key]!.play()
  }
}

type SceneWithMusic = Phaser.Scene & { music?: Phaser.Sound.WebAudioSound }

export function playMusic(scene: SceneWithMusic, name: string) {
  if (scene == null) return
  if (scene.music) scene.music.destroy()
  scene.music = scene.sound.add("music_" + name, {
    loop: true
  }) as Phaser.Sound.WebAudioSound
  const musicVolume = preferences.musicVolume / 100
  scene.music.play({ volume: musicVolume, loop: true })
}
