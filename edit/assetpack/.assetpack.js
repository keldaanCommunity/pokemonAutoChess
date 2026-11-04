import { path as upath } from "@assetpack/core"
import { compress } from "@assetpack/core/image"
import { json } from "@assetpack/core/json"
import fs from "fs-extra"
import { texturePacker } from "./plugin-texture-packer-fork/dist/es/index.js"

const pkg = fs.readJSONSync("../../package.json")

export default {
  entry: "../../app/public/src/assets",
  output: "../../app/public/dist/client/assets",
  cache: true,
  cacheLocation: ".assetpack/core-1.7",
  strict: true,
  pipes: [
    texturePacker({
      texturePacker: {
        exporter: "Phaser3",
        allowRotation: false // i spotted some bugs when activated
      },
      resolutionOptions: {
        resolutions: { default: 1 },
        template: ``
      }
    }),
    compress({ png: true, jpg: true, webp: false }),
    json(),
    texturePackAtlas(),
    compressedAtlas({
      path: "../../app/public/src/assets/pokemons",
      include: /\d+-?\d+/,
      outputPath: "../../app/public/dist/client/assets/pokemons"
    })
  ]
}

function texturePackAtlas() {
  return {
    folder: true,
    name: "texture-pack-indexer",
    defaultOptions: {},
    async finish(tree, _options, pipeSystem) {
      const atlasPath = upath.joinSafe(pipeSystem.entryPath, "atlas.json")

      const existingAtlas = fs.existsSync(atlasPath)
        ? fs.readJSONSync(atlasPath)
        : null

      const previousVersion = existingAtlas?.version
      const newDate = new Date().toISOString().split("T")[0]
      let newBuild = 0
      if (previousVersion) {
        const [_major, _minor, _patch, previousDate, previousBuild] =
          previousVersion.split(".")
        const isSameDay = previousDate === newDate
        newBuild = isSameDay ? Number(previousBuild) + 1 : 0
      }
      const newVersion = `${pkg.version}.${[newDate, newBuild].join(".")}`

      pkg.assetsVersion = newVersion
      const atlas = {
        version: newVersion,
        packs: {}
      }

      function walk(node) {
        if (node.state === "deleted") return
        if (node.isFolder) {
          for (const child of node.children) walk(child)
        } else if (
          node.allMetaData.tps === true &&
          node.path.endsWith(".png")
        ) {
          let [packPath, animName] = node.directory.split("{tps}")
          packPath = packPath.replace(tree.path + "/", "")
          let packName = packPath.split("/").pop()

          if (packPath in atlas.packs === false) {
            atlas.packs[packPath] = {
              name: packName
            }
          }

          // declare automatically anims if it matches 000.png, 001.png etc.
          if (/\d\d\d\.png$/.test(node.path)) {
            if ("anims" in atlas.packs[packPath] === false) {
              atlas.packs[packPath].anims = {}
            }

            if (animName === "") {
              // case where the pack contains a single anim (no sub folder)
              animName = node.directory.split("/").pop().replace("{tps}", "")
            } else {
              // case where the pack contains several anims, we remove trailing slash
              animName = animName.replace(/^\//, "")
            }

            if (animName in atlas.packs[packPath].anims === false) {
              atlas.packs[packPath].anims[animName] = {
                ...(existingAtlas?.packs?.[packPath]?.anims?.[animName] ?? {}), // preserve previous config
                frames: 0
              }
            }
            atlas.packs[packPath].anims[animName].frames += 1
          }
        }
      }
      walk(tree)

      //fs.writeJSONSync("tree.json", tree)
      fs.writeJSONSync(atlasPath, atlas)
      fs.writeJSONSync(upath.joinSafe(pipeSystem.outputPath, "atlas.json"), atlas)

      const sw = fs.readFileSync("../../app/public/dist/client/sw.js", "utf8")
      fs.writeFileSync(
        "../../app/public/dist/client/sw.js",
        sw.replace(/CACHE v[\d\.\-]+/, `CACHE v${newVersion}`)
      )

      // Copy items individual sprites as we need them unpacked as well
      fs.cpSync(
        "../../app/public/src/assets/item{tps}",
        "../../app/public/dist/client/assets/item",
        { recursive: true }
      )

      // save changes to package.json
      fs.writeJSONSync("../../package.json", pkg, { spaces: 2 })
    }
  }
}

function compressedAtlas({ path, include, outputPath }) {
  return {
    name: "compressed-atlas",
    defaultOptions: {},
    async finish() {
      const files = fs.readdirSync(path)
      const jsonFiles = files.filter(
        (file) => file.endsWith(".json") && include.test(file)
      )
      for (const jsonFile of jsonFiles) {
        const filePath = upath.joinSafe(path, jsonFile)
        process.stdout.write(`Compressing ${filePath} pokemon atlas JSON`)

        const jsonData = fs.readJSONSync(filePath)

        // Process the jsonData as needed
        const { frames, size, scale, image } = jsonData.textures[0]
        const compressedJson = { i: image, s: [size.w, size.h, scale], a: {} }

        for (const frame of frames) {
          const parts = frame.filename.split("/")
          let node = compressedJson.a
          while (parts.length > 1) {
            const part = parts.shift()
            if (!(part in node)) {
              node[part] = {}
            }
            node = node[part]
          }
          node[parts[0]] = [
            frame.sourceSize.w,
            frame.sourceSize.h,
            frame.spriteSourceSize.x,
            frame.spriteSourceSize.y,
            frame.spriteSourceSize.w,
            frame.spriteSourceSize.h,
            frame.frame.x,
            frame.frame.y,
            frame.frame.w,
            frame.frame.h
          ]
        }

        fs.writeJSONSync(upath.joinSafe(outputPath, jsonFile), compressedJson)
        if (process.stdout.isTTY) {
          process.stdout.clearLine(0)
          process.stdout.cursorTo(0)
        } else {
          console.log(" ✓")
        }
      }
    }
  }
}
