import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { EloRank } from "../../../../../types/enum/EloRank"
import { getRank } from "../../../../../utils/elo"
import {
  fetchPlayerRankDistribution,
  IPlayerRankDistribution,
  IPlayerRankDistributionBucket
} from "../../../models/player-rank-distribution"
import { formatDate } from "../../utils/date"

const CHART_MARGIN = { top: 30, right: 10, left: 10, bottom: 10 }

const RANK_COLORS: Record<EloRank, string> = {
  [EloRank.LEVEL_BALL]: "#8c8c8c",
  [EloRank.NET_BALL]: "#3da0e8",
  [EloRank.SAFARI_BALL]: "#a08840",
  [EloRank.LOVE_BALL]: "#e05080",
  [EloRank.PREMIER_BALL]: "#ababab",
  [EloRank.QUICK_BALL]: "#2a6ee0",
  [EloRank.POKE_BALL]: "#e03030",
  [EloRank.SUPER_BALL]: "#4a35e0",
  [EloRank.ULTRA_BALL]: "#d4a800",
  [EloRank.MASTER_BALL]: "#a040d8",
  [EloRank.BEAST_BALL]: "#c00000"
}

const RANK_BAND_COLORS: Record<EloRank, string> = {
  [EloRank.LEVEL_BALL]: "rgba(180, 180, 180, 0.12)",
  [EloRank.NET_BALL]: "rgba(120, 196, 255, 0.12)",
  [EloRank.SAFARI_BALL]: "rgba(206, 180, 103, 0.12)",
  [EloRank.LOVE_BALL]: "rgba(255, 132, 170, 0.12)",
  [EloRank.PREMIER_BALL]: "rgba(255, 255, 255, 0.12)",
  [EloRank.QUICK_BALL]: "rgba(84, 148, 255, 0.12)",
  [EloRank.POKE_BALL]: "rgba(255, 110, 110, 0.12)",
  [EloRank.SUPER_BALL]: "rgba(114, 99, 255, 0.12)",
  [EloRank.ULTRA_BALL]: "rgba(255, 214, 74, 0.12)",
  [EloRank.MASTER_BALL]: "rgba(206, 111, 255, 0.12)",
  [EloRank.BEAST_BALL]: "rgba(255, 110, 110, 0.12)"
}

type RankSegment = {
  rank: EloRank
  startIndex: number
  endIndex: number
}

type ChartBucket = IPlayerRankDistributionBucket & {
  countForScale: number | null
}

function formatPercent(value: number): string {
  if (value === 0) return "0%"
  if (value < 0.01) return "<0.01%"
  if (value < 0.1) return `${value.toFixed(3)}%`
  if (value < 1) return `${value.toFixed(2)}%`
  return `${value.toFixed(1)}%`
}

function formatTopPercent(value: unknown): string {
  const numericValue = Number(value ?? 0)
  return `Top ${formatPercent(numericValue)}`
}

function getBucketColor(bucket: IPlayerRankDistributionBucket): string {
  return RANK_COLORS[getBucketRank(bucket)]
}

function getBucketRank(bucket: IPlayerRankDistributionBucket): EloRank {
  const elo = bucket.minElo ?? 0
  return getRank(elo)
}

function buildRankSegments(
  buckets: IPlayerRankDistributionBucket[]
): RankSegment[] {
  if (buckets.length === 0) return []

  const segments: RankSegment[] = []
  let currentRank = getBucketRank(buckets[0])
  let startIndex = 0

  for (let i = 1; i < buckets.length; i += 1) {
    const rank = getBucketRank(buckets[i])
    if (rank !== currentRank) {
      segments.push({ rank: currentRank, startIndex, endIndex: i - 1 })
      currentRank = rank
      startIndex = i
    }
  }

  segments.push({ rank: currentRank, startIndex, endIndex: buckets.length - 1 })
  return segments
}

