import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { RarityColor } from "../../../../../config"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { Ability } from "../../../../../types/enum/Ability"
import { Rarity } from "../../../../../types/enum/Game"
import { Item } from "../../../../../types/enum/Item"
import {
  Pkm,
  PkmFamily,
  PkmIndex,
  PkmRegionalBaseVariants,
  PkmRegionalVariants
} from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { Synergy, SynergyArray } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { usePreferences } from "../../../preferences"
import { cc } from "../../utils/jsx"
import { Checkbox } from "../checkbox/checkbox"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"

export default function PokemonPicker(props: {
  selected?: PkmWithCustom | Item
  selectEntity?: React.Dispatch<React.SetStateAction<PkmWithCustom>>
  addEntity?: (e: PkmWithCustom) => void
}) {
  const tabs = [...Object.keys(PRECOMPUTED_POKEMONS_PER_TYPE), "none"]
  const pokemonsPerTab: IPokemonData[][] = tabs.map((t) =>
    (t === "none"
      ? [
          Pkm.KECLEON,
          Pkm.ARCEUS,
          Pkm.PILLAR_WOOD,
          Pkm.PILLAR_IRON,
          Pkm.PILLAR_CONCRETE
        ]
      : PRECOMPUTED_POKEMONS_PER_TYPE[t]
    ).map((p) => getPokemonData(p))
  )

  return (
    <Tabs className="my-box" id="pokemon-picker">
      <TabList>
        {tabs.map((t) => {
          return (
            <Tab key={t}>
              {t === "none" ? (
                "?"
              ) : (
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", `synergy,${t}`)
                    e.stopPropagation() // Prevent tab switching
                  }}
                  onDragEnd={() => {
                    // Reset cursor after drag
                  }}
                  style={{
                    display: "block",
                    cursor: "var(--cursor-grab)",
                    userSelect: "none"
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.cursor = "var(--cursor-grabbing)"
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.cursor = "var(--cursor-grab)"
                  }}
                >
                  <SynergyIcon type={t as Synergy} />
                </div>
              )}
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
  selected?: PkmWithCustom | Item
  selectEntity?: React.Dispatch<React.SetStateAction<PkmWithCustom>>
  addEntity?: (e: PkmWithCustom) => void
  type: Synergy | "none"
}) {
  const [preferences, setPreferences] = usePreferences()
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)

  function handleOnDragStart(e: React.DragEvent, name: Pkm) {
    e.stopPropagation()
    e.dataTransfer.setData("text/plain", `pokemon,${name}`)
    setIsDragging(true)
  }

  function handleOnDragEnd() {
    setIsDragging(false)
  }

  const ingame = useLocation().pathname === "/game"
  const [overlap, setOverlap] = useState<Synergy | null>(null)
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const regionalPokemons: Pkm[] = currentPlayer?.regionalPokemons?.slice() ?? []

  const filteredPokemons = props.pokemons
    .filter((p) => (overlap ? p.types.includes(overlap) : true))
    .filter((p) => {
      if (p.rarity === Rarity.SPECIAL) return true // show all summons & specials, even in the same family
      if (p.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      if (preferences.showEvolutions) return true
      else return p.name === PkmFamily[p.name]
    })
    .filter((p) => {
      const family = PkmFamily[p.name]
      const baseVariantName = PkmRegionalBaseVariants[family] ?? family
      const regionalVariants = PkmRegionalVariants[family]
      const isInAddPicks = additionalPokemons.includes(baseVariantName)
      const isInRegion = p.regional && regionalPokemons.includes(family)
      const hasVariantInRegion = regionalVariants?.some((variant) =>
        regionalPokemons.includes(variant)
      )
      const isAvailable =
        (!p.regional || isInRegion) &&
        (!p.additional || isInAddPicks) &&
        !hasVariantInRegion
      return (
        !ingame ||
        !preferences.filterAvailableAddsAndRegionals ||
        isAvailable ||
        specialGameRule === SpecialGameRule.EVERYONE_IS_HERE
      )
    })

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
    SynergyArray.filter((type) => type !== props.type).map((type) => [
      type,
      filteredPokemons
        .filter((p) => p.types.includes(type))
        .filter(
          (p, i, list) =>
            list.findIndex((q) => PkmFamily[p.name] === PkmFamily[q.name]) === i
        ).length
    ])
  )

  const overlaps = [...overlapsMap.entries()]
    .filter(([type, nb]) => nb > 0)
    .sort((a, b) => b[1] - a[1])

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
            <dt
              style={{
                color: RarityColor[rarity],
                textTransform: "uppercase",
                fontWeight: "500",
                fontSize: "80%",
                alignContent: "center"
              }}
            >
              {t(`rarity.${rarity}`)}
            </dt>
            <dd style={{ display: "flex", flexWrap: "wrap", gap: "1px" }}>
              {(pokemonsPerRarity[rarity] ?? []).map((p) => (
                <div
                  className={cc("pokemon-portrait", {
                    additional: p.additional,
                    regional: p.regional,
                    selected: p.name === props.selected?.["name"]
                  })}
                  onClick={() => {
                    props.selectEntity?.({
                      name: p.name,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  onDoubleClick={(e) => {
                    e.preventDefault()
                    props.addEntity?.({
                      name: p.name,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    props.addEntity?.({
                      name: p.name,
                      emotion: Emotion.NORMAL,
                      shiny: false
                    })
                  }}
                  key={p.name}
                  data-tooltip-id="game-pokemon-detail-tooltip"
                  data-tooltip-content={p.name}
                  draggable
                  onDragStart={(e) => handleOnDragStart(e, p.name)}
                  onDragEnd={handleOnDragEnd}
                >
                  <img src={getPortraitSrc(p.index)} />
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
              return (
                <li
                  onClick={() => setOverlap(overlap === type ? null : type)}
                  key={type}
                  className={cc({ active: overlap === type })}
                >
                  {props.type === "none" ? (
                    "?"
                  ) : (
                    <SynergyIcon type={props.type} />
                  )}
                  <SynergyIcon type={type} />
                  <span>{nb}</span>
                </li>
              )
            })}
          </ul>
        </details>
      </div>
      <GamePokemonDetailTooltip
        origin="planner"
        {...(isDragging ? { isOpen: false } : {})}
      />
    </>
  )
}
