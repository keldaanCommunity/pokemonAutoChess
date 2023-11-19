import React, { useMemo } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import WikiPokemonDetail from "./wiki-pokemon-detail"
import {
  PRECOMPUTED_POKEMONS_PER_RARITY,
  PRECOMPUTED_POKEMONS_STARS
} from "../../../../../models/precomputed"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmIndex, PkmFamily } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"

export default function WikiPokemon(props: { rarity: Rarity }) {
  const pokemons = useMemo(
    () =>
      PRECOMPUTED_POKEMONS_PER_RARITY[props.rarity]
        .filter((p) => p !== Pkm.DEFAULT)
        .sort((a: Pkm, b: Pkm) => {
          return PkmFamily[a] === PkmFamily[b]
            ? PRECOMPUTED_POKEMONS_STARS[a] - PRECOMPUTED_POKEMONS_STARS[b]
            : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
        }),
    [props.rarity]
  )

  return (
    <Tabs>
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
