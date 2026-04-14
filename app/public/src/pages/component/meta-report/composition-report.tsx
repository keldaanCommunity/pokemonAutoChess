import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { List, useDynamicRowHeight } from "react-window"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { fetchMetaV2, IMetaV2 } from "../../../models/meta-v2"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import TeamComp from "./team-comp"
import "./composition-report.css"

const ROW_HEIGHT = 300

export function CompositionReport() {
  const [loading, setLoading] = useState<boolean>(true)
  const [meta, setMeta] = useState<IMetaV2[]>([])
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")

  useEffect(() => {
    fetchMetaV2().then((res) => {
      setLoading(false)
      setMeta(res)
    })
  }, [])
  const [rankingBy, setRanking] = useState<string>("mean_rank")

  const popularPokemonOptions = useMemo(() => {
    const pokemonPopularity = new Map<Pkm, number>()

    meta.forEach((team) => {
      Object.entries(team.mean_team?.pokemons ?? {}).forEach(
        ([pokemon, data]) => {
          const popularity = (data?.frequency ?? 0) * team.count
          const current = pokemonPopularity.get(pokemon as Pkm) ?? 0
          pokemonPopularity.set(pokemon as Pkm, current + popularity)
        }
      )
    })

    return [...pokemonPopularity.keys()].sort((a, b) => a.localeCompare(b))
  }, [meta])

  const sortedMeta = useMemo(() => {
    const filteredMeta = selectedPkm
      ? meta.filter((team) => {
          const pokemons = team.mean_team?.pokemons ?? {}
          const data = pokemons[selectedPkm]
          return (data?.frequency ?? 0) > 0
        })
      : meta

    return [...filteredMeta].sort((a, b) => {
      const order = rankingBy === "count" || rankingBy === "winrate" ? -1 : 1
      return (a[rankingBy] - b[rankingBy]) * order
    })
  }, [meta, rankingBy, selectedPkm])

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ROW_HEIGHT,
    key: sortedMeta.length
  })

  return (
    <div id="meta-report-compo">
      <header>
        <h2>{t("best_team_compositions")}</h2>
        <div className="filters">
          <select
            value={rankingBy}
            onChange={(e) => setRanking(e.target.value)}
          >
            <option value="count">
              {t("rank")} {t("by_popularity")}
            </option>
            <option value="mean_rank">
              {t("rank")} {t("by_average_place")}
            </option>
            <option value="winrate">
              {t("rank")} {t("by_winrate")}
            </option>
          </select>
        </div>
        <PokemonTypeahead
          value={selectedPkm}
          options={popularPokemonOptions}
          onChange={(pkm) => setSelectedPkm(pkm)}
        />
      </header>

      <article>
        {sortedMeta.length === 0 && (
          <p>{loading ? t("loading") : t("no_data_available")}</p>
        )}
        <div id="meta-report-compo-list">
          <AutoSizer
            children={({ height, width }) => {
              if (height === undefined || width === undefined) return null
              return (
                <List
                  style={{ height, width }}
                  itemCount={sortedMeta.length}
                  itemSize={dynamicRowHeight}
                  itemData={sortedMeta}
                >
                  {({ index, style, data }) => (
                    <CompositionRow index={index} style={style} data={data} />
                  )}
                </List>
              )
            }}
          />
        </div>
      </article>
    </div>
  )
}

type CompoRowData = {
  sortedMeta: IMetaV2[]
}

function CompositionRow({
  index,
  style,
  data
}: {
  index: number
  style: React.CSSProperties
  data: IMetaV2[]
}): React.ReactElement | null {
  return (
    <div style={{ ...style, paddingBottom: "0.5em" }}>
      <div>
        <TeamComp team={data[index]} rank={index + 1} />
      </div>
    </div>
  )
}
