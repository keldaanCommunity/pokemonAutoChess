import React, { Dispatch, SetStateAction } from "react"
import { BoosterPriceByRarity, getEmotionCost } from "../../../../../config"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { IPokemonCollectionItemUnpacked } from "../../../../../types/interfaces/UserMetadata"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { PokemonAnimations } from "../../../game/components/pokemon-animations"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import { CollectionFilterState } from "./pokemon-collection"
import "./pokemon-collection-item.css"

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  item: IPokemonCollectionItemUnpacked | undefined
  filterState: CollectionFilterState
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
}) {
  const lastBoostersOpened = useAppSelector(
    (state) => state.lobby.lastBoostersOpened
  )

  if (
    props.index in PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX === false ||
    PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index].includes(1) === false
  ) {
    return null
  }

  const { dust, emotions, shinyEmotions } = props.item ?? {
    dust: 0,
    emotions: [] as Emotion[],
    shinyEmotions: [] as Emotion[]
  }
  const isUnlocked =
    props.filterState.mode === "pokedex"
      ? (props.item?.played ?? 0) > 0
      : props.filterState.mode === "shiny"
        ? shinyEmotions?.length > 0
        : emotions?.length > 0 || shinyEmotions?.length > 0

  const isNew = lastBoostersOpened.some((booster) =>
    booster.some((card) => card.name === props.name && card.new)
  )

  const availableEmotions = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]?.[i] === 1
  )
  const rarity = getPokemonData(props.name).rarity
  const boosterCost = BoosterPriceByRarity[rarity]
  if (props.filterState.filter === "refundable" && dust < boosterCost)
    return null

  if (props.filterState.filter === "new" && !isNew) return null

  const canUnlock =
    props.filterState.mode !== "pokedex" &&
    availableEmotions.some(
      (e) =>
        (emotions.includes(e) === false &&
          dust >= getEmotionCost(e, false) &&
          props.filterState.mode !== "shiny") ||
        (shinyEmotions.includes(e) === false &&
          dust >= getEmotionCost(e, true) &&
          !PokemonAnimations[props.name]?.shinyUnavailable)
    )

  if (props.filterState.filter === "unlocked" && !isUnlocked) return null
  if (props.filterState.filter === "unlockable" && !canUnlock) return null
  if (props.filterState.filter === "locked" && isUnlocked) return null

  return (
    <div
      className={cc("my-box", "clickable", "pokemon-collection-item", {
        unlocked: isUnlocked,
        unlockable: canUnlock,
        new: isNew,
        shimmer: isNew
      })}
      onClick={() => {
        props.setPokemon(props.name)
      }}
    >
      <PokemonPortrait
        portrait={{
          index: props.index,
          shiny: props.item?.selectedShiny ?? false,
          emotion: props.item?.selectedEmotion ?? Emotion.NORMAL
        }}
      />
      {props.filterState.mode === "pokedex" ? (
        <p>{props.item?.played ?? 0}</p>
      ) : (
        <p className="dust">
          <span>{props.item ? props.item.dust : 0}</span>
          <img src={getPortraitSrc(props.index)} />
        </p>
      )}
    </div>
  )
}
