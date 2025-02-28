import { t } from "i18next"
import { GameObjects } from "phaser"
import AnimatedTiles from "phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js"
import pkg from "../../../../../package.json"
import { DungeonDetails, DungeonPMDO } from "../../../../types/enum/Dungeon"
import { values } from "../../../../utils/schemas"
import indexList from "../../../src/assets/pokemons/indexList.json"
import atlas from "../../assets/atlas.json"
import { preloadMusic } from "../../pages/utils/audio"
import { getPortraitSrc } from "../../../../utils/avatar"
import GameScene from "../scenes/game-scene"

export default class LoadingManager {
  scene: Phaser.Scene
  loadingBar: GameObjects.Container | null = null
  statusMessage: string

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.statusMessage = t("loading")

    this.scene.load.on("fileprogress", (file, percentComplete) => {
      if (percentComplete < 1) {
        this.statusMessage = t("loading_asset") + " " + file.key
      }
    })

    this.scene.load.on("complete", () => {
      this.statusMessage = t("loading_complete")
    })

    this.preload()
  }

  async preload() {
    const scene = this.scene
    scene.load.xhr.timeout = 5000 // help avoiding failed loading of assets when server is overloaded
    scene.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    )
    scene.load.json("pokemons-atlas", `/assets/pokemons.json?v=${pkg.version}`)
    scene.load.once(
      "filecomplete-json-pokemons-atlas",
      (key, type, compressedAtlas) => {
        for (const image in compressedAtlas) {
          const data = compressedAtlas[image]

          function traverse(obj: any, path: string, frames) {
            if (Array.isArray(obj)) {
              const [
                sourceSizew,
                sourceSizeh,
                spriteSourceSizex,
                spriteSourceSizey,
                spriteSourceSizew,
                spriteSourceSizeh,
                framex,
                framey,
                framew,
                frameh
              ] = obj
              frames.push({
                filename: path,
                rotated: false,
                trimmed: true,
                sourceSize: {
                  w: sourceSizew,
                  h: sourceSizeh
                },
                spriteSourceSize: {
                  x: spriteSourceSizex,
                  y: spriteSourceSizey,
                  w: spriteSourceSizew,
                  h: spriteSourceSizeh
                },
                frame: {
                  x: framex,
                  y: framey,
                  w: framew,
                  h: frameh
                }
              })
            } else if (obj instanceof Object) {
              for (const key in obj) {
                traverse(obj[key], path ? path + "/" + key : key, frames)
              }
            }
          }
          const frames = []

          traverse(data.a, "", frames)

          const multiatlas = {
            textures: [
              {
                image: image,
                format: "RGBA8888",
                size: {
                  w: data.s[0],
                  h: data.s[1]
                },
                scale: data.s[2] ?? 1,
                frames
              }
            ]
          }

          const index = image.replace(".png", "")
          //console.log("load multiatlas " + index)
          // @ts-ignore: there is an error in phaser types, the second parameter can be an object
          scene.load.multiatlas(index, multiatlas, "/assets/pokemons")
        }
      }
    )

    indexList.forEach((id) => {
      scene.load.image(`portrait-${id}`, getPortraitSrc(id))
      /*scene.load.multiatlas(
        id,
        `/assets/pokemons/${id}.json`,
        "/assets/pokemons"
      )*/
    })

    if (scene instanceof GameScene) {
      const players = values(scene.room?.state.players!)
      const player = players.find((p) => p.id === scene.uid) ?? players[0]
      await scene.preloadMaps(
        players
          .map((p) => p.map)
          .filter<DungeonPMDO>((map): map is DungeonPMDO => map !== "town")
      )
      preloadMusic(scene, DungeonDetails[player.map].music)
    }

    scene.load.image("town_tileset", "/assets/tilesets/Town/tileset.png")
    scene.load.tilemapTiledJSON("town", "/assets/tilesets/Town/town.json")
    preloadMusic(scene, DungeonDetails.town.music)
    scene.load.audio("music_town1", [`assets/musics/ogg/town1.ogg`])
    scene.load.audio("music_town2", [`assets/musics/ogg/town2.ogg`])
    scene.load.audio("music_town3", [`assets/musics/ogg/town3.ogg`])

    scene.load.image("rain", "/assets/ui/rain.png")
    scene.load.image("sand", "/assets/ui/sand.png")
    scene.load.image("wind", "/assets/ui/wind.png")
    scene.load.image("smog", "/assets/ui/smog.png")
    scene.load.image("sun", "/assets/ui/sun.png")
    scene.load.image("clouds", "/assets/ui/clouds.png")
    scene.load.multiatlas(
      "snowflakes",
      "/assets/ui/snowflakes.json",
      "/assets/ui/"
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

    for (const pack in atlas.packs) {
      scene.load.multiatlas(
        atlas.packs[pack].name,
        `/assets/${pack}/${atlas.packs[pack].name}-${pkg.version}.json`,
        `/assets/${pack}/`
      )
    }

    loadEnvironmentMultiAtlas(this.scene)
  }
}

export function loadEnvironmentMultiAtlas(scene: Phaser.Scene) {
  scene.load.multiatlas(
    "portal",
    "/assets/environment/portal.json",
    "/assets/environment/"
  )
  scene.load.multiatlas(
    "chest",
    "/assets/environment/chest.json",
    "/assets/environment/"
  )
  scene.load.multiatlas(
    "shine",
    "/assets/environment/shine.json",
    "/assets/environment/"
  )
  scene.load.multiatlas(
    "berry_trees",
    "/assets/environment/berry_trees.json",
    "/assets/environment/"
  )
}
