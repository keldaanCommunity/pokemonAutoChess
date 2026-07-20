import { type Dispatch, type SetStateAction, useMemo } from "react"
import { BoosterPriceByRarity, getEmotionCost } from "../../../../../config"
import { getAvailableEmotions } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmIndex, Unowns } from "../../../../../types/enum/Pokemon"
import type { IPokemonCollectionItemUnpacked } from "../../../../../types/interfaces/UserMetadata"
import { PokemonAnimations } from "../../../game/components/pokemon-animations"
import { useAppSelector } from "../../../hooks"
import { LocalStoreKeys, useLocalStore } from "../../utils/store"
import type { CollectionFilterState } from "./pokemon-collection"
import PokemonCollectionItem from "./pokemon-collection-item"
import "./unown-panel.css"

export default function UnownPanel(props: {
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
  filterState: CollectionFilterState
}) {
  const pokemonCollection = useAppSelector(
    (state) =>
      state.network.profile?.pokemonCollection ??
      new Map<string, IPokemonCollectionItemUnpacked>()
  )
  const secretMessage = `    
    To unleash ancient powers?
    Max Groudon with a red orb
    Give Kyogre a blue orb and
    use Jade orb for Rayquaza!
    `
    .replace(/^\s+/gm, "")
    .replace(/\s+$/gm, "")
    .split("")

  const [favorites] = useLocalStore<Pkm[]>(
    LocalStoreKeys.FAVORITES,
    [],
    Infinity
  )
  const lastBoostersOpened = useAppSelector(
    (state) => state.boosters.lastBoostersOpened
  )

  type CollectionItem = {
    pkm: Pkm
    item: IPokemonCollectionItemUnpacked
    isNew: boolean
    isFavorite: boolean
    isUnlocked: boolean
    isUnlockable: boolean
  }

  const unowns = useMemo<CollectionItem[]>(
    () =>
      Unowns.map((pkm: Pkm) => {
        const item = pokemonCollection.get(PkmIndex[pkm]) ?? {
          dust: 0,
          emotions: [] as Emotion[],
          shinyEmotions: [] as Emotion[],
          selectedEmotion: Emotion.NORMAL,
          selectedShiny: false,
          id: PkmIndex[pkm],
          played: 0
        }
        const pokemonData = getPokemonData(pkm)
        const availableEmotions = getAvailableEmotions(pokemonData.index, false)
        const shinyAvailableEmotions = getAvailableEmotions(
          pokemonData.index,
          true
        )
        const isUnlocked =
          item.emotions?.length > 0 || item.shinyEmotions?.length > 0
        const isNew = lastBoostersOpened.some((booster) =>
          booster.some((card) => card.name === pkm && card.new)
        )
        const isFavorite = favorites.includes(pkm)
        const isUnlockable =
          props.filterState.mode !== "pokedex" &&
          (availableEmotions.some(
            (e) =>
              !item.emotions.includes(e) &&
              item.dust >= getEmotionCost(e, false) &&
              props.filterState.mode !== "shiny"
          ) ||
            shinyAvailableEmotions.some(
              (e) =>
                !item.shinyEmotions.includes(e) &&
                item.dust >= getEmotionCost(e, true) &&
                !PokemonAnimations[pkm]?.shinyUnavailable
            ))

        return { pkm, item, isUnlocked, isNew, isFavorite, isUnlockable }
      }),
    [pokemonCollection, favorites, lastBoostersOpened, props.filterState.mode]
  )

  const filteredUnowns = useMemo<CollectionItem[]>(
    () =>
      unowns
        .filter(({ item, isNew, isUnlocked, isFavorite, isUnlockable }) => {
          const boosterCost = BoosterPriceByRarity[Rarity.SPECIAL]
          if (
            props.filterState.filter === "refundable" &&
            item.dust < boosterCost
          )
            return false
          if (props.filterState.filter === "new" && !isNew) return false
          if (props.filterState.filter === "unlocked" && !isUnlocked)
            return false
          if (props.filterState.filter === "unlockable" && !isUnlockable)
            return false
          if (props.filterState.filter === "locked" && isUnlocked) return false
          if (props.filterState.filter === "favorite" && !isFavorite)
            return false

          return true
        })
        .sort((a, b) => {
          if (props.filterState.sort === "index") {
            return PkmIndex[a.pkm].localeCompare(PkmIndex[b.pkm])
          } else {
            return (b.item?.dust ?? 0) - (a.item?.dust ?? 0)
          }
        }),
    [props.filterState.sort, props.filterState.filter, props.filterState.mode]
  )

  return (
    <div>
      <div id="unown-panel">
        {secretMessage.map((char, i) => renderChar(char, i, unowns))}
      </div>
      <div className="unown-collection-grid">
        {filteredUnowns.map((unown) => (
          <PokemonCollectionItem
            key={PkmIndex[unown.pkm]}
            name={unown.pkm}
            index={PkmIndex[unown.pkm]}
            item={unown.item}
            setPokemon={props.setPokemon}
            filterState={props.filterState}
            isUnlocked={unown.isUnlocked}
            isNew={unown.isNew}
            isFavorite={unown.isFavorite}
            isUnlockable={unown.isUnlockable}
          />
        ))}
      </div>
    </div>
  )
}

function renderChar(
  c: string,
  index: number,
  unowns: {
    pkm: Pkm
    isUnlocked: boolean
  }[]
) {
  let unown
  switch (c) {
    case "\n":
      return <br key={"char" + index} />
    case " ":
      return <span key={"char" + index} className="char space"></span>
    case "!":
      unown = unowns.find((u) => u.pkm === Pkm.UNOWN_EXCLAMATION)
      return (
        <span
          key={"char" + index}
          className="char"
          style={{
            backgroundImage: unown?.isUnlocked
              ? `url(assets/unown/unown-em.png)`
              : ""
          }}
        ></span>
      )

    case "?":
      unown = unowns.find((u) => u.pkm === Pkm.UNOWN_QUESTION)
      return (
        <span
          key={"char" + index}
          className="char"
          style={{
            backgroundImage: unown?.isUnlocked
              ? `url(assets/unown/unown-qm.png)`
              : ""
          }}
        ></span>
      )
    default:
      unown = unowns.find((u) => u.pkm === "UNOWN_" + c.toUpperCase())
      return (
        <span
          key={"char" + index}
          className="char"
          style={{
            backgroundImage: unown?.isUnlocked
              ? `url(assets/unown/unown-${c.toLowerCase()}.png)`
              : ""
          }}
        ></span>
      )
  }
}
