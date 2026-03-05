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
import { AutoSizer } from "react-virtualized-auto-sizer"
import { Grid } from "react-window"
import { precomputedPokemonsImplemented } from "../../../../../../gen/precomputed-pokemons"
import {
  BoosterPriceByRarity,
  getAllAltForms,
  getEmotionCost,
  PkmAltForms
} from "../../../../../config"
import { getAvailableEmotions } from "../../../../../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Passive } from "../../../../../types/enum/Passive"
import {
  NonPkm,
  Pkm,
  PkmFamily,
  PkmIndex
} from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { PokemonAnimations } from "../../../game/components/pokemon-animations"
import { useAppSelector } from "../../../hooks"
import { LocalStoreKeys, localStore, useLocalStore } from "../../utils/store"
import SynergyIcon from "../icons/synergy-icon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonCollectionItem from "./pokemon-collection-item"
import PokemonEmotionsModal from "./pokemon-emotions-modal"
import UnownPanel from "./unown-panel"
import "./pokemon-collection.css"

const CELL_WIDTH = 90
const CELL_HEIGHT = 118

export type CollectionFilterState = {
  mode: "collection" | "shiny" | "pokedex"
  filter:
    | "all"
    | "unlockable"
    | "locked"
    | "unlocked"
    | "refundable"
    | "new"
    | "favorite"
  sort: "index" | "shards" | "played" | "unlocked"
}

