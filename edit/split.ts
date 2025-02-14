import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import gracefulFs from "graceful-fs"
import { Jimp } from "jimp"
import { AnimationType } from "../app/types/Animation"
import { PokemonTint, SpriteType } from "../app/types/enum/Game"
import { AnimationConfig, Pkm, PkmIndex } from "../app/types/enum/Pokemon"
import { logger } from "../app/utils/logger"
import * as pathlib from "path"
import * as os from "os"
import { ensureDir } from "fs-extra"

gracefulFs.gracefulify(fs)
const args = process.argv.slice(2)
const path = args[0]
const specificIndexToSplit = args[1]

function expandHomeDir(filePath: string): string {
  if (filePath.startsWith("~")) {
    return pathlib.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}

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
  HitFrame: number
}

interface IDuration {
  Duration: any
}

const mapName = new Map<string, string>()
mapName.set("0000", "missingno")

const pkmaIndexes = ["0000"]

Object.values(Pkm).forEach((pkm) => {
  const index = PkmIndex[pkm]
  if (!pkmaIndexes.includes(index)) {
    pkmaIndexes.push(index)
    mapName.set(index, pkm)
  }
})

logger.debug(mapName)

// const credits = {};
const durations = {}
const delays = {}
let missing = ""

async function splitAll() {
  for (let i = 0; i < pkmaIndexes.length; i++) {
    const index = pkmaIndexes[i]

    logger.debug(
      `${i}/${pkmaIndexes.length - 1} (${(
        (i * 100) / (pkmaIndexes.length - 1)
      ).toFixed(2)}%) #${index} ${mapName.get(index)}`
    )

    await splitIndex(index)
  }
}

export function loadDurationsFile() {
  const rawdata = fs.readFileSync(
    "../app/public/src/assets/pokemons/durations.json",
    "utf8"
  )
  Object.assign(durations, JSON.parse(rawdata))
  logger.debug(
    `Loaded durations file, ${
      Object.keys(durations).length
    } durations already computed`
  )
}

export function loadDelaysFile() {
  try {
    const rawdata = fs.readFileSync("../app/types/delays.json", "utf8")
    Object.assign(delays, JSON.parse(rawdata))
    logger.debug(
      `Loaded delays file, ${
        Object.keys(delays).length
      } delays already computed`
    )
  } catch (error) {
    logger.error(error)
  }
}

export function saveDurationsFile() {
  const fileA = fs.createWriteStream("./sheets/durations.json")
  fileA.on("error", function (err) {
    logger.error(err)
  })
  fileA.write(JSON.stringify(durations))
  fileA.end()
  logger.debug(
    `Saved durations file, ${Object.keys(durations).length} durations entries`
  )
}

