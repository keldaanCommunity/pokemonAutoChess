const fs = require('node:fs')
const path = require('node:path')
const { parseArgs, mean, writeJson } = require('./utils')
const { simulateLobby } = require('./lobby-sim')
const { getResultsDir } = require('./paths')

const ROOT = path.resolve(__dirname, '../..')
const POLICIES_PATH = path.join(ROOT, 'policies/registry.json')

function run() {
  const args = parseArgs(process.argv.slice(2))
  const seed = Number(args.seed || 42)
  const lobbies = Number(args.lobbies || 2000)
  const runId = args['run-id'] || 'latest'
  const policies = JSON.parse(fs.readFileSync(POLICIES_PATH, 'utf8')).map((p) => p.id)

  const placements = Object.fromEntries(policies.map((p) => [p, []]))
  const top4 = Object.fromEntries(policies.map((p) => [p, 0]))
  const compOpeners = {}
  const itemizations = {}
  const synergyRates = {}
  const fusionTiming = {}

  for (let i = 0; i < lobbies; i++) {
    const policySet = Array.from({ length: 8 }, (_, idx) => policies[idx % policies.length])
    const lobby = simulateLobby({
      players: 8,
      seed: seed + i,
      rounds: 30,
      policyName: policySet[0],
      opponentPolicies: policySet.slice(1)
    })
    lobby.final_standings.forEach((p) => {
      placements[p.policy_id].push(p.placement)
      if (p.top4) top4[p.policy_id] += 1
      const econEvents = p.timeline.filter((e) => e.phase === 'economy_shop')
      const opener = (econEvents[0]?.bought || []).slice(0, 2).join('+') || 'NONE'
      const k = `${p.policy_id}::${opener}`
      compOpeners[k] = (compOpeners[k] || 0) + 1
      econEvents.forEach((e, idx) => {
        const ik = `${p.policy_id}::equip_${e.equipped || 0}`
        itemizations[ik] = (itemizations[ik] || 0) + 1
        const sk = `round_${e.round}`
        synergyRates[sk] = (synergyRates[sk] || 0) + (e.synergy_types_active || 0)
        if ((e.bought || []).length < 1 && idx > 2) fusionTiming[e.round] = (fusionTiming[e.round] || 0) + 1
      })
    })
  }

  const policyTierList = policies
    .map((p) => ({
      policy_id: p,
      top4_rate: top4[p] / (lobbies * (8 / policies.length)),
      avg_placement: mean(placements[p])
    }))
    .sort((a, b) => b.top4_rate - a.top4_rate)

  const pivotMap = Object.entries(compOpeners)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([k, count]) => {
      const [policy_id, opener] = k.split('::')
      return { policy_id, opener, frequency: count }
    })

  const contestingHeatmap = policies.map((policy_id) => {
    const points = []
    for (let contested = 1; contested <= 8; contested++) {
      const penalty = Math.max(0, (contested - 1) * 0.02)
      const base =
        policyTierList.find((x) => x.policy_id === policy_id)?.top4_rate || 0
      points.push({
        contested_players: contested,
        estimated_top4_rate: Math.max(0, base - penalty)
      })
    }
    return { policy_id, points }
  })

  const report = {
    common_itemizations_by_policy: Object.entries(itemizations).sort((a,b)=>b[1]-a[1]).slice(0,60).map(([k,frequency])=>{const [policy_id,itemization]=k.split('::'); return {policy_id,itemization,frequency}}),
    synergy_activation_rates_over_time: Object.entries(synergyRates).map(([round,total])=>({round:Number(round.replace('round_','')), avg_active_synergies: total/Math.max(1,lobbies*8)})).sort((a,b)=>a.round-b.round),
    fusion_frequency_timing: Object.entries(fusionTiming).map(([round,count])=>({round:Number(round), count})).sort((a,b)=>a.round-b.round),
    seed,
    lobbies,
    policy_tier_list: policyTierList,
    pivot_map: pivotMap,
    contesting_heatmap: contestingHeatmap,
    patch_diff_report: {
      baseline: 'current_extract',
      note: 'Diff requires previous snapshot file; this report is current-state only in Phase 3 scaffold.'
    }
  }

  const outDir = path.join(getResultsDir(runId), 'meta')
  fs.mkdirSync(outDir, { recursive: true })
  writeJson(path.join(outDir, 'meta-report.json'), report)
  console.log(`Meta report written to ${path.join(outDir, 'meta-report.json')}`)
}

if (require.main === module) run()

module.exports = { run }
