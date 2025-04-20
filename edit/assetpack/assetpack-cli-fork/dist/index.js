import chalk from "chalk"
import { Command } from "commander"
import findUp from "find-up"
import path from "path"
import { pathToFileURL } from "url"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const program = new Command()
program.description("Our New CLI")
program.version("0.2.0")
program.option("-c, --config <path>", "config file to use")
program.option("-w, --watch", "watch for changes")
async function main() {
  await program.parseAsync()
  const options = program.opts()
  // if config exist then use that path, otherwise use find-up
  const configPath = options.config
    ? path.resolve(process.cwd(), options.config)
    : await findUp(".assetpack.js", { cwd: process.cwd() })
  if (!configPath) {
    logEvent({
      message: "No config file found",
      level: "error"
    })
    process.exit(1)
  }
  let config
  let AssetPack
  // We try to load cjs first, if that fails we try to load esm
  try {
    /* eslint-disable @typescript-eslint/no-var-requires, global-require */
    config = require(configPath)
    if (config.default) config = config.default // <-- FORK: see https://github.com/pixijs/assetpack/issues/123
    AssetPack = require("@assetpack/core").AssetPack
    /* eslint-enable @typescript-eslint/no-var-requires, global-require */
  } catch (error) {
    if (error.code === "ERR_REQUIRE_ESM") {
      const esmLoader = dynamicImportLoader()
      const urlForConfig = pathToFileURL(configPath)
      config = (await esmLoader(urlForConfig)).default
      AssetPack = (await esmLoader("@assetpack/core")).AssetPack
    } else {
      logEvent({
        message: error.message,
        level: "error"
      })
      process.exit(1)
    }
  }
  if (!config) {
    logEvent({
      message: "Config file found, but could not be read",
      level: "error"
    })
    process.exit(1)
  }
  const assetpack = new AssetPack(config)
  if (options.watch) {
    await assetpack.watch()
  } else {
    await assetpack.run()
  }
}
function logEvent(event) {
  switch (event.level) {
    case "verbose":
    case "info":
      console.log(
        `${chalk.blue.bold("›")} Info: ${chalk.blue.bold(event.message)}`
      )
      break
    case "warn":
      console.log(
        `${chalk.yellow.bold("›")} Warn: ${chalk.yellow.bold(event.message)}`
      )
      break
    case "error":
      console.log(
        `${chalk.red.bold("›")} Error: ${chalk.red.bold(event.message)}`
      )
      process.exit(1)
      break
    default:
      throw new Error(`Unknown log level ${event.level}`)
  }
}
function dynamicImportLoader() {
  let importESM
  try {
    // eslint-disable-next-line no-new-func
    importESM = new Function("id", "return import(id);")
  } catch (e) {
    importESM = null
  }
  return importESM
}
main()
//# sourceMappingURL=index.js.map
