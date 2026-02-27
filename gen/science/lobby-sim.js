const fs = require('node:fs')
const path = require('node:path')
const { seeded } = require('./utils')

const ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(ROOT, 'app/models/precomputed/scientific-method')
const POLICIES_PATH = path.join(ROOT, 'policies/registry.json')

const LEVEL_XP = [0, 2, 6, 10, 20, 36, 56, 80, 100]
const ITEM_MULT_BY_SLOT = [0.12, 0.08, 0.05]
const MAX_ROLLS_PER_ROUND = 3

function loadData() {
  const dataset = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'pokemon-scientific-dataset.json'), 'utf8')
  )
  const shop = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'shop-pool.json'), 'utf8'))
  const synergyDataset = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'synergy-dataset.json'), 'utf8')
  )
  const itemDropTable = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'item-drop-table.json'), 'utf8'))
  const economyRules = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'economy-rules.json'), 'utf8'))
  const fusionRules = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'fusion-rules.json'), 'utf8'))
  const policies = JSON.parse(fs.readFileSync(POLICIES_PATH, 'utf8'))
  return { dataset, shop, synergyDataset, itemDropTable, economyRules, fusionRules, policies }
}

function mkUnit(mon) {
  return {
    pokemon_id: mon.pokemon_id,
    cost: mon.cost,
    tier: mon.tier,
    stage: mon.stage,
    family_id: mon.family_id,
    evolves_to: mon.evolves_to || [],
    types: mon.types,
    stats: mon.stats,
    stars: 1,
    items: 0
  }
}

function unitStrength(u) {
  const s = u.stats || {}
  const starScale = 1 + (u.stars - 1) * 0.75
  const itemScale = 1 + ITEM_MULT_BY_SLOT.slice(0, u.items).reduce((a, b) => a + b, 0)
  return (
    ((s.hp || 0) * 0.03 +
      (s.atk || 0) * 1.3 +
      (s.def || 0) * 0.4 +
      (s.sp_def || 0) * 0.2 +
      (s.speed || 0) * 0.05) *
    starScale *
    itemScale
  )
}

function buildSynergyMap(synergyDataset) {
  const map = new Map()
  synergyDataset.forEach((s) => {
    map.set(s.key, { thresholds: s.thresholds || [] })
  })
  return map
}

function synergyMultiplier(player, synergyMap) {
  const typeCounts = {}
  player.board.forEach((u) => u.types.forEach((t) => (typeCounts[t] = (typeCounts[t] || 0) + 1)))
  let bonus = 0
  Object.entries(typeCounts).forEach(([type, count]) => {
    const synergy = synergyMap.get(type)
    if (!synergy) return
    const activeTiers = synergy.thresholds.filter((t) => count >= t).length
    bonus += activeTiers * 0.035
  })
  return { bonus, typeCounts }
}

function teamStrength(player, synergyMap) {
  const units = player.board
  const base = units.reduce((acc, u) => acc + unitStrength(u), 0)
  const { bonus: synergyBonus } = synergyMultiplier(player, synergyMap)
  const itemBonus = player.itemTokens * 0.01
  const frontline = units.filter((u) => (u.stats.range || 1) <= 2).length
  const positioningBonus = units.length ? Math.min(0.06, frontline / units.length / 8) : 0
  return base * (1 + synergyBonus + itemBonus + positioningBonus)
}

function pickByOdds(rand, arr, vals) {
  const r = rand()
  let c = 0
  for (let i = 0; i < arr.length; i++) {
    c += arr[i]
    if (r <= c) return vals[i]
  }
  return vals[vals.length - 1]
}

function makeGlobalPool(dataset) {
  const pool = new Map()
  dataset.forEach((m) => {
    pool.set(m.pokemon_id, m.pool_quantity)
  })
  return pool
}

