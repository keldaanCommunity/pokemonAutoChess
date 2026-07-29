import { initMetrics } from "pm2-prom-module-client"
import client from "prom-client"

export function initializeMetrics() {
  const collectDefaultMetrics = client.collectDefaultMetrics
  const Registry = client.Registry
  const register = new Registry()
  collectDefaultMetrics({ register })
  initMetrics(register)
}
