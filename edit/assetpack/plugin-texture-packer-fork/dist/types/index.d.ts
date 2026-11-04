import type { AssetPipe } from "@assetpack/core"
import type { TexturePackerOptions as FreeTexturePackerOptions } from "free-tex-packer-core"

type TexturePackerTags = "tps" | "fix" | "jpg"
type TexturePackerConfig = Omit<FreeTexturePackerOptions, "exporter"> & {
  exporter?: string | FreeTexturePackerOptions["exporter"]
}

interface TexturePackerOptions {
  tags?: Partial<Record<TexturePackerTags, string>>
  texturePacker?: TexturePackerConfig
  resolutionOptions?: {
    /** A template for denoting the resolution of the images. */
    template?: string
    /** An object containing the resolutions that images are generated at. */
    resolutions?: Record<string, number>
    /** Resolution to use for assets tagged with `fix`. */
    fixedResolution?: string
    /** Maximum width and height for each generated atlas. */
    maximumTextureSize?: number
  }
}

declare function texturePacker(
  options?: TexturePackerOptions
): AssetPipe<TexturePackerOptions, TexturePackerTags>
declare function pixiTexturePacker(
  options?: TexturePackerOptions
): AssetPipe<TexturePackerOptions, TexturePackerTags>

export { TexturePackerOptions, pixiTexturePacker, texturePacker }
