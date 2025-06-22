import React, { useEffect, useState } from "react"

import { getAvatarSrc, getPortraitSrc } from "../../../../utils/avatar"
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

  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  const handleError = () => {
    const missingPortrait = "/assets/ui/missing-portrait.png"
    if (imgSrc !== missingPortrait) {
      setImgSrc(missingPortrait)
    }
  }

  return (
    <img
      src={imgSrc}
      loading="lazy"
      className={cc(
        "pokemon-portrait",
        className || ""
      )}
      onError={handleError}
      {...rest}
    />
  )
}
