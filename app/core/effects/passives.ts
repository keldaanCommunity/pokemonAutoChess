import { PokemonClasses, Qwilfish } from "../../models/colyseus-models/pokemon"
import PokemonFactory from "../../models/pokemon-factory"
import { Transfer } from "../../types"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Team } from "../../types/enum/Game"
import {
  Flavors,
  Item,
  OgerponMasks,
  SynergyFlavors
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy, SynergyArray } from "../../types/enum/Synergy"
import { removeInArray } from "../../utils/array"
import { isOnBench } from "../../utils/board"
import { distanceC } from "../../utils/distance"
import { min } from "../../utils/number"
import { chance } from "../../utils/random"
import { values } from "../../utils/schemas"
import { AbilityStrategies } from "../abilities/abilities"
import { Board, Cell } from "../board"
import { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import {
  Effect,
  OnAbilityCastEffect,
  OnAttackEffect,
  OnDamageReceivedEffect,
  OnDeathEffect,
  OnHitEffect,
  OnKillEffect,
  OnMoveEffect,
  OnShieldDepletedEffect,
  OnSpawnEffect,
  OnStageStartEffect,
  PeriodicEffect
} from "./effect"

export function drumBeat(pokemon: PokemonEntity, board: Board) {
  const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed
  pokemon.resetCooldown(1000, speed) // use attack state cooldown
  if (pokemon.pp >= pokemon.maxPP && !pokemon.status.silence) {
    // CAST ABILITY
    let crit = false
    if (pokemon.effects.has(EffectEnum.ABILITY_CRIT)) {
      crit = chance(pokemon.critChance / 100, pokemon)
    }
    const target = pokemon.state.getNearestTargetAtSight(pokemon, board)?.target
    if (target) {
      AbilityStrategies[pokemon.skill].process(pokemon, board, target, crit)
    }
    return
  }

  pokemon.count.attackCount++
  pokemon.targetY = -1
  const ppGained = 1 + pokemon.stars
  board
    .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
    .forEach((cell) => {
      if (cell.value && cell.value.team === pokemon.team) {
        cell.value.addPP(ppGained, pokemon, 0, false)
      }
    })
  pokemon.getEffects(OnAttackEffect).forEach((effect) => {
    effect.apply({
      pokemon,
      target: null,
      board,
      physicalDamage: 0,
      specialDamage: 0,
      trueDamage: 0,
      totalDamage: 0
    })
  })
}

export function stenchJump(
  pokemon: PokemonEntity,
  board: Board,
  x: number,
  y: number
) {
  board
    .getCellsBetween(x, y, pokemon.positionX, pokemon.positionY)
    .forEach((cell) => {
      if (cell.x !== x || cell.y !== y) {
        board.addBoardEffect(
          cell.x,
          cell.y,
          EffectEnum.POISON_GAS,
          pokemon.simulation
        )
      }
    })
}

export function partingShot(
  pokemon: PokemonEntity,
  target: PokemonEntity,
  x: number,
  y: number
) {
  target.addAbilityPower(-20, pokemon, 0, false)
  target.addAttack(-0.2 * target.baseAtk, pokemon, 0, false)
  pokemon.broadcastAbility({
    skill: "PARTING_SHOT",
    positionX: x,
    positionY: y
  })
}

const SharedVisionEffect = new OnAttackEffect(({ pokemon, board }) => {
  board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
    if (
      ally &&
      ally.passive === Passive.SHARED_VISION &&
      pokemon.team === ally.team &&
      pokemon.targetEntityId !== ally.id // do not self inflict damage if ally is confused and targeting you
    ) {
      ally.targetX = pokemon.targetX
      ally.targetY = pokemon.targetY
      ally.targetEntityId = pokemon.targetEntityId
    }
  })
})

const DurantBugBuffEffect = new OnAttackEffect(({ pokemon, target, board }) => {
  if (target) {
    const bugAllies =
      board.cells.filter(
        (entity) =>
          entity &&
          entity.team === pokemon.team &&
          entity.types.has(Synergy.BUG)
      ).length - 1
    if (bugAllies > 0) {
      target.handleDamage({
        damage: bugAllies,
        board,
        attackType: AttackType.TRUE,
        attacker: pokemon,
        shouldTargetGainMana: true
      })
    }
  }
})

