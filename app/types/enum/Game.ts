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
    SLEEP = "Sleep"
}

export enum Orientation {
    DOWN = "0",
    DOWNLEFT = "7",
    LEFT = "6",
    UPLEFT = "5",
    UP = "4",
    UPRIGHT = "3",
    RIGHT = "2",
    DOWNRIGHT = "1",
    UNCLEAR = "-1"
}

// export enum OrientationRad {
//     DOWNLEFT = 5 * Math.PI * 0.25,
//     LEFT: Math.PI,
//     UPLEFT: 3 * Math.PI * 0.25,
//     UP: Math.PI * 0.5,
//     UPRIGHT: Math.PI * 0.25,
//     RIGHT: 0,
//     DOWNRIGHT: 7 * Math.PI * 0.25,
//     DOWN: 3 * Math.PI * 0.5,
//     UNCLEAR: 0
//   }

export enum AttackType {
    PHYSICAL,
    SPECIAL,
    TRUE
}

export enum BattleResult {
    WIN,
    DEFEAT,
    DRAW
}

export enum BotDifficulty {
    EASY,
    MEDIUM,
    HARD
}

export enum PokemonTint {
    NORMAL = "Normal",
    SHINY = "Shiny"
  }
  
  export enum SpriteType {
    ANIM = "Anim",
    SHADOW = "Shadow"
  }