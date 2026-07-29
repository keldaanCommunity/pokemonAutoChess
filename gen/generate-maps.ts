import { writeFileSync } from "fs-extra"
import Design from "../app/core/design"
import { DungeonPMDO } from "../app/types/enum/Dungeon"

const dungeonTilesets = Object.keys(DungeonPMDO) as DungeonPMDO[]
dungeonTilesets.forEach((m) => {
  console.log("Creating map", m, "...")
  const d = new Design(m, 2, 0.1, 16, 12, [3, 3, 12, 8], [2, 2, 13, 9])
  writeFileSync(
    `export/samples/${d.id}.json`,
    JSON.stringify(d.exportToTiled(), null, 2)
  )
})
