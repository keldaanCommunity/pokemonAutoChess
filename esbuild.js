const { context } = require('esbuild')
const isDev = process.argv[2] === "--dev"
const isProdBuild = process.argv[2] === "--build"

context({
  entryPoints: ["./app/public/src/index.tsx"],
  outfile: "app/public/dist/client/index.js",
  external: ["assets/*"],
  bundle: true,
  minify: isProdBuild,
  sourcemap: isProdBuild,
  target: "es2016"
}).then(context => {
  if (isDev) {
    // Enable watch mode
    context.watch()
  } else {
    // Build once and exit if not in watch mode
    context.rebuild().then(() => {
      context.dispose()
    })
  }
}).catch((error) => {
  console.error(error)
  process.exit(1)
})
