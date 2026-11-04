"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  pixiTexturePacker: () => pixiTexturePacker,
  texturePacker: () => texturePacker
});
module.exports = __toCommonJS(index_exports);
var import_free_tex_packer_core = require("free-tex-packer-core");
var import_fs = require("fs");
var import_glob = require("glob");
var import_node_path = __toESM(require("node:path"), 1);
function texturePacker(options) {
  const defaultOptions = {
    tags: {
      tps: "tps",
      fix: "fix",
      jpg: "jpg",
      ...options?.tags
    },
    resolutionOptions: {
      template: "@%%x",
      resolutions: { default: 1, low: 0.5 },
      fixedResolution: "default",
      maximumTextureSize: 4096,
      ...options?.resolutionOptions
    },
    texturePacker: {
      padding: 2,
      packer: "MaxRectsPacker",
      packerMethod: "Smart",
      ...options?.texturePacker
    }
  };
  return {
    folder: true,
    name: "texture-packer",
    defaultOptions,
    tags: defaultOptions.tags,
    test(asset, processorOrOptions, legacyOptions) {
      const isLegacy = isLegacyProcessor(processorOrOptions);
      const resolvedOptions = resolveOptions(
        defaultOptions,
        isLegacy ? legacyOptions : processorOrOptions
      );
      if (isLegacy) {
        return asset.isFolder && hasLegacyTag(
          asset,
          "file",
          resolvedOptions.tags.tps
        );
      }
      return asset.isFolder && Boolean(asset.allMetaData?.[resolvedOptions.tags.tps]);
    },
    async transform(asset, processorOrOptions, legacyOptionsOrPipeSystem) {
      if (isLegacyProcessor(processorOrOptions)) {
        return transformLegacy(
          asset,
          processorOrOptions,
          resolveOptions(defaultOptions, legacyOptionsOrPipeSystem)
        );
      }
      return transformAsset(
        asset,
        resolveOptions(defaultOptions, processorOrOptions)
      );
    }
  };
}
function hasLegacyTag(tree, type, tag) {
  if (type === "file") return Boolean(tree.fileTags?.[tag]);
  return Boolean(tree.fileTags?.[tag] || tree.pathTags?.[tag]);
}
function isLegacyProcessor(value) {
  return typeof value?.inputToOutput === "function";
}
function resolveOptions(defaultOptions, overrides = {}) {
  return {
    tags: { ...defaultOptions.tags, ...overrides.tags },
    resolutionOptions: {
      ...defaultOptions.resolutionOptions,
      ...overrides.resolutionOptions
    },
    texturePacker: {
      ...defaultOptions.texturePacker,
      ...overrides.texturePacker
    }
  };
}
async function transformLegacy(tree, processor, options) {
  const outputDir = processor.inputToOutput(tree.path);
  const { outputs } = await packAssets(
    tree,
    import_node_path.default.basename(outputDir),
    options,
    hasLegacyTag(tree, "path", options.tags.fix),
    hasLegacyTag(tree, "file", options.tags.jpg)
  );
  if (outputs.length === 0) return;
  for (const output of outputs) {
    const outputPath = import_node_path.default.posix.join(
      outputDir.replace(/\\/g, "/"),
      output.name
    );
    processor.saveToOutput({
      tree: void 0,
      outputOptions: {
        outputPathOverride: outputPath,
        outputData: output.buffer
      }
    });
    processor.addToTree({
      tree,
      outputOptions: {
        outputPathOverride: outputPath
      },
      transformId: "tps",
      transformData: {
        prefix: output.template
      }
    });
  }
}
async function transformAsset(asset, options) {
  asset.skipChildren();
  const outputDirName = stripTags(asset.filename);
  const { outputs } = await packAssets(
    asset,
    outputDirName,
    options,
    Boolean(asset.allMetaData?.[options.tags.fix]),
    Boolean(asset.allMetaData?.[options.tags.jpg])
  );
  const { createNewAssetAt } = await import("@assetpack/core");
  return outputs.map((output) => {
    const outputAsset = createNewAssetAt(asset, output.name);
    outputAsset.buffer = output.buffer;
    outputAsset.transformData.prefix = output.template;
    if (import_node_path.default.extname(output.name) !== ".json") {
      outputAsset.metaData.mIgnore = true;
    }
    return outputAsset;
  });
}
function stripTags(name) {
  let result = "";
  let position = 0;
  while (position < name.length) {
    const start = name.indexOf("{", position);
    if (start === -1) break;
    const end = name.indexOf("}", start + 1);
    if (end === -1) break;
    result += name.slice(position, start);
    position = end + 1;
  }
  return result + name.slice(position);
}
async function packAssets(asset, outputDirName, options, isFixed, isJpg) {
  const { resolutionOptions } = options;
  const largestResolution = Math.max(
    ...Object.values(resolutionOptions.resolutions)
  );
  const resolutionHash = isFixed ? {
    default: resolutionOptions.resolutions[resolutionOptions.fixedResolution]
  } : resolutionOptions.resolutions;
  const files = await (0, import_glob.glob)(`${asset.path}/**/*.{jpg,png,gif}`);
  const imagesToPack = files.map((file) => ({
    path: file,
    contents: (0, import_fs.readFileSync)(file)
  }));
  if (imagesToPack.length === 0) {
    return { outputs: [] };
  }
  const outputs = [];
  for (const resolution of Object.values(resolutionHash)) {
    const template = resolutionOptions.template.replace(
      "%%",
      resolution.toString()
    );
    const packed = await (0, import_free_tex_packer_core.packAsync)(imagesToPack, {
      textureName: outputDirName,
      textureFormat: isJpg ? "jpg" : "png",
      width: resolutionOptions.maximumTextureSize,
      height: resolutionOptions.maximumTextureSize,
      ...options.texturePacker,
      scale: resolution / largestResolution
    });
    outputs.push(
      ...await processTPSFiles(packed, {
        inputDir: asset.path,
        template,
        originalScale: largestResolution,
        exporter: options.texturePacker.exporter
      })
    );
  }
  return { outputs };
}
function pixiTexturePacker(options) {
  return texturePacker({
    ...options,
    texturePacker: {
      ...options?.texturePacker,
      exporter: "Pixi"
    }
  });
}
async function processTPSFiles(files, options) {
  const outputs = [];
  for (const item of files) {
    const templateName = item.name.replace(
      /(\.[\w\d_-]+)$/i,
      `${options.template}$1`
    );
    let outputBuffer = item.buffer;
    if (import_node_path.default.extname(templateName) === ".json") {
      const json = JSON.parse(item.buffer.toString("utf8"));
      const normalizedDir = options.inputDir.replace(/\\/g, "/");
      if (options.exporter === "Phaser3") {
        json.textures[0].frames.forEach((frame, i) => {
          frame.filename = frame.filename.replace(`${normalizedDir}/`, "");
        });
        json.textures[0].image = json.textures[0].image.replace(
          /(\.[\w\d_-]+)$/i,
          `${options.template}$1`
        );
        json.textures[0].scale *= options.originalScale;
      } else {
        const newFrames = {};
        for (const i in json.frames) {
          const frameName = i.replace(`${normalizedDir}/`, "");
          newFrames[frameName] = json.frames[i];
        }
        json.frames = newFrames;
        json.meta.image = json.meta.image.replace(
          /(\.[\w\d_-]+)$/i,
          `${options.template}$1`
        );
        json.meta.scale *= options.originalScale;
      }
      outputBuffer = Buffer.from(JSON.stringify(json));
    }
    outputs.push({
      name: templateName,
      buffer: outputBuffer,
      template: options.template
    });
  }
  return outputs;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  pixiTexturePacker,
  texturePacker
});
