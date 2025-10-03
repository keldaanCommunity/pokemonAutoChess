import React, { Dispatch, SetStateAction, useMemo } from "react"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Pkm, PkmIndex, Unowns } from "../../../../../types/enum/Pokemon"
import { IPokemonCollectionItemUnpacked } from "../../../../../types/interfaces/UserMetadata"
import { useAppSelector } from "../../../hooks"
import { CollectionFilterState } from "./pokemon-collection"
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

  const unowns = useMemo(
    () =>
      Unowns.flatMap((pkm: Pkm) => {
        const item = pokemonCollection.get(PkmIndex[pkm]) ?? {
          dust: 0,
          emotions: [] as Emotion[],
          shinyEmotions: [] as Emotion[],
          selectedEmotion: Emotion.NORMAL,
          selectedShiny: false,
          id: PkmIndex[pkm],
          played: 0
        }
        const isUnlocked =
          item.emotions?.length > 0 || item.shinyEmotions?.length > 0
        return [{ pkm, item: item, isUnlocked }]
      }).sort((a, b) => {
        if (props.filterState.sort === "index") {
          return PkmIndex[a.pkm].localeCompare(PkmIndex[b.pkm])
        } else {
          return (b.item?.dust ?? 0) - (a.item?.dust ?? 0)
        }
      }),
    [props.filterState.sort, pokemonCollection]
  )

  return (
    <div>
      <div id="unown-panel">
        {secretMessage.map((char, i) => renderChar(char, i, unowns))}
      </div>
      <div className="pokemon-collection-list">
        {unowns.map((unown) => {
          if (!unown) return null
          return (
            <PokemonCollectionItem
              key={PkmIndex[unown.pkm]}
              name={unown.pkm}
              index={PkmIndex[unown.pkm]}
              item={unown.item}
              setPokemon={props.setPokemon}
              filterState={props.filterState}
            />
          )
        })}
      </div>
    </div>
  )
}

function renderChar(
  c: string,
  index: number,
  unowns: { pkm: Pkm; isUnlocked: boolean }[]
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
