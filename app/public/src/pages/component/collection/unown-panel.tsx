import React, { Dispatch, SetStateAction, useMemo } from "react"
import { IPokemonCollectionItem } from "../../../../../models/mongo-models/user-metadata"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Pkm, PkmIndex, Unowns } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import PokemonCollectionItem from "./pokemon-collection-item"
import "./unown-panel.css"

export default function UnownPanel(props: {
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
  filter: string
  sort: string
  shinyOnly: boolean
  refundableOnly: boolean
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.network.profile?.pokemonCollection ?? new Map<string, IPokemonCollectionItem>()
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
        const config = pokemonCollection.get(PkmIndex[pkm]) ?? {
          dust: 0,
          emotions: [] as Emotion[],
          shinyEmotions: [] as Emotion[],
          selectedEmotion: Emotion.NORMAL,
          selectedShiny: false,
          id: PkmIndex[pkm]
        }
        const { emotions, shinyEmotions } = config
        const isUnlocked = emotions?.length > 0 || shinyEmotions?.length > 0
        return [{ pkm, config, isUnlocked }]
      }).sort((a, b) => {
        if (props.sort === "index") {
          return PkmIndex[a.pkm].localeCompare(PkmIndex[b.pkm])
        } else {
          return (b.config?.dust ?? 0) - (a.config?.dust ?? 0)
        }
      }),
    [props.sort, pokemonCollection]
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
              config={unown.config}
              setPokemon={props.setPokemon}
              filter={props.filter}
              shinyOnly={props.shinyOnly}
              refundableOnly={props.refundableOnly}
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
