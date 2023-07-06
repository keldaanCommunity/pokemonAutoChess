export enum Rarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
  MYTHICAL = "MYTHICAL",
  HATCH = "HATCH",
  SPECIAL = "SPECIAL"
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
  HURT = "Hurt",
  FISH = "Fish"
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

export enum Stat {
  ATK = "ATK",
  ATK_SPEED = "ATK_SPEED",
  DEF = "DEF",
  SPE_DEF = "SPE_DEF",
  HP = "HP",
  RANGE = "RANGE",
  MANA = "MANA",
  MAX_MANA = "MAX_MANA",
  CRIT_CHANCE = "CRIT_CHANCE",
  CRIT_DAMAGE = "CRIT_DAMAGE",
  AP = "AP",
  SHIELD = "SHIELD"
}

export enum Damage {
  PHYSICAL = "PHYSICAL",
  SPECIAL = "SPECIAL",
  TRUE = "TRUE"
}

export enum Team {
  BLUE_TEAM,
  RED_TEAM
}

export enum BoardEvent {
  LIGHTNING = "LIGHTNING",
}
