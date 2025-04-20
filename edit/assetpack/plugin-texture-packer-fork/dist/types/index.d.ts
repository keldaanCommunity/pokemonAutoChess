import { PluginOptions, Plugin } from '@assetpack/core';
import { TexturePackerOptions as TexturePackerOptions$1 } from 'free-tex-packer-core';

interface TexturePackerOptions extends PluginOptions<'tps' | 'fix' | 'jpg'> {
    texturePacker: TexturePackerOptions$1;
    resolutionOptions: {
        /** A template for denoting the resolution of the images. */
        template?: string;
        /** An object containing the resolutions that the images will be resized to. */
        resolutions?: {
            [x: string]: number;
        };
        /** A resolution used if the fixed tag is applied. Resolution must match one found in resolutions. */
        fixedResolution?: string;
        /** The maximum size a sprite sheet can be before its split out */
        maximumTextureSize?: number;
    };
}
declare function texturePacker(options?: Partial<TexturePackerOptions>): Plugin<TexturePackerOptions>;
declare function pixiTexturePacker(options?: Partial<TexturePackerOptions>): Plugin<TexturePackerOptions>;

export { TexturePackerOptions, pixiTexturePacker, texturePacker };
