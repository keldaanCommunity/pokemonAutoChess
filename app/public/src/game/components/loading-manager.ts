import { t } from "i18next"
import type Phaser from "phaser"
import type { GameObjects } from "phaser"
import pkg from "../../../../../package.json"
import { RegionDetails } from "../../../../config"
import { getMusicAlt } from "../../../../config/game/music"
import type Player from "../../../../models/colyseus-models/player"
import { getPkmWithCustom } from "../../../../models/colyseus-models/pokemon-customs"
import { DungeonMusic, type DungeonPMDO } from "../../../../types/enum/Dungeon"
import { PkmIndex } from "../../../../types/enum/Pokemon"
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

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.statusMessage = t("loading")

    this.scene.load.on("fileprogress", (file, percentComplete) => {
      this.statusMessage = t("loading_asset") + " " + file.key
    })

    this.scene.load.on("complete", () => {
      this.statusMessage = t("loading_complete")
    })

    this.preload()
  }

  async preload() {
    const scene = this.scene
    scene.load.xhr.timeout = 5000 // help avoiding failed loading of assets when server is overloaded

    // skip cached multiatlases; a replay seek re-preloads the same keys
    const multi = (key: string, url: string, path: string) => {
      if (!scene.textures.exists(key)) scene.load.multiatlas(key, url, path)
    }
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
    multi(
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
      multi(
        atlas.packs[pack].name,
        `/assets/${pack}/${atlas.packs[pack].name}.json?v=${pkg.assetsVersion}`,
        `/assets/${pack}/`
      )
    }

    loadEnvironmentMultiAtlas(this.scene)

    if (scene instanceof GameScene) {
      const players = schemaValues(scene.room?.state.players!)
      const player = players.find((p) => p.id === scene.uid) ?? players[0]
      await scene.preloadMaps(
        players
          .map((p) => p.map)
          .filter<DungeonPMDO>((map): map is DungeonPMDO => map !== "town")
      )
      preloadMusic(scene, RegionDetails[player.map].music)
      preloadPortraits(this.scene, player)
    }

    // load missingno as default pokemon texture if not found
    loadCompressedAtlas(scene, "0000")
  }
}

export function loadEnvironmentMultiAtlas(scene: Phaser.Scene) {
  // skip already cached atlases
  const multi = (key: string, url: string, path: string) => {
    if (!scene.textures.exists(key)) scene.load.multiatlas(key, url, path)
  }
  multi("portal", "/assets/environment/portal.json", "/assets/environment/")
  multi("chest", "/assets/environment/chest.json", "/assets/environment/")
  multi("shine", "/assets/environment/shine.json", "/assets/environment/")
  multi(
    "berry_trees",
    "/assets/environment/berry_trees.json?tempcacheburst=68", //TEMP
    "/assets/environment/"
  )
  multi(
    "flower_pots",
    "/assets/environment/flower_pots.json",
    "/assets/environment/"
  )
  multi(
    "ground_holes",
    "/assets/environment/ground_holes.json",
    "/assets/environment/"
  )
  multi(
    "loading_pokeball",
    "/assets/environment/loading_pokeball.json",
    "/assets/environment/"
  )
  multi(
    "training_bag",
    "/assets/environment/training_bag.json",
    "/assets/environment/"
  )
}

export function preloadPortraits(scene: Phaser.Scene, player: Player) {
  Object.values(PkmIndex).forEach((index) => {
    const pokemonCustom = getPkmWithCustom(index, player.pokemonCustoms)
    scene.load.image(
      `portrait-${index}`,
      getPortraitSrc(index, pokemonCustom.shiny, pokemonCustom.emotion)
    )
  })
}
