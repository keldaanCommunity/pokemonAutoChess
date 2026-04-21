import { Ability } from "./enum/Ability"
import { Pkm } from "./enum/Pokemon"

export const BITE_ABILITY_PARAMS = {
  baseDamageByStar: [40, 80, 120] as const,
  healTakenDamageRatio: 0.3,
  flinchDurationMs: 5000
} as const

export const PICKUP_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  goldByStar: [1, 2, 3] as const
} as const

export const ILLUSION_ABILITY_PARAMS = {
  healByStar: [30, 50, 70] as const,
  healScale: 0.5
} as const

export const LEECH_SEED_ABILITY_PARAMS = {
  durationByStarMs: [3000, 6000, 12000] as const,
  healByStar: [20, 40, 80] as const
} as const

export const DISABLE_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  silenceDurationByStarMs: [2000, 3000, 4000] as const
} as const

export const ACID_ARMOR_ABILITY_PARAMS = {
  defenseByStar: [3, 6, 12] as const,
  meleeHitCount: 4,
  attackerDefenseReduction: 1
} as const

export const FLAME_CHARGE_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const
} as const

export const JUDGEMENT_ABILITY_PARAMS = {
  damagePerSynergyLevel: 10
} as const

export const LIQUIDATION_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  defenseReductionByStar: [4, 8, 16] as const
} as const

export const RAZOR_WIND_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const BONEMERANG_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  hitCount: 2,
  returnDelayMs: 1000
} as const

export const AURORA_BEAM_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  freezeChance: 0.5,
  freezeDurationMs: 2000
} as const

export const SCHOOLING_ABILITY_PARAMS = {
  hpDamageRatio: 0.1,
  wishiwashiHpBonus: 50
} as const

export const SHADOW_BALL_ABILITY_PARAMS = {
  damageByStar: [30, 60, 100] as const,
  specialDefenseReduction: 2
} as const

export const STEAM_ERUPTION_ABILITY_PARAMS = {
  damage: 80,
  burnDurationMs: 3000
} as const

export const SHADOW_BONE_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  defenseBreakChance: 0.5,
  defenseReduction: 6
} as const

export const GROWL_ABILITY_PARAMS = {
  attackDebuffByStar: [3, 5, 7] as const,
  flinchDurationMs: 3000
} as const

export const INGRAIN_ABILITY_PARAMS = {
  healByStar: [15, 30, 60] as const,
  damageByStar: [15, 30, 60] as const,
  lockedDurationMs: 4000
} as const

export const TORMENT_ABILITY_PARAMS = {
  speedBoostByStar: [20, 35, 50] as const,
  cooldownResetMs: 500
} as const

export const STOMP_ABILITY_PARAMS = {
  damageFactorByStar: [3, 4, 5] as const
} as const

export const DARK_VOID_ABILITY_PARAMS = {
  damage: 30,
  radiusTiles: 4,
  sleepChance: 0.8,
  sleepDurationMs: 2000
} as const

export const GROWTH_ABILITY_PARAMS = {
  attackBuffByStar: [3, 5, 7] as const,
  hpBuffByStar: [10, 20, 40] as const,
  zenithMultiplier: 2,
  cooldownResetMs: 250
} as const

export const SHADOW_CLAW_ABILITY_PARAMS = {
  baseDamageByStar: [20, 40, 60] as const,
  singleTargetMultiplier: 2,
  healRatio: 0.25
} as const

export const STONE_AXE_ABILITY_PARAMS = {
  damage: 50
} as const

export const TOXIC_ABILITY_PARAMS = {
  durationByIndexMs: [3000, 6000, 9000] as const,
  scalingFactor: 0.5,
  defaultDurationMs: 9000
} as const

export const DEATH_WING_ABILITY_PARAMS = {
  damage: 150,
  healRatio: 0.75
} as const

export const GRUDGE_ABILITY_PARAMS = {
  silenceDurationMs: 3000,
  damageByStar: [18, 36, 52] as const
} as const

export const SHADOW_CLONE_ABILITY_PARAMS = {
  hpRatio: 0.5
} as const

export const SHADOW_FORCE_ABILITY_PARAMS = {
  damage: 60
} as const
export const SHADOW_PUNCH_ABILITY_PARAMS = {
  nextAttackDamageByStar: [30, 60, 120] as const
} as const

export const SLUDGE_ABILITY_PARAMS = {
  stackCountByStar: [2, 3, 4] as const,
  poisonDurationBaseMs: 3000,
  affectedTileCount: 3
} as const

export const SLUDGE_WAVE_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  poisonDurationByStarMs: [2000, 3000, 4000] as const
} as const

export const SMOG_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  affectedTileCount: 3
} as const

export const STONE_EDGE_ABILITY_PARAMS = {
  silenceDurationByStarMs: [5000, 8000, 8000] as const,
  critChanceBonus: 20,
  rangeBonus: 2,
  defenseScalingMultiplier: 1
} as const

export const ABSORB_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  allyHealRatio: 0.1
} as const

export const ACCELEROCK_ABILITY_PARAMS = {
  nbEffectsBaseline: 5,
  speedBonusPerEffect: 5,
  defReductionPerEffect: 2
} as const

export const ACID_SPRAY_ABILITY_PARAMS = {
  damage: 33,
  speDefReduction: 5,
  maxBounces: 5
} as const

export const ACROBATICS_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  baseTravelDistance: 4
} as const

export const AERIAL_ACE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const
} as const

export const AFTER_YOU_ABILITY_PARAMS = {
  ppGain: 15,
  speedBuff: 10
} as const

export const AGILITY_ABILITY_PARAMS = {
  speedBoostByStar: [10, 20, 30] as const
} as const

export const AIR_SLASH_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  flinchDurationMs: 7000
} as const

export const ANCHOR_SHOT_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  cooldownCapMs: 750
} as const

export const ANCIENT_POWER_ABILITY_PARAMS = {
  damageByStar: [40, 80, 120] as const,
  apBoost: 25
} as const

export const AQUA_RING_ABILITY_PARAMS = {
  healByStar: [20, 40, 80] as const
} as const

export const AQUA_TAIL_ABILITY_PARAMS = {
  damageByStar: [30, 60, 100] as const,
  shieldByStar: [30, 60, 100] as const
} as const

export const ARM_THRUST_ABILITY_PARAMS = {
  minHits: 2,
  maxHits: 5
} as const

export const ARMOR_CANNON_ABILITY_PARAMS = {
  mainDamage: 50,
  secondaryDamage: 50,
  finalDamage: 25,
  bounceTargets: 2
} as const

export const AROMATHERAPY_ABILITY_PARAMS = {
  healByStar: [20, 40, 80] as const
} as const

export const ASSURANCE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  hpThreshold: 0.5,
  lowHpMultiplier: 2
} as const

export const ATTRACT_ABILITY_PARAMS = {
  targetCountByStar: [1, 2, 3] as const,
  charmDurationMs: 1000
} as const

export const ASTRAL_BARRAGE_ABILITY_PARAMS = {
  nbGhosts: 7,
  damagePerGhost: 20,
  projectileDelayBaseMs: 500
} as const

export const AURA_WHEEL_ABILITY_PARAMS = {
  damage: 60,
  speedBuff: 10,
  cooldownResetMs: 500
} as const

export const AURASPHERE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  silenceDurationMs: 3000
} as const

export const AXE_KICK_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  ppBurn: 15,
  confusionChance: 0.3,
  confusionDurationMs: 3000
} as const

export const BANEFUL_BUNKER_ABILITY_PARAMS = {
  protectDurationMs: 2000,
  retaliationDamageByStar: [10, 20, 30] as const,
  poisonDurationMs: 3000
} as const

export const BARB_BARRAGE_ABILITY_PARAMS = {
  damageByStar: [15, 30, 45, 60] as const,
  poisonDurationMs: 3000
} as const

export const BARED_FANGS_ABILITY_PARAMS = {
  damageMultiplier: 1.6,
  speedSteal: 10
} as const

export const BEHEMOTH_BLADE_ABILITY_PARAMS = {
  atkBonus: 100
} as const

export const BEAT_UP_ABILITY_PARAMS = {
  summonCountByStar: [1, 2, 3] as const,
  summonHpPercentBase: 100,
  summonPokemon: Pkm.HOUNDOUR
} as const

export const BIDE_ABILITY_PARAMS = {
  durationMs: 3000,
  damageReceivedMultiplier: 2
} as const

export const BITTER_BLADE_ABILITY_PARAMS = {
  damage: 70,
  healRatioPerEnemy: 0.1
} as const

export const BLAST_BURN_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const
} as const

export const BLAZE_KICK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  burnDurationMs: 2000,
  burnMultiplier: 1.3
} as const

export const BLEAKWIND_STORM_ABILITY_PARAMS = {
  damage: 75,
  freezeDurationMs: 2000
} as const

export const BLIZZARD_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  frozenMultiplier: 2,
  freezeDurationMs: 2000,
  radiusTiles: 4
} as const

export const BLOOD_MOON_ABILITY_PARAMS = {
  atkMultiplier: 2,
  woundDurationMs: 3000
} as const

export const BODY_SLAM_ABILITY_PARAMS = {
  hpRatio: 0.3
} as const

export const BOLT_BEAK_ABILITY_PARAMS = {
  lowDamage: 80,
  highDamage: 160,
  ppThreshold: 40
} as const

export const BONE_ARMOR_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  defBuffByStar: [4, 8, 12] as const
} as const

export const BOOMBURST_ABILITY_PARAMS = {
  damage: 60,
  flinchDurationMs: 4000
} as const

export const BOUNCE_ABILITY_PARAMS = {
  nbBouncesByStar: [1, 2, 3] as const,
  damageByStar: [15, 20, 25] as const,
  bounceIntervalMs: 500
} as const

export const BRAVE_BIRD_ABILITY_PARAMS = {
  damageByStar: [30, 60, 90] as const
} as const

export const BRICK_BREAK_ABILITY_PARAMS = {
  atkMultiplier: 1.5,
  armorReductionDurationMs: 4000
} as const

export const BUG_BUZZ_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  paralyzedMultiplier: 2
} as const

export const BULK_UP_ABILITY_PARAMS = {
  atkRatio: 0.5,
  defRatio: 0.5,
  cooldownResetMs: 300
} as const

export const BULLDOZE_ABILITY_PARAMS = {
  damageByStar: [25, 45, 85] as const,
  speedReduction: 10,
  knockbackCooldownResetMs: 500
} as const

export const BULLET_PUNCH_ABILITY_PARAMS = {
  damage: 40,
  speedBuff: 40,
  buffDurationMs: 2000,
  cooldownResetMs: 250
} as const

export const BURN_UP_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const,
  selfBurnDurationMs: 3000
} as const

export const BURNING_JEALOUSY_ABILITY_PARAMS = {
  damage: 70,
  burnDurationMs: 5000
} as const

export const CAVERNOUS_CHOMP_ABILITY_PARAMS = {
  damageByStar: [40, 80, 160] as const,
  enragedDurationByStar: [1000, 2000, 3000] as const
} as const

export const CEASELESS_EDGE_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  targetCount: 3
} as const

export const CHAIN_CRAZED_ABILITY_PARAMS = {
  speedBoost: 20,
  atkBoost: 15,
  defBoost: 10,
  poisonDurationMs: 3000
} as const

export const CHARGE_ABILITY_PARAMS = {
  damageMultiplier: 1
} as const

export const CHARGE_BEAM_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  maxTargets: 3
} as const

export const CHARM_ABILITY_PARAMS = {
  attackReductionByStar: [2, 3, 4] as const,
  charmDurationMs: 3000
} as const

export const CHLOROBLAST_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const,
  selfDamageHpRatio: 0.5
} as const

export const CITY_SHUTTLE_ABILITY_PARAMS = {
  damageByStar: [10, 20, 30] as const,
  carriedAllyAttackRatio: 1,
  shieldByStar: [20, 40, 80] as const,
  dashDelayMs: 300,
  pathDamageWindowMs: 300
} as const

export const CLANGOROUS_SOUL_ABILITY_PARAMS = {
  statBuffByStar: [2, 4, 8] as const
} as const

export const CLOSE_COMBAT_ABILITY_PARAMS = {
  defenseReduction: 2,
  specialDefenseReduction: 2,
  damage: 130
} as const

export const COLUMN_CRUSH_ABILITY_PARAMS = {
  pillarThrowDamageByStar: [50, 100, 150] as const,
  throwPreparationDelayMs: 500,
  cooldownResetMs: 800,
  pillarSuicideDamage: 9999
} as const

export const CONFUSION_ABILITY_PARAMS = {
  durationByStarMs: [3000, 5000, 7000] as const,
  bonusDamageByStar: [75, 150, 300] as const
} as const

export const CORE_ENFORCER_ABILITY_PARAMS = {
  damage: 80,
  silenceDurationMs: 3000
} as const

export const COSMIC_POWER_MOON_ABILITY_PARAMS = {
  abilityPowerGain: 25
} as const

export const COSMIC_POWER_SUN_ABILITY_PARAMS = {
  attackRatio: 0.25
} as const

export const COTTON_GUARD_ABILITY_PARAMS = {
  shieldByStar: [15, 30, 60] as const,
  defenseBuff: 3,
  sleepDurationMs: 1000
} as const

export const COTTON_BALL_BOARD_EFFECT_SLEEP_DURATION_MS = 1000

export const COTTON_SPORE_ABILITY_PARAMS = {
  maxTargets: 3,
  speedDebuffByStar: [10, 20, 30] as const
} as const

export const COUNTER_ABILITY_PARAMS = {
  missingHpRatio: 0.5,
  minDamage: 1
} as const

export const CRABHAMMER_ABILITY_PARAMS = {
  damageByStar: [40, 80, 120] as const
} as const

export const CROSS_POISON_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  poisonDurationMs: 2000
} as const

export const CRUNCH_ABILITY_PARAMS = {
  damageByStar: [40, 80, 150] as const,
  healOnKillHpRatio: 0.5
} as const

export const CRUSH_CLAW_ABILITY_PARAMS = {
  defenseReductionByStar: [5, 10] as const,
  hitCount: 2,
  attackDamageRatio: 1
} as const

export const CRUSH_GRIP_ABILITY_PARAMS = {
  baseDamage: 50,
  hpRatioDamageBonus: 200
} as const

export const CURSE_ABILITY_PARAMS = {
  baseDelayByStarMs: [8000, 5000, 3000] as const,
  apCritScalingFactor: 0.2
} as const

export const CUT_ABILITY_PARAMS = {
  targetMaxHpDamageRatio: 0.4,
  woundDurationMs: 5000
} as const

export const DARK_HARVEST_ABILITY_PARAMS = {
  tickDamageByStar: [5, 10, 20] as const,
  healRatio: 0.3,
  effectDurationMs: 3200
} as const

export const DARK_LARIAT_ABILITY_PARAMS = {
  hitBase: 0.5,
  speedToHitsRatio: 0.01,
  hitCountMultiplier: 3,
  flinchDurationMs: 1000,
  animationWindowMs: 1000,
  wildfireAttackGain: 1,
  blazeAttackGain: 2,
  desolateLandAttackGain: 3,
  cooldownResetMs: 500
} as const

export const DECORATE_ABILITY_PARAMS = {
  attackBoostByStar: [1, 2, 3] as const,
  abilityPowerBoostByStar: [10, 20, 30] as const,
  vanillaShield: 80,
  rubySpeed: 30,
  matchaHp: 40,
  mintHeal: 40,
  mintSpecialDefense: 15,
  lemonCritChance: 40,
  saltedHeal: 40,
  saltedDefense: 15,
  rubySwirlAttack: 10,
  caramelSwirlCritPower: 80,
  rainbowSwirlPp: 60
} as const

export const DEEP_FREEZE_ABILITY_PARAMS = {
  damagePerBolt: 10,
  specialDefenseReductionPerBolt: 1,
  boltCount: 9,
  boltIntervalMs: 333
} as const

export const DEFENSE_CURL_ABILITY_PARAMS = {
  defenseBuffByStar: [5, 10, 15] as const,
  cooldownResetMs: 250
} as const

export const DETECT_ABILITY_PARAMS = {
  enemyDetectionRangeTiles: 2,
  protectDurationPerEnemyMs: 500
} as const

export const DIAMOND_STORM_ABILITY_PARAMS = {
  defenseDamageRatio: 1
} as const

export const DIG_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const
} as const

export const DIRE_CLAW_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  statusDurationMs: 3000
} as const

export const DISARMING_VOICE_ABILITY_PARAMS = {
  radiusByStar: [1, 2, 3] as const,
  charmDurationMs: 1000
} as const

export const DISCHARGE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  paralysisDurationMs: 5000
} as const

export const DIVE_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  shieldByStar: [15, 30, 60] as const,
  freezeDurationMs: 1000
} as const

export const DIZZY_PUNCH_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  confusionDurationMs: 3000
} as const

export const DOOM_DESIRE_ABILITY_PARAMS = {
  damage: 150,
  delayMs: 2000,
  cooldownResetMs: 200
} as const

export const DOUBLE_EDGE_ABILITY_PARAMS = {
  damageByStar: [55, 110, 220] as const,
  recoilByStar: [20, 40, 60] as const
} as const

export const DOUBLE_IRON_BASH_ABILITY_PARAMS = {
  atkRatio: 1.5,
  flinchDurationMs: 3000
} as const

export const DOUBLE_SHOCK_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const,
  selfParalysisDurationMs: 3000
} as const

export const DRACO_ENERGY_ABILITY_PARAMS = {} as const

export const DRACO_METEOR_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120, 150] as const,
  apReduction: 20,
  delayMs: 1000
} as const

export const DRAGON_BREATH_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const
} as const

export const DRAGON_CLAW_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  woundDurationMs: 4000
} as const

export const DRAGON_DARTS_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  hitCount: 3,
  ppGainOnKill: 40
} as const

export const DRAGON_PULSE_ABILITY_PARAMS = {
  damage: 20,
  chainDelayMs: 400
} as const

export const DRAGON_TAIL_ABILITY_PARAMS = {
  damageByStar: [30, 60, 100] as const,
  defenseBuffByStar: [2, 4, 6] as const
} as const

export const DRAIN_PUNCH_ABILITY_PARAMS = {
  atkMultiplier: 2,
  healRatio: 2
} as const

export const DREAM_EATER_ABILITY_PARAMS = {
  damageByStar: [45, 90, 150] as const,
  sleepDurationByStar: [3000, 4000, 5000] as const
} as const

export const DRILL_PECK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const
} as const

export const DRILL_RUN_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const
} as const

export const DRUM_BEATING_ABILITY_PARAMS = {
  buffByStar: [10, 20, 40] as const
} as const

export const EAR_DIG_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  perHoleLevelDamageByStar: [5, 10, 20] as const
} as const

export const ECHO_ABILITY_PARAMS = {
  damageByStar: [3, 6, 9] as const
} as const

export const EERIE_SPELL_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  healByStar: [15, 30, 45] as const,
  bounceCount: 4,
  bounceDelayMs: 300
} as const

export const EGG_BOMB_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  eggChance: 0.25,
  armorReductionDurationMs: 4000
} as const

export const ELECTRIFY_ABILITY_PARAMS = {
  shieldByStar: [15, 30, 60] as const
} as const

export const ELECTRO_BALL_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  speedDecrement: 30,
  baseDelayMs: 200,
  speedNormalization: 50
} as const

export const ELECTRO_BOOST_ABILITY_PARAMS = {
  runeProtectDurationMs: 5000
} as const

export const ELECTRO_SHOT_ABILITY_PARAMS = {
  damageByStar: [80, 100, 120] as const,
  apBoost: 40,
  chargeDelayMs: 2000
} as const

export const ENCORE_ABILITY_PARAMS = {} as const

export const ENTANGLING_THREAD_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  paralysisDurationMs: 4000
} as const

export const ENTRAINMENT_ABILITY_PARAMS = {
  ppGained: 10
} as const

export const ERUPTION_ABILITY_PARAMS = {
  damageByStar: [30, 50, 70] as const,
  projectileCountByStar: [20, 30, 45] as const,
  burnDurationMs: 5000,
  projectileIntervalMs: 100
} as const

export const EXPANDING_FORCE_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const
} as const

export const EXPLOSION_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const
} as const

export const EXTREME_SPEED_ABILITY_PARAMS = {
  damage: 40
} as const

export const FACADE_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  negativeStatusMultiplier: 2
} as const

export const FAIRY_LOCK_ABILITY_PARAMS = {
  lockDurationMs: 5000,
  totalDamage: 90
} as const

export const FAIRY_WIND_ABILITY_PARAMS = {
  ppGainByStar: [5, 10, 20] as const
} as const

export const FAKE_OUT_ABILITY_PARAMS = {
  damageByStar: [40, 80, 150] as const,
  flinchDurationMs: 3000,
  apReduction: 30
} as const

export const FAKE_TEARS_ABILITY_PARAMS = {
  damageByStar: [5, 10, 15] as const,
  armorReductionDurationMs: 3000
} as const

export const FEATHER_DANCE_ABILITY_PARAMS = {
  featherCountByStar: [8, 10, 12] as const
} as const

export const FELL_STINGER_ABILITY_PARAMS = {
  atkMultiplier: 4,
  deathAtkBoostRatio: 0.3
} as const

export const FIERY_DANCE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  apBoost: 30
} as const

export const FIERY_WRATH_ABILITY_PARAMS = {
  damage: 50,
  radius: 4,
  flinchChance: 0.5,
  flinchDurationMs: 4000
} as const

export const FILLET_AWAY_ABILITY_PARAMS = {
  maxHpLossRatio: 0.3,
  atkBoost: 10,
  speedBoost: 20,
  protectDurationMs: 1000
} as const

export const FIRE_BLAST_ABILITY_PARAMS = {
  damageByStar: [30, 60, 110] as const
} as const

export const FIRE_FANG_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  burnDurationMs: 2000
} as const

export const FIRE_LASH_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  armorReductionDurationMs: 4000
} as const

export const FIRE_SPIN_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  burnDurationMs: 3000
} as const

export const FIRESTARTER_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  speedBuffByStar: [10, 20, 40] as const,
  speedBuffDelayMs: 500,
  emberStepDelayMs: 50,
  emberPersistBaseDelayMs: 400
} as const

export const FIRST_IMPRESSION_ABILITY_PARAMS = {
  damageByStar: [45, 90, 180] as const,
  flinchDurationMs: 5000
} as const

export const FISHIOUS_REND_ABILITY_PARAMS = {
  damage: 80
} as const

export const FISSURE_ABILITY_PARAMS = {
  numberOfRiftsByStar: [2, 3, 4] as const,
  damageByStar: [25, 50, 75] as const
} as const

export const FLAMETHROWER_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  burnDurationMs: 4000,
  range: 3
} as const

export const FLASH_ABILITY_PARAMS = {
  durationByStar: [2000, 4000, 6000] as const,
  radius: 3
} as const

export const FLEUR_CANNON_ABILITY_PARAMS = {
  damage: 100,
  apReduction: 20
} as const

export const FLORAL_HEALING_ABILITY_PARAMS = {} as const

export const FLOWER_TRICK_ABILITY_PARAMS = {
  damageByStar: [15, 40, 85] as const,
  critBonusDamage: 15,
  explosionDelayMs: 3000
} as const

export const FLY_ABILITY_PARAMS = {
  atkMultiplier: 4,
  protectDurationMs: 2000,
  takeoffAnimationDelayMs: 500,
  impactDelayMs: 1000
} as const

export const FLYING_PRESS_ABILITY_PARAMS = {
  maxHpRatio: 0.5,
  broadcastDelayMs: 500,
  delayMs: 1000
} as const

export const FOCUS_PUNCH_ABILITY_PARAMS = {
  atkMultiplier: 5,
  chargeDelayMs: 900,
  cooldownMs: 1000
} as const

export const FOLLOW_ME_ABILITY_PARAMS = {
  charmDurationMs: 3000,
  shield: 40
} as const

export const FORCE_PALM_ABILITY_PARAMS = {
  baseDamage: 60,
  maxHpRatio: 0.1,
  paralysisBonus: 40,
  paralysisDurationMs: 6000
} as const

export const FORECAST_ABILITY_PARAMS = {
  shield: 10,
  atkBuff: 4,
  ppBuff: 8,
  defBuff: 2,
  speDefBuff: 2
} as const

export const FOUL_PLAY_ABILITY_PARAMS = {
  atkMultiplierByStar: [2, 4, 6] as const
} as const

export const FREEZE_DRY_ABILITY_PARAMS = {
  baseDamage: 70,
  killSplashDamage: 30,
  attackDelayMs: 250
} as const

export const FREEZING_GLARE_ABILITY_PARAMS = {
  damage: 80,
  freezeChance: 0.5,
  freezeDurationMs: 3000
} as const

export const FROST_BREATH_ABILITY_PARAMS = {
  damageByStar: [35, 70, 140] as const,
  freezeChance: 0.5,
  freezeDurationMs: 2000
} as const