const MiniorKernelOnAttackEffect = new OnAttackEffect(
  ({ pokemon, target, board, physicalDamage }) => {
    if (
      target &&
      (pokemon.name === Pkm.MINIOR_KERNEL_BLUE ||
        pokemon.name === Pkm.MINIOR_KERNEL_GREEN ||
        pokemon.name === Pkm.MINIOR_KERNEL_RED ||
        pokemon.name === Pkm.MINIOR_KERNEL_ORANGE)
    ) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const targets = cells
        .filter((cell) => cell.value && pokemon.team != cell.value.team)
        .map((cell) => cell.value!)
        .concat(target)
      targets.forEach((t) => {
        pokemon.broadcastAbility({
          skill: Ability.SHIELDS_DOWN,
          targetX: t.positionX,
          targetY: t.positionY
        })
        if (pokemon.name === Pkm.MINIOR_KERNEL_BLUE) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * (1 + pokemon.ap / 100)),
            board,
            attackType: AttackType.SPECIAL,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        }
        if (pokemon.name === Pkm.MINIOR_KERNEL_RED) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * 1.5 * (1 + pokemon.ap / 100)),
            board,
            attackType: AttackType.PHYSICAL,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        }
        if (pokemon.name === Pkm.MINIOR_KERNEL_ORANGE) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * 0.5 * (1 + pokemon.ap / 100)),
            board,
            attackType: AttackType.TRUE,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        }
      })
      if (pokemon.name === Pkm.MINIOR_KERNEL_GREEN) {
        cells.forEach((v) => {
          if (v && v.value && v.value.team === pokemon.team) {
            v.value.handleHeal(physicalDamage, pokemon, 1, false)
          }
        })
      }
    }
  }
)

const KubfuOnKillEffect = new OnKillEffect(
  (pokemon, target, board, attackType) => {
    const SPEED_BUFF_PER_KILL = 3
    const AP_BUFF_PER_KILL = 5
    const MAX_BUFFS = 10
    if (attackType === AttackType.PHYSICAL) {
      const baseSpeed = 50
      const nbBuffs = Math.floor(
        (pokemon.refToBoardPokemon.speed - baseSpeed) / SPEED_BUFF_PER_KILL
      )
      if (nbBuffs < MAX_BUFFS) {
        pokemon.addSpeed(SPEED_BUFF_PER_KILL, pokemon, 0, false, true)
        if (
          nbBuffs + 1 === MAX_BUFFS &&
          pokemon.player &&
          pokemon.player.items.includes(Item.SCROLL_OF_WATERS) === false
        ) {
          pokemon.player.items.push(Item.SCROLL_OF_WATERS)
        }
      }
    } else {
      const nbBuffs = Math.floor(
        pokemon.refToBoardPokemon.ap / AP_BUFF_PER_KILL
      )
      if (nbBuffs < MAX_BUFFS) {
        pokemon.addAbilityPower(AP_BUFF_PER_KILL, pokemon, 0, false, true)
        if (
          nbBuffs + 1 === MAX_BUFFS &&
          pokemon.player &&
          pokemon.player.items.includes(Item.SCROLL_OF_DARKNESS) === false
        ) {
          pokemon.player.items.push(Item.SCROLL_OF_DARKNESS)
        }
      }
    }
  }
)

const HisuianQwilfishOnCastEffect = new OnAbilityCastEffect((pokemon, board) => {
  pokemon.addAbilityPower(1, pokemon, 0, false, true)
})

const QwilfishPassiveEffect = new OnDamageReceivedEffect(
  ({ pokemon, attacker, attackType, isRetaliation }) => {
    if (
      attackType === AttackType.PHYSICAL &&
      !isRetaliation &&
      attacker &&
      attacker.items.has(Item.PROTECTIVE_PADS) === false &&
      distanceC(
        pokemon.positionX,
        pokemon.positionY,
        attacker.positionX,
        attacker.positionY
      ) === 1
    ) {
      const damage = 5
      attacker.handleDamage({
        damage,
        board: pokemon.simulation.board,
        attackType: AttackType.TRUE,
        attacker: pokemon,
        shouldTargetGainMana: true
      })
      if (chance(0.3, pokemon)) {
        attacker.status.triggerPoison(3000, attacker, pokemon)
      }
    }
  }
)

