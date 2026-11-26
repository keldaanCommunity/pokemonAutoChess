import type React from "react"
import { useEffect, useState } from "react"
import { isMegaPokemon } from "../../../../core/evolution-logic/mega-evolution"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import type { Emotion } from "../../../../types"
import { type Pkm, PkmByIndex } from "../../../../types/enum/Pokemon"
import {
  getAvatarSrc,
  getPokemonCustomFromAvatar,
  getPortraitSrc
} from "../../../../utils/avatar"
import { cc } from "../utils/jsx"

export interface PortraitOptions {
  index: string
  shiny?: boolean
  emotion?: Emotion
}

type Props = ({ avatar: string } | { portrait: string | PortraitOptions }) &
  React.ImgHTMLAttributes<HTMLImageElement> & { withPoolIcons?: boolean }

export default function PokemonPortrait(props: Props) {
  let src: string, pkm: Pkm
  if ("avatar" in props) {
    src = getAvatarSrc(props.avatar)
    pkm = getPokemonCustomFromAvatar(props.avatar).name
  } else if (typeof props.portrait === "object") {
    src = getPortraitSrc(
      props.portrait.index,
      props.portrait.shiny,
      props.portrait.emotion
    )
    pkm = PkmByIndex[props.portrait.index]
  } else {
    src = getPortraitSrc(props.portrait)
    pkm = PkmByIndex[props.portrait]
  }

  const { className, withPoolIcons, ...rest } = props

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

  const poolIconsClasses: {
    additional?: boolean
    regional?: boolean
    mega?: boolean
  } = {}
  if (withPoolIcons) {
    const pokemonData = getPokemonData(pkm)
    poolIconsClasses.additional = pokemonData.additional
    poolIconsClasses.regional = pokemonData.regional
    poolIconsClasses.mega = isMegaPokemon(pkm)
  }

  return (
    <div className={cc("pokemon-portrait", className || "", poolIconsClasses)}>
      <img src={imgSrc} loading="lazy" onError={handleError} {...rest} />
    </div>
  )
}