export const FURY_SWIPES_ABILITY_PARAMS = {
  baseAttackCount: 5,
  ppPerRemainingHit: 20,
  cooldownExtensionMs: 1000
} as const

export const FUTURE_SIGHT_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  maxTargets: 5,
  delayMs: 2000
} as const

export const GEAR_GRIND_ABILITY_PARAMS = {
  speedFactorByStar: [0.25, 0.5, 1] as const,
  hitCount: 2,
  hitDelayMs: 250
} as const

export const GEOMANCY_ABILITY_PARAMS = {
  atkBuff: 15,
  speDefBuff: 10,
  speedBuff: 20
} as const

export const GIGATON_HAMMER_ABILITY_PARAMS = {
  damageByStar: [100, 200, 400] as const,
  fatigueDurationMs: 6000
} as const

export const GLACIAL_LANCE_ABILITY_PARAMS = {
  atkMultiplier: 3,
  travelBaseMs: 500,
  impactDelayMs: 500,
  splashDamageRatio: 0.5
} as const

export const GLAIVE_RUSH_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const,
  armorReductionDurationMs: 6000
} as const

export const GOLD_RUSH_ABILITY_PARAMS = {
  baseDamage: 20,
  moneyGain: 2,
  goldDamagePercent: 100
} as const

export const GRASS_WHISTLE_ABILITY_PARAMS = {
  targetCountByStar: [1, 2, 4] as const,
  sleepDurationMs: 2000
} as const

export const GRAVITY_ABILITY_PARAMS = {
  baseLockDurationMs: 2000
} as const

export const GRUDGE_DIVE_ABILITY_PARAMS = {
  damageByStar: [30, 60, 90, 120] as const,
  recoilRatio: 0.1,
  damagePerFallenAllyByStar: [5, 10, 15, 20] as const
} as const

export const GUILLOTINE_ABILITY_PARAMS = {
  atkMultiplier: 3,
  ppGainRatio: 0.5
} as const

export const GULP_MISSILE_ABILITY_PARAMS = {
  damage: 55,
  pikachuChance: 0.2
} as const

export const GUNK_SHOT_ABILITY_PARAMS = {
  damageByStar: [50, 100] as const,
  poisonDurationByStar: [2000, 4000] as const
} as const

export const HAIL_ABILITY_PARAMS = {
  damage: 50,
  projectileCountByStar: [10, 20, 30] as const,
  freezeDurationMs: 1000
} as const

export const HAPPY_HOUR_ABILITY_PARAMS = {
  atkBuffByStar: [2, 4, 7] as const
} as const

export const HARDEN_ABILITY_PARAMS = {
  defGainByStar: [4, 8, 12] as const
} as const

export const HEAD_SMASH_ABILITY_PARAMS = {
  damageByStar: [40, 80, 150] as const,
  recoilByStar: [10, 20, 40] as const
} as const

export const HEADBUTT_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  flinchDurationMs: 5000
} as const

export const HEADLONG_RUSH_ABILITY_PARAMS = {
  finalTargetDamageByStar: [20, 40, 80] as const,
  pathDamageByStar: [10, 20, 30] as const,
  knockbackCooldownMs: 500
} as const

export const HEAL_BLOCK_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  woundDurationMs: 5000
} as const

export const HEAL_ORDER_ABILITY_PARAMS = {
  damageByStar: [25, 45, 65] as const
} as const

export const HEART_SWAP_ABILITY_PARAMS = {
  damage: 100
} as const

export const HEAT_CRASH_ABILITY_PARAMS = {
  damageByStar: [40, 60, 80] as const,
  attackDiffMultiplier: 2,
  knockbackCooldownMs: 500
} as const

export const HEAT_WAVE_ABILITY_PARAMS = {
  damageByStar: [10, 20, 30] as const,
  burnChance: 0.1,
  burnDurationMs: 3000
} as const

export const HEAVY_SLAM_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  bonusMultiplierFactor: 0.5
} as const

export const HELPING_HAND_ABILITY_PARAMS = {
  shieldByStar: [30, 60, 100] as const,
  nbAlliesBuffed: 2
} as const

export const HEX_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  negativeStatusMultiplier: 2
} as const

export const HIGH_HORSEPOWER_ABILITY_PARAMS = {
  damageByStar: [15, 25, 35] as const,
  doubleHitDelayMs: 300
} as const

export const HIGH_JUMP_KICK_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  maxPpStolen: 40
} as const

export const HORN_ATTACK_ABILITY_PARAMS = {
  atkMultiplierByStar: [3, 4, 5] as const,
  armorReductionDurationMs: 8000
} as const

export const HORN_DRILL_ABILITY_PARAMS = {
  atkMultiplierByStar: [3, 4, 5] as const,
  baseExecuteChance: 0.3,
  executeDamage: 9999
} as const

export const HORN_LEECH_ABILITY_PARAMS = {
  atkMultiplier: 2,
  healRatio: 0.5,
  overhealShieldRatio: 0.5
} as const

export const HURRICANE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  paralysisDurationMs: 3000
} as const

export const HYDRO_PUMP_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const HYPER_BEAM_ABILITY_PARAMS = {
  damageByStar: [50, 100, 150] as const,
  chargeDelayMs: 1000,
  cooldownMs: 1000,
  fatigueDurationMs: 5000
} as const

export const HYPER_DRILL_ABILITY_PARAMS = {
  damageByStar: [10, 30, 50] as const,
  doubleDamageMultiplier: 2
} as const

export const HYPER_VOICE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  confusionDurationByStar: [1000, 2000, 3000] as const,
  confusionChance: 0.3
} as const

export const HYPERSPACE_FURY_ABILITY_PARAMS = {
  baseHits: 4,
  damagePerHit: 15,
  defenseReduction: 1
} as const

export const HYPNOSIS_ABILITY_PARAMS = {
  sleepDurationByStar: [2000, 4000, 6000] as const,
  scaleFactor: 0.5
} as const

export const ICE_BALL_ABILITY_PARAMS = {
  baseDamageByStar: [10, 20, 30] as const,
  multiplierByStar: [0.5, 1, 1.5] as const,
  speDefBoost: 10
} as const

export const ICE_FANG_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  freezeDurationByStar: [1000, 1500, 2000] as const
} as const

export const ICE_HAMMER_ABILITY_PARAMS = {
  damageByStar: [50, 100] as const,
  freezeDurationMs: 3000,
  paralysisDurationMs: 3000
} as const

export const ICE_SPINNER_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  hitDelayMs: 100,
  knockbackCooldownMs: 500
} as const

export const ICICLE_CRASH_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const ICICLE_MISSILE_ABILITY_PARAMS = {
  hitCountByStar: [1, 2, 3] as const,
  damage: 50,
  freezeDurationMs: 2000,
  hitDelayMs: 1000
} as const

export const ICY_WIND_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  speedDebuffByStar: [10, 20, 40] as const
} as const

export const INFERNAL_PARADE_ABILITY_PARAMS = {
  damage: 30,
  hitDelayMs: 500,
  burnChance: 0.5,
  burnDurationMs: 3000
} as const

export const INFESTATION_ABILITY_PARAMS = {
  damagePerBugAlly: 10,
  benchMoveDelayDistanceMs: 150,
  benchMoveDelayOffsetMs: 30
} as const

export const IRON_DEFENSE_ABILITY_PARAMS = {
  shieldByStar: [20, 40, 80] as const
} as const

export const IRON_HEAD_ABILITY_PARAMS = {
  defenseBuffByStar: [5, 10, 15] as const
} as const

export const IRON_TAIL_ABILITY_PARAMS = {
  knockbackCooldownMs: 500,
  defenseDamageMultiplier: 1
} as const

export const IVY_CUDGEL_ABILITY_PARAMS = {
  damage: 100,
  tealAttackPerAdjacentEnemy: 6,
  wellspringAllyPpGain: 25,
  wellspringAllyHeal: 50,
  hearthflameAdjacentDamage: 30,
  hearthflameBurnDurationMs: 5000,
  cornerstoneFlinchDurationMs: 5000
} as const

export const JAW_LOCK_ABILITY_PARAMS = {
  atkMultiplier: 1.25,
  bonusDamageByStar: [10, 15, 20] as const,
  healOnBittenByStar: [25, 50, 100] as const,
  lockDurationMs: 3000
} as const

export const JET_PUNCH_ABILITY_PARAMS = {
  speedMultiplier: 1
} as const

export const KNOWLEDGE_THIEF_ABILITY_PARAMS = {
  experienceGain: 1
} as const

export const KING_SHIELD_ABILITY_PARAMS = {
  durationMs: 1500,
  shieldByStar: [10, 20, 40] as const,
  bladeAttackDelta: 10,
  bladeDefenseDelta: -5,
  bladeSpeDefenseDelta: -5
} as const

export const KNOCK_OFF_ABILITY_PARAMS = {
  baseDamage: 90,
  damagePerTargetItem: 30
} as const

export const KOWTOW_CLEAVE_ABILITY_PARAMS = {
  baseAtkMultiplier: 1.5,
  fallenAlliesBonusPerUnit: 0.2
} as const

export const LANDS_WRATH_ABILITY_PARAMS = {
  baseDamage: 40,
  defenseReduction: 5,
  atkMultiplier: 1
} as const

export const LASER_BLADE_ABILITY_PARAMS = {
  alternateSpinShield: 25,
  alternateSpinDamage: 25,
  frontSpinBaseDamage: 25,
  frontSpinSecondHitDelayMs: 300
} as const

export const LAST_RESPECTS_ABILITY_PARAMS = {
  damageByStar: [30, 60, 90] as const,
  baseCurseDelayByStarMs: [10000, 8000, 5000] as const,
  apCritScaleFactor: 0.2
} as const

export const LAVA_PLUME_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const LEAF_BLADE_ABILITY_PARAMS = {
  atkMultiplier: 1
} as const

export const LEECH_LIFE_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const LICK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  confusionDurationMs: 3000,
  paralysisDurationMs: 3000
} as const

export const LINGERING_AROMA_ABILITY_PARAMS = {
  durationMs: 5000,
  damageByStar: [10, 20, 30] as const,
  ppLoss: 5
} as const

export const LINK_CABLE_ABILITY_PARAMS = {
  pulseDelayMs: 300,
  partnerDamage: 40,
  soloDamage: 20,
  partnerDischargeDelayMs: 200
} as const

export const LOCK_ON_ABILITY_PARAMS = {
  trueDamageMultiplier: 2
} as const

export const LOVELY_KISS_ABILITY_PARAMS = {
  damageByStar: [50, 100, 150] as const,
  sleepDurationByStar: [2000, 4000, 6000] as const
} as const

export const LUNAR_BLESSING_ABILITY_PARAMS = {
  healRatio: 0.25
} as const

export const LUNGE_ABILITY_PARAMS = {
  attackReduction: 5,
  damage: 50
} as const

export const LUSTER_PURGE_ABILITY_PARAMS = {
  damage: 30,
  specialDefenseReduction: 5,
  firstHitMaxRange: 4,
  secondHitDelayMs: 1000
} as const

export const MACH_PUNCH_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  cooldownResetMs: 100
} as const

export const MAGIC_BOUNCE_ABILITY_PARAMS = {
  durationMs: 5000,
  reflectMultiplierByStar: [0.5, 1] as const
} as const

export const MAGIC_POWDER_ABILITY_PARAMS = {
  shieldByStar: [15, 30, 60] as const,
  silenceDurationByStar: [2000, 3000, 4000] as const
} as const

export const MAGICAL_LEAF_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  armorReductionDurationMs: 3000
} as const

export const MAGMA_STORM_ABILITY_PARAMS = {
  baseDamage: 100,
  initialPower: 1,
  powerDecayPerJump: 0.2,
  maxDepth: 20,
  propagationDelayMs: 250
} as const

export const MAGNET_BOMB_ABILITY_PARAMS = {
  splashDamageByStar: [10, 20, 40] as const,
  centerDamageByStar: [20, 40, 80] as const,
  lockDurationMs: 1500
} as const

export const MAGNET_PULL_ABILITY_PARAMS = {} as const

export const MAGNET_RISE_ABILITY_PARAMS = {
  alliesBuffedByStar: [2, 4, 6] as const,
  protectDurationMs: 2000,
  dodgeChance: 0.1
} as const

export const MAKE_IT_RAIN_ABILITY_PARAMS = {
  baseDamage: 100,
  goldDamagePercent: 100
} as const

export const MALIGNANT_CHAIN_ABILITY_PARAMS = {
  baseDurationMs: 3000,
  poisonStacks: 3
} as const

export const MANTIS_BLADES_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const
} as const

export const MAWASHI_GERI_ABILITY_PARAMS = {
  baseDamage: 60,
  atkAdvantageMultiplier: 2
} as const

export const MEGA_PUNCH_ABILITY_PARAMS = {
  baseDamage: 60,
  defAdvantageMultiplier: 2
} as const

export const MEDITATE_ABILITY_PARAMS = {
  attackBuffRatio: 1
} as const

export const METAL_BURST_ABILITY_PARAMS = {
  baseDamage: 30,
  damagePerFightingBlock: 3
} as const

export const METAL_CLAW_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  atkBuffByStar: [2, 4, 6] as const
} as const

export const METEOR_MASH_ABILITY_PARAMS = {
  baseHits: 3,
  bonusHitsInPsychicField: 1,
  atkBuffPerHit: 2,
  atkDamageRatio: 1
} as const

export const METRONOME_ABILITY_PARAMS = {
  ultraThreshold: 1 / 8,
  legendaryThreshold: 2 / 8,
  epicThreshold: 3 / 8,
  uniqueThreshold: 4 / 8,
  rareThreshold: 5 / 8,
  specialThreshold: 6 / 8,
  uncommonThreshold: 7 / 8
} as const

export const MIMIC_ABILITY_PARAMS = {} as const

export const MIND_BEND_ABILITY_PARAMS = {
  fallbackDamage: 100,
  baseDurationMs: 2000
} as const

export const MIST_BALL_ABILITY_PARAMS = {
  damage: 25,
  firstHitMaxRange: 4,
  abilityPowerReduction: 30,
  secondHitDelayMs: 1000
} as const

export const MOON_DREAM_ABILITY_PARAMS = {
  sleepDurationByStar: [3000, 6000, 9000] as const,
  shieldByStar: [10, 20, 30] as const,
  allyCount: 3,
  armorReductionDurationMs: 4000,
  woundDurationMs: 4000
} as const

export const MOONBLAST_ABILITY_PARAMS = {
  damage: 18,
  initialMoonCount: 6,
  maxMoonJumps: 20,
  moonDelayMs: 200,
  bonusMoonsOnKill: 1
} as const

export const MOONGEIST_BEAM_ABILITY_PARAMS = {
  enemyDamage: 100,
  paralysisDurationMs: 3000,
  allyShield: 100
} as const

export const MORTAL_SPIN_ABILITY_PARAMS = {
  damageByStar: [20, 30, 40] as const,
  poisonDurationMs: 4000,
  knockbackCooldownMs: 500
} as const

export const MOUNTAIN_GALE_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  hitsByStar: [1, 3, 3] as const,
  flinchDurationMs: 3000,
  hitDelayMs: 200
} as const

export const MUD_BUBBLE_ABILITY_PARAMS = {
  healByStar: [10, 20, 40] as const,
  cooldownResetMs: 250
} as const

export const MUD_SHOT_ABILITY_PARAMS = {
  damageByStar: [25, 50, 75] as const,
  speedDebuffByStar: [10, 20, 30] as const
} as const

export const MUDDY_WATER_ABILITY_PARAMS = {
  damageByStar: [40, 80] as const,
  maxTargets: 3,
  armorReductionDurationMs: 4000,
  woundDurationMs: 4000
} as const

export const MULTI_ATTACK_ABILITY_PARAMS = {
  damagePerSynergyLevel: 13
} as const

export const NASTY_PLOT_ABILITY_PARAMS = {
  attackBuff: 10,
  cooldownResetMs: 250
} as const

export const NATURAL_GIFT_ABILITY_PARAMS = {
  healByStar: [30, 60, 120] as const,
  runeProtectDurationByStarMs: [1000, 2000, 3000] as const
} as const

export const NIGHT_SHADE_ABILITY_PARAMS = {
  hpRatioByStar: [0.25, 0.33, 0.5] as const,
  apScalingFactor: 0.5
} as const

export const NIGHT_SLASH_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const
} as const

export const NIGHTMARE_ABILITY_PARAMS = {
  fatigueDurationByStar: [2000, 4000, 6000] as const,
  damageByStar: [25, 50, 100] as const
} as const

export const NO_RETREAT_ABILITY_PARAMS = {
  statBuffPerFalinks: 1,
  speedBuffPerFalinks: 5,
  troopDamage: 20,
  troopHitDelayMs: 100
} as const

export const NUZZLE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  paralysisDurationMs: 3000
} as const

export const OBSTRUCT_ABILITY_PARAMS = {
  baseDurationMs: 2000,
  scalingFactor: 0.5,
  defenseReduction: 2
} as const

export const OCTAZOOKA_ABILITY_PARAMS = {
  atkMultiplier: 3,
  blindDurationMs: 4000
} as const

export const OCTOLOCK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 90] as const,
  lockDurationMs: 3000,
  armorReductionDurationMs: 3000
} as const

export const ORDER_UP_ABILITY_PARAMS = {
  damage: 100,
  curlyAttackBuff: 8,
  droopyDefenseBuff: 8,
  stretchySpeedBuff: 25
} as const

export const ORIGIN_PULSE_ABILITY_PARAMS = {
  damage: 100
} as const

export const OUTRAGE_ABILITY_PARAMS = {
  atkMultiplier: 3,
  confusionDurationMs: 2000
} as const

export const OVERDRIVE_ABILITY_PARAMS = {
  radius: 3,
  baseAtkMultiplier: 1.2,
  decayPerDistance: 0.2
} as const

export const OVERHEAT_ABILITY_PARAMS = {
  radius: 4,
  baseDamage: 50,
  burnMultiplier: 1.3
} as const

export const PARABOLIC_CHARGE_ABILITY_PARAMS = {
  healByStar: [25, 50, 50] as const,
  damageByStar: [25, 50, 100] as const
} as const

export const PASTEL_VEIL_ABILITY_PARAMS = {
  shieldByStar: [20, 40, 80] as const
} as const

export const PAYDAY_ABILITY_PARAMS = {
  baseDamageByStar: [30, 60, 90] as const,
  apScalingFactor: 0.5,
  moneyGainByStar: [1, 2, 3] as const
} as const

export const PECK_ABILITY_PARAMS = {
  damageByStar: [10, 30, 50] as const
} as const

export const PETAL_BLIZZARD_ABILITY_PARAMS = {
  damage: 30,
  apGain: 10
} as const

export const PETAL_DANCE_ABILITY_PARAMS = {
  damageByStar: [20, 30, 50] as const,
  targetCountByStar: [3, 4, 5] as const
} as const

export const PLASMA_FISSION_ABILITY_PARAMS = {
  baseDamage: 60,
  splitDelayMs: 400,
  splitDamageDecayRatio: 0.5,
  minSplitDamage: 1
} as const

export const PLASMA_FIST_ABILITY_PARAMS = {
  damage: 120,
  healRatio: 0.3
} as const

export const POWDER_ABILITY_PARAMS = {
  speedReductionByStar: [10, 20, 30] as const,
  damageByStar: [10, 20, 30] as const,
  speedDebuffDurationMs: 5000,
  apScalingDivisor: 100
} as const

export const POWDER_SNOW_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  freezeChanceByStar: [0.15, 0.3, 0.5] as const,
  freezeDurationMs: 2000
} as const

export const POWER_HUG_ABILITY_PARAMS = {
  damageByStar: [40, 80] as const,
  lockedDurationMs: 3000,
  paralysisDurationMs: 3000
} as const

export const POWER_WASH_ABILITY_PARAMS = {
  totalDamage: 160,
  damageSplitDivisor: 2,
  dropDelayMs: 100
} as const

export const POWER_WHIP_ABILITY_PARAMS = {
  baseDamageByStar: [15, 30, 60] as const,
  hpDamageRatio: 0.3
} as const

export const PRECIPICE_BLADES_ABILITY_PARAMS = {
  damage: 100
} as const

export const PRESENT_ABILITY_PARAMS = {
  healChance: 0.1,
  lowDamageChance: 0.5,
  mediumDamageChance: 0.8,
  healAmount: 50,
  lowDamage: 80,
  mediumDamage: 150,
  highDamage: 300
} as const

export const PRISMATIC_LASER_ABILITY_PARAMS = {
  damage: 60,
  spreadRadius: 1,
  pushDistance: 1
} as const

export const PROTECT_ABILITY_PARAMS = {
  scalingFactor: 0.5,
  durationByStarMs: [1000, 3000, 5000] as const
} as const

export const PSYCHIC_FANGS_ABILITY_PARAMS = {
  damage: 80
} as const

export const PSYCHO_BOOST_ABILITY_PARAMS = {
  damage: 150,
  abilityPowerReductionPerHit: 20,
  targetOffsetsX: [-1, 0, 1] as const
} as const

export const PSYCHO_CUT_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  hitCount: 3
} as const

export const PSYCHO_SHIFT_ABILITY_PARAMS = {
  damage: 60
} as const

export const PSYSHIELD_BASH_ABILITY_PARAMS = {
  damageByStar: [30, 40, 50, 60] as const,
  protectDurationMs: 1000
} as const

export const PSYSHOCK_ABILITY_PARAMS = {
  ppBurnByStar: [20, 40, 80] as const,
  apScalingDivisor: 100
} as const

export const PSYSTRIKE_ABILITY_PARAMS = {
  damage: 80
} as const

export const PUMMELING_PAYBACK_ABILITY_PARAMS = {
  healAmount: 40,
  baseDamage: 50,
  attackScaling: 1.25
} as const

export const PURIFY_ABILITY_PARAMS = {
  healByStar: [15, 30, 60] as const
} as const

export const PYRO_BALL_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  burnDurationMs: 2000
} as const

export const QUIVER_DANCE_ABILITY_PARAMS = {
  attackBuff: 5,
  specialDefenseBuff: 5,
  speedBuff: 10,
  abilityPowerBuff: 20
} as const

export const RAGE_ABILITY_PARAMS = {
  rageDurationMs: 3000,
  missingHpStepRatio: 0.1,
  attackBoostPerStepRatio: 0.1,
  cooldownResetMs: 1000
} as const

export const RAGING_BULL_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  armorReductionDurationMs: 3000
} as const

export const RAPID_SPIN_ABILITY_PARAMS = {
  damageByStar: [20, 50] as const,
  defenseBuffAtkRatio: 0.5
} as const

export const RAZOR_LEAF_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const RECOVER_ABILITY_PARAMS = {
  healRatio: 0.25
} as const

export const REFLECT_ABILITY_PARAMS = {
  durationMs: 2000
} as const

export const RELIC_SONG_ABILITY_PARAMS = {
  effectCycleLength: 3,
  sleepScalingFactor: 0.5,
  sleepBaseDurationMs: 2000,
  allyShield: 10
} as const

export const RETALIATE_ABILITY_PARAMS = {
  attackDamageRatio: 1.5,
  baseHitCount: 1
} as const

export const RETURN_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  abilityPowerGain: 2
} as const

export const ROAR_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const ROAR_OF_TIME_ABILITY_PARAMS = {
  speedBoost: 20
} as const

export const ROCK_ARTILLERY_ABILITY_PARAMS = {
  rockCountByStar: [10, 15, 25] as const,
  damageByStar: [20, 30, 40] as const,
  impactDelayMs: 100
} as const

export const ROCK_HEAD_ABILITY_PARAMS = {
  damagePercentAtkPlusDef: 120
} as const

export const ROCK_SLIDE_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  flyingMultiplier: 2
} as const

export const ROCK_SMASH_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  armorBreakDurationByStar: [3000, 6000, 9000] as const
} as const

export const ROCK_TOMB_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  speedReductionByStar: [10, 20, 40] as const
} as const

export const ROCK_WRECKER_ABILITY_PARAMS = {
  damageByStar: [80, 160] as const,
  flinchDurationMs: 2000,
  fatigueDurationMs: 4000
} as const

export const ROLLOUT_ABILITY_PARAMS = {
  defenseGainByStar: [2, 5, 10] as const,
  damageDefenseMultiplier: 2
} as const

export const ROOST_ABILITY_PARAMS = {
  shieldByStar: [20, 40, 80] as const,
  sleepDurationMs: 1000
} as const

export const SACRED_SWORD_CAVERN_ABILITY_PARAMS = {
  baseTrueDamage: 80,
  bonusTrueDamagePerEnemyOnOwnSide: 20
} as const

export const SACRED_SWORD_GRASS_ABILITY_PARAMS = {
  baseTrueDamage: 80,
  bonusTrueDamagePerRemainingAlly: 10
} as const

export const SACRED_SWORD_IRON_ABILITY_PARAMS = {
  baseTrueDamage: 80,
  bonusTrueDamagePerFallenAlly: 15
} as const

export const SALT_CURE_ABILITY_PARAMS = {
  shieldByStar: [10, 20, 40] as const,
  burnDurationMs: 5000,
  radius: 2
} as const

