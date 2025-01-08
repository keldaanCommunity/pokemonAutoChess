import { path } from "@assetpack/core"
import { compressJpg, compressPng } from "@assetpack/plugin-compress"
//import { audio } from "@assetpack/plugin-ffmpeg"
import { json } from "@assetpack/plugin-json"
import fs from "fs-extra"
import { texturePacker } from "./plugin-texturepacker-fork/dist/es/index.js"

const pkg = fs.readJSONSync("../../package.json")

export default {
  entry: "../../app/public/src/assets",
  output: "../../app/public/dist/client/assets",
  plugins: {
    compressPng: compressPng(),
    compressJpg: compressJpg(),
    /*audio: audio({
      inputs: [".mp3", ".wav", ".ogg"],
      outputs: [
        {
          formats: [".mp3"],
          recompress: false,
          options: {
            audioBitrate: 96,
            audioChannels: 1,
            audioFrequency: 48000
          }
        },
        {
          formats: [".ogg"],
          recompress: false,
          options: {
            audioBitrate: 32,
            audioChannels: 1,
            audioFrequency: 22050
          }
        }
      ]
    }),*/
    json: json(),
    texturePacker: texturePacker({
      texturePacker: {
        exporter: "Phaser3",
        allowRotation: false // i spotted some bugs when activated
      },
      resolutionOptions: {
        resolutions: { default: 1 },
        template: `-${pkg.version}`
      }
    }),
    texturePackIndexer: texturePackAtlas(),
    compressedAtlas: compressedAtlas({
      path: "../../app/public/src/assets/pokemons",
      include: /\d+-?\d+/,
      outputPath: "../../app/public/dist/client/assets/pokemons.json"
    })
  }
}

function texturePackAtlas() {
  return {
    folder: true,
    name: "texture-pack-indexer",
    finish(tree, processor) {
      const atlasPath = path.joinSafe(processor.config.entry, "atlas.json")

      const existingAtlas = fs.existsSync(atlasPath)
        ? fs.readJSONSync(atlasPath)
        : null

      const previousVersion = existingAtlas?.version
        ? Number(existingAtlas.version.split(".").pop())
        : 0
      const newVersion = pkg.version + "." + (previousVersion + 1)
      const atlas = {
        version: newVersion,
        packs: {}
      }

      function walk(node) {
        if (node.isFolder && node.files) {
          for (let f in node.files) walk(node.files[f])
        } else if (
          node.pathTags["tps"] === true &&
          node.path.endsWith(".png")
        ) {
          let [packPath, animName] = node.parent.split("{tps}")
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
              animName = node.parent.split("/").pop().replace("{tps}", "")
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

      const sw = fs.readFileSync("../../app/public/dist/client/sw.js", "utf8")
      fs.writeFileSync(
        "../../app/public/dist/client/sw.js",
        sw.replace(/CACHE v[\d\.]+/, `CACHE v${newVersion}`)
      )

      // Copy items individual sprites as we need them unpacked as well
      fs.cpSync(
        "../../app/public/src/assets/item{tps}",
        "../../app/public/dist/client/assets/item",
        { recursive: true }
      )
    }
  }
}

function compressedAtlas({ path, include, outputPath }) {
  return {
    name: "compressed-atlas",
    finish() {
      const files = fs.readdirSync(path)
      const jsonFiles = files.filter(
        (file) => file.endsWith(".json") && include.test(file)
      )
      const compressedPokemonsAtlas = {}
      console.log(
        `Compressing ${jsonFiles.length} JSON files into compressed atlas ${outputPath}`
      )
      for (const jsonFile of jsonFiles) {
        const filePath = `${path}/${jsonFile}`
        const jsonData = fs.readJSONSync(filePath)
        // Process the jsonData as needed
        const { frames, size, scale, image } = jsonData.textures[0]
        compressedPokemonsAtlas[image] = {
          s: [size.w, size.h, size.scale], // width, height, scale
          a: {}
        }

        for (const frame of frames) {
          const parts = frame.filename.split("/")
          let node = compressedPokemonsAtlas[image].a
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
      }

      fs.writeJSONSync(outputPath, compressedPokemonsAtlas)
    }
  }
}
