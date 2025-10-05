import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { precomputedPokemonsImplemented } from "../../../../../../gen/precomputed-pokemons"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { PokemonAnimations } from "../../../game/components/pokemon-animations"
import { useAppSelector } from "../../../hooks"
import { LocalStoreKeys, localStore } from "../../utils/store"
import SynergyIcon from "../icons/synergy-icon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonCollectionItem from "./pokemon-collection-item"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"
import "./pokemon-collection.css"

export type CollectionFilterState = {
  mode: "collection" | "shiny" | "pokedex"
  filter: "all" | "unlockable" | "locked" | "unlocked" | "refundable" | "new"
  sort: "index" | "shards" | "played" | "unlocked"
}

export default function PokemonCollection() {
  const { t } = useTranslation()
  const [selectedPokemon, setSelectedPokemon] = useState<Pkm | "">("")

  const prevFilterState = useMemo(() => {
    const prevState = localStore.get(LocalStoreKeys.COLLECTION_FILTER)
    return {
      mode: prevState?.mode ?? "collection",
      filter: prevState?.filter ?? "unlockable",
      sort: prevState?.sort ?? "index"
    }
  }, [])

  const [filterState, setFilterState] =
    useState<CollectionFilterState>(prevFilterState)

  const [count, setCount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const pokemonCollection = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )
  const collection = useMemo(() => {
    return pokemonCollection ? [...pokemonCollection.values()] : []
  }, [pokemonCollection])

  const updateCount = useCallback(
    function updateCount() {
      switch (filterState.mode) {
        case "pokedex":
          setCount(collection.filter((item) => item.played > 0).length)
          setTotal(precomputedPokemonsImplemented.length)
          break
        case "shiny":
          setCount(
            collection.filter((item) => item.shinyEmotions.length > 0).length
          )
          setTotal(
            precomputedPokemonsImplemented.filter(
              (p) => !PokemonAnimations[p.name]?.shinyUnavailable
            ).length
          )
          break
        default:
          setCount(
            collection.filter(
              (item) =>
                item.emotions.length > 0 || item.shinyEmotions.length > 0
            ).length
          )
          setTotal(precomputedPokemonsImplemented.length)
          break
      }
    },
    [filterState.mode]
  )

  useEffect(() => {
    localStore.set(LocalStoreKeys.COLLECTION_FILTER, filterState)
    updateCount()
  }, [filterState])

  useEffect(() => {
    if (
      filterState.mode === "pokedex" &&
      ["unlockable", "refundable", "new"].includes(filterState.filter)
    ) {
      setFilterState({
        ...filterState,
        filter: "all"
      })
    }
  }, [filterState.mode, filterState.filter])

  return (
    <div id="pokemon-collection">
      <header>
        <select
          value={filterState.mode}
          onChange={(e) =>
            setFilterState({
              ...filterState,
              mode: e.target.value as "collection" | "shiny" | "pokedex"
            })
          }
        >
          <option value={"collection"}>{t("collection")}</option>
          <option value={"shiny"}>{t("shiny_hunter")}</option>
          <option value={"pokedex"}>{t("pokedex")}</option>
        </select>

        <p>
          {filterState.mode === "shiny"
            ? t("shiny_hunter")
            : filterState.mode === "pokedex"
              ? t("pokedex")
              : t("unlocked")}
          : {count} / {total}
        </p>

        <select
          value={filterState.filter}
          onChange={(e) =>
            setFilterState({
              ...filterState,
              filter: e.target.value as
                | "all"
                | "unlockable"
                | "locked"
                | "unlocked"
                | "refundable"
                | "new"
            })
          }
        >
          <option value={"all"}>{t("show_all")}</option>
          {filterState.mode !== "pokedex" && (
            <option value={"unlockable"}>{t("show_unlockable")}</option>
          )}
          <option value={"locked"}>{t("show_locked")}</option>
          <option value={"unlocked"}>{t("show_unlocked")}</option>
          {filterState.mode !== "pokedex" && <>
            <option value={"refundable"}>{t("show_refundable")}</option>
            <option value={"new"}>{t("show_newly_obtained")}</option>
          </>}

        </select>

        <select
          value={filterState.sort}
          onChange={(e) =>
            setFilterState({
              ...filterState,
              sort: e.target.value as "index" | "shards" | "played" | "unlocked"
            })
          }
        >
          <option value={"index"}>{t("sort_by_index")}</option>
          <option value={"shards"}>{t("sort_by_shards")}</option>
          <option value={"unlocked"}>{t("sort_by_emotes_unlocked")}</option>
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
              <img src="assets/ui/unown.svg" alt="?" className="unown-icon" />
            </Tab>
          </TabList>

          {(["all"].concat(Object.keys(Synergy)) as (Synergy | "all")[]).map(
            (type) => {
              return (
                <TabPanel key={type}>
                  <PokemonCollectionList
                    type={type}
                    setPokemon={setSelectedPokemon}
                    filterState={filterState}
                  />
                </TabPanel>
              )
            }
          )}
          <TabPanel>
            <UnownPanel
              setPokemon={setSelectedPokemon}
              filterState={filterState}
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
  filterState: CollectionFilterState
}) {
  const pokemonCollection = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )

  const getItem = useCallback(
    (index) => pokemonCollection?.get(index),
    [pokemonCollection]
  )

  const pokemonsSorted = useMemo(() => {
    return (Object.values(Pkm) as Pkm[]).sort((a: Pkm, b: Pkm) => {
      if (props.filterState.sort === "index") {
        return PkmFamily[a] === PkmFamily[b]
          ? getPokemonData(a).stars - getPokemonData(b).stars
          : PkmIndex[PkmFamily[a]].localeCompare(PkmIndex[PkmFamily[b]])
      } else if (props.filterState.sort === "played") {
        return (
          (getItem(PkmIndex[b])?.played ?? 0) -
          (getItem(PkmIndex[a])?.played ?? 0)
        )
      } else if (props.filterState.sort === "unlocked") {
        const configA = getItem(PkmIndex[a])
        const configB = getItem(PkmIndex[b])
        return (
          (configB?.emotions.length ?? 0) +
          (configB?.shinyEmotions.length ?? 0) -
          ((configA?.emotions.length ?? 0) +
            (configA?.shinyEmotions.length ?? 0))
        )
      } else {
        return (
          (getItem(PkmIndex[b])?.dust ?? 0) - (getItem(PkmIndex[a])?.dust ?? 0)
        )
      }
    })
  }, [props.filterState.sort, getItem])

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

  const eligiblePokemons: (React.JSX.Element | null)[] = useMemo(
    () =>
      pokemonsFiltered.map((pkm) => {
        const pokemonData = getPokemonData(pkm)
        return (
          <PokemonCollectionItem
            key={`${pokemonData.index}-${props.type}`}
            name={pkm}
            index={pokemonData.index}
            item={getItem(pokemonData.index)}
            filterState={props.filterState}
            setPokemon={props.setPokemon}
          />
        )
      }),
    [getItem, pokemonsFiltered, props.filterState, props.setPokemon, props.type]
  )

  return <div className="pokemon-collection-list">{eligiblePokemons}</div>
}
