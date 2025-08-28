import { Pkm } from "../types/enum/Pokemon"

export const FLOWER_POTS_POSITIONS = [
    [432, 614],
    [400, 566],
    [368, 614],
    [336, 566],
    [304, 614]
]

export enum FlowerPot {
    PINK = "PINK",
    YELLOW = "YELLOW",
    WHITE = "WHITE",
    BLUE = "BLUE",
    ORANGE = "ORANGE"
}

export const FlowerPots = [
    FlowerPot.PINK,
    FlowerPot.YELLOW,
    FlowerPot.WHITE,
    FlowerPot.BLUE,
    FlowerPot.ORANGE
] as const

export const FlowerMonByPot: Record<FlowerPot, Pkm[]> = {
    [FlowerPot.PINK]: [Pkm.HOPPIP, Pkm.SKIPLOOM, Pkm.JUMPLUFF],
    [FlowerPot.YELLOW]: [Pkm.BELLSPROUT, Pkm.WEEPINBELL, Pkm.VICTREEBEL],
    [FlowerPot.WHITE]: [Pkm.CHIKORITA, Pkm.BAYLEEF, Pkm.MEGANIUM],
    [FlowerPot.BLUE]: [Pkm.ODDISH, Pkm.GLOOM, Pkm.VILEPLUME],
    [FlowerPot.ORANGE]: [Pkm.BELLOSSOM]
}

export const FlowerPotMons: Pkm[] = Object.values(FlowerMonByPot).flat()