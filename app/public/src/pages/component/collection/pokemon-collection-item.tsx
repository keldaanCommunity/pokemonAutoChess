import React, { Dispatch, SetStateAction } from "react"
import { IPokemonCollectionItem } from "../../../../../models/mongo-models/user-metadata"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { BoosterPriceByRarity, getEmotionCost } from "../../../../../types/Config"
import { Emotion } from "../../../../../types/enum/Emotion"
import { AnimationConfig, Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import "./pokemon-collection-item.css"

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  config: IPokemonCollectionItem | undefined
  filter: string
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
}) {
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
    props.filter === "pokedex" ? (props.config?.played ?? 0) > 0
      : props.filter === "shiny" ? shinyEmotions?.length > 0
        : emotions?.length > 0 || shinyEmotions?.length > 0


  const availableEmotions = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]?.[i] === 1
  )
  const rarity = getPokemonData(props.name).rarity
  const boosterCost = BoosterPriceByRarity[rarity]
  if (props.filter === "refundable" && dust < boosterCost) return null

  const canUnlock = props.filter !== "pokedex" && availableEmotions.some(
    (e) =>
      (emotions.includes(e) === false &&
        dust >= getEmotionCost(e, false) &&
        props.filter !== "shiny") ||
      (shinyEmotions.includes(e) === false && dust >= getEmotionCost(e, true) && !AnimationConfig[props.name]?.shinyUnavailable)
  )

  if (props.filter === "shiny" && (isUnlocked || !canUnlock)) return null
  if (props.filter === "unlocked" && !isUnlocked) return null
  if (props.filter === "unlockable" && !canUnlock) return null
  if (props.filter === "locked" && isUnlocked) return null

  return (
    <div
      className={cc("my-box", "clickable", "pokemon-collection-item", {
        unlocked: isUnlocked,
        unlockable: canUnlock
      })}
      onClick={() => {
        props.setPokemon(props.name)
      }}
    >
      <img
        src={getPortraitSrc(
          props.index,
          props.config?.selectedShiny,
          props.config?.selectedEmotion ?? Emotion.NORMAL
        )}
        loading="lazy"
      />
      {props.filter === "pokedex" ? <p>{props.config?.played ?? 0}</p> : <p className="dust">
        <span>{props.config ? props.config.dust : 0}</span>
        <img
          src={getPortraitSrc(props.index)}
        />
      </p>}
    </div>
  )
}