function CustomTooltip({
  active,
  payload
}: {
  active?: boolean
  payload?: Array<{ payload: IPlayerRankDistributionBucket }>
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const bucket = payload[0].payload
  return (
    <div className="player-report-tooltip">
      <h3>{bucket.bucketLabel}</h3>
      <p>
        {t("count", { defaultValue: "Count" })}: {bucket.count}
      </p>
      <p>
        {t("rank_share", { defaultValue: "Share" })}:{" "}
        {bucket.percentage.toFixed(10)}%
      </p>
      <p>
        {t("top_percent", { defaultValue: "Top %" })}:{" "}
        {bucket.topPercent.toFixed(10)}%
      </p>
      <p>
        {t("elo", { defaultValue: "Elo" })}: {bucket.minElo ?? "<600"}
        {bucket.maxElo !== null ? ` - ${bucket.maxElo}` : ""}
      </p>
    </div>
  )
}

export function PlayerReport() {
  const [distribution, setDistribution] =
    useState<IPlayerRankDistribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    fetchPlayerRankDistribution()
      .then((res) => {
        setDistribution(res)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const chartData = useMemo(() => {
    return (distribution?.buckets ?? []).map((bucket) => ({
      ...bucket,
      // Recharts log scale cannot render zeros.
      countForScale: bucket.count > 0 ? bucket.count : null
    }))
  }, [distribution])

  const rankSegments = useMemo(() => {
    return buildRankSegments(chartData)
  }, [chartData])

  return (
    <div id="player-report">
      <header>
        <h2>
          {t("player_rank_distribution", {
            defaultValue: "Player Rank Distribution"
          })}
        </h2>
        <div className="meta">
          <span>
            {t("total_players", { defaultValue: "Total players" })}:{" "}
            {distribution?.totalPlayers ?? 0}
          </span>
          <span>
            {t("last_updated", { defaultValue: "Last updated" })}:{" "}
            {distribution ? formatDate(new Date(distribution.updatedAt)) : "-"}
          </span>
        </div>
      </header>

      {loading && <p>{t("loading", { defaultValue: "Loading" })}</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && chartData.length === 0 && (
        <p>{t("no_data_available", { defaultValue: "No data available" })}</p>
      )}

      {!loading && !error && chartData.length > 0 && (
        <div className="chart-shell">
          <div
            className="rank-bands"
            style={{
              top: CHART_MARGIN.top,
              right: CHART_MARGIN.right,
              bottom: CHART_MARGIN.bottom,
              left: CHART_MARGIN.left
            }}
          >
            {rankSegments.map((segment) => {
              const total = chartData.length
              const leftPct = (segment.startIndex / total) * 100
              const widthPct =
                ((segment.endIndex - segment.startIndex + 1) / total) * 100
              return (
                <div
                  key={`band-${segment.rank}-${segment.startIndex}`}
                  className="rank-band"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    backgroundColor: RANK_BAND_COLORS[segment.rank]
                  }}
                >
                  <div className="rank-chip">
                    <img
                      src={`assets/ranks/${segment.rank}.svg`}
                      alt={t(`elorank.${segment.rank}`)}
                      title={t(`elorank.${segment.rank}`)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="bucketLabel"
                angle={-35}
                interval={0}
                textAnchor="end"
                height={70}
                tick={{ fill: "#ddd", fontSize: 10 }}
              />
              <YAxis
                scale="log"
                domain={[1, "dataMax"]}
                tick={{ fill: "#ddd", fontSize: 11 }}
                allowDecimals={false}
                tickFormatter={(value: number) =>
                  value >= 1000 ? value.toLocaleString() : String(value)
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
                animationDuration={0}
              />
              <Bar dataKey="countForScale" radius={[4, 4, 0, 0]}>
                {chartData.map((bucket) => (
                  <Cell
                    key={`cell-${bucket.bucketLabel}`}
                    fill={getBucketColor(bucket)}
                  />
                ))}
                <LabelList
                  dataKey="topPercent"
                  position="top"
                  className="player-report-top-label"
                  formatter={formatTopPercent}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
