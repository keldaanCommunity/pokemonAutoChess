/* eslint-disable no-unsafe-optional-chaining */
import Jimp from "jimp"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import gracefulFs from "graceful-fs"
import { AnimationConfig, Pkm } from "../app/types/enum/Pokemon"
import PokemonFactory from "../app/models/pokemon-factory"
import {
  PokemonTint,
  SpriteType
} from "../app/types/enum/Game"
import { logger } from "../app/utils/logger"
import { AnimationType } from "../app/types/Animation"

gracefulFs.gracefulify(fs)
const args = process.argv.slice(2)
const path = args[0]
const specificIndexToSplit = args[1]

interface IPMDCollab {
  AnimData: IAnimData
}

interface IAnimData {
  ShadowSize: number
  Anims: {
    Anim: IAnim[]
  }
}

interface IAnim {
  Name: string
  Index: number
  FrameWidth: number
  FrameHeight: number
  Durations: IDuration
  CopyOf: string
}

interface IDuration {
  Duration: any
}

const mapName = new Map<string, string>()
mapName.set("0000", "missingno")

const pkmaIndexes = ["0000"]

Object.values(Pkm).forEach((pkm) => {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
  if (!pkmaIndexes.includes(pokemon.index)) {
    pkmaIndexes.push(pokemon.index)
    mapName.set(pokemon.index, pokemon.name)
  }
})

logger.debug(mapName)

// const credits = {};
const durations = {}
let missing = ""

async function splitAll() {
  for (let i = 0; i < pkmaIndexes.length; i++) {
    const index = pkmaIndexes[i]

    logger.debug(
      `${i}/${pkmaIndexes.length - 1} (${(
        (i * 100) /
        (pkmaIndexes.length - 1)
      ).toFixed(2)}%) #${index} ${mapName.get(index)}`
    )

    await splitIndex(index)
  }
}

export function loadDurationsFile() {
  const rawdata = fs.readFileSync(
    "../app/public/dist/client/assets/pokemons/durations.json",
    "utf8"
  )
  Object.assign(durations, JSON.parse(rawdata))
  logger.debug(
    `Loaded durations file, ${
      Object.keys(durations).length
    } durations already computed`
  )
}

export function saveDurationsFile() {
  const fileA = fs.createWriteStream("sheets/durations.json")
  fileA.on("error", function (err) {
    logger.error(err)
  })
  fileA.write(JSON.stringify(durations))
  fileA.end()
  logger.debug(
    `Saved durations file, ${Object.keys(durations).length} durations entries`
  )
}

export function saveMissingFiles() {
  const fileB = fs.createWriteStream("sheets/missing.txt")
  fileB.on("error", function (err) {
    logger.error(err)
  })
  fileB.write(missing)
  fileB.end()
}

function removeBlue(cropImg) {
  cropImg.scan(
    0,
    0,
    cropImg.bitmap.width,
    cropImg.bitmap.height,
    (x, y, idx) => {
      if (
        cropImg.bitmap.data[idx] == 0 &&
        cropImg.bitmap.data[idx + 1] == 0 &&
        cropImg.bitmap.data[idx + 2] != 0
      ) {
        cropImg.bitmap.data[idx] = 0
        cropImg.bitmap.data[idx + 1] = 0
        cropImg.bitmap.data[idx + 2] = 0
        cropImg.bitmap.data[idx + 3] = 0
      }
    }
  )
}

function removeRed(cropImg) {
  cropImg.scan(
    0,
    0,
    cropImg.bitmap.width,
    cropImg.bitmap.height,
    (x, y, idx) => {
      if (
        cropImg.bitmap.data[idx] != 0 &&
        cropImg.bitmap.data[idx + 1] == 0 &&
        cropImg.bitmap.data[idx + 2] == 0
      ) {
        cropImg.bitmap.data[idx] = 0
        cropImg.bitmap.data[idx + 1] = 0
        cropImg.bitmap.data[idx + 2] = 0
        cropImg.bitmap.data[idx + 3] = 0
      }
    }
  )
}

function zeroPad(num: number) {
  return ("0000" + num).slice(-4)
}

