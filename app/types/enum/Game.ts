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

export enum State {
    PICK,
    FIGHT
}

export enum PokemonState {
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

export const ORIENTATION_RAD = Object.freeze({
    DOWNLEFT: 5 * Math.PI / 4,
    LEFT: Math.PI,
    UPLEFT: 3 * Math.PI / 4,
    UP: Math.PI / 2,
    UPRIGHT: Math.PI / 4,
    RIGHT: 0,
    DOWNRIGHT: 7 * Math.PI / 4,
    DOWN: 3 * Math.PI / 2,
    UNCLEAR: 0
  });

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