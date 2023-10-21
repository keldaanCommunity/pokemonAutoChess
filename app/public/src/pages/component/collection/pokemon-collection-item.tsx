import React, { Dispatch, SetStateAction } from "react"
import precomputedEmotions from "../../../../../models/precomputed/emotions.json"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Emotion } from "../../../../../types/enum/Emotion"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import { getEmotionCost } from "../../../../../types/Config"
import "./pokemon-collection-item.css"

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  config: IPokemonConfig | undefined
  filter: string
  shinyOnly: boolean
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
}) {
  if (
    !precomputedEmotions ||
    props.index in precomputedEmotions === false ||
    precomputedEmotions[props.index].includes(1) === false
  ) {
    return null
  }

  const { dust, emotions, shinyEmotions } = props.config ?? {
    dust: 0,
    emotions: [] as Emotion[],
    shinyEmotions: [] as Emotion[]
  }
  const isUnlocked =
    (!props.shinyOnly && emotions?.length > 0) || shinyEmotions?.length > 0
  const availableEmotions = Object.values(Emotion).filter(
    (e, i) => precomputedEmotions[props.index]?.[i] === 1
  )

  const canUnlock = availableEmotions.some(
    (e) =>
      (emotions.includes(e) === false &&
        dust >= getEmotionCost(e, false) &&
        !props.shinyOnly) ||
      (shinyEmotions.includes(e) === false && dust >= getEmotionCost(e, true))
  )

  if (props.filter === "unlocked" && !isUnlocked) return null
  if (props.filter === "unlockable" && !canUnlock) return null
  if (props.filter === "locked" && isUnlocked) return null

  return (
    <div
      className={cc("nes-container", "pokemon-collection-item", {
        unlocked: isUnlocked,
        unlockable: canUnlock,
        shimmer: canUnlock
      })}
      onClick={() => {
        props.setPokemon(props.name)
      }}
    >
      <img
        src={getPortraitSrc(
          props.index,
          props.config?.selectedShiny,
          props.config?.selectedEmotion
        )}
      />
      <p>
        <span>{props.config ? props.config.dust : 0}</span>
        <img src={getPortraitSrc(props.index)} />
      </p>
    </div>
  )
}
