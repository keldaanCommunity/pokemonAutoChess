import type { Dispatch, SetStateAction } from "react"
import { getAvailableEmotions } from "../../../../../models/precomputed/precomputed-emotions"
import { Emotion } from "../../../../../types/enum/Emotion"
import type { Pkm } from "../../../../../types/enum/Pokemon"
import type { IPokemonCollectionItemUnpacked } from "../../../../../types/interfaces/UserMetadata"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import type { CollectionFilterState } from "./pokemon-collection"
import "./pokemon-collection-item.css"

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  item: IPokemonCollectionItemUnpacked | undefined
  isNew: boolean
  isFavorite: boolean
  isUnlocked: boolean
  isUnlockable: boolean
  filterState: CollectionFilterState
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
}) {
  if (getAvailableEmotions(props.index, false).length === 0) {
    return null
  }

  return (
    <div
      className={cc("my-box", "clickable", "pokemon-collection-item", {
        unlocked: props.isUnlocked,
        unlockable: props.isUnlockable,
        new: props.isNew,
        favorite: props.isFavorite,
        shimmer: props.isNew
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
          <span>{props.item?.dust ?? 0}</span>
          <img src={getPortraitSrc(props.index)} />
        </p>
      )}
    </div>
  )
}