const listPokemons = precomputedPokemonsImplemented.filter(
  (pokemon) =>
    PkmAltForms.includes(pokemon.name) === false &&
    NonPkm.includes(pokemon.name) === false
)

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
          setCount(
            listPokemons.filter((pkm) => {
              const collectionItem = collection.find(
                (item) => item.id === pkm.index
              )
              return collectionItem && collectionItem.played > 0
            }).length
          )
          setTotal(listPokemons.length)
          break
        case "shiny":
          setCount(
            listPokemons.filter((pkm) => {
              const collectionItem = collection.find(
                (item) => item.id === pkm.index
              )
              return collectionItem && collectionItem.shinyEmotions.length > 0
            }).length
          )
          setTotal(
            listPokemons.filter(
              (p) => !PokemonAnimations[p.name]?.shinyUnavailable
            ).length
          )
          break
        default:
          setCount(
            listPokemons.filter((pkm) => {
              const collectionItem = collection.find(
                (item) => item.id === pkm.index
              )
              return (
                collectionItem &&
                (collectionItem.emotions.length > 0 ||
                  collectionItem.shinyEmotions.length > 0)
              )
            }).length
          )
          setTotal(listPokemons.length)
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
                | "favorite"
            })
          }
        >
          <option value={"all"}>{t("show_all")}</option>
          <option value={"favorite"}>{t("show_favorites")}</option>
          {filterState.mode !== "pokedex" && (
            <option value={"unlockable"}>{t("show_unlockable")}</option>
          )}
          <option value={"locked"}>{t("show_locked")}</option>
          <option value={"unlocked"}>{t("show_unlocked")}</option>
          {filterState.mode !== "pokedex" && (
            <>
              <option value={"refundable"}>{t("show_refundable")}</option>
              <option value={"new"}>{t("show_newly_obtained")}</option>
            </>
          )}
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
  const lastBoostersOpened = useAppSelector(
    (state) => state.lobby.lastBoostersOpened
  )
  const [favorites] = useLocalStore<Pkm[]>(
    LocalStoreKeys.FAVORITES,
    [],
    Infinity
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
        PkmAltForms.includes(pkm) === false &&
        (pokemonData.skill !== Ability.DEFAULT ||
          pokemonData.passive !== Passive.NONE) &&
        (props.type === "all" || pokemonData.passive !== Passive.UNOWN) &&
        (props.type === "all" ||
          pokemonData.types.includes(Synergy[props.type]))
      )
    })
  }, [pokemonsSorted, props.type])

  // Pre-filter items so the grid knows the exact count (no null renders)
  const displayedPokemons = useMemo(() => {
    return pokemonsFiltered.filter((pkm) => {
      const pokemonData = getPokemonData(pkm)
      const item = getItem(pokemonData.index)

      if (getAvailableEmotions(pokemonData.index, false).length === 0)
        return false

      const { dust, emotions, shinyEmotions } = item ?? {
        dust: 0,
        emotions: [] as Emotion[],
        shinyEmotions: [] as Emotion[]
      }

      const allForms = getAllAltForms(pkm)
      const isUnlocked = allForms.some((form) => {
        const formItem = getItem(PkmIndex[form])
        const formEmotions = formItem?.emotions ?? []
        const formShinyEmotions = formItem?.shinyEmotions ?? []
        return props.filterState.mode === "pokedex"
          ? (formItem?.played ?? 0) > 0
          : props.filterState.mode === "shiny"
            ? formShinyEmotions.length > 0
            : formEmotions.length > 0 || formShinyEmotions.length > 0
      })

      const isNew = lastBoostersOpened.some((booster) =>
        booster.some((card) => allForms.includes(card.name) && card.new)
      )

      const isFavorite = favorites.includes(pkm)
      const rarity = pokemonData.rarity
      const boosterCost = BoosterPriceByRarity[rarity]

      const availableEmotions = getAvailableEmotions(pokemonData.index, false)
      const shinyAvailableEmotions = getAvailableEmotions(
        pokemonData.index,
        true
      )
      const canUnlock =
        props.filterState.mode !== "pokedex" &&
        (availableEmotions.some(
          (e) =>
            !emotions.includes(e) &&
            dust >= getEmotionCost(e, false) &&
            props.filterState.mode !== "shiny"
        ) ||
          shinyAvailableEmotions.some(
            (e) =>
              !shinyEmotions.includes(e) &&
              dust >= getEmotionCost(e, true) &&
              !PokemonAnimations[pkm]?.shinyUnavailable
          ))

      if (props.filterState.filter === "refundable" && dust < boosterCost)
        return false
      if (props.filterState.filter === "new" && !isNew) return false
      if (props.filterState.filter === "unlocked" && !isUnlocked) return false
      if (props.filterState.filter === "unlockable" && !canUnlock) return false
      if (props.filterState.filter === "locked" && isUnlocked) return false
      if (props.filterState.filter === "favorite" && !isFavorite) return false

      return true
    })
  }, [
    pokemonsFiltered,
    getItem,
    props.filterState,
    lastBoostersOpened,
    favorites
  ])

  return (
    <div className="pokemon-collection-list">
      <AutoSizer
        renderProp={({ height, width }) => {
          if (height === undefined || width === undefined) return null
          const columnCount = Math.max(1, Math.floor(width / CELL_WIDTH))
          const rowCount = Math.ceil(displayedPokemons.length / columnCount)
          return (
            <Grid<PokemonCellData>
              style={{ height, width }}
              columnCount={columnCount}
              columnWidth={CELL_WIDTH}
              rowCount={rowCount}
              rowHeight={CELL_HEIGHT}
              cellComponent={PokemonCell}
              cellProps={{
                displayedPokemons,
                columnCount,
                getItem,
                filterState: props.filterState,
                setPokemon: props.setPokemon,
                type: props.type
              }}
            />
          )
        }}
      />
    </div>
  )
}

type PokemonCellData = {
  displayedPokemons: Pkm[]
  columnCount: number
  getItem: (index: string) => any
  filterState: CollectionFilterState
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
  type: Synergy | "all"
}

function PokemonCell({
  columnIndex,
  rowIndex,
  style,
  displayedPokemons,
  columnCount,
  getItem,
  filterState,
  setPokemon,
  type
}: {
  ariaAttributes: object
  columnIndex: number
  rowIndex: number
  style: React.CSSProperties
} & PokemonCellData): React.ReactElement | null {
  const index = rowIndex * columnCount + columnIndex
  if (index >= displayedPokemons.length) return null
  const pkm = displayedPokemons[index]
  const pokemonData = getPokemonData(pkm)
  return (
    <div style={style}>
      <PokemonCollectionItem
        key={`${pokemonData.index}-${type}`}
        name={pkm}
        index={pokemonData.index}
        item={getItem(pokemonData.index)}
        filterState={filterState}
        setPokemon={setPokemon}
      />
    </div>
  )
}
