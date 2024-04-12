import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react"
import { getPokemonData } from "../../../../../models/precomputed"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { useAppSelector } from "../../../hooks"
import PokemonCollectionItem from "./pokemon-collection-item"

export default function PokemonCarousel(props: {
  type: Synergy | "all"
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
  filter: string
  sort: string
  shinyOnly: boolean
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )

  const getConfig = useCallback(
    (index) => pokemonCollection.find((p) => p.id == index),
    [pokemonCollection]
  )

  const pokemonsSorted = useMemo(() => {
    if (props.sort === "index") {
      return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
        return PkmFamily[a] === PkmFamily[b]
          ? getPokemonData(a).stars - getPokemonData(b).stars
          : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
      })
    } else {
      return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
        return (
          (getConfig(PkmIndex[b])?.dust ?? 0) -
          (getConfig(PkmIndex[a])?.dust ?? 0)
        )
      })
    }
  }, [props.sort])

  const elligiblePokemons: (React.JSX.Element | null)[] = useMemo(
    () =>
      pokemonsSorted.map((pkm) => {
        const pokemonData = getPokemonData(pkm)
        if (
          pkm !== Pkm.DEFAULT &&
          (pokemonData.skill !== Ability.DEFAULT ||
            pokemonData.passive !== Passive.NONE) &&
          pokemonData.passive !== Passive.UNOWN &&
          (props.type === "all" ||
            pokemonData.types.includes(Synergy[props.type]))
        ) {
          return (
            <PokemonCollectionItem
              key={`${pokemonData.index}-${props.type}`}
              name={pkm}
              index={pokemonData.index}
              config={getConfig(pokemonData.index)}
              filter={props.filter}
              shinyOnly={props.shinyOnly}
              setPokemon={props.setPokemon}
            />
          )
        }

        return null
      }),
    [
      getConfig,
      props.filter,
      props.sort,
      props.setPokemon,
      props.shinyOnly,
      props.type
    ]
  )

  return <div className="pokemon-carousel">{elligiblePokemons}</div>
}
