const fs = require('node:fs')
const path = require('node:path')
const { parseArgs, bootstrapCI, seeded, mean, writeJson } = require('./utils')
const { validateClaim } = require('./claim-schema')
const { simulateLobby } = require('./lobby-sim')
const { getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function parseJsonl(file) {
  return fs
    .readFileSync(file, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((l) => JSON.parse(l))
}

function runPolicyCondition(policyId, lobbies, seed, opponents) {
  const placements = []
  const top4 = []
  for (let i = 0; i < lobbies; i++) {
    const lobby = simulateLobby({
      players: 8,
      seed: seed + i,
      rounds: 30,
      policyName: policyId,
      opponentPolicies: opponents
    })
    const me = lobby.final_standings.find((p) => p.player_id === 'P1')
    placements.push(me.placement)
    top4.push(me.top4 ? 1 : 0)
  }
  return { placements, top4 }
}

function run() {
  const args = parseArgs(process.argv.slice(2))
  const claimsPath = args.claims
    ? path.resolve(process.cwd(), args.claims)
    : path.join(DATA_DIR, 'policy-claims.jsonl')
  const lobbiesPerCondition = Number(args['lobbies-per-condition'] || 300)
  const seed = Number(args.seed || 42)
  const runId = args['run-id'] || 'latest'
  const rand = seeded(seed)

  const claims = parseJsonl(claimsPath)
  const results = []

  claims.forEach((claim, idx) => {
    const v = validateClaim(claim)
    if (!v.valid) {
      results.push({ claim_id: claim.claim_id, status: 'invalid', errors: v.errors })
      return
    }

    const c0 = claim.test_design.conditions[0]
    const c1 = claim.test_design.conditions[1]
    const pA = c0.policy_id || c0.policy || c0.id
    const pB = c1.policy_id || c1.policy || c1.id
    const opponents =
      c0.opponent_policy_set || [
        'policy.greedy-synergy',
        'policy.value-curve',
        'policy.forced-comp',
        'policy.greedy-synergy',
        'policy.value-curve',
        'policy.forced-comp',
        'policy.greedy-synergy'
      ]

    const a = runPolicyCondition(pA, lobbiesPerCondition, seed + idx * 10000, opponents)
    const b = runPolicyCondition(
      pB,
      lobbiesPerCondition,
      seed + idx * 10000 + 5000,
      opponents
    )

    const deltaTop4Samples = a.top4.map((x, i) => x - (b.top4[i] || 0))
    const deltaPlacementSamples = a.placements.map((x, i) => (b.placements[i] || 0) - x)
    const ciTop4 = bootstrapCI(deltaTop4Samples, 1000, rand)
    const ciPlacement = bootstrapCI(deltaPlacementSamples, 1000, rand)

    results.push({
      claim_id: claim.claim_id,
      statement: claim.statement,
      condition_a: pA,
      condition_b: pB,
      lobbies_per_condition: lobbiesPerCondition,
      top4_rate_a: mean(a.top4),
      top4_rate_b: mean(b.top4),
      avg_placement_a: mean(a.placements),
      avg_placement_b: mean(b.placements),
      delta_top4: mean(deltaTop4Samples),
      delta_avg_placement: mean(deltaPlacementSamples),
      ci95_top4: ciTop4,
      ci95_avg_placement: ciPlacement,
      status: ciTop4[0] > 0 ? 'accepted' : 'inconclusive_or_rejected'
    })
  })

  const outDir = getResultsDir(runId)
  writeJson(path.join(outDir, 'policy-experiment-results.json'), results)
  console.log(`Policy experiments complete: ${results.length} claims`)
}

if (require.main === module) run()

module.exports = { run }
