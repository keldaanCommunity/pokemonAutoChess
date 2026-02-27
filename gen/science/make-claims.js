const fs = require('node:fs')
const path = require('node:path')
const { validateClaim } = require('./claim-schema')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'))
}

function pickTop(list, n) {
  return [...list].sort((a, b) => b[1] - a[1]).slice(0, n)
}

function makeClaims() {
  const dataset = readJson('pokemon-scientific-dataset.json')
  const frequency = readJson('frequency-summary.json')

  const claims = []
  const topAbilities = pickTop(frequency.abilityTop30 || [], 3).map(([id]) => id)
  const topTypes = pickTop(frequency.types || [], 3).map(([id]) => id)

  claims.push({
    claim_id: 'claim.stat.hp_vs_placement',
    statement: 'Teams with above-median total HP place higher than teams below median HP.',
    null_hypothesis: 'No placement difference exists between above-median and below-median HP teams.',
    dependent_metrics: ['placement', 'top4_rate'],
    independent_vars: ['team_total_hp_bucket'],
    controls: ['patch_version', 'shop_odds_policy', 'seed_policy'],
    test_design: {
      experiment_type: 'A/B',
      sample_size: 500,
      acceptance_criteria: 'Top4 rate delta > 0.03 with 95% bootstrap CI excluding 0',
      conditions: [
        { id: 'high_hp', rule: 'team_total_hp >= median' },
        { id: 'low_hp', rule: 'team_total_hp < median' }
      ]
    },
    notes: 'Requires outcome stage with deterministic simulation.'
  })

  topTypes.forEach((typeId, i) => {
    claims.push({
      claim_id: `claim.synergy.${typeId.toLowerCase()}.activation`,
      statement: `Activating ${typeId} synergy threshold 1 improves win rate versus no ${typeId}.`,
      null_hypothesis: `Activating ${typeId} threshold 1 has zero effect on win rate.`,
      dependent_metrics: ['win_rate', 'damage_dealt'],
      independent_vars: [`synergy_active:${typeId}`],
      controls: ['player_level_curve', 'item_policy', 'seed_policy', 'opponent_set_fixed'],
      test_design: {
        experiment_type: 'A/B',
        sample_size: 700 + i * 100,
        acceptance_criteria: 'Win rate delta > 0.02 with 95% bootstrap CI excluding 0',
        conditions: [
          { id: `with_${typeId.toLowerCase()}`, rule: `${typeId} threshold 1 active` },
          { id: `without_${typeId.toLowerCase()}`, rule: `${typeId} not active` }
        ]
      },
      notes: 'Use matched baseline cores to reduce confounding.'
    })
  })

  topAbilities.forEach((abilityId) => {
    const users = dataset.filter((p) => p.ability_id === abilityId).map((p) => p.pokemon_id).slice(0, 8)
    claims.push({
      claim_id: `claim.ability.${abilityId.toLowerCase()}.users`,
      statement: `Comps centered on ${abilityId} users outperform matched non-${abilityId} comps.`,
      null_hypothesis: `There is no performance difference for ${abilityId}-centered comps.`,
      dependent_metrics: ['placement', 'win_rate', 'rounds_survived'],
      independent_vars: [`ability_core:${abilityId}`],
      controls: ['cost_curve', 'star_curve', 'shop_odds_policy', 'seed_policy'],
      test_design: {
        experiment_type: 'factorial',
        sample_size: 900,
        acceptance_criteria: 'Mean placement improvement >= 0.4 and CI excludes 0',
        conditions: [
          { id: `core_${abilityId.toLowerCase()}`, core_users: users },
          { id: `control_without_${abilityId.toLowerCase()}`, core_users: [] }
        ]
      },
      notes: 'Ensure same median total cost between treatment/control.'
    })
  })

  const invalid = claims
    .map((c) => ({ id: c.claim_id, result: validateClaim(c) }))
    .filter((x) => !x.result.valid)
  if (invalid.length > 0) {
    throw new Error(`Generated invalid claims: ${JSON.stringify(invalid, null, 2)}`)
  }

  const outPath = path.join(DATA_DIR, 'claims.jsonl')
  fs.writeFileSync(outPath, claims.map((c) => JSON.stringify(c)).join('\n') + '\n')
  console.log(`Generated ${claims.length} scientific claims: ${outPath}`)
}

if (require.main === module) makeClaims()

module.exports = { makeClaims }