function rollShop(player, dataset, shopOdds, pool, rand) {
  const offers = []
  const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'ULTRA']
  const weights = shopOdds[String(Math.min(9, player.level))] || shopOdds['9']
  for (let i = 0; i < 5; i++) {
    const rarity = pickByOdds(rand, weights, rarityOrder)
    const candidates = dataset.filter((m) => m.rarity === rarity && (pool.get(m.pokemon_id) || 0) > 0)
    if (!candidates.length) continue
    offers.push(candidates[Math.floor(rand() * candidates.length)])
  }
  return offers
}

function synergyCompletionScore(typeCounts, synergyMap, type) {
  const thresholds = (synergyMap.get(type) || {}).thresholds || []
  if (!thresholds.length) return 0
  const owned = typeCounts[type] || 0
  const next = thresholds.find((t) => owned < t)
  if (!next) return 0.6
  return 1 / Math.max(1, next - owned)
}

function scoreOffer(player, offer, synergyMap) {
  const typeCounts = {}
  const familyCounts = {}
  ;[...player.board, ...player.bench].forEach((u) => {
    u.types.forEach((t) => (typeCounts[t] = (typeCounts[t] || 0) + 1))
    familyCounts[u.family_id] = (familyCounts[u.family_id] || 0) + 1
  })

  const synergyScore = offer.types.reduce((sum, type) => sum + synergyCompletionScore(typeCounts, synergyMap, type), 0)
  const familyScore = familyCounts[offer.family_id] || 0
  const economyPenalty = offer.cost > player.gold * 0.4 ? 0.35 : 0
  return synergyScore * 2 + familyScore * 0.8 + unitStrength(mkUnit(offer)) / Math.max(1, offer.cost) - economyPenalty
}

function chooseBuy(player, offers, policy, synergyMap) {
  if (!offers.length) return null
  if (policy.id === 'policy.value-curve') {
    return [...offers].sort(
      (a, b) => unitStrength(mkUnit(b)) / Math.max(1, b.cost) - unitStrength(mkUnit(a)) / Math.max(1, a.cost)
    )[0]
  }
  if (policy.id === 'policy.forced-comp') {
    const targetSet = new Set(policy.target_units || [])
    const target = offers.find((o) => targetSet.has(o.pokemon_id))
    if (target) return target
  }
  return [...offers].sort((a, b) => scoreOffer(player, b, synergyMap) - scoreOffer(player, a, synergyMap))[0]
}

function maybeLevel(player, policy) {
  const target =
    policy.leveling === 'aggressive' ? Math.min(9, Math.floor(player.round / 3) + 3) : Math.min(9, Math.floor(player.round / 4) + 2)
  while (player.level < target && player.gold >= 4) {
    player.gold -= 4
    player.xp += 4
    while (player.level < 9 && player.xp >= LEVEL_XP[player.level]) player.level += 1
  }
}

function applyEconomy(player, economyRules) {
  const base = player.round <= 2 ? economyRules.base_income_by_round.early_rounds_1_2 : economyRules.base_income_by_round.default
  const interest = Math.min(economyRules.interest.cap, Math.floor(player.gold / 10) * economyRules.interest.per_10_gold)
  const streakBonus = Math.abs(player.streak) >= 2 ? Math.min(3, Math.floor(Math.abs(player.streak) / 2)) : 0
  const income = base + interest + streakBonus
  player.gold += income
  return { base, interest, streakBonus, income }
}

