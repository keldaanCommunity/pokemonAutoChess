import { compressPng, compressJpg } from "@assetpack/plugin-compress"
import { audio } from "@assetpack/plugin-ffmpeg"
import { json } from "@assetpack/plugin-json"
import { texturePacker } from "./plugin-texturepacker-fork/dist/es/index.js"

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
        exporter: "Phaser3"
      },
      resolutionOptions: {
        resolutions: { default: 1 },
        template: "" // prevent adding @1x suffix when not generating multiple resolutions
      }
    })
  }
}