export const SAND_SPIT_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  blindDurationMs: 2000,
  coneDepth: 1
} as const

export const SAND_TOMB_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  statusDurationByStar: [3000, 5000, 8000] as const
} as const

export const SANDSEAR_STORM_ABILITY_PARAMS = {
  damage: 75,
  burnDurationMs: 2000
} as const

export const SCALE_SHOT_ABILITY_PARAMS = {
  initialDamage: 40,
  mainShotDamage: 20,
  pathDamage: 10,
  armorBreakDurationMs: 2000,
  scaleLaunchStartDelayMs: 2000,
  launchIntervalMs: 100
} as const

export const SCREECH_ABILITY_PARAMS = {
  defenseReductionByStar: [2, 4, 8] as const,
  radius: 2
} as const

export const SEARING_SHOT_ABILITY_PARAMS = {
  damage: 50,
  radius: 2,
  burnDurationMs: 3000
} as const

export const SECRET_SWORD_ABILITY_PARAMS = {
  damage: 150,
  fightingBlockThresholdForTrueDamage: 20
} as const

export const SEED_FLARE_ABILITY_PARAMS = {
  damage: 30,
  radius: 5,
  specialDefenseReduction: 3
} as const

export const SEISMIC_TOSS_ABILITY_PARAMS = {
  damageByStar: [5, 10, 20] as const,
  fallbackPlayerLevel: 5
} as const

export const SHADOW_SNEAK_ABILITY_PARAMS = {
  damage: 50
} as const

export const SHED_TAIL_ABILITY_PARAMS = {
  shieldAmount: 80
} as const

export const SHEER_COLD_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const,
  executeChanceByStar: [10, 20, 30] as const,
  executeDamage: 9999
} as const

export const SHELL_SIDE_ARM_ABILITY_PARAMS = {
  poisonDurationByStarMs: [2000, 3000] as const,
  abilityPowerGainByStar: [10, 20] as const,
  maxBounces: 4,
  bounceDelayMs: 300
} as const

export const SHELL_SMASH_ABILITY_PARAMS = {
  damageByStar: [15, 30] as const,
  abilityPowerBuff: 20,
  attackBuff: 2,
  speedBuff: 20,
  defenseDebuff: 2,
  specialDefenseDebuff: 2
} as const

export const SHELL_TRAP_ABILITY_PARAMS = {
  baseDamage: 50,
  shieldGain: 75
} as const

export const SHELTER_ABILITY_PARAMS = {
  defenseBuffByStar: [3, 6, 12] as const
} as const

export const SHIELDS_DOWN_ABILITY_PARAMS = {
  coreForms: [
    Pkm.MINIOR_KERNEL_BLUE,
    Pkm.MINIOR_KERNEL_GREEN,
    Pkm.MINIOR_KERNEL_ORANGE,
    Pkm.MINIOR_KERNEL_RED
  ] as const,
  broadcastSkill: Ability.SHIELDS_UP,
  transformedSkill: Ability.SHIELDS_UP,
  cooldownResetMs: 0
} as const

export const SHIELDS_UP_ABILITY_PARAMS = {
  broadcastSkill: Ability.SHIELDS_UP,
  meteorForm: Pkm.MINIOR,
  transformedSkill: Ability.SHIELDS_DOWN,
  cooldownResetMs: 0
} as const

export const SHOCKWAVE_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  baseRange: 2,
  electricFieldBonusRange: 1,
  damageDecayPerTile: 0.2
} as const

export const SHORE_UP_ABILITY_PARAMS = {
  healRatioByStar: [0.2, 0.25] as const,
  sandstormBonusHealRatio: 0.1
} as const

export const SILVER_WIND_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  attackBuff: 1,
  defenseBuff: 1,
  specialDefenseBuff: 1,
  speedBuff: 10,
  abilityPowerBuff: 10
} as const

export const SING_ABILITY_PARAMS = {
  targetCountByStar: [1, 2, 3] as const,
  baseSleepDurationMs: 2000
} as const

export const SKETCH_ABILITY_PARAMS = {
  copyable: false
} as const

export const SKILL_SWAP_ABILITY_PARAMS = {
  copyable: false
} as const

export const SKY_ATTACK_ABILITY_PARAMS = {
  damage: 120,
  castDelayMs: 1000
} as const

export const SKY_ATTACK_SHADOW_ABILITY_PARAMS = {
  damage: 120,
  castDelayMs: 1000
} as const

export const SLACK_OFF_ABILITY_PARAMS = {
  healRatio: 0.3,
  sleepDurationMs: 3000
} as const

export const SLASH_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  critChanceBonusByStar: [30, 60, 90] as const
} as const

export const SLASHING_CLAW_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  woundDamageMultiplier: 1.3,
  woundDurationMs: 5000
} as const

export const SMOKE_SCREEN_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const
} as const

export const SNIPE_SHOT_ABILITY_PARAMS = {
  damageByStar: [40, 80, 160] as const
} as const

export const SOAK_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  allyPpGain: 10
} as const

export const SOLAR_BEAM_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  burnDurationMs: 3000,
  zenithOrLightDamageMultiplier: 1.3,
  ppRestoreOnBoost: 20
} as const

export const SOLAR_BLADE_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  chargeDelayMs: 2000,
  coneDepth: 1
} as const

export const SOUL_TRAP_ABILITY_PARAMS = {
  shieldAmountByStar: [25, 50, 108] as const,
  ppLoss: 10,
  radius: 2,
  baseFatigueDurationMs: 2000
} as const

export const SPACIAL_REND_ABILITY_PARAMS = {
  damage: 100
} as const

export const SPARK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 90] as const,
  bounceDelayMs: 250,
  maxBounces: 10
} as const

export const SPARKLING_ARIA_ABILITY_PARAMS = {
  damageByStar: [15, 25, 50] as const,
  burnImmunityDurationMs: 3000
} as const

export const SPECTRAL_THIEF_ABILITY_PARAMS = {
  damage: 50
} as const

export const SPICY_EXTRACT_ABILITY_PARAMS = {
  targetCountByStar: [1, 2, 3] as const,
  baseRageDurationMs: 2000
} as const

export const SPIKES_ABILITY_PARAMS = {
  baseSpikeCount: 6,
  apScalingDivisor: 100,
  coneDepth: 3,
  damageByStar: [25, 50, 100] as const,
  spikeTrueDamagePerSecond: 10
} as const

export const SPIKY_SHIELD_ABILITY_PARAMS = {
  durationByStarMs: [3000, 5000, 10000] as const,
  thornDamagePercentDefByStar: [60, 80, 100] as const,
  meleeWoundDurationMs: 2000,
  spikeDamage: 30
} as const

export const SPIN_OUT_ABILITY_PARAMS = {
  speedMultiplierByStar: [0.25, 0.5, 1] as const,
  blindDurationMs: 1000,
  teleportDelayMs: 100,
  speedLossPerAccelerationStack: 15
} as const

export const SPIRIT_BREAK_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  abilityPowerReduction: 20
} as const

export const SPIRIT_SHACKLE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 75] as const,
  woundDurationMs: 4000
} as const

export const SPITE_ABILITY_PARAMS = {
  ppDrainByStar: [20, 40, 60] as const
} as const

export const SPRINGTIDE_STORM_ABILITY_PARAMS = {
  damage: 75,
  charmDurationMs: 2000
} as const

export const STATIC_SHOCK_ABILITY_PARAMS = {
  damage: 70,
  healPerAdjacentFairy: 30,
  shieldPerAdjacentElectric: 30
} as const

export const STEALTH_ROCKS_ABILITY_PARAMS = {
  coneTilesByStar: [1, 2, 3] as const,
  damage: 50,
  boardEffectPhysicalDamagePerSecond: 10,
  boardEffectWoundDurationMs: 1000
} as const

export const STEAMROLLER_ABILITY_PARAMS = {
  speedDamageMultiplierByStar: [0.4, 0.8, 1.5] as const,
  flinchChance: 0.5,
  flinchDurationMs: 3000
} as const

export const STEEL_WING_ABILITY_PARAMS = {
  baseDamageByStar: [10, 20, 40] as const,
  defenseDamageMultiplier: 2,
  defenseSteal: 1
} as const

export const STICKY_WEB_ABILITY_PARAMS = {
  coneDepth: 2,
  damageByStar: [20, 35, 70] as const,
  boardEffectParalysisDurationMs: 2000
} as const

export const STOCKPILE_ABILITY_PARAMS = {
  maxStacksBeforeSpitUp: 3,
  maxHpGainPerCast: 50,
  speedLossPerCast: 10,
  speedRestoreAfterSpitUp: 30,
  spitUpDamageRatio: 0.5,
  swallowHealPercentPerStack: [0, 20, 40, 60] as const,
  swallowHpThresholdRatio: 0.25,
  defenseGainPerCast: 3,
  specialDefenseGainPerCast: 3
} as const

export const STORED_POWER_ABILITY_PARAMS = {
  baseDamage: 20,
  baseMultiplier: 1
} as const

export const STRANGE_STEAM_ABILITY_PARAMS = {
  rangeGainPerCast: 1,
  confusionChance: 0.3,
  confusionDurationMs: 3000,
  boardEffectSpecialDamageMultiplier: 1.2
} as const

export const STRENGTH_ABILITY_PARAMS = {
  statsSumMultiplier: 2,
  abilityPowerMultiplier: 1
} as const

export const STRING_SHOT_ABILITY_PARAMS = {
  damageByStar: [10, 20, 50] as const,
  paralysisDurationMs: 5000
} as const

export const STRUGGLE_BUG_ABILITY_PARAMS = {
  damage: 30,
  abilityPowerReduction: 50
} as const

export const SUCTION_HEAL_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  coneDepth: 2,
  healTakenDamageRatio: 0.5
} as const

export const SUNSTEEL_STRIKE_ABILITY_PARAMS = {
  damage: 80,
  animationDelayMs: 500,
  impactDelayMs: 1000
} as const

export const SUPER_HEAT_ABILITY_PARAMS = {
  damagePerTick: 10,
  armorBreakDurationMs: 1000,
  tickCount: 9,
  tickIntervalMs: 333,
  coneDepth: 2
} as const

export const STUN_SPORE_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  paralysisDurationMs: 5000
} as const

export const TAIL_GLOW_ABILITY_PARAMS = {
  abilityPowerBuff: 50,
  adjacentDamage: 30
} as const

export const SUPER_FANG_ABILITY_PARAMS = {
  maxHpDamagePercent: 0.25,
  apMultiplier: 0.5
} as const

export const SURF_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const SWEET_SCENT_ABILITY_PARAMS = {
  radius: 3,
  charmChance: 0.3,
  charmDurationMs: 1000,
  specialDefenseReduction: 6,
  speedReduction: 12
} as const

export const SWALLOW_ABILITY_PARAMS = {
  maxStacksBeforeSpiUp: 3,
  hpThresholdForSwallow: 0.25,
  healPercentPerStack: [0, 20, 40, 60] as const,
  spitUpDamageByStar: [40, 80, 150] as const,
  defenseBuffPerStack: 3,
  specialDefenseBuffPerStack: 3
} as const

export const SURGING_STRIKES_ABILITY_PARAMS = {
  damagePercentOfAtk: 1,
  hitCount: 3,
  delayBetweenHitsMs: 200,
  alwaysCritical: true
} as const

export const SWAGGER_ABILITY_PARAMS = {
  baseDurationMs: 2000
} as const

export const TACKLE_ABILITY_PARAMS = {
  damageByStar: [20, 40, 60] as const
} as const

export const SUPERCELL_SLAM_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40] as const,
  shieldByStar: [10, 20, 40] as const
} as const

export const TAIL_WHIP_ABILITY_PARAMS = {
  defenseReductionPercent: 0.3
} as const

export const TAILWIND_ABILITY_PARAMS = {
  speedBuffByStar: [5, 10, 15] as const
} as const

export const TAKE_HEART_ABILITY_PARAMS = {
  attackBuff: 8,
  specialDefenseBuff: 8,
  cooldownReductionPercent: 100
} as const

export const TAUNT_ABILITY_PARAMS = {
  shieldMaxHpPercent: 0.25,
  shieldApScaling: 0.5
} as const

export const TEETER_DANCE_ABILITY_PARAMS = {
  speedBuff: 20,
  confusionDurationMs: 3000
} as const

export const TELEPORT_ABILITY_PARAMS = {
  bonusDamageByStar: [15, 30, 60, 120] as const
} as const

export const TERRAIN_PULSE_ABILITY_PARAMS = {
  grassFieldHealPercentByStar: [0.05, 0.07, 0.1] as const,
  electricFieldSpeedBuffByStar: [10, 12, 15] as const,
  psychicFieldPpGainByStar: [10, 12, 15] as const,
  fairyFieldShieldPercentByStar: [0.05, 0.07, 0.1] as const
} as const

export const THIEF_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const
} as const

export const THOUSAND_ARROWS_ABILITY_PARAMS = {
  damage: 60,
  projectileCount: 33,
  delayBetweenProjectilesMs: 100,
  lockDurationMs: 1000
} as const

export const THRASH_ABILITY_PARAMS = {
  attackBuffPercent: 100,
  confusionDurationMs: 3000
} as const

export const THUNDER_SHOCK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const
} as const

export const THUNDER_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  targetCount: 3,
  paralysisChance: 0.3,
  paralysisDurationMs: 3000,
  delayBetweenTargetsMs: 500
} as const

export const THUNDER_CAGE_ABILITY_PARAMS = {
  damage: 60,
  lockDurationMs: 3000,
  paralysisDurationMs: 3000
} as const

export const THUNDER_FANG_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  paralysisDurationMs: 3000
} as const

export const THUNDEROUS_KICK_ABILITY_PARAMS = {
  damageByStar: [20, 40, 60] as const,
  defenseDebuff: 10,
  flinchDurationMs: 4000,
  knockbackCooldownMs: 500
} as const

export const TICKLE_ABILITY_PARAMS = {
  attackReduction: 3,
  defenseReduction: 3,
  maxTargetsByStar: [1, 2] as const
} as const

export const TOPSY_TURVY_ABILITY_PARAMS = {
  damageByStar: [40, 80, 100] as const,
  delayMs: 500
} as const

export const TORCH_SONG_ABILITY_PARAMS = {
  damagePercentOfAtk: 0.5,
  apGainPerFlameByStar: [1, 2, 3] as const,
  baseFlameCount: 4,
  burnChance: 0.3,
  burnDurationMs: 2000,
  flameDelayMs: 100
} as const

export const TRANSE_ABILITY_PARAMS = {
  healPercent: 0.3
} as const

export const TRI_ATTACK_ABILITY_PARAMS = {
  damageByStar: [60, 120, 250] as const,
  freezeDurationMs: 3000,
  burnDurationMs: 5000,
  paralysisDurationMs: 7000
} as const

export const TRICK_OR_TREAT_ABILITY_PARAMS = {
  magikarpDurationMs: 3000
} as const

export const TRIMMING_MOWER_ABILITY_PARAMS = {
  damage: 40,
  healAmount: 60,
  dashRange: 2,
  damageDelayMs: 300
} as const

export const TRIPLE_DIVE_ABILITY_PARAMS = {
  damageByStar: [15, 30, 45] as const,
  maxTargets: 3,
  delayBetweenDivesMs: 400
} as const

export const TRIPLE_KICK_ABILITY_PARAMS = {
  damage: 60,
  maxTargets: 3
} as const

export const TROP_KICK_ABILITY_PARAMS = {
  damageByStar: [50, 100, 200] as const,
  atkDebuffByStar: [3, 5, 7] as const
} as const

export const TWIN_BEAM_ABILITY_PARAMS = {
  damageByStar: [30, 60, 100] as const
} as const

export const TWINEEDLE_ABILITY_PARAMS = {
  damageByStar: [25, 50, 80] as const,
  poisonChance: 0.5,
  poisonDurationMs: 4000,
  secondHitDelayMs: 500
} as const

export const TWISTER_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  flyRangeByStar: [1, 2, 3] as const
} as const

export const U_TURN_ABILITY_PARAMS = {
  shieldByStar: [15, 30, 50] as const,
  charmDurationMs: 1000
} as const

export const ULTRA_THRUSTERS_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  burnDurationMs: 2000,
  cooldownMs: 600
} as const

export const UNBOUND_ABILITY_PARAMS = {
  atkBuff: 10,
  hpBuff: 100
} as const

export const UPROAR_ABILITY_PARAMS = {
  damageByStar: [5, 10, 20] as const,
  immuneDurationMs: 3000,
  tickIntervalMs: 1000,
  tickCount: 3
} as const

export const VENOSHOCK_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  poisonDamageMultiplier: 2
} as const

export const VICTORY_DANCE_ABILITY_PARAMS = {
  atkBuff: 3,
  defBuff: 3,
  speedBuff: 10
} as const

export const VINE_WHIP_ABILITY_PARAMS = {
  damageByStar: [30, 60, 100] as const,
  paralysisDurationMs: 3000
} as const

export const VISE_GRIP_ABILITY_PARAMS = {
  damageByStar: [30, 60, 100] as const,
  lockDurationMs: 4000,
  defAbsorptionRatio: 1
} as const

export const VOLT_SURGE_ABILITY_PARAMS = {
  hpBuff: 30,
  speedBuff: 20,
  chainDamage: 30,
  chainTargetCount: 4,
  triggerEveryAttacks: 3
} as const

export const VOLT_SWITCH_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const
} as const

export const WATER_PULSE_ABILITY_PARAMS = {
  damageByStar: [75, 150] as const,
  confusionDurationMs: 2000
} as const

export const WATER_SHURIKEN_ABILITY_PARAMS = {
  damageByStar: [20, 40, 60] as const,
  shurikenCount: 3,
  directionCount: 3
} as const

export const WATERFALL_ABILITY_PARAMS = {
  shieldByStar: [50, 100, 150] as const
} as const

export const WAVE_SPLASH_ABILITY_PARAMS = {
  shieldRatio: 0.2,
  damageRatio: 0.2
} as const

export const WHEEL_OF_FIRE_ABILITY_PARAMS = {
  damageByStar: [10, 20, 30] as const,
  secondHitDelayMs: 500
} as const

export const WHIRLPOOL_ABILITY_PARAMS = {
  attackMultiplierPerHit: 1,
  hitCount: 4
} as const

export const WHIRLWIND_ABILITY_PARAMS = {
  damageByStar: [40, 80, 120] as const
} as const

export const WICKED_BLOW_ABILITY_PARAMS = {
  damage: 60
} as const

export const WILDBOLT_STORM_ABILITY_PARAMS = {
  damage: 75,
  paralysisDurationMs: 4000
} as const

export const WISE_YAWN_ABILITY_PARAMS = {
  shieldByStar: [15, 30, 60] as const,
  fatigueDurationMs: 3000,
  abilityPowerReduction: 20
} as const

export const WISH_ABILITY_PARAMS = {
  shieldByStar: [30, 60, 120] as const,
  protectDurationMs: 1500
} as const

export const WONDER_ROOM_ABILITY_PARAMS = {
  durationMs: 5000
} as const

export const WOOD_HAMMER_ABILITY_PARAMS = {
  damageMultiplier: 4,
  recoilMultiplier: 1,
  delayMs: 500
} as const

export const X_SCISSOR_ABILITY_PARAMS = {
  damageByStar: [10, 20, 40, 60] as const,
  hitCount: 2
} as const

export const YAWN_ABILITY_PARAMS = {
  shieldByStar: [15, 30, 60] as const,
  fatigueDurationMs: 3000,
  abilityPowerReduction: 20,
  cooldownResetMs: 1000
} as const

export const ZAP_CANNON_ABILITY_PARAMS = {
  damageByStar: [25, 50, 100] as const,
  statusDurationByStarMs: [1000, 2000, 4000] as const
} as const

export const ZING_ZAP_ABILITY_PARAMS = {
  damage: 90,
  flinchDurationMs: 3000,
  shieldIfParalyzed: 40
} as const

export const PLASMA_FLASH_ABILITY_PARAMS = {
  damage: 20,
  baseFlashCount: 4,
  flashGainPerCast: 1,
  flashDelayMs: 100
} as const

export const PLASMA_TEMPEST_ABILITY_PARAMS = {
  baseDamage: 40,
  targetCount: 3,
  castDelayMs: 500,
  damageDecayRatio: 0.9,
  minDamage: 1
} as const

export const PLAY_ROUGH_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  charmDurationMs: 2500
} as const

export const POISON_GAS_ABILITY_PARAMS = {
  damageByStar: [15, 30, 60] as const,
  poisonDurationMs: 3000
} as const

export const POISON_JAB_ABILITY_PARAMS = {
  damageByStar: [30, 60, 90] as const,
  poisonDurationMs: 3000
} as const

export const POISON_POWDER_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  poisonDurationMs: 3000
} as const

export const POISON_STING_ABILITY_PARAMS = {
  baseMaxPoisonStacks: 3,
  venomousMaxPoisonStacks: 4,
  toxicMaxPoisonStacks: 5,
  stacksToApplyByStar: [2, 3, 4] as const,
  excessDamageByStar: [25, 50, 100] as const,
  poisonDurationMs: 4000
} as const

export const POLLEN_PUFF_ABILITY_PARAMS = {
  healByStar: [30, 60, 120] as const
} as const

export const POLTERGEIST_ABILITY_PARAMS = {
  baseDamageByStar: [30, 60, 120] as const,
  toolDamageBonus: 40,
  itemDamageBonus: 20
} as const

export const POPULATION_BOMB_ABILITY_PARAMS = {
  damagePerHit: 10,
  hitsByStar: [4, 8, 12, 16] as const,
  apScalingDivisor: 100
} as const

export const HIDDEN_POWER_A_ABILITY_PARAMS = {
  summonedCount: 4
} as const

export const HIDDEN_POWER_B_ABILITY_PARAMS = {
  burnDurationMs: 30000
} as const

export const HIDDEN_POWER_C_ABILITY_PARAMS = {} as const

export const HIDDEN_POWER_D_ABILITY_PARAMS = {} as const

export const HIDDEN_POWER_E_ABILITY_PARAMS = {} as const

export const HIDDEN_POWER_F_ABILITY_PARAMS = {
  fishCount: 2
} as const

export const HIDDEN_POWER_G_ABILITY_PARAMS = {
  goldAmount: 5
} as const

export const HIDDEN_POWER_J_ABILITY_PARAMS = {
  sharpedoCount: 2
} as const

export const HIDDEN_POWER_L_ABILITY_PARAMS = {
  lockDurationMs: 5000
} as const

export const HIDDEN_POWER_P_ABILITY_PARAMS = {
  bugCount: 5
} as const

export const HIDDEN_POWER_QM_ABILITY_PARAMS = {
  unownCount: 4
} as const

export const HIDDEN_POWER_Z_ABILITY_PARAMS = {
  freezeDurationMs: 2000
} as const

export const HIDDEN_POWER_R_ABILITY_PARAMS = {
  freeRerolls: 6
} as const

export const HIDDEN_POWER_S_ABILITY_PARAMS = {
  tidalWaveStrength: 2,
  healPercent: 20,
  maxHpTrueDamagePercent: 10
} as const

export const HIDDEN_POWER_T_ABILITY_PARAMS = {
  berryCount: 3
} as const

export const HIDDEN_POWER_W_ABILITY_PARAMS = {
  topSynergyCount: 2
} as const

export const HIDDEN_POWER_EM_ABILITY_PARAMS = {
  summonedCount: 4
} as const

export const HIDDEN_POWER_N_ABILITY_PARAMS = {
  shield: 50
} as const

export const HIDDEN_POWER_Y_ABILITY_PARAMS = {
  attackBoostPercent: 100
} as const

export const APPLE_ACID_ABILITY_PARAMS = {
  baseDamage: 50,
  speDefZeroMultiplier: 2
} as const

export const GRAV_APPLE_ABILITY_PARAMS = {
  baseDamage: 80,
  defZeroMultiplier: 2
} as const

export const NUTRIENTS_ABILITY_PARAMS = {
  heal: 40,
  defenseBuff: 2,
  specialDefenseBuff: 2
} as const

export const SYRUP_BOMB_ABILITY_PARAMS = {
  damage: 50,
  speedDebuff: 30
} as const

export const FICKLE_BEAM_ABILITY_PARAMS = {
  beamCount: 5,
  beamChance: 0.5,
  damage: 50,
  paralysisDurationMs: 2000
} as const

export const PSYBEAM_ABILITY_PARAMS = {
  baseDamageByStar: [25, 50, 100] as const,
  confusionChance: 0.5,
  confusionDurationMs: 4000
} as const

export const HYDRO_STEAM_ABILITY_PARAMS = {
  baseDamageByStar: [30, 60, 100] as const,
  burnDurationMs: 4000
} as const

export const BLUE_FLARE_ABILITY_PARAMS = {
  baseDamage: 50,
  synergyMultiplier: 10,
  delayMs: 250
} as const

export const FUSION_BOLT_ABILITY_PARAMS = {
  baseDamage: 50,
  synergyMultiplier: 10,
  delayMs: 250
} as const

