import { MapSchema } from "@colyseus/schema"
import Player from "../../models/colyseus-models/player"
import { Pokemon } from "../../models/colyseus-models/pokemon"
import GameRoom from "../../rooms/game-room"
import { IPokemonEntity } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import type { Board } from "../board"
import { PokemonEntity } from "../pokemon-entity"
import Simulation from "../simulation"

type EffectOrigin = EffectEnum | Item | Passive | Ability

export abstract class Effect {
  origin?: EffectOrigin
  apply(...args: any[]) {}
  constructor(effect?: (...args: any[]) => void, origin?: EffectOrigin) {
    if (effect) {
      this.apply = effect
    }
    this.origin = origin
  }
}

// applied on fight start or when spawning
export class OnSpawnEffect extends Effect {
  constructor(
    effect?: (entity: PokemonEntity, player?: Player, isSpawn?: boolean) => void
  ) {
    super(effect)
  }
  override apply(entity: PokemonEntity, player?: Player, isSpawn?: boolean) {}
}

// effect applied when consuming a dish, either at the start of the fight or when eating a dish on the bench
interface OnDishConsumedEffectArgs {
  pokemon: Pokemon
  dish: Item
  entity?: PokemonEntity
  isGhostOpponent: boolean
}
export class OnDishConsumedEffect extends Effect {
  constructor(effect?: (args: OnDishConsumedEffectArgs) => void) {
    super(effect)
  }
  override apply(args: OnDishConsumedEffectArgs) {}
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {
  constructor(effect?: (pokemon: PokemonEntity) => void) {
    super(effect)
  }
  override apply(pokemon: PokemonEntity) {}
}

export class OnItemRemovedEffect extends Effect {
  constructor(effect?: (pokemon: PokemonEntity) => void) {
    super(effect)
  }
  override apply(pokemon: PokemonEntity) {}
}

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
  apply(args: OnStageStartEffectArgs) {}
}

interface OnSimulationStartEffectArgs {
  simulation: Simulation
  player: Player
  team: MapSchema<IPokemonEntity>
  entity: IPokemonEntity
}

// applied after simulation started, when the board is fully set up
export class OnSimulationStartEffect extends Effect {
  constructor(effect?: (args: OnSimulationStartEffectArgs) => void) {
    super(effect)
  }
  apply(args: OnSimulationStartEffectArgs) {}
}

interface OnItemDroppedEffectArgs {
  pokemon: Pokemon
  player: Player
  item: Item
  room: GameRoom
}

// called when an item is dragged to a pokemon ; return false to prevent equipping the item
export class OnItemDroppedEffect extends Effect {
  apply(args: OnItemDroppedEffectArgs): boolean {
    return true
  }
  constructor(
    effect?: (args: OnItemDroppedEffectArgs) => boolean,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

interface OnKillEffectArgs {
  attacker: PokemonEntity
  target: PokemonEntity
  board: Board
  attackType: AttackType
}

// applied after knocking out an enemy
export class OnKillEffect extends Effect {
  apply(args: OnKillEffectArgs) {}
  constructor(
    effect?: (args: OnKillEffectArgs) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

// applied on KO (does not proc if resurection)
interface OnDeathEffectArgs {
  board: Board
  pokemon: PokemonEntity
}

export class OnDeathEffect extends Effect {
  apply(args: OnDeathEffectArgs) {}
  constructor(
    effect?: (args: OnDeathEffectArgs) => void,
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
  attacker: PokemonEntity
  target: PokemonEntity
  board: Board
  totalTakenDamage: number
  physicalDamage: number
  specialDamage: number
  trueDamage: number
}

// applied after every successful basic attack (not dodged or protected)
export class OnHitEffect extends Effect {
  apply(params: OnHitEffectArgs) {}
  constructor(
    effect?: (params: OnHitEffectArgs) => void,
    origin?: EffectOrigin
  ) {
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
  override apply(args: OnAttackEffectArgs) {}
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
  ) {}
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
  apply(args: OnDamageReceivedEffectArgs) {}
  constructor(
    effect?: (args: OnDamageReceivedEffectArgs) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

// applied after dealing damage
export interface OnDamageDealtEffectArgs {
  pokemon: PokemonEntity
  target: PokemonEntity
  damage: number
  attackType?: AttackType
  isRetaliation: boolean
}

export class OnDamageDealtEffect extends Effect {
  apply(args: OnDamageDealtEffectArgs) {}
  constructor(
    effect?: (args: OnDamageDealtEffectArgs) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class OnMoveEffect extends Effect {
  override apply(
    pokemon: PokemonEntity,
    board: Board,
    oldX: number,
    oldY: number,
    newX: number,
    newY: number
  ) {}
  constructor(
    effect?: (
      pokemon: PokemonEntity,
      board: Board,
      oldX: number,
      oldY: number,
      newX: number,
      newY: number
    ) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

// applied after taking a hit that removed all the remaining shield
interface OnShieldDepletedEffectArgs {
  pokemon: PokemonEntity
  attacker: PokemonEntity | null
  board: Board
}

export class OnShieldDepletedEffect extends Effect {
  override apply(args: OnShieldDepletedEffectArgs) {}
  constructor(
    effect?: (args: OnShieldDepletedEffectArgs) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}
