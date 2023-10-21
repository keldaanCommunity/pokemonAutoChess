import { mkdir, readFile, writeFile } from "fs-extra"
import { readdir } from "fs/promises"
import Jimp from "jimp"
import { Mask, MaskCoordinate, TerrainType } from "../app/types/Config"
import dungeons from "./dungeons.json"
import { AnimationTiled, FrameTiled, TilesetTiled } from "../app/core/tileset"

const PMDO_EXPORT_DIRECTORY = "C:/Users/arnau/Desktop/RawAsset/TileDtef"
export const DTEF_WIDTH = 144
export const DTEF_HEIGHT = 192
export const DTEF_TILESET_WIDTH = 6
export const DTEF_TILESET_HEIGHT = 8
export const DTEF_TILESET_TILE_WIDTH = 24

type TilesetExchangeFile = {
  tileset_0: DtefTileset | undefined
  tileset_1: DtefTileset | undefined
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
  await createTilesheets("AmpPlains")
}

async function createTilesheets(dungeon: string) {
  console.log(`Creating mega tileset ${dungeon} ...`)
  const src = `${PMDO_EXPORT_DIRECTORY}/${dungeon}`
  const newSrc = `tilesets/${dungeon}`

  await mkdir(newSrc, { recursive: true })

  const tilesetExchangeFile: TilesetExchangeFile = {
    tileset_0: undefined,
    tileset_1: undefined,
    tileset_2: undefined
  }

  // for each tileset, detect the number of frames
  for (let i = 0; i < 3; i++) {
    const staticTileset = await Jimp.read(`${src}/tileset_${i}.png`)
    await staticTileset.writeAsync(`${newSrc}/tileset_${i}.png`)

    tilesetExchangeFile[`tileset_${i}`] = {
      static: {
        name: `tileset_${i}`,
        maskDefinition: getMaskDefinition(staticTileset)
      },
      animation: await getAnimatedFrames(dungeon, src, `tileset_${i}`)
    } as DtefTileset
  }
  await writeFile(
    `${newSrc}/metadata.json`,
    JSON.stringify(tilesetExchangeFile, null, 2)
  )
  await createTilesetsTiled(newSrc, tilesetExchangeFile.tileset_0!)
  await createTilesetsTiled(newSrc, tilesetExchangeFile.tileset_1!)
  await createTilesetsTiled(newSrc, tilesetExchangeFile.tileset_2!)
}

async function createTilesetsTiled(src: string, dtefTileset: DtefTileset) {
  await createTilesetTiled(
    src,
    dtefTileset.static.name,
    await Jimp.read(`${src}/${dtefTileset.static.name}.png`),
    dtefTileset.static.maskDefinition
  )
  for (let i = 0; i < dtefTileset.animation.length; i++) {
    const anim = dtefTileset.animation[i]
    await createTilesetTiled(
      src,
      anim.name,
      await Jimp.read(`${src}/${anim.name}.png`),
      anim.maskDefinition,
      anim.frameDuration,
      anim.numberOfFrames
    )
  }
}

async function createTilesetTiled(
  src: string,
  name: string,
  picture: Jimp,
  maskDefinition: MaskDefinition,
  frameDuration?: number,
  numberOfFrames?: number
) {
  const tilesetTiled: TilesetTiled = {
    columns: picture.getWidth() / DTEF_TILESET_TILE_WIDTH,
    firstgid: 1,
    image: `${name}.png`,
    imageheight: picture.getHeight(),
    imagewidth: picture.getWidth(),
    margin: 0,
    name: name,
    spacing: 0,
    tilecount:
      (picture.getWidth() / DTEF_TILESET_TILE_WIDTH) *
      (picture.getHeight() / DTEF_TILESET_TILE_WIDTH),
    tileheight: DTEF_TILESET_TILE_WIDTH,
    tilewidth: DTEF_TILESET_TILE_WIDTH
  }

  if (frameDuration && numberOfFrames) {
    tilesetTiled["tiles"] = getAnimationsTiled(
      maskDefinition,
      frameDuration,
      numberOfFrames
    )
  }

  await writeFile(`${src}/${name}.json`, JSON.stringify(tilesetTiled, null, 2))
}

function getAnimationsTiled(
  maskDefinition: MaskDefinition,
  frameDuration: number,
  numberOfFrames: number
) {
  const animations = new Array<AnimationTiled>()
  for (let i = 0; i < 3; i++) {
    const terrain = i as TerrainType
    maskDefinition[terrain].forEach((mask) => {
      animations.push(
        getAnimationTiled(mask, terrain, frameDuration, numberOfFrames)
      )
    })
  }
  return animations
}

function getAnimationTiled(
  mask: Mask,
  terrain: TerrainType,
  frameDuration: number,
  numberOfFrames: number
) {
  const frames = new Array<FrameTiled>()
  for (let i = 0; i < numberOfFrames; i++) {
    frames.push({
      tileid: getTileId(terrain, mask, i),
      duration: (frameDuration * 1000) / 60
    })
  }
  return {
    animation: frames,
    id: getTileId(terrain, mask, 0)
  }
}

function getTileId(terrain: TerrainType, mask: Mask, frameNumber: number) {
  const maskCoordinate = MaskCoordinate[mask]
  const pixelX = maskCoordinate.x + terrain * DTEF_TILESET_WIDTH
  const pixelY = maskCoordinate.y + frameNumber * DTEF_TILESET_HEIGHT
  return pixelY * DTEF_TILESET_WIDTH * 3 + pixelX
}

function getMaskDefinition(picture: Jimp) {
  const definition = {
    [TerrainType.WALL]: new Array<Mask>(),
    [TerrainType.WATER]: new Array<Mask>(),
    [TerrainType.GROUND]: new Array<Mask>()
  }
  for (let i = 0; i < 3; i++) {
    const terrain = i as TerrainType
    // console.log("terrain", terrain)
    Object.values(Mask).forEach((mask) => {
      if (isPixelValue(picture, mask, terrain)) {
        definition[terrain].push(mask)
      }
    })
  }
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
        name: `${tilesetName}_frame${j}`,
        maskDefinition: getMaskDefinition(megaTileset)
      })
      j++
    }
  }
  return animatedFrames
}

function isPixelValue(picutre: Jimp, maskId: Mask, terrain: TerrainType) {
  const maskCoordinate = MaskCoordinate[maskId]
  const pixelX = maskCoordinate.x + terrain * DTEF_TILESET_WIDTH
  const pixelY = maskCoordinate.y
  // console.log("scanning ", maskId, pixelX, pixelY, terrain)
  let exist = false
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
