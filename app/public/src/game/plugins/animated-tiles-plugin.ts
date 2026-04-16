import Phaser from "phaser"

type LayerTiles = Phaser.Tilemaps.Tile[]

interface AnimatedFrame {
  duration: number
  tileid: number
}

interface AnimatedTileData {
  index: number
  frames: AnimatedFrame[]
  currentFrame: number
  tiles: LayerTiles[]
  rate: number
  next: number
}

interface AnimatedMapData {
  map: Phaser.Tilemaps.Tilemap
  animatedTiles: AnimatedTileData[]
  active: boolean
  rate: number
  activeLayer: boolean[]
}

export default class AnimatedTilesPlugin extends Phaser.Plugins.ScenePlugin {
  private animatedTiles: AnimatedMapData[] = []
  private rate = 1
  private active = false
  private activeLayer: boolean[] = []
  followTimeScale = true

  constructor(
    scene: Phaser.Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string
  ) {
    super(scene, pluginManager, pluginKey)

    const systems = scene.sys
    if (systems.settings.isBooted) {
      this.boot()
    } else {
      systems.events.once("boot", this.boot, this)
    }
  }

  boot() {
    if (!this.systems) return

    const eventEmitter = this.systems.events
    eventEmitter.on("postupdate", this.postUpdate, this)
    eventEmitter.on("shutdown", this.shutdown, this)
    eventEmitter.on("destroy", this.destroy, this)
  }

  init(map: Phaser.Tilemaps.Tilemap) {
    const mapAnimData: AnimatedMapData = {
      map,
      animatedTiles: this.getAnimatedTiles(map),
      active: true,
      rate: 1,
      activeLayer: map.layers.map(() => true)
    }

    this.animatedTiles.push(mapAnimData)

    if (this.animatedTiles.length === 1) {
      this.active = true
    }
  }

  setRate(
    rate: number,
    gid: number | null = null,
    mapIndex: number | null = null
  ) {
    if (gid == null) {
      if (mapIndex == null) {
        this.rate = rate
      } else {
        this.animatedTiles[mapIndex].rate = rate
      }
      return
    }

    const applyRate = (tileDataList: AnimatedTileData[]) => {
      tileDataList.forEach((tileData) => {
        if (tileData.index === gid) {
          tileData.rate = rate
        }
      })
    }

    if (mapIndex == null) {
      this.animatedTiles.forEach((mapData) => applyRate(mapData.animatedTiles))
    } else {
      applyRate(this.animatedTiles[mapIndex].animatedTiles)
    }
  }

  resetRates(mapIndex: number | null = null) {
    if (mapIndex == null) {
      this.rate = 1
      this.animatedTiles.forEach((mapAnimData) => {
        mapAnimData.rate = 1
        mapAnimData.animatedTiles.forEach((tileAnimData) => {
          tileAnimData.rate = 1
        })
      })
      return
    }

    this.animatedTiles[mapIndex].rate = 1
    this.animatedTiles[mapIndex].animatedTiles.forEach((tileAnimData) => {
      tileAnimData.rate = 1
    })
  }

  resume(layerIndex: number | null = null, mapIndex: number | null = null) {
    if (mapIndex == null) {
      if (layerIndex == null) {
        this.active = true
        return
      }

      this.activeLayer[layerIndex] = true
      this.animatedTiles.forEach((mapData) => {
        mapData.animatedTiles.forEach((animatedTile) => {
          this.updateLayer(animatedTile, animatedTile.tiles[layerIndex])
        })
      })
      return
    }

    const mapData = this.animatedTiles[mapIndex]
    if (!mapData) return

    if (layerIndex == null) {
      mapData.active = true
      return
    }

    mapData.activeLayer[layerIndex] = true
    mapData.animatedTiles.forEach((animatedTile) => {
      this.updateLayer(animatedTile, animatedTile.tiles[layerIndex])
    })
  }

  pause(layerIndex: number | null = null, mapIndex: number | null = null) {
    if (mapIndex == null) {
      if (layerIndex == null) {
        this.active = false
        return
      }

      this.activeLayer[layerIndex] = false
      return
    }

    const mapData = this.animatedTiles[mapIndex]
    if (!mapData) return

    if (layerIndex == null) {
      mapData.active = false
      return
    }

    mapData.activeLayer[layerIndex] = false
  }

