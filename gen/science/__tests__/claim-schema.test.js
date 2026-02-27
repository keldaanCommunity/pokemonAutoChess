const test = require('node:test')
const assert = require('node:assert/strict')
const { validateClaim } = require('../claim-schema')

test('validateClaim accepts complete claim', () => {
  const claim = {
    claim_id: 'c1',
    statement: 's',
    null_hypothesis: 'h0',
    dependent_metrics: ['win_rate'],
    independent_vars: ['team'],
    controls: ['seed'],
    test_design: {
      experiment_type: 'A/B',
      sample_size: 10,
      acceptance_criteria: 'ci>0',
      conditions: [{ id: 'a' }, { id: 'b' }]
    }
  }
  const res = validateClaim(claim)
  assert.equal(res.valid, true)
})

test('validateClaim rejects missing fields', () => {
  const res = validateClaim({ claim_id: 'x' })
  assert.equal(res.valid, false)
  assert.ok(res.errors.length > 0)
})


test('validateClaim supports policy experiment contract', () => {
  const claim = {
    claim_type: 'policy_experiment',
    claim_id: 'p1',
    statement: 's',
    null_hypothesis: 'h0',
    dependent_metrics: ['top4_rate', 'avg_placement'],
    independent_vars: ['policy_id'],
    controls: ['seeded_lobby_set'],
    test_design: {
      experiment_type: 'A/B',
      sample_size: 20,
      acceptance_criteria: 'ci>0',
      conditions: [{ id: 'A', policy_id: 'policy.greedy-synergy' }, { id: 'B', policy_id: 'policy.value-curve' }]
    }
  }
  const res = validateClaim(claim)
  assert.equal(res.valid, true)
})