export function saveDelaysFile() {
  const fileA = fs.createWriteStream("./sheets/delays.json")
  fileA.on("error", function (err) {
    logger.error(err)
  })
  fileA.write(JSON.stringify(delays))
  fileA.end()
  logger.debug(
    `Saved delays file, ${Object.keys(delays).length} delays entries`
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
  const conf =
    AnimationConfig[mapName.get(index) as Pkm] ?? AnimationConfig[Pkm.DEFAULT]
  const allPads = [pathIndex]
  if (!conf.shinyUnavailable) allPads.push(shinyPad)

  for (let j = 0; j < allPads.length; j++) {
    const pad = allPads[j]
    try {
      const shiny = pathIndex == pad ? PokemonTint.NORMAL : PokemonTint.SHINY
      const xmlFile = fs.readFileSync(
        expandHomeDir(`${path}/sprite/${pad}/AnimData.xml`)
      )
      const parser = new XMLParser()
      const xmlData = <IPMDCollab>parser.parse(xmlFile)
      let attackMetadata = xmlData.AnimData.Anims.Anim.find(
        (m) => m.Name === conf.attack
      )
      if (attackMetadata) {
        if (attackMetadata && attackMetadata.CopyOf) {
          attackMetadata =
            xmlData.AnimData.Anims.Anim.find(
              (m) => m.Name == attackMetadata?.CopyOf
            ) ?? attackMetadata
        }

        if (!attackMetadata?.Durations?.Duration) {
          logger.error("no duration found for attack metadata", attackMetadata)
        } else {
          const attackDurations: number[] =
            attackMetadata.Durations.Duration.length !== undefined
              ? [...attackMetadata.Durations.Duration]
              : [attackMetadata.Durations.Duration]
          delays[index] = {
            d: attackDurations
              .slice(0, attackMetadata.HitFrame)
              .reduce((prev, curr) => prev + curr, 0),
            t: attackDurations.reduce((prev, curr) => prev + curr, 0)
          }
        }
      }
      for (let k = 0; k < Object.values(SpriteType).length; k++) {
        const anim = Object.values(SpriteType)[k]

        const actions: Set<AnimationType> = new Set([
          AnimationType.Idle,
          AnimationType.Walk
        ])

        if (!conf) {
          logger.warn(
            "Animation config not found for index",
            index,
            mapName.get(index)
          )
          continue
        }

        actions.add(conf.sleep ?? AnimationType.Sleep)
        actions.add(conf.eat ?? AnimationType.Eat)
        actions.add(conf.hop ?? AnimationType.Hop)
        actions.add(conf.hurt ?? AnimationType.Hurt)
        actions.add(conf.attack ?? AnimationType.Attack)
        actions.add(conf.ability ?? AnimationType.SpAttack)
        actions.add(conf.emote ?? AnimationType.Pose)

        for (const action of actions) {
          let metadata = xmlData.AnimData.Anims.Anim.find(
            (m) => m.Name == action
          )
          const imgPath = expandHomeDir(
            `${path}/sprite/${pad}/${metadata?.CopyOf || action}-${anim}.png`
          )
          try {
            const img = await Jimp.read(imgPath)

            if (metadata?.CopyOf) {
              metadata = xmlData.AnimData.Anims.Anim.find(
                (m) => m.Name == metadata?.CopyOf
              )
            }

            if (!metadata?.Durations?.Duration) {
              logger.error("no duration found for metadata", metadata)
            } else {
              durations[`${index}/${shiny}/${action}/${anim}`] =
                metadata?.Durations.Duration.length !== undefined
                  ? [...metadata.Durations.Duration]
                  : [metadata.Durations.Duration]
              const frameHeight = metadata?.FrameHeight
              const frameWidth = metadata?.FrameWidth

              if (frameWidth && frameHeight) {
                const width = img.width / frameWidth
                const height = img.height / frameHeight
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

                    cropImg.crop({
                      x: x * frameWidth,
                      y: y * frameHeight,
                      w: frameWidth,
                      h: frameHeight
                    })

                    await ensureDir(
                      `split/${index}/${shiny}/${action}/${anim}/${y}`
                    )
                    await cropImg.write(
                      `split/${index}/${shiny}/${action}/${anim}/${y}/${zeroPad(
                        x
                      )}.png`
                    )
                  }
                }
              }
            }
          } catch (error) {
            logger.error(`Error parsing animation ${imgPath}`, error)
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
        `${path}/sprite/${pad}/AnimData.xml`,
        error
      )
      missing += `${mapName.get(index)},${pad}/AnimData.xml\n`
    }
  }
}

async function main() {
  loadDelaysFile()
  loadDurationsFile()
  if (specificIndexToSplit) {
    await splitIndex(specificIndexToSplit)
    saveDurationsFile()
    saveDelaysFile()
  } else {
    logger.info("started spliting all ...")
    await splitAll()
    logger.info("saving durations files ...")
    saveDurationsFile()
    logger.info("saving missing files ...")
    saveMissingFiles()
    logger.info("saving delays files ...")
    saveDelaysFile()
  }
}

main()
