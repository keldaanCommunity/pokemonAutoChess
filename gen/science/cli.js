const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { parseArgs, writeJson } = require('./utils')
const { getBaseDir, getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')

function runNodeScript(scriptPath, args = []) {
  const r = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: ROOT,
    stdio: 'inherit'
  })
  return r.status ?? 2
}

function resolveGoalsFile() {
  const base = getBaseDir()
  const local = path.join(base, 'goals.json')
  if (fs.existsSync(local)) return local
  const repo = path.join(ROOT, 'goals.json')
  if (fs.existsSync(repo)) return repo
  return null
}

function getByPath(obj, dotted) {
  return dotted.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

function evaluateGoals(runId, executedCommands) {
  const goalsFile = resolveGoalsFile()
  if (!goalsFile) return { pass: true, checks: [{ type: 'goals', status: 'skip', reason: 'No goals.json found' }] }

  const goals = JSON.parse(fs.readFileSync(goalsFile, 'utf8'))
  const checks = []
  let pass = true

  for (const req of goals.requirements || []) {
    if (req.type === 'command') {
      const ok = executedCommands.includes(req.name)
      checks.push({ type: 'command', name: req.name, status: ok ? 'pass' : 'fail' })
      if (!ok) pass = false
    } else if (req.type === 'metric') {
      const filePath = path.join(getResultsDir(runId), req.file)
      let ok = false
      let found
      if (fs.existsSync(filePath)) {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        found = getByPath(json, req.path)
        ok = Number.isFinite(found) && (req.min == null || found >= req.min) && (req.max == null || found <= req.max)
      }
      checks.push({ type: 'metric', file: req.file, path: req.path, found, min: req.min, max: req.max, status: ok ? 'pass' : 'fail' })
      if (!ok) pass = false
    }
  }

  return { pass, checks }
}

function writeSummary(runId, status, checks, executed, failures = []) {
  const outDir = getResultsDir(runId)
  const summary = {
    run_id: runId,
    status,
    executed_commands: executed,
    checks,
    failures,
    generated_at: new Date().toISOString()
  }
  writeJson(path.join(outDir, 'summary.json'), summary)

  const md = [
    `# PokeChess Science Run Summary`,
    '',
    `- Run ID: ${runId}`,
    `- Status: **${status}**`,
    '',
    '## Commands',
    ...executed.map((c) => `- ${c}`),
    '',
    '## Checks',
    ...checks.map((c) => `- ${c.type}: ${c.name || c.path || c.reason} => ${c.status}`),
    '',
    failures.length ? `## Failures\n${failures.map((f) => `- ${f}`).join('\n')}` : '## Failures\n- none'
  ].join('\n')

  fs.writeFileSync(path.join(outDir, 'summary.md'), md)
  fs.writeFileSync(path.join(outDir, 'STATUS.txt'), `${status}\n`)
}

function runPipeline(opts) {
  const runId = opts.runId
  const profile = opts.profile
  const seed = String(opts.seed)

  const executed = []
  const failures = []

  const plan = [
    ['extract-science-data', 'gen/extract-scientific-dataset.js', []],
    ['validate-science-data', 'gen/science/validate-science-data.js', ['--allow-formalization-gaps', 'true']],
    ['verify-mechanics', 'gen/science/verify-mechanics.js', ['--seed', seed, '--run-id', runId]],
    ['run-baselines', 'gen/science/run-baselines.js', ['--stage', 'singles,pairs,items,item_carriers,synergy_thresholds', '--seed', seed, '--battles', profile === 'fast' ? '40' : '200', '--run-id', runId]],
    ['search-comps', 'gen/science/search-comps.js', ['--mode', 'beam', '--budget', profile === 'fast' ? '300' : '5000', '--seed', seed, '--run-id', runId]],
    ['generate-claims', 'gen/science/make-claims.js', []],
    ['run-experiments', 'gen/science/run-experiments.js', ['--claims', 'app/models/precomputed/scientific-method/claims.jsonl', '--seed', seed, '--battles-per-condition', profile === 'fast' ? '60' : '300', '--run-id', runId]],
    ['simulate-lobby', 'gen/science/simulate-lobby.js', ['--players', '8', '--seed', seed, '--rounds', '30', '--policy', 'policy.greedy-synergy', '--run-id', runId]],
    ['validate-simulator', 'gen/science/validate-simulator.js', ['--seed', seed, '--lobbies', profile === 'fast' ? '40' : '200', '--run-id', runId]],
    ['generate-policy-claims', 'gen/science/make-policy-claims.js', []],
    ['run-policy-experiments', 'gen/science/run-policy-experiments.js', ['--claims', 'app/models/precomputed/scientific-method/policy-claims.jsonl', '--lobbies-per-condition', profile === 'fast' ? '40' : '300', '--seed', seed, '--run-id', runId]],
    ['meta-report', 'gen/science/meta-report.js', ['--seed', seed, '--lobbies', profile === 'fast' ? '80' : '2000', '--run-id', runId]],
    ['validate-result-schemas', 'gen/science/validate-result-schemas.js', ['--run-id', runId]]
  ]

  for (const [name, script, args] of plan) {
    executed.push(name)
    const code = runNodeScript(script, args)
    if (code !== 0) {
      failures.push(`${name} failed with exit code ${code}`)
      return { status: 'FAIL', executed, failures, code: 2 }
    }
  }

  const checks = evaluateGoals(runId, executed)
  const status = checks.pass ? 'PASS' : 'FAIL'
  return { status, executed, failures, checks: checks.checks, code: checks.pass ? 0 : 1 }
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)

  if (cmd !== 'run') {
    console.error('Usage: pokechess-science run --seed 42 --profile fast --run-id latest')
    process.exit(2)
  }

  const opts = {
    seed: Number(args.seed || 42),
    profile: args.profile || 'fast',
    runId: args['run-id'] || 'latest'
  }

  try {
    const result = runPipeline(opts)
    writeSummary(opts.runId, result.status, result.checks || [], result.executed, result.failures)
    process.exit(result.code)
  } catch (e) {
    writeSummary(opts.runId, 'FAIL', [], [], [String(e?.stack || e)])
    process.exit(2)
  }
}

if (require.main === module) main()

module.exports = { main }
