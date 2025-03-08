import React, { Dispatch, SetStateAction } from "react"
import { IPokemonCollectionItem } from "../../../../../models/mongo-models/user-metadata"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { BoosterPriceByRarity, getEmotionCost } from "../../../../../types/Config"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import "./pokemon-collection-item.css"
import { usePreferences } from "../../../preferences"

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  config: IPokemonCollectionItem | undefined
  filter: string
  shinyOnly: boolean
  refundableOnly: boolean
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
}) {
  const [{ antialiasing }] = usePreferences()
  if (
    props.index in PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX === false ||
    PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index].includes(1) === false
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
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]?.[i] === 1
  )

  const rarity = getPokemonData(props.name).rarity
  const boosterCost = BoosterPriceByRarity[rarity]
  if (props.refundableOnly && dust < boosterCost) return null

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
      className={cc("my-box", "clickable", "pokemon-collection-item", {
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
        loading="lazy"
        className={cc({ pixelated: !antialiasing })}
      />
      <p>
        <span>{props.config ? props.config.dust : 0}</span>
        <img
          src={getPortraitSrc(props.index)}
          className={cc({ pixelated: !antialiasing })}
        />
      </p>
    </div>
  )
}
