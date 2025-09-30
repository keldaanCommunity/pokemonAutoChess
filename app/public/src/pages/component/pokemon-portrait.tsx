import React, { useEffect, useState } from "react"
import { Emotion } from "../../../../types"
import { getAvatarSrc, getPortraitSrc } from "../../../../utils/avatar"
import { cc } from "../utils/jsx"
import {  PkmByIndex } from "../../../../types/enum/Pokemon"
import { useTranslation } from "react-i18next"

interface PortraitOptions {
  index: string
  shiny?: boolean
  emotion?: Emotion
}

type Props = (
  | { avatar: string }
  | { portrait: string | PortraitOptions }
) &
  React.ImgHTMLAttributes<HTMLImageElement>

export default function PokemonPortrait(props: Props) {
  const { t } = useTranslation()
  let src: string
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

  const pokemonName = () => {
    if ("avatar" in props) {
      return PkmByIndex[props.avatar]
    }
    const portrait = props.portrait
    if (typeof portrait === "object") {
      return PkmByIndex[portrait.index]
    }
    return PkmByIndex[portrait]
  }
  
  return (
    <img
      src={imgSrc}
      title={t(`pkm.${pokemonName}`)}
      loading="lazy"
      className={cc("pokemon-portrait", className || "")}
      onError={handleError}
      {...rest}
    />
  )
}
