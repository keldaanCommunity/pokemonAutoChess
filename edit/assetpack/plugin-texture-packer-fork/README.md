# @assetpack/plugin-texture-packer

**FORKED to enable support for Phaser 3, see https://github.com/pixijs/assetpack/issues/53**

AssetPack plugin for generating texture atlases using Texture Packer

## Installation

```sh
npm install --save-dev @assetpack/plugin-texture-packer
```

## Basic Usage

```js
import { texturePacker } from "@assetpack/plugin-texture-packer";
// or use the pixi specific plugin
// import { pixiTexturePacker } from "@assetpack/plugin-texture-packer";

export default {
  ...
  plugins: {
    ...
    texturePacker: texturePacker(),
  },
};
```

This plugin requires the `{tps}` tag to be placed on a folder:

```bash
raw-assets
├── game{tps}
    ├── char.png
    └── pickup.png
```

images can be nested in subfolders:

```bash
raw-assets
├── game{tps}
    ├── char.png
    ├── pickup.png
    └── ui
        └── button.png
```

## Options

- `texturePacker`: Any option that can be passed to [Texture Packer](https://github.com/odrick/free-tex-packer-core#available-options) can be passed here.
- `resolutionOptions`: Options for generating resolutions
  - `template`: A template for denoting the resolution of the images. Defaults to `@%%x`. Note you must use `%%` to denote the resolution.
  - `resolutions`: An object containing the resolutions that the images will be resized to. Defaults to `{ default: 1, low: 0.5 }`.
  - `fixedResolution`: A resolution used if the fix tag is applied e.g. `path/to/spritesheet{tps}{fix}` or `path/to/spritesheet{tps}{fix}`. Resolution must match one found in resolutions. Defaults to `default`.
  - `maximumTextureSize`: The maximum size a sprite sheet can be before its split out. Defaults to `4096`. This is the equivalent of setting `width: 4096, height: 4096` in Texture Packer.
- `tags` - An object containing the tags to use for the plugin. Defaults to `{ tps: "tps", fix: "fix", jpg: "jpg" }`.
  - `tps`: The tag used to denote a folder that should be processed by Texture Packer.
  - `fix`: The tag used to denote that the spritesheet should be fixed to a specific resolution.
  - `jpg`: The tag used to denote the spritesheet should be saved as a jpg.

## Pixi Specific

If you are generating multiple resolutions of a spritesheet right now Pixi does not know how to handle this. To get around this you will need to add a `ResolveParser` like so:

```ts
import {
  settings,
  extensions,
  resolveTextureUrl,
  ResolveURLParser,
  ExtensionType
} from "pixi.js"

export const resolveJsonUrl = {
  extension: ExtensionType.ResolveParser,
  test: (value: string): boolean =>
    settings.RETINA_PREFIX.test(value) && value.endsWith(".json"),
  parse: resolveTextureUrl.parse
} as ResolveURLParser

extensions.add(resolveJsonUrl)
```
