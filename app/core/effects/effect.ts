import Player from "../../models/colyseus-models/player"
import { Pokemon } from "../../models/colyseus-models/pokemon"
import { SynergyEffects } from "../../models/effects"
import GameRoom from "../../rooms/game-room"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { min } from "../../utils/number"
import { chance } from "../../utils/random"
import type { Board } from "../board"
import { PokemonEntity } from "../pokemon-entity"

type EffectOrigin = EffectEnum | Item | Passive | Ability

export abstract class Effect {
  origin?: EffectOrigin
  apply(...args: any[]) { }
  constructor(effect?: (...args: any[]) => void, origin?: EffectOrigin) {
    if (effect) {
      this.apply = effect
    }
    this.origin = origin
  }
}

// applied on fight start or when spawning
export class OnSpawnEffect extends Effect {
  constructor(effect?: (entity: PokemonEntity) => void) {
    super(effect)
  }
  override apply(entity: PokemonEntity) { }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect { }

export class OnItemRemovedEffect extends Effect { }

interface OnItemEquippedEffectArgs {
  pokemon: Pokemon
  player: Player
  item: Item
  room: GameRoom
}

// applied when an item is dragged to a pokemon
export class OnItemEquippedEffect extends Effect {
  apply(args: OnItemEquippedEffectArgs): boolean {
    return true
  }
  constructor(
    effect?: (args: OnItemEquippedEffectArgs) => boolean,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

// applied after knocking out an enemy
export class OnKillEffect extends Effect {
  apply(
    attacker: PokemonEntity,
    target: PokemonEntity,
    board: Board,
    attackType: AttackType
  ) { }
  constructor(
    effect?: (
      entity: PokemonEntity,
      target: PokemonEntity,
      board: Board,
      attackType: AttackType
    ) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class PeriodicEffect extends Effect {
  intervalMs: number
  timer: number
  count: number

  constructor(
    effect: (entity: PokemonEntity, ...others: any[]) => void,
    origin: EffectOrigin,
    intervalMs: number
  ) {
    super(effect, origin)
    this.intervalMs = intervalMs
    this.timer = intervalMs
    this.count = 0
  }

  update(dt: number, entity: PokemonEntity) {
    this.timer -= dt
    if (this.timer <= 0) {
      this.count++
      this.apply(entity)
      this.timer = this.intervalMs
    }
  }
}

interface OnHitEffectArgs {
  attacker: PokemonEntity,
  target: PokemonEntity,
  board: Board
  totalTakenDamage: number
  physicalDamage: number
  specialDamage: number
  trueDamage: number
}

// applied after every successful basic attack (not dodged or protected)
export class OnHitEffect extends Effect {
  apply(params: OnHitEffectArgs) { }
  constructor(effect?: (params: OnHitEffectArgs) => void, origin?: EffectOrigin) {
    super(effect, origin)
  }
}

interface OnAttackEffectArgs {
  pokemon: PokemonEntity
  target: PokemonEntity | null
  board: Board
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  totalDamage: number
  isTripleAttack?: boolean
  hasAttackKilled?: boolean
}

export class OnAttackEffect extends Effect {
  override apply(args: OnAttackEffectArgs) { }
  constructor(
    effect?: (args: OnAttackEffectArgs) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class OnAbilityCastEffect extends Effect {
  apply(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) { }
  constructor(
    effect?: (
      pokemon: PokemonEntity,
      board: Board,
      target: PokemonEntity,
      crit: boolean
    ) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

// applied after having received damage and not being KO

interface OnDamageReceivedEffectArgs {
  pokemon: PokemonEntity
  attacker: PokemonEntity | null
  board: Board
  damage: number
  attackType?: AttackType
  isRetaliation: boolean
}

export class OnDamageReceivedEffect extends Effect {
  apply(args: OnDamageReceivedEffectArgs) { }
  constructor(
    effect?: (args: OnDamageReceivedEffectArgs) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class OnMoveEffect extends Effect {
  override apply(
    pokemon: PokemonEntity,
    board: Board,
    x: number,
    y: number
  ) { }
  constructor(
    effect?: (
      pokemon: PokemonEntity,
      board: Board,
      x: number,
      y: number
    ) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

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

export class GrowGroundEffect extends PeriodicEffect {
  synergyLevel: number
  constructor(effect: EffectEnum) {
    super(
      (pokemon) => {
        if (this.count > 5) {
          return
        }
        pokemon.addDefense(this.synergyLevel * 2, pokemon, 0, false)
        pokemon.addSpecialDefense(this.synergyLevel * 2, pokemon, 0, false)
        pokemon.addAttack(this.synergyLevel, pokemon, 0, false)
        pokemon.broadcastAbility({ skill: "GROUND_GROW" })
        if (
          pokemon.items.has(Item.BIG_NUGGET) &&
          this.count === 5 &&
          pokemon.player
        ) {
          pokemon.player.addMoney(2, true, pokemon)
          pokemon.count.moneyCount += 2
        }

        if (pokemon.passive === Passive.ZYGARDE && this.count === 5) {
          pokemon.handleHeal(0.2 * pokemon.hp, pokemon, 0, false)
          if (pokemon.index === PkmIndex[Pkm.ZYGARDE_10]) {
            pokemon.addDefense(2, pokemon, 0, false)
            pokemon.addSpecialDefense(2, pokemon, 0, false)
            pokemon.addMaxHP(50, pokemon, 0, false)
            pokemon.addSpeed(-12, pokemon, 0, false)
            pokemon.range = min(1)(pokemon.range + 1)
          } else {
            pokemon.addAttack(5, pokemon, 0, false)
            pokemon.addDefense(5, pokemon, 0, false)
            pokemon.addSpecialDefense(5, pokemon, 0, false)
            pokemon.addMaxHP(80, pokemon, 0, false)
            pokemon.addSpeed(-5, pokemon, 0, false)
            pokemon.range = min(1)(pokemon.range - 1)
          }

          pokemon.index = PkmIndex[Pkm.ZYGARDE_100]
          pokemon.name = Pkm.ZYGARDE_100
          pokemon.changePassive(Passive.NONE)
          pokemon.skill = Ability.CORE_ENFORCER
          pokemon.pp = 0
          if (pokemon.player) {
            pokemon.player.pokemonsPlayed.add(Pkm.ZYGARDE_100)
          }
        }
      },
      effect,
      3000
    )
    this.synergyLevel = SynergyEffects[Synergy.GROUND].indexOf(effect) + 1
  }
}

export class ClearWingEffect extends PeriodicEffect {
  constructor() {
    super(
      (pokemon) => {
        pokemon.addSpeed(1, pokemon, 0, false)
      },
      Passive.CLEAR_WING,
      1000
    )
  }
}

export class SynchroEffect extends PeriodicEffect {
  constructor() {
    super(
      (pokemon) => {
        const status = pokemon.status
        if (status.burn && status.burnOrigin) {
          status.burnOrigin.status.triggerBurn(3000, status.burnOrigin, pokemon)
        }
        if (status.poisonStacks && status.poisonOrigin) {
          status.poisonOrigin.status.triggerPoison(
            3000,
            status.poisonOrigin,
            pokemon
          )
        }
        if (status.wound && status.woundOrigin) {
          status.woundOrigin.status.triggerWound(
            3000,
            status.woundOrigin,
            pokemon
          )
        }
        if (status.silence && status.silenceOrigin) {
          status.silenceOrigin.status.triggerSilence(
            3000,
            status.silenceOrigin,
            pokemon
          )
        }
      },
      Passive.SYNCHRO,
      3000
    )
  }
}

export class DrySkinEffect extends PeriodicEffect {
  constructor() {
    super(
      (pokemon) => {
        pokemon.handleHeal(8, pokemon, 0, false)
      },
      Passive.DRY_SKIN,
      1000
    )
  }
}

export class DarkHarvestEffect extends PeriodicEffect {
  duration: number
  constructor(duration: number, pokemon: PokemonEntity) {
    super(
      (pokemon) => {
        pokemon.broadcastAbility({ skill: Ability.DARK_HARVEST })
        const board = pokemon.simulation.board
        const crit = pokemon.effects.has(EffectEnum.ABILITY_CRIT)
          ? chance(pokemon.critChance, pokemon)
          : false
        const darkHarvestDamage = [5, 10, 20][pokemon.stars - 1] ?? 20
        const healFactor = 0.3
        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const { takenDamage } = cell.value.handleSpecialDamage(
                darkHarvestDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                true
              )
              pokemon.handleHeal(
                Math.round(takenDamage * healFactor),
                pokemon,
                0,
                false
              )
            }
          })
        if (this.duration <= 0) {
          pokemon.effectsSet.delete(this)
          pokemon.effects.delete(EffectEnum.DARK_HARVEST)
        } else {
          this.duration -= this.intervalMs
        }
      },
      EffectEnum.DARK_HARVEST,
      1000
    )

    this.timer = 0 // delay the first tick
    this.duration = duration + this.intervalMs

    if (pokemon.effects.has(EffectEnum.DARK_HARVEST)) {
      // merge with existing effect if not finished before the next cast
      pokemon.effectsSet.delete(this)
      for (const effect of pokemon.effectsSet) {
        if (effect instanceof DarkHarvestEffect) {
          effect.duration = Math.max(this.duration, effect.duration)
          effect.timer = this.timer
          break
        }
      }
    } else {
      pokemon.effects.add(EffectEnum.DARK_HARVEST)
    }
  }
}

export class FireHitEffect extends OnAttackEffect {
  count: number = 0
  synergyLevel: number
  constructor(effect: EffectEnum) {
    super(undefined, effect)
    this.synergyLevel = SynergyEffects[Synergy.FIRE].indexOf(effect)
  }

  apply({ pokemon }: OnAttackEffectArgs) {
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
