import { SynergyEffects } from "../../models/effects"
import { Title } from "../../types"
import { BOARD_WIDTH } from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { OnAbilityCastEffect, OnAttackEffect, OnKillEffect, OnSpawnEffect } from "./effect"

export class MonsterKillEffect extends OnKillEffect {
    hpBoosted: number = 0
    count: number = 0
    synergyLevel: number
    constructor(effect: EffectEnum) {
        super(undefined, effect)
        this.synergyLevel = SynergyEffects[Synergy.MONSTER].indexOf(effect)
    }

    apply(pokemon, target, board, attackType) {
        const attackBoost = [3, 6, 10, 10][this.synergyLevel] ?? 10
        const apBoost = [10, 20, 30, 30][this.synergyLevel] ?? 30
        const hpGain = [0.2, 0.4, 0.6, 0.6][this.synergyLevel] ?? 0.6
        const lifeBoost = hpGain * target.hp
        pokemon.addAttack(attackBoost, pokemon, 0, false)
        pokemon.addAbilityPower(apBoost, pokemon, 0, false)
        pokemon.addMaxHP(lifeBoost, pokemon, 0, false)
        this.hpBoosted += lifeBoost
        this.count += 1
        if (pokemon.items.has(Item.BERSERK_GENE)) {
            pokemon.status.triggerConfusion(3000, pokemon, pokemon)
        }
    }
}

export class GroundHoleEffect extends OnSpawnEffect {
    constructor(effect: EffectEnum) {
        const synergyLevel = SynergyEffects[Synergy.GROUND].indexOf(effect) + 1
        super((pokemon, player) => {
            const index = pokemon.positionY * BOARD_WIDTH + pokemon.positionX
            const holeLevel = player?.groundHoles[index] ?? 0
            let defBuff = holeLevel * [0, 1, 2, 3, 3][synergyLevel]
            let atkBuff = holeLevel === 5 ? [0, 3, 5, 8][synergyLevel] : 0
            if (synergyLevel === 4) {
                const nbFullyDugHoles = player?.groundHoles.filter(hole => hole === 4).length ?? 0
                defBuff += nbFullyDugHoles
                if (nbFullyDugHoles === 3 * 8) {
                    atkBuff += 12
                    player?.titles.add(Title.MOLE)
                }
            }

            pokemon.addAttack(atkBuff, pokemon, 0, false)
            pokemon.addDefense(defBuff, pokemon, 0, false)
            pokemon.addSpecialDefense(defBuff, pokemon, 0, false)
            pokemon.broadcastAbility({ skill: "GROUND_GROW" })
        })
    }
}

export class FireHitEffect extends OnAttackEffect {
    count: number = 0
    synergyLevel: number
    constructor(effect: EffectEnum) {
        super(undefined, effect)
        this.synergyLevel = SynergyEffects[Synergy.FIRE].indexOf(effect)
    }

    apply({ pokemon }) {
        pokemon.addAttack(this.synergyLevel, pokemon, 0, false)
        this.count += 1
    }
}

export const electricTripleAttackEffect = new OnAttackEffect(
    ({ pokemon, target, board, isTripleAttack }) => {
        if (isTripleAttack) return // ignore the effect of the 2nd and 3d attacks of triple attacks
        let shouldTriggerTripleAttack = false,
            isPowerSurge = false
        if (pokemon.effects.has(EffectEnum.RISING_VOLTAGE)) {
            shouldTriggerTripleAttack = pokemon.count.attackCount % 4 === 0
        } else if (pokemon.effects.has(EffectEnum.OVERDRIVE)) {
            shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0
        } else if (pokemon.effects.has(EffectEnum.POWER_SURGE)) {
            shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0
            isPowerSurge = true
        }
        if (shouldTriggerTripleAttack) {
            pokemon.count.tripleAttackCount++

            if (pokemon.name === Pkm.MORPEKO && target) {
                target.status.triggerParalysis(2000, target, pokemon)
            }

            if (pokemon.name === Pkm.MORPEKO_HANGRY && target) {
                target.status.triggerWound(4000, target, pokemon)
            }

            pokemon.state.attack(pokemon, board, target, true)
            pokemon.state.attack(pokemon, board, target, true)
            if (isPowerSurge && target) {
                board
                    .getAdjacentCells(target.positionX, target.positionY, true)
                    .forEach((cell) => {
                        if (cell) {
                            const enemy = board.getEntityOnCell(cell.x, cell.y)
                            if (enemy && pokemon.team !== enemy.team) {
                                enemy.handleSpecialDamage(
                                    10,
                                    board,
                                    AttackType.SPECIAL,
                                    pokemon,
                                    false,
                                    false
                                )
                                if (enemy !== target) {
                                    pokemon.broadcastAbility({
                                        skill: "LINK_CABLE_link",
                                        targetX: enemy.positionX,
                                        targetY: enemy.positionY
                                    })
                                }
                            }
                        }
                    })
            }
        }
    }
)

export class SoundCryEffect extends OnAbilityCastEffect {
    count: number = 0
    synergyLevel: number = -1
    constructor(effect?: EffectEnum) {
        super(undefined, effect)
        if (effect) {
            this.synergyLevel = SynergyEffects[Synergy.SOUND].indexOf(effect)
        }
    }

    apply(pokemon, board, target, crit) {
        pokemon.broadcastAbility({ skill: Ability.ECHO })
        const attackBoost = [2, 1, 1][this.synergyLevel] ?? 0
        const speedBoost = [0, 5, 5][this.synergyLevel] ?? 0
        const manaBoost = [0, 0, 3][this.synergyLevel] ?? 0

        const chimecho = board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .some((cell) => cell.value?.passive === Passive.CHIMECHO)

        const scale =
            (chimecho ? 2 : 1) * (pokemon.passive === Passive.MEGA_LAUNCHER ? 3 : 1)

        board.cells.forEach((ally) => {
            if (ally?.team === pokemon.team) {
                ally.status.sleep = false
                ally.addAttack(attackBoost * scale, pokemon, 0, false)
                ally.addSpeed(speedBoost * scale, pokemon, 0, false)
                ally.addPP(manaBoost * scale, pokemon, 0, false)
                ally.count.soundCryCount += scale
            }
        })
    }
}