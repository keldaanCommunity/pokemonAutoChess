import fs from "fs"
import fse from "fs-extra"

const args = process.argv.slice(2)
const path = args[0]
const pkmIndex = args[1]

const tracker = fs.readFileSync(`${path}/tracker.json`)
fs.writeFileSync("sheets/tracker.json", tracker)
const creditsName = fs.readFileSync(`${path}/credit_names.txt`)
fs.writeFileSync("sheets/credit_names.txt", creditsName)
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
fse.copySync(
  `sheets/durations.json`,
  `../app/public/src/assets/pokemons/durations.json`,
  {
    overwrite: true
  }
)