export const GLACIATE_ABILITY_PARAMS = {
  baseDamage: 50,
  synergyMultiplier: 10,
  delayMs: 300
} as const

export const MIND_BLOWN_ABILITY_PARAMS = {
  fireworkDamage: 20,
  statusDurationMs: 5000,
  initialFireworkCount: 5,
  firstDelayMs: 1000,
  delayIncrementMs: 250,
  explosionRadius: 2,
  hpLossRatio: 0.5
} as const

export const SOFT_BOILED_ABILITY_PARAMS = {
  shieldByStar: [20, 40, 80] as const
} as const

export const TEA_TIME_ABILITY_PARAMS = {
  healByStar: [15, 30, 60] as const
} as const

export const SONG_OF_DESIRE_ABILITY_PARAMS = {
  durationMs: 3000,
  targetCount: 2,
  attackDebuff: -3
} as const

export const CONFUSING_MIND_ABILITY_PARAMS = {
  durationMs: 3000,
  targetCount: 2
} as const

export const WONDER_GUARD_ABILITY_PARAMS = {
  damageByStar: [30, 60, 120] as const,
  paralysisDurationMs: 3000
} as const

export const ELECTRIC_SURGE_ABILITY_PARAMS = {
  speedBuff: 10
} as const

export const PSYCHIC_SURGE_ABILITY_PARAMS = {
  shieldBuff: 40
} as const

export const MISTY_SURGE_ABILITY_PARAMS = {
  ppGain: 25,
  hpGain: 25
} as const

export const GRASSY_SURGE_ABILITY_PARAMS = {
  attackBuff: 5
} as const

export const PSYCHIC_ABILITY_PARAMS = {
  damageByStar: [40, 80, 160] as const,
  ppBurn: -15
} as const

export const CHATTER_ABILITY_PARAMS = {
  damage: 30,
  confusionChance: 0.5,
  confusionDurationMs: 1000,
  radiusTiles: 3
} as const

export const CRAB_HAMMER_ABILITY_PARAMS = {
  damageByStar: [40, 80, 120] as const,
  critBonus: 30,
  hpThreshold: 0.3,
  executeDamage: 9999
} as const

export const DYNAMAX_CANNON_ABILITY_PARAMS = {
  hpDamageRatio: 0.5
} as const

export const DYNAMIC_PUNCH_ABILITY_PARAMS = {
  durationByStar: [2000, 4000, 6000] as const,
  damageByStar: [40, 80, 160] as const
} as const

export const AURORA_VEIL_ABILITY_PARAMS = {
  runeProtectDurationMs: 1000,
  shieldByStar: [5, 10, 15] as const
} as const

export const TIME_TRAVEL_ABILITY_PARAMS = {
  allyHeal: 25,
  playerLifeGain: 1
} as const

export const AQUA_JET_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const
} as const

export const ELECTRO_WEB_ABILITY_PARAMS = {
  stealByStar: [15, 30, 60] as const,
  damageByStar: [15, 30, 60] as const
} as const

export const MYSTICAL_FIRE_ABILITY_PARAMS = {
  damageByStar: [20, 40, 80] as const,
  abilityPowerDebuff: -10
} as const