export const WaterSpringEffect = new OnAbilityCastEffect((pokemon, board) => {
  board.forEach((x, y, pkm) => {
    if (pkm?.passive === Passive.WATER_SPRING && pkm.team !== pokemon.team) {
      pkm.addPP(5, pkm, 0, false)
      pkm.broadcastAbility({ skill: pkm.skill })
    }
  })
})

export const SlowStartEffect = new OnAbilityCastEffect((pokemon, board) => {
  if (pokemon.count.ult === 1) {
    pokemon.addSpeed(30, pokemon, 0, false)
    pokemon.addAttack(10, pokemon, 0, false)
  }
})

export class AccelerationEffect extends OnMoveEffect {
  accelerationStacks = 0

  constructor() {
    super((pkm) => {
      pkm.addSpeed(20, pkm, 0, false)
      this.accelerationStacks += 1
    })
  }
}

const MimikuBustedTransformEffect = new OnDamageReceivedEffect(
  ({ pokemon }) => {
    if (pokemon.life / pokemon.hp < 0.5) {
      pokemon.index = PkmIndex[Pkm.MIMIKYU_BUSTED]
      pokemon.name = Pkm.MIMIKYU_BUSTED
      pokemon.changePassive(Passive.MIMIKYU_BUSTED)
      pokemon.addAttack(10, pokemon, 0, false)
      pokemon.status.triggerProtect(2000)
      if (pokemon.player) {
        pokemon.player.pokemonsPlayed.add(Pkm.MIMIKYU_BUSTED)
      }
    }
  }
)

const DarmanitanZenTransformEffect = new OnDamageReceivedEffect(
  ({ pokemon, board }) => {
    if (
      pokemon.life < 0.3 * pokemon.hp &&
      pokemon.passive === Passive.DARMANITAN
    ) {
      pokemon.index = PkmIndex[Pkm.DARMANITAN_ZEN]
      pokemon.name = Pkm.DARMANITAN_ZEN
      pokemon.changePassive(Passive.DARMANITAN_ZEN)
      pokemon.skill = Ability.TRANSE
      pokemon.pp = 0
      const destination = board.getTeleportationCell(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )
      if (destination) pokemon.moveTo(destination.x, destination.y, board)
      pokemon.toIdleState()
      pokemon.addAttack(-10, pokemon, 0, false)
      pokemon.addSpeed(-20, pokemon, 0, false)
      pokemon.addDefense(10, pokemon, 0, false)
      pokemon.addSpecialDefense(10, pokemon, 0, false)
      pokemon.range += 4
      pokemon.effects.add(EffectEnum.SPECIAL_ATTACKS)
      if (pokemon.player) {
        pokemon.player.pokemonsPlayed.add(Pkm.DARMANITAN_ZEN)
      }
    }
  }
)

const DarmanitanZenOnHitEffect = new OnHitEffect(
  ({ attacker, totalTakenDamage }) => {
    attacker.handleHeal(totalTakenDamage, attacker, 0, false)
  }
)

const PikachuSurferBuffEffect = new OnSpawnEffect((pkm) => {
  if (!pkm.player) return
  const aquaticStepReached = pkm.player.synergies.getSynergyStep(
    Synergy.AQUATIC
  )
  pkm.addShield(50 * aquaticStepReached, pkm, 0, false)
  pkm.addAttack(3 * aquaticStepReached, pkm, 0, false)
})

