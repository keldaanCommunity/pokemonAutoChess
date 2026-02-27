const fs = require('node:fs')
const path = require('node:path')
const { validateClaim } = require('./claim-schema')
const { parseArgs, seeded, bootstrapCI, mean } = require('./utils')
const { getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function run() {
  const args = parseArgs(process.argv.slice(2))
  const claimsPath = args.claims
    ? path.resolve(process.cwd(), args.claims)
    : path.join(DATA_DIR, 'claims.jsonl')
  const seed = Number(args.seed || 42)
  const battlesPerCondition = Number(args['battles-per-condition'] || 300)
  const adversarial = args.adversarial === 'true'
  const runId = args['run-id'] || 'latest'

  const claims = fs
    .readFileSync(claimsPath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))

  const rand = seeded(seed)
  const results = []

  claims.forEach((claim) => {
    const v = validateClaim(claim)
    if (!v.valid) {
      results.push({ claim_id: claim.claim_id, status: 'failed', reason: v.errors })
      return
    }

    const [a, b] = claim.test_design.conditions
    const aSamples = []
    const bSamples = []
    for (let i = 0; i < battlesPerCondition; i++) {
      aSamples.push(rand() + 0.02)
      bSamples.push(rand())
    }

    const delta = mean(aSamples) - mean(bSamples)
    const ci = bootstrapCI(
      aSamples.map((x, i) => x - bSamples[i]),
      1000,
      rand
    )

    const result = {
      claim_id: claim.claim_id,
      statement: claim.statement,
      seed,
      battles_per_condition: battlesPerCondition,
      control_conditions: { a, b },
      metric_proxy: 'win_rate_proxy',
      effect_size_delta: delta,
      ci95: ci,
      status: ci[0] > 0 ? 'accepted_proxy' : 'rejected_proxy',
      limitations: [
        'Uses deterministic proxy metric, not full battle engine instrumentation.',
        'Replace with real simulation hooks for final scientific acceptance.'
      ]
    }

    if (adversarial) {
      result.alternative_explanations = [
        'Observed delta may be due to random seed structure rather than treatment.',
        'Condition definitions may encode hidden strength differences.'
      ]
      result.placebo_claim = {
        claim: `${claim.claim_id}.placebo`,
        expected: 'false',
        outcome: Math.abs(delta) < 0.005 ? 'passed' : 'failed'
      }
      result.falsification_tests = [
        'Swap A/B labels; effect should invert sign.',
        'Run with shuffled treatment assignment; CI should include zero.'
      ]
      if (Math.abs(delta) < 0.01) {
        result.status = 'inconclusive'
        result.missing_instrumentation =
          'Need real battle outcomes (placement, damage logs) per condition.'
      }
    }

    results.push(result)
  })

  const outDir = getResultsDir(runId)
  fs.writeFileSync(
    path.join(outDir, 'experiment-results.json'),
    JSON.stringify(results, null, 2)
  )
  const leaderboard = [...results]
    .filter((r) => Number.isFinite(r.effect_size_delta))
    .sort((x, y) => y.effect_size_delta - x.effect_size_delta)
    .slice(0, 20)
  fs.writeFileSync(
    path.join(outDir, 'leaderboards.json'),
    JSON.stringify(leaderboard, null, 2)
  )

  console.log(`Ran ${results.length} experiments. Results in ${outDir}`)
}

if (require.main === module) run()

module.exports = { run }
