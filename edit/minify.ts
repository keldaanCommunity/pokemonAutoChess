import { Pkm } from "../app/types/enum/Pokemon"
import fs from "fs"
import PokemonFactory from "../app/models/pokemon-factory"
import { logger } from "../app/utils/logger"

const pkmaIndexes = new Array<string>()
const indexes = ["0000"]

Object.values(Pkm).forEach((pkm) => {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
  if (!pkmaIndexes.includes(pokemon.index)) {
    pkmaIndexes.push(pokemon.index)
  }
})

pkmaIndexes.forEach((id) => {
  try {
    const buffer = fs.readFileSync(`sheets/${id}.json`)
    const json = JSON.parse(buffer.toString())
    fs.writeFileSync(`sheets/${id}.json`, JSON.stringify(json, null, 0))
    indexes.push(id)
  } catch (error) {
    logger.error("error id#", id)
  }
})

const file = fs.createWriteStream("sheets/indexList.json")
file.on("error", function (err) {
  logger.error(err)
})
file.write(JSON.stringify(indexes))
file.end()
