# @assetpack/cli

AssetPack CLI is a command line tool for AssetPack.

## Installation

```sh
npm install --save-dev @assetpack/cli
```

## Usage

```json
{
    "scripts": {
        "build": "assetpack -c .assetpack.js",
        "watch": "assetpack -c .assetpack.js -w"
    }
}
```

## Config File

AssetPack uses a config file to define what assets you want to optimise and how you want to optimise them. The config file is a JavaScript file that exports an object with the following properties:

- `entry`: The directory where your raw assets are located.
- `output`: The directory where you want your optimised assets to be outputted to.
- `plugins`: An object containing the plugins you want to use. The key is the name of the plugin, and the value is the plugin itself.
- `ignore`: an optional array of ignore patterns. Any file path matching the patterns will not be processed by assetpack
- `cache`: an optional boolean to enable or disable caching. Defaults to true.
- `logLevel`: an optional string to set the log level. Defaults to 'info'.
- `files`: an optional object to override the settings and tags of any assets. See [Config Overrides](#config-overrides) for more details.

#### Example

```js
// .assetpack.js

export default {
  entry: "./raw-assets",
  output: "./public",
  plugins: {},
};
```
