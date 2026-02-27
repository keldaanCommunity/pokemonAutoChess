const fs = require('node:fs')
const path = require('node:path')
const { parseArgs, writeJson } = require('./utils')
const { simulateLobby } = require('./lobby-sim')
const { getResultsDir } = require('./paths')

function run() {
  const args = parseArgs(process.argv.slice(2))
  const players = Number(args.players || 8)
  const seed = Number(args.seed || 42)
  const rounds = Number(args.rounds || 30)
  const policy = args.policy || 'policy.greedy-synergy'
  const runId = args['run-id'] || 'latest'

  const lobby = simulateLobby({ players, seed, rounds, policyName: policy })

  const outDir = path.join(getResultsDir(runId), 'lobbies')
  fs.mkdirSync(outDir, { recursive: true })
  const out = path.join(
    outDir,
    `lobby-seed${seed}-${policy.replace(/[^a-z0-9_.-]/gi, '_')}.json`
  )
  writeJson(out, lobby)
  console.log(`Lobby simulation written to ${out}`)
}

if (require.main === module) run()

module.exports = { run }
