import React from "react"

import { getAvatarSrc, getPortraitSrc } from "../../../../utils/avatar"
import { usePreference } from "../../preferences"
import { cc } from "../utils/jsx"
import { Emotion } from "../../../../types"

interface PortraitOptions {
  index?: string
  shiny?: boolean
  emotion?: Emotion
}

type Props = (
  | { avatar: string }
  | { portrait: string | PortraitOptions | undefined }
) &
  React.ImgHTMLAttributes<HTMLImageElement>

export default function PokemonPortrait(props: Props) {
  const [antialiasing] = usePreference("antialiasing")
  let src
  if ("avatar" in props) {
    src = getAvatarSrc(props.avatar)
  } else {
    src =
      typeof props.portrait === "object"
        ? getPortraitSrc(
          props.portrait.index,
          props.portrait.shiny,
          props.portrait.emotion
        )
        : getPortraitSrc(props.portrait)
  }
  const { className, ...rest } = props

  return (
    <img
      src={src}
      loading="lazy"
      className={cc(
        "pokemon-portrait",
        { pixelated: !antialiasing },
        className || ""
      )}
      {...rest}
    />
  )
}
