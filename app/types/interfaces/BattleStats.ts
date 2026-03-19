export type BattleStat = keyof BattleStats

export interface BattleStats {
  maxHP: number
  maxAttack: number
  maxDefense: number
  maxAP: number
  maxSpecialDefense: number
  maxSpeed: number
  maxPhysicalDamage: number
  maxSpecialDamage: number
  maxTrueDamage: number
  maxShield: number
  maxHeal: number
  maxWinStreak: number
}

export const initialBattleStats: BattleStats = {
  maxHP: 0,
  maxAttack: 0,
  maxDefense: 0,
  maxAP: 0,
  maxSpecialDefense: 0,
  maxSpeed: 0,
  maxPhysicalDamage: 0,
  maxSpecialDamage: 0,
  maxTrueDamage: 0,
  maxShield: 0,
  maxHeal: 0,
  maxWinStreak: 0
}

export const BattleStatsList = Object.keys(initialBattleStats) as BattleStat[]
