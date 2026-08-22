import { t } from "i18next"
import type Phaser from "phaser"
import type { GameObjects } from "phaser"
import pkg from "../../../../../package.json"
import { RegionDetails } from "../../../../config"
import { getMusicAlt } from "../../../../config/game/music"
import { getPkmWithCustom } from "../../../../models/colyseus-models/pokemon-customs"
import { DungeonMusic, type DungeonPMDO } from "../../../../types/enum/Dungeon"
import { getPortraitSrc } from "../../../../utils/avatar"
import { schemaValues } from "../../../../utils/schemas"
import atlas from "../../assets/atlas.json"
import { preloadMusic } from "../../pages/utils/audio"
import GameScene from "../scenes/game-scene"
import { loadCompressedAtlas } from "./pokemon"

export default class LoadingManager {
  scene: Phaser.Scene
  loadingBar: GameObjects.Container | null = null
  statusMessage: string
  preloadingPromise: Promise<void>

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.statusMessage = t("loading")

    this.scene.load.on("fileprogress", (file, percentComplete) => {
      this.statusMessage = t("loading_asset") + " " + file.key
    })

    this.scene.load.on("complete", () => {
      this.statusMessage = t("loading_complete")
    })

    this.preloadingPromise = this.preload()
  }

  async preload() {
    const scene = this.scene
    scene.load.xhr.timeout = 5000 // help avoiding failed loading of assets when server is overloaded

    scene.load.image("town_tileset", "/assets/tilesets/Town/tileset.png")
    scene.load.tilemapTiledJSON("town", "/assets/tilesets/Town/town.json")
    preloadMusic(scene, getMusicAlt(DungeonMusic.TREASURE_TOWN_STAGE_0))
    preloadMusic(scene, getMusicAlt(DungeonMusic.TREASURE_TOWN_STAGE_10))
    preloadMusic(scene, getMusicAlt(DungeonMusic.TREASURE_TOWN_STAGE_20))
    preloadMusic(scene, DungeonMusic.CARNIVAL_LUDICOLO)

    scene.load.image("rain", "/assets/environment/rain.png")
    scene.load.image("sand", "/assets/environment/sand.png")
    scene.load.image("wind", "/assets/environment/wind.png")
    scene.load.image("smog", "/assets/environment/smog.png")
    scene.load.image("fog", "/assets/environment/fog.png")
    scene.load.image("sun", "/assets/environment/sun.png")
    scene.load.image("clouds", "/assets/environment/clouds.png")
    scene.load.image("distort", "/assets/environment/noise.png")
    loadMultiAtlas(
      scene,
      "snowflakes",
      "/assets/environment/snowflakes.json",
      "/assets/environment/"
    )

    scene.load.image("money", "/assets/icons/money.svg")
    scene.load.image("arrowDown", "/assets/ui/arrowDown.png")

    scene.load.spritesheet({
      key: "cell",
      url: "/assets/ui/cell.png",
      frameConfig: {
        frameWidth: 64,
        frameHeight: 64,
        startFrame: 0,
        endFrame: 23
      }
    })

    scene.load.spritesheet({
      key: "board_cell",
      url: "/assets/ui/board_cell.png",
      frameConfig: {
        frameWidth: 32,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 1
      }
    })

    for (const pack in atlas.packs) {
      loadMultiAtlas(
        scene,
        atlas.packs[pack].name,
        `/assets/${pack}/${atlas.packs[pack].name}.json?v=${pkg.assetsVersion}`,
        `/assets/${pack}/`
      )
    }

    loadEnvironmentMultiAtlas(this.scene)

    if (scene instanceof GameScene) {
      const players = schemaValues(scene.room?.state.players!)
      const player = scene.getPlayerToSpectate()! // must match what startGame plays, or the music isn't preloaded
      await scene.preloadMaps(
        players
          .map((p) => p.map)
          .filter<DungeonPMDO>((map): map is DungeonPMDO => map !== "town")
      )
      preloadMusic(scene, RegionDetails[player.map].music)
    }

    // load missingno as default pokemon texture if not found
    loadCompressedAtlas(scene, "0000")

    if (scene instanceof GameScene) {
      await new Promise<void>((resolve) => {
        // start another Phaser loading queue after the fetch requests of preloadMaps have been awaited
        scene.load.once("complete", () => resolve())
        scene.load.start()
      })
    }
  }
}

// phaser's duplicate-key check covers only the multiatlas json file, and the texture files it
// references are queued on the fly; a replay seek re-running preload would re-download every
// texture and error re-adding it
function loadMultiAtlas(
  scene: Phaser.Scene,
  key: string,
  url: string,
  path: string
) {
  if (!scene.textures.exists(key)) scene.load.multiatlas(key, url, path)
}

export function loadEnvironmentMultiAtlas(scene: Phaser.Scene) {
  loadMultiAtlas(
    scene,
    "portal",
    "/assets/environment/portal.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "chest",
    "/assets/environment/chest.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "shine",
    "/assets/environment/shine.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "berry_trees",
    "/assets/environment/berry_trees.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "flower_pots",
    "/assets/environment/flower_pots.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "ground_holes",
    "/assets/environment/ground_holes.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "loading_pokeball",
    "/assets/environment/loading_pokeball.json",
    "/assets/environment/"
  )
  loadMultiAtlas(
    scene,
    "training_bag",
    "/assets/environment/training_bag.json",
    "/assets/environment/"
  )
}

const portraitLoadingRequests = new Map<string, Promise<boolean>>()

export function loadPortrait(
  scene: GameScene,
  index: string
): Promise<boolean> {
  const key = `portrait-${index}`
  if (scene.textures.exists(key)) return Promise.resolve(true)
  const pending = portraitLoadingRequests.get(key)
  if (pending) return pending

  const request = new Promise<boolean>((resolve) => {
    scene.load.once("complete", () => {
      portraitLoadingRequests.delete(key)
      resolve(scene.textures.exists(key)) // false if the file failed to load
    })
    const roster = scene.room?.state.players
    const players = roster ? schemaValues(roster) : []
    const player = players.find((p) => p.id === scene.uid) ?? players[0]
    const pokemonCustom = getPkmWithCustom(index, player?.pokemonCustoms)
    scene.load
      .image(
        key,
        getPortraitSrc(index, pokemonCustom.shiny, pokemonCustom.emotion)
      )
      .start()
  })

  portraitLoadingRequests.set(key, request)
  return request
}