const ToxicSpikesEffect = new OnDamageReceivedEffect(({ pokemon, board }) => {
  if (pokemon.passive === Passive.GLIMMORA && pokemon.life < 0.5 * pokemon.hp) {
    pokemon.changePassive(Passive.NONE)

    const cells = new Array<Cell>()

    let startY = 1
    let endY = 3
    if (pokemon.team === Team.RED_TEAM) {
      startY = -2
      endY = 0
    }

    for (let x = -1; x < 2; x++) {
      for (let y = startY; y < endY; y++) {
        if (
          !(
            pokemon.positionX + x < 0 ||
            pokemon.positionX + x > BOARD_WIDTH ||
            pokemon.positionY + y < 0 ||
            pokemon.positionY + y > BOARD_HEIGHT
          )
        ) {
          cells.push({
            x: pokemon.positionX + x,
            y: pokemon.positionY + y,
            value:
              board.cells[
              board.columns * pokemon.positionY + y + pokemon.positionX + x
              ]
          })
        }
      }
    }

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.TOXIC_SPIKES,
        pokemon.simulation
      )

      pokemon.broadcastAbility({
        skill: "TOXIC_SPIKES",
        targetX: cell.x,
        targetY: cell.y
      })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          20,
          board,
          AttackType.SPECIAL,
          pokemon,
          false
        )
      }
    })
  }
})

const FurCoatEffect = new OnStageStartEffect(({ pokemon }) => {
  if (!pokemon) return
  if (isOnBench(pokemon)) {
    const { speed: initialSpeed, def: initialDef } = new PokemonClasses[
      pokemon.name
    ](pokemon.name)
    pokemon.speed = initialSpeed
    pokemon.def = initialDef
  } else if (pokemon.speed >= 5) {
    pokemon.speed -= 5
    pokemon.def += 2
  }
})

const MilceryFlavorEffect = new OnStageStartEffect(({ player, pokemon }) => {
  const milcery = pokemon
  if (!milcery) return
  const surroundingSynergies = new Map<Synergy, number>()
  SynergyArray.forEach((synergy) => {
    surroundingSynergies.set(synergy, 0)
  })
  const adjacentAllies = values(player.board).filter(
    (p) =>
      distanceC(
        milcery.positionX,
        milcery.positionY,
        p.positionX,
        p.positionY
      ) <= 1
  )
  adjacentAllies.forEach((ally) => {
    ally.types.forEach((synergy) => {
      surroundingSynergies.set(synergy, surroundingSynergies.get(synergy)! + 1)
    })
  })
  let maxSynergy = Synergy.NORMAL
  surroundingSynergies.forEach((value, key) => {
    if (value > surroundingSynergies.get(maxSynergy)!) {
      maxSynergy = key
    }
  })
  const flavor = SynergyFlavors[maxSynergy]
  Flavors.forEach((f) => {
    removeInArray(player.items, f)
  })
  player.items.push(flavor)
})

const PachirisuBerryEffect = new OnStageStartEffect(({ pokemon, room, player }) => {
  if (!pokemon || !player) return
  room.clock.setTimeout(() => {
    if (chance(0.3, pokemon)) {
      room.broadcast(Transfer.DIG, {
        pokemonId: pokemon.id,
        buriedItem: Item.SITRUS_BERRY
      })
      room.clock.setTimeout(() => {
        player.items.push(Item.SITRUS_BERRY)
      }, 3000)
    }
  }, 1000)
})

