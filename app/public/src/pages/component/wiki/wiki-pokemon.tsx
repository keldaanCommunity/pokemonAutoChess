import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import PokemonFactory from "../../../../../models/pokemon-factory"
import WikiPokemonDetail from "./wiki-pokemon-detail"
import { PrecomputedRaritPokemonyAll } from "../../../../../types"
import PRECOMPUTED_RARITY_POKEMONS_ALL from "../../../../../models/precomputed/type-rarity-all.json"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmIndex, PkmFamily } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"

const precomputed =
  PRECOMPUTED_RARITY_POKEMONS_ALL as PrecomputedRaritPokemonyAll

export default function WikiPokemon(props: { rarity: Rarity }) {
  const pokemons = precomputed[props.rarity].filter((p) => p !== Pkm.DEFAULT)
  pokemons.sort((a: Pkm, b: Pkm) => {
    const pa = PokemonFactory.createPokemonFromName(a)
    const pb = PokemonFactory.createPokemonFromName(b)
    return PkmFamily[a] === PkmFamily[b]
      ? pa.stars - pb.stars
      : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
  })

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
