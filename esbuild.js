const fs = require("fs")
const { context } = require("esbuild")
const dotenv = require("dotenv")

dotenv.config()

const isDev = process.argv[2] === "--dev"
const isProdBuild = process.argv[2] === "--build"

let hashIndexPlugin = {
  name: "hash-index-plugin",
  setup(build) {
    build.onStart(() => {
      const files = fs.readdirSync("app/public/dist/client")
      files.forEach((file) => {
        // remove old files
        if (file.startsWith("index-") && file.endsWith(".js")) {
          fs.unlinkSync(`app/public/dist/client/${file}`)
        }
        if (file.startsWith("index-") && file.endsWith(".css")) {
          fs.unlinkSync(`app/public/dist/client/${file}`)
        }
      })

      const translations = fs.globSync(
        `app/public/dist/client/locales/*/*.json`
      )
      translations.forEach((file) => {
        // remove old files
        fs.unlinkSync(file)
      })
    })
    build.onEnd((result) => {
      if (result.errors.length > 0) {
        console.log(`build ended with ${result.errors.length} errors`)
      }
      updateHashedFilesInIndex()
    })
  }
}

context({
  entryPoints: ["./app/public/src/index.tsx"],
  entryNames: "[dir]/[name]-[hash]",
  assetNames: "[dir]/[name]-[hash]",
  outfile: "app/public/dist/client/index.js",
  external: ["assets/*"],
  bundle: true,
  metafile: true,
  minify: isProdBuild,
  sourcemap: isProdBuild,
  plugins: [hashIndexPlugin],
  target: "es2016",
  define: {
    "process.env.FIREBASE_API_KEY": `"${process.env.FIREBASE_API_KEY}"`,
    "process.env.FIREBASE_AUTH_DOMAIN": `"${process.env.FIREBASE_AUTH_DOMAIN}"`,
    "process.env.FIREBASE_PROJECT_ID": `"${process.env.FIREBASE_PROJECT_ID}"`,
    "process.env.FIREBASE_STORAGE_BUCKET": `"${process.env.FIREBASE_STORAGE_BUCKET}"`,
    "process.env.FIREBASE_MESSAGING_SENDER_ID": `"${process.env.FIREBASE_MESSAGING_SENDER_ID}"`,
    "process.env.FIREBASE_APP_ID": `"${process.env.FIREBASE_APP_ID}"`,
    "process.env.DISCORD_SERVER": `"${process.env.DISCORD_SERVER}"`,
    "process.env.MIN_HUMAN_PLAYERS": `"${process.env.MIN_HUMAN_PLAYERS}"`
  }
})
  .then((context) => {
    if (isDev) {
      // Enable watch mode
      context.watch()
    } else {
      // Build once and exit if not in watch mode
      context.rebuild().then((result) => {
        if (result.metafile) {
          // use https://esbuild.github.io/analyze/ to analyse
          fs.writeFileSync(
            "app/public/dist/client/esbuild.meta.json",
            JSON.stringify(result.metafile)
          )
        }
        context.dispose()
      })
    }
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

function updateHashedFilesInIndex() {
  //update hash in index.html
  const fs = require("fs")
  const path = require("path")

  const distDir = path.join(__dirname, "app/public/dist/client")
  const htmlFile = path.join(__dirname, "app/views/index.html")
  const htmlOutputFile = path.join(distDir, "index.html")

  // Find the hashed script file
  const scriptFile = fs
    .readdirSync(distDir)
    .find((file) => file.startsWith("index-") && file.endsWith(".js"))
  const cssFile = fs
    .readdirSync(distDir)
    .find((file) => file.startsWith("index-") && file.endsWith(".css"))

  if (scriptFile) {
    // Read the HTML file
    let htmlContent = fs.readFileSync(htmlFile, "utf8")

    // Replace the placeholder with the actual script tag
    htmlContent = htmlContent
      .replace(
        '<script src="index.js" defer></script>',
        `<script src="${scriptFile}" defer></script>`
      )
      .replace(
        `<link rel="stylesheet" type="text/css" href="index.css" />`,
        `<link rel="stylesheet" type="text/css" href="${cssFile}">`
      )

    // Write the updated HTML back to the file
    fs.writeFileSync(htmlOutputFile, htmlContent, "utf8")

    // Cache burst translation files with index.js hash
    const hash = scriptFile.split(".").at(-2).replace("index-", "")
    const sourceDir = "app/public/src"
    const targetDir = "app/public/dist/client"

    const newTranslations = fs
      .globSync(`${sourceDir}/locales/*/translation.json`)
      .map((path) => path.replaceAll("\\", "/"))

    for (const file of newTranslations) {
      const targetFilename = `${file.replace(sourceDir, "").replace(".json", "")}-${hash}.json`
      // copy and create folder if needed
      const targetDirPath = path.dirname(`${targetDir}/${targetFilename}`)
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true })
      }
      fs.copyFileSync(file, `${targetDir}/${targetFilename}`)
      console.log(`Copied and hashed ${file} to ${targetFilename}`)
    }
  } else {
    console.error("Hashed entry files not found.")
  }
}