export function getAbilityDescriptionParams(
  ability: Ability
): Record<string, string | number> {
  switch (ability) {
    case Ability.ACID_ARMOR:
      return {
        defense: `${ACID_ARMOR_ABILITY_PARAMS.defenseByStar.join(",")},SP`,
        meleeHitCount: ACID_ARMOR_ABILITY_PARAMS.meleeHitCount,
        attackerDefenseReduction:
          ACID_ARMOR_ABILITY_PARAMS.attackerDefenseReduction
      }
    case Ability.AURORA_BEAM:
      return {
        damage: `${AURORA_BEAM_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeChance: `${AURORA_BEAM_ABILITY_PARAMS.freezeChance * 100},LK`,
        freezeSeconds: AURORA_BEAM_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.AURORA_VEIL:
      return {
        shield: `${AURORA_VEIL_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        runeProtectSeconds:
          AURORA_VEIL_ABILITY_PARAMS.runeProtectDurationMs / 1000
      }
    case Ability.BITE:
      return {
        healPercent: BITE_ABILITY_PARAMS.healTakenDamageRatio * 100,
        flinchSeconds: BITE_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.BONEMERANG:
      return {
        damage: `${BONEMERANG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        hitCount: BONEMERANG_ABILITY_PARAMS.hitCount
      }
    case Ability.FLAME_CHARGE:
      return {
        damage: `${FLAME_CHARGE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.JUDGEMENT:
      return {
        damage: `${JUDGEMENT_ABILITY_PARAMS.damagePerSynergyLevel},SP`
      }
    case Ability.LIQUIDATION:
      return {
        damage: `${LIQUIDATION_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        defenseReduction: `${LIQUIDATION_ABILITY_PARAMS.defenseReductionByStar.join(",")},SP`
      }
    case Ability.PICKUP:
      return {
        damage: `${PICKUP_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        gold: PICKUP_ABILITY_PARAMS.goldByStar.join(",")
      }
    case Ability.RAZOR_WIND:
      return {
        damage: `${RAZOR_WIND_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.SCHOOLING:
      return {
        hpPercentDamage: `${SCHOOLING_ABILITY_PARAMS.hpDamageRatio * 100},SP`,
        wishiwashiHpBonus: SCHOOLING_ABILITY_PARAMS.wishiwashiHpBonus
      }
    case Ability.SHADOW_BALL:
      return {
        damage: `${SHADOW_BALL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        specialDefenseReduction:
          SHADOW_BALL_ABILITY_PARAMS.specialDefenseReduction
      }
    case Ability.STEAM_ERUPTION:
      return {
        damage: `${STEAM_ERUPTION_ABILITY_PARAMS.damage},SP`,
        burnSeconds: STEAM_ERUPTION_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.SHADOW_BONE:
      return {
        damage: `${SHADOW_BONE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        defenseReductionChance: `${SHADOW_BONE_ABILITY_PARAMS.defenseBreakChance * 100},LK`,
        defenseReduction: `${SHADOW_BONE_ABILITY_PARAMS.defenseReduction},SP`
      }
    case Ability.GROWL:
      return {
        attackDebuff: `${GROWL_ABILITY_PARAMS.attackDebuffByStar.join(",")},SP`,
        flinchSeconds: GROWL_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.INGRAIN:
      return {
        damage: `${INGRAIN_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        heal: `${INGRAIN_ABILITY_PARAMS.healByStar.join(",")},SP`,
        lockedSeconds: INGRAIN_ABILITY_PARAMS.lockedDurationMs / 1000
      }
    case Ability.TORMENT:
      return {
        speedBoost: `${TORMENT_ABILITY_PARAMS.speedBoostByStar.join(",")},SP`
      }
    case Ability.STOMP:
      return {
        damagePercentOfAtk: `${STOMP_ABILITY_PARAMS.damageFactorByStar
          .map((factor) => factor * 100)
          .join(",")},SP`
      }
    case Ability.DARK_VOID:
      return {
        damage: `${DARK_VOID_ABILITY_PARAMS.damage},SP`,
        sleepChance: `${DARK_VOID_ABILITY_PARAMS.sleepChance * 100},LK`,
        sleepSeconds: DARK_VOID_ABILITY_PARAMS.sleepDurationMs / 1000
      }
    case Ability.DEATH_WING:
      return {
        damage: `${DEATH_WING_ABILITY_PARAMS.damage},SP`,
        healPercent: DEATH_WING_ABILITY_PARAMS.healRatio * 100
      }
    case Ability.GROWTH:
      return {
        hpBuff: `${GROWTH_ABILITY_PARAMS.hpBuffByStar.join(",")},SP`,
        attackBuff: `${GROWTH_ABILITY_PARAMS.attackBuffByStar.join(",")},SP`,
        zenithMultiplierPercent:
          (GROWTH_ABILITY_PARAMS.zenithMultiplier - 1) * 100
      }
    case Ability.GRUDGE:
      return {
        damage: `${GRUDGE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        silenceSeconds: GRUDGE_ABILITY_PARAMS.silenceDurationMs / 1000
      }
    case Ability.SHADOW_CLAW:
      return {
        baseDamage: `${SHADOW_CLAW_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        singleTargetDamage: `${SHADOW_CLAW_ABILITY_PARAMS.baseDamageByStar
          .map(
            (damage) =>
              damage * SHADOW_CLAW_ABILITY_PARAMS.singleTargetMultiplier
          )
          .join(",")},SP`,
        healPercent: SHADOW_CLAW_ABILITY_PARAMS.healRatio * 100
      }
    case Ability.SHADOW_CLONE:
      return {
        cloneHpPercent: `${SHADOW_CLONE_ABILITY_PARAMS.hpRatio * 100},SP`
      }
    case Ability.SHADOW_FORCE:
      return {
        damage: `${SHADOW_FORCE_ABILITY_PARAMS.damage},SP`
      }
    case Ability.SHADOW_PUNCH:
      return {
        bonusDamage: `${SHADOW_PUNCH_ABILITY_PARAMS.nextAttackDamageByStar.join(",")},SP`
      }
    case Ability.SLUDGE:
      return {
        poisonStacks: SLUDGE_ABILITY_PARAMS.stackCountByStar.join(","),
        poisonSeconds: `${SLUDGE_ABILITY_PARAMS.poisonDurationBaseMs / 1000},SP`,
        affectedTileCount: SLUDGE_ABILITY_PARAMS.affectedTileCount
      }
    case Ability.SLUDGE_WAVE:
      return {
        damage: `${SLUDGE_WAVE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: SLUDGE_WAVE_ABILITY_PARAMS.poisonDurationByStarMs
          .map((duration) => duration / 1000)
          .join(",")
      }
    case Ability.SMOG:
      return {
        damage: `${SMOG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        affectedTileCount: SMOG_ABILITY_PARAMS.affectedTileCount
      }
    case Ability.STONE_EDGE:
      return {
        silenceSeconds: STONE_EDGE_ABILITY_PARAMS.silenceDurationByStarMs
          .map((duration) => duration / 1000)
          .join(","),
        critChanceBonus: `${STONE_EDGE_ABILITY_PARAMS.critChanceBonus},SP`,
        rangeBonus: STONE_EDGE_ABILITY_PARAMS.rangeBonus,
        defenseScalingPercent: `${Math.round(STONE_EDGE_ABILITY_PARAMS.defenseScalingMultiplier * 100)},SP`
      }
    case Ability.STONE_AXE:
      return {
        damage: `${STONE_AXE_ABILITY_PARAMS.damage},SP`,
        boardEffectPhysicalDamagePerSecond:
          STEALTH_ROCKS_ABILITY_PARAMS.boardEffectPhysicalDamagePerSecond
      }
    case Ability.TOXIC:
      return {
        targetCount: TOXIC_ABILITY_PARAMS.durationByIndexMs
          .map((_, index) => index + 1)
          .join(","),
        poisonSeconds: TOXIC_ABILITY_PARAMS.durationByIndexMs
          .map((duration) => duration / 1000)
          .join(",")
      }
    case Ability.ILLUSION:
      return {
        heal: `${ILLUSION_ABILITY_PARAMS.healByStar.join(",")},SP=${ILLUSION_ABILITY_PARAMS.healScale}`
      }
    case Ability.LEECH_SEED:
      return {
        poisonSeconds: LEECH_SEED_ABILITY_PARAMS.durationByStarMs
          .map((duration) => duration / 1000)
          .join(","),
        heal: `${LEECH_SEED_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.DISABLE:
      return {
        damage: `${DISABLE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        silenceSeconds: DISABLE_ABILITY_PARAMS.silenceDurationByStarMs
          .map((duration) => duration / 1000)
          .join(",")
      }
    case Ability.ABSORB:
      return {
        damage: `${ABSORB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        allyHeal: `${ABSORB_ABILITY_PARAMS.damageByStar.map((d) => Math.round(d * ABSORB_ABILITY_PARAMS.allyHealRatio)).join(",")},SP`
      }
    case Ability.ACCELEROCK:
      return {
        attackDamagePercent: "100,SP",
        maxStacks: `${ACCELEROCK_ABILITY_PARAMS.nbEffectsBaseline},SP`
      }
    case Ability.ACID_SPRAY:
      return {
        damage: `${ACID_SPRAY_ABILITY_PARAMS.damage},SP`,
        specialDefenseReduction: ACID_SPRAY_ABILITY_PARAMS.speDefReduction,
        maxBounces: ACID_SPRAY_ABILITY_PARAMS.maxBounces
      }
    case Ability.ACROBATICS:
      return {
        damage: `${ACROBATICS_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.AERIAL_ACE:
      return {
        damage: `${AERIAL_ACE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.AFTER_YOU:
      return {
        ppGain: `${AFTER_YOU_ABILITY_PARAMS.ppGain},SP`,
        speedBuff: `${AFTER_YOU_ABILITY_PARAMS.speedBuff},SP`
      }
    case Ability.AGILITY:
      return {
        speedBuff: `${AGILITY_ABILITY_PARAMS.speedBoostByStar.join(",")},SP`
      }
    case Ability.AIR_SLASH:
      return {
        damage: `${AIR_SLASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        flinchSeconds: AIR_SLASH_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.ANCHOR_SHOT:
      return {
        damage: `${ANCHOR_SHOT_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ANCIENT_POWER:
      return {
        damage: `${ANCIENT_POWER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        abilityPowerGain: `${ANCIENT_POWER_ABILITY_PARAMS.apBoost},SP`
      }
    case Ability.APPLE_ACID:
      return {
        damage: `${APPLE_ACID_ABILITY_PARAMS.baseDamage},SP`,
        zeroSpecialDefenseDamage: `${APPLE_ACID_ABILITY_PARAMS.baseDamage * APPLE_ACID_ABILITY_PARAMS.speDefZeroMultiplier},SP`
      }
    case Ability.AQUA_JET:
      return {
        damage: `${AQUA_JET_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.AQUA_RING:
      return {
        healAmount: `${AQUA_RING_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.AQUA_TAIL:
      return {
        damage: `${AQUA_TAIL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        shield: `${AQUA_TAIL_ABILITY_PARAMS.shieldByStar.join(",")},SP`
      }
    case Ability.ARM_THRUST:
      return {
        minHits: ARM_THRUST_ABILITY_PARAMS.minHits,
        maxHits: ARM_THRUST_ABILITY_PARAMS.maxHits,
        damagePercentOfAtk: "100,SP"
      }
    case Ability.ARMOR_CANNON:
      return {
        mainDamage: `${ARMOR_CANNON_ABILITY_PARAMS.mainDamage},SP`,
        secondaryDamage: `${ARMOR_CANNON_ABILITY_PARAMS.secondaryDamage},SP`,
        finalDamage: `${ARMOR_CANNON_ABILITY_PARAMS.finalDamage},SP`
      }
    case Ability.AROMATHERAPY:
      return {
        healAmount: `${AROMATHERAPY_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.ASSURANCE:
      return {
        damage: `${ASSURANCE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        hpThresholdPercent: ASSURANCE_ABILITY_PARAMS.hpThreshold * 100
      }
    case Ability.ASTRAL_BARRAGE:
      return {
        ghostCount: `${ASTRAL_BARRAGE_ABILITY_PARAMS.nbGhosts},SP`,
        damagePerGhost: `${ASTRAL_BARRAGE_ABILITY_PARAMS.damagePerGhost},SP`
      }
    case Ability.ATTRACT:
      return {
        targetCount: ATTRACT_ABILITY_PARAMS.targetCountByStar.join(","),
        charmSeconds: ATTRACT_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.AURA_WHEEL:
      return {
        damage: `${AURA_WHEEL_ABILITY_PARAMS.damage},SP`,
        speedBuff: `${AURA_WHEEL_ABILITY_PARAMS.speedBuff},SP`
      }
    case Ability.AURASPHERE:
      return {
        damage: `${AURASPHERE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        silenceSeconds: AURASPHERE_ABILITY_PARAMS.silenceDurationMs / 1000
      }
    case Ability.AXE_KICK:
      return {
        damage: `${AXE_KICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        ppBurn: `${AXE_KICK_ABILITY_PARAMS.ppBurn},SP`,
        confusionChance: `${AXE_KICK_ABILITY_PARAMS.confusionChance * 100},LK`,
        confusionSeconds: AXE_KICK_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.BANEFUL_BUNKER:
      return {
        retaliationDamage: `${BANEFUL_BUNKER_ABILITY_PARAMS.retaliationDamageByStar.join(",")},SP`,
        protectSeconds: BANEFUL_BUNKER_ABILITY_PARAMS.protectDurationMs / 1000,
        poisonSeconds: BANEFUL_BUNKER_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.BARB_BARRAGE:
      return {
        damage: `${BARB_BARRAGE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: BARB_BARRAGE_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.BARED_FANGS:
      return {
        damagePercentOfAtk: `${Math.round(BARED_FANGS_ABILITY_PARAMS.damageMultiplier * 100)},SP`,
        speedSteal: `${BARED_FANGS_ABILITY_PARAMS.speedSteal},SP`
      }
    case Ability.BEHEMOTH_BLADE:
      return {
        atkBonusDamage: `${BEHEMOTH_BLADE_ABILITY_PARAMS.atkBonus},SP`,
        atkScalingPercent: "100,SP"
      }
    case Ability.BEAT_UP:
      return {
        summonCount: BEAT_UP_ABILITY_PARAMS.summonCountByStar.join(","),
        summonHpPercent: `${BEAT_UP_ABILITY_PARAMS.summonHpPercentBase},SP`
      }
    case Ability.BIDE:
      return {
        durationSeconds: BIDE_ABILITY_PARAMS.durationMs / 1000,
        damageReceivedPercent:
          BIDE_ABILITY_PARAMS.damageReceivedMultiplier * 100
      }
    case Ability.BITTER_BLADE:
      return {
        damage: `${BITTER_BLADE_ABILITY_PARAMS.damage},SP`,
        healPercentPerEnemy: BITTER_BLADE_ABILITY_PARAMS.healRatioPerEnemy * 100
      }
    case Ability.BLAST_BURN:
      return {
        damage: `${BLAST_BURN_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.BLAZE_KICK:
      return {
        damage: `${BLAZE_KICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: BLAZE_KICK_ABILITY_PARAMS.burnDurationMs / 1000,
        bonusDamagePercent: (BLAZE_KICK_ABILITY_PARAMS.burnMultiplier - 1) * 100
      }
    case Ability.BLEAKWIND_STORM:
      return {
        damage: `${BLEAKWIND_STORM_ABILITY_PARAMS.damage},SP`,
        freezeSeconds: BLEAKWIND_STORM_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.BLIZZARD:
      return {
        damage: `${BLIZZARD_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeSeconds: BLIZZARD_ABILITY_PARAMS.freezeDurationMs / 1000,
        radiusTiles: BLIZZARD_ABILITY_PARAMS.radiusTiles
      }
    case Ability.BLOOD_MOON:
      return {
        atkPercentDamage: `${BLOOD_MOON_ABILITY_PARAMS.atkMultiplier * 100},SP`,
        woundSeconds: BLOOD_MOON_ABILITY_PARAMS.woundDurationMs / 1000
      }
    case Ability.BLUE_FLARE:
      return {
        baseDamage: `${BLUE_FLARE_ABILITY_PARAMS.baseDamage},SP`,
        synergyDamagePerLevel: `${BLUE_FLARE_ABILITY_PARAMS.synergyMultiplier},SP`
      }
    case Ability.BODY_SLAM:
      return {
        hpPercentDamage: `${BODY_SLAM_ABILITY_PARAMS.hpRatio * 100},SP`
      }
    case Ability.BOLT_BEAK:
      return {
        lowDamage: `${BOLT_BEAK_ABILITY_PARAMS.lowDamage},SP`,
        highDamage: `${BOLT_BEAK_ABILITY_PARAMS.highDamage},SP`,
        ppThreshold: BOLT_BEAK_ABILITY_PARAMS.ppThreshold
      }
    case Ability.BONE_ARMOR:
      return {
        damage: `${BONE_ARMOR_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        defenseBuff: BONE_ARMOR_ABILITY_PARAMS.defBuffByStar.join(",")
      }
    case Ability.BOOMBURST:
      return {
        damage: `${BOOMBURST_ABILITY_PARAMS.damage},SP`,
        flinchSeconds: BOOMBURST_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.BOUNCE:
      return {
        bounceCount: BOUNCE_ABILITY_PARAMS.nbBouncesByStar.join(","),
        damage: `${BOUNCE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.BRAVE_BIRD:
      return {
        damage: `${BRAVE_BIRD_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.BRICK_BREAK:
      return {
        atkPercentDamage: `${BRICK_BREAK_ABILITY_PARAMS.atkMultiplier * 100},SP`,
        armorBreakSeconds:
          BRICK_BREAK_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.BUG_BUZZ:
      return {
        damage: `${BUG_BUZZ_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.BULK_UP:
      return {
        statPercentBuff: `${BULK_UP_ABILITY_PARAMS.atkRatio * 100},SP`
      }
    case Ability.BULLDOZE:
      return {
        damage: `${BULLDOZE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        speedReduction: BULLDOZE_ABILITY_PARAMS.speedReduction
      }
    case Ability.BULLET_PUNCH:
      return {
        trueDamage: `${BULLET_PUNCH_ABILITY_PARAMS.damage},SP`,
        speedBuff: `${BULLET_PUNCH_ABILITY_PARAMS.speedBuff},SP`,
        buffDurationSec: BULLET_PUNCH_ABILITY_PARAMS.buffDurationMs / 1000
      }
    case Ability.BURN_UP:
      return {
        damage: `${BURN_UP_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnDurationSec: BURN_UP_ABILITY_PARAMS.selfBurnDurationMs / 1000
      }
    case Ability.BURNING_JEALOUSY:
      return {
        damage: `${BURNING_JEALOUSY_ABILITY_PARAMS.damage},SP`,
        burnSeconds: BURNING_JEALOUSY_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.CAVERNOUS_CHOMP:
      return {
        damage: `${CAVERNOUS_CHOMP_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        rageSeconds: CAVERNOUS_CHOMP_ABILITY_PARAMS.enragedDurationByStar
          .map((d) => d / 1000)
          .join(",")
      }
    case Ability.CEASELESS_EDGE:
      return {
        damage: `${CEASELESS_EDGE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        targetCount: CEASELESS_EDGE_ABILITY_PARAMS.targetCount,
        spikeTrueDamagePerSecond: SPIKES_ABILITY_PARAMS.spikeTrueDamagePerSecond
      }
    case Ability.CHAIN_CRAZED:
      return {
        attackBuff: `${CHAIN_CRAZED_ABILITY_PARAMS.atkBoost},SP`,
        defenseBuff: `${CHAIN_CRAZED_ABILITY_PARAMS.defBoost},SP`,
        poisonSeconds: CHAIN_CRAZED_ABILITY_PARAMS.poisonDurationMs / 1000,
        speedBoost: CHAIN_CRAZED_ABILITY_PARAMS.speedBoost
      }
    case Ability.CHARGE:
      return {
        bonusSpecialPercent: `${CHARGE_ABILITY_PARAMS.damageMultiplier * 100},SP`
      }
    case Ability.CHARGE_BEAM:
      return {
        damage: `${CHARGE_BEAM_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.CHARM:
      return {
        attackReduction: `${CHARM_ABILITY_PARAMS.attackReductionByStar.join(",")},SP`,
        charmSeconds: CHARM_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.CHATTER:
      return {
        damage: `${CHATTER_ABILITY_PARAMS.damage},SP`,
        confusionChance: `${CHATTER_ABILITY_PARAMS.confusionChance * 100},LK`,
        confusionSeconds: CHATTER_ABILITY_PARAMS.confusionDurationMs / 1000,
        radiusTiles: CHATTER_ABILITY_PARAMS.radiusTiles
      }
    case Ability.CHLOROBLAST:
      return {
        damage: `${CHLOROBLAST_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        selfDamagePercent: CHLOROBLAST_ABILITY_PARAMS.selfDamageHpRatio * 100
      }
    case Ability.CITY_SHUTTLE:
      return {
        damage: `${CITY_SHUTTLE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        carriedAllyAtkPercent: `${CITY_SHUTTLE_ABILITY_PARAMS.carriedAllyAttackRatio * 100},SP`,
        shield: `${CITY_SHUTTLE_ABILITY_PARAMS.shieldByStar.join(",")},SP`
      }
    case Ability.CLANGOROUS_SOUL:
      return {
        statBuff: `${CLANGOROUS_SOUL_ABILITY_PARAMS.statBuffByStar.join(",")},SP`
      }
    case Ability.CLOSE_COMBAT:
      return {
        damage: `${CLOSE_COMBAT_ABILITY_PARAMS.damage},SP`,
        statReduction: CLOSE_COMBAT_ABILITY_PARAMS.defenseReduction
      }
    case Ability.COLUMN_CRUSH:
      return {
        pillarThrowBaseDamage: `${COLUMN_CRUSH_ABILITY_PARAMS.pillarThrowDamageByStar.join(",")},SP`
      }
    case Ability.CONFUSING_MIND:
      return {
        confusionSeconds: CONFUSING_MIND_ABILITY_PARAMS.durationMs / 1000
      }
    case Ability.CONFUSION:
      return {
        confusionSeconds: CONFUSION_ABILITY_PARAMS.durationByStarMs
          .map((d) => d / 1000)
          .join(","),
        bonusDamage: `${CONFUSION_ABILITY_PARAMS.bonusDamageByStar.join(",")},SP`
      }
    case Ability.CORE_ENFORCER:
      return {
        damage: `${CORE_ENFORCER_ABILITY_PARAMS.damage},SP`,
        silenceSeconds: CORE_ENFORCER_ABILITY_PARAMS.silenceDurationMs / 1000
      }
    case Ability.COSMIC_POWER_MOON:
      return {
        abilityPowerGain: `${COSMIC_POWER_MOON_ABILITY_PARAMS.abilityPowerGain},SP`
      }
    case Ability.COSMIC_POWER_SUN:
      return {
        baseAttackPercentGain: `${COSMIC_POWER_SUN_ABILITY_PARAMS.attackRatio * 100},SP`
      }
    case Ability.COTTON_GUARD:
      return {
        shield: `${COTTON_GUARD_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        defenseBuff: COTTON_GUARD_ABILITY_PARAMS.defenseBuff,
        dropTileCount: 3,
        sleepSeconds: COTTON_BALL_BOARD_EFFECT_SLEEP_DURATION_MS / 1000
      }
    case Ability.COTTON_SPORE:
      return {
        speedReduction: `${COTTON_SPORE_ABILITY_PARAMS.speedDebuffByStar.join(",")},SP`,
        targetCount: COTTON_SPORE_ABILITY_PARAMS.maxTargets,
        sleepSeconds: COTTON_BALL_BOARD_EFFECT_SLEEP_DURATION_MS / 1000
      }
    case Ability.COUNTER:
      return {
        missingHpPercentDamage: `${COUNTER_ABILITY_PARAMS.missingHpRatio * 100},SP`
      }
    case Ability.CRABHAMMER:
      return {
        damage: `${CRAB_HAMMER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        executeThresholdPercent: CRAB_HAMMER_ABILITY_PARAMS.hpThreshold * 100,
        critChanceBonus: CRAB_HAMMER_ABILITY_PARAMS.critBonus
      }
    case Ability.CROSS_POISON:
      return {
        damage: `${CROSS_POISON_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: CROSS_POISON_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.CRUNCH:
      return {
        damage: `${CRUNCH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        healPercent: CRUNCH_ABILITY_PARAMS.healOnKillHpRatio * 100
      }
    case Ability.CRUSH_CLAW:
      return {
        defenseReduction:
          CRUSH_CLAW_ABILITY_PARAMS.defenseReductionByStar.join(","),
        atkPercentPerHit: `${CRUSH_CLAW_ABILITY_PARAMS.attackDamageRatio * 100},SP`
      }
    case Ability.CRUSH_GRIP:
      return {
        minDamage: `${CRUSH_GRIP_ABILITY_PARAMS.baseDamage},SP`,
        maxDamage: `${CRUSH_GRIP_ABILITY_PARAMS.baseDamage + CRUSH_GRIP_ABILITY_PARAMS.hpRatioDamageBonus},SP`
      }
    case Ability.CURSE:
      return {
        curseDelaySeconds: `${CURSE_ABILITY_PARAMS.baseDelayByStarMs
          .map((d) => d / 1000)
          .join(",")},SP=-${CURSE_ABILITY_PARAMS.apCritScalingFactor}`,
        delayReductionPercentPerApStep:
          CURSE_ABILITY_PARAMS.apCritScalingFactor * 5,
        apStep: 1 / CURSE_ABILITY_PARAMS.apCritScalingFactor
      }
    case Ability.CUT:
      return {
        targetMaxHpPercentDamage: `${CUT_ABILITY_PARAMS.targetMaxHpDamageRatio * 100},SP`,
        woundSeconds: CUT_ABILITY_PARAMS.woundDurationMs / 1000
      }
    case Ability.DARK_HARVEST:
      return {
        damage: `${DARK_HARVEST_ABILITY_PARAMS.tickDamageByStar.join(",")},SP`,
        healPercent: DARK_HARVEST_ABILITY_PARAMS.healRatio * 100
      }
    case Ability.DARK_LARIAT:
      return {
        atkPercentPerHit: "100,SP"
      }
    case Ability.DECORATE:
      return {
        attackBuff: `${DECORATE_ABILITY_PARAMS.attackBoostByStar.join(",")},SP`,
        abilityPowerBuff: `${DECORATE_ABILITY_PARAMS.abilityPowerBoostByStar.join(",")},SP`
      }
    case Ability.DEEP_FREEZE:
      return {
        damagePerBolt: `${DEEP_FREEZE_ABILITY_PARAMS.damagePerBolt},SP`,
        boltCount: DEEP_FREEZE_ABILITY_PARAMS.boltCount,
        durationSeconds: Math.round(
          (DEEP_FREEZE_ABILITY_PARAMS.boltCount *
            DEEP_FREEZE_ABILITY_PARAMS.boltIntervalMs) /
            1000
        ),
        specialDefenseReduction:
          DEEP_FREEZE_ABILITY_PARAMS.specialDefenseReductionPerBolt
      }
    case Ability.DEFENSE_CURL:
      return {
        defenseBuff: `${DEFENSE_CURL_ABILITY_PARAMS.defenseBuffByStar.join(",")},SP`
      }
    case Ability.DETECT:
      return {
        protectSecondsPerEnemy: `${DETECT_ABILITY_PARAMS.protectDurationPerEnemyMs / 1000},SP,ND=1`,
        detectionRadiusTiles: DETECT_ABILITY_PARAMS.enemyDetectionRangeTiles
      }
    case Ability.DIAMOND_STORM:
      return {
        defPercentDamage: `${DIAMOND_STORM_ABILITY_PARAMS.defenseDamageRatio * 100},SP`
      }
    case Ability.DIG:
      return {
        damage: `${DIG_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.DIRE_CLAW:
      return {
        damage: `${DIRE_CLAW_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        statusSeconds: DIRE_CLAW_ABILITY_PARAMS.statusDurationMs / 1000
      }
    case Ability.DISARMING_VOICE:
      return {
        charmSeconds: DISARMING_VOICE_ABILITY_PARAMS.charmDurationMs / 1000,
        radiusTiles: `${DISARMING_VOICE_ABILITY_PARAMS.radiusByStar.join(",")}`
      }
    case Ability.DISCHARGE:
      return {
        damage: `${DISCHARGE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: DISCHARGE_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.DIVE:
      return {
        shield: `${DIVE_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        damage: `${DIVE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeSeconds: DIVE_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.DIZZY_PUNCH:
      return {
        damage: `${DIZZY_PUNCH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        confusionSeconds: DIZZY_PUNCH_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.DOOM_DESIRE:
      return {
        damage: `${DOOM_DESIRE_ABILITY_PARAMS.damage}`,
        delaySeconds: DOOM_DESIRE_ABILITY_PARAMS.delayMs / 1000
      }
    case Ability.DOUBLE_EDGE:
      return {
        damage: `${DOUBLE_EDGE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        recoil: `${DOUBLE_EDGE_ABILITY_PARAMS.recoilByStar.join(",")},SP`
      }
    case Ability.DOUBLE_IRON_BASH:
      return {
        atkPercentPerHit: `${DOUBLE_IRON_BASH_ABILITY_PARAMS.atkRatio * 100}`,
        flinchSeconds: DOUBLE_IRON_BASH_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.DOUBLE_SHOCK:
      return {
        damage: `${DOUBLE_SHOCK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        selfParalysisSeconds:
          DOUBLE_SHOCK_ABILITY_PARAMS.selfParalysisDurationMs / 1000
      }
    case Ability.DRACO_ENERGY:
      return {
        currentHpPercentDamage: "100,SP"
      }
    case Ability.DRACO_METEOR:
      return {
        damage: `${DRACO_METEOR_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        apReduction: DRACO_METEOR_ABILITY_PARAMS.apReduction
      }
    case Ability.DRAGON_BREATH:
      return {
        damage: `${DRAGON_BREATH_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.DRAGON_CLAW:
      return {
        damage: `${DRAGON_CLAW_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        woundSeconds: DRAGON_CLAW_ABILITY_PARAMS.woundDurationMs / 1000
      }
    case Ability.DRAGON_DARTS:
      return {
        damage: `${DRAGON_DARTS_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        hitCount: DRAGON_DARTS_ABILITY_PARAMS.hitCount,
        ppGainOnKill: DRAGON_DARTS_ABILITY_PARAMS.ppGainOnKill
      }
    case Ability.DRAGON_PULSE:
      return {
        damage: `${DRAGON_PULSE_ABILITY_PARAMS.damage}`
      }
    case Ability.DRAGON_TAIL:
      return {
        damage: `${DRAGON_TAIL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        defenseBuff: `${DRAGON_TAIL_ABILITY_PARAMS.defenseBuffByStar.join(",")},SP`
      }
    case Ability.DRAIN_PUNCH:
      return {
        atkPercentDamage: `${DRAIN_PUNCH_ABILITY_PARAMS.atkMultiplier * 100}`,
        healPercent: DRAIN_PUNCH_ABILITY_PARAMS.healRatio * 100
      }
    case Ability.DREAM_EATER:
      return {
        damage: `${DREAM_EATER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        sleepSeconds: `${DREAM_EATER_ABILITY_PARAMS.sleepDurationByStar.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.DRILL_PECK:
      return {
        damage: `${DRILL_PECK_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.DRILL_RUN:
      return {
        trueDamage: `${DRILL_RUN_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.DRUM_BEATING:
      return {
        shieldBuff: `${DRUM_BEATING_ABILITY_PARAMS.buffByStar.join(",")},SP`,
        damage: `${DRUM_BEATING_ABILITY_PARAMS.buffByStar.join(",")},SP`,
        speedBuff: `${DRUM_BEATING_ABILITY_PARAMS.buffByStar.join(",")},SP`
      }
    case Ability.DYNAMAX_CANNON:
      return {
        maxHpPercentDamage: `${DYNAMAX_CANNON_ABILITY_PARAMS.hpDamageRatio * 100},SP`
      }
    case Ability.DYNAMIC_PUNCH:
      return {
        damage: `${DYNAMIC_PUNCH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        confusionSeconds: DYNAMIC_PUNCH_ABILITY_PARAMS.durationByStar
          .map((d) => d / 1000)
          .join(",")
      }
    case Ability.EAR_DIG:
      return {
        damage: `${EAR_DIG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        perHoleLevelDamage: `${EAR_DIG_ABILITY_PARAMS.perHoleLevelDamageByStar.join(",")},SP`
      }
    case Ability.ECHO:
      return {
        damage: `${ECHO_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        damageIncreasePerCast: `${ECHO_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.EERIE_SPELL:
      return {
        damage: `${EERIE_SPELL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        heal: `${EERIE_SPELL_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.EGG_BOMB:
      return {
        damage: `${EGG_BOMB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        eggChance: EGG_BOMB_ABILITY_PARAMS.eggChance * 100,
        armorBreakSeconds:
          EGG_BOMB_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.ELECTRIC_SURGE:
      return {
        speedBuff: `${ELECTRIC_SURGE_ABILITY_PARAMS.speedBuff},SP`
      }
    case Ability.ELECTRIFY:
      return {
        shield: `${ELECTRIFY_ABILITY_PARAMS.shieldByStar.join(",")},SP`
      }
    case Ability.ELECTRO_BALL:
      return {
        damage: `${ELECTRO_BALL_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ELECTRO_BOOST:
      return {
        runeProtectSeconds:
          ELECTRO_BOOST_ABILITY_PARAMS.runeProtectDurationMs / 1000
      }
    case Ability.ELECTRO_SHOT:
      return {
        damage: `${ELECTRO_SHOT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        chargeSeconds: ELECTRO_SHOT_ABILITY_PARAMS.chargeDelayMs / 1000,
        apBoost: ELECTRO_SHOT_ABILITY_PARAMS.apBoost
      }
    case Ability.ELECTRO_WEB:
      return {
        damage: `${ELECTRO_WEB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        speedSteal: `${ELECTRO_WEB_ABILITY_PARAMS.stealByStar.join(",")},SP`
      }
    case Ability.ENCORE:
      return {}
    case Ability.ENTANGLING_THREAD:
      return {
        damage: `${ENTANGLING_THREAD_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds:
          ENTANGLING_THREAD_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.ENTRAINMENT:
      return {
        ppGain: `${ENTRAINMENT_ABILITY_PARAMS.ppGained},SP`
      }
    case Ability.ERUPTION:
      return {
        projectileCount: `${ERUPTION_ABILITY_PARAMS.projectileCountByStar.join(",")}`,
        damage: `${ERUPTION_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: ERUPTION_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.EXPANDING_FORCE:
      return {
        damage: `${EXPANDING_FORCE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.EXPLOSION:
      return {
        damage: `${EXPLOSION_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.EXTREME_SPEED:
      return {
        damage: `${EXTREME_SPEED_ABILITY_PARAMS.damage}`
      }
    case Ability.FACADE:
      return {
        damage: `${FACADE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.FAIRY_LOCK:
      return {
        damage: `${FAIRY_LOCK_ABILITY_PARAMS.totalDamage}`,
        lockSeconds: FAIRY_LOCK_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.FAIRY_WIND:
      return {
        ppGain: `${FAIRY_WIND_ABILITY_PARAMS.ppGainByStar.join(",")},SP=0.5`
      }
    case Ability.FAKE_OUT:
      return {
        damage: `${FAKE_OUT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        apReduction: FAKE_OUT_ABILITY_PARAMS.apReduction,
        flinchSeconds: FAKE_OUT_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.FAKE_TEARS:
      return {
        damage: `${FAKE_TEARS_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        armorBreakSeconds:
          FAKE_TEARS_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.FEATHER_DANCE:
      return {
        hpBuff: "20,SP",
        atkBuff: "4,SP",
        defBuff: "4,SP",
        speDefBuff: "4,SP",
        speedBuff: "10,SP",
        luckBuff: "10,SP"
      }
    case Ability.FELL_STINGER:
      return {
        atkPercentDamage: `${FELL_STINGER_ABILITY_PARAMS.atkMultiplier * 100},SP`,
        atkBoostPercent: FELL_STINGER_ABILITY_PARAMS.deathAtkBoostRatio * 100
      }
    case Ability.FICKLE_BEAM:
      return {
        beamChance: `${FICKLE_BEAM_ABILITY_PARAMS.beamChance * 100},LK`,
        damage: `${FICKLE_BEAM_ABILITY_PARAMS.damage},SP`,
        beamCount: FICKLE_BEAM_ABILITY_PARAMS.beamCount,
        paralysisSeconds: FICKLE_BEAM_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.FIERY_DANCE:
      return {
        damage: `${FIERY_DANCE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.FIERY_WRATH:
      return {
        damage: `${FIERY_WRATH_ABILITY_PARAMS.damage}`,
        flinchChance: `${FIERY_WRATH_ABILITY_PARAMS.flinchChance * 100}`,
        radiusTiles: FIERY_WRATH_ABILITY_PARAMS.radius,
        flinchSeconds: FIERY_WRATH_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.FILLET_AWAY:
      return {
        atkBuff: `${FILLET_AWAY_ABILITY_PARAMS.atkBoost}`,
        speedBuff: `${FILLET_AWAY_ABILITY_PARAMS.speedBoost}`,
        hpSacrificePercent: FILLET_AWAY_ABILITY_PARAMS.maxHpLossRatio * 100
      }
    case Ability.FIRE_BLAST:
      return {
        damage: `${FIRE_BLAST_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.FIRE_FANG:
      return {
        damage: `${FIRE_FANG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: FIRE_FANG_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.FIRE_LASH:
      return {
        damage: `${FIRE_LASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        armorBreakSeconds:
          FIRE_LASH_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.FIRE_SPIN:
      return {
        damage: `${FIRE_SPIN_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: FIRE_SPIN_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.FIRESTARTER:
      return {
        speedBuff: `${FIRESTARTER_ABILITY_PARAMS.speedBuffByStar.join(",")},SP`,
        damage: `${FIRESTARTER_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.FIRST_IMPRESSION:
      return {
        damage: `${FIRST_IMPRESSION_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        bugRarities: "Common, Uncommon, Rare",
        flinchSeconds: FIRST_IMPRESSION_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.FISHIOUS_REND:
      return {
        damage: `${FISHIOUS_REND_ABILITY_PARAMS.damage}`
      }
    case Ability.FISSURE:
      return {
        riftCount: `${FISSURE_ABILITY_PARAMS.numberOfRiftsByStar.join(",")}`,
        damage: `${FISSURE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.FLAMETHROWER:
      return {
        damage: `${FLAMETHROWER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: FLAMETHROWER_ABILITY_PARAMS.burnDurationMs / 1000,
        radiusTiles: FLAMETHROWER_ABILITY_PARAMS.range
      }
    case Ability.FLASH:
      return {
        blindSeconds: `${FLASH_ABILITY_PARAMS.durationByStar.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.FLEUR_CANNON:
      return {
        damage: `${FLEUR_CANNON_ABILITY_PARAMS.damage}`
      }
    case Ability.FLORAL_HEALING:
      return {}
    case Ability.FLOWER_TRICK:
      return {
        damage: `${FLOWER_TRICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        critBonusDamage: FLOWER_TRICK_ABILITY_PARAMS.critBonusDamage,
        explosionDelaySec: FLOWER_TRICK_ABILITY_PARAMS.explosionDelayMs / 1000
      }
    case Ability.FLY:
      return {
        atkPercentDamage: `${FLY_ABILITY_PARAMS.atkMultiplier * 100},SP`,
        delaySeconds: FLY_ABILITY_PARAMS.impactDelayMs / 1000
      }
    case Ability.FUSION_BOLT:
      return {
        baseDamage: `${FUSION_BOLT_ABILITY_PARAMS.baseDamage},SP`,
        synergyDamagePerLevel: `${FUSION_BOLT_ABILITY_PARAMS.synergyMultiplier},SP`
      }
    case Ability.GLACIATE:
      return {
        baseDamage: `${GLACIATE_ABILITY_PARAMS.baseDamage},SP`,
        synergyDamagePerLevel: `${GLACIATE_ABILITY_PARAMS.synergyMultiplier},SP`
      }
    case Ability.GRASSY_SURGE:
      return {
        atkBuff: `${GRASSY_SURGE_ABILITY_PARAMS.attackBuff}`
      }
    case Ability.GRAV_APPLE:
      return {
        baseDamage: `${GRAV_APPLE_ABILITY_PARAMS.baseDamage},SP`,
        zeroDefenseDamage: `${GRAV_APPLE_ABILITY_PARAMS.baseDamage * GRAV_APPLE_ABILITY_PARAMS.defZeroMultiplier},SP`
      }
    case Ability.FLYING_PRESS:
      return {
        hpPercentDamage: `${FLYING_PRESS_ABILITY_PARAMS.maxHpRatio * 100}`
      }
    case Ability.FOCUS_PUNCH:
      return {
        atkMultiplierPercent: FOCUS_PUNCH_ABILITY_PARAMS.atkMultiplier * 100,
        chargeDelaySec: FOCUS_PUNCH_ABILITY_PARAMS.chargeDelayMs / 1000
      }
    case Ability.FOLLOW_ME:
      return {
        shield: `${FOLLOW_ME_ABILITY_PARAMS.shield}`,
        charmDurationSec: FOLLOW_ME_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.FORCE_PALM:
      return {
        baseDamage: `${FORCE_PALM_ABILITY_PARAMS.baseDamage}`,
        maxHpPercent: `${FORCE_PALM_ABILITY_PARAMS.maxHpRatio * 100}`,
        bonusDamage: `${FORCE_PALM_ABILITY_PARAMS.paralysisBonus}`,
        paralysisDurationSec:
          FORCE_PALM_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.FORECAST:
      return {
        shield: `${FORECAST_ABILITY_PARAMS.shield}`,
        defBuff: `${FORECAST_ABILITY_PARAMS.defBuff}`,
        atkBuff: `${FORECAST_ABILITY_PARAMS.atkBuff}`,
        ppBuff: `${FORECAST_ABILITY_PARAMS.ppBuff}`
      }
    case Ability.FOUL_PLAY:
      return {
        atkMultiplierPercent: `${FOUL_PLAY_ABILITY_PARAMS.atkMultiplierByStar.map((v) => v * 100).join(",")},SP`
      }
    case Ability.FREEZE_DRY:
      return {
        baseDamage: FREEZE_DRY_ABILITY_PARAMS.baseDamage,
        splashDamage: FREEZE_DRY_ABILITY_PARAMS.killSplashDamage
      }
    case Ability.FREEZING_GLARE:
      return {
        damage: `${FREEZING_GLARE_ABILITY_PARAMS.damage}`,
        freezeChance: FREEZING_GLARE_ABILITY_PARAMS.freezeChance * 100,
        freezeDurationSec: FREEZING_GLARE_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.FROST_BREATH:
      return {
        damage: `${FROST_BREATH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeChance: FROST_BREATH_ABILITY_PARAMS.freezeChance * 100,
        freezeDurationSec: FROST_BREATH_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.FURY_SWIPES:
      return {
        attackCount: FURY_SWIPES_ABILITY_PARAMS.baseAttackCount,
        ppPerRemainingHit: FURY_SWIPES_ABILITY_PARAMS.ppPerRemainingHit
      }
    case Ability.FUTURE_SIGHT:
      return {
        damage: `${FUTURE_SIGHT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        delaySec: FUTURE_SIGHT_ABILITY_PARAMS.delayMs / 1000,
        maxTargets: FUTURE_SIGHT_ABILITY_PARAMS.maxTargets
      }
    case Ability.GEAR_GRIND:
      return {
        speedPercentDamage: `${GEAR_GRIND_ABILITY_PARAMS.speedFactorByStar.map((v) => v * 100).join(",")},SP`
      }
    case Ability.GEOMANCY:
      return {
        atkBuff: GEOMANCY_ABILITY_PARAMS.atkBuff,
        specialDefenseBuff: GEOMANCY_ABILITY_PARAMS.speDefBuff,
        speedBuff: GEOMANCY_ABILITY_PARAMS.speedBuff
      }
    case Ability.GIGATON_HAMMER:
      return {
        damage: `${GIGATON_HAMMER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        fatigueDurationSec:
          GIGATON_HAMMER_ABILITY_PARAMS.fatigueDurationMs / 1000
      }
    case Ability.GLACIAL_LANCE:
      return {
        atkMultiplierPercent: GLACIAL_LANCE_ABILITY_PARAMS.atkMultiplier * 100
      }
    case Ability.GLAIVE_RUSH:
      return {
        damage: `${GLAIVE_RUSH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        armorReductionDurationSec:
          GLAIVE_RUSH_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.GOLD_RUSH:
      return {
        damage: `${GOLD_RUSH_ABILITY_PARAMS.baseDamage}`,
        goldDamagePercent: GOLD_RUSH_ABILITY_PARAMS.goldDamagePercent,
        moneyGain: GOLD_RUSH_ABILITY_PARAMS.moneyGain
      }
    case Ability.GRASS_WHISTLE:
      return {
        targetCount: `${GRASS_WHISTLE_ABILITY_PARAMS.targetCountByStar.join(",")},SP`,
        sleepDurationSec: GRASS_WHISTLE_ABILITY_PARAMS.sleepDurationMs / 1000
      }
    case Ability.GRAVITY:
      return {
        lockDuration: GRAVITY_ABILITY_PARAMS.baseLockDurationMs / 1000
      }
    case Ability.GRUDGE_DIVE:
      return {
        recoilPercent: GRUDGE_DIVE_ABILITY_PARAMS.recoilRatio * 100,
        damage: `${GRUDGE_DIVE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        bonusDamagePerFallenAlly: `${GRUDGE_DIVE_ABILITY_PARAMS.damagePerFallenAllyByStar.join(",")},SP`
      }
    case Ability.GUILLOTINE:
      return {
        atkMultiplierPercent: GUILLOTINE_ABILITY_PARAMS.atkMultiplier * 100,
        ppGainPercent: GUILLOTINE_ABILITY_PARAMS.ppGainRatio * 100
      }
    case Ability.GULP_MISSILE:
      return {
        damage: `${GULP_MISSILE_ABILITY_PARAMS.damage}`,
        pikachuChance: GULP_MISSILE_ABILITY_PARAMS.pikachuChance * 100
      }
    case Ability.GUNK_SHOT:
      return {
        damage: `${GUNK_SHOT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonDuration: `${GUNK_SHOT_ABILITY_PARAMS.poisonDurationByStar.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.HAIL:
      return {
        projectileCount: `${HAIL_ABILITY_PARAMS.projectileCountByStar.join(",")},SP`,
        damage: `${HAIL_ABILITY_PARAMS.damage}`,
        freezeDurationSec: HAIL_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.HAPPY_HOUR:
      return {
        atkBuff: `${HAPPY_HOUR_ABILITY_PARAMS.atkBuffByStar.join(",")},SP`
      }
    case Ability.HARDEN:
      return {
        defGain: `${HARDEN_ABILITY_PARAMS.defGainByStar.join(",")},SP`
      }
    case Ability.HEAD_SMASH:
      return {
        damage: `${HEAD_SMASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        recoil: `${HEAD_SMASH_ABILITY_PARAMS.recoilByStar.join(",")},SP`
      }
    case Ability.HEADBUTT:
      return {
        damage: `${HEADBUTT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        flinchDuration: HEADBUTT_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.HEADLONG_RUSH:
      return {
        finalTargetDamage: `${HEADLONG_RUSH_ABILITY_PARAMS.finalTargetDamageByStar.join(",")},SP`,
        pathDamage: `${HEADLONG_RUSH_ABILITY_PARAMS.pathDamageByStar.join(",")},SP`
      }
    case Ability.HEAL_BLOCK:
      return {
        damage: `${HEAL_BLOCK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        woundDuration: HEAL_BLOCK_ABILITY_PARAMS.woundDurationMs / 1000
      }
    case Ability.HEAL_ORDER:
      return {
        damage: `${HEAL_ORDER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        heal: `${HEAL_ORDER_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.HEART_SWAP:
      return {
        damage: `${HEART_SWAP_ABILITY_PARAMS.damage}`
      }
    case Ability.HEAT_CRASH:
      return {
        damage: `${HEAT_CRASH_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.HEAVY_SLAM:
      return {
        damage: `${HEAVY_SLAM_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.HELPING_HAND:
      return {
        shield: `${HELPING_HAND_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        alliesBuffed: HELPING_HAND_ABILITY_PARAMS.nbAlliesBuffed
      }
    case Ability.HEX:
      return {
        damage: `${HEX_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        negativeStatusMultiplier: HEX_ABILITY_PARAMS.negativeStatusMultiplier
      }
    case Ability.HIGH_HORSEPOWER:
      return {
        damage: `${HIGH_HORSEPOWER_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.HIGH_JUMP_KICK:
      return {
        damage: `${HIGH_JUMP_KICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        maxPpStolen: HIGH_JUMP_KICK_ABILITY_PARAMS.maxPpStolen
      }
    case Ability.HIDDEN_POWER_N:
      return {
        shield: HIDDEN_POWER_N_ABILITY_PARAMS.shield
      }
    case Ability.HORN_ATTACK:
      return {
        atkMultiplierPercent: `${HORN_ATTACK_ABILITY_PARAMS.atkMultiplierByStar.map((v) => v * 100).join(",")},SP`,
        armorBreakDuration:
          HORN_ATTACK_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.HORN_DRILL:
      return {
        atkMultiplierPercent: `${HORN_DRILL_ABILITY_PARAMS.atkMultiplierByStar.map((v) => v * 100).join(",")},SP`,
        executeChancePercent: HORN_DRILL_ABILITY_PARAMS.baseExecuteChance * 100
      }
    case Ability.HORN_LEECH:
      return {
        atkMultiplierPercent: HORN_LEECH_ABILITY_PARAMS.atkMultiplier * 100,
        healPercent: HORN_LEECH_ABILITY_PARAMS.healRatio * 100,
        overhealShieldPercent:
          HORN_LEECH_ABILITY_PARAMS.overhealShieldRatio * 100
      }
    case Ability.HURRICANE:
      return {
        damage: `${HURRICANE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisDuration: HURRICANE_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.HYDRO_PUMP:
      return {
        damage: `${HYDRO_PUMP_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.HYDRO_STEAM:
      return {
        baseDamage: `${HYDRO_STEAM_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        burnDurationSec: HYDRO_STEAM_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.HYPER_BEAM:
      return {
        damage: `${HYPER_BEAM_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        chargeDurationSec: HYPER_BEAM_ABILITY_PARAMS.chargeDelayMs / 1000,
        fatigueDurationSec: HYPER_BEAM_ABILITY_PARAMS.fatigueDurationMs / 1000
      }
    case Ability.HYPER_DRILL:
      return {
        damage: `${HYPER_DRILL_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.HYPER_VOICE:
      return {
        damage: `${HYPER_VOICE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        confusionChance: HYPER_VOICE_ABILITY_PARAMS.confusionChance * 100,
        confusionDuration: `${HYPER_VOICE_ABILITY_PARAMS.confusionDurationByStar.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.HYPERSPACE_FURY:
      return {
        hitCount: HYPERSPACE_FURY_ABILITY_PARAMS.baseHits,
        damagePerHit: HYPERSPACE_FURY_ABILITY_PARAMS.damagePerHit,
        defenseReduction: HYPERSPACE_FURY_ABILITY_PARAMS.defenseReduction
      }
    case Ability.HYPNOSIS:
      return {
        sleepDuration: `${HYPNOSIS_ABILITY_PARAMS.sleepDurationByStar.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.ICE_BALL:
      return {
        baseDamage: `${ICE_BALL_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        speDefMultiplierPercent: `${ICE_BALL_ABILITY_PARAMS.multiplierByStar.map((v) => v * 100).join(",")},SP`,
        speDefBoost: ICE_BALL_ABILITY_PARAMS.speDefBoost
      }
    case Ability.ICE_FANG:
      return {
        damage: `${ICE_FANG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeDuration: `${ICE_FANG_ABILITY_PARAMS.freezeDurationByStar.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.ICE_HAMMER:
      return {
        damage: `${ICE_HAMMER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeDuration: ICE_HAMMER_ABILITY_PARAMS.freezeDurationMs / 1000,
        paralysisDuration: ICE_HAMMER_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.ICE_SPINNER:
      return {
        damage: `${ICE_SPINNER_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ICICLE_CRASH:
      return {
        damage: `${ICICLE_CRASH_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ICICLE_MISSILE:
      return {
        hitCount: `${ICICLE_MISSILE_ABILITY_PARAMS.hitCountByStar.join(",")},SP`,
        damage: ICICLE_MISSILE_ABILITY_PARAMS.damage,
        freezeDurationSec: ICICLE_MISSILE_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.ICY_WIND:
      return {
        damage: `${ICY_WIND_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        speedDebuff: `${ICY_WIND_ABILITY_PARAMS.speedDebuffByStar.join(",")},SP`
      }
    case Ability.INFERNAL_PARADE:
      return {
        damage: `${INFERNAL_PARADE_ABILITY_PARAMS.damage},SP`,
        burnChance: INFERNAL_PARADE_ABILITY_PARAMS.burnChance * 100,
        burnDurationSec: INFERNAL_PARADE_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.INFESTATION:
      return {
        damagePerBugAlly: INFESTATION_ABILITY_PARAMS.damagePerBugAlly
      }
    case Ability.IRON_DEFENSE:
      return {
        shield: `${IRON_DEFENSE_ABILITY_PARAMS.shieldByStar.join(",")}`
      }
    case Ability.IRON_HEAD:
      return {
        defenseBuff: `${IRON_HEAD_ABILITY_PARAMS.defenseBuffByStar.join(",")},SP`,
        defSpeDefDamagePercent: 100
      }
    case Ability.IRON_TAIL:
      return {
        damagePercentOfDef:
          IRON_TAIL_ABILITY_PARAMS.defenseDamageMultiplier * 100
      }
    case Ability.IVY_CUDGEL:
      return {
        damage: IVY_CUDGEL_ABILITY_PARAMS.damage
      }
    case Ability.JAW_LOCK:
      return {
        atkMultiplierPercent: JAW_LOCK_ABILITY_PARAMS.atkMultiplier * 100,
        bonusDamage: `${JAW_LOCK_ABILITY_PARAMS.bonusDamageByStar.join(",")},SP`,
        healOnBitten: `${JAW_LOCK_ABILITY_PARAMS.healOnBittenByStar.join(",")}`,
        lockDurationSec: JAW_LOCK_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.JET_PUNCH:
      return {
        speedMultiplierPercent: JET_PUNCH_ABILITY_PARAMS.speedMultiplier * 100
      }
    case Ability.KING_SHIELD:
      return {
        shield: `${KING_SHIELD_ABILITY_PARAMS.shieldByStar.join(",")}`,
        protectSeconds: KING_SHIELD_ABILITY_PARAMS.durationMs / 1000
      }
    case Ability.KNOCK_OFF:
      return {
        baseDamage: `${KNOCK_OFF_ABILITY_PARAMS.baseDamage},SP`,
        damagePerItem: `${KNOCK_OFF_ABILITY_PARAMS.damagePerTargetItem},SP`
      }
    case Ability.KNOWLEDGE_THIEF:
      return {
        experienceGain: KNOWLEDGE_THIEF_ABILITY_PARAMS.experienceGain
      }
    case Ability.KOWTOW_CLEAVE:
      return {
        baseAtkMultiplierPercent:
          KOWTOW_CLEAVE_ABILITY_PARAMS.baseAtkMultiplier * 100,
        fallenAlliesBonusPercent:
          KOWTOW_CLEAVE_ABILITY_PARAMS.fallenAlliesBonusPerUnit * 100
      }
    case Ability.LANDS_WRATH:
      return {
        baseDamage: `${LANDS_WRATH_ABILITY_PARAMS.baseDamage},SP`,
        atkMultiplierPercent: LANDS_WRATH_ABILITY_PARAMS.atkMultiplier * 100,
        defenseReduction: LANDS_WRATH_ABILITY_PARAMS.defenseReduction
      }
    case Ability.LASER_BLADE:
      return {
        alternateSpinShield: `${LASER_BLADE_ABILITY_PARAMS.alternateSpinShield},SP`,
        alternateSpinDamage: `${LASER_BLADE_ABILITY_PARAMS.alternateSpinDamage},SP`,
        frontSpinBaseDamage: `${LASER_BLADE_ABILITY_PARAMS.frontSpinBaseDamage},SP`
      }
    case Ability.LAST_RESPECTS:
      return {
        damage: `${LAST_RESPECTS_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        baseCurseDelaySeconds: `${LAST_RESPECTS_ABILITY_PARAMS.baseCurseDelayByStarMs.map((v) => v / 1000).join(",")},SP`
      }
    case Ability.LAVA_PLUME:
      return {
        damage: `${LAVA_PLUME_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.LEAF_BLADE:
      return {
        atkMultiplierPercent: LEAF_BLADE_ABILITY_PARAMS.atkMultiplier * 100
      }
    case Ability.LEECH_LIFE:
      return {
        damage: `${LEECH_LIFE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.LICK:
      return {
        damage: `${LICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        statusSeconds: LICK_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.LINGERING_AROMA:
      return {
        damage: `${LINGERING_AROMA_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        durationSeconds: LINGERING_AROMA_ABILITY_PARAMS.durationMs / 1000,
        ppLoss: LINGERING_AROMA_ABILITY_PARAMS.ppLoss
      }
    case Ability.LINK_CABLE:
      return {
        damage: `${LINK_CABLE_ABILITY_PARAMS.partnerDamage},SP`
      }
    case Ability.LOCK_ON:
      return {
        additionalTrueDamagePercent:
          LOCK_ON_ABILITY_PARAMS.trueDamageMultiplier * 100
      }
    case Ability.LOVELY_KISS:
      return {
        sleepSeconds: `${LOVELY_KISS_ABILITY_PARAMS.sleepDurationByStar.map((v) => v / 1000).join(",")},SP`,
        damage: `${LOVELY_KISS_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.LUNAR_BLESSING:
      return {
        healPercent: LUNAR_BLESSING_ABILITY_PARAMS.healRatio * 100
      }
    case Ability.LUNGE:
      return {
        damage: `${LUNGE_ABILITY_PARAMS.damage},SP`,
        attackReduction: LUNGE_ABILITY_PARAMS.attackReduction
      }
    case Ability.LUSTER_PURGE:
      return {
        damage: `${LUSTER_PURGE_ABILITY_PARAMS.damage},SP`,
        reboundRangeTiles: LUSTER_PURGE_ABILITY_PARAMS.firstHitMaxRange,
        specialDefenseReduction:
          LUSTER_PURGE_ABILITY_PARAMS.specialDefenseReduction
      }
    case Ability.MACH_PUNCH:
      return {
        damage: `${MACH_PUNCH_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.MAGIC_BOUNCE:
      return {
        durationSeconds: MAGIC_BOUNCE_ABILITY_PARAMS.durationMs / 1000,
        reflectPercent: `${MAGIC_BOUNCE_ABILITY_PARAMS.reflectMultiplierByStar.map((v) => v * 100).join(",")},SP`
      }
    case Ability.MAGIC_POWDER:
      return {
        shield: `${MAGIC_POWDER_ABILITY_PARAMS.shieldByStar.join(",")}`,
        silenceSeconds: `${MAGIC_POWDER_ABILITY_PARAMS.silenceDurationByStar.map((v) => v / 1000).join(",")}`
      }
    case Ability.MAGICAL_LEAF:
      return {
        damage: `${MAGICAL_LEAF_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        armorBreakSeconds:
          MAGICAL_LEAF_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.MAGMA_STORM:
      return {
        damage: `${MAGMA_STORM_ABILITY_PARAMS.baseDamage},SP`,
        maxJumps: MAGMA_STORM_ABILITY_PARAMS.maxDepth,
        powerLossPercentPerJump:
          MAGMA_STORM_ABILITY_PARAMS.powerDecayPerJump * 100
      }
    case Ability.MAGNET_BOMB:
      return {
        centerDamage: `${MAGNET_BOMB_ABILITY_PARAMS.centerDamageByStar.join(",")},SP`,
        splashDamage: `${MAGNET_BOMB_ABILITY_PARAMS.splashDamageByStar.join(",")},SP`,
        lockSeconds: MAGNET_BOMB_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.MAGNET_PULL:
      return {}
    case Ability.MAGNET_RISE:
      return {
        protectSeconds: MAGNET_RISE_ABILITY_PARAMS.protectDurationMs / 1000,
        dodgeChancePercent: MAGNET_RISE_ABILITY_PARAMS.dodgeChance * 100,
        alliesBuffed: `${MAGNET_RISE_ABILITY_PARAMS.alliesBuffedByStar.join(",")}`
      }
    case Ability.MAKE_IT_RAIN:
      return {
        baseDamage: `${MAKE_IT_RAIN_ABILITY_PARAMS.baseDamage},SP`,
        goldDamagePercent: MAKE_IT_RAIN_ABILITY_PARAMS.goldDamagePercent
      }
    case Ability.MALIGNANT_CHAIN:
      return {
        poisonStacks: MALIGNANT_CHAIN_ABILITY_PARAMS.poisonStacks,
        possessedDurationSeconds:
          MALIGNANT_CHAIN_ABILITY_PARAMS.baseDurationMs / 1000
      }
    case Ability.MANTIS_BLADES:
      return {
        damage: `${MANTIS_BLADES_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.MAWASHI_GERI:
      return {
        damage: `${MAWASHI_GERI_ABILITY_PARAMS.baseDamage},SP`
      }
    case Ability.MEGA_PUNCH:
      return {
        damage: `${MEGA_PUNCH_ABILITY_PARAMS.baseDamage},SP`
      }
    case Ability.MEDITATE:
      return {
        attackBuffPercent: MEDITATE_ABILITY_PARAMS.attackBuffRatio * 100
      }
    case Ability.METAL_BURST:
      return {
        baseDamage: `${METAL_BURST_ABILITY_PARAMS.baseDamage},SP`,
        bonusDamagePerFightingBlock:
          METAL_BURST_ABILITY_PARAMS.damagePerFightingBlock
      }
    case Ability.METAL_CLAW:
      return {
        damage: `${METAL_CLAW_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        attackBuff: `${METAL_CLAW_ABILITY_PARAMS.atkBuffByStar.join(",")}`
      }
    case Ability.METEOR_MASH:
      return {
        hitCount: METEOR_MASH_ABILITY_PARAMS.baseHits,
        bonusHitsInPsychicField:
          METEOR_MASH_ABILITY_PARAMS.bonusHitsInPsychicField,
        atkDamagePercent: METEOR_MASH_ABILITY_PARAMS.atkDamageRatio * 100,
        atkBuffPerHit: METEOR_MASH_ABILITY_PARAMS.atkBuffPerHit
      }
    case Ability.METRONOME:
      return {}
    case Ability.MIMIC:
      return {}
    case Ability.MIND_BEND:
      return {
        possessedDurationSeconds:
          MIND_BEND_ABILITY_PARAMS.baseDurationMs / 1000,
        fallbackDamage: `${MIND_BEND_ABILITY_PARAMS.fallbackDamage},SP`
      }
    case Ability.MIND_BLOWN:
      return {
        fireworkCount: MIND_BLOWN_ABILITY_PARAMS.initialFireworkCount,
        hpLossPercent: MIND_BLOWN_ABILITY_PARAMS.hpLossRatio * 100,
        explosionRadius: MIND_BLOWN_ABILITY_PARAMS.explosionRadius,
        fireworkDamage: `${MIND_BLOWN_ABILITY_PARAMS.fireworkDamage},SP`,
        statusSeconds: MIND_BLOWN_ABILITY_PARAMS.statusDurationMs / 1000
      }
    case Ability.MISTY_SURGE:
      return {
        hpGain: `${MISTY_SURGE_ABILITY_PARAMS.hpGain},SP`,
        ppGain: `${MISTY_SURGE_ABILITY_PARAMS.ppGain},SP`
      }
    case Ability.MIST_BALL:
      return {
        damage: `${MIST_BALL_ABILITY_PARAMS.damage},SP`,
        reboundRangeTiles: MIST_BALL_ABILITY_PARAMS.firstHitMaxRange,
        abilityPowerReduction: MIST_BALL_ABILITY_PARAMS.abilityPowerReduction
      }
    case Ability.MOON_DREAM:
      return {
        sleepSeconds: `${MOON_DREAM_ABILITY_PARAMS.sleepDurationByStar.map((ms) => ms / 1000).join(",")}`,
        shield: `${MOON_DREAM_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        allyCount: MOON_DREAM_ABILITY_PARAMS.allyCount
      }
    case Ability.MOONBLAST:
      return {
        damage: `${MOONBLAST_ABILITY_PARAMS.damage},SP`,
        initialMoonCount: MOONBLAST_ABILITY_PARAMS.initialMoonCount,
        bonusMoonOnKill: MOONBLAST_ABILITY_PARAMS.bonusMoonsOnKill
      }
    case Ability.MOONGEIST_BEAM:
      return {
        damage: `${MOONGEIST_BEAM_ABILITY_PARAMS.enemyDamage},SP`,
        shield: `${MOONGEIST_BEAM_ABILITY_PARAMS.allyShield},SP`,
        paralysisSeconds:
          MOONGEIST_BEAM_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.MORTAL_SPIN:
      return {
        damage: `${MORTAL_SPIN_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: MORTAL_SPIN_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.MOUNTAIN_GALE:
      return {
        hitCount: `${MOUNTAIN_GALE_ABILITY_PARAMS.hitsByStar.join(",")}`,
        damage: `${MOUNTAIN_GALE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        flinchSeconds: MOUNTAIN_GALE_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.MUD_BUBBLE:
      return {
        heal: `${MUD_BUBBLE_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.MUD_SHOT:
      return {
        damage: `${MUD_SHOT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        speedDebuff: `${MUD_SHOT_ABILITY_PARAMS.speedDebuffByStar.join(",")},SP`
      }
    case Ability.MUDDY_WATER:
      return {
        damage: `${MUDDY_WATER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        maxTargets: MUDDY_WATER_ABILITY_PARAMS.maxTargets,
        statusSeconds:
          MUDDY_WATER_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.MYSTICAL_FIRE:
      return {
        damage: `${MYSTICAL_FIRE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        abilityPowerReduction: `${MYSTICAL_FIRE_ABILITY_PARAMS.abilityPowerDebuff},SP`
      }
    case Ability.MULTI_ATTACK:
      return {
        damage: `${MULTI_ATTACK_ABILITY_PARAMS.damagePerSynergyLevel},SP`
      }
    case Ability.NASTY_PLOT:
      return {
        attackBuff: `${NASTY_PLOT_ABILITY_PARAMS.attackBuff},SP`
      }
    case Ability.NATURAL_GIFT:
      return {
        heal: `${NATURAL_GIFT_ABILITY_PARAMS.healByStar.join(",")}`,
        runeProtectSeconds:
          NATURAL_GIFT_ABILITY_PARAMS.runeProtectDurationByStarMs
            .map((duration) => duration / 1000)
            .join(",")
      }
    case Ability.NIGHT_SHADE:
      return {
        maxHpPercentDamage: NIGHT_SHADE_ABILITY_PARAMS.hpRatioByStar
          .map((ratio) => Math.round(ratio * 100))
          .join(",")
      }
    case Ability.NIGHT_SLASH:
      return {
        damage: `${NIGHT_SLASH_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.NIGHTMARE:
      return {
        fatigueSeconds: NIGHTMARE_ABILITY_PARAMS.fatigueDurationByStar
          .map((duration) => duration / 1000)
          .join(","),
        damage: `${NIGHTMARE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.NO_RETREAT:
      return {
        statBuff: NO_RETREAT_ABILITY_PARAMS.statBuffPerFalinks,
        speedBuff: NO_RETREAT_ABILITY_PARAMS.speedBuffPerFalinks,
        troopDamage: `${NO_RETREAT_ABILITY_PARAMS.troopDamage},SP`
      }
    case Ability.NUTRIENTS:
      return {
        heal: `${NUTRIENTS_ABILITY_PARAMS.heal},SP`,
        defenseBuff: `${NUTRIENTS_ABILITY_PARAMS.defenseBuff},SP`
      }
    case Ability.NUZZLE:
      return {
        damage: `${NUZZLE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: NUZZLE_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.OBSTRUCT:
      return {
        protectSeconds: `${OBSTRUCT_ABILITY_PARAMS.baseDurationMs / 1000},SP=${OBSTRUCT_ABILITY_PARAMS.scalingFactor}`,
        defenseReduction: OBSTRUCT_ABILITY_PARAMS.defenseReduction
      }
    case Ability.OCTAZOOKA:
      return {
        atkPercentDamage: `${OCTAZOOKA_ABILITY_PARAMS.atkMultiplier * 100},SP`,
        blindSeconds: OCTAZOOKA_ABILITY_PARAMS.blindDurationMs / 1000
      }
    case Ability.OCTOLOCK:
      return {
        damage: `${OCTOLOCK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        lockSeconds: OCTOLOCK_ABILITY_PARAMS.lockDurationMs / 1000,
        armorBreakSeconds:
          OCTOLOCK_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.ORDER_UP:
      return {
        damage: `${ORDER_UP_ABILITY_PARAMS.damage},SP`
      }
    case Ability.ORIGIN_PULSE:
      return {
        damage: `${ORIGIN_PULSE_ABILITY_PARAMS.damage},SP`
      }
    case Ability.OUTRAGE:
      return {
        atkPercentDamage: `${OUTRAGE_ABILITY_PARAMS.atkMultiplier * 100},SP`,
        confusionSeconds: OUTRAGE_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.OVERDRIVE:
      return {
        atkPercentDamage: `${Math.round(OVERDRIVE_ABILITY_PARAMS.baseAtkMultiplier * 100)},SP`,
        radiusTiles: OVERDRIVE_ABILITY_PARAMS.radius,
        damageDecayPercentPerTile:
          OVERDRIVE_ABILITY_PARAMS.decayPerDistance * 100
      }
    case Ability.OVERHEAT:
      return {
        damage: `${OVERHEAT_ABILITY_PARAMS.baseDamage},SP`,
        radiusTiles: OVERHEAT_ABILITY_PARAMS.radius,
        burnDamageBonusPercent:
          (OVERHEAT_ABILITY_PARAMS.burnMultiplier - 1) * 100
      }
    case Ability.PARABOLIC_CHARGE:
      return {
        heal: `${PARABOLIC_CHARGE_ABILITY_PARAMS.healByStar.join(",")}`,
        damage: `${PARABOLIC_CHARGE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.PASTEL_VEIL:
      return {
        shield: `${PASTEL_VEIL_ABILITY_PARAMS.shieldByStar.join(",")}`
      }
    case Ability.PAYDAY:
      return {
        damage: `${PAYDAY_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        gold: PAYDAY_ABILITY_PARAMS.moneyGainByStar.join(",")
      }
    case Ability.PECK:
      return {
        damage: `${PECK_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.PETAL_BLIZZARD:
      return {
        damage: `${PETAL_BLIZZARD_ABILITY_PARAMS.damage},SP`,
        abilityPowerGain: PETAL_BLIZZARD_ABILITY_PARAMS.apGain
      }
    case Ability.PETAL_DANCE:
      return {
        damage: `${PETAL_DANCE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        targetCount: PETAL_DANCE_ABILITY_PARAMS.targetCountByStar.join(",")
      }
    case Ability.PLASMA_FISSION:
      return {
        damage: `${PLASMA_FISSION_ABILITY_PARAMS.baseDamage},SP`,
        splitDamageDecayPercent:
          (1 - PLASMA_FISSION_ABILITY_PARAMS.splitDamageDecayRatio) * 100
      }
    case Ability.PLASMA_FIST:
      return {
        damage: `${PLASMA_FIST_ABILITY_PARAMS.damage},SP`,
        healPercent: PLASMA_FIST_ABILITY_PARAMS.healRatio * 100
      }
    case Ability.PLASMA_FLASH:
      return {
        damage: `${PLASMA_FLASH_ABILITY_PARAMS.damage},SP`,
        baseFlashCount: PLASMA_FLASH_ABILITY_PARAMS.baseFlashCount,
        flashGainPerCast: PLASMA_FLASH_ABILITY_PARAMS.flashGainPerCast
      }
    case Ability.PLASMA_TEMPEST:
      return {
        damage: `${PLASMA_TEMPEST_ABILITY_PARAMS.baseDamage},SP`,
        targetCount: PLASMA_TEMPEST_ABILITY_PARAMS.targetCount,
        damageDecayPercent:
          (1 - PLASMA_TEMPEST_ABILITY_PARAMS.damageDecayRatio) * 100
      }
    case Ability.PLAY_ROUGH:
      return {
        damage: `${PLAY_ROUGH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        charmSeconds: PLAY_ROUGH_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.POISON_GAS:
      return {
        damage: `${POISON_GAS_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: POISON_GAS_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.POISON_JAB:
      return {
        damage: `${POISON_JAB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: POISON_JAB_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.POISON_POWDER:
      return {
        damage: `${POISON_POWDER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonSeconds: POISON_POWDER_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.POISON_STING:
      return {
        poisonStacks: `${POISON_STING_ABILITY_PARAMS.stacksToApplyByStar.join(",")}`,
        excessDamage: `${POISON_STING_ABILITY_PARAMS.excessDamageByStar.join(",")},SP`
      }
    case Ability.POLLEN_PUFF:
      return {
        heal: `${POLLEN_PUFF_ABILITY_PARAMS.healByStar.join(",")}`
      }
    case Ability.POLTERGEIST:
      return {
        baseDamage: `${POLTERGEIST_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        itemDamageBonus: `${POLTERGEIST_ABILITY_PARAMS.itemDamageBonus},SP`,
        toolDamageBonus: `${POLTERGEIST_ABILITY_PARAMS.toolDamageBonus},SP`
      }
    case Ability.POPULATION_BOMB:
      return {
        damagePerHit: `${POPULATION_BOMB_ABILITY_PARAMS.damagePerHit},SP`,
        hitCount: `${POPULATION_BOMB_ABILITY_PARAMS.hitsByStar.join(",")},SP`
      }
    case Ability.POWDER:
      return {
        damage: `${POWDER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        speedReduction: `${POWDER_ABILITY_PARAMS.speedReductionByStar.join(",")},SP`,
        speedDebuffSeconds: POWDER_ABILITY_PARAMS.speedDebuffDurationMs / 1000
      }
    case Ability.POWDER_SNOW:
      return {
        damage: `${POWDER_SNOW_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeChance: `${POWDER_SNOW_ABILITY_PARAMS.freezeChanceByStar.map((chance) => Math.round(chance * 100)).join(",")},LK`,
        freezeSeconds: POWDER_SNOW_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.POWER_HUG:
      return {
        damage: `${POWER_HUG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        statusSeconds: POWER_HUG_ABILITY_PARAMS.lockedDurationMs / 1000
      }
    case Ability.POWER_WASH:
      return {
        damage: `${POWER_WASH_ABILITY_PARAMS.totalDamage},SP`
      }
    case Ability.POWER_WHIP:
      return {
        baseDamage: `${POWER_WHIP_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        hpPercentDamage: `${Math.round(POWER_WHIP_ABILITY_PARAMS.hpDamageRatio * 100)},SP`
      }
    case Ability.PRECIPICE_BLADES:
      return {
        damage: `${PRECIPICE_BLADES_ABILITY_PARAMS.damage},SP`
      }
    case Ability.PRESENT:
      return {
        lowDamage: `${PRESENT_ABILITY_PARAMS.lowDamage},SP`,
        mediumDamage: `${PRESENT_ABILITY_PARAMS.mediumDamage},SP`,
        highDamage: `${PRESENT_ABILITY_PARAMS.highDamage},SP`,
        healAmount: PRESENT_ABILITY_PARAMS.healAmount
      }
    case Ability.PRISMATIC_LASER:
      return {
        damage: `${PRISMATIC_LASER_ABILITY_PARAMS.damage},SP`,
        beamWidthTiles: PRISMATIC_LASER_ABILITY_PARAMS.spreadRadius * 2 + 1
      }
    case Ability.PROTECT:
      return {
        protectSeconds: `${PROTECT_ABILITY_PARAMS.durationByStarMs
          .map((duration) => duration / 1000)
          .join(",")},SP=0.5`
      }
    case Ability.PSYBEAM:
      return {
        damage: `${PSYBEAM_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        confusionChance: `${PSYBEAM_ABILITY_PARAMS.confusionChance * 100}`,
        confusionSeconds: PSYBEAM_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.PSYCHIC:
      return {
        damage: `${PSYCHIC_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        ppBurn: Math.abs(PSYCHIC_ABILITY_PARAMS.ppBurn)
      }
    case Ability.PSYCHIC_FANGS:
      return {
        damage: `${PSYCHIC_FANGS_ABILITY_PARAMS.damage},SP`
      }
    case Ability.PSYCHIC_SURGE:
      return {
        shieldBuff: `${PSYCHIC_SURGE_ABILITY_PARAMS.shieldBuff},SP`
      }
    case Ability.PSYCHO_BOOST:
      return {
        damage: `${PSYCHO_BOOST_ABILITY_PARAMS.damage},SP`,
        abilityPowerLossPerHit: `${PSYCHO_BOOST_ABILITY_PARAMS.abilityPowerReductionPerHit},SP`
      }
    case Ability.PSYCHO_CUT:
      return {
        damage: `${PSYCHO_CUT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        hitCount: PSYCHO_CUT_ABILITY_PARAMS.hitCount
      }
    case Ability.PSYCHO_SHIFT:
      return {
        damage: `${PSYCHO_SHIFT_ABILITY_PARAMS.damage},SP`
      }
    case Ability.PSYSHIELD_BASH:
      return {
        damage: `${PSYSHIELD_BASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        protectSeconds: PSYSHIELD_BASH_ABILITY_PARAMS.protectDurationMs / 1000
      }
    case Ability.PSYSHOCK:
      return {
        ppBurn: `${PSYSHOCK_ABILITY_PARAMS.ppBurnByStar.join(",")}`
      }
    case Ability.PSYSTRIKE:
      return {
        damage: `${PSYSTRIKE_ABILITY_PARAMS.damage},SP`
      }
    case Ability.PUMMELING_PAYBACK:
      return {
        baseDamage: `${PUMMELING_PAYBACK_ABILITY_PARAMS.baseDamage},SP`,
        attackScalingPercent: `${Math.round(PUMMELING_PAYBACK_ABILITY_PARAMS.attackScaling * 100)},SP`,
        healAmount: `${PUMMELING_PAYBACK_ABILITY_PARAMS.healAmount},SP`
      }
    case Ability.PURIFY:
      return {
        healAmount: `${PURIFY_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.PYRO_BALL:
      return {
        damage: `${PYRO_BALL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: PYRO_BALL_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.QUIVER_DANCE:
      return {
        attackBuff: `${QUIVER_DANCE_ABILITY_PARAMS.attackBuff},SP`,
        specialDefenseBuff: `${QUIVER_DANCE_ABILITY_PARAMS.specialDefenseBuff},SP`,
        speedBuff: `${QUIVER_DANCE_ABILITY_PARAMS.speedBuff},SP`,
        abilityPowerBuff: `${QUIVER_DANCE_ABILITY_PARAMS.abilityPowerBuff},SP`
      }
    case Ability.RAGE:
      return {
        attackPercentPerMissingHpStep: `${Math.round(
          RAGE_ABILITY_PARAMS.attackBoostPerStepRatio * 100
        )},SP`,
        rageSeconds: RAGE_ABILITY_PARAMS.rageDurationMs / 1000,
        missingHpStepPercent: RAGE_ABILITY_PARAMS.missingHpStepRatio * 100
      }
    case Ability.RAGING_BULL:
      return {
        damage: `${RAGING_BULL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        armorBreakSeconds:
          RAGING_BULL_ABILITY_PARAMS.armorReductionDurationMs / 1000
      }
    case Ability.RAPID_SPIN:
      return {
        damage: `${RAPID_SPIN_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        defenseBuffPercentOfAtk: `${Math.round(
          RAPID_SPIN_ABILITY_PARAMS.defenseBuffAtkRatio * 100
        )},SP`
      }
    case Ability.RAZOR_LEAF:
      return {
        damage: `${RAZOR_LEAF_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.RECOVER:
      return {
        healPercent: `${Math.round(RECOVER_ABILITY_PARAMS.healRatio * 100)},SP`
      }
    case Ability.REFLECT:
      return {
        reflectPercent: "50,SP",
        durationSeconds: REFLECT_ABILITY_PARAMS.durationMs / 1000
      }
    case Ability.RELIC_SONG:
      return {
        shieldAmount: `${RELIC_SONG_ABILITY_PARAMS.allyShield},SP`,
        sleepSeconds: `${
          RELIC_SONG_ABILITY_PARAMS.sleepBaseDurationMs / 1000
        },SP=${RELIC_SONG_ABILITY_PARAMS.sleepScalingFactor}`
      }
    case Ability.RETALIATE:
      return {
        damagePercentOfAtk: `${Math.round(
          RETALIATE_ABILITY_PARAMS.attackDamageRatio * 100
        )},SP`,
        baseHitCount: RETALIATE_ABILITY_PARAMS.baseHitCount
      }
    case Ability.RETURN:
      return {
        damage: `${RETURN_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        abilityPowerGain: RETURN_ABILITY_PARAMS.abilityPowerGain
      }
    case Ability.ROAR:
      return {
        damage: `${ROAR_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ROAR_OF_TIME:
      return {
        speedBoost: `${ROAR_OF_TIME_ABILITY_PARAMS.speedBoost},SP`
      }
    case Ability.ROCK_ARTILLERY:
      return {
        rockCount: `${ROCK_ARTILLERY_ABILITY_PARAMS.rockCountByStar.join(",")}`,
        damage: `${ROCK_ARTILLERY_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ROCK_HEAD:
      return {
        damagePercentAtkPlusDef: `${ROCK_HEAD_ABILITY_PARAMS.damagePercentAtkPlusDef},SP`
      }
    case Ability.ROCK_SLIDE:
      return {
        damage: `${ROCK_SLIDE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.ROCK_SMASH:
      return {
        damage: `${ROCK_SMASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        armorBreakSeconds: `${ROCK_SMASH_ABILITY_PARAMS.armorBreakDurationByStar.map((ms) => ms / 1000).join(",")}`
      }
    case Ability.ROCK_TOMB:
      return {
        damage: `${ROCK_TOMB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        speedReduction: `${ROCK_TOMB_ABILITY_PARAMS.speedReductionByStar.join(",")}`
      }
    case Ability.ROCK_WRECKER:
      return {
        damage: `${ROCK_WRECKER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        flinchSeconds: ROCK_WRECKER_ABILITY_PARAMS.flinchDurationMs / 1000,
        fatigueSeconds: ROCK_WRECKER_ABILITY_PARAMS.fatigueDurationMs / 1000
      }
    case Ability.ROLLOUT:
      return {
        defenseGain: `${ROLLOUT_ABILITY_PARAMS.defenseGainByStar.join(",")},SP`,
        damageDefenseMultiplier: ROLLOUT_ABILITY_PARAMS.damageDefenseMultiplier
      }
    case Ability.ROOST:
      return {
        shieldAmount: `${ROOST_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        sleepSeconds: ROOST_ABILITY_PARAMS.sleepDurationMs / 1000
      }
    case Ability.SACRED_SWORD_CAVERN:
      return {
        baseTrueDamage: `${SACRED_SWORD_CAVERN_ABILITY_PARAMS.baseTrueDamage},SP`,
        bonusTrueDamagePerEnemyOnOwnSide: `${SACRED_SWORD_CAVERN_ABILITY_PARAMS.bonusTrueDamagePerEnemyOnOwnSide},SP`
      }
    case Ability.SACRED_SWORD_GRASS:
      return {
        baseTrueDamage: `${SACRED_SWORD_GRASS_ABILITY_PARAMS.baseTrueDamage},SP`,
        bonusTrueDamagePerRemainingAlly: `${SACRED_SWORD_GRASS_ABILITY_PARAMS.bonusTrueDamagePerRemainingAlly},SP`
      }
    case Ability.SACRED_SWORD_IRON:
      return {
        baseTrueDamage: `${SACRED_SWORD_IRON_ABILITY_PARAMS.baseTrueDamage},SP`,
        bonusTrueDamagePerFallenAlly: `${SACRED_SWORD_IRON_ABILITY_PARAMS.bonusTrueDamagePerFallenAlly},SP`
      }
    case Ability.SALT_CURE:
      return {
        shieldAmount: `${SALT_CURE_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        radius: SALT_CURE_ABILITY_PARAMS.radius,
        burnSeconds: SALT_CURE_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.SAND_SPIT:
      return {
        damage: `${SAND_SPIT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        blindSeconds: SAND_SPIT_ABILITY_PARAMS.blindDurationMs / 1000
      }
    case Ability.SAND_TOMB:
      return {
        damage: `${SAND_TOMB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        statusDurationSeconds: `${SAND_TOMB_ABILITY_PARAMS.statusDurationByStar.map((ms) => ms / 1000).join(",")}`
      }
    case Ability.SANDSEAR_STORM:
      return {
        damage: `${SANDSEAR_STORM_ABILITY_PARAMS.damage},SP`,
        burnSeconds: SANDSEAR_STORM_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.SCALE_SHOT:
      return {
        initialDamage: `${SCALE_SHOT_ABILITY_PARAMS.initialDamage},SP`,
        mainShotDamage: `${SCALE_SHOT_ABILITY_PARAMS.mainShotDamage},SP`,
        pathDamage: `${SCALE_SHOT_ABILITY_PARAMS.pathDamage},SP`,
        armorBreakSeconds:
          SCALE_SHOT_ABILITY_PARAMS.armorBreakDurationMs / 1000,
        launchDelaySeconds:
          SCALE_SHOT_ABILITY_PARAMS.scaleLaunchStartDelayMs / 1000
      }
    case Ability.SCREECH:
      return {
        defenseReduction: `${SCREECH_ABILITY_PARAMS.defenseReductionByStar.join(",")},SP`,
        radius: SCREECH_ABILITY_PARAMS.radius
      }
    case Ability.SEARING_SHOT:
      return {
        damage: `${SEARING_SHOT_ABILITY_PARAMS.damage},SP`,
        radius: SEARING_SHOT_ABILITY_PARAMS.radius,
        burnSeconds: SEARING_SHOT_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.SECRET_SWORD:
      return {
        damage: `${SECRET_SWORD_ABILITY_PARAMS.damage},SP`,
        fightingBlockThreshold:
          SECRET_SWORD_ABILITY_PARAMS.fightingBlockThresholdForTrueDamage
      }
    case Ability.SEED_FLARE:
      return {
        damage: `${SEED_FLARE_ABILITY_PARAMS.damage},SP`,
        radius: SEED_FLARE_ABILITY_PARAMS.radius,
        specialDefenseReduction:
          SEED_FLARE_ABILITY_PARAMS.specialDefenseReduction
      }
    case Ability.SEISMIC_TOSS:
      return {
        damage: `${SEISMIC_TOSS_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.SHADOW_SNEAK:
      return {
        damage: `${SHADOW_SNEAK_ABILITY_PARAMS.damage},SP`
      }
    case Ability.SHED_TAIL:
      return {
        shieldAmount: `${SHED_TAIL_ABILITY_PARAMS.shieldAmount},SP`
      }
    case Ability.SHEER_COLD:
      return {
        damage: `${SHEER_COLD_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        executeChance: `${SHEER_COLD_ABILITY_PARAMS.executeChanceByStar.join(",")},LK`
      }
    case Ability.SHELL_SIDE_ARM:
      return {
        poisonSeconds: `${SHELL_SIDE_ARM_ABILITY_PARAMS.poisonDurationByStarMs.map((ms) => ms / 1000).join(",")},SP`,
        abilityPowerGain: `${SHELL_SIDE_ARM_ABILITY_PARAMS.abilityPowerGainByStar.join(",")}`,
        additionalTargets: SHELL_SIDE_ARM_ABILITY_PARAMS.maxBounces - 1
      }
    case Ability.SHELL_SMASH:
      return {
        damage: `${SHELL_SMASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        attackBuff: SHELL_SMASH_ABILITY_PARAMS.attackBuff,
        abilityPowerBuff: SHELL_SMASH_ABILITY_PARAMS.abilityPowerBuff,
        speedBuff: SHELL_SMASH_ABILITY_PARAMS.speedBuff,
        defenseDebuff: SHELL_SMASH_ABILITY_PARAMS.defenseDebuff,
        specialDefenseDebuff: SHELL_SMASH_ABILITY_PARAMS.specialDefenseDebuff
      }
    case Ability.SHELL_TRAP:
      return {
        baseDamage: `${SHELL_TRAP_ABILITY_PARAMS.baseDamage},SP`,
        shieldGain: `${SHELL_TRAP_ABILITY_PARAMS.shieldGain},SP`
      }
    case Ability.SHELTER:
      return {
        defenseBuff: `${SHELTER_ABILITY_PARAMS.defenseBuffByStar.join(",")},SP`
      }
    case Ability.SHOCKWAVE:
      return {
        damage: `${SHOCKWAVE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        baseRange: SHOCKWAVE_ABILITY_PARAMS.baseRange,
        electricFieldBonusRange:
          SHOCKWAVE_ABILITY_PARAMS.electricFieldBonusRange,
        damageDecayPercentPerTile: Math.round(
          SHOCKWAVE_ABILITY_PARAMS.damageDecayPerTile * 100
        )
      }
    case Ability.SHORE_UP:
      return {
        healPercent: `${SHORE_UP_ABILITY_PARAMS.healRatioByStar.map((ratio) => Math.round(ratio * 100)).join(",")},SP`,
        sandstormBonusHealPercent: `${Math.round(SHORE_UP_ABILITY_PARAMS.sandstormBonusHealRatio * 100)},SP`
      }
    case Ability.SILVER_WIND:
      return {
        damage: `${SILVER_WIND_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        attackBuff: SILVER_WIND_ABILITY_PARAMS.attackBuff,
        defenseBuff: SILVER_WIND_ABILITY_PARAMS.defenseBuff,
        specialDefenseBuff: SILVER_WIND_ABILITY_PARAMS.specialDefenseBuff,
        abilityPowerBuff: SILVER_WIND_ABILITY_PARAMS.abilityPowerBuff,
        speedBuff: SILVER_WIND_ABILITY_PARAMS.speedBuff
      }
    case Ability.SING:
      return {
        targetCount: `${SING_ABILITY_PARAMS.targetCountByStar.join(",")}`,
        sleepSeconds: `${SING_ABILITY_PARAMS.baseSleepDurationMs / 1000},SP`
      }
    case Ability.SKY_ATTACK:
      return {
        damage: `${SKY_ATTACK_ABILITY_PARAMS.damage},SP`,
        castDelaySeconds: SKY_ATTACK_ABILITY_PARAMS.castDelayMs / 1000
      }
    case Ability.SKY_ATTACK_SHADOW:
      return {
        damage: `${SKY_ATTACK_SHADOW_ABILITY_PARAMS.damage},SP`,
        castDelaySeconds: SKY_ATTACK_SHADOW_ABILITY_PARAMS.castDelayMs / 1000
      }
    case Ability.SLACK_OFF:
      return {
        healPercent: `${Math.round(SLACK_OFF_ABILITY_PARAMS.healRatio * 100)},SP`,
        sleepSeconds: SLACK_OFF_ABILITY_PARAMS.sleepDurationMs / 1000
      }
    case Ability.SLASH:
      return {
        damage: `${SLASH_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        critChanceBonus: `${SLASH_ABILITY_PARAMS.critChanceBonusByStar.join(",")}`
      }
    case Ability.SLASHING_CLAW:
      return {
        damage: `${SLASHING_CLAW_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        woundSeconds: SLASHING_CLAW_ABILITY_PARAMS.woundDurationMs / 1000,
        woundDamageBonusPercent: Math.round(
          (SLASHING_CLAW_ABILITY_PARAMS.woundDamageMultiplier - 1) * 100
        )
      }
    case Ability.SMOKE_SCREEN:
      return {
        damage: `${SMOKE_SCREEN_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.SNIPE_SHOT:
      return {
        damage: `${SNIPE_SHOT_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.SOAK:
      return {
        damage: `${SOAK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        allyPpGain: SOAK_ABILITY_PARAMS.allyPpGain
      }
    case Ability.SOFT_BOILED:
      return {
        shieldAmount: `${SOFT_BOILED_ABILITY_PARAMS.shieldByStar.join(",")},SP`
      }
    case Ability.SOLAR_BEAM:
      return {
        damage: `${SOLAR_BEAM_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: SOLAR_BEAM_ABILITY_PARAMS.burnDurationMs / 1000,
        bonusDamagePercent: `${Math.round((SOLAR_BEAM_ABILITY_PARAMS.zenithOrLightDamageMultiplier - 1) * 100)},SP`,
        ppRestoreOnBoost: SOLAR_BEAM_ABILITY_PARAMS.ppRestoreOnBoost
      }
    case Ability.SOLAR_BLADE:
      return {
        damage: `${SOLAR_BLADE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        chargeSeconds: SOLAR_BLADE_ABILITY_PARAMS.chargeDelayMs / 1000,
        coneDepth: SOLAR_BLADE_ABILITY_PARAMS.coneDepth
      }
    case Ability.SONG_OF_DESIRE:
      return {
        targetCount: SONG_OF_DESIRE_ABILITY_PARAMS.targetCount,
        charmSeconds: SONG_OF_DESIRE_ABILITY_PARAMS.durationMs / 1000,
        attackReduction: `${Math.abs(SONG_OF_DESIRE_ABILITY_PARAMS.attackDebuff)},SP`
      }
    case Ability.SOUL_TRAP:
      return {
        shieldAmount: `${SOUL_TRAP_ABILITY_PARAMS.shieldAmountByStar.join(",")}`,
        ppLoss: `${SOUL_TRAP_ABILITY_PARAMS.ppLoss},SP`,
        radius: SOUL_TRAP_ABILITY_PARAMS.radius,
        fatigueSeconds: `${SOUL_TRAP_ABILITY_PARAMS.baseFatigueDurationMs / 1000},SP,ND=1`
      }
    case Ability.SPACIAL_REND:
      return {
        damage: `${SPACIAL_REND_ABILITY_PARAMS.damage},SP`
      }
    case Ability.SPARK:
      return {
        damage: `${SPARK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        maxBounces: SPARK_ABILITY_PARAMS.maxBounces
      }
    case Ability.SPARKLING_ARIA:
      return {
        damage: `${SPARKLING_ARIA_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.SPECTRAL_THIEF:
      return {
        damage: `${SPECTRAL_THIEF_ABILITY_PARAMS.damage},SP`
      }
    case Ability.SPICY_EXTRACT:
      return {
        targetCount: `${SPICY_EXTRACT_ABILITY_PARAMS.targetCountByStar.join(",")}`,
        rageSeconds: `${SPICY_EXTRACT_ABILITY_PARAMS.baseRageDurationMs / 1000},SP`
      }
    case Ability.SPIKES:
      return {
        spikeCount: `${SPIKES_ABILITY_PARAMS.baseSpikeCount},SP`,
        coneDepth: SPIKES_ABILITY_PARAMS.coneDepth,
        damage: `${SPIKES_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        spikeTrueDamagePerSecond: SPIKES_ABILITY_PARAMS.spikeTrueDamagePerSecond
      }
    case Ability.SPIKY_SHIELD:
      return {
        durationSeconds: `${SPIKY_SHIELD_ABILITY_PARAMS.durationByStarMs.map((ms) => ms / 1000).join(",")}`,
        thornDamagePercentDef: `${SPIKY_SHIELD_ABILITY_PARAMS.thornDamagePercentDefByStar.join(",")},SP`,
        woundSeconds: SPIKY_SHIELD_ABILITY_PARAMS.meleeWoundDurationMs / 1000,
        spikeDamage: `${SPIKY_SHIELD_ABILITY_PARAMS.spikeDamage},SP`
      }
    case Ability.SPIN_OUT:
      return {
        damage: `${SPIN_OUT_ABILITY_PARAMS.speedMultiplierByStar.map((multiplier) => Math.round(multiplier * 100)).join(",")},SP`,
        blindSeconds: SPIN_OUT_ABILITY_PARAMS.blindDurationMs / 1000
      }
    case Ability.SPIRIT_BREAK:
      return {
        damage: `${SPIRIT_BREAK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        abilityPowerReduction: `${SPIRIT_BREAK_ABILITY_PARAMS.abilityPowerReduction},SP`
      }
    case Ability.SPIRIT_SHACKLE:
      return {
        damage: `${SPIRIT_SHACKLE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        woundSeconds: SPIRIT_SHACKLE_ABILITY_PARAMS.woundDurationMs / 1000
      }
    case Ability.SPITE:
      return {
        ppBurn: `${SPITE_ABILITY_PARAMS.ppDrainByStar.join(",")},SP`,
        ppGain: `${SPITE_ABILITY_PARAMS.ppDrainByStar.join(",")},SP`
      }
    case Ability.SPRINGTIDE_STORM:
      return {
        damage: `${SPRINGTIDE_STORM_ABILITY_PARAMS.damage},SP`,
        charmSeconds: SPRINGTIDE_STORM_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.STATIC_SHOCK:
      return {
        damage: `${STATIC_SHOCK_ABILITY_PARAMS.damage},SP`,
        shieldPerAdjacentElectric: `${STATIC_SHOCK_ABILITY_PARAMS.shieldPerAdjacentElectric},SP`,
        healPerAdjacentFairy: `${STATIC_SHOCK_ABILITY_PARAMS.healPerAdjacentFairy},SP`
      }
    case Ability.STEALTH_ROCKS:
      return {
        coneTiles: `${STEALTH_ROCKS_ABILITY_PARAMS.coneTilesByStar.join(",")}`,
        damage: `${STEALTH_ROCKS_ABILITY_PARAMS.damage},SP`,
        boardEffectPhysicalDamagePerSecond:
          STEALTH_ROCKS_ABILITY_PARAMS.boardEffectPhysicalDamagePerSecond
      }
    case Ability.SWEET_SCENT:
      return {
        radius: SWEET_SCENT_ABILITY_PARAMS.radius,
        specialDefenseReduction: `${SWEET_SCENT_ABILITY_PARAMS.specialDefenseReduction},stat`,
        speedReduction: `${SWEET_SCENT_ABILITY_PARAMS.speedReduction},stat`,
        charmChance: `${Math.round(SWEET_SCENT_ABILITY_PARAMS.charmChance * 100)},LK`,
        charmSeconds: SWEET_SCENT_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.SWALLOW:
      return {
        healPercentPerStack: `${SWALLOW_ABILITY_PARAMS.healPercentPerStack.join(",")},LK`,
        spitUpDamage: `${SWALLOW_ABILITY_PARAMS.spitUpDamageByStar.join(",")},SP`,
        maxStacks: SWALLOW_ABILITY_PARAMS.maxStacksBeforeSpiUp,
        defenseBuff: SWALLOW_ABILITY_PARAMS.defenseBuffPerStack,
        hpThresholdPercent: SWALLOW_ABILITY_PARAMS.hpThresholdForSwallow * 100
      }
    case Ability.SUCTION_HEAL:
      return {
        damage: `${SUCTION_HEAL_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        coneDepth: SUCTION_HEAL_ABILITY_PARAMS.coneDepth,
        healPercent: SUCTION_HEAL_ABILITY_PARAMS.healTakenDamageRatio * 100
      }
    case Ability.SURGING_STRIKES:
      return {
        damagePercentOfAtk: `${Math.round(SURGING_STRIKES_ABILITY_PARAMS.damagePercentOfAtk * 100)},LK`,
        hitCount: SURGING_STRIKES_ABILITY_PARAMS.hitCount
      }
    case Ability.SWAGGER:
      return {
        rageConfusionSeconds: SWAGGER_ABILITY_PARAMS.baseDurationMs / 1000
      }
    case Ability.STORED_POWER:
      return {
        damage: `${STORED_POWER_ABILITY_PARAMS.baseDamage},SP`
      }
    case Ability.STEAMROLLER:
      return {
        damagePercentOfSpeed: `${STEAMROLLER_ABILITY_PARAMS.speedDamageMultiplierByStar.map((multiplier) => Math.round(multiplier * 100)).join(",")},SP`,
        flinchChance: `${Math.round(STEAMROLLER_ABILITY_PARAMS.flinchChance * 100)},LK`,
        flinchSeconds: STEAMROLLER_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.SUPER_HEAT:
      return {
        damagePerTick: `${SUPER_HEAT_ABILITY_PARAMS.damagePerTick},SP`,
        tickCount: SUPER_HEAT_ABILITY_PARAMS.tickCount,
        durationSeconds: Math.round(
          (SUPER_HEAT_ABILITY_PARAMS.tickCount *
            SUPER_HEAT_ABILITY_PARAMS.tickIntervalMs) /
            1000
        ),
        armorBreakSeconds: SUPER_HEAT_ABILITY_PARAMS.armorBreakDurationMs / 1000
      }
    case Ability.STRANGE_STEAM:
      return {
        confusionChance: `${Math.round(STRANGE_STEAM_ABILITY_PARAMS.confusionChance * 100)},LK`,
        rangeGainPerCast: STRANGE_STEAM_ABILITY_PARAMS.rangeGainPerCast,
        confusionSeconds:
          STRANGE_STEAM_ABILITY_PARAMS.confusionDurationMs / 1000,
        boardEffectSpecialDamagePercent:
          (STRANGE_STEAM_ABILITY_PARAMS.boardEffectSpecialDamageMultiplier -
            1) *
          100
      }
    case Ability.STRENGTH:
      return {
        statsSumMultiplier: STRENGTH_ABILITY_PARAMS.statsSumMultiplier,
        abilityPowerMultiplier: STRENGTH_ABILITY_PARAMS.abilityPowerMultiplier
      }
    case Ability.SUPERCELL_SLAM:
      return {
        damage: `${SUPERCELL_SLAM_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        shieldAmount: `${SUPERCELL_SLAM_ABILITY_PARAMS.shieldByStar.join(",")},shield`
      }
    case Ability.TACKLE:
      return {
        damage: `${TACKLE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.TAIL_GLOW:
      return {
        abilityPowerBuff: `${TAIL_GLOW_ABILITY_PARAMS.abilityPowerBuff},AP`,
        adjacentDamage: `${TAIL_GLOW_ABILITY_PARAMS.adjacentDamage},SP`
      }
    case Ability.TAIL_WHIP:
      return {
        defenseReductionPercent: `${Math.round(TAIL_WHIP_ABILITY_PARAMS.defenseReductionPercent * 100)},LK`
      }
    case Ability.TAILWIND:
      return {
        speedBoost: `${TAILWIND_ABILITY_PARAMS.speedBuffByStar.join(",")},speed`
      }
    case Ability.TAKE_HEART:
      return {
        attackBuff: `${TAKE_HEART_ABILITY_PARAMS.attackBuff},atk`,
        specialDefenseBuff: `${TAKE_HEART_ABILITY_PARAMS.specialDefenseBuff},speDef`
      }
    case Ability.TAUNT:
      return {
        shieldPercentMaxHp: `${Math.round(TAUNT_ABILITY_PARAMS.shieldMaxHpPercent * 100)},LK`
      }
    case Ability.TEA_TIME:
      return {
        healAmount: `${TEA_TIME_ABILITY_PARAMS.healByStar.join(",")},SP`
      }
    case Ability.TEETER_DANCE:
      return {
        speedBoost: `${TEETER_DANCE_ABILITY_PARAMS.speedBuff},speed`,
        confusionSeconds: TEETER_DANCE_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.TELEPORT:
      return {
        bonusDamage: `${TELEPORT_ABILITY_PARAMS.bonusDamageByStar.join(",")},SP`
      }
    case Ability.TERRAIN_PULSE:
      return {
        grassFieldHealPercent: `${TERRAIN_PULSE_ABILITY_PARAMS.grassFieldHealPercentByStar.map((v) => Math.round(v * 100)).join(",")},LK`,
        electricFieldSpeed: `${TERRAIN_PULSE_ABILITY_PARAMS.electricFieldSpeedBuffByStar.join(",")},speed`,
        psychicFieldPp: `${TERRAIN_PULSE_ABILITY_PARAMS.psychicFieldPpGainByStar.join(",")},PP`,
        fairyFieldShieldPercent: `${TERRAIN_PULSE_ABILITY_PARAMS.fairyFieldShieldPercentByStar.map((v) => Math.round(v * 100)).join(",")},LK`
      }
    case Ability.THIEF:
      return {
        damage: `${THIEF_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.THOUSAND_ARROWS:
      return {
        damage: `${THOUSAND_ARROWS_ABILITY_PARAMS.damage},SP`,
        projectileCount: THOUSAND_ARROWS_ABILITY_PARAMS.projectileCount,
        lockSeconds: THOUSAND_ARROWS_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.THRASH:
      return {
        attackBuffPercent: THRASH_ABILITY_PARAMS.attackBuffPercent,
        confusionSeconds: THRASH_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.THUNDER:
      return {
        damage: `${THUNDER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisChance: `${Math.round(THUNDER_ABILITY_PARAMS.paralysisChance * 100)},LK`,
        targetCount: THUNDER_ABILITY_PARAMS.targetCount,
        paralysisDurationSeconds:
          THUNDER_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.THUNDER_CAGE:
      return {
        damage: `${THUNDER_CAGE_ABILITY_PARAMS.damage},SP`,
        statusSeconds: THUNDER_CAGE_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.THUNDER_FANG:
      return {
        damage: `${THUNDER_FANG_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: THUNDER_FANG_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.THUNDER_SHOCK:
      return {
        damage: `${THUNDER_SHOCK_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.THUNDEROUS_KICK:
      return {
        defenseReduction: `${THUNDEROUS_KICK_ABILITY_PARAMS.defenseDebuff},def`,
        pathPhysicalDamage: `${THUNDEROUS_KICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        flinchSeconds: THUNDEROUS_KICK_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.TICKLE:
      return {
        targetCount: `${TICKLE_ABILITY_PARAMS.maxTargetsByStar.join(",")},n`,
        statReduction: `${TICKLE_ABILITY_PARAMS.attackReduction},stat`
      }
    case Ability.TOPSY_TURVY:
      return {
        damage: `${TOPSY_TURVY_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.TORCH_SONG:
      return {
        flameCount: `${TORCH_SONG_ABILITY_PARAMS.baseFlameCount},SP`,
        burnChance: `${Math.round(TORCH_SONG_ABILITY_PARAMS.burnChance * 100)},LK`,
        apGainPerFlame: `${TORCH_SONG_ABILITY_PARAMS.apGainPerFlameByStar.join(",")},AP`,
        damagePercentOfAtk: TORCH_SONG_ABILITY_PARAMS.damagePercentOfAtk * 100,
        burnSeconds: TORCH_SONG_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.TRANSE:
      return {
        healPercent: `${Math.round(TRANSE_ABILITY_PARAMS.healPercent * 100)},LK`
      }
    case Ability.TRI_ATTACK:
      return {
        damage: `${TRI_ATTACK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        freezeSeconds: TRI_ATTACK_ABILITY_PARAMS.freezeDurationMs / 1000,
        burnSeconds: TRI_ATTACK_ABILITY_PARAMS.burnDurationMs / 1000,
        paralysisSeconds: TRI_ATTACK_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.TRICK_OR_TREAT:
      return {
        magikarpSeconds: TRICK_OR_TREAT_ABILITY_PARAMS.magikarpDurationMs / 1000
      }
    case Ability.TRIMMING_MOWER:
      return {
        healAmount: `${TRIMMING_MOWER_ABILITY_PARAMS.healAmount},SP`,
        damage: `${TRIMMING_MOWER_ABILITY_PARAMS.damage},SP`,
        dashRange: TRIMMING_MOWER_ABILITY_PARAMS.dashRange
      }
    case Ability.TRIPLE_DIVE:
      return {
        damage: `${TRIPLE_DIVE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        targetCount: TRIPLE_DIVE_ABILITY_PARAMS.maxTargets
      }
    case Ability.TRIPLE_KICK:
      return {
        damage: `${TRIPLE_KICK_ABILITY_PARAMS.damage},SP`,
        maxTargets: TRIPLE_KICK_ABILITY_PARAMS.maxTargets
      }
    case Ability.TROP_KICK:
      return {
        damage: `${TROP_KICK_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        atkDebuff: `${TROP_KICK_ABILITY_PARAMS.atkDebuffByStar.join(",")},atk`
      }
    case Ability.TWIN_BEAM:
      return {
        damage: `${TWIN_BEAM_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.TWINEEDLE:
      return {
        damage: `${TWINEEDLE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        poisonChance: `${Math.round(TWINEEDLE_ABILITY_PARAMS.poisonChance * 100)},LK`,
        poisonSeconds: TWINEEDLE_ABILITY_PARAMS.poisonDurationMs / 1000
      }
    case Ability.TWISTER:
      return {
        damage: `${TWISTER_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        flyRange: `${TWISTER_ABILITY_PARAMS.flyRangeByStar.join(",")},tiles`
      }
    case Ability.U_TURN:
      return {
        shield: `${U_TURN_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        charmSeconds: U_TURN_ABILITY_PARAMS.charmDurationMs / 1000
      }
    case Ability.ULTRA_THRUSTERS:
      return {
        damage: `${ULTRA_THRUSTERS_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        burnSeconds: ULTRA_THRUSTERS_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.UNBOUND:
      return {
        atkBuff: `${UNBOUND_ABILITY_PARAMS.atkBuff},atk`,
        hpBuff: `${UNBOUND_ABILITY_PARAMS.hpBuff},hp`
      }
    case Ability.UPROAR:
      return {
        damage: `${UPROAR_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        durationSeconds:
          (UPROAR_ABILITY_PARAMS.tickIntervalMs *
            UPROAR_ABILITY_PARAMS.tickCount) /
          1000
      }
    case Ability.VENOSHOCK:
      return {
        damage: `${VENOSHOCK_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.VICTORY_DANCE:
      return {
        statBuff: `${VICTORY_DANCE_ABILITY_PARAMS.atkBuff},SP`,
        speedBuff: `${VICTORY_DANCE_ABILITY_PARAMS.speedBuff},SP`
      }
    case Ability.VINE_WHIP:
      return {
        damage: `${VINE_WHIP_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: VINE_WHIP_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.VISE_GRIP:
      return {
        damage: `${VISE_GRIP_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        defAbsorption: `${VISE_GRIP_ABILITY_PARAMS.defAbsorptionRatio * 100},pct`,
        lockSeconds: VISE_GRIP_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.VOLT_SURGE:
      return {
        hpBuff: `${VOLT_SURGE_ABILITY_PARAMS.hpBuff},SP`,
        speedBuff: `${VOLT_SURGE_ABILITY_PARAMS.speedBuff},SP`,
        chainDamage: `${VOLT_SURGE_ABILITY_PARAMS.chainDamage},SP`,
        chainTargetCount: VOLT_SURGE_ABILITY_PARAMS.chainTargetCount,
        triggerEveryAttacks: VOLT_SURGE_ABILITY_PARAMS.triggerEveryAttacks
      }
    case Ability.VOLT_SWITCH:
      return {
        damage: `${VOLT_SWITCH_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.WATER_PULSE:
      return {
        damage: `${WATER_PULSE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        confusionSeconds: WATER_PULSE_ABILITY_PARAMS.confusionDurationMs / 1000
      }
    case Ability.WATER_SHURIKEN:
      return {
        damage: `${WATER_SHURIKEN_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        shurikenCount: WATER_SHURIKEN_ABILITY_PARAMS.shurikenCount,
        directionCount: WATER_SHURIKEN_ABILITY_PARAMS.directionCount
      }
    case Ability.WATERFALL:
      return {
        shield: `${WATERFALL_ABILITY_PARAMS.shieldByStar.join(",")},SP`
      }
    case Ability.WAVE_SPLASH:
      return {
        shieldPercent: `${Math.round(WAVE_SPLASH_ABILITY_PARAMS.shieldRatio * 100)},SP`,
        damagePercent: `${Math.round(WAVE_SPLASH_ABILITY_PARAMS.damageRatio * 100)},SP`
      }
    case Ability.WHEEL_OF_FIRE:
      return {
        damage: `${WHEEL_OF_FIRE_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.WHIRLPOOL:
      return {
        damagePercent: `${Math.round(WHIRLPOOL_ABILITY_PARAMS.attackMultiplierPerHit * 100)},SP`,
        hitCount: WHIRLPOOL_ABILITY_PARAMS.hitCount
      }
    case Ability.WHIRLWIND:
      return {
        damage: `${WHIRLWIND_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.WICKED_BLOW:
      return {
        damage: `${WICKED_BLOW_ABILITY_PARAMS.damage},SP`
      }
    case Ability.WILDBOLT_STORM:
      return {
        damage: `${WILDBOLT_STORM_ABILITY_PARAMS.damage},SP`,
        paralysisSeconds:
          WILDBOLT_STORM_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.WISE_YAWN:
      return {
        shield: `${WISE_YAWN_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        fatigueSeconds: WISE_YAWN_ABILITY_PARAMS.fatigueDurationMs / 1000,
        abilityPowerReduction: WISE_YAWN_ABILITY_PARAMS.abilityPowerReduction
      }
    case Ability.WISH:
      return {
        shield: `${WISH_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        protectSeconds: WISH_ABILITY_PARAMS.protectDurationMs / 1000
      }
    case Ability.WONDER_GUARD:
      return {
        damage: `${WONDER_GUARD_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: WONDER_GUARD_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.WONDER_ROOM:
      return {
        durationSeconds: WONDER_ROOM_ABILITY_PARAMS.durationMs / 1000
      }
    case Ability.WOOD_HAMMER:
      return {
        damagePercent: `${Math.round(WOOD_HAMMER_ABILITY_PARAMS.damageMultiplier * 100)},SP`,
        recoilPercent: WOOD_HAMMER_ABILITY_PARAMS.recoilMultiplier * 100
      }
    case Ability.X_SCISSOR:
      return {
        damage: `${X_SCISSOR_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        hitCount: X_SCISSOR_ABILITY_PARAMS.hitCount
      }
    case Ability.YAWN:
      return {
        shield: `${YAWN_ABILITY_PARAMS.shieldByStar.join(",")},SP`,
        fatigueSeconds: YAWN_ABILITY_PARAMS.fatigueDurationMs / 1000,
        abilityPowerReduction: YAWN_ABILITY_PARAMS.abilityPowerReduction
      }
    case Ability.ZAP_CANNON:
      return {
        damage: `${ZAP_CANNON_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        statusDurationSeconds: ZAP_CANNON_ABILITY_PARAMS.statusDurationByStarMs
          .map((v) => v / 1000)
          .join(",")
      }
    case Ability.ZING_ZAP:
      return {
        damage: `${ZING_ZAP_ABILITY_PARAMS.damage},SP`,
        shieldIfParalyzed: `${ZING_ZAP_ABILITY_PARAMS.shieldIfParalyzed},SP`,
        flinchSeconds: ZING_ZAP_ABILITY_PARAMS.flinchDurationMs / 1000
      }
    case Ability.TIME_TRAVEL:
      return {
        healAmount: `${TIME_TRAVEL_ABILITY_PARAMS.allyHeal},SP`
      }
    case Ability.STEEL_WING:
      return {
        damage: `${STEEL_WING_ABILITY_PARAMS.baseDamageByStar.join(",")},SP`,
        defenseScalingPercent: `${Math.round(STEEL_WING_ABILITY_PARAMS.defenseDamageMultiplier * 100)},SP`,
        defenseSteal: STEEL_WING_ABILITY_PARAMS.defenseSteal
      }
    case Ability.STICKY_WEB:
      return {
        damage: `${STICKY_WEB_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds:
          STICKY_WEB_ABILITY_PARAMS.boardEffectParalysisDurationMs / 1000
      }
    case Ability.STOCKPILE:
      return {
        hpGain: `${STOCKPILE_ABILITY_PARAMS.maxHpGainPerCast},SP`,
        speedLossPerCast: STOCKPILE_ABILITY_PARAMS.speedLossPerCast,
        castsBeforeSpitUp: STOCKPILE_ABILITY_PARAMS.maxStacksBeforeSpitUp,
        spitUpDamagePercent: STOCKPILE_ABILITY_PARAMS.spitUpDamageRatio * 100
      }
    case Ability.STRING_SHOT:
      return {
        damage: `${STRING_SHOT_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: STRING_SHOT_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.STRUGGLE_BUG:
      return {
        damage: `${STRUGGLE_BUG_ABILITY_PARAMS.damage},SP`,
        abilityPowerReduction: `${STRUGGLE_BUG_ABILITY_PARAMS.abilityPowerReduction},AP`
      }
    case Ability.STUN_SPORE:
      return {
        damage: `${STUN_SPORE_ABILITY_PARAMS.damageByStar.join(",")},SP`,
        paralysisSeconds: STUN_SPORE_ABILITY_PARAMS.paralysisDurationMs / 1000
      }
    case Ability.SUNSTEEL_STRIKE:
      return {
        damage: `${SUNSTEEL_STRIKE_ABILITY_PARAMS.damage},SP`
      }
    case Ability.SUPER_FANG:
      return {
        maxHpDamagePercent: `${Math.round(SUPER_FANG_ABILITY_PARAMS.maxHpDamagePercent * 100)},LK`
      }
    case Ability.SURF:
      return {
        damage: `${SURF_ABILITY_PARAMS.damageByStar.join(",")},SP`
      }
    case Ability.SYRUP_BOMB:
      return {
        damage: `${SYRUP_BOMB_ABILITY_PARAMS.damage},SP`,
        speedReduction: `${SYRUP_BOMB_ABILITY_PARAMS.speedDebuff},SP`
      }
    case Ability.HIDDEN_POWER_A:
      return {
        summonedCount: `${HIDDEN_POWER_A_ABILITY_PARAMS.summonedCount}`
      }
    case Ability.HIDDEN_POWER_B:
      return {
        burnDurationSec: HIDDEN_POWER_B_ABILITY_PARAMS.burnDurationMs / 1000
      }
    case Ability.HIDDEN_POWER_C:
      return {}
    case Ability.HIDDEN_POWER_D:
      return {}
    case Ability.HIDDEN_POWER_E:
      return {}
    case Ability.HIDDEN_POWER_F:
      return {
        fishCount: `${HIDDEN_POWER_F_ABILITY_PARAMS.fishCount}`
      }
    case Ability.HIDDEN_POWER_G:
      return {
        goldAmount: HIDDEN_POWER_G_ABILITY_PARAMS.goldAmount
      }
    case Ability.HIDDEN_POWER_H:
      return {}
    case Ability.HIDDEN_POWER_I:
      return {}
    case Ability.HIDDEN_POWER_J:
      return {
        sharpedoCount: `${HIDDEN_POWER_J_ABILITY_PARAMS.sharpedoCount}`
      }
    case Ability.HIDDEN_POWER_K:
      return {}
    case Ability.HIDDEN_POWER_L:
      return {
        lockDurationSec: HIDDEN_POWER_L_ABILITY_PARAMS.lockDurationMs / 1000
      }
    case Ability.HIDDEN_POWER_M:
      return {}
    case Ability.HIDDEN_POWER_O:
      return {}
    case Ability.HIDDEN_POWER_P:
      return {
        bugCount: `${HIDDEN_POWER_P_ABILITY_PARAMS.bugCount}`
      }
    case Ability.HIDDEN_POWER_Q:
      return {}
    case Ability.HIDDEN_POWER_QM:
      return {
        unownCount: `${HIDDEN_POWER_QM_ABILITY_PARAMS.unownCount}`
      }
    case Ability.HIDDEN_POWER_R:
      return {
        freeRerolls: HIDDEN_POWER_R_ABILITY_PARAMS.freeRerolls
      }
    case Ability.HIDDEN_POWER_S:
      return {
        healPercent: HIDDEN_POWER_S_ABILITY_PARAMS.healPercent,
        maxHpTrueDamagePercent:
          HIDDEN_POWER_S_ABILITY_PARAMS.maxHpTrueDamagePercent
      }
    case Ability.HIDDEN_POWER_T:
      return {
        berryCount: `${HIDDEN_POWER_T_ABILITY_PARAMS.berryCount}`
      }
    case Ability.HIDDEN_POWER_U:
      return {}
    case Ability.HIDDEN_POWER_V:
      return {}
    case Ability.HIDDEN_POWER_W:
      return {
        topSynergyCount: HIDDEN_POWER_W_ABILITY_PARAMS.topSynergyCount
      }
    case Ability.HIDDEN_POWER_X:
      return {}
    case Ability.HIDDEN_POWER_Y:
      return {
        attackBoostPercent: HIDDEN_POWER_Y_ABILITY_PARAMS.attackBoostPercent
      }
    case Ability.HIDDEN_POWER_Z:
      return {
        freezeDurationSec: HIDDEN_POWER_Z_ABILITY_PARAMS.freezeDurationMs / 1000
      }
    case Ability.HIDDEN_POWER_EM:
      return {
        summonedCount: `${HIDDEN_POWER_EM_ABILITY_PARAMS.summonedCount}`
      }
    default:
      return {}
  }
}
