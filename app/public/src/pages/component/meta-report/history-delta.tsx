import React from "react"
import { IHistoryEntry } from "../../../../../models/mongo-models/pokemons-statistic-v2"
import "./history-delta.css"

function computeDelta(
  entries: IHistoryEntry[],
  invertY: boolean
): { value: number; positive: boolean } | null {
  if (!entries || entries.length < 2) return null
  const latest = entries[entries.length - 1].value
  const previous = entries[entries.length - 2].value
  const diff = latest - previous
  const positive = invertY ? diff < 0 : diff > 0
  return { value: Math.abs(diff), positive }
}

/** Inline color-coded delta badge to place next to stat values */
export function HistoryDelta(props: {
  entries: IHistoryEntry[]
  invertY?: boolean
}) {
  if (!props.entries || props.entries.length < 2) return null
  const delta = computeDelta(props.entries, props.invertY ?? false)
  if (!delta) return null
  return (
    <span
      className={`sparkline-delta ${delta.positive ? "delta-positive" : "delta-negative"}`}
    >
      {delta.positive ? "▲" : "▼"} {delta.value.toFixed(2)}
    </span>
  )
}
