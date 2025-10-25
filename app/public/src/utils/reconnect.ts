import { logger } from "../../../utils/logger"

// Utility helpers to standardize reconnect mechanics across the app.
// BEFORE: each screen (lobby/preparation/game/after) implemented
// its own retry loop with varying delays and no jitter/telemetry.
// AFTER: a single place computes delays and emits light telemetry,
// making behavior consistent, easier to analyze and tune.

export function backoffDelay(
  attempt: number,
  baseMs: number,
  maxMs: number,
  jitterRatio = 0
): number {
  // Exponential backoff with optional jitter.
  // - attempt is 1-based (1 => base, 2 => base*2, ...)
  // - capped at maxMs to protect UX and server load
  // - jitter reduces synchronization of clients reconnecting at once
  const exp = Math.min(baseMs * Math.pow(2, Math.max(0, attempt - 1)), maxMs)
  if (jitterRatio > 0) {
    const jitter = exp * jitterRatio
    const min = exp - jitter
    const max = exp + jitter
    return Math.floor(min + Math.random() * (max - min))
  }
  return Math.floor(exp)
}

type ReconnectEvent =
  | "reconnect_attempt"
  | "reconnect_success"
  | "reconnect_failed"

export function logReconnectTelemetry(
  scope: "lobby" | "preparation" | "game" | "after",
  event: ReconnectEvent,
  payload: Record<string, unknown> = {}
) {
  // Simple structured logs to help developers correlate reconnect patterns
  // in the wild (attempt counts, delays, last errors).
  // Can be swapped for a proper telemetry sink in the future.
  logger.info("telemetry", { scope, event, ...payload })
}
