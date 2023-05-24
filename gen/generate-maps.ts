import { Dungeon } from "../app/types/Config"
import Design from "../app/core/design"
import fs from "fs"
import { logger } from "../app/utils/logger"

;(Object.keys(Dungeon) as Dungeon[]).forEach((m) => {
  const d = new Design(m, 5, 0.1, 5, 5, [0, 0], [0, 0], true)
  d.create().then(() => {
    const file = fs.createWriteStream(`tests/samples/${d.id}.json`)
    file.on("error", function (err) {
      logger.error(err)
    })
    file.write(JSON.stringify(d.exportToTiled()))
    file.end()
  })
})
