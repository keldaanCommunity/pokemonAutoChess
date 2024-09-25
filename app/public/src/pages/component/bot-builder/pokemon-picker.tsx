import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Emotion, PkmWithConfig } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { Rarity } from "../../../../../types/enum/Game"
import { Item } from "../../../../../types/enum/Item"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"

export default function PokemonPicker(props: {
  selected: PkmWithConfig | Item
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithConfig | Item>>
}) {
  const tabs = [...Object.keys(PRECOMPUTED_POKEMONS_PER_TYPE), "none"]
  const pokemonsPerTab: IPokemonData[][] = tabs.map((t) =>
    (t === "none"
      ? [Pkm.KECLEON, Pkm.ARCEUS]
      : PRECOMPUTED_POKEMONS_PER_TYPE[t]
    ).map((p) => getPokemonData(p))
  )

  return (
    <Tabs className="my-box" id="pokemon-picker">
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
          <TabPanel key={"pokemons-tab-" + i}>
            <PokemonPickerTab
              selected={props.selected}
              selectEntity={props.selectEntity}
              pokemons={pokemons}
            />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

function PokemonPickerTab(props: {
  pokemons: IPokemonData[]
  selected: PkmWithConfig | Item
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithConfig | Item>>
}) {
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()

  function handleOnDragStart(e: React.DragEvent, name: Pkm) {
    setHoveredPokemon(undefined)
    e.dataTransfer.setData("pokemon", name)
  }

  const pokemonsPerRarity = groupBy(props.pokemons, (p) => p.rarity)
  for (const rarity in pokemonsPerRarity) {
    pokemonsPerRarity[rarity].sort((a: IPokemonData, b: IPokemonData) => {
      if (a.regional !== b.regional) return +a.regional - +b.regional
      if (a.additional !== b.additional) return +a.additional - +b.additional
      if (PkmFamily[a.name] === PkmFamily[b.name]) return a.stars - b.stars
      return PkmIndex[PkmFamily[a.name]].localeCompare(
        PkmIndex[PkmFamily[b.name]]
      )
    })
  }

  return (
    <>
      <dl id="rarity-grid">
        {(
          [
            Rarity.COMMON,
            Rarity.UNIQUE,
            Rarity.UNCOMMON,
            Rarity.LEGENDARY,
            Rarity.RARE,
            Rarity.EPIC,
            Rarity.HATCH,
            Rarity.ULTRA,
            Rarity.SPECIAL
          ] as Rarity[]
        ).map((rarity) => (
          <React.Fragment key={rarity}>
            <dt style={{ color: RarityColor[rarity], textTransform: "uppercase", fontWeight: "500", fontSize: "80%" }}>
              {t(`rarity.${rarity}`)}
            </dt>
            <dd style={{ display: "flex", flexWrap: "wrap", gap: "1px" }}>
              {(pokemonsPerRarity[rarity] ?? []).map((p) => (
                <div
                  className={cc("pokemon-portrait", {
                    additional: p.additional,
                    regional: p.regional,
                    selected: p.name === props.selected["name"]
                  })}
                  onClick={() => {
                    props.selectEntity({
                      name: p.name,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  onMouseOver={() => {
                    setHoveredPokemon(p.name)
                  }}
                  key={p.name}
                  data-tooltip-id="pokemon-detail"
                  draggable
                  onDragStart={(e) => handleOnDragStart(e, p.name)}
                >
                  <img src={getPortraitSrc(p.index)} />
                </div>
              ))}
            </dd>
          </React.Fragment>
        ))}
      </dl>
      {hoveredPokemon && <Tooltip
        id="pokemon-detail"
        className="custom-theme-tooltip game-pokemon-detail-tooltip"
        float
      >
        <GamePokemonDetail pokemon={hoveredPokemon} />
      </Tooltip>}
    </>
  )
}
