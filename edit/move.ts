import fs from "fs"
import fse from "fs-extra"
import { PkmIndex } from "../app/types/enum/Pokemon"

const args = process.argv.slice(2)
const path = args[0]
const pkmIndex = args[1]

const creditsName = fs.readFileSync(`${path}/credit_names.txt`)
fs.writeFileSync("sheets/credit_names.txt", creditsName)

fse.copySync(
  `sheets/durations.json`,
  `../app/public/src/assets/pokemons/durations.json`,
  {
    overwrite: true
  }
)

if (pkmIndex) {
  moveSheet(pkmIndex)
} else {
  moveAll()
}

function moveSheet(pkmIndex) {
  try {
    fse.copySync(
      `sheets/${pkmIndex}.json`,
      `../app/public/src/assets/pokemons/${pkmIndex}.json`,
      {
        overwrite: true
      }
    )
    fse.copySync(
      `sheets/${pkmIndex}.png`,
      `../app/public/src/assets/pokemons/${pkmIndex}.png`,
      {
        overwrite: true
      }
    )
  } catch (err) {
    console.warn(`Sheet not found for ${pkmIndex}`)
  }
}

function moveAll() {
  Object.values(PkmIndex).forEach((index) => moveSheet(index))
}
