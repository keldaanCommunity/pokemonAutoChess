import PokemonCollectionItem from "./pokemon-collection-item"
import PokemonFactory from "../../../../../models/pokemon-factory"
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react"
import { useAppSelector } from "../../../hooks"
import { ITracker } from "../../../../../types/ITracker"
import { Ability } from "../../../../../types/enum/Ability"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Passive } from "../../../../../types/enum/Passive"

export default function PokemonCarousel(props: {
  type: Synergy | "all"
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
  metadata: { [key: string]: ITracker }
  filter: string
  shinyOnly: boolean
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )

  const getConfig = useCallback(
    (index) => pokemonCollection.find((p) => p.id == index),
    [pokemonCollection]
  )

  const elligiblePokemons: (React.JSX.Element | null)[] = useMemo(
    () =>
      (Object.values(Pkm) as Pkm[]).map((v) => {
        const pkm = PokemonFactory.createPokemonFromName(v)
        if (
          v !== Pkm.DEFAULT &&
          pkm.skill !== Ability.DEFAULT &&
          pkm.passive !== Passive.UNOWN &&
          (props.type === "all" || pkm.types.includes(Synergy[props.type]))
        ) {
          const pathIndex = pkm.index.split("-")
          let m: ITracker | undefined = undefined
          if (pathIndex.length == 1) {
            m = props.metadata[pkm.index]
          } else if (pathIndex.length == 2) {
            m = props.metadata[pathIndex[0]].subgroups[pathIndex[1]]
          }
          if (m) {
            return (
              <PokemonCollectionItem
                key={`${pkm.index}-${props.type}`}
                name={pkm.name}
                index={pkm.index}
                metadata={m}
                config={getConfig(pkm.index)}
                filter={props.filter}
                shinyOnly={props.shinyOnly}
                setPokemon={props.setPokemon}
              />
            )
          } else {
            return null
          }
        }

        return null
      }),
    [
      getConfig,
      props.filter,
      props.metadata,
      props.setPokemon,
      props.shinyOnly,
      props.type
    ]
  )

  return <div className="pokemon-carousel">{elligiblePokemons}</div>
}
