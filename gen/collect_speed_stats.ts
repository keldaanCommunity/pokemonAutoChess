import { writeFileSync } from "fs"
import { Pkm, PkmFamily, PkmIndex } from "../app/types/enum/Pokemon"
import { getPokemonData } from "../app/models/precomputed/precomputed-pokemon-data"

const SPEED_BY_PKM = {}

Promise.all(
  Object.values(Pkm).map(async (pkm: Pkm) => {
    const family = Object.keys(PkmFamily).filter(
      (p) => PkmFamily[p] === PkmFamily[pkm]
    )
    const maxEvolution = family.find(
      (p) => getPokemonData(p as Pkm).evolution === null
    )
    if (!maxEvolution) {
      console.error(`Error processing ${pkm}: No max evolution found`)
      return
    }
    let index = PkmIndex[maxEvolution]
    // remove leading zeros
    index = index.replace(/^0+/, "")

    return fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
      .then((response) => response.json())
      .then((data) => data.stats.find((stat) => stat.stat.name === "speed"))
      .then((data) => {
        SPEED_BY_PKM[pkm] = data.base_stat
      })
      .catch((error) => {
        console.error(
          `Error processing ${pkm} (max evol: ${maxEvolution}) index ${index} ${error}:`,
          error
        )
      })
  })
).then(() => {
  writeFileSync(
    "../app/models/precomputed/speed-by-pkm.json",
    JSON.stringify(SPEED_BY_PKM)
  )
})
