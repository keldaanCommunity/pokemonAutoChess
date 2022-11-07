import { Dungeon } from "../app/types/Config"
import Design from "../app/core/design"
import fs from "fs"

;(Object.keys(Dungeon) as Dungeon[]).forEach((m) => {
  const d = new Design(m, 5, 0.1, 5, 5, [0, 0], [0, 0], true)
  d.create().then(() => {
    const file = fs.createWriteStream(`tests/samples/${d.id}.json`)
    file.on("error", function (err) {
      console.log(err)
    })
    file.write(JSON.stringify(d.exportToTiled()))
    file.end()
  })
})
