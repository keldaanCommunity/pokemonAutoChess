/**
 * Configuration for step-mode training.
 * Games run synchronously with no real-time waiting.
 */

// Number of bot opponents in training games
export const TRAINING_NUM_OPPONENTS = 7

// Max actions the RL agent can take per PICK phase before auto-advancing
export const TRAINING_MAX_ACTIONS_PER_TURN = 30

// Delta time (ms) per simulation sub-step during FIGHT phase
export const TRAINING_SIMULATION_DT = 50

// Max simulation steps per fight before force-finishing (safety cap)
export const TRAINING_MAX_FIGHT_STEPS = 2000

// Observation space dimensions
export const OBS_PLAYER_STATS = 8 // life, money, level, streak, interest, alive, rank, boardSize
export const OBS_SHOP_SLOTS = 5 // 5 shop slots, each encoded as pokemon index
export const OBS_BOARD_SLOTS = 40 // 8 bench + 32 board cells (4x8), each pokemon encoded as (index, stars, rarity)
export const OBS_BOARD_FEATURES_PER_SLOT = 3 // index, stars, rarity
export const OBS_SYNERGIES = 32 // 32 synergy types
export const OBS_GAME_INFO = 3 // stageLevel, phase, playersAlive
export const OBS_OPPONENT_STATS = 16 // 2 features per opponent (life, rank) * 8 max opponents

export const TOTAL_OBS_SIZE =
  OBS_PLAYER_STATS +
  OBS_SHOP_SLOTS +
  OBS_BOARD_SLOTS * OBS_BOARD_FEATURES_PER_SLOT +
  OBS_SYNERGIES +
  OBS_GAME_INFO +
  OBS_OPPONENT_STATS

// Action space
export enum TrainingAction {
  END_TURN = 0, // End pick phase, advance to fight
  BUY_0 = 1,
  BUY_1 = 2,
  BUY_2 = 3,
  BUY_3 = 4,
  BUY_4 = 5,
  SELL_0 = 6, // Sell pokemon at bench position 0
  SELL_1 = 7,
  SELL_2 = 8,
  SELL_3 = 9,
  SELL_4 = 10,
  SELL_5 = 11,
  SELL_6 = 12,
  SELL_7 = 13,
  REROLL = 14,
  LEVEL_UP = 15
}

export const TOTAL_ACTIONS = 16

// Reward shaping
export const REWARD_PER_WIN = 0.5
export const REWARD_PER_LOSS = -0.3
export const REWARD_PER_DRAW = 0.0
export const REWARD_PER_KILL = -2.0 // penalty when agent dies
export const REWARD_PLACEMENT_SCALE = 2.0 // final reward = (9 - rank) * scale - offset
export const REWARD_PLACEMENT_OFFSET = 6.0

// HTTP server port for training API
export const TRAINING_API_PORT = parseInt(process.env.TRAINING_PORT ?? "9100")
