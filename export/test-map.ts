import { DungeonPMDO } from "../app/types/Config"
import Design from "../app/core/design"
import { writeFileSync } from "fs-extra"

// const d = new Design(m, 2, 0.1, 16, 12, [3, 3, 12, 8], [2, 2, 13, 9])
;(Object.keys(DungeonPMDO) as DungeonPMDO[]).forEach((dungeon) => {
  console.log("creating map", dungeon)
  const d = new Design(dungeon, 2, 0.1, 50, 25)
  writeFileSync(
    `export/${d.id}.json`,
    JSON.stringify(d.exportToTiled(), null, 2)
  )
})
