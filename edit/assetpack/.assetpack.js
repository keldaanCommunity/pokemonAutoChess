import { compressPng, compressJpg } from "@assetpack/plugin-compress"
import { audio } from "@assetpack/plugin-ffmpeg"
import { json } from "@assetpack/plugin-json"
import { texturePacker } from "./plugin-texturepacker-fork/dist/es/index.js"
import { path } from "@assetpack/core"
import fs from "fs-extra"

export default {
  entry: "../../app/public/src/assets",
  output: "../../app/public/dist/client/assets",
  plugins: {
    compressPng: compressPng(),
    compressJpg: compressJpg(),
    audio: audio({
      inputs: [".mp3", ".ogg", ".wav"],
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
            audioBitrate: 96,
            audioChannels: 1,
            audioFrequency: 48000
          }
        }
      ]
    }),
    json: json(),
    texturePacker: texturePacker({
      texturePacker: {
        exporter: "Phaser3",
        allowRotation: false // i spotted some bugs when activated
      },
      resolutionOptions: {
        resolutions: { default: 1 },
        template: "" // prevent adding @1x suffix when not generating multiple resolutions
      }
    }),
    texturePackIndexer: texturePackAtlas()
  }
}

function texturePackAtlas() {
  return {
    folder: true,
    name: "texture-pack-indexer",
    finish(tree, processor) {
      fs.writeJSONSync("tree.json", tree)

      const atlasPath = path.joinSafe(processor.config.entry, "atlas.json")

      const existingAtlas = fs.existsSync(atlasPath)
        ? fs.readJSONSync(atlasPath)
        : null
      const atlas = {}

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

          if (packPath in atlas === false) {
            atlas[packPath] = { name: packName, anims: {} }
          }

          if (animName === "") {
            // case where the pack contains a single anim (no sub folder)
            animName = node.parent.split("/").pop().replace("{tps}", "")
          } else {
            // case where the pack contains several anims, we remove trailing slash
            animName = animName.replace(/^\//, "")
          }

          if (animName in atlas[packPath].anims === false) {
            atlas[packPath].anims[animName] = {
              ...(existingAtlas?.[packPath]?.anims[animName] ?? {}), // preserve previous config
              frames: 0
            }
          }
          atlas[packPath].anims[animName].frames += 1
        }
      }
      walk(tree)

      // fs.writeJSONSync("tree.json", tree)
      fs.writeJSONSync(atlasPath, atlas)
    }
  }
}
