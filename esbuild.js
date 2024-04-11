const fs = require("fs")
const { context } = require("esbuild")
const dotenv = require("dotenv")

dotenv.config()

const isDev = process.argv[2] === "--dev"
const isProdBuild = process.argv[2] === "--build"

context({
  entryPoints: ["./app/public/src/index.tsx"],
  outfile: "app/public/dist/client/index.js",
  external: ["assets/*"],
  bundle: true,
  metafile: true,
  minify: isProdBuild,
  sourcemap: isProdBuild,
  target: "es2016",
  define: {
    "process.env.FIREBASE_API_KEY": `"${process.env.FIREBASE_API_KEY}"`,
    "process.env.FIREBASE_AUTH_DOMAIN": `"${process.env.FIREBASE_AUTH_DOMAIN}"`,
    "process.env.FIREBASE_PROJECT_ID": `"${process.env.FIREBASE_PROJECT_ID}"`,
    "process.env.FIREBASE_STORAGE_BUCKET": `"${process.env.FIREBASE_STORAGE_BUCKET}"`,
    "process.env.FIREBASE_MESSAGING_SENDER_ID": `"${process.env.FIREBASE_MESSAGING_SENDER_ID}"`,
    "process.env.FIREBASE_APP_ID": `"${process.env.FIREBASE_APP_ID}"`
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
