import React, { useEffect, useMemo, useState, Dispatch, SetStateAction, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { localStore, LocalStoreKeys } from "../../utils/store"
import { Synergy } from "../../../../../types/enum/Synergy"
import { Checkbox } from "../checkbox/checkbox"
import SynergyIcon from "../icons/synergy-icon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import PokemonCollectionItem from "./pokemon-collection-item"
import "./pokemon-collection.css"

export default function PokemonCollection() {
  const { t } = useTranslation()
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | "">("")

  const prevFilterState = useMemo(() => {
    const prevState = localStore.get(LocalStoreKeys.COLLECTION_FILTER)
    return {
      filter: prevState?.filter ?? "unlockable",
      sort: prevState?.sort ?? "index",
      shinyOnly: prevState?.shinyOnly ?? false,
      refundableOnly: prevState?.refundableOnly ?? false
    }
  }, [])

  const [filter, setFilter] = useState<string>(prevFilterState.filter)
  const [sort, setSort] = useState<string>(prevFilterState.sort)
  const [shinyOnly, setShinyOnly] = useState<boolean>(prevFilterState.shinyOnly)
  const [refundableOnly, setRefundableOnly] = useState<boolean>(prevFilterState.refundableOnly)

  useEffect(() => {
    localStore.set(LocalStoreKeys.COLLECTION_FILTER, {
      filter,
      sort,
      shinyOnly,
      refundableOnly
    })
  }, [filter, sort, shinyOnly, refundableOnly])

  return (
    <div id="pokemon-collection">
      <header>
        <PokemonTypeahead
          value={selectedPokemon}
          onChange={setSelectedPokemon}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value={"all"}>{t("show_all")}</option>
          <option value={"locked"}>{t("show_locked")}</option>
          <option value={"unlockable"}>{t("show_unlockable")}</option>
          <option value={"unlocked"}>{t("show_unlocked")}</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value={"index"}>{t("sort_by_index")}</option>
          <option value={"shards"}>{t("sort_by_shards")}</option>
        </select>

        <Checkbox
          checked={shinyOnly}
          onToggle={setShinyOnly}
          label={t("shiny_hunter")}
          isDark
        />
        <Checkbox
          checked={refundableOnly}
          onToggle={setRefundableOnly}
          label={t("refundable")}
          isDark
        />
      </header>
      <div>
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
                src="assets/unown/unown-qm.png"
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
                    shinyOnly={shinyOnly}
                    refundableOnly={refundableOnly}
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
              shinyOnly={shinyOnly}
              refundableOnly={refundableOnly}
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
  shinyOnly: boolean
  refundableOnly: boolean
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
    } else {
      return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
        return (
          (getConfig(PkmIndex[b])?.dust ?? 0) -
          (getConfig(PkmIndex[a])?.dust ?? 0)
        )
      })
    }
  }, [props.sort, getConfig])

  const elligiblePokemons: (React.JSX.Element | null)[] = useMemo(
    () =>
      pokemonsSorted.map((pkm) => {
        const pokemonData = getPokemonData(pkm)
        if (
          pkm !== Pkm.DEFAULT &&
          (pokemonData.skill !== Ability.DEFAULT ||
            pokemonData.passive !== Passive.NONE) &&
          pokemonData.passive !== Passive.UNOWN &&
          (props.type === "all" ||
            pokemonData.types.includes(Synergy[props.type]))
        ) {
          return (
            <PokemonCollectionItem
              key={`${pokemonData.index}-${props.type}`}
              name={pkm}
              index={pokemonData.index}
              config={getConfig(pokemonData.index)}
              filter={props.filter}
              shinyOnly={props.shinyOnly}
              refundableOnly={props.refundableOnly}
              setPokemon={props.setPokemon}
            />
          )
        }

        return null
      }),
    [
      getConfig,
      pokemonsSorted,
      props.filter,
      props.setPokemon,
      props.shinyOnly,
      props.refundableOnly,
      props.type
    ]
  )

  return <div className="pokemon-collection-list">{elligiblePokemons}</div>
}
