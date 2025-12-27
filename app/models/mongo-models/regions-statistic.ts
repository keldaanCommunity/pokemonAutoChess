import { model, Schema } from "mongoose"
import { DungeonPMDO } from "../../types/enum/Dungeon"

export interface IRegionStatistic {
  name: DungeonPMDO
  count: number
  rank: number
  elo: number
  pokemons: string[]
}

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
export async function fetchMetaRegions(): Promise<IRegionStatistic[]> {
  return fetch("/meta/regions").then((res) => res.json())
}
