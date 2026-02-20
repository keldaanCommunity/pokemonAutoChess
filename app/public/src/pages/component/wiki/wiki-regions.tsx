import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { List, useDynamicRowHeight } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { RegionDetails } from "../../../../../config"
import { PokemonClasses } from "../../../../../models/colyseus-models/pokemon"
import {
  getPokemonData,
  PRECOMPUTED_REGIONAL_MONS
} from "../../../../../models/precomputed/precomputed-pokemon-data"
import { DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"

const MIN_COL_WIDTH = 320
const ROW_HEIGHT = 340

export default function WikiRegions() {
  const { t } = useTranslation()

  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")
  const [pokemonsPerRegion, setPokemonsPerRegion] = useState<{
    [key in DungeonPMDO]?: Pkm[]
  }>({})
  useEffect(() => {
    const timer = setTimeout(() => {
      setPokemonsPerRegion(
        Object.keys(DungeonPMDO).reduce((o, region) => {
          const regionalMons = PRECOMPUTED_REGIONAL_MONS.filter((p) =>
            new PokemonClasses[p](p).isInRegion(region as DungeonPMDO)
          ).filter((p, index, array) => {
            const evolution = getPokemonData(PkmFamily[p]).evolution
            return (
              array.findIndex((p2) => PkmFamily[p] === PkmFamily[p2]) ===
                index && // dedup same family
              !(
                evolution === p ||
                (evolution && getPokemonData(evolution).evolution === p)
              )
            ) // exclude non divergent evos
          })
          o[region as DungeonPMDO] = regionalMons
          return o
        }, {})
      )
    }, 100)
    // Cleanup function to clear the timeout
    return () => clearTimeout(timer)
  }, [])

  const regionalMons = useMemo(() => {
    return [...new Set(Object.values(pokemonsPerRegion).flat() as Pkm[])].sort(
      (a, b) => {
        return t(`pkm.${a}`).localeCompare(t(`pkm.${b}`))
      }
    )
  }, [pokemonsPerRegion])
  const filteredRegions = useMemo(() => {
    const regions = Object.keys(DungeonPMDO) as DungeonPMDO[]
    if (!selectedPkm) return regions
    return regions.filter((region) =>
      pokemonsPerRegion[region]?.includes(selectedPkm)
    )
  }, [selectedPkm, pokemonsPerRegion])

  const sortedRegions = useMemo(
    () =>
      filteredRegions.sort((a, b) =>
        t(`map.${a}`).localeCompare(t(`map.${b}`))
      ),
    [filteredRegions, t]
  )

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ROW_HEIGHT,
    key: sortedRegions.length
  })

  return (
    <div id="wiki-regions">
      <div className="filters" style={{ marginBottom: "0.5em" }}>
        <PokemonTypeahead
          options={regionalMons}
          value={selectedPkm}
          onChange={(pkm) => setSelectedPkm(pkm)}
        />
      </div>
      <div className="my-box" style={{ marginBottom: "0.5em" }}>
        <p>{t("region_hint1")}</p>
        <p>{t("region_hint2")}</p>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AutoSizer
          renderProp={({ height, width }) => {
            if (height === undefined || width === undefined) return null
            const columnCount = Math.max(1, Math.floor(width / MIN_COL_WIDTH))
            const rowCount = Math.ceil(sortedRegions.length / columnCount)

            return (
              <List<RegionRowData>
                key={columnCount}
                style={{ height, width }}
                rowCount={rowCount}
                rowHeight={dynamicRowHeight}
                rowComponent={RegionRow}
                rowProps={{
                  regions: sortedRegions,
                  columnCount,
                  pokemonsPerRegion,
                  t
                }}
              />
            )
          }}
        />
      </div>
      <GamePokemonDetailTooltip origin="wiki" />
    </div>
  )
}

type RegionRowData = {
  regions: DungeonPMDO[]
  columnCount: number
  pokemonsPerRegion: { [key in DungeonPMDO]?: Pkm[] }
  t: (key: string) => string
}

function RegionRow({
  index,
  style,
  regions,
  columnCount,
  pokemonsPerRegion,
  t
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & RegionRowData): React.ReactElement | null {
  const startIdx = index * columnCount
  const rowRegions = regions.slice(startIdx, startIdx + columnCount)

  return (
    <div style={{ ...style, paddingBottom: "0.5em" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: "0.5em"
        }}
      >
        {rowRegions.map((dungeon) => (
          <div
            key={dungeon}
            className="my-box"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
              position: "relative"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h2>{t(`map.${dungeon}`)}</h2>
              <div style={{ display: "flex", gap: "5px" }}>
                {RegionDetails[dungeon].synergies.map((synergy) => (
                  <SynergyIcon type={synergy} key={"map_synergy_" + synergy} />
                ))}
              </div>
            </div>
            <img
              src={`/assets/maps/${dungeon}-preview.png`}
              loading="lazy"
              alt={dungeon}
              style={{
                border: "1px solid #000000",
                borderRadius: "4px",
                boxShadow: "2px 2px #00000060",
                imageRendering: "pixelated",
                height: "250px",
                objectFit: "cover"
              }}
            />
            <div className="wiki-regional-mons">
              {(pokemonsPerRegion[dungeon] ?? []).map((pkm) => (
                <PokemonPortrait
                  loading="lazy"
                  portrait={PkmIndex[pkm]}
                  key={pkm}
                  data-tooltip-id="game-pokemon-detail-tooltip"
                  data-tooltip-content={pkm}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
