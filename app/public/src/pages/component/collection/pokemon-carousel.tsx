import PokemonCollectionItem from "./pokemon-collection-item"
import PokemonFactory from "../../../../../models/pokemon-factory"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useAppSelector } from "../../../hooks"
import { ITracker } from "../../../../../types/ITracker"
import { Ability } from "../../../../../types/enum/Ability"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"

export default function PokemonCarousel(props: {
  type: Synergy | "all"
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
  metadata: { [key: string]: ITracker },
  filter: string,
  shinyOnly: boolean
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )
  const [elligiblePokemons, setElligiblePokemons] = useState<Pokemon[]>([])

  useEffect(() => {
    const filteredCollection: Pokemon[] = []
    ;(Object.values(Pkm) as Pkm[]).forEach((v) => {
      const pkm = PokemonFactory.createPokemonFromName(v)
      if (
        pkm.skill !== Ability.DEFAULT &&
        (props.type === "all" || pkm.types.includes(Synergy[props.type]))
      ) {
        filteredCollection.push(pkm)
      }
    })
    setElligiblePokemons(filteredCollection)
  }, [props.filter]);

  return (
    <div className="pokemon-carousel">
      {elligiblePokemons.map((pkm) => {
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
              config={pokemonCollection.find((p) => p.id == pkm.index)}
              filter={props.filter}
              shinyOnly={props.shinyOnly}
              setPokemon={props.setPokemon}
            />
          )
        } else {
          return null
        }
      })}
    </div>
  )
}
