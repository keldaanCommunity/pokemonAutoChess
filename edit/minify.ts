import { Pkm, PkmIndex } from "../app/types/enum/Pokemon"
import fs from "fs"
import PokemonFactory from "../app/models/pokemon-factory"
import { logger } from "../app/utils/logger"

const args = process.argv.slice(2)
const specificIndexToMinify = args[0]

const indexes = ["0000"]

function minifySheet(id){
  try {
    logger.debug(`Minifying sheet ${id}...`)
    const buffer = fs.readFileSync(`sheets/${id}.json`)
    const json = JSON.parse(buffer.toString())
    fs.writeFileSync(`sheets/${id}.json`, JSON.stringify(json, null, 0))
    indexes.push(id)
  } catch (error) {
    logger.error("error id#", id)
  }
}

function minifyAll(){  
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

  const file = fs.createWriteStream("sheets/indexList.json")
  file.on("error", function (err) {
    logger.error(err)
  })
  file.write(JSON.stringify(indexes))
  file.end()
  logger.debug(`indexList.json updated`)
}

if(specificIndexToMinify) {
  minifySheet(specificIndexToMinify)
} else {
  minifyAll()
}