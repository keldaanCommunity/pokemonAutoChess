const fs = require('node:fs')
const path = require('node:path')
const { parseArgs, seeded, mean, writeJson } = require('./utils')
const { simulateLobby } = require('./lobby-sim')
const { getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')
const POLICIES_PATH = path.join(ROOT, 'policies/registry.json')

function run() {
  const args = parseArgs(process.argv.slice(2))
  const seed = Number(args.seed || 42)
  const lobbies = Number(args.lobbies || 200)
  const runId = args['run-id'] || 'latest'
  const policies = JSON.parse(fs.readFileSync(POLICIES_PATH, 'utf8')).map((p) => p.id)
  const rand = seeded(seed)

  const issues = []
  const aggregates = {
    placements: {},
    top4: {},
    incomeViolations: 0,
    poolViolations: 0
  }

  policies.forEach((p) => {
    aggregates.placements[p] = []
    aggregates.top4[p] = 0
  })

  for (let i = 0; i < lobbies; i++) {
    const policySet = Array.from({ length: 8 }, (_, idx) => policies[idx % policies.length]).sort(() => rand() - 0.5)
    const lobby = simulateLobby({
      players: 8,
      seed: seed + i,
      rounds: 30,
      policyName: policySet[0],
      opponentPolicies: policySet.slice(1)
    })

    let prevTotalGold = 0
    lobby.final_standings.forEach((s) => {
      aggregates.placements[s.policy_id].push(s.placement)
      if (s.top4) aggregates.top4[s.policy_id] += 1
      prevTotalGold += s.gold
      s.timeline.forEach((evt) => {
        if (evt.phase === 'economy_shop') {
          const e = evt.econ || {}
          if (![e.base, e.interest, e.streakBonus, e.income].every(Number.isFinite)) {
            aggregates.incomeViolations += 1
          }
        }
      })
    })

    if (
      !Number.isFinite(lobby.pool_remaining_summary.total_units_remaining) ||
      lobby.pool_remaining_summary.total_units_remaining < 0
    ) {
      aggregates.poolViolations += 1
    }
    if (prevTotalGold < 0) issues.push(`negative total gold at lobby ${i}`)
  }

  const report = {
    seed,
    lobbies,
    calibration: {
      income_invariants_pass: aggregates.incomeViolations === 0,
      pool_invariants_pass: aggregates.poolViolations === 0,
      mirror_symmetry: policies.map((p) => ({ policy_id: p, avg_placement: mean(aggregates.placements[p]) })),
      top4_rates: policies.map((p) => ({ policy_id: p, top4_rate: aggregates.top4[p] / Math.max(1, lobbies * (8 / policies.length)) }))
    },
    issues: [...issues]
  }

  const symmetrySpread = report.calibration.mirror_symmetry
    .map((x) => x.avg_placement)
    .reduce((acc, v, _, arr) => Math.max(acc, v - Math.min(...arr)), 0)

  if (!report.calibration.income_invariants_pass) issues.push('income invariants failed')
  if (!report.calibration.pool_invariants_pass) issues.push('pool invariants failed')
  if (symmetrySpread > 4.0) issues.push(`symmetry spread too high: ${symmetrySpread.toFixed(3)}`)

  const outDir = path.join(getResultsDir(runId), 'simulator-validation')
  fs.mkdirSync(outDir, { recursive: true })
  writeJson(path.join(outDir, 'report.json'), report)

  if (issues.length) {
    console.error('Simulator validation failed:')
    issues.forEach((i) => console.error(`- ${i}`))
    process.exit(1)
  }

  console.log(`Simulator validation passed (${lobbies} lobbies).`)
}

if (require.main === module) run()

module.exports = { run }