  postUpdate(_time: number, delta: number) {
    const scene = this.scene
    if (!scene || !this.active) return

    const globalElapsedTime =
      delta * this.rate * (this.followTimeScale ? scene.time.timeScale : 1)

    this.animatedTiles.forEach((mapAnimData) => {
      if (!mapAnimData.active) return

      const elapsedTime = globalElapsedTime * mapAnimData.rate

      mapAnimData.animatedTiles.forEach((animatedTile) => {
        animatedTile.next -= elapsedTime * animatedTile.rate

        if (animatedTile.next >= 0) return

        const currentIndex = animatedTile.currentFrame
        const oldTileId = animatedTile.frames[currentIndex]?.tileid
        if (!oldTileId) return

        let newIndex = currentIndex + 1
        if (newIndex > animatedTile.frames.length - 1) {
          newIndex = 0
        }

        animatedTile.next = animatedTile.frames[newIndex].duration
        animatedTile.currentFrame = newIndex

        animatedTile.tiles.forEach((layerTiles, layerIndex) => {
          if (!mapAnimData.activeLayer[layerIndex]) return
          this.updateLayer(animatedTile, layerTiles, oldTileId)
        })
      })
    })
  }

  private updateLayer(
    animatedTile: AnimatedTileData,
    layerTiles: LayerTiles,
    oldTileId = -1
  ) {
    const tilesToRemove: Phaser.Tilemaps.Tile[] = []
    const tileId = animatedTile.frames[animatedTile.currentFrame].tileid

    layerTiles.forEach((tile) => {
      if (oldTileId > -1 && (!tile || tile.index !== oldTileId)) {
        tilesToRemove.push(tile)
      } else {
        tile.index = tileId
      }
    })

    tilesToRemove.forEach((tile) => {
      const pos = layerTiles.indexOf(tile)
      if (pos > -1) {
        layerTiles.splice(pos, 1)
      }
    })
  }

  shutdown() {
    this.animatedTiles.length = 0
  }

  destroy() {
    this.shutdown()
    super.destroy()
  }

  private getAnimatedTiles(map: Phaser.Tilemaps.Tilemap): AnimatedTileData[] {
    const animatedTiles: AnimatedTileData[] = []

    map.tilesets.forEach((tileset) => {
      const tileData = tileset.tileData as Record<string, any>

      Object.keys(tileData).forEach((key) => {
        const index = Number.parseInt(key, 10)
        const entry = tileData[key]

        if (
          !entry ||
          !Object.prototype.hasOwnProperty.call(entry, "animation")
        ) {
          return
        }

        const frames: AnimatedFrame[] = entry.animation.map(
          (frameData: any) => ({
            duration: frameData.duration,
            tileid: frameData.tileid + tileset.firstgid
          })
        )

        const startGid = index + tileset.firstgid
        const currentFrame = Math.max(
          0,
          frames.findIndex((frame) => frame.tileid === startGid)
        )

        const tileAnimData: AnimatedTileData = {
          index: startGid,
          frames,
          currentFrame,
          tiles: [],
          rate: 1,
          next: frames[0]?.duration ?? 0
        }

        map.layers.forEach((layer) => {
          const layerTiles: Phaser.Tilemaps.Tile[] = []

          layer.data.forEach((tileRow) => {
            tileRow.forEach((tile) => {
              if (tile && tile.index - tileset.firstgid === index) {
                layerTiles.push(tile)
              }
            })
          })

          tileAnimData.tiles.push(layerTiles)
        })

        animatedTiles.push(tileAnimData)
      })
    })

    map.layers.forEach((_layer, layerIndex) => {
      this.activeLayer[layerIndex] = true
    })

    return animatedTiles
  }

  updateAnimatedTiles() {
    this.animatedTiles.forEach((mapAnimData) => {
      mapAnimData.animatedTiles.forEach((tileAnimData) => {
        tileAnimData.tiles.forEach((tiles, layerIndex) => {
          const layer = mapAnimData.map.layers[layerIndex]
          const data = layer.data

          for (let row = 0; row < data.length; row += 1) {
            for (let col = 0; col < data[row].length; col += 1) {
              const tile = data[row][col]
              if (!tile) continue

              if (tile.index === tileAnimData.index) {
                if (tiles.indexOf(tile) === -1) {
                  tiles.push(tile)
                }
                tile.index =
                  tileAnimData.frames[tileAnimData.currentFrame].tileid
              }
            }
          }
        })
      })
    })
  }
}
