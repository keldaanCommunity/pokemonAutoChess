import Player from "../../models/colyseus-models/player"
import { Pokemon } from "../../models/colyseus-models/pokemon"
import GameRoom from "../../rooms/game-room"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
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


interface OnStageStartEffectArgs {
  player: Player
  pokemon?: Pokemon
  room: GameRoom
}

// applied in between rounds at the start of the picking phase
export class OnStageStartEffect extends Effect {
  constructor(effect?: (args: OnStageStartEffectArgs) => void) {
    super(effect)
  }
  apply(args: OnStageStartEffectArgs) { }
}

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

