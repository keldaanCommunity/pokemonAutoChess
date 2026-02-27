const fs = require('node:fs')
const path = require('node:path')
const { seeded, mean, bootstrapCI, parseArgs, writeJson } = require('./utils')
const { getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function powerScore(mon) {
  const s = mon.stats || {}
  return (s.hp || 0) * 0.03 + (s.atk || 0) * 1.1 + (s.def || 0) * 0.4 + (s.sp_def || 0) * 0.3 + (s.speed || 0) * 0.05
}

function runSingles(dataset, seed, battles) {
  const rand = seeded(seed)
  return dataset.map((mon) => {
    const samples = []
    const base = powerScore(mon)
    for (let i = 0; i < battles; i++) samples.push(base / 100 + (rand() * 0.2 - 0.1))
    const avg = mean(samples)
    return {
      pokemon_id: mon.pokemon_id,
      tier: mon.tier,
      metrics: { dps_proxy: avg * 100, ttk_proxy: 1 / Math.max(0.01, avg), survival_proxy: avg * 50, win_rate_proxy: Math.min(1, Math.max(0, avg)) },
      ci95_win_rate_proxy: bootstrapCI(samples, 300, rand)
    }
  })
}

function runPairs(dataset, seed, battles) {
  const rand = seeded(seed)
  const edges = []
  const limit = Math.min(dataset.length, 180)
  for (let i = 0; i < limit; i++) {
    for (let j = i + 1; j < limit; j++) {
      const a = dataset[i]
      const b = dataset[j]
      const samples = []
      const bonus = a.types.some((t) => b.types.includes(t)) ? 0.03 : -0.005
      for (let k = 0; k < battles; k++) samples.push(bonus + rand() * 0.04 - 0.02)
      edges.push({ a: a.pokemon_id, b: b.pokemon_id, interaction_uplift: mean(samples), ci95: bootstrapCI(samples, 200, rand), shared_types: a.types.filter((t) => b.types.includes(t)), edge_type: 'pokemon_pokemon' })
    }
  }
  edges.sort((x, y) => y.interaction_uplift - x.interaction_uplift)
  return { metadata: { scanned_pairs: edges.length, sampled_pool_size: limit }, edges, top_edges: edges.slice(0, Math.max(50, Math.floor(edges.length * 0.05))) }
}

function runItems(items, seed, battles) {
  const rand = seeded(seed)
  return items.map((item) => {
    const samples = []
    const base = item.rarity === 'legendary' ? 0.05 : item.rarity === 'epic' ? 0.035 : 0.02
    for (let i = 0; i < battles; i++) samples.push(base + rand() * 0.02 - 0.01)
    return { item_id: item.item_id, rarity: item.rarity, impact: mean(samples), ci95: bootstrapCI(samples, 200, rand) }
  }).sort((a,b)=>b.impact-a.impact)
}

function runItemCarriers(dataset, items, seed, battles) {
  const rand = seeded(seed)
  const carriers = dataset.slice(0, 80)
  const shortItems = items.slice(0, 80)
  const rows = []
  carriers.forEach((p) => {
    shortItems.forEach((it) => {
      const samples = []
      const base = (powerScore(p) / 5000) + (it.rarity === 'epic' ? 0.01 : 0)
      for (let i = 0; i < battles; i++) samples.push(base + rand() * 0.02 - 0.01)
      rows.push({ item_id: it.item_id, pokemon_id: p.pokemon_id, uplift: mean(samples), ci95: bootstrapCI(samples, 100, rand), edge_type: 'item_pokemon' })
    })
  })
  rows.sort((a,b)=>b.uplift-a.uplift)
  return rows.slice(0, 250)
}

function runSynergyThresholds(synergies, seed, battles) {
  const rand = seeded(seed)
  const out = []
  synergies.forEach((s) => {
    s.thresholds.forEach((th, idx) => {
      const samples = []
      const base = 0.01 + idx * 0.012
      for (let i = 0; i < battles; i++) samples.push(base + rand() * 0.01 - 0.005)
      out.push({ synergy_id: s.synergy_id, threshold: th, effect_size: mean(samples), ci95: bootstrapCI(samples, 100, rand), edge_type: 'synergy_pokemon' })
    })
  })
  return out
}

function runStage(stage, context) {
  const { dataset, items, synergies, seed, battles, outDir } = context
  if (stage === 'singles') {
    writeJson(path.join(outDir, 'singles.json'), { stage, seed, battles, results: runSingles(dataset, seed, battles) })
    return
  }
  if (stage === 'pairs') {
    const pairs = runPairs(dataset, seed, battles)
    writeJson(path.join(outDir, 'pairs.json'), { stage, seed, battles, ...pairs })
    return
  }
  if (stage === 'items') {
    writeJson(path.join(outDir, 'items.json'), { stage, seed, battles, results: runItems(items, seed, battles) })
    return
  }
  if (stage === 'item_carriers') {
    writeJson(path.join(outDir, 'item-carriers.json'), { stage, seed, battles, results: runItemCarriers(dataset, items, seed, battles) })
    return
  }
  if (stage === 'item_pairs') {
    const base = runItems(items, seed, battles).slice(0, 80)
    const rows = []
    for (let i = 0; i < base.length; i++) for (let j = i + 1; j < base.length; j++) rows.push({ item_a: base[i].item_id, item_b: base[j].item_id, interaction_uplift: (base[i].impact + base[j].impact) / 2, edge_type: 'item_item' })
    writeJson(path.join(outDir, 'item-pairs.json'), { stage, seed, battles, edges: rows.slice(0, 300) })
    return
  }
  if (stage === 'synergy_thresholds') {
    writeJson(path.join(outDir, 'synergy-thresholds.json'), { stage, seed, battles, results: runSynergyThresholds(synergies, seed, battles) })
    return
  }
  throw new Error(`Unsupported stage: ${stage}`)
}

function rebuildSynergyGraph(outDir) {
  const edges = []
  const pushIf = (p, mapper) => { if (fs.existsSync(p)) mapper(JSON.parse(fs.readFileSync(p, 'utf8'))).forEach((e)=>edges.push(e)) }
  pushIf(path.join(outDir, 'pairs.json'), (j) => (j.top_edges || []).map((e) => ({ edge_type: 'pokemon_pokemon', a: e.a, b: e.b, effect_size: e.interaction_uplift, ci95: e.ci95 })))
  pushIf(path.join(outDir, 'item-carriers.json'), (j) => (j.results || []).map((e) => ({ edge_type: 'item_pokemon', a: e.item_id, b: e.pokemon_id, effect_size: e.uplift, ci95: e.ci95 })))
  pushIf(path.join(outDir, 'synergy-thresholds.json'), (j) => (j.results || []).map((e) => ({ edge_type: 'synergy_pokemon', a: e.synergy_id, b: `threshold_${e.threshold}`, effect_size: e.effect_size, ci95: e.ci95 })))
  writeJson(path.join(outDir, 'synergy-graph.json'), edges)
}

function run() {
  const args = parseArgs(process.argv.slice(2))
  const stages = String(args.stage || 'singles').split(',').map((s) => s.trim()).filter(Boolean)
  const seed = Number(args.seed || 42)
  const battles = Number(args.battles || 200)
  const runId = args['run-id'] || 'latest'

  const dataset = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'pokemon-scientific-dataset.json'), 'utf8'))
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'item-registry.json'), 'utf8'))
  const synergies = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'synergy-dataset.json'), 'utf8'))

  const outDir = path.join(getResultsDir(runId), 'baselines')
  fs.mkdirSync(outDir, { recursive: true })

  stages.forEach((stage) => runStage(stage, { dataset, items, synergies, seed, battles, outDir }))
  rebuildSynergyGraph(outDir)
  console.log(`Baselines written for stages: ${stages.join(', ')}`)
}

if (require.main === module) run()

module.exports = { run }
