import PokemonCollectionItem from "./pokemon-collection-item"
import React, { Dispatch, SetStateAction } from "react"
import { Pkm, PkmIndex, Unowns } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { Emotion } from "../../../../../types/enum/Emotion"
import "./unown-panel.css"

export default function UnownPanel(props: {
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
  filter: string
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )
  const secretMessage = `    
    To unleash ancient power ?
    Max Groudon with a red Orb
    Delta Sphere over Rayquaza
    And blue Jewel for Kyogre!
    `
    .replace(/^\s+/gm, "")
    .replace(/\s+$/gm, "")
    .split("")

  const unowns = Unowns.flatMap((pkm: Pkm) => {
    const config = pokemonCollection.find((p) => p.id === PkmIndex[pkm])
    const { emotions, shinyEmotions } = config ?? {
      dust: 0,
      emotions: [] as Emotion[],
      shinyEmotions: [] as Emotion[]
    }
    const isUnlocked = emotions?.length > 0 || shinyEmotions?.length > 0
    return [{ pkm, config, isUnlocked }]
  })

  return (
    <div>
      <div id="unown-panel">
        {secretMessage.map((char, i) => renderChar(char, i, unowns))}
      </div>
      <div className="pokemon-carousel">
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
              shinyOnly={false}
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
