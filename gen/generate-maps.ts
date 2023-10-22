import { DungeonPMDO } from "../app/types/Config"
import Design from "../app/core/design"
import fs from "fs"
import { logger } from "../app/utils/logger"
import { writeFileSync } from "fs-extra"
;(Object.keys(DungeonPMDO) as DungeonPMDO[]).forEach((m) => {
  console.log("Creating map", m, "...")
  // const d = new Design(m, 2, 0.1, 16, 12, [3, 3, 12, 8], [2, 2, 13, 9])
  const d = new Design(m, 2, 0.1, 50, 25)
  writeFileSync(
    `tests/samples/${d.id}.json`,
    JSON.stringify(d.exportToTiled(), null, 2)
  )
})
