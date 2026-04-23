import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { fetchGameActivity, IGameActivity } from "../../../models/game-activity"
import { formatDate } from "../../utils/date"
import "./activity-report.css"

const CHART_MARGIN = { top: 10, right: 10, left: 10, bottom: 10 }

function CustomTooltip({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="activity-report-tooltip">
      <h3>{label}</h3>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function ActivityReport() {
  const [activity, setActivity] = useState<IGameActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    fetchGameActivity()
      .then((res) => setActivity(res))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalGames = useMemo(
    () => activity?.days.reduce((acc, d) => acc + d.gameCount, 0) ?? 0,
    [activity]
  )

  return (
    <div id="activity-report">
      <header>
        <h2>{t("game_activity", { defaultValue: "Game Activity" })}</h2>
        <div className="meta">
          <span>
            {t("total_games_30d", { defaultValue: "Games (last 30 days)" })}:{" "}
            {totalGames.toLocaleString()}
          </span>
          <span>
            {t("last_updated", { defaultValue: "Last updated" })}:{" "}
            {activity ? formatDate(new Date(activity.updatedAt)) : "-"}
          </span>
        </div>
      </header>

      {loading && <p>{t("loading", { defaultValue: "Loading" })}</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && (activity?.days.length ?? 0) === 0 && (
        <p>{t("no_data_available", { defaultValue: "No data available" })}</p>
      )}

      {!loading && !error && (activity?.days.length ?? 0) > 0 && (
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={activity!.days} margin={CHART_MARGIN}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="date"
                angle={-35}
                textAnchor="end"
                height={60}
                tick={{ fill: "#ddd", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#ddd", fontSize: 11 }}
                allowDecimals={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
                animationDuration={0}
              />
              <Legend wrapperStyle={{ color: "#ccc", fontSize: "0.85em" }} />
              <Area
                type="monotone"
                dataKey="gameCount"
                name={t("game_count", { defaultValue: "Games" })}
                stroke="#6ba3ff"
                fill="rgba(107,163,255,0.35)"
                strokeWidth={3}
                dot={{ fill: "#6ba3ff", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
