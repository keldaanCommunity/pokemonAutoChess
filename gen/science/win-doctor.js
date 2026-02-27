const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const ROOT = path.resolve(__dirname, '../..')
const pkgPath = path.join(ROOT, 'package.json')

function checkCommand(cmd, args = ['--version']) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' })
  return {
    ok: r.status === 0,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim(),
    code: r.status
  }
}

function line(status, text) {
  const icon = status ? '✅' : '❌'
  console.log(`${icon} ${text}`)
}

function main() {
  console.log('PokeChess Windows Doctor')
  console.log(`Repo: ${ROOT}`)

  const errors = []

  const hasPackage = fs.existsSync(pkgPath)
  line(hasPackage, 'package.json found in current repo root')
  if (!hasPackage) {
    errors.push('package.json not found. Run this from the project root folder.')
  }

  let scripts = {}
  if (hasPackage) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    scripts = pkg.scripts || {}
  }

  const needsScripts = ['win:dist', 'win:bundle', 'test:windows-smoke']
  for (const script of needsScripts) {
    const ok = Boolean(scripts[script])
    line(ok, `npm script "${script}" exists`)
    if (!ok) {
      errors.push(
        `Missing npm script ${script}. You may be in an outdated copy of the project.`
      )
    }
  }

  const buildScriptPath = path.join(ROOT, 'gen/science/build-windows-dist.js')
  const buildScriptExists = fs.existsSync(buildScriptPath)
  line(buildScriptExists, 'gen/science/build-windows-dist.js exists')
  if (!buildScriptExists) {
    errors.push('Missing gen/science/build-windows-dist.js; update to latest project version.')
  }

  const node = checkCommand('node', ['-v'])
  line(node.ok, `node available${node.ok ? ` (${node.stdout})` : ''}`)
  if (!node.ok) errors.push('Node.js not found in PATH.')

  const npmCmd = checkCommand('npm.cmd', ['-v'])
  line(npmCmd.ok, `npm.cmd available${npmCmd.ok ? ` (${npmCmd.stdout})` : ''}`)
  if (!npmCmd.ok) {
    const npm = checkCommand('npm', ['-v'])
    line(npm.ok, `npm available${npm.ok ? ` (${npm.stdout})` : ''}`)
    if (!npm.ok) errors.push('npm not found. Use npm.cmd in PowerShell or install Node.js LTS.')
  }

  if (errors.length > 0) {
    console.log('\nIssues found:')
    errors.forEach((e) => console.log(`- ${e}`))
    console.log('\nSuggested commands (PowerShell):')
    console.log('  npm.cmd run win:dist')
    console.log('  cd .\\dist\\PokeChessScience')
    console.log('  .\\pokechess-science.cmd')
    process.exit(1)
  }

  console.log('\nEnvironment looks good. You can run:')
  console.log('  npm.cmd run win:dist')
  console.log('  cd .\\dist\\PokeChessScience')
  console.log('  .\\pokechess-science.cmd')
}

main()
