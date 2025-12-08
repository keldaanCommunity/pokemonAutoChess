#!/usr/bin/env node
import { spawn } from "child_process"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import fse, { ensureDir } from "fs-extra"
import gracefulFs from "graceful-fs"
import { Jimp } from "jimp"
import { createInterface } from "readline"
import { PokemonCredits } from "../app/core/credits"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "../app/public/src/game/components/pokemon-animations"
import { Emotion } from "../app/types"
import { AnimationType } from "../app/types/Animation"
import { PokemonTint, SpriteType } from "../app/types/enum/Game"
import {
  NON_PMD_PKM_INDEXES,
  Pkm,
  PkmByIndex,
  PkmIndex
} from "../app/types/enum/Pokemon"
import { logger } from "../app/utils/logger"
import { mapToObj, objToMap } from "../app/utils/map"
import { expandHomeDir } from "../app/utils/path"

gracefulFs.gracefulify(fs)

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

function formatPokemonName(index: string): string {
  let shiny = false
  if (index.endsWith("-0001") && index.length === 14) {
    shiny = true
    index = index.slice(0, -5)
    if (index.endsWith("-0000")) {
      index = index.slice(0, -5)
    }
  }
  return `#${index} ${PkmByIndex[index] ?? "UNKNOWN"}${shiny ? " (Shiny)" : ""}`
}

function getShinyIndex(index: string): string {
  const pathIndex = index.replaceAll("-", "/")
  const split = pathIndex.split("/")

  const shinyIndex =
    split.length === 1
      ? `${pathIndex}/0000/0001`
      : split.length === 2
        ? `${pathIndex}/0001`
        : pathIndex.split("/").with(2, "0001").join("/")
  return shinyIndex
}

/**
 * Cross-platform command execution
 */
function executeCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.info(`Executing: ${command} ${args.join(" ")}`)

    const child = spawn(command, args, {
      stdio: "inherit"
    })

    child.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on("error", (error) => {
      reject(error)
    })
  })
}

/**
 * Cross-platform user input prompt
 */
