import { compressPng, compressJpg } from "@assetpack/plugin-compress"
import { audio } from "@assetpack/plugin-ffmpeg"
import { json } from "@assetpack/plugin-json"
import { texturePacker } from "@assetpack/plugin-texture-packer"

export default {
  entry: "../../app/public/src/assets",
  output: "../../app/public/dist/client/assets",
  plugins: {
    compressPng: compressPng(),
    compressJpg: compressJpg(),
    audio: audio(),
    json: json(),
    texturePacker: texturePacker()
  }
}
