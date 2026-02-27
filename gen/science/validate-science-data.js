const fs = require('node:fs')
const path = require('node:path')
const { parseArgs, writeJson } = require('./utils')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'))
}

function uniqCheck(arr, key, label, errors) {
  const seen = new Set()
  arr.forEach((x, i) => {
    const k = x[key]
    if (!k) errors.push(`${label}[${i}] missing ${key}`)
    if (seen.has(k)) errors.push(`duplicate ${label} ${key}: ${k}`)
    seen.add(k)
  })
}

function classifyLedger(assertion, support, denialReasons) {
  const entry = {
    assertion,
    support: Boolean(support),
    denied_by_default: true,
    denial_reasons: denialReasons,
    state: 'denied',
    discriminators: []
  }

  if (support && denialReasons.length === 0) entry.state = 'actionable'
  else if (support && denialReasons.length > 0) entry.state = 'contested'
  else if (!support && denialReasons.length === 0) entry.state = 'unknown'

  return entry
}

function validate() {
  const args = parseArgs(process.argv.slice(2))
  const allowFormalizationGaps = String(args['allow-formalization-gaps'] || 'false') === 'true'

  const dataset = readJson('pokemon-scientific-dataset.json')
  const effects = readJson('effect-registry.json')
  const synergies = readJson('synergy-dataset.json')
  const items = readJson('item-registry.json')
  const effectsText = readJson('effects-text-dataset.json')
  const shopPool = readJson('shop-pool.json')
  const economyRules = readJson('economy-rules.json')

  const errors = []
  const warnings = []
  const ledger = []

  uniqCheck(dataset, 'pokemon_id', 'pokemon', errors)
  uniqCheck(effects, 'effect_id', 'effect', errors)
  uniqCheck(synergies, 'synergy_id', 'synergy', errors)
  uniqCheck(items, 'item_id', 'item', errors)

  dataset.forEach((p) => {
    if (!Array.isArray(p.types) || p.types.length === 0) warnings.push(`${p.pokemon_id} types missing/empty`)
    if (!p.family_id) errors.push(`${p.pokemon_id} missing family_id`)
    if (!p.stage) errors.push(`${p.pokemon_id} missing stage`)
    if (!p.ability_id) errors.push(`${p.pokemon_id} missing ability_id`)
    if (!p.ability_params || !Array.isArray(p.ability_params.raw_numbers)) errors.push(`${p.pokemon_id} missing ability_params.raw_numbers`)
    if (!Number.isFinite(p.pool_quantity) || p.pool_quantity < 0) errors.push(`${p.pokemon_id} invalid pool_quantity`)
    if (!Number.isFinite(p.cost) || p.cost < 0) errors.push(`${p.pokemon_id} invalid cost`)
  })

  const effectIds = new Set(effects.map((e) => e.effect_id))
  effects.forEach((e) => {
    if (!e.source_type || !e.trigger || !e.targeting || !e.payload) errors.push(`effect ${e.effect_id} missing required fields`)
    if (e.formalization_gap && !allowFormalizationGaps) errors.push(`formalization gap not allowed: ${e.effect_id}`)
  })

  items.forEach((it) => {
    if (!Array.isArray(it.effects) || it.effects.length === 0) errors.push(`item ${it.item_id} has no effects`)
    it.effects.forEach((ref) => {
      if (!effectIds.has(ref.effect_id)) errors.push(`item ${it.item_id} references missing effect_id ${ref.effect_id}`)
    })
  })

  synergies.forEach((s) => {
    if (!Array.isArray(s.bonuses) || s.bonuses.length === 0) warnings.push(`synergy ${s.synergy_id} has no bonuses`)
    s.bonuses.forEach((b) => {
      if (!effectIds.has(b.effect_id)) errors.push(`synergy ${s.synergy_id} references missing effect_id ${b.effect_id}`)
    })
  })

  Object.entries(shopPool.shop_odds_by_level || {}).forEach(([lvl, odds]) => {
    const sum = (odds || []).reduce((a, b) => a + b, 0)
    if (Math.abs(sum - 1) > 0.001) errors.push(`shop odds at level ${lvl} must sum to 1 (found ${sum})`)
  })

  if (!Number.isFinite(economyRules.roll_cost) || economyRules.roll_cost < 0) errors.push('economy roll_cost invalid')

  if (!Array.isArray(effectsText.ability_effects) || !effectsText.ability_effects.length) errors.push('effects-text-dataset ability_effects missing/empty')
  if (!Array.isArray(effectsText.item_effects) || !effectsText.item_effects.length) errors.push('effects-text-dataset item_effects missing/empty')
  if (!Array.isArray(effectsText.synergy_effects) || !effectsText.synergy_effects.length) errors.push('effects-text-dataset synergy_effects missing/empty')

  // WRONG-ledger framing: every proposition is denied-by-default, then tested.
  const ledgerInputs = [
    {
      assertion: 'All IDs are unique across pokemon/effect/item/synergy datasets.',
      support: !errors.some((e) => e.includes('duplicate ')),
      denial_reasons: errors.filter((e) => e.includes('duplicate ')),
      discriminators: ['Run uniqueness scans in validate-science-data and block duplicates.']
    },
    {
      assertion: 'Every item and synergy effect reference resolves to effect-registry.json.',
      support: !errors.some((e) => e.includes('references missing effect_id')),
      denial_reasons: errors.filter((e) => e.includes('references missing effect_id')),
      discriminators: ['Join item-registry/synergy-dataset against effect-registry by effect_id.']
    },
    {
      assertion: 'Numeric economy/shop constraints are sane (odds sum≈1, costs non-negative).',
      support: !errors.some((e) => e.includes('shop odds') || e.includes('invalid cost') || e.includes('roll_cost')),
      denial_reasons: errors.filter((e) => e.includes('shop odds') || e.includes('invalid cost') || e.includes('roll_cost')),
      discriminators: ['Check odds total per level and non-negative numeric bounds.']
    },
    {
      assertion: 'Effect formalization gaps are resolved.',
      support: !errors.some((e) => e.includes('formalization gap')),
      denial_reasons: errors.filter((e) => e.includes('formalization gap')),
      discriminators: ['Run without --allow-formalization-gaps to force strict payload formalization.']
    }
  ]

  ledgerInputs.forEach((item) => {
    const classified = classifyLedger(item.assertion, item.support, item.denial_reasons)
    classified.discriminators = item.discriminators
    ledger.push(classified)
  })

  const report = {
    counts: {
      pokemon: dataset.length,
      effects: effects.length,
      synergies: synergies.length,
      items: items.length
    },
    allow_formalization_gaps: allowFormalizationGaps,
    failures: errors,
    warnings,
    wrong_ledger: {
      actionable: ledger.filter((x) => x.state === 'actionable').map((x) => x.assertion),
      contested: ledger.filter((x) => x.state === 'contested').map((x) => x.assertion),
      denied: ledger.filter((x) => x.state === 'denied').map((x) => x.assertion),
      unknown: ledger.filter((x) => x.state === 'unknown').map((x) => x.assertion),
      propositions: ledger
    }
  }
  writeJson(path.join(DATA_DIR, 'validation-report.json'), report)

  if (errors.length > 0) {
    console.error('Science data validation failed:')
    errors.forEach((e) => console.error(`  - ${e}`))
    process.exit(1)
  }

  console.log(`Science data validation passed (${dataset.length} pokemon).`)
}

if (require.main === module) validate()

module.exports = { validate }
