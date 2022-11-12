import { CDN_PORTRAIT_URL, Emotion } from "../../types"

export function getPortraitSrc(index: string, shiny?: boolean, emotion?: Emotion){
    const shinyPad = shiny ? "/0000/0001/" : ""
    const emotionWithFallback = emotion ? emotion : Emotion.NORMAL
    return `${CDN_PORTRAIT_URL}${index.replace(
        "-",
        "/"
      )}${shinyPad}/${emotionWithFallback}.png`
}

export function getAvatarSrc(avatar: string){
    return `${CDN_PORTRAIT_URL}${avatar.replace('-','/')}.png`
}