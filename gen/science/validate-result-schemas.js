const fs = require('node:fs')
const path = require('node:path')
const { parseArgs } = require('./utils')
const { getResultsDir } = require('./paths')

function must(condition, msg) { if (!condition) throw new Error(msg) }
function read(p) { return JSON.parse(fs.readFileSync(p, 'utf8')) }

function validateMechanicsReport(p) {
  const j = read(p)
  must(j.summary && Number.isFinite(j.summary.total), 'mechanics report summary.total required')
  must(Array.isArray(j.checks), 'mechanics report checks must be array')
}
function validateSingles(p) { const j = read(p); must(j.stage === 'singles', 'singles stage mismatch'); must(Array.isArray(j.results), 'singles results array required') }
function validatePairs(p) { const j = read(p); must(j.stage === 'pairs', 'pairs stage mismatch'); must(Array.isArray(j.edges), 'pairs edges array required') }
function validateItems(p) { const j = read(p); must(j.stage === 'items', 'items stage mismatch'); must(Array.isArray(j.results), 'items results array required') }
function validateItemCarriers(p) { const j = read(p); must(j.stage === 'item_carriers', 'item_carriers stage mismatch'); must(Array.isArray(j.results), 'item carriers required') }
function validateSynergyThresholds(p) { const j = read(p); must(j.stage === 'synergy_thresholds', 'synergy_thresholds stage mismatch'); must(Array.isArray(j.results), 'synergy thresholds required') }
function validateGraph(p) { const j = read(p); must(Array.isArray(j), 'synergy graph must be array'); must(j.every((e) => e.edge_type), 'all graph edges must have edge_type') }
function validateLobby(p) { const j = read(p); must(Array.isArray(j.final_standings), 'lobby.final_standings must be array'); must(j.final_standings.length > 0, 'lobby.final_standings empty') }
function validatePolicyExperiments(p) { const j = read(p); must(Array.isArray(j), 'policy-experiment-results must be array'); must(j.every((r) => r.claim_id), 'each policy result needs claim_id') }
function validateMetaReport(p) { const j = read(p); must(Array.isArray(j.policy_tier_list), 'meta policy_tier_list required'); must(Array.isArray(j.pivot_map), 'meta pivot_map required'); must(Array.isArray(j.common_itemizations_by_policy), 'meta common_itemizations_by_policy required') }

function run() {
  const args = parseArgs(process.argv.slice(2))
  const runId = args['run-id'] || 'latest'
  const resultDir = getResultsDir(runId)

  const checks = [
    [path.join(resultDir, 'mechanics/report.json'), validateMechanicsReport],
    [path.join(resultDir, 'baselines/singles.json'), validateSingles],
    [path.join(resultDir, 'baselines/pairs.json'), validatePairs],
    [path.join(resultDir, 'baselines/items.json'), validateItems],
    [path.join(resultDir, 'baselines/item-carriers.json'), validateItemCarriers],
    [path.join(resultDir, 'baselines/synergy-thresholds.json'), validateSynergyThresholds],
    [path.join(resultDir, 'baselines/synergy-graph.json'), validateGraph],
    [path.join(resultDir, 'lobbies/lobby-seed42-policy.greedy-synergy.json'), validateLobby],
    [path.join(resultDir, 'policy-experiment-results.json'), validatePolicyExperiments],
    [path.join(resultDir, 'meta/meta-report.json'), validateMetaReport]
  ]

  const issues = []
  for (const [p, fn] of checks) {
    if (!fs.existsSync(p)) { issues.push(`missing file: ${p}`); continue }
    try { fn(p) } catch (e) { issues.push(`${p}: ${e.message}`) }
  }

  if (issues.length) {
    console.error('Result schema validation failed:')
    issues.forEach((i) => console.error(`- ${i}`))
    process.exit(1)
  }

  console.log('Result schema validation passed.')
}

if (require.main === module) run()
module.exports = { run }
