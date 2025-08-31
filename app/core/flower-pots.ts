import Player from "../models/colyseus-models/player"
import { EffectEnum } from "../types/enum/Effect"
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

export function getFlowerPotsUnlocked(player: Player): FlowerPot[] {
    return player.flowerPotsSpawnOrder.filter(pot => {
        if (player.effects.has(EffectEnum.COTTONWEED)) return pot === FlowerPot.PINK
        if (player.effects.has(EffectEnum.FLYCATCHER)) return [FlowerPot.PINK, FlowerPot.YELLOW].includes(pot)
        if (player.effects.has(EffectEnum.FRAGRANT)) return [FlowerPot.PINK, FlowerPot.YELLOW, FlowerPot.WHITE].includes(pot)
        if (player.effects.has(EffectEnum.FLOWER_POWER)) return [FlowerPot.PINK, FlowerPot.YELLOW, FlowerPot.WHITE, FlowerPot.BLUE].includes(pot) || (
            player.flowerPots.every(pot => pot.evolution === Pkm.DEFAULT) && pot === FlowerPot.ORANGE
        )
    })
}

export function getFlowerMonByPot(pot: FlowerPot): Pkm[] {
    return FlowerMonByPot[pot] || []
}

export const FlowerPotMons: Pkm[] = Object.values(FlowerMonByPot).flat()

export const MulchStockCaps = [
    5,
    8, // 13
    11, // 24
    15, // 39
    20, // 59
    27, // 86
    36, // 122
    50 // 172
]