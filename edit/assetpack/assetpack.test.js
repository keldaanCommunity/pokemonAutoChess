import assert from "node:assert/strict"
import { createRequire } from "node:module"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { AssetPack } from "@assetpack/core"
import { texturePacker } from "./plugin-texture-packer-fork/dist/es/index.js"

const require = createRequire(import.meta.url)
const parseAtlas = require(path.join(
  path.dirname(require.resolve("phaser/package.json")),
  "src",
  "textures",
  "parsers",
  "JSONArray.js"
))
const sprite = fileURLToPath(
  new URL("../../app/public/src/assets/item%7Btps%7D/ABILITY_SHIELD.png", import.meta.url)
)
const configUrl = new URL("./.assetpack.js", import.meta.url)

test("strips tags from atlas names without rescanning unmatched braces", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pac-packer-name-test-"))
  try {
    fs.copyFileSync(sprite, path.join(root, "sprite.png"))
    const pipe = texturePacker({
      texturePacker: { exporter: "Phaser3" },
      resolutionOptions: { resolutions: { default: 1 }, template: "" }
    })
    const cases = [
      ["pack{tps}{fix}", "pack"],
      ["pack{{nested}suffix", "packsuffix"],
      ["pack{tps}tail{unclosed", "packtail{unclosed"],
      [`pack${"{".repeat(50000)}`, `pack${"{".repeat(50000)}`]
    ]
    for (const [filename, expected] of cases) {
      const asset = {
        path: root.replace(/\\/g, "/"),
        directory: root,
        rootAsset: { path: root },
        filename,
        transformName: "texture-packer",
        allMetaData: {},
        skipChildren() {}
      }
      const outputs = await pipe.transform(asset, pipe.defaultOptions)
      assert.ok(
        outputs.some((output) => path.basename(output.path) === `${expected}.json`),
        `Unexpected atlas name for ${filename.slice(0, 40)}`
      )
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test("generates Phaser atlases, their index and compressed Pokémon data", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pac-assetpack-test-"))
  const originalCwd = process.cwd()
  const assetpackDir = path.join(root, "edit", "assetpack")
  const entry = path.join(root, "app", "public", "src", "assets")
  const output = path.join(root, "app", "public", "dist", "client", "assets")
  const mkdir = (directory) => fs.mkdirSync(directory, { recursive: true })
  const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value))

  try {
    mkdir(assetpackDir)
    mkdir(path.join(entry, "item{tps}"))
    mkdir(path.join(entry, "nested", "effects{tps}", "spark"))
    mkdir(path.join(entry, "pokemons"))
    mkdir(path.join(root, "app", "public", "dist", "client"))
    fs.copyFileSync(sprite, path.join(entry, "item{tps}", "ABILITY_SHIELD.png"))
    fs.copyFileSync(sprite, path.join(entry, "nested", "effects{tps}", "spark", "000.png"))
    fs.copyFileSync(sprite, path.join(entry, "nested", "effects{tps}", "spark", "001.png"))
    writeJson(path.join(root, "package.json"), { version: "1.2.3" })
    writeJson(path.join(entry, "atlas.json"), {
      version: "1.2.3.2000-01-01.0",
      packs: { "nested/effects": { anims: { spark: { fps: 12, frames: 1 } } } }
    })
    writeJson(path.join(entry, "pokemons", "0001.json"), {
      textures: [{
        image: "0001.png",
        size: { w: 32, h: 32 },
        scale: 1,
        frames: [{
          filename: "walk/000.png",
          sourceSize: { w: 8, h: 8 },
          spriteSourceSize: { x: 0, y: 0, w: 8, h: 8 },
          frame: { x: 0, y: 0, w: 8, h: 8 }
        }]
      }]
    })
    fs.writeFileSync(path.join(root, "app", "public", "dist", "client", "sw.js"), 'const CACHE_NAME = "CACHE v1.2.3.2000-01-01.0"')

    process.chdir(assetpackDir)
    const config = (await import(configUrl.href)).default
    await new AssetPack(config).run()

    const index = JSON.parse(fs.readFileSync(path.join(entry, "atlas.json"), "utf8"))
    assert.deepEqual(index.packs["nested/effects"].anims.spark, { fps: 12, frames: 2 })
    assert.equal(index.packs["nested/effects"].name, "effects")
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(output, "atlas.json"), "utf8")), index)
    assert.equal(JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).assetsVersion, index.version)
    assert.ok(fs.readFileSync(path.join(root, "app", "public", "dist", "client", "sw.js"), "utf8").includes(index.version))
    assert.ok(fs.existsSync(path.join(output, "item", "ABILITY_SHIELD.png")))

    const atlasDir = path.join(output, "nested")
    const atlas = JSON.parse(fs.readFileSync(path.join(atlasDir, "effects.json"), "utf8"))
    const names = []
    const texture = {
      source: [{ width: 1024, height: 1024 }],
      customData: {},
      add(name) {
        names.push(name)
        return { setTrim() {}, updateUVsInverted() {} }
      }
    }
    for (const page of atlas.textures) {
      assert.ok(fs.existsSync(path.join(atlasDir, page.image)))
      parseAtlas(texture, 0, page)
    }
    assert.ok(names.includes("spark/000.png"))
    assert.ok(names.includes("spark/001.png"))
    const compressed = JSON.parse(fs.readFileSync(path.join(output, "pokemons", "0001.json"), "utf8"))
    assert.deepEqual(compressed.a.walk["000.png"], [8, 8, 0, 0, 8, 8, 0, 0, 8, 8])

    fs.unlinkSync(path.join(entry, "nested", "effects{tps}", "spark", "001.png"))
    await new AssetPack(config).run()
    const updatedIndex = JSON.parse(fs.readFileSync(path.join(entry, "atlas.json"), "utf8"))
    assert.deepEqual(updatedIndex.packs["nested/effects"].anims.spark, { fps: 12, frames: 1 })
    const updatedAtlas = JSON.parse(fs.readFileSync(path.join(atlasDir, "effects.json"), "utf8"))
    assert.deepEqual(updatedAtlas.textures.flatMap((page) => page.frames.map((frame) => frame.filename)), ["spark/000.png"])
  } finally {
    process.chdir(originalCwd)
    fs.rmSync(root, { recursive: true, force: true })
  }
})
