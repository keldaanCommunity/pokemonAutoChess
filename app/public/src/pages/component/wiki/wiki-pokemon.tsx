import React, { useMemo } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import {
  PRECOMPUTED_POKEMONS_PER_RARITY,
  getPokemonData
} from "../../../../../models/precomputed"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import WikiPokemonDetail from "./wiki-pokemon-detail"

export default function WikiPokemon(props: {
  rarity: Rarity
  selected: Pkm
  onSelect: (pkm: Pkm) => any
}) {
  const pokemons = useMemo(
    () =>
      PRECOMPUTED_POKEMONS_PER_RARITY[props.rarity]
        .filter((p) => p !== Pkm.DEFAULT)
        .sort((a: Pkm, b: Pkm) => {
          return PkmFamily[a] === PkmFamily[b]
            ? getPokemonData(a).stars - getPokemonData(b).stars
            : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
        }),
    [props.rarity]
  )

  return (
    <Tabs
      selectedIndex={pokemons.indexOf(props.selected)}
      onSelect={(index) => props.onSelect(pokemons[index])}
    >
      <TabList>
        {pokemons.map((pkm) => {
          return (
            <Tab key={"title-" + pkm}>
              <img
                className="pokemon-portrait"
                src={getPortraitSrc(PkmIndex[pkm])}
              ></img>
            </Tab>
          )
        })}
      </TabList>

      {pokemons.map((pkm) => {
        return (
          <TabPanel key={pkm}>
            <WikiPokemonDetail pokemon={pkm} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
