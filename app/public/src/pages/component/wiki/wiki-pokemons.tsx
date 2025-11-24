import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Tooltip } from "react-tooltip"
import { RarityColor } from "../../../../../config"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { Ability } from "../../../../../types/enum/Ability"
import { Rarity } from "../../../../../types/enum/Game"
import {
  NonPkm,
  Pkm,
  PkmFamily,
  PkmIndex
} from "../../../../../types/enum/Pokemon"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import { Checkbox } from "../checkbox/checkbox"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import PokemonPortrait from "../pokemon-portrait"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import WikiPokemonDetail from "./wiki-pokemon-detail"

export default function WikiPokemons() {
  const { t } = useTranslation()
  const tabs = Object.values(Rarity) as Rarity[]
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")
  const [tabIndex, setTabIndex] = useState(0)
  const [showEvolutions, setShowEvolutions] = useState(true)
  const [pool, setPool] = useState<string>("all")

  useEffect(() => {
    if (selectedPkm) {
      setTabIndex(tabs.indexOf(getPokemonData(selectedPkm).rarity))
    }
  }, [selectedPkm, tabs])

  return (
    <Tabs
      className="wiki-pokemons"
      selectedIndex={tabIndex}
      onSelect={(index) => {
        setSelectedPkm("")
        setTabIndex(index)
      }}
    >
      <div className="filters">
        <Checkbox
          checked={showEvolutions}
          onToggle={setShowEvolutions}
          label={t("show_evolutions")}
          isDark
        />
        <select value={pool} onChange={(e) => setPool(e.target.value)}>
          <option value={"all"}>
            {t("pool_label")}: {t("all")}
          </option>
          {["regular", "additional", "regional"].map((p) => (
            <option value={p} key={p}>
              {t(`pool.${p}`)}
            </option>
          ))}
          <option value={"special"} key={"special"}>
            {t(`rarity.SPECIAL`)}
          </option>
        </select>
        <PokemonTypeahead
          value={selectedPkm}
          onChange={(pkm) => setSelectedPkm(pkm)}
        />
      </div>
      <TabList>
        {tabs.map((r) => {
          return (
            <Tab key={"title-" + r} style={{ color: RarityColor[Rarity[r]] }}>
              {t("rarity." + r).toUpperCase()}
            </Tab>
          )
        })}
        <Tab key="title-all">{t("all")}</Tab>
      </TabList>

      {(Object.values(Rarity) as Rarity[]).map((r) => {
        return (
          <TabPanel key={r}>
            <WikiPokemon
              rarity={r}
              selected={selectedPkm}
              onSelect={setSelectedPkm}
              showEvolutions={showEvolutions}
              pool={pool}
            />
          </TabPanel>
        )
      })}
      <TabPanel key="all">
        <WikiAllPokemons />
      </TabPanel>
    </Tabs>
  )
}

export function WikiPokemon(props: {
  rarity: Rarity
  selected: Pkm | ""
  showEvolutions: boolean
  pool: string
  onSelect: (pkm: Pkm) => void
}) {
  const pokemons = useMemo(
    () =>
      PRECOMPUTED_POKEMONS_PER_RARITY[props.rarity]
        .filter((p) => {
          if (NonPkm.includes(p)) return false
          const { additional, regional } = getPokemonData(p)
          const special = props.rarity === Rarity.SPECIAL
          if (props.pool === "additional" && !additional) return false
          if (props.pool === "regional" && !regional) return false
          if (props.pool === "special" && !special) return false
          if (props.pool === "regular" && (additional || regional || special))
            return false

          if (
            !props.showEvolutions &&
            PkmFamily[p] !== p &&
            getPokemonData(PkmFamily[p]).stars !== getPokemonData(p).stars
          )
            return false
          return true
        })
        .sort((a: Pkm, b: Pkm) => {
          return PkmFamily[a] === PkmFamily[b]
            ? getPokemonData(a).stars - getPokemonData(b).stars
            : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
        }),
    [props.rarity, props.pool, props.showEvolutions]
  ) as Pkm[]

  return (
    <Tabs
      selectedIndex={props.selected ? pokemons.indexOf(props.selected) : -1}
      onSelect={(index) => props.onSelect(pokemons[index])}
    >
      <TabList>
        {pokemons.map((pkm) => {
          return (
            <Tab key={"title-" + pkm} className="react-tabs__tab icon-tab">
              <PokemonPortrait portrait={PkmIndex[pkm]} />
            </Tab>
          )
        })}
      </TabList>

      {pokemons.map((pkm) => {
        return (
          <TabPanel key={pkm}>
            <WikiPokemonDetail pokemon={pkm} selectPkm={props.onSelect} />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

export function WikiAllPokemons() {
  const pokemons = Object.values(Pkm)
    .filter((p) => p !== Pkm.DEFAULT)
    .map((p) => getPokemonData(p))
    .sort((a, b) => a.stars - b.stars) // put first stage first
    .filter((a, index, list) => {
      if (a.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      return true
    })

  const pokemonsPerRarity = groupBy(pokemons, (p) => p.rarity)
  for (const rarity in pokemonsPerRarity) {
    pokemonsPerRarity[rarity].sort((a: IPokemonData, b: IPokemonData) => {
      if (a.regional !== b.regional) return +a.regional - +b.regional
      if (a.additional !== b.additional) return +a.additional - +b.additional
      return PkmFamily[a.name] === PkmFamily[b.name]
        ? a.stars - b.stars
        : PkmIndex[PkmFamily[a.name]].localeCompare(PkmIndex[PkmFamily[b.name]])
    })
  }

  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()

  return (
    <>
      <div id="wiki-pokemons-all">
        {(Object.values(Rarity) as Rarity[]).map((rarity) => {
          return (
            <section key={rarity} style={{ color: RarityColor[rarity] }}>
              <h2>{t(`rarity.${rarity}`)}</h2>
              <ul>
                {(pokemonsPerRarity[rarity] ?? []).map((p) => {
                  return (
                    <li
                      key={p.name}
                      className={cc("pokemon-portrait", {
                        additional: p.additional,
                        regional: p.regional
                      })}
                      onMouseOver={() => {
                        setHoveredPokemon(p.name)
                      }}
                      data-tooltip-id="pokemon-detail"
                    >
                      <img src={getPortraitSrc(p.index)} />
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
      {hoveredPokemon && (
        <Tooltip
          id="pokemon-detail"
          className="custom-theme-tooltip game-pokemon-detail-tooltip"
          float
        >
          <GamePokemonDetail pokemon={hoveredPokemon} origin="wiki" />
        </Tooltip>
      )}
    </>
  )
}
