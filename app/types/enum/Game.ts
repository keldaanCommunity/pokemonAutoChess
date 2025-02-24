export enum Rarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  ULTRA = "ULTRA",
  UNIQUE = "UNIQUE",
  LEGENDARY = "LEGENDARY",
  HATCH = "HATCH",
  SPECIAL = "SPECIAL"
}

export enum GameMode {
  CUSTOM_LOBBY = "CUSTOM_LOBBY",
  QUICKPLAY = "QUICKPLAY",
  RANKED = "RANKED",
  SCRIBBLE = "SCRIBBLE",
  TOURNAMENT = "TOURNAMENT"
}

export enum GamePhaseState {
  PICK,
  FIGHT,
  TOWN
}

export enum PokemonActionState {
  IDLE = "Idle",
  ATTACK = "Attack",
  WALK = "Walk",
  SLEEP = "Sleep",
  HOP = "Hop",
  HURT = "Hurt",
  FISH = "Fish",
  EMOTE = "Emote",
  EAT = "Eat"
}

export enum Orientation {
  DOWN = "0",
  DOWNLEFT = "7",
  LEFT = "6",
  UPLEFT = "5",
  UP = "4",
  UPRIGHT = "3",
  RIGHT = "2",
  DOWNRIGHT = "1"
}

export const OrientationFlip: { [key in Orientation]: Orientation } = {
  [Orientation.DOWN]: Orientation.UP,
  [Orientation.DOWNLEFT]: Orientation.UPLEFT,
  [Orientation.LEFT]: Orientation.LEFT,
  [Orientation.UPLEFT]: Orientation.DOWNLEFT,
  [Orientation.UP]: Orientation.DOWN,
  [Orientation.UPRIGHT]: Orientation.DOWNRIGHT,
  [Orientation.RIGHT]: Orientation.RIGHT,
  [Orientation.DOWNRIGHT]: Orientation.UPRIGHT
}

export enum AttackType {
  PHYSICAL,
  SPECIAL,
  TRUE
}

export enum HealType {
  SHIELD,
  HEAL
}

export enum BattleResult {
  WIN = "WIN",
  DEFEAT = "DEFEAT",
  DRAW = "DRAW"
}

export enum BotDifficulty {
  EASY,
  MEDIUM,
  HARD,
  EXTREME,
  CUSTOM
}

export enum PokemonTint {
  NORMAL = "Normal",
  SHINY = "Shiny"
}

export enum SpriteType {
  ANIM = "Anim",
  SHADOW = "Shadow"
}

export enum Stat {
  ATK = "ATK",
  SPEED = "SPEED",
  DEF = "DEF",
  SPE_DEF = "SPE_DEF",
  HP = "HP",
  RANGE = "RANGE",
  PP = "PP",
  MAX_PP = "MAX_PP",
  CRIT_CHANCE = "CRIT_CHANCE",
  CRIT_POWER = "CRIT_POWER",
  AP = "AP",
  SHIELD = "SHIELD",
  LUCK = "LUCK"
}

export enum Damage {
  PHYSICAL = "PHYSICAL",
  SPECIAL = "SPECIAL",
  TRUE = "TRUE"
}

export enum Team {
  BLUE_TEAM = 0,
  RED_TEAM = 1
}
