export enum Rarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
  MYTHICAL = "MYTHICAL",
  NEUTRAL = "NEUTRAL",
  SUMMON = "SUMMON",
  HATCH = "HATCH"
}

export enum GamePhaseState {
  PICK,
  FIGHT,
  MINIGAME
}

export enum PokemonActionState {
  IDLE = "Idle",
  ATTACK = "Attack",
  WALK = "Walk",
  SLEEP = "Sleep",
  HOP = "Hop",
  HURT = "Hurt"
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
  WIN,
  DEFEAT,
  DRAW
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

export enum Climate {
  NEUTRAL = "NEUTRAL",
  RAIN = "RAIN",
  SUN = "SUN",
  SANDSTORM = "SANDSTORM",
  SNOW = "SNOW"
}

export enum Stat {
  ATK = "atk",
  ATK_SPEED = "speed",
  DEF = "def",
  SPE_DEF = "speDef",
  HP = "hp",
  RANGE = "range",
  MANA = "mana",
  MAX_MANA = "maxMana",
  CRIT_CHANCE = "critChance",
  CRIT_DAMAGE = "critDamage",
  AP = "ap",
  SHIELD = "shield"
}

export enum Damage {
  PHYSICAL = "PHYSICAL",
  SPECIAL = "SPECIAL",
  TRUE = "TRUE"
}