function promptUser(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

/**
 * Get all available Pokemon indices from split directory
 */
function getAvailablePokemonIndices(): string[] {
  try {
    const splitDir = "./split"
    if (!fs.existsSync(splitDir)) {
      return []
    }

    return fs
      .readdirSync(splitDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort()
  } catch (error) {
    logger.warn("Could not read split directory:", error)
    return []
  }
}

/**
 * Spritesheet processor splitting the frames and saving durations/delays
 */
class SpriteSheetProcessor {
  private durations: any = {}
  private delays: any = {}
  private missing = ""
  private mapName = new Map<string, string>()
  private pkmaIndexes = ["0000"]

  constructor() {
    this.mapName.set("0000", "missingno")

    Object.values(Pkm).forEach((pkm) => {
      const index = PkmIndex[pkm]
      if (!this.pkmaIndexes.includes(index)) {
        this.pkmaIndexes.push(index)
        this.mapName.set(index, pkm)
      }
    })
  }

  loadDurationsFile() {
    try {
      const rawdata = fs.readFileSync(
        "../app/public/src/assets/pokemons/durations.json",
        "utf8"
      )
      Object.assign(this.durations, JSON.parse(rawdata))
      logger.debug(
        `Loaded durations file, ${
          Object.keys(this.durations).length
        } durations already computed`
      )
    } catch (error) {
      logger.warn("Could not load durations file, starting fresh")
    }
  }

  loadDelaysFile() {
    try {
      const rawdata = fs.readFileSync("../app/types/delays.json", "utf8")
      Object.assign(this.delays, JSON.parse(rawdata))
      logger.debug(
        `Loaded delays file, ${
          Object.keys(this.delays).length
        } delays already computed`
      )
    } catch (error) {
      logger.warn("Could not load delays file, starting fresh")
    }
  }

  saveDurationsFile() {
    const fileA = fs.createWriteStream("./sheets/durations.json")
    fileA.on("error", function (err) {
      logger.error(err)
    })
    fileA.write(JSON.stringify(this.durations))
    fileA.end()
    logger.debug(
      `Saved durations file, ${Object.keys(this.durations).length} durations entries`
    )
  }

  saveDelaysFile() {
    const fileA = fs.createWriteStream("./sheets/delays.json")
    fileA.on("error", function (err) {
      logger.error(err)
    })
    fileA.write(JSON.stringify(this.delays))
    fileA.end()
    logger.debug(
      `Saved delays file, ${Object.keys(this.delays).length} delays entries`
    )
  }

  private removeBlue(cropImg: any) {
    cropImg.scan(
      0,
      0,
      cropImg.bitmap.width,
      cropImg.bitmap.height,
      (x: number, y: number, idx: number) => {
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

  private removeRed(cropImg: any) {
    cropImg.scan(
      0,
      0,
      cropImg.bitmap.width,
      cropImg.bitmap.height,
      (x: number, y: number, idx: number) => {
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

  private zeroPad(num: number) {
    return ("0000" + num).slice(-4)
  }

  async splitIndex(spriteCollabPath: string, index: string) {
    const pathIndex = index.replaceAll("-", "/")
    const shinyIndex = getShinyIndex(index)
    const conf =
      PokemonAnimations[this.mapName.get(index) as Pkm] ??
      DEFAULT_POKEMON_ANIMATION_CONFIG
    const allPads = [pathIndex]
    if (!conf.shinyUnavailable) allPads.push(shinyIndex)

    for (let j = 0; j < allPads.length; j++) {
      const pad = allPads[j]
      try {
        const shiny = pathIndex == pad ? PokemonTint.NORMAL : PokemonTint.SHINY
        const xmlFile = fs.readFileSync(
          expandHomeDir(`${spriteCollabPath}/sprite/${pad}/AnimData.xml`)
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
            logger.error(
              "no duration found for attack metadata",
              attackMetadata
            )
          } else {
            const attackDurations: number[] =
              attackMetadata.Durations.Duration.length !== undefined
                ? [...attackMetadata.Durations.Duration]
                : [attackMetadata.Durations.Duration]
            this.delays[index] = {
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
              `Animation config not found for ${formatPokemonName(index)}`
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
              `${spriteCollabPath}/sprite/${pad}/${metadata?.CopyOf || action}-${anim}.png`
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
                this.durations[`${index}/${shiny}/${action}/${anim}`] =
                  metadata?.Durations.Duration.length !== undefined
                    ? [...metadata.Durations.Duration]
                    : [metadata.Durations.Duration]
                const frameHeight = metadata?.FrameHeight
                const frameWidth = metadata?.FrameWidth

                if (frameWidth && frameHeight) {
                  const width = img.width / frameWidth
                  const height = img.height / frameHeight
                  for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                      const cropImg = img.clone()

                      if (anim == SpriteType.SHADOW) {
                        const shadow = xmlData.AnimData.ShadowSize
                        if (shadow == 0) {
                          this.removeRed(cropImg)
                          this.removeBlue(cropImg)
                        } else if (shadow == 1) {
                          this.removeBlue(cropImg)
                        }
                        // transform to black
                        cropImg.scan(
                          0,
                          0,
                          cropImg.bitmap.width,
                          cropImg.bitmap.height,
                          (x: number, y: number, idx: number) => {
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
                        `split/${index}/${shiny}/${action}/${anim}/${y}/${this.zeroPad(
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
                `Action '${action}' is missing for ${formatPokemonName(index)}`
              )
            }
            logger.debug(
              `split ${formatPokemonName(index)}: ${shiny}/${anim}/${action}`
            )
          }
        }
      } catch (error) {
        logger.warn(
          `Pokemon ${formatPokemonName(index)} not found at path: ${spriteCollabPath}/sprite/${pad}/AnimData.xml`,
          error
        )
        this.missing += `${this.mapName.get(index)},${pad}/AnimData.xml\n`
      }
    }
  }

  async splitAll(spriteCollabPath: string) {
    for (let i = 0; i < this.pkmaIndexes.length; i++) {
      const index = this.pkmaIndexes[i]

      logger.debug(
        `${i}/${this.pkmaIndexes.length - 1} (${(
          (i * 100) / (this.pkmaIndexes.length - 1)
        ).toFixed(2)}%) ${formatPokemonName(index)}`
      )

      await this.splitIndex(spriteCollabPath, index)
    }
  }

  saveMissingFiles() {
    const fileB = fs.createWriteStream("sheets/missing.txt")
    fileB.on("error", function (err) {
      logger.error(err)
    })
    fileB.write(this.missing)
    fileB.end()
  }
}

/**
 * Minify the sheet data by removing metadata and updating index list
 */
function minifySheet(id: string) {
  try {
    logger.debug(`Minifying sheet for ${formatPokemonName(id)}...`)
    const buffer = fs.readFileSync(`sheets/${id}.json`)
    const json = JSON.parse(buffer.toString())
    delete json.meta
    fs.writeFileSync(`sheets/${id}.json`, JSON.stringify(json, null, 0))
  } catch (error) {
    logger.error("error minifying sheet id#", id, error)
  }
}

/**
 * Moving all files to the right folders
 */
function moveFiles(spriteCollabPath: string, pkmIndex: string) {
  const creditsName = fs.readFileSync(
    expandHomeDir(`${spriteCollabPath}/credit_names.txt`)
  )
  fs.writeFileSync("sheets/credit_names.txt", creditsName)

  fse.copySync(
    `sheets/durations.json`,
    `../app/public/src/assets/pokemons/durations.json`,
    {
      overwrite: true
    }
  )

  fse.copySync(`sheets/delays.json`, `../app/types/delays.json`, {
    overwrite: true
  })

  moveSheet(pkmIndex)
  movePortrait(spriteCollabPath, pkmIndex)
  logger.debug(
    `Sprites and portraits have been moved to assets folder for ${formatPokemonName(pkmIndex)}.`
  )
}

function moveSheet(pkmIndex: string) {
  try {
    fse.copySync(
      `sheets/${pkmIndex}.json`,
      `../app/public/src/assets/pokemons/${pkmIndex}.json`,
      {
        overwrite: true
      }
    )
    fse.copySync(
      `sheets/${pkmIndex}.png`,
      `../app/public/src/assets/pokemons/${pkmIndex}.png`,
      {
        overwrite: true
      }
    )
  } catch (err) {
    logger.warn(`Sheet not found for ${pkmIndex}`)
  }
}

function movePortrait(spriteCollabPath: string, pkmIndex: string) {
  const portraitPath = pkmIndex.replace(/(\d+)\-/g, "$1/")
  try {
    fse.copySync(
      expandHomeDir(`${spriteCollabPath}/portrait/${portraitPath}`),
      `../app/public/src/assets/portraits/${portraitPath}`,
      {
        overwrite: true
      }
    )
  } catch (err) {
    logger.warn(`Portrait not found for ${pkmIndex}`)
  }
}

/**
 * Track portraits available
 */
function updateEmotionsAndCredits(
  spriteCollabPath: string,
  indexesToUpdate: string[] = Object.values(PkmIndex).flatMap((indexToAdd) => {
    const shinyIndexToAdd = getShinyIndex(indexToAdd)
    return [indexToAdd, shinyIndexToAdd]
  })
) {
  let tracker: Record<string, any> = {}
  try {
    const filePath = expandHomeDir(`${spriteCollabPath}/tracker.json`)
    const content = fs.readFileSync(filePath, "utf8")
    tracker = JSON.parse(content)
  } catch (err) {
    logger.error(
      `Failed to read or parse tracker.json at ${spriteCollabPath}:`,
      err
    )
    throw err
  }

  let emotionsPerIndex: Map<string, number[]> = new Map<string, number[]>()
  let creditsData = new Map<string, PokemonCredits>()

  try {
    const prevEmotionsData = fs.readFileSync(
      "../app/models/precomputed/emotions-per-pokemon-index.json",
      "utf8"
    )
    emotionsPerIndex = objToMap(JSON.parse(prevEmotionsData))

    const prevCreditsData = fs.readFileSync(
      "../app/models/precomputed/credits.json",
      "utf8"
    )
    creditsData = objToMap(JSON.parse(prevCreditsData))
  } catch (err) {
    logger.warn(
      `No existing emotions-per-pokemon-index.json found, will create a new one.`
    )
  }

  const emotions = Object.values(Emotion)
  for (const pkmIndex of indexesToUpdate) {
    const pathIndex = pkmIndex.replaceAll("/", "-").split("-")
    let metadata = tracker[pathIndex[0]]
    for (let i = 1; i < pathIndex.length; i++) {
      metadata = metadata?.subgroups?.[pathIndex[i]]
    }

    if (metadata) {
      const emotionsAvailable = emotions.map((emotion) =>
        emotion in (metadata?.portrait_files ?? {}) ? 1 : 0
      )
      emotionsPerIndex.set(pkmIndex, emotionsAvailable)
      logger.log(
        `${emotionsAvailable.filter((e) => e === 1).length} portraits found for ${formatPokemonName(pkmIndex)}`
      )

      creditsData.set(pkmIndex, {
        portrait_credit: metadata.portrait_credit,
        sprite_credit: metadata.sprite_credit
      })
    } else if (NON_PMD_PKM_INDEXES.includes(pkmIndex) === false) {
      logger.warn(`No tracker information for ${pkmIndex}`)
    }
  }

  // save when done
  fs.writeFileSync(
    "../app/models/precomputed/emotions-per-pokemon-index.json",
    JSON.stringify(mapToObj(emotionsPerIndex))
  )
  logger.log("Updated emotions-per-pokemon-index.json")

  fs.writeFileSync(
    "../app/models/precomputed/credits.json",
    JSON.stringify(mapToObj(creditsData))
  )
  logger.log("Updated credits.json")
}

/**
 * Cross-platform TexturePacker execution
 */
async function runTexturePacker(indexToAdd: string) {
  const command =
    process.platform === "win32" ? "TexturePacker.exe" : "TexturePacker"
  const args = [
    "--pack-mode",
    "Good",
    "--sheet",
    `sheets/${indexToAdd}.png`,
    "--data",
    `sheets/${indexToAdd}.json`,
    "--texture-format",
    "png8",
    "--format",
    "phaser",
    "--trim-sprite-names",
    `./split/${indexToAdd}`
  ]

  try {
    await executeCommand(command, args)
    logger.info(
      `TexturePacker completed successfully for ${formatPokemonName(indexToAdd)}`
    )
  } catch (error) {
    logger.error(
      `TexturePacker failed for ${formatPokemonName(indexToAdd)}:`,
      error
    )
    throw error
  }
}

/**
 * Run TexturePacker for all Pokemon in split directory
 */
async function runTexturePackerForAll() {
  const availableIndices = getAvailablePokemonIndices()

  if (availableIndices.length === 0) {
    logger.warn("No Pokemon found in split directory")
    return
  }

  logger.info(
    `Found ${availableIndices.length} Pokemon to process with TexturePacker`
  )

  for (let i = 0; i < availableIndices.length; i++) {
    const index = availableIndices[i]
    logger.info(
      `Processing ${i + 1}/${availableIndices.length}: ${formatPokemonName(index)}`
    )
    await runTexturePacker(index)
  }
}

/**
 * Minify all sheets in sheets directory
 */
function minifyAllSheets() {
  try {
    const sheetsDir = "./sheets"
    if (!fs.existsSync(sheetsDir)) {
      logger.warn("Sheets directory not found")
      return
    }

    const jsonFiles = fs
      .readdirSync(sheetsDir)
      .filter(
        (file) =>
          file.endsWith(".json") &&
          file !== "durations.json" &&
          file !== "delays.json"
      )
      .map((file) => file.replace(".json", ""))

    logger.info(`Found ${jsonFiles.length} sheets to minify`)

    for (const id of jsonFiles) {
      minifySheet(id)
    }

    logger.info("All sheets minified successfully")
  } catch (error) {
    logger.error("Error minifying all sheets:", error)
    throw error
  }
}

/**
 * Move all files to assets (for all Pokemon)
 */
function moveAllFiles(spriteCollabPath: string) {
  // Copy global files
  const creditsName = fs.readFileSync(
    expandHomeDir(`${spriteCollabPath}/credit_names.txt`)
  )
  fs.writeFileSync("sheets/credit_names.txt", creditsName)

  fse.copySync(
    `sheets/durations.json`,
    `../app/public/src/assets/pokemons/durations.json`,
    {
      overwrite: true
    }
  )

  fse.copySync(`sheets/delays.json`, `../app/types/delays.json`, {
    overwrite: true
  })

  // Move all individual Pokemon files
  Object.values(PkmIndex).forEach((index) => {
    moveSheet(index)
    movePortrait(spriteCollabPath, index)
  })

  logger.debug(
    `All sheets and portraits moved for ${Object.values(PkmIndex).length} Pokémon.`
  )
}

/**
 * Main function that orchestrates the entire process
 */
async function main() {
  try {
    logger.info("Pokemon Auto Chess sprite processor")
    logger.info("=".repeat(50))

    // Get user input
    const spriteCollabPath = await promptUser(
      "Enter SpriteCollab repo local folder path: "
    )
    const indexToAdd = await promptUser(
      "Enter index of pokemon to add (leave empty to process all): "
    )

    if (!spriteCollabPath) {
      logger.error("SpriteCollab path is required")
      process.exit(1)
    }

    // Verify paths exist
    if (!fs.existsSync(expandHomeDir(spriteCollabPath))) {
      logger.error(`SpriteCollab path does not exist: ${spriteCollabPath}`)
      process.exit(1)
    }

    // Ensure output directories exist
    await ensureDir("sheets")
    await ensureDir("split")

    if (indexToAdd.trim()) {
      // Process single Pokemon
      logger.info(`Processing single Pokemon: ${formatPokemonName(indexToAdd)}`)
      logger.info(`Using SpriteCollab path: ${spriteCollabPath}`)

      // Step 1: Split sprites
      logger.info("Step 1/5: Splitting sprites...")
      const splitter = new SpriteSheetProcessor()
      splitter.loadDelaysFile()
      splitter.loadDurationsFile()
      await splitter.splitIndex(spriteCollabPath, indexToAdd)
      splitter.saveDurationsFile()
      splitter.saveDelaysFile()

      // Step 2: Run TexturePacker
      logger.info("Step 2/5: Running TexturePacker...")
      await runTexturePacker(indexToAdd)

      // Step 3: Minify generated files
      logger.info("Step 3/5: Minifying sheets...")
      minifySheet(indexToAdd)

      // Step 4: Move files to assets
      logger.info("Step 4/5: Moving files to assets...")
      moveFiles(spriteCollabPath, indexToAdd)

      // Step 5: Updating emotions available and credits
      logger.info("Step 5/5: Updating emotions available and credits...")
      const shinyIndexToAdd = getShinyIndex(indexToAdd)
      updateEmotionsAndCredits(spriteCollabPath, [indexToAdd, shinyIndexToAdd])

      logger.info(
        `✅ Process completed successfully! ${formatPokemonName(indexToAdd)} has been added to the game assets.`
      )
    } else {
      // Process all Pokemon
      logger.info("Processing ALL Pokemon")
      logger.info(`Using SpriteCollab path: ${spriteCollabPath}`)

      // Step 1: Split all sprites
      logger.info("Step 1/5: Splitting all sprites...")
      const splitter = new SpriteSheetProcessor()
      splitter.loadDelaysFile()
      splitter.loadDurationsFile()
      await splitter.splitAll(spriteCollabPath)
      splitter.saveDurationsFile()
      splitter.saveDelaysFile()
      splitter.saveMissingFiles()

      // Step 2: Run TexturePacker for all
      logger.info("Step 2/5: Running TexturePacker for all Pokemon...")
      await runTexturePackerForAll()

      // Step 3: Minify all generated files
      logger.info("Step 3/5: Minifying all sheets...")
      minifyAllSheets()

      // Step 4: Move all files to assets
      logger.info("Step 4/5: Moving all files to assets...")
      moveAllFiles(spriteCollabPath)

      // Step 5:Updating emotions available and credits for all Pokemon
      logger.info("Step 5/5: Updating emotions and credits for all Pokemon...")
      updateEmotionsAndCredits(spriteCollabPath)

      logger.info(
        "✅ Process completed successfully! All Pokemon have been processed and added to the game assets."
      )
    }
  } catch (error) {
    logger.error("❌ Process failed:", error)
    process.exit(1)
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main()
}

export {
  main,
  SpriteSheetProcessor,
  minifySheet,
  minifyAllSheets,
  moveFiles,
  moveAllFiles,
  updateEmotionsAndCredits,
  runTexturePacker,
  runTexturePackerForAll,
  executeCommand,
  promptUser,
  getAvailablePokemonIndices
}
