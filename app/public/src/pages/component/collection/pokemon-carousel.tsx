import PokemonCollectionItem from "./pokemon-collection-item"
import PokemonFactory from "../../../../../models/pokemon-factory"
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react"
import { useAppSelector } from "../../../hooks"
import { Ability } from "../../../../../types/enum/Ability"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Passive } from "../../../../../types/enum/Passive"

export default function PokemonCarousel(props: {
  type: Synergy | "all"
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
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
          (props.type === "all" || pkm.types.has(Synergy[props.type]))
        ) {
          return (
            <PokemonCollectionItem
              key={`${pkm.index}-${props.type}`}
              name={pkm.name}
              index={pkm.index}
              config={getConfig(pkm.index)}
              filter={props.filter}
              shinyOnly={props.shinyOnly}
              setPokemon={props.setPokemon}
            />
          )
        }

        return null
      }),
    [getConfig, props.filter, props.setPokemon, props.shinyOnly, props.type]
  )

  return <div className="pokemon-carousel">{elligiblePokemons}</div>
}
