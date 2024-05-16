import fs from "fs"
import fetch from "node-fetch"
import { CDN_URL } from "../app/types"

export async function precomputeTracker() {
  console.time("precompute-tracker")
  const response = await fetch(`${CDN_URL}/tracker.json`)
  const tracker = await response.json()
  fs.writeFileSync(
    "../app/public/dist/client/assets/pokemons/tracker.json",
    JSON.stringify(tracker)
  )
  console.timeEnd("precompute-tracker")
}