import React, { useEffect, useMemo, useState, Dispatch, SetStateAction, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { localStore, LocalStoreKeys } from "../../utils/store"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { AnimationConfig, Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import PokemonCollectionItem from "./pokemon-collection-item"
import { precomputedPokemons } from "../../../../../../gen/precomputed-pokemons"
import "./pokemon-collection.css"

export default function PokemonCollection() {
  const { t } = useTranslation()
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | "">("")

  const prevFilterState = useMemo(() => {
    const prevState = localStore.get(LocalStoreKeys.COLLECTION_FILTER)
    return {
      filter: prevState?.filter ?? "unlockable",
      sort: prevState?.sort ?? "index"
    }
  }, [])

  const [filter, setFilter] = useState<string>(prevFilterState.filter)
  const [sort, setSort] = useState<string>(prevFilterState.sort)

  const [count, setCount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const pokemonCollection = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )

  const updateCount = useCallback(function updateCount() {
    switch (filter) {
      case "pokedex":
        setCount(pokemonCollection ? [...pokemonCollection.values()].filter(item => item.played > 0).length : 0)
        setTotal(precomputedPokemons.length)
        break
      case "shiny":
        setCount(pokemonCollection ? [...pokemonCollection.values()].filter(item => item.shinyEmotions.length > 0).length : 0)
        setTotal(precomputedPokemons.filter(p => !AnimationConfig[p.name]?.shinyUnavailable).length)
        break
      default:
        setCount(pokemonCollection ? [...pokemonCollection.values()].filter(item => item.emotions.length > 0 || item.shinyEmotions.length > 0).length : 0)
        setTotal(precomputedPokemons.length)
        break
    }
  }, [filter, pokemonCollection])

  useEffect(() => {
    localStore.set(LocalStoreKeys.COLLECTION_FILTER, {
      filter,
      sort
    })
    updateCount()
  }, [filter, sort])

  return (
    <div id="pokemon-collection">
      <header>
        <p>{filter === "shiny" ? t("shiny_hunter") : filter === "pokedex" ? t("pokedex") : t("unlocked")}: {count} / {total}</p>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value={"all"}>{t("show_all")}</option>
          <option value={"unlockable"}>{t("show_unlockable")}</option>
          <option value={"shiny"}>{t("shiny_hunter")}</option>
          <option value={"pokedex"}>{t("pokedex")}</option>
          <option value={"locked"}>{t("show_locked")}</option>
          <option value={"unlocked"}>{t("show_unlocked")}</option>
          <option value={"refundable"}>{t("show_refundable")}</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value={"index"}>{t("sort_by_index")}</option>
          <option value={"shards"}>{t("sort_by_shards")}</option>
          <option value={"played"}>{t("sort_by_played")}</option>
        </select>

        <PokemonTypeahead
          value={selectedPokemon}
          onChange={setSelectedPokemon}
        />
      </header>
      <div style={{ maxWidth: "100%" }}>
        <Tabs>
          <TabList className="pokemon-collection-tabs">
            <Tab key="title-all">{t("all")}</Tab>
            {(Object.keys(Synergy) as Synergy[]).map((type) => {
              return (
                <Tab key={"title-" + type}>
                  <SynergyIcon type={type} />
                </Tab>
              )
            })}
            <Tab key="?">
              <img
                src="assets/ui/unown.svg"
                alt="?"
                className="unown-icon"
              />
            </Tab>
          </TabList>

          {(["all"].concat(Object.keys(Synergy)) as (Synergy | "all")[]).map(
            (type) => {
              return (
                <TabPanel key={type}>
                  <PokemonCollectionList
                    type={type}
                    setPokemon={setSelectedPokemon}
                    filter={filter}
                    sort={sort}
                  />
                </TabPanel>
              )
            }
          )}
          <TabPanel>
            <UnownPanel
              setPokemon={setSelectedPokemon}
              filter={filter}
              sort={sort}
            />
          </TabPanel>
        </Tabs>
      </div>
      {selectedPokemon && (
        <PokemonEmotionsModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon("")}
        />
      )}
    </div>
  )
}

export function PokemonCollectionList(props: {
  type: Synergy | "all"
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
  filter: string
  sort: string
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )

  const getConfig = useCallback(
    (index) => pokemonCollection?.get(index),
    [pokemonCollection]
  )

  const pokemonsSorted = useMemo(() => {
    if (props.sort === "index") {
      return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
        return PkmFamily[a] === PkmFamily[b]
          ? getPokemonData(a).stars - getPokemonData(b).stars
          : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
      })
    } else if (props.sort === "played") {
      return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
        return (
          (getConfig(PkmIndex[b])?.played ?? 0) -
          (getConfig(PkmIndex[a])?.played ?? 0)
        )
      })
    } else {
      return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
        return (
          (getConfig(PkmIndex[b])?.dust ?? 0) -
          (getConfig(PkmIndex[a])?.dust ?? 0)
        )
      })
    }
  }, [props.sort, getConfig])

  const pokemonsFiltered = useMemo(() => {
    return pokemonsSorted.filter((pkm) => {
      const pokemonData = getPokemonData(pkm)
      return (
        pkm !== Pkm.DEFAULT &&
        (pokemonData.skill !== Ability.DEFAULT ||
          pokemonData.passive !== Passive.NONE) &&
        pokemonData.passive !== Passive.UNOWN &&
        (props.type === "all" ||
          pokemonData.types.includes(Synergy[props.type]))
      )
    })
  }, [pokemonsSorted, props.type])

  const elligiblePokemons: (React.JSX.Element | null)[] = useMemo(() =>
    pokemonsFiltered.map((pkm) => {
      const pokemonData = getPokemonData(pkm)
      return (
        <PokemonCollectionItem
          key={`${pokemonData.index}-${props.type}`}
          name={pkm}
          index={pokemonData.index}
          config={getConfig(pokemonData.index)}
          filter={props.filter}
          setPokemon={props.setPokemon}
        />
      )
    }),
    [
      getConfig,
      pokemonsFiltered,
      props.filter,
      props.setPokemon,
      props.type
    ]
  )

  return <div className="pokemon-collection-list">{elligiblePokemons}</div>
}
