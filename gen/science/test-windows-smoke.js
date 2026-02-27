const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const ROOT = path.resolve(__dirname, '../..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pokechess-smoke-'))

const env = {
  ...process.env,
  POKECHESS_HOME: tmp
}

const run = spawnSync(process.execPath, ['gen/science/cli.js', 'run', '--profile', 'fast', '--seed', '42', '--run-id', 'latest'], {
  cwd: ROOT,
  env,
  stdio: 'inherit'
})

if ((run.status ?? 2) > 1) process.exit(run.status ?? 2)

const statusPath = path.join(tmp, 'results/latest/STATUS.txt')
if (!fs.existsSync(statusPath)) {
  console.error(`Missing STATUS.txt at ${statusPath}`)
  process.exit(1)
}

const status = fs.readFileSync(statusPath, 'utf8').trim()
if (!['PASS', 'FAIL'].includes(status)) {
  console.error(`Unexpected STATUS: ${status}`)
  process.exit(1)
}

const schema = spawnSync(process.execPath, ['gen/science/validate-result-schemas.js', '--run-id', 'latest'], {
  cwd: ROOT,
  env,
  stdio: 'inherit'
})

if ((schema.status ?? 1) !== 0) process.exit(schema.status ?? 1)

console.log(`Windows smoke test passed. STATUS=${status}, dir=${tmp}`)
