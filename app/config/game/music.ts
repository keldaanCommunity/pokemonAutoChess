import { DungeonMusic } from "../../types/enum/Dungeon"

const alt = new Date().getHours() % 2 === 0

export function getMusicAlt(music: DungeonMusic): DungeonMusic {
  switch (music) {
    case DungeonMusic.TREASURE_TOWN_STAGE_0:
    case DungeonMusic.TREASURE_TOWN_STAGE_10:
    case DungeonMusic.TREASURE_TOWN_STAGE_20:
      return alt ? (`${music} alt` as DungeonMusic) : music
    default:
      return music
  }
}
