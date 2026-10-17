import { Rarity } from "../../types/enum/Game"

export const BOTS_ENABLED = true

export const ALLOWED_GAME_RECONNECTION_TIME = 60 * 5 // 5 minutes

export const MAX_SPEED = 300
export const CC_COOLDOWN = 1500

export const STARTER_RARITY_WEIGHTS = {
  [Rarity.COMMON]: 0.7,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.1
}
