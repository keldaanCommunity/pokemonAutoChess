import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { Rarity } from "../../../../../types/enum/Game"
import { Item } from "../../../../../types/enum/Item"
import { Pkm, PkmFamily, PkmIndex, PkmRegionalVariants } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import { Checkbox } from "../checkbox/checkbox"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { Ability } from "../../../../../types/enum/Ability"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { usePreferences } from "../../../preferences"

export default function PokemonPicker(props: {
  selected: PkmWithCustom | Item
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithCustom>>
  addEntity: (e: PkmWithCustom) => void
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
              addEntity={props.addEntity}
              pokemons={pokemons}
              type={tabs[i] as Synergy}
            />
          </TabPanel>
        )
      })}
    </Tabs>
  )
}

function PokemonPickerTab(props: {
  pokemons: IPokemonData[]
  selected: PkmWithCustom | Item
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithCustom>>
  addEntity: (e: PkmWithCustom) => void
  type: Synergy | "none"
}) {
  const [preferences, setPreferences] = usePreferences()
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()

  function handleOnDragStart(e: React.DragEvent, name: Pkm) {
    setHoveredPokemon(undefined)
    e.dataTransfer.setData("pokemon", name)
  }

  const ingame = useLocation().pathname === "/game"
  const [overlap, setOverlap] = useState<Synergy | null>(null)
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const regionalPokemons: Pkm[] = currentPlayer?.regionalPokemons?.slice() ?? []

  const baseVariant = (pkm: Pkm): Pkm => (Object.keys(PkmRegionalVariants) as Pkm[]).find((p) =>
    PkmRegionalVariants[p]!.includes(pkm)
  ) ?? pkm

  const filteredPokemons = props.pokemons
    .filter(p => overlap ? p.types.includes(overlap) : true)
    .filter((p) => {
      if (p.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      if (p.rarity === Rarity.SPECIAL) return true // show all summons & specials, even in the same family
      if (preferences.showEvolutions) return true
      else return p.name === PkmFamily[p.name]
    })
    .filter(
      (p) =>
        !ingame || !preferences.filterAvailableAddsAndRegionals ||
        ((!p.additional ||
          additionalPokemons.includes(baseVariant(PkmFamily[p.name])) ||
          specialGameRule === SpecialGameRule.EVERYONE_IS_HERE) &&
          (!p.regional || regionalPokemons?.includes(p.name)))
    )

  const pokemonsPerRarity = groupBy(filteredPokemons, (p) => p.rarity)
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

  const overlapsMap = new Map(
    Object.values(Synergy)
      .filter(type => type !== props.type)
      .map(type => [type, filteredPokemons.filter((p, i, list) => p.types.includes(type) &&
        list.findIndex((q) => PkmFamily[p.name] === PkmFamily[q.name]) === i
      ).length])
  )

  const overlaps = [...overlapsMap.entries()].filter(([type, nb]) => nb > 0).sort((a, b) => b[1] - a[1])

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
            Rarity.HATCH,
            Rarity.EPIC,
            Rarity.SPECIAL,
            Rarity.ULTRA
          ] as Rarity[]
        ).map((rarity) => (
          <React.Fragment key={rarity}>
            <dt style={{ color: RarityColor[rarity], textTransform: "uppercase", fontWeight: "500", fontSize: "80%", alignContent: "center" }}>
              {t(`rarity.${rarity}`)}
            </dt>
            <dd style={{ display: "flex", flexWrap: "wrap", gap: "1px" }}>
              {(pokemonsPerRarity[rarity] ?? []).map((p) => (
                <div
                  className={cc("pokemon-portrait", {
                    additional: p.additional,
                    regional: p.regional,
                    selected: p.name === props.selected["name"],
                    pixelated: !preferences.antialiasing
                  })}
                  onClick={() => {
                    props.selectEntity({
                      name: p.name,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  onDoubleClick={(e) => {
                    e.preventDefault()
                    props.addEntity({
                      name: p.name,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    props.addEntity({
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
                  <img
                    className={cc({ pixelated: !preferences.antialiasing })}
                    src={getPortraitSrc(p.index)}
                  />
                </div>
              ))}
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="filters">
        <Checkbox
          checked={preferences.showEvolutions}
          onToggle={(checked) => {
            setPreferences({ showEvolutions: checked })
          }}
          label={t("show_evolutions")}
          isDark
        />
        {ingame && (
          <Checkbox
            checked={preferences.filterAvailableAddsAndRegionals}
            onToggle={(checked) => {
              setPreferences({ filterAvailableAddsAndRegionals: checked })
            }}
            label={t("show_only_available_picks")}
            isDark
          />
        )}
        <details>
          <summary>{t("overlaps")}</summary>
          <ul className="synergy-overlaps">
            {overlaps.map(([type, nb]) => {
              return <li onClick={() => setOverlap(overlap === type ? null : type)} key={type} className={cc({ active: overlap === type })}>
                {props.type === "none" ? "?" : <SynergyIcon type={props.type} />}
                <SynergyIcon type={type} />
                <span>{nb}</span>
              </li>
            })}
          </ul>
        </details>
      </div>
      {
        hoveredPokemon && <Tooltip
          id="pokemon-detail"
          className="custom-theme-tooltip game-pokemon-detail-tooltip"
          float
        >
          <GamePokemonDetail pokemon={hoveredPokemon} />
        </Tooltip>
      }
    </>
  )
}
