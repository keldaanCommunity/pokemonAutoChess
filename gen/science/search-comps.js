const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { parseArgs, seeded } = require('./utils')
const { getResultsDir } = require('./paths')
const { validateClaim } = require('./claim-schema')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')) }

function cost(mon) { return mon.cost || 1 }

function compScore(units, pairMap) {
  let score = units.reduce((s, u) => s + ((u.stats.atk || 0) + (u.stats.hp || 0) * 0.1), 0)
  for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) score += pairMap.get(`${units[i].pokemon_id}::${units[j].pokemon_id}`) || 0
  return score
}

function buildPairMap(edges) {
  const m = new Map()
  edges.forEach((e) => {
    m.set(`${e.a}::${e.b}`, e.interaction_uplift || 0)
    m.set(`${e.b}::${e.a}`, e.interaction_uplift || 0)
  })
  return m
}

function hashOf(ids) { return crypto.createHash('sha1').update(ids.join('|')).digest('hex').slice(0, 16) }

function pickItemPlan(comp, items, rand) {
  const plan = []
  const sortedUnits = [...comp].sort((a, b) => (b.cost || 0) - (a.cost || 0))
  const itemPool = [...items].sort((a,b)=> (a.rarity > b.rarity ? -1 : 1))
  sortedUnits.slice(0, Math.min(3, sortedUnits.length)).forEach((u, idx) => {
    const it = itemPool[(idx + Math.floor(rand() * 5)) % itemPool.length]
    plan.push({ pokemon_id: u.pokemon_id, item_id: it.item_id })
  })
  return plan
}

function generateCandidates(dataset, pairMap, items, budget, levelCap, seed) {
  const rand = seeded(seed)
  const out = []
  const sorted = [...dataset].sort((a, b) => (b.stats.atk || 0) - (a.stats.atk || 0))
  for (let i = 0; i < Math.min(budget, 1000); i++) {
    const comp = []
    let c = 0
    const shuffled = i % 2 === 0 ? sorted : [...sorted].sort(() => rand() - 0.5)
    for (const mon of shuffled) {
      if (comp.length >= levelCap) break
      if (c + cost(mon) <= levelCap * 4 && mon.pool_quantity > 0) { comp.push(mon); c += cost(mon) }
    }
    const itemPlan = pickItemPlan(comp, items, rand)
    out.push({ units: comp, item_plan: itemPlan, score: compScore(comp, pairMap) + itemPlan.length * 3 })
  }
  out.sort((a,b)=>b.score-a.score)
  return out
}

function compToClaim(candidate, idx) {
  const ids = candidate.units.map((u) => u.pokemon_id)
  const compositionHash = hashOf([...ids].sort())
  const itemPlanHash = hashOf(candidate.item_plan.map((x) => `${x.pokemon_id}:${x.item_id}`).sort())
  const claim = {
    claim_id: `generated.comp-item.${String(idx + 1).padStart(4, '0')}`,
    statement: `Comp+item plan ${compositionHash}/${itemPlanHash} improves top4 rate over same comp baseline item plan.`,
    null_hypothesis: 'No top4-rate improvement over same comp baseline itemization.',
    dependent_metrics: ['top4_rate', 'win_rate', 'placement'],
    independent_vars: ['composition', 'item_plan'],
    controls: ['same_composition', 'seed_policy', 'shop_odds_policy', 'opponent_set_fixed'],
    test_design: {
      experiment_type: 'A/B',
      sample_size: 600,
      acceptance_criteria: 'Top4-rate delta > 0.02 with CI excluding 0',
      conditions: [
        { id: 'candidate', composition: ids, item_plan: candidate.item_plan },
        { id: 'control', composition: ids, item_plan: [] }
      ]
    },
    metadata: { heuristic_score: candidate.score, composition_hash: compositionHash, item_plan_hash: itemPlanHash }
  }
  const v = validateClaim(claim)
  if (!v.valid) throw new Error(`Invalid generated claim ${claim.claim_id}: ${v.errors.join('; ')}`)
  return claim
}

function run() {
  const args = parseArgs(process.argv.slice(2))
  const budget = Number(args.budget || 5000)
  const seed = Number(args.seed || 42)
  const levelCap = Number(args.level || 8)
  const runId = args['run-id'] || 'latest'

  const dataset = readJson(path.join(DATA_DIR, 'pokemon-scientific-dataset.json'))
  const items = readJson(path.join(DATA_DIR, 'item-registry.json'))
  const outDir = getResultsDir(runId)
  const pairsPath = path.join(outDir, 'baselines/pairs.json')
  const pairMap = buildPairMap(fs.existsSync(pairsPath) ? readJson(pairsPath).edges : [])

  const candidates = generateCandidates(dataset, pairMap, items, budget, levelCap, seed)

  const seen = new Set()
  const selected = []
  for (const c of candidates) {
    const ch = hashOf(c.units.map((u) => u.pokemon_id).sort())
    const ih = hashOf(c.item_plan.map((x) => `${x.pokemon_id}:${x.item_id}`).sort())
    const key = `${ch}::${ih}`
    if (seen.has(key)) continue
    seen.add(key)
    selected.push(c)
    if (selected.length >= 120) break
  }

  const claims = selected.map(compToClaim)
  const out = path.join(outDir, 'generated-claims.jsonl')
  fs.writeFileSync(out, claims.map((c) => JSON.stringify(c)).join('\n') + '\n')

  console.log(`Generated ${claims.length} diverse comp+item claims -> ${out}`)
}

if (require.main === module) run()

module.exports = { run }
