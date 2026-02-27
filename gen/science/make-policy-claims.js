const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '../..')
const OUT = path.join(ROOT, 'app/models/precomputed/scientific-method/policy-claims.jsonl')

const claims = [
  {
    claim_id: 'policy.top4.greedy_vs_value',
    statement: 'Greedy synergy policy has higher top4 rate than value-curve policy in mixed lobbies.',
    null_hypothesis: 'No top4 difference between greedy-synergy and value-curve.',
    dependent_metrics: ['top4_rate', 'avg_placement'],
    independent_vars: ['policy_id'],
    controls: ['seeded_lobby_set', 'opponent_policy_set', 'rounds=30'],
    test_design: {
      experiment_type: 'A/B',
      sample_size: 300,
      acceptance_criteria: 'delta_top4 > 0 with 95% CI excluding 0',
      conditions: [
        { id: 'A', policy_id: 'policy.greedy-synergy', opponent_policy_set: ['policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve'] },
        { id: 'B', policy_id: 'policy.value-curve', opponent_policy_set: ['policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve'] }
      ]
    }
  },
  {
    claim_id: 'policy.top4.value_vs_forced',
    statement: 'Value-curve policy top4 rate exceeds forced-comp under contesting pressure.',
    null_hypothesis: 'No top4 difference between value-curve and forced-comp.',
    dependent_metrics: ['top4_rate', 'avg_placement'],
    independent_vars: ['policy_id'],
    controls: ['seeded_lobby_set', 'opponent_policy_set', 'rounds=30'],
    test_design: {
      experiment_type: 'A/B',
      sample_size: 300,
      acceptance_criteria: 'delta_top4 > 0 with 95% CI excluding 0',
      conditions: [
        { id: 'A', policy_id: 'policy.value-curve', opponent_policy_set: ['policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve'] },
        { id: 'B', policy_id: 'policy.forced-comp', opponent_policy_set: ['policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve','policy.forced-comp','policy.greedy-synergy','policy.value-curve'] }
      ]
    }
  }
]

fs.writeFileSync(OUT, claims.map((c) => JSON.stringify(c)).join('\n') + '\n')
console.log(`Generated policy claims: ${OUT}`)
