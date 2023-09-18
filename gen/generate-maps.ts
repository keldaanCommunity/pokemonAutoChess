import { Dungeon } from "../app/types/Config"
import Design from "../app/core/design"
import fs from "fs"
import { logger } from "../app/utils/logger"
;(Object.keys(Dungeon) as Dungeon[]).forEach((m) => {
  const d = new Design(m, 2, 0.1, 16, 12, [3, 3, 12, 8], [2, 2, 13, 9])
  d.create().then(() => {
    const file = fs.createWriteStream(`tests/samples/${d.id}.json`)
    file.on("error", function (err) {
      logger.error(err)
    })
    file.write(JSON.stringify(d.exportToTiled()))
    file.end()
  })
})
