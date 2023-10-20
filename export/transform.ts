import { mkdir, readFile, writeFile } from "fs-extra"
import { readdir } from "fs/promises"
import Jimp from "jimp"
import { Mask, MaskCoordinate, TerrainType } from "../app/types/Config"
import dungeons from "./dungeons.json"

const PMDO_EXPORT_DIRECTORY = "./dbg_output_pmdo_full_ani"
export const DTEF_WIDTH = 144
export const DTEF_HEIGHT = 192
export const DTEF_TILESET_TILE_WIDTH = 24

type TilesetExchangeFile = {
  tileset_0: DtefTileset | undefined
  tiletset_1: DtefTileset | undefined
  tileset_2: DtefTileset | undefined
}

type DtefTileset = {
  static: StaticFrame
  animation: AnimatedFrame[]
}

type StaticFrame = {
  name: string
  maskDefinition: MaskDefinition
}

type MaskDefinition = {
  [TerrainType.GROUND]: Mask[]
  [TerrainType.WALL]: Mask[]
  [TerrainType.WATER]: Mask[]
}

type AnimatedFrame = {
  frameDuration: number
  numberOfFrames: number
  name: string
  maskDefinition: MaskDefinition
}

async function getDirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

async function getTilesets(source, filter?: string) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((file) => file.isFile() && file.name.includes("frame"))
    .filter((file) => (filter ? file.name.includes(filter) : true))
    .map((dirent) => dirent.name)
}

/**
 * Used to create dungeon enum
 */
async function createDungeonsEnum() {
  const directories = await getDirectories(PMDO_EXPORT_DIRECTORY)
  const dungeons = {}
  directories.forEach((v) => (dungeons[v] = v))
  await writeFile("dungeons.json", JSON.stringify(dungeons, null, 2))
}

async function main() {
  await createDungeonsEnum()
  //   for (let i = 0; i < Object.values(dungeons).length; i++) {
  //     const dungeon = Object.values(dungeons)[i]
  //     await createTilesheets(dungeon)
  //   }
  await createTilesheets("ChasmCave1")
}

async function createTilesheets(dungeon: string) {
  console.log(`Creating mega tileset ${dungeon} ...`)
  const src = `${PMDO_EXPORT_DIRECTORY}/${dungeon}`

  await mkdir(`tilesets/${dungeon}`, { recursive: true })

  const tilesetExchangeFile: TilesetExchangeFile = {
    tileset_0: undefined,
    tiletset_1: undefined,
    tileset_2: undefined
  }

  // for each tileset, detect the number of frames
  for (let i = 0; i < 3; i++) {
    const staticTileset = await Jimp.read(`${src}/tileset_${i}.png`)
    await staticTileset.writeAsync(`tilesets/${dungeon}/tileset_${i}.png`)

    tilesetExchangeFile[`tileset_${i}`] = {
      static: {
        name: `tileset_${i}`,
        maskDefinition: getMaskDefinition(staticTileset)
      },
      animation: await getAnimatedFrames(dungeon, src, `tileset_${i}`)
    } as DtefTileset
  }
  await writeFile(
    `tilesets/${dungeon}/metadata.json`,
    JSON.stringify(tilesetExchangeFile, null, 2)
  )
}

function getMaskDefinition(picture: Jimp) {
  const definition = {
    [TerrainType.WALL]: new Array<Mask>(),
    [TerrainType.WATER]: new Array<Mask>(),
    [TerrainType.GROUND]: new Array<Mask>()
  }
  ;[(TerrainType.WALL, TerrainType.WATER, TerrainType.GROUND)].forEach(
    (terrain) => {
      Object.values(Mask).forEach((mask) => {
        if (isPixelValue(picture, mask, terrain)) {
          definition[terrain].push(mask)
        }
      })
    }
  )
  return definition
}

async function getAnimatedFrames(
  dungeon: string,
  src: string,
  tilesetName: string
) {
  const animatedFrames = new Array<AnimatedFrame>()
  const isStaticTileset =
    (await getTilesets(src, `${tilesetName}_frame`)).length === 0
  if (!isStaticTileset) {
    let j = 0
    while ((await getTilesets(src, `${tilesetName}_frame${j}`)).length > 0) {
      const frames = await getTilesets(src, `${tilesetName}_frame${j}`)

      const megaTileset = new Jimp(DTEF_WIDTH * 3, DTEF_HEIGHT * frames.length)
      const frameDuration = frames[0].split(".")[1]
      for (let k = 0; k < frames.length; k++) {
        const picture = await Jimp.read(`${src}/${frames[k]}`)
        megaTileset.blit(picture, 0, DTEF_HEIGHT * k)
      }
      await megaTileset.writeAsync(
        `tilesets/${dungeon}/${tilesetName}_frame${j}.png`
      )
      animatedFrames.push({
        frameDuration: parseInt(frameDuration),
        numberOfFrames: frames.length,
        name: `${tilesetName}_frame${j}.png`,
        maskDefinition: getMaskDefinition(megaTileset)
      })
      j++
    }
  }
  return animatedFrames
}

function isPixelValue(picutre: Jimp, maskId: Mask, terrain: TerrainType) {
  const maskCoordinate = MaskCoordinate[maskId]
  const pixelX = maskCoordinate.x + terrain * 6
  const pixelY = maskCoordinate.y
  let exist = true
  for (let i = 0; i < DTEF_TILESET_TILE_WIDTH; i++) {
    for (let j = 0; j < DTEF_TILESET_TILE_WIDTH; j++) {
      if (
        Jimp.intToRGBA(
          picutre.getPixelColor(
            pixelX * DTEF_TILESET_TILE_WIDTH + i,
            pixelY * DTEF_TILESET_TILE_WIDTH + j
          )
        ).a != 0
      ) {
        exist = true
        break
      }
    }
  }
  return exist
}

main()
