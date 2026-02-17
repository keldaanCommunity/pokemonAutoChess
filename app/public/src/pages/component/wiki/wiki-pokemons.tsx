import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { RarityColor } from "../../../../../config"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { usePreferences } from "../../../preferences"
import { cc } from "../../utils/jsx"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import {
  filterPokemonsAccordingToPreferences,
  PokemonFilters
} from "../pokemon-filters/pokemon-filters"
import PokemonPortrait from "../pokemon-portrait"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import WikiPokemonDetail from "./wiki-pokemon-detail"

export default function WikiPokemons() {
  const { t } = useTranslation()
  const tabs = Object.values(Rarity) as Rarity[]
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")
  const [tabIndex, setTabIndex] = useState(0)

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
        <PokemonFilters />
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
  onSelect: (pkm: Pkm) => void
}) {
  const [preferences] = usePreferences()
  const pokemons = useMemo(
    () =>
      filterPokemonsAccordingToPreferences(
        PRECOMPUTED_POKEMONS_PER_RARITY[props.rarity],
        preferences
      ).sort((a: Pkm, b: Pkm) => {
        return PkmFamily[a] === PkmFamily[b]
          ? getPokemonData(a).stars - getPokemonData(b).stars
          : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
      }),
    [
      props.rarity,
      preferences.showAdditionalPool,
      preferences.showRegionalPool,
      preferences.showSpecialPool,
      preferences.showRegularPool,
      preferences.showEvolutions,
      preferences.showAltForms
    ]
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
  const [preferences] = usePreferences()
  const pokemons = filterPokemonsAccordingToPreferences(
    Object.values(Pkm),
    preferences
  )
    .map((p) => getPokemonData(p))
    .sort((a, b) => a.stars - b.stars) // put first stage first

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
                      data-tooltip-id="game-pokemon-detail-tooltip"
                      data-tooltip-content={p.name}
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
      <GamePokemonDetailTooltip origin="wiki" />
    </>
  )
}