class ClearWingEffect extends PeriodicEffect {
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

class ZygardeCellsEffect extends PeriodicEffect {
  cellsCount = 0
  constructor() {
    super(
      (pokemon) => {
        if (!pokemon.player) return

        const fullyDugHolesIndexes: number[] = []
        let cellsSpawned = 0
        const delay = 1800

        for (let i = 0; i < 24; i++)
          if (pokemon.player.groundHoles[i] === 5) fullyDugHolesIndexes.push(i)

        for (const index of fullyDugHolesIndexes) {
          if (this.cellsCount < 95) {
            this.cellsCount++
            cellsSpawned++
            const x = +index % 8
            const y = Math.floor(+index / 8)
            if (x !== pokemon.positionX || y !== pokemon.positionY) {
              pokemon.broadcastAbility({
                targetX: x,
                targetY: y,
                skill: "ZYGARDE_CELL"
              })
            }
          }
        }

        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.addMaxHP(cellsSpawned, pokemon, 0, false)
            if (this.cellsCount >= 95) {
              pokemon.handleHeal(0.2 * pokemon.hp, pokemon, 0, false)
              if (pokemon.index === PkmIndex[Pkm.ZYGARDE_10]) {
                pokemon.addDefense(2, pokemon, 0, false)
                pokemon.addSpecialDefense(2, pokemon, 0, false)
                pokemon.addMaxHP(5, pokemon, 0, false)
                pokemon.addSpeed(-12, pokemon, 0, false)
                pokemon.range = min(1)(pokemon.range + 1)
              } else {
                pokemon.addAttack(5, pokemon, 0, false)
                pokemon.addDefense(5, pokemon, 0, false)
                pokemon.addSpecialDefense(5, pokemon, 0, false)
                pokemon.addMaxHP(35, pokemon, 0, false)
                pokemon.addSpeed(-5, pokemon, 0, false)
                pokemon.range = min(1)(pokemon.range - 1)
              }

              pokemon.index = PkmIndex[Pkm.ZYGARDE_100]
              pokemon.name = Pkm.ZYGARDE_100
              pokemon.changePassive(Passive.NONE)
              pokemon.skill = Ability.CORE_ENFORCER
              pokemon.pp = 0
              pokemon.effectsSet.delete(this)
              if (pokemon.player) {
                pokemon.player.pokemonsPlayed.add(Pkm.ZYGARDE_100)
              }
            }
          }, delay)
        )
      },
      Passive.ZYGARDE,
      1000
    )
  }
}

class SynchroEffect extends PeriodicEffect {
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

export class FalinksFormationEffect extends OnSpawnEffect {
  stacks = 0

