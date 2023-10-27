import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"
import PokemonFactory from "../app/models/pokemon-factory"
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
        .readFileSync(
          "../app/public/dist/client/assets/pokemons/indexList.json"
        )
        .toString()
    )
    if (!indexList.includes(id)) {
      indexList.push(id)
    }

    fs.writeFileSync(
        "../app/public/dist/client/assets/pokemons/indexList.json",
      JSON.stringify(indexList, null, 0)
    )
  } catch (error) {
    logger.error("error id#", id, error)
  }
}

function minifyAll() {
  const pkmaIndexes = new Array<string>()

  Object.values(Pkm).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    if (!pkmaIndexes.includes(pokemon.index)) {
      pkmaIndexes.push(pokemon.index)
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
