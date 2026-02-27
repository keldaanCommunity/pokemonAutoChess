
const POLICY_METRICS = new Set(['top4_rate', 'avg_placement', 'win_rate', 'stability', 'econ_health', 'pivot_cost'])

const REQUIRED_CLAIM_FIELDS = [
  'claim_id',
  'statement',
  'null_hypothesis',
  'dependent_metrics',
  'independent_vars',
  'controls',
  'test_design'
]

function validateClaim(claim) {
  const errors = []
  for (const field of REQUIRED_CLAIM_FIELDS) {
    if (!(field in claim)) errors.push(`missing field: ${field}`)
  }

  if (!Array.isArray(claim.dependent_metrics) || claim.dependent_metrics.length === 0) {
    errors.push('dependent_metrics must be a non-empty array')
  }
  if (!Array.isArray(claim.independent_vars) || claim.independent_vars.length === 0) {
    errors.push('independent_vars must be a non-empty array')
  }
  if (!Array.isArray(claim.controls) || claim.controls.length === 0) {
    errors.push('controls must be a non-empty array')
  }

  const td = claim.test_design || {}
  for (const field of ['experiment_type', 'sample_size', 'acceptance_criteria', 'conditions']) {
    if (!(field in td)) errors.push(`missing test_design.${field}`)
  }
  if (!Number.isFinite(td.sample_size) || td.sample_size < 1) {
    errors.push('test_design.sample_size must be >= 1')
  }
  if (!Array.isArray(td.conditions) || td.conditions.length < 2) {
    errors.push('test_design.conditions must have at least 2 explicit conditions')
  }

  if (claim.claim_type === 'policy_experiment') {
    const hasPolicyMetric = claim.dependent_metrics.some((m) => POLICY_METRICS.has(m))
    if (!hasPolicyMetric) {
      errors.push('policy_experiment requires at least one policy metric (e.g., top4_rate, avg_placement)')
    }
  }

  return { valid: errors.length === 0, errors }
}

module.exports = {
  validateClaim,
  REQUIRED_CLAIM_FIELDS
}
