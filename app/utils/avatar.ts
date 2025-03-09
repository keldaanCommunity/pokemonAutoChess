import { CDN_PORTRAIT_URL, Emotion, PkmWithCustom } from "../types"
import { Pkm, PkmByIndex, PkmIndex } from "../types/enum/Pokemon"

export function getPortraitSrc(
  index?: string,
  shiny?: boolean,
  emotion?: Emotion
) {
  return getAvatarSrc(getAvatarString(index, shiny, emotion))
}

export function getAvatarSrc(avatar: string) {
  return `${CDN_PORTRAIT_URL}${avatar.replace(/(\d+)\-(\d+)/, "$1/$2")}.png`
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