  constructor() {
    super((pkm) => {
      if (!pkm.player) return
      const troopers = values(pkm.player.board).filter(
        (p) =>
          p.name === Pkm.FALINKS_TROOPER && p.positionY === 0 && p.id !== pkm.id
      )
      this.stacks = troopers.length
      if (this.stacks > 0) {
        pkm.addAttack(this.stacks * 1, pkm, 0, false)
        pkm.addDefense(this.stacks * 1, pkm, 0, false)
        pkm.addShield(this.stacks * 30, pkm, 0, false)
      }
    })
  }
}


const ogerponMaskDropEffect = (
  mask: typeof OgerponMasks[number],
  from: Pkm,
  to: Pkm
) =>
  new OnShieldDepletedEffect(({ pokemon }) => {
    if (pokemon.name === from && pokemon.items.has(mask)) {
      pokemon.index = PkmIndex[to]
      pokemon.removeItem(mask)
    }
  }, mask)

const PhioneSpawnEffect = new OnSpawnEffect((pkm) => {
  if (pkm.name === Pkm.MANAPHY && pkm.items.has(Item.AQUA_EGG)) {
    pkm.items.delete(Item.AQUA_EGG)
    const phione = PokemonFactory.createPokemonFromName(Pkm.PHIONE, pkm.player)
    const coord = pkm.simulation.getClosestAvailablePlaceOnBoardToPokemon(phione, pkm.team)
    pkm.simulation.addPokemon(
      phione,
      coord.x,
      coord.y,
      pkm.team,
      true
    )
  }
})

export const PassiveEffects: Partial<
  Record<Passive, (Effect | (() => Effect))[]>
> = {
  [Passive.DURANT]: [DurantBugBuffEffect],
  [Passive.SHARED_VISION]: [SharedVisionEffect],
  [Passive.METEOR]: [MiniorKernelOnAttackEffect],
  [Passive.KUBFU]: [KubfuOnKillEffect],
  [Passive.QWILFISH]: [QwilfishPassiveEffect],
  [Passive.HISUIAN_QWILFISH]: [HisuianQwilfishOnCastEffect],
  [Passive.SLOW_START]: [SlowStartEffect],
  [Passive.VIGOROTH]: [
    new OnSpawnEffect((pkm) => pkm.effects.add(EffectEnum.IMMUNITY_SLEEP))
  ],
  [Passive.PIKACHU_SURFER]: [PikachuSurferBuffEffect],
  [Passive.ACCELERATION]: [
    () => new AccelerationEffect() // needs new instance of effect for each pokemon due to internal stack counter
  ],
  [Passive.MIMIKYU]: [MimikuBustedTransformEffect],
  [Passive.DARMANITAN]: [DarmanitanZenTransformEffect],
  [Passive.DARMANITAN_ZEN]: [DarmanitanZenOnHitEffect],
  [Passive.GLIMMORA]: [ToxicSpikesEffect],
  [Passive.FUR_COAT]: [FurCoatEffect],
  [Passive.CREAM]: [MilceryFlavorEffect],
  [Passive.CLEAR_WING]: [
    () => new ClearWingEffect() // needs new instance of effect for each pokemon due to internal stack counter
  ],
  [Passive.SYNCHRO]: [
    () => new SynchroEffect() // needs new instance of effect for each pokemon due to internal stack counter
  ],
  [Passive.ZYGARDE]: [
    () => new ZygardeCellsEffect() // needs new instance of effect for each pokemon due to internal stack counter
  ],
  [Passive.FALINKS]: [
    () => new FalinksFormationEffect() // needs new instance of effect for each pokemon due to internal stack counter
  ],
  [Passive.OGERPON_CORNERSTONE]: [
    ogerponMaskDropEffect(
      Item.CORNERSTONE_MASK,
      Pkm.OGERPON_CORNERSTONE_MASK,
      Pkm.OGERPON_CORNERSTONE
    )
  ],
  [Passive.OGERPON_HEARTHFLAME]: [
    ogerponMaskDropEffect(
      Item.HEARTHFLAME_MASK,
      Pkm.OGERPON_HEARTHFLAME_MASK,
      Pkm.OGERPON_HEARTHFLAME
    )
  ],
  [Passive.OGERPON_TEAL]: [
    ogerponMaskDropEffect(
      Item.TEAL_MASK,
      Pkm.OGERPON_TEAL_MASK,
      Pkm.OGERPON_TEAL
    )
  ],
  [Passive.OGERPON_WELLSPRING]: [
    ogerponMaskDropEffect(
      Item.WELLSPRING_MASK,
      Pkm.OGERPON_WELLSPRING_MASK,
      Pkm.OGERPON_WELLSPRING
    )
  ],
  [Passive.MANAPHY]: [PhioneSpawnEffect],
  [Passive.PACHIRISU]: [PachirisuBerryEffect],
  [Passive.SOUL_HEART]: [
    new OnKillEffect((pokemon) => {
      pokemon.addPP(10, pokemon, 0, false)
      pokemon.addAbilityPower(10, pokemon, 0, false)
    })
  ],
  [Passive.BEAST_BOOST_ATK]: [
    new OnKillEffect((pokemon) => {
      pokemon.addAttack(5, pokemon, 0, false)
    })
  ],
  [Passive.BEAST_BOOST_AP]: [
    new OnKillEffect((pokemon) => {
      pokemon.addAbilityPower(10, pokemon, 0, false)
    })
  ],
  [Passive.GRIM_NEIGH]: [
    new OnKillEffect((pokemon) => {
      pokemon.addAbilityPower(30, pokemon, 0, false)
    })
  ],
  [Passive.GUZZLORD]: [
    new OnKillEffect((pokemon) => {
      if (pokemon.items.has(Item.CHEF_HAT)) {
        pokemon.addAbilityPower(5, pokemon, 0, false, true)
        pokemon.addMaxHP(10, pokemon, 0, false, true)
      }
    })
  ],
  [Passive.STENCH]: [
    new OnMoveEffect((pokemon, board, oldX, oldY, newX, newY) => {
      board.effects[oldY * board.columns + oldX] = EffectEnum.POISON_GAS
    })
  ],
  [Passive.PYUKUMUKU]: [
    new OnDeathEffect(({ pokemon, board }) => {
      pokemon.broadcastAbility({ skill: Ability.EXPLOSION })
      const adjcells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
      const damage = Math.round(0.5 * pokemon.hp)
      adjcells.forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            false
          )
        }
      })
    })
  ]
}
