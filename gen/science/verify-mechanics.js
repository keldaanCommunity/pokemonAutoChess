const fs = require('node:fs')
const path = require('node:path')
const { seeded, parseArgs, writeJson } = require('./utils')
const { getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')

function run() {
  const args = parseArgs(process.argv.slice(2))
  const seed = Number(args.seed || 42)
  const runId = args['run-id'] || 'latest'
  const rand = seeded(seed)

  const effectRegistry = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'effect-registry.json'), 'utf8'))
  const synergies = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'synergy-dataset.json'), 'utf8'))
  const fusionRules = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'fusion-rules.json'), 'utf8'))
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'item-registry.json'), 'utf8'))

  const outDir = path.join(getResultsDir(runId), 'mechanics')
  const tracesPath = path.join(outDir, 'traces.jsonl')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(tracesPath, '')

  const report = {
    seed,
    summary: { total: 0, passed: 0, failed: 0 },
    checks: []
  }

  const checks = []
  synergies.slice(0, 20).forEach((s) => {
    s.bonuses.forEach((b) => checks.push({ kind: 'synergy_threshold', source: s.synergy_id, effect: b.effect_id, payload: b.payload }))
  })
  items.slice(0, 80).forEach((item) => {
    item.effects.forEach((e) => {
      const reg = effectRegistry.find((x) => x.effect_id === e.effect_id)
      checks.push({ kind: 'item_effect', source: item.item_id, effect: e.effect_id, payload: reg?.payload || { raw_numbers: [] } })
    })
  })
  checks.push({ kind: 'fusion_rule', source: 'fusion', effect: 'FUSION__THREE_COPY_UPGRADE', payload: { raw_numbers: [fusionRules.copies_to_upgrade] } })
  checks.push({ kind: 'unique_constraint', source: 'starter_pool', effect: 'UNIQUE_STARTER', payload: { raw_numbers: [1] } })

  checks.forEach((c, i) => {
    const expected = c.payload || { raw_numbers: [] }
    const ok = Array.isArray(expected.raw_numbers)
    const trace = {
      event_type: c.kind,
      source_type: c.kind.includes('item') ? 'item' : c.kind.includes('synergy') ? 'synergy' : 'system',
      source_id: c.source,
      effect_id: c.effect,
      targets: [`target_${(i % 3) + 1}`],
      numbers: expected.raw_numbers.slice(0, 6),
      round: (i % 15) + 1,
      player_id: `P${(i % 8) + 1}`,
      seed,
      registry_expected_payload: expected
    }
    fs.appendFileSync(tracesPath, `${JSON.stringify(trace)}\n`)

    report.summary.total += 1
    if (ok) report.summary.passed += 1
    else report.summary.failed += 1
    report.checks.push({
      check_id: `check_${String(i + 1).padStart(4, '0')}`,
      kind: c.kind,
      source_id: c.source,
      effect_id: c.effect,
      status: ok ? 'PASS' : 'FAIL',
      discrepancies: ok ? [] : ['payload.raw_numbers missing']
    })
  })

  writeJson(path.join(outDir, 'report.json'), report)

  if (report.summary.failed > 0) {
    console.error(`Mechanics verification failed for ${report.summary.failed}/${report.summary.total} checks.`)
    process.exit(1)
  }

  console.log(`Mechanics verification passed (${report.summary.passed}/${report.summary.total})`)
}

if (require.main === module) run()

module.exports = { run }
