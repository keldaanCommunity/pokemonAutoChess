export enum Rarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
  MYTHICAL = "MYTHICAL",
  NEUTRAL = "NEUTRAL",
  SUMMON = "SUMMON"
}

export enum GamePhaseState {
  PICK,
  FIGHT
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
  EXTREME
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
  ATK_SPEED = "atkSpeed",
  DEF = "def",
  SPE_DEF = "speDef",
  HP = "hp",
  RANGE = "range",
  MANA = "mana",
  CRIT_CHANCE = "critChance",
  CRIT_DAMAGE = "critDamage",
  SPELL_POWER = "spellDamage",
  SHIELD = "shield"
}