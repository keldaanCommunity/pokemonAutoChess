import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import PokemonFactory from "../../../../../models/pokemon-factory"
import WikiPokemonDetail from "./wiki-pokemon-detail"
import { PrecomputedRaritPokemonyAll } from "../../../../../types"
import { ITracker } from "../../../../../types/ITracker"
import PRECOMPUTED_RARITY_POKEMONS_ALL from "../../../../../models/precomputed/type-rarity-all.json"
import tracker from "../../../../dist/client/assets/pokemons/tracker.json"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmIndex, PkmFamily } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import { Mythical1Shop, Mythical2Shop } from "../../../../../types/Config"

const metadata = tracker as unknown as { [key: string]: ITracker }
const precomputed =
  PRECOMPUTED_RARITY_POKEMONS_ALL as PrecomputedRaritPokemonyAll

interface Section {
  label?: string;
  pokemons: Pkm[]
}

export default function WikiPokemon(props: { rarity: Rarity }) {
  let sections:Section[] = [ { pokemons: precomputed[props.rarity] } ]
  if(props.rarity === Rarity.MYTHICAL){
    sections = [
      {
        label: "Stage 10",
        pokemons: precomputed[props.rarity].filter(p => Mythical1Shop.includes(p) || Mythical1Shop.includes(PkmFamily[p]))
      },
      {
        label: "Stage 20",
        pokemons: precomputed[props.rarity].filter(p => Mythical2Shop.includes(p) || Mythical2Shop.includes(PkmFamily[p]))
      },
    ]
  }

  sections.forEach(section => section.pokemons.sort((a: Pkm, b: Pkm) => {
    const pa = PokemonFactory.createPokemonFromName(a)
    const pb = PokemonFactory.createPokemonFromName(b)
    return PkmFamily[a] === PkmFamily[b] ? pa.stars - pb.stars : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
  }))
  
  return (
    <Tabs>
      <TabList>
      {sections.map((section,i) => <React.Fragment key={"section"+i}>
        {section.label && <p className='section-label'>{section.label}</p>}
        {section.pokemons.map((pkm) => {
          return (
            <Tab key={"title-" + pkm}>
              <img className="pokemon-portrait" src={getPortraitSrc(PkmIndex[pkm])}></img>
            </Tab>
          )
        })}
      </React.Fragment>)}
      </TabList>

      {sections.map(section => section.pokemons.map(pkm => {
        let m: ITracker | undefined = undefined
        const pokemon = PokemonFactory.createPokemonFromName(pkm)
        const pathIndex = pokemon.index.split("-")
        if (pathIndex.length == 1) {
          m = metadata[pokemon.index]
        } else if (pathIndex.length == 2) {
          m = metadata[pathIndex[0]].subgroups[pathIndex[1]]
        }
        return (
          <TabPanel key={pkm}>
            <WikiPokemonDetail pokemon={pkm} m={m} />
          </TabPanel>
        )
      }))}
    </Tabs>
  )
}
