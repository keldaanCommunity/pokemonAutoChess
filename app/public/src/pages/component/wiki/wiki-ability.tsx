import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { List, useDynamicRowHeight } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { PRECOMPUTED_POKEMONS_PER_ABILITY } from "../../../../../models/precomputed/precomputed-ability"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import {
  AbilityPerTM,
  Item,
  TMsBronze,
  TMsSilver
} from "../../../../../types/enum/Item"
import { PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"

const MIN_COL_WIDTH = 320
const ROW_HEIGHT = 200

export default function WikiAbility() {
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>("")

  const pokemonsPerAbility = useMemo(
    () =>
      Object.keys(Ability).reduce((o, ability) => {
        o[ability] = PRECOMPUTED_POKEMONS_PER_ABILITY[ability]
          .map((p) => getPokemonData(p))
          .sort((a, b) => {
            if (a.additional !== b.additional)
              return +a.additional - +b.additional
            // sort by PkmFamily
            const familyA = PkmFamily[a.name],
              familyB = PkmFamily[b.name]
            if (familyA !== familyB)
              return PkmIndex[familyA].localeCompare(PkmIndex[familyB])
            return 0
          })
          .sort((a, b) => {
            // then by stars
            const familyA = PkmFamily[a.name],
              familyB = PkmFamily[b.name]
            if (familyA === familyB && a.stars !== b.stars)
              return a.stars - b.stars
            return 0
          })
        return o
      }, {}),
    []
  )

  const tmPerAbility = useMemo<Partial<Record<Ability, Item>>>(
    () =>
      Object.fromEntries(
        Object.entries(AbilityPerTM).map(([tm, ability]) => [ability, tm])
      ),
    []
  )

  const filteredAbilities = (Object.keys(Ability) as Ability[])
    .filter(
      (a) =>
        a !== Ability.DEFAULT &&
        (!searchQuery.trim() ||
          `${t(`ability.${a}`)} ${t(`ability_description.${a}`)}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()))
    )
    .sort((a, b) => t(`ability.${a}`).localeCompare(t(`ability.${b}`)))

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ROW_HEIGHT,
    key: filteredAbilities.length
  })

  return (
    <div id="wiki-ability">
      <div className="actions">
        <input
          type="search"
          placeholder={t("search")}
          onInput={(event) =>
            setSearchQuery((event.target as HTMLInputElement).value)
          }
        />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AutoSizer
          renderProp={({ height, width }) => {
            if (height === undefined || width === undefined) return null
            const columnCount = Math.max(1, Math.floor(width / MIN_COL_WIDTH))
            const rowCount = Math.ceil(filteredAbilities.length / columnCount)

            return (
              <List<AbilityRowData>
                key={columnCount}
                style={{ height, width }}
                rowCount={rowCount}
                rowHeight={dynamicRowHeight}
                rowComponent={AbilityRow}
                rowProps={{
                  abilities: filteredAbilities,
                  columnCount,
                  pokemonsPerAbility,
                  tmPerAbility,
                  t
                }}
              />
            )
          }}
        />
      </div>
      <GamePokemonDetailTooltip origin="wiki" />
      <ItemDetailTooltip />
    </div>
  )
}

type AbilityRowData = {
  abilities: Ability[]
  columnCount: number
  pokemonsPerAbility: Record<string, any[]>
  tmPerAbility: Partial<Record<Ability, Item>>
  t: (key: string) => string
}

function AbilityRow({
  index,
  style,
  abilities,
  columnCount,
  pokemonsPerAbility,
  tmPerAbility,
  t
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & AbilityRowData): React.ReactElement | null {
  const startIdx = index * columnCount
  const rowAbilities = abilities.slice(startIdx, startIdx + columnCount)

  return (
    <div style={{ ...style, paddingBottom: "0.5em" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: "0.5em"
        }}
      >
        {rowAbilities.map((ability) => (
          <div
            key={ability}
            className="my-box"
            style={{ display: "flex", flexDirection: "column", gap: 5 }}
          >
            <div>
              <h2>{t(`ability.${ability}`)}</h2>
              <p>
                {addIconsToDescription(t(`ability_description.${ability}`))}
              </p>
            </div>
            <div>
              <ul>
                {(pokemonsPerAbility[ability] ?? []).map((p) => (
                  <li key={p.name}>
                    <div
                      className={cc("pokemon-portrait", {
                        additional: p.additional,
                        regional: p.regional
                      })}
                      data-tooltip-id="game-pokemon-detail-tooltip"
                      data-tooltip-content={p.name}
                    >
                      <img src={getPortraitSrc(p.index)} />
                    </div>
                  </li>
                ))}
                {tmPerAbility[ability] && (
                  <li
                    data-tooltip-id="item-detail-tooltip"
                    data-tooltip-content={tmPerAbility[ability]}
                  >
                    <img
                      src={`assets/item/${TMsBronze.includes(tmPerAbility[ability]!) ? "TM_Bronze" : TMsSilver.includes(tmPerAbility[ability]!) ? "TM_Silver" : "TM_Gold"}.png`}
                      className="item"
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
