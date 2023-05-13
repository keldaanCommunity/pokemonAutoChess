import { PORTRAITS_PATH, Emotion } from "../../types"

export function getPortraitSrc(
  index: string,
  shiny?: boolean,
  emotion?: Emotion
) {
  const shinyPad = shiny ? (index.length === 4 ? "/0000/0001" : "/0001") : ""
  const emotionWithFallback = emotion ? emotion : Emotion.NORMAL
  return `${PORTRAITS_PATH}${index.replace(
    "-",
    "/"
  )}${shinyPad}/${emotionWithFallback}.png`
}

export function getAvatarSrc(avatar: string) {
  return `${PORTRAITS_PATH}${avatar.replace("-", "/")}.png`
}

export function getInformations(avatar: string) {
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
    index: index
  }
}
