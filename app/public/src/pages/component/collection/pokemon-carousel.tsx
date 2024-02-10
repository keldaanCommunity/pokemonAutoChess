import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { useAppSelector } from "../../../hooks"
import PokemonCollectionItem from "./pokemon-collection-item"

const pokemonsSorted = (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
  return PkmFamily[a] === PkmFamily[b]
    ? getPokemonData(a).stars - getPokemonData(b).stars
    : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
})

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
      pokemonsSorted.map((pkm) => {
        const pokemonData = getPokemonData(pkm)
        const index = PkmIndex[pkm]
        if (
          pkm !== Pkm.DEFAULT &&
          pokemonData.skill !== Ability.DEFAULT &&
          pokemonData.passive !== Passive.UNOWN &&
          (props.type === "all" ||
            pokemonData.types.includes(Synergy[props.type]))
        ) {
          return (
            <PokemonCollectionItem
              key={`${index}-${props.type}`}
              name={pkm}
              index={index}
              config={getConfig(index)}
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
