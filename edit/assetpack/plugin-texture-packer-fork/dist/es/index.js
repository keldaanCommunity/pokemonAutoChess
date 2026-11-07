import { packAsync } from "free-tex-packer-core"
import { readFileSync } from "fs"
import { glob } from "glob"
import path from "node:path"

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
  }
  return {
    folder: true,
    name: "texture-packer",
    defaultOptions,
    tags: defaultOptions.tags,
    test(asset, processorOrOptions, legacyOptions) {
      const isLegacy = isLegacyProcessor(processorOrOptions)
      const resolvedOptions = resolveOptions(
        defaultOptions,
        isLegacy ? legacyOptions : processorOrOptions
      )

      if (isLegacy) {
        return asset.isFolder && hasLegacyTag(
          asset,
          "file",
          resolvedOptions.tags.tps
        )
      }

      return (
        asset.isFolder &&
        Boolean(asset.allMetaData?.[resolvedOptions.tags.tps])
      )
    },
    async transform(asset, processorOrOptions, legacyOptionsOrPipeSystem) {
      if (isLegacyProcessor(processorOrOptions)) {
        return transformLegacy(
          asset,
          processorOrOptions,
          resolveOptions(defaultOptions, legacyOptionsOrPipeSystem)
        )
      }

      return transformAsset(
        asset,
        resolveOptions(defaultOptions, processorOrOptions)
      )
    }
  }
}

function hasLegacyTag(tree, type, tag) {
  if (type === "file") return Boolean(tree.fileTags?.[tag])
  return Boolean(tree.fileTags?.[tag] || tree.pathTags?.[tag])
}

function isLegacyProcessor(value) {
  return typeof value?.inputToOutput === "function"
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
  }
}

async function transformLegacy(tree, processor, options) {
  const outputDir = processor.inputToOutput(tree.path)
  const { outputs } = await packAssets(
    tree,
    path.basename(outputDir),
    options,
    hasLegacyTag(tree, "path", options.tags.fix),
    hasLegacyTag(tree, "file", options.tags.jpg)
  )

  if (outputs.length === 0) return

  for (const output of outputs) {
    const outputPath = path.posix.join(
      outputDir.replace(/\\/g, "/"),
      output.name
    )
    processor.saveToOutput({
      tree: undefined,
      outputOptions: {
        outputPathOverride: outputPath,
        outputData: output.buffer
      }
    })
    processor.addToTree({
      tree,
      outputOptions: {
        outputPathOverride: outputPath
      },
      transformId: "tps",
      transformData: {
        prefix: output.template
      }
    })
  }
}

async function transformAsset(asset, options) {
  asset.skipChildren()
  const outputDirName = stripTags(asset.filename)
  const { outputs } = await packAssets(
    asset,
    outputDirName,
    options,
    Boolean(asset.allMetaData?.[options.tags.fix]),
    Boolean(asset.allMetaData?.[options.tags.jpg])
  )
  const { createNewAssetAt } = await import("@assetpack/core")

  return outputs.map((output) => {
    const outputAsset = createNewAssetAt(asset, output.name)
    outputAsset.buffer = output.buffer
    outputAsset.transformData.prefix = output.template
    if (path.extname(output.name) !== ".json") {
      outputAsset.metaData.mIgnore = true
    }
    return outputAsset
  })
}

function stripTags(name) {
  let result = ""
  let position = 0
  while (position < name.length) {
    const start = name.indexOf("{", position)
    if (start === -1) break
    const end = name.indexOf("}", start + 1)
    if (end === -1) break
    result += name.slice(position, start)
    position = end + 1
  }
  return result + name.slice(position)
}

async function packAssets(asset, outputDirName, options, isFixed, isJpg) {
  const { resolutionOptions } = options
  const largestResolution = Math.max(
    ...Object.values(resolutionOptions.resolutions)
  )
  const resolutionHash = isFixed
    ? {
        default:
          resolutionOptions.resolutions[resolutionOptions.fixedResolution]
      }
    : resolutionOptions.resolutions
  const files = await glob(`${asset.path}/**/*.{jpg,png,gif}`)
  const imagesToPack = files.map((file) => ({
    path: file,
    contents: readFileSync(file)
  }))

  if (imagesToPack.length === 0) {
    return { outputs: [] }
  }

  const outputs = []
  for (const resolution of Object.values(resolutionHash)) {
    const template = resolutionOptions.template.replace(
      "%%",
      resolution.toString()
    )
    const packed = await packAsync(imagesToPack, {
      textureName: outputDirName,
      textureFormat: isJpg ? "jpg" : "png",
      width: resolutionOptions.maximumTextureSize,
      height: resolutionOptions.maximumTextureSize,
      ...options.texturePacker,
      scale: resolution / largestResolution
    })
    outputs.push(
      ...(await processTPSFiles(packed, {
        inputDir: asset.path,
        template,
        originalScale: largestResolution,
        exporter: options.texturePacker.exporter
      }))
    )
  }

  return { outputs }
}

function pixiTexturePacker(options) {
  return texturePacker({
    ...options,
    texturePacker: {
      ...options?.texturePacker,
      exporter: "Pixi"
    }
  })
}

async function processTPSFiles(files, options) {
  const outputs = []
  for (const item of files) {
    const templateName = item.name.replace(
      /(\.[\w\d_-]+)$/i,
      `${options.template}$1`
    )
    let outputBuffer = item.buffer
    if (path.extname(templateName) === ".json") {
      const json = JSON.parse(item.buffer.toString("utf8"))
      const normalizedDir = options.inputDir.replace(/\\/g, "/")

      if (options.exporter === "Phaser3") {
        json.textures[0].frames.forEach((frame, i) => {
          frame.filename = frame.filename.replace(`${normalizedDir}/`, "")
        })
        json.textures[0].image = json.textures[0].image.replace(
          /(\.[\w\d_-]+)$/i,
          `${options.template}$1`
        )
        json.textures[0].scale *= options.originalScale
      } else {
        const newFrames = {}
        for (const i in json.frames) {
          const frameName = i.replace(`${normalizedDir}/`, "")
          newFrames[frameName] = json.frames[i]
        }
        json.frames = newFrames
        json.meta.image = json.meta.image.replace(
          /(\.[\w\d_-]+)$/i,
          `${options.template}$1`
        )
        json.meta.scale *= options.originalScale
      }

      outputBuffer = Buffer.from(JSON.stringify(json))
    }
    outputs.push({
      name: templateName,
      buffer: outputBuffer,
      template: options.template
    })
  }
  return outputs
}

export { pixiTexturePacker, texturePacker }
//# sourceMappingURL=index.js.map
