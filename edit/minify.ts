import fs from "fs"
import { Pkm, PkmIndex } from "../app/types/enum/Pokemon"
import { logger } from "../app/utils/logger"

const args = process.argv.slice(2)
const specificIndexToMinify = args[0]

function minifySheet(id) {
  try {
    logger.debug(`Minifying sheet ${id}...`)
    const buffer = fs.readFileSync(`sheets/${id}.json`)
    const json = JSON.parse(buffer.toString())
    delete json.meta
    fs.writeFileSync(`sheets/${id}.json`, JSON.stringify(json, null, 0))
    const indexList = JSON.parse(
      fs
        .readFileSync("../app/public/src/assets/pokemons/indexList.json")
        .toString()
    )
    if (!indexList.includes(id)) {
      indexList.push(id)
    }

    fs.writeFileSync(
      "../app/public/src/assets/pokemons/indexList.json",
      JSON.stringify(indexList, null, 0)
    )
  } catch (error) {
    logger.error("error id#", id, error)
  }
}

function minifyAll() {
  const pkmaIndexes = new Array<string>()

  Object.values(Pkm).forEach((pkm) => {
    const index = PkmIndex[pkm]
    if (!pkmaIndexes.includes(index)) {
      pkmaIndexes.push(index)
    }
  })

  pkmaIndexes.forEach((id) => {
    minifySheet(id)
  })

  logger.debug(`indexList.json updated`)
}

if (specificIndexToMinify) {
  minifySheet(specificIndexToMinify)
} else {
  minifyAll()
}
