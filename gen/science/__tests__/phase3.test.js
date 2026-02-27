const test = require('node:test')
const assert = require('node:assert/strict')
const { execSync } = require('node:child_process')
const fs = require('node:fs')

const RUN_ID = 'test-phase3'

test('simulate-lobby produces deterministic placement snapshot', () => {
  execSync(
    `node gen/science/simulate-lobby.js --players 8 --seed 42 --rounds 20 --policy policy.greedy-synergy --run-id ${RUN_ID}`,
    { stdio: 'pipe' }
  )
  const lobby = JSON.parse(
    fs.readFileSync(
      `results/${RUN_ID}/lobbies/lobby-seed42-policy.greedy-synergy.json`,
      'utf8'
    )
  )
  const top3 = lobby.final_standings.slice(0, 3).map((x) => x.policy_id)
  assert.deepEqual(top3, [
    'policy.greedy-synergy',
    'policy.greedy-synergy',
    'policy.greedy-synergy'
  ])
})

test('validate-simulator passes on short run', () => {
  execSync(`node gen/science/validate-simulator.js --seed 42 --lobbies 20 --run-id ${RUN_ID}`, {
    stdio: 'pipe'
  })
})

test('policy experiments and meta report generate schema-valid outputs', () => {
  execSync('node gen/science/make-policy-claims.js', { stdio: 'pipe' })
  execSync(
    `node gen/science/run-policy-experiments.js --claims app/models/precomputed/scientific-method/policy-claims.jsonl --lobbies-per-condition 20 --seed 42 --run-id ${RUN_ID}`,
    { stdio: 'pipe' }
  )
  execSync(`node gen/science/meta-report.js --seed 42 --lobbies 30 --run-id ${RUN_ID}`, {
    stdio: 'pipe'
  })
  execSync(`node gen/science/verify-mechanics.js --seed 42 --run-id ${RUN_ID}`, { stdio: 'pipe' })
  execSync(`node gen/science/run-baselines.js --stage singles,pairs,items,item_carriers,synergy_thresholds --seed 42 --battles 10 --run-id ${RUN_ID}`, { stdio: 'pipe' })
  execSync(`node gen/science/validate-result-schemas.js --run-id ${RUN_ID}`, {
    stdio: 'pipe'
  })
})
