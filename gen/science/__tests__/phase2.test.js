const test = require('node:test')
const assert = require('node:assert/strict')
const { execSync } = require('node:child_process')
const fs = require('node:fs')

const RUN_ID = 'test-phase2'

test('verify-mechanics generates deterministic report snapshot subset', () => {
  execSync(`node gen/science/verify-mechanics.js --seed 7 --run-id ${RUN_ID}`, {
    stdio: 'pipe'
  })
  const report = JSON.parse(
    fs.readFileSync(`results/${RUN_ID}/mechanics/report.json`, 'utf8')
  )
  assert.ok(report.summary.total > 0)
  assert.equal(report.summary.failed, 0)
  assert.ok(report.checks.slice(0, 3).every((c) => c.status === 'PASS'))
})

test('result schema validator passes after generating baseline outputs', () => {
  execSync(`node gen/science/run-baselines.js --stage singles,pairs,items,item_carriers,synergy_thresholds --seed 7 --battles 20 --run-id ${RUN_ID}`, { stdio: 'pipe' })
  execSync(`node gen/science/simulate-lobby.js --players 8 --seed 42 --rounds 20 --policy policy.greedy-synergy --run-id ${RUN_ID}`, { stdio: 'pipe' })
  execSync(`node gen/science/make-policy-claims.js --run-id ${RUN_ID}`, { stdio: 'pipe' })
  execSync(`node gen/science/run-policy-experiments.js --claims app/models/precomputed/scientific-method/policy-claims.jsonl --lobbies-per-condition 10 --seed 7 --run-id ${RUN_ID}`, { stdio: 'pipe' })
  execSync(`node gen/science/meta-report.js --seed 7 --lobbies 10 --run-id ${RUN_ID}`, {
    stdio: 'pipe'
  })
  execSync(`node gen/science/validate-result-schemas.js --run-id ${RUN_ID}`, {
    stdio: 'pipe'
  })
})
