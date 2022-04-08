export enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
    MYTHICAL,
    NEUTRAL,
    SUMMON
}

export enum GamePhaseState {
    PICK,
    FIGHT
}

export enum PokemonActionState {
    MOVING,
    ATTACKING
}

export enum Orientation {
    DOWNLEFT,
    LEFT,
    UPLEFT,
    UP,
    UPRIGHT,
    RIGHT,
    DOWNRIGHT,
    DOWN,
    UNCLEAR
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

export enum BattleResults {
    WIN,
    DEFEAT,
    DRAW
}

export enum BotDifficulty {
    EASY,
    MEDIUM,
    HARD
}