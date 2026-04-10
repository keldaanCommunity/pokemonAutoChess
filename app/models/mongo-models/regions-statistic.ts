import { model, Schema } from "mongoose"
import type { IRegionStatistic } from "../../types/models/regions-statistic"
import { DungeonPMDO } from "../../types/enum/Dungeon"

const regionStatisticSchema = new Schema({
  name: {
    type: String,
    enum: Object.values(DungeonPMDO)
  },
  count: {
    type: Number
  },
  rank: {
    type: Number
  },
  elo: {
    type: Number
  },
  pokemons: [
    {
      type: String
    }
  ]
})

export default model<IRegionStatistic>(
  "RegionStatistic",
  regionStatisticSchema,
  "regions-statistic"
)
