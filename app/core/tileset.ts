import { readJsonSync } from "fs-extra"
import {
  DTEF_TILESET_WIDTH,
  DtefTileset,
  Mask,
  MaskCoordinate,
  TerrainType,
  TilesetExchangeFile
} from "../types/Config"
import { DungeonPMDO } from "../types/enum/Dungeon"
import { logger } from "../utils/logger"
import { pickRandomIn } from "../utils/random"
import { TileMapping } from "./design"

export type TilesetTiled = {
  image: string
  firstgid: number
  columns: number
  tileheight: number
  tilewidth: number
  tiles?: AnimationTiled[]
  imageheight: number
  imagewidth: number
  margin: number
  spacing: number
  name: string
  tilecount: number
}

export type LayerTiled = {
  data: number[]
  height: number
  id: number
  name: string
  opacity: number
  type: string
  visible: boolean
  width: number
  x: number
  y: number
}

export type AnimationTiled = {
  animation: FrameTiled[]
  id: number
}

export type FrameTiled = {
  duration: number
  tileid: number
}

const src = "app/public/dist/client/assets/tilesets"

export default class Tileset {
  id: DungeonPMDO
  metadata: TilesetExchangeFile

  constructor(id: DungeonPMDO) {
    this.id = id
    if (!id) {
      logger.error("Invalid dungeon ID provided to Tileset constructor", { id })
      throw new Error("Invalid dungeon ID provided to Tileset constructor")
    }
    this.metadata = readJsonSync(`${src}/${this.id}/metadata.json`)
  }

  getTilemapId(terrain: TerrainType, mask: Mask): TileMapping[] {
    const mappedTile = new Array<TileMapping>()
    const possibleStaticVariations = this.getPossibleStaticVariations(
      terrain,
      mask
    )
    const chosenStaticVariation =
      Math.random() > 0.8
        ? pickRandomIn(possibleStaticVariations)
        : possibleStaticVariations[0]

    mappedTile.push(chosenStaticVariation)
    const animatedVariations = this.getAnimatedVariation(
      chosenStaticVariation.layerId,
      terrain,
      mask
    )
    animatedVariations.forEach((anim) => mappedTile.push(anim))
    return mappedTile
  }

  getAnimatedVariation(
    layerId: string,
    terrain: TerrainType,
    mask: Mask
  ): TileMapping[] {
    const mappedAnimations = new Array<TileMapping>()
    if (Object.keys(this.metadata).includes(layerId)) {
      ;(this.metadata[layerId] as DtefTileset).animation.forEach(
        (animatedFrame) => {
          if (animatedFrame.maskDefinition[terrain].includes(mask)) {
            mappedAnimations.push({
              id: getTileId(terrain, mask, animatedFrame.firstgid),
              layerId: animatedFrame.name
            })
          }
        }
      )
    } else {
      logger.warn("error with layer id", layerId)
    }

    return mappedAnimations
  }

  getPossibleStaticVariations(terrain: TerrainType, mask: Mask) {
    const possibleStaticVariations = new Array<TileMapping>()
    ;[
      this.metadata.tileset_0,
      this.metadata.tileset_1,
      this.metadata.tileset_2
    ].forEach((metadata) => {
      if (metadata) {
        const possibleVariation = this.getPossibleStaticVariation(
          terrain,
          mask,
          metadata
        )
        possibleVariation && possibleStaticVariations.push(possibleVariation)
      }
    })
    return possibleStaticVariations
  }

  getPossibleStaticVariation(
    terrain: TerrainType,
    mask: Mask,
    dtef: DtefTileset
  ): TileMapping | undefined {
    return dtef.static.maskDefinition[terrain].includes(mask)
      ? ({
          id: getTileId(terrain, mask, dtef.static.firstgid),
          layerId: dtef.static.name
        } as TileMapping)
      : undefined
  }

  exportToTiled() {
    const tilesets = new Array<TilesetTiled>()
    for (let i = 0; i < 3; i++) {
      const t = this.metadata[`tileset_${i}`] as DtefTileset
      tilesets.push(readJsonSync(`${src}/${this.id}/${t.static.name}.json`))
      t.animation.forEach((animatedFrame) => {
        tilesets.push(
          readJsonSync(`${src}/${this.id}/${animatedFrame.name}.json`)
        )
      })
    }
    return tilesets
  }
}

export function getTileId(terrain: TerrainType, mask: Mask, firstGid: number) {
  const maskCoordinate = MaskCoordinate[mask]
  const pixelX = maskCoordinate.x + terrain * DTEF_TILESET_WIDTH
  const pixelY = maskCoordinate.y
  return pixelY * DTEF_TILESET_WIDTH * 3 + pixelX + firstGid
}
