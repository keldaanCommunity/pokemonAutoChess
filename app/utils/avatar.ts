import { Emotion, PkmWithCustom } from "../types"
import { Pkm, PkmByIndex, PkmIndex } from "../types/enum/Pokemon"

const PORTRAITS_FALLBACKS = {
  "0669-0001": "0669",
  "0669-0002": "0669",
  "0669-0003": "0669",
  "0669-0004": "0669",
  "0670-0001": "0670",
  "0670-0002": "0670",
  "0670-0003": "0670",
  "0670-0004": "0670"
}

export function getPortraitSrc(
  index: string,
  shiny?: boolean,
  emotion?: Emotion
) {
  if (index in PORTRAITS_FALLBACKS) index = PORTRAITS_FALLBACKS[index]
  return getAvatarSrc(getAvatarString(index, shiny, emotion))
}

export function getPkmFromPortraitSrc(src: string): PkmWithCustom | null {
  const regex = /\/assets\/portraits\/([\w\/]+)\.png$/
  const match = src.match(regex)
  if (!match) return null
  return getPokemonCustomFromAvatar(match[1])
}

export function getAvatarSrc(avatar: string) {
  return `/assets/portraits/${avatar.replace(/(\d+)\-/g, "$1/")}.png`
}

export function getAvatarString(
  index?: string,
  shiny?: boolean,
  emotion?: Emotion
): string {
  const defaultIndex = index ?? PkmIndex[Pkm.MAGIKARP]
  const shinyPad = shiny
    ? defaultIndex.length === 4
      ? "/0000/0001"
      : "/0001"
    : ""
  return `${defaultIndex.replace("-", "/")}${shinyPad}/${
    emotion || Emotion.NORMAL
  }`
}

export function getPokemonCustomFromAvatar(avatar: string): PkmWithCustom {
  let emotion = Emotion.NORMAL
  let shiny = false
  let index = "0019"

  let noEmotion = avatar
  Object.values(Emotion).forEach((e_) => {
    const e = e_ as Emotion
    if (avatar.includes(e)) {
      noEmotion = avatar.replace(e, "")
      emotion = e
    }
  })
  if (noEmotion.endsWith("/")) {
    noEmotion = noEmotion.slice(0, noEmotion.length - 1)
  }
  if (noEmotion.endsWith("/")) {
    noEmotion = noEmotion.slice(0, noEmotion.length - 1)
  }
  const split = noEmotion.split("/")

  if (noEmotion.includes("/0000/0001")) {
    index = split[0]
    shiny = true
  } else if (split.length === 1) {
    index = split[0]
    shiny = false
  } else {
    if (split.length === 2) {
      index = noEmotion.replace("/", "-")
      shiny = false
    }
    if (split.length === 3) {
      index = `${split[0]}-${split[1]}`
      shiny = true
    }
  }
  return {
    emotion: emotion,
    shiny: shiny,
    name: PkmByIndex[index]
  }
}
