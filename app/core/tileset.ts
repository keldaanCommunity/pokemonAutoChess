import Jimp from "jimp"
import {
  Dungeon,
  DungeonData,
  Header,
  MaskCoordinate,
  Mask,
  TerrainType
} from "../types/Config"
import { pickRandomIn } from "../utils/random"

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

export default class Tileset {
  id: Dungeon
  headers: Header[]
  img: any
  ground: Map<Mask, number[]> = new Map()
  groundAlt: Map<Mask, number[]> = new Map()
  water: Map<Mask, number[]> = new Map()
  wall: Map<Mask, number[]> = new Map()
  wallAlt: Map<Mask, number[]> = new Map()

  constructor(id: Dungeon) {
    this.id = id
    this.headers = DungeonData[id].tileset
  }

  async initialize() {
    this.img = await Jimp.read(
      process.env.NODE_APP_INSTANCE
        ? `../../client/assets/tilesets/${this.id}.png`
        : `app/public/dist/client/assets/tilesets/${this.id}.png`
    )
    this.computeMapping()
  }

  computeMapping() {
    ;(Object.values(Mask) as Mask[]).forEach((v) => {
      this.ground.set(v, [this.getId(v, Header.GROUND)])
      this.water.set(v, [this.getId(v, Header.WATER)])
      this.wall.set(v, [this.getId(v, Header.WALL)])
      ;[
        Header.GROUND_ALT_1,
        Header.GROUND_ALT_2,
        Header.GROUND_ALT_3,
        Header.GROUND_ALT_4
      ].forEach((h) => {
        if (this.headers.includes(h) && this.isPixelValue(v, h)) {
          const t = this.groundAlt.get(v)
          if (t) {
            this.groundAlt.set(v, t.concat([this.getId(v, h)]))
          } else {
            this.groundAlt.set(v, [this.getId(v, h)])
          }
        }
      })
      ;[Header.WALL_ALT_1, Header.WALL_ALT_2, Header.WALL_ALT_3].forEach(
        (h) => {
          if (this.headers.includes(h) && this.isPixelValue(v, h)) {
            const t = this.wallAlt.get(v)
            if (t) {
              this.wallAlt.set(v, t.concat([this.getId(v, h)]))
            } else {
              this.wallAlt.set(v, [this.getId(v, h)])
            }
          }
        }
      )
    })
  }

  getId(maskId: Mask, header: Header) {
    let headerIndex = this.headers.indexOf(header)
    if (headerIndex == -1) {
      headerIndex = this.headers.indexOf(Header.ABYSS)
    }
    const maskCoordinate = MaskCoordinate[maskId]
    const x = maskCoordinate.x + headerIndex * 3
    const y = maskCoordinate.y
    return y * this.headers.length * 3 + x + 1
  }

  isPixelValue(maskId: Mask, header: Header) {
    const headerIndex = this.headers.indexOf(header)
    const maskCoordinate = MaskCoordinate[maskId]
    const pixelX = maskCoordinate.x + headerIndex * 3
    const pixelY = maskCoordinate.y
    return (
      Jimp.intToRGBA(this.img.getPixelColor(pixelX * 25 + 12, pixelY * 25 + 12))
        .a != 0
    )
  }

  getTilemapId(terrain: TerrainType, maskId: Mask): number {
    // logger.debug({ terrain, maskId });
    let items
    switch (terrain) {
      case TerrainType.GROUND:
        items = this.groundAlt.get(maskId)
        // logger.debug({ items });
        if (items && items.length > 0) {
          if (Math.random() > 0.8) {
            return pickRandomIn(items)
          } else {
            return this.ground.get(maskId)![0]
          }
        } else {
          return this.ground.get(maskId)![0]
        }
      case TerrainType.WATER:
        return this.water.get(maskId)![0]

      case TerrainType.WALL:
        items = this.wallAlt.get(maskId)
        // logger.debug({ items });
        if (items && items.length > 0) {
          if (Math.random() > 0.8) {
            return pickRandomIn(items)
          } else {
            return this.wall.get(maskId)![0]
          }
        } else {
          return this.wall.get(maskId)![0]
        }
    }
  }

  exportToTiled() {
    return {
      columns: this.headers.length * 3,
      firstgid: 1,
      image: `assets/tilesets/${this.id}.png`,
      imageheight: 601,
      imagewidth: 3 * this.headers.length * 25 + 1,
      margin: 1,
      name: this.id,
      spacing: 1,
      tilecount: 3 * this.headers.length * 24,
      tileheight: 24,
      tilewidth: 24
    } as TilesetTiled
  }
}
