import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import PRECOMPUTED_TYPE_POKEMONS_ALL from "../../../../../models/precomputed/type-pokemons-all.json"
import { Item } from "../../../../../types/enum/Item"
import { getPortraitSrc } from "../../../utils"
import { PkmWithConfig, Emotion } from "../../../../../types"
import SynergyIcon from "../icons/synergy-icon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import ReactTooltip from "react-tooltip"
import PokemonFactory from "../../../../../models/pokemon-factory"

export default function PokemonPicker(props: {
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithConfig | Item>>
}) {
  const tabs = [...Object.keys(PRECOMPUTED_TYPE_POKEMONS_ALL), "none"]
  const pokemonsPerTab = tabs.map((t) =>
    t === "none"
      ? [Pkm.KECLEON, Pkm.ARCEUS]
      : PRECOMPUTED_TYPE_POKEMONS_ALL[t].filter((p) => p !== Pkm.DEFAULT)
  )
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()

  function handleOnDragStart(e: React.DragEvent, name: Pkm) {
    e.dataTransfer.setData("pokemon", name)
  }

  return (
    <Tabs className="nes-container" id="pokemon-picker">
      <TabList>
        {tabs.map((t) => {
          return (
            <Tab key={t}>
              {t === "none" ? "?" : <SynergyIcon type={t as Synergy} />}
            </Tab>
          )
        })}
      </TabList>

      {pokemonsPerTab.map((pokemons, i) => {
        return (
          <TabPanel
            key={"pokemons-tab-" + i}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {pokemons.map((pkm) => {
              return (
                <div
                  className="pokemon"
                  onClick={() => {
                    props.selectEntity({
                      name: pkm,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  onMouseOver={() => {
                    setHoveredPokemon(pkm)
                  }}
                  key={pkm}
                  data-tip
                  data-for="pokemon-detail"
                  draggable
                  onDragStart={(e) => handleOnDragStart(e, pkm)}
                >
                  <img src={getPortraitSrc(PkmIndex[pkm])} />
                </div>
              )
            })}
            {hoveredPokemon && (
              <ReactTooltip
                id="pokemon-detail"
                className="customeTheme game-pokemon-detail-tooltip"
                effect="float"
                place="top"
                offset={{ top: 20 }}
              >
                <GamePokemonDetail
                  pokemon={PokemonFactory.createPokemonFromName(hoveredPokemon)}
                />
              </ReactTooltip>
            )}
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
