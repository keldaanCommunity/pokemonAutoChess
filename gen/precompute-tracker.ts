import fs from "fs"
import fetch from "node-fetch"
import { CDN_URL } from "../app/types"

async function main() {
  console.time("precompute-tracker")
  const response = await fetch(`${CDN_URL}/tracker.json`)
  const tracker = await response.json()
  fs.writeFileSync(
    "../app/public/dist/client/assets/pokemons/tracker.json",
    JSON.stringify(tracker)
  )
  console.timeEnd("precompute-tracker")
}

main()