async function splitIndex(index: string) {
  const pathIndex = index.replace("-", "/")
  const shinyPad =
    pathIndex.length == 4 ? `${pathIndex}/0000/0001` : `${pathIndex}/0001`
  const allPads = [pathIndex, shinyPad]

  for (let j = 0; j < allPads.length; j++) {
    const pad = allPads[j]
    try {
      const shiny = pathIndex == pad ? PokemonTint.NORMAL : PokemonTint.SHINY
      const xmlFile = fs.readFileSync(`${path}/sprite/${pad}/AnimData.xml`)
      const parser = new XMLParser()
      const xmlData = <IPMDCollab>parser.parse(xmlFile)
      for (let k = 0; k < Object.values(SpriteType).length; k++) {
        const anim = Object.values(SpriteType)[k]
        const conf = mapName.get(index)

        const actions: AnimationType[] = [
          AnimationType.Idle,
          AnimationType.Walk,
          AnimationType.Sleep,
          AnimationType.Hop,
          AnimationType.Hurt
        ]

        if (conf && AnimationConfig[conf]) {
          if (!actions.includes(AnimationConfig[conf as Pkm].attack)) {
            actions.push(AnimationConfig[conf as Pkm].attack)
          }
          if (!actions.includes(AnimationConfig[conf as Pkm].ability)) {
            actions.push(AnimationConfig[conf as Pkm].ability)
          }
        } else {
          actions.push(AnimationType.Attack)
        }

        for (let l = 0; l < actions.length; l++) {
          const action = actions[l]
          try {
            let img
            let metadata = xmlData.AnimData.Anims.Anim.find(
              (m) => m.Name == action
            )
            if (metadata) {
              if (metadata.CopyOf) {
                img = await Jimp.read(
                  `${path}/sprite/${pad}/${metadata.CopyOf}-${anim}.png`
                )
                metadata = xmlData.AnimData.Anims.Anim.find(
                  (m) => m.Name == metadata?.CopyOf
                )
              } else {
                img = await Jimp.read(
                  `${path}/sprite/${pad}/${action}-${anim}.png`
                )
              }

              durations[`${index}/${shiny}/${action}/${anim}`] =
                metadata?.Durations.Duration.length !== undefined
                  ? [...metadata?.Durations.Duration]
                  : [metadata?.Durations.Duration]
              const frameHeight = metadata?.FrameHeight
              const frameWidth = metadata?.FrameWidth

              if (frameWidth && frameHeight) {
                const width = img.getWidth() / frameWidth
                const height = img.getHeight() / frameHeight
                // logger.debug('img', index, 'action', action, 'frame height', metadata.FrameHeight, 'frame width', metadata.FrameWidth, 'width', img.getWidth(), 'height', img.getHeight(), ':', width, height);
                for (let x = 0; x < width; x++) {
                  for (let y = 0; y < height; y++) {
                    const cropImg = img.clone()

                    if (anim == SpriteType.SHADOW) {
                      const shadow = xmlData.AnimData.ShadowSize
                      if (shadow == 0) {
                        removeRed(cropImg)
                        removeBlue(cropImg)
                      } else if (shadow == 1) {
                        removeBlue(cropImg)
                      }
                      // transform to black
                      cropImg.scan(
                        0,
                        0,
                        cropImg.bitmap.width,
                        cropImg.bitmap.height,
                        (x, y, idx) => {
                          if (cropImg.bitmap.data[idx + 3] != 0) {
                            cropImg.bitmap.data[idx] = 0
                            cropImg.bitmap.data[idx + 1] = 0
                            cropImg.bitmap.data[idx + 2] = 0
                          }
                        }
                      )
                    }

                    cropImg.crop(
                      x * frameWidth,
                      y * frameHeight,
                      frameWidth,
                      frameHeight
                    )

                    const writePath = `split/${index}/${shiny}/${action}/${anim}/${y}/${zeroPad(
                      x
                    )}.png`
                    await cropImg.writeAsync(writePath)
                  }
                }
              }
            }
          } catch (error) {
            logger.error(error)
            logger.warn(
              "action",
              action,
              "is missing for index",
              index,
              mapName.get(index)
            )
          }
          logger.debug("split", index, shiny, anim, action)
        }
      }
    } catch (error) {
      logger.warn(
        "pokemon with index",
        index,
        "not found",
        mapName.get(index),
        "path: ",
        `${path}/sprite/${pad}/AnimData.xml`
      )
      missing += `${mapName.get(index)},${pad}/AnimData.xml\n`
    }
  }
}

async function main() {
  loadDurationsFile()
  if (specificIndexToSplit) {
    await splitIndex(specificIndexToSplit)
    saveDurationsFile()
  } else {
    await splitAll()
    saveDurationsFile()
    saveMissingFiles()
  }
}

main()
