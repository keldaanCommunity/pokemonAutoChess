import Jimp from "jimp"
import {
  MaskCoordinate,
  Mask,
  TerrainType,
  DungeonPMDO,
  TilesetExchangeFile,
  DtefTileset,
  DTEF_TILESET_HEIGHT,
  DTEF_TILESET_WIDTH
} from "../types/Config"
import { pickRandomIn } from "../utils/random"
import { readFile, readJSONSync } from "fs-extra"
import { TileMapping } from "./design"
import { get } from "mongoose"

export type TilesetTiled = {
  columns: number
  firstgid: number
  image: string
  imageheight: number
  imagewidth: number
  margin: number
  name: string
  spacing: number
  tilecount: number
  tileheight: number
  tilewidth: number
  tiles?: AnimationTiled[]
}

export type AnimationTiled = {
  animation: FrameTiled[]
  id: number
}

export type FrameTiled = {
  duration: number
  tileid: number
}

const src = process.env.NODE_APP_INSTANCE
  ? "../../client/assets/tilesets"
  : "app/public/dist/client/assets/tilesets"

export default class Tileset {
  id: DungeonPMDO
  metadata: TilesetExchangeFile

  constructor(id: DungeonPMDO) {
    this.id = id
    this.metadata = readJSONSync(`${src}/${this.id}/metadata.json`)
  }

  getTilemapId(terrain: TerrainType, maskId: Mask): TileMapping[] {
    const mappedTile = new Array<TileMapping>()
    const variations = this.variations.get(terrain)?.get(maskId)
    if (variations) {
      if (Math.random() > 0.8) {
        const chosen = variations[0]
        mappedTile.push(chosen.static)
        chosen.animated.forEach((t) => mappedTile.push(t))
      } else {
        const chosen = pickRandomIn(variations)
        mappedTile.push(chosen.static)
        chosen.animated.forEach((t) => mappedTile.push(t))
      }
    }
    return mappedTile
  }

  exportToTiled() {
    const tilesets = new Array<{ firstgid: number; source: string }>()
    for (let i = 0; i < 3; i++) {
      const t = this.metadata[`tileset_${i}`] as DtefTileset
      tilesets.push({
        firstgid: t.static.firstgid,
        source: `${t.static.name}.json`
      })
      t.animation.forEach((animatedFrame) => {
        tilesets.push({
          firstgid: animatedFrame.firstgid,
          source: `${animatedFrame.name}.json`
        })
      })
    }
    return tilesets
  }
}

export function getTileId(
  terrain: TerrainType,
  mask: Mask,
  frameNumber?: number
) {
  const maskCoordinate = MaskCoordinate[mask]
  const frameshift = frameNumber ? frameNumber : 0
  const pixelX = maskCoordinate.x + terrain * DTEF_TILESET_WIDTH
  const pixelY = maskCoordinate.y + frameshift * DTEF_TILESET_HEIGHT
  return pixelY * DTEF_TILESET_WIDTH * 3 + pixelX
}