function maybeFuseAndEvolve(player, byId, pool, fusionRules) {
  let changed = true
  while (changed) {
    changed = false
    const units = [...player.board, ...player.bench]
    const groups = new Map()
    units.forEach((u) => {
      const key = `${u.pokemon_id}::${u.stars}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(u)
    })

    for (const grp of groups.values()) {
      if (grp.length < (fusionRules.copies_to_upgrade || 3) || grp[0].stars >= (fusionRules.max_star_level || 3)) continue
      const template = grp[0]
      const survivors = units.filter((u) => !grp.slice(0, 3).includes(u))
      const fused = { ...template, stars: template.stars + 1, items: Math.min(3, template.items + 1) }

      const evolvedId = (template.evolves_to || [])[0]
      if (evolvedId && (pool.get(evolvedId) || 0) > 0 && byId.has(evolvedId)) {
        const evolved = byId.get(evolvedId)
        pool.set(evolvedId, (pool.get(evolvedId) || 0) - 1)
        fused.pokemon_id = evolved.pokemon_id
        fused.cost = evolved.cost
        fused.tier = evolved.tier
        fused.stage = evolved.stage
        fused.family_id = evolved.family_id
        fused.evolves_to = evolved.evolves_to || []
        fused.types = evolved.types
        fused.stats = evolved.stats
      }

      survivors.push(fused)
      player.board = survivors.slice(0, player.board.length)
      player.bench = survivors.slice(player.board.length)
      changed = true
      break
    }
  }
}

function buildBoard(player) {
  const cap = Math.max(1, player.level)
  const allUnits = [...player.board, ...player.bench].sort((a, b) => unitStrength(b) - unitStrength(a))
  player.board = allUnits.slice(0, cap)
  player.bench = allUnits.slice(cap, cap + 9)
}

function equipItems(player) {
  if (!player.itemTokens || !player.board.length) return 0
  const ordered = [...player.board].sort((a, b) => unitStrength(b) - unitStrength(a))
  let equipped = 0
  for (const u of ordered) {
    if (player.itemTokens <= 0) break
    if (u.items >= 3) continue
    u.items += 1
    player.itemTokens -= 1
    equipped += 1
  }
  return equipped
}

function battle(a, b, rand, synergyMap) {
  const sa = teamStrength(a, synergyMap)
  const sb = teamStrength(b, synergyMap)
  const pA = sa / Math.max(1e-9, sa + sb)
  const aWin = rand() < pA
  return aWin ? [a, b] : [b, a]
}

function shuffle(list, rand) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickUniqueStarters(roster, dataset, pool, rand) {
  const starters = dataset.filter((m) => m.tier === 1 && m.cost <= 2 && (pool.get(m.pokemon_id) || 0) > 0)
  const used = new Set()
  roster.forEach((p) => {
    const choices = starters.filter((s) => !used.has(s.pokemon_id) && (pool.get(s.pokemon_id) || 0) > 0)
    if (!choices.length) return
    const pick = choices[Math.floor(rand() * choices.length)]
    used.add(pick.pokemon_id)
    pool.set(pick.pokemon_id, (pool.get(pick.pokemon_id) || 0) - 1)
    p.board.push(mkUnit(pick))
  })
}

function simulateLobby({ players = 8, seed = 42, rounds = 30, policyName = 'policy.greedy-synergy', opponentPolicies = [] }) {
  const { dataset, shop, synergyDataset, itemDropTable, economyRules, fusionRules, policies } = loadData()
  const rand = seeded(seed)
  const policyMap = new Map(policies.map((p) => [p.id, p]))
  const byId = new Map(dataset.map((m) => [m.pokemon_id, m]))
  const synergyMap = buildSynergyMap(synergyDataset)

  const pool = makeGlobalPool(dataset)
  const roster = []
  for (let i = 0; i < players; i++) {
    const pName = i === 0 ? policyName : opponentPolicies[i - 1] || policyName
    roster.push({
      id: `P${i + 1}`,
      policy: policyMap.get(pName) || policyMap.get('policy.greedy-synergy'),
      hp: 100,
      gold: 8,
      xp: 0,
      level: 2,
      board: [],
      bench: [],
      streak: 0,
      itemTokens: 0,
      placement: null,
      round: 0,
      timeline: []
    })
  }

  pickUniqueStarters(roster, dataset, pool, rand)

  const aliveOrder = []

  for (let round = 1; round <= rounds; round++) {
    const alive = roster.filter((p) => p.hp > 0)
    alive.forEach((p) => {
      p.round = round
      const econ = applyEconomy(p, economyRules)
      maybeLevel(p, p.policy)
      let offers = rollShop(p, dataset, shop.shop_odds_by_level, pool, rand)
      const initial_offers = offers.map((o) => o.pokemon_id)
      const bought = []
      const benchCap = 9
      const maxBuys = Math.max(1, Math.min(5, 2 + Math.floor(round / 10)))
      let rolls = 0

      for (let buy = 0; buy < maxBuys; buy++) {
        const pick = chooseBuy(p, offers, p.policy, synergyMap)
        if (!pick || p.gold < pick.cost || p.bench.length + p.board.length >= p.level + benchCap) break
        if ((pool.get(pick.pokemon_id) || 0) <= 0) break
        p.gold -= pick.cost
        pool.set(pick.pokemon_id, (pool.get(pick.pokemon_id) || 0) - 1)
        p.bench.push(mkUnit(pick))
        bought.push(pick.pokemon_id)
        maybeFuseAndEvolve(p, byId, pool, fusionRules)

        if (buy < maxBuys - 1 && rolls < MAX_ROLLS_PER_ROUND && p.gold > economyRules.roll_cost) {
          p.gold -= economyRules.roll_cost
          offers = rollShop(p, dataset, shop.shop_odds_by_level, pool, rand)
          rolls += 1
        }
      }

      const dropEvent = (itemDropTable.rounds || []).find((r) => r.round === round)
      const items_received = dropEvent ? (dropEvent.event_type === "carousel" ? 2 : 1) : 0
      p.itemTokens += items_received
      buildBoard(p)
      const equipped = equipItems(p)
      const synergy = synergyMultiplier(p, synergyMap)
      p.timeline.push({
        round,
        phase: 'economy_shop',
        econ,
        shop_offers: initial_offers,
        bought,
        rolls,
        items_received,
        equipped,
        gold_after: p.gold,
        level: p.level,
        hp: p.hp,
        synergy_types_active: Object.entries(synergy.typeCounts).filter(([type, count]) => {
          const thresholds = (synergyMap.get(type) || {}).thresholds || []
          return thresholds.some((t) => count >= t)
        }).length
      })
    })

    const fighters = shuffle(roster.filter((p) => p.hp > 0), rand)
    for (let i = 0; i < fighters.length - 1; i += 2) {
      const a = fighters[i]
      const b = fighters[i + 1]
      const [winner, loser] = battle(a, b, rand, synergyMap)
      const damage = Math.max(3, Math.floor((teamStrength(winner, synergyMap) - teamStrength(loser, synergyMap)) / 55) + 4)
      loser.hp -= damage
      winner.streak = Math.max(1, winner.streak + 1)
      loser.streak = Math.min(-1, loser.streak - 1)
      winner.timeline.push({ round, phase: 'combat', vs: loser.id, result: 'win', dealt: damage, hp: winner.hp, synergy_activations: synergyMultiplier(winner, synergyMap).bonus })
      loser.timeline.push({ round, phase: 'combat', vs: winner.id, result: 'loss', taken: damage, hp: loser.hp })
      if (loser.hp <= 0 && loser.placement == null) {
        aliveOrder.unshift(loser.id)
        loser.placement = players - aliveOrder.length + 1
      }
    }
  }

  const survivors = roster.filter((p) => p.hp > 0).sort((a, b) => b.hp - a.hp)
  survivors.forEach((p, idx) => {
    if (p.placement == null) p.placement = idx + 1
  })

  const final = roster
    .map((p) => ({
      player_id: p.id,
      policy_id: p.policy.id,
      placement: p.placement,
      hp: p.hp,
      gold: p.gold,
      level: p.level,
      top4: p.placement <= 4,
      timeline: p.timeline
    }))
    .sort((a, b) => a.placement - b.placement)

  return {
    seed,
    rounds,
    players,
    policies: roster.map((p) => ({ player_id: p.id, policy_id: p.policy.id })),
    final_standings: final,
    pool_remaining_summary: {
      total_units_remaining: [...pool.values()].reduce((a, b) => a + b, 0)
    }
  }
}

module.exports = { simulateLobby }
