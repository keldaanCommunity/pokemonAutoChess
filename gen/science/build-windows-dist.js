const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '../..')
const DIST = path.join(ROOT, 'dist/PokeChessScience')

function cp(src, dst) {
  const st = fs.statSync(src)
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true })
    for (const e of fs.readdirSync(src)) cp(path.join(src, e), path.join(dst, e))
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true })
    fs.copyFileSync(src, dst)
  }
}

function rm(p) {
  if (!fs.existsSync(p)) return
  const st = fs.statSync(p)
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(p)) rm(path.join(p, e))
    fs.rmdirSync(p)
  } else fs.unlinkSync(p)
}

function run() {
  rm(DIST)
  fs.mkdirSync(DIST, { recursive: true })

  cp(path.join(ROOT, 'gen/science'), path.join(DIST, 'app/science'))
  cp(path.join(ROOT, 'gen/extract-scientific-dataset.js'), path.join(DIST, 'app/extract-scientific-dataset.js'))
  cp(path.join(ROOT, 'policies/registry.json'), path.join(DIST, 'policies/registry.json'))
  cp(path.join(ROOT, 'goals.json'), path.join(DIST, 'goals.json'))

  // data payload used by the CLI/runtime
  cp(path.join(ROOT, 'app/models/precomputed/pokemons-data.csv'), path.join(DIST, 'data/pokemons-data.csv'))
  cp(path.join(ROOT, 'app/public/dist/client/locales/en/translation.json'), path.join(DIST, 'data/translation.en.json'))
  cp(path.join(ROOT, 'app/config/game/synergies.ts'), path.join(DIST, 'data/synergies.ts'))
  cp(path.join(ROOT, 'app/models/effects.ts'), path.join(DIST, 'data/effects.ts'))
  cp(path.join(ROOT, 'app/models/precomputed/scientific-method'), path.join(DIST, 'data/scientific-method'))

  fs.mkdirSync(path.join(DIST, 'results'), { recursive: true })

  const portableNode = process.env.POKECHESS_PORTABLE_NODE_DIR
  if (portableNode && fs.existsSync(portableNode)) {
    cp(portableNode, path.join(DIST, 'node'))
  } else {
    fs.mkdirSync(path.join(DIST, 'node'), { recursive: true })
    fs.writeFileSync(
      path.join(DIST, 'node/README.txt'),
      'Place portable Node runtime here as node/node.exe, or set POKECHESS_PORTABLE_NODE_DIR before running win:dist.'
    )
  }

  fs.writeFileSync(
    path.join(DIST, 'pokechess-science.cmd'),
    [
      '@echo off',
      'setlocal',
      'set ROOT=%~dp0',
      'set POKECHESS_HOME=%ROOT%',
      'set POKECHESS_DATA=%ROOT%data',
      'if exist "%ROOT%node\\node.exe" (',
      '  "%ROOT%node\\node.exe" "%ROOT%app\\science\\cli.js" run --profile fast --seed 42 --run-id latest',
      ') else (',
      '  echo Missing portable Node runtime at %ROOT%node\\node.exe',
      '  exit /b 2',
      ')',
      'exit /b %ERRORLEVEL%'
    ].join('\r\n') + '\r\n'
  )

  console.log(`Windows dist created at ${DIST}`)
}

run()
