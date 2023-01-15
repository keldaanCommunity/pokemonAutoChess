const { build } = require('esbuild')
const isDev = process.argv[2] === "--dev"
const isProdBuild = process.argv[2] === "--build"

build({
  entryPoints: ["./app/public/src/index.tsx"],
  outfile: "app/public/dist/client/index.js",
  external: ["assets/*"],
  bundle: true,
  minify: isProdBuild,
  sourcemap: isProdBuild,
  target: "es2016",  
  watch: isDev
}).catch((error) => {
  console.error(error)
  process.exit(1)
})
