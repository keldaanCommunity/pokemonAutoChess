export interface GameStats {
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
  dittosUsed: number
  rerollCount: number
  totalMoneyEarned: number
  totalPlayerDamageDealt: number
}

export type GameStat = keyof GameStats

export const initialGameStats: GameStats = {
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
  maxWinStreak: 0,
  dittosUsed: 0,
  rerollCount: 0,
  totalMoneyEarned: 0,
  totalPlayerDamageDealt: 0
}

export const GameStatsList = Object.keys(initialGameStats) as GameStat[]
