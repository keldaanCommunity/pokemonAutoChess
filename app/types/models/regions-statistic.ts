import { DungeonPMDO } from "../enum/Dungeon"

export interface IRegionStatistic {
  name: DungeonPMDO
  count: number
  rank: number
  elo: number
  pokemons: string[]
}
