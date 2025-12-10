import { ARMOR_FACTOR, DEFAULT_SPEED } from "../../config"
import PokemonFactory from "../../models/pokemon-factory"
import { PVEStages } from "../../models/pve-stages"
import { Title, Transfer } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, PokemonActionState, Team } from "../../types/enum/Game"
import {
  AbilityPerTM,
  Berries,
  Dish,
  FishingRod,
  Flavors,
  HMs,
  Item,
  ItemRecipe,
  MemoryDiscs,
  OgerponMasks,
  Sweets,
  SynergyGivenByItem,
  SynergyStones,
  TMs
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { NonPkm, Pkm, PkmFamily } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { removeInArray } from "../../utils/array"
import { getFreeSpaceOnBench, isOnBench } from "../../utils/board"
import { distanceC } from "../../utils/distance"
import { max, min } from "../../utils/number"
import { chance, pickNRandomIn, pickRandomIn } from "../../utils/random"
import { values } from "../../utils/schemas"
import { AbilityStrategies } from "../abilities/abilities"
import { DishByPkm } from "../dishes"
import { ConditionBasedEvolutionRule } from "../evolution-rules"
import { FlowerPotMons } from "../flower-pots"
import { getUnitScore, PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import {
  Effect,
  OnAbilityCastEffect,
  OnAttackEffect,
  OnAttackReceivedEffect,
  OnDamageDealtEffect,
  OnDamageReceivedEffect,
  OnDeathEffect,
  OnDeathEffectArgs,
  OnHitEffect,
  OnItemDroppedEffect,
  OnItemGainedEffect,
  OnItemRemovedEffect,
  OnKillEffect,
  OnMoveEffect,
  OnResurrectEffect,
  OnSimulationStartEffect,
  OnStageStartEffect,
  PeriodicEffect
} from "./effect"

export const blueOrbOnAttackEffect = new OnAttackEffect(
  ({ pokemon, target, board }) => {
    pokemon.count.staticHolderCount++
    if (pokemon.count.staticHolderCount >= 3) {
      pokemon.count.staticHolderCount = 0
      const nbBounces = 2
      const closestEnemies = board.getClosestEnemies(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
      )

      let previousTg: PokemonEntity = pokemon
      let secondaryTargetHit: PokemonEntity | null = target

      for (let i = 0; i < nbBounces; i++) {
        secondaryTargetHit = closestEnemies[i]
        if (secondaryTargetHit) {
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_link",
            positionX: previousTg.positionX,
            positionY: previousTg.positionY,
            targetX: secondaryTargetHit.positionX,
            targetY: secondaryTargetHit.positionY
          })
          secondaryTargetHit.handleSpecialDamage(
            10,
            board,
            AttackType.SPECIAL,
            pokemon,
            false,
            false
          )
          secondaryTargetHit.addPP(-15, pokemon, 0, false)
          secondaryTargetHit.count.manaBurnCount++
          previousTg = secondaryTargetHit
        } else {
          break
        }
      }
    }
  }
)

export const loadedDiceOnAttackEffect = new OnAttackEffect(
  ({
    pokemon,
    target,
    board,
    totalDamage,
    physicalDamage,
    specialDamage,
    trueDamage
  }) => {
    if (totalDamage > 0 && target && chance(0.5, pokemon)) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const candidateTargets = cells
        .filter((cell) => cell.value && pokemon.team != cell.value.team)
        .map((cell) => cell.value!)
      candidateTargets.sort((a, b) => a.hp - b.hp) // target lowest life first

      const nbBounces = 1
      for (let i = 0; i < nbBounces; i++) {
        const target = candidateTargets.shift()
        if (!target) break
        let totalTakenDamage = 0
        if (physicalDamage > 0) {
          const { takenDamage } = target.handleDamage({
            damage: physicalDamage,
            board,
            attackType: AttackType.PHYSICAL,
            attacker: pokemon,
            shouldTargetGainMana: true
          })
          totalTakenDamage += takenDamage
        }
        if (specialDamage > 0) {
          const { takenDamage } = target.handleDamage({
            damage: specialDamage,
            board,
            attackType: AttackType.SPECIAL,
            attacker: pokemon,
            shouldTargetGainMana: true
          })
          totalTakenDamage += takenDamage
          if (
            target.items.has(Item.POWER_LENS) &&
            !pokemon.items.has(Item.PROTECTIVE_PADS)
          ) {
            const speDef = target.status.armorReduction
              ? Math.round(target.speDef / 2)
              : target.speDef
            const damageAfterReduction =
              specialDamage / (1 + ARMOR_FACTOR * speDef)
            const damageBlocked = min(0)(specialDamage - damageAfterReduction)
            pokemon.broadcastAbility({ skill: "POWER_LENS" })
            pokemon.handleDamage({
              damage: Math.round(damageBlocked),
              board,
              attackType: AttackType.SPECIAL,
              attacker: target,
              shouldTargetGainMana: true,
              isRetaliation: true
            })
          }
        }
        if (trueDamage > 0) {
          const { takenDamage } = target.handleDamage({
            damage: trueDamage,
            board,
            attackType: AttackType.TRUE,
            attacker: pokemon,
            shouldTargetGainMana: true
          })
          totalTakenDamage += takenDamage
        }
        pokemon.onHit({
          target,
          board,
          totalTakenDamage,
          physicalDamage,
          specialDamage,
          trueDamage
        })
      }
    }
  }
)

export class SoulDewEffect extends PeriodicEffect {
  constructor() {
    super(
      (pokemon) => {
        pokemon.addAbilityPower(5, pokemon, 0, false)
        pokemon.addPP(5, pokemon, 0, false)
        pokemon.count.soulDewCount++
      },
      Item.SOUL_DEW,
      1000
    )
  }
}

export class RunningShoesOnMoveEffect extends OnMoveEffect {
  stacks = 0

  constructor() {
    super((pkm) => {
      pkm.addSpeed(5, pkm, 0, false)
      this.stacks += 1
    })
  }
}

const smokeBallEffect = new OnDamageReceivedEffect(({ pokemon, board }) => {
  if (pokemon.hp > 0 && pokemon.hp < 0.4 * pokemon.maxHP) {
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(4000, cell.value, pokemon)
        cell.value.status.triggerBlinded(4000, cell.value)
      }
    })
    pokemon.broadcastAbility({ skill: "SMOKE_BALL" })
    pokemon.removeItem(Item.SMOKE_BALL)
    pokemon.addShield(50, pokemon, 0, false)
    pokemon.flyAway(board)
  }
})

const ogerponMaskEffect = new OnItemDroppedEffect(
  ({ pokemon, player, item }) => {
    if (
      pokemon.passive === Passive.OGERPON_TEAL ||
      pokemon.passive === Passive.OGERPON_WELLSPRING ||
      pokemon.passive === Passive.OGERPON_HEARTHFLAME ||
      pokemon.passive === Passive.OGERPON_CORNERSTONE
    ) {
      const currentMask = values(pokemon.items).find((i) =>
        OgerponMasks.includes(i)
      )
      if (currentMask) {
        pokemon.items.delete(currentMask)
      } else if (pokemon.items.size >= 3) {
        // full, can't hold mask
        return false
      }

      if (item === Item.TEAL_MASK) {
        pokemon.items.add(Item.TEAL_MASK)
        player.transformPokemon(pokemon, Pkm.OGERPON_TEAL_MASK)
      } else if (item === Item.WELLSPRING_MASK) {
        pokemon.items.add(Item.WELLSPRING_MASK)
        player.transformPokemon(pokemon, Pkm.OGERPON_WELLSPRING_MASK)
      } else if (item === Item.HEARTHFLAME_MASK) {
        pokemon.items.add(Item.HEARTHFLAME_MASK)
        player.transformPokemon(pokemon, Pkm.OGERPON_HEARTHFLAME_MASK)
      } else if (item === Item.CORNERSTONE_MASK) {
        pokemon.items.add(Item.CORNERSTONE_MASK)
        player.transformPokemon(pokemon, Pkm.OGERPON_CORNERSTONE_MASK)
      }
      return true
    }

    return false // prevent item from being equipped
  }
)

export class DojoTicketOnItemDroppedEffect extends OnItemDroppedEffect {
  constructor(ticketLevel: number) {
    super(({ pokemon, player, room, item }) => {
      if (NonPkm.includes(pokemon.name)) return false
      const substitute = PokemonFactory.createPokemonFromName(
        Pkm.SUBSTITUTE,
        player
      )
      player.board.delete(pokemon.id)
      substitute.id = pokemon.id
      substitute.evolution = pokemon.name
      substitute.evolutionRule = new ConditionBasedEvolutionRule(() => false) // used only to store the original pokemon
      substitute.positionX = pokemon.positionX
      substitute.positionY = pokemon.positionY
      pokemon.items.forEach((item) => substitute.items.add(item))
      pokemon.removeItems(values(pokemon.items), player)
      player.board.set(substitute.id, substitute)
      player.pokemonsTrainingInDojo.push({
        pokemon,
        ticketLevel,
        returnStage: room.state.stageLevel + ([3, 4, 5][ticketLevel - 1] ?? 5)
      })
      removeInArray(player.items, item)
      return false // prevent item from being equipped
    })
  }
}

const chefCookEffect = new OnStageStartEffect(({ pokemon, player, room }) => {
  if (!pokemon) return
  const chef = pokemon

  const gourmetLevel = player.synergies.getSynergyStep(Synergy.GOURMET)
  const nbDishes = [0, 1, 2, 2][gourmetLevel] ?? 2
  let dish = DishByPkm[chef.name]
  if (chef.items.has(Item.COOKING_POT)) {
    dish = Item.HEARTY_STEW
  } else if (chef.name === Pkm.ARCEUS || chef.name === Pkm.KECLEON) {
    dish = Item.SANDWICH
  }

  if (chef.passive === Passive.GLUTTON) {
    chef.addMaxHP(30, player)
    if (chef.maxHP > 750) {
      player.titles.add(Title.GLUTTON)
    }
  }

  if (dish && nbDishes > 0) {
    let dishes = Array.from({ length: nbDishes }, () => dish!)
    if (dish === Item.BERRIES) {
      dishes = pickNRandomIn(Berries, 3 * nbDishes)
    }
    if (dish === Item.SWEETS) {
      dishes = pickNRandomIn(Sweets, nbDishes)
    }
    room.clock.setTimeout(async () => {
      room.broadcast(Transfer.COOK, {
        pokemonId: chef.id,
        dishes
      })
      room.clock.setTimeout(() => {
        const candidates = values(player.board).filter(
          (p) =>
            p.meal === "" &&
            p.canEat &&
            !isOnBench(p) &&
            distanceC(
              chef.positionX,
              chef.positionY,
              p.positionX,
              p.positionY
            ) === 1
        )
        candidates.sort((a, b) => getUnitScore(b) - getUnitScore(a))
        dishes.forEach((meal, i) => {
          if (
            [
              Item.TART_APPLE,
              Item.SWEET_APPLE,
              Item.SIRUPY_APPLE,
              ...Berries
            ].includes(meal)
          ) {
            player.items.push(meal)
          } else {
            const pokemon = candidates[i] ?? chef
            if (dish === Item.HERBA_MYSTICA) {
              const flavors: Dish[] = []
              if (pokemon.types.has(Synergy.FAIRY))
                flavors.push(Item.HERBA_MYSTICA_SWEET)
              if (pokemon.types.has(Synergy.PSYCHIC))
                flavors.push(Item.HERBA_MYSTICA_SPICY)
              if (pokemon.types.has(Synergy.ELECTRIC))
                flavors.push(Item.HERBA_MYSTICA_SOUR)
              if (pokemon.types.has(Synergy.GRASS))
                flavors.push(Item.HERBA_MYSTICA_BITTER)
              if (flavors.length === 0) flavors.push(Item.HERBA_MYSTICA_SALTY)
              meal = pickRandomIn(flavors)
            }
            pokemon.meal = meal
            pokemon.action = PokemonActionState.EAT
          }
        })
      }, 2000)
    }, 1000)
  }
})

export class FishingRodEffect extends OnStageStartEffect {
  constructor(rod: FishingRod) {
    super(({ player, room }) => {
      const isAfterPVE = room.state.stageLevel - 1 in PVEStages
      if (
        rod &&
        getFreeSpaceOnBench(player.board) > 0 &&
        !isAfterPVE &&
        room.state.stageLevel > 3 &&
        !player.isBot
      ) {
        const fish = room.state.shop.pickFish(player, rod)
        room.spawnOnBench(player, fish, "fishing")
      }
    })
  }
}

function dropComfey({ pokemon, board }: OnDeathEffectArgs) {
  const nearestAvailableCoordinate =
    pokemon.state.getNearestAvailablePlaceCoordinates(pokemon, board, 2)
  if (nearestAvailableCoordinate) {
    pokemon.removeItem(Item.COMFEY)
    pokemon.simulation.addPokemon(
      PokemonFactory.createPokemonFromName(Pkm.COMFEY, pokemon.player),
      nearestAvailableCoordinate.x,
      nearestAvailableCoordinate.y,
      pokemon.team,
      false
    )
  }
}

export const ItemEffects: { [i in Item]?: (Effect | (() => Effect))[] } = {
  ...Object.fromEntries(
    SynergyStones.map((stone) => [
      stone,
      [
        // prevent adding a synergy stone on a pokemon that already has this synergy
        new OnItemDroppedEffect(
          ({ pokemon, item }) => !pokemon.types.has(SynergyGivenByItem[item])
        )
      ]
    ])
  ),

  ...Object.fromEntries(
    [...TMs, ...HMs].map((tm) => [
      tm,
      [
        new OnItemDroppedEffect(({ pokemon, player, item }) => {
          const ability = AbilityPerTM[item]
          if (!ability || pokemon.types.has(Synergy.HUMAN) === false)
            return false // prevent equipping TMs/HMs on non-human pokemon
          pokemon.tm = ability
          pokemon.skill = ability
          pokemon.maxPP = 100
          removeInArray(player.items, item)
          const tmIndex = player.tms.findIndex((tm) => tm === item)
          if (tmIndex !== -1) {
            player.tms[tmIndex] = null
          }
          return false
        })
      ]
    ])
  ),

  [Item.RUSTED_SWORD]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAttack(pokemon.baseAtk * 0.5, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.baseAtk * 0.5, pokemon, 0, false)
    }),
    new OnDeathEffect(({ pokemon, board }) => {
      pokemon.items.delete(Item.RUSTED_SWORD)
      const alliesSortByLowestAtk = (
        board.cells.filter(
          (p) =>
            p &&
            p.team === pokemon.team &&
            p.id !== pokemon.id &&
            p.items.size < 3
        ) as PokemonEntity[]
      ).sort((a, b) => a.atk - b.atk)

      const swordReceiver = alliesSortByLowestAtk[0]
      if (swordReceiver) {
        swordReceiver.addItem(Item.RUSTED_SWORD)
      }
    })
  ],
  [Item.SOUL_DEW]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.effectsSet.add(new SoulDewEffect())
    }),
    new OnItemRemovedEffect((pokemon) => {
      for (const effect of pokemon.effectsSet) {
        if (effect instanceof SoulDewEffect) {
          pokemon.addAbilityPower(-5 * effect.count, pokemon, 0, false)
          pokemon.effectsSet.delete(effect)
          pokemon.count.soulDewCount = 0
          break
        }
      }
    })
  ],

  [Item.PUNCHING_GLOVE]: [
    new OnHitEffect(({ attacker, target, board }) => {
      target.handleDamage({
        damage: Math.round(0.08 * target.maxHP),
        board,
        attackType: AttackType.PHYSICAL,
        attacker,
        shouldTargetGainMana: true
      })
    })
  ],

  [Item.SHELL_BELL]: [
    new OnDamageDealtEffect(({ pokemon, damage }) => {
      pokemon.handleHeal(Math.ceil(0.33 * damage), pokemon, 0, false)
    })
  ],

  [Item.MAX_REVIVE]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.addResurrection(pokemon)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.resurrection = false
    })
  ],

  [Item.AIR_BALLOON]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addDodgeChance(0.1, pokemon, 0, false)
      pokemon.effects.add(EffectEnum.IMMUNITY_BOARD_EFFECTS)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addDodgeChance(-0.1, pokemon, 0, false)
      pokemon.effects.delete(EffectEnum.IMMUNITY_BOARD_EFFECTS)
    })
  ],

  [Item.FLAME_ORB]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.triggerBurn(
        60000,
        pokemon as PokemonEntity,
        pokemon as PokemonEntity
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.burnCooldown = 0
    })
  ],

  [Item.POKERUS_VIAL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerPokerus(pokemon)
    })
    // intentionally no item removal effect
  ],

  [Item.SAFETY_GOGGLES]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerRuneProtect(60000)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.runeProtectCooldown = 0
    })
  ],

  [Item.KINGS_ROCK]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addShield(0.35 * pokemon.baseHP, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addShield(-0.3 * pokemon.baseHP, pokemon, 0, false)
    })
  ],

  [Item.DYNAMAX_BAND]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addMaxHP(2 * pokemon.baseHP, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addMaxHP(-2 * pokemon.baseHP, pokemon, 0, false)
    })
  ],

  [Item.GOLD_BOTTLE_CAP]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addCritPower(pokemon.player?.money ?? 0, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addCritPower(-(pokemon.player?.money ?? 0), pokemon, 0, false)
    }),
    new OnKillEffect(({ attacker, board }) => {
      if (attacker.player) {
        const isLastEnemy =
          board.cells.some(
            (p) =>
              p &&
              p.team !== attacker.team &&
              (p.hp > 0 || p.status.resurrecting)
          ) === false
        attacker.count.bottleCapCount++
        const moneyGained = isLastEnemy ? attacker.count.bottleCapCount + 1 : 1
        attacker.player.addMoney(moneyGained, true, attacker)
        attacker.count.moneyCount += moneyGained
        if (isLastEnemy && attacker.count.bottleCapCount >= 10) {
          attacker.player.titles.add(Title.LUCKY)
        }
      }
    })
  ],

  [Item.REPEAT_BALL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addShield(
        Math.floor(
          ((pokemon.player?.rerollCount ?? 0) + pokemon.simulation.stageLevel) /
            2
        ) * 2,
        pokemon,
        0,
        false
      )
      pokemon.addSpeed(
        Math.floor(
          ((pokemon.player?.rerollCount ?? 0) + pokemon.simulation.stageLevel) /
            2
        ),
        pokemon,
        0,
        false
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAbilityPower(
        -Math.floor(
          ((pokemon.player?.rerollCount ?? 0) + pokemon.simulation.stageLevel) /
            2
        ),
        pokemon,
        0,
        false
      )
    })
  ],

  [Item.SACRED_ASH]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.addResurrection(pokemon)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.resurrection = false
    })
  ],

  [Item.UPGRADE]: [
    new OnAttackEffect(({ pokemon, target, board }) => {
      pokemon.addSpeed(5, pokemon, 0, false)
      pokemon.count.upgradeCount++
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addSpeed(-5 * pokemon.count.upgradeCount, pokemon, 0, false)
      pokemon.count.upgradeCount = 0
    })
  ],

  [Item.MUSCLE_BAND]: [
    new OnDamageReceivedEffect(({ pokemon, damage }) => {
      if (pokemon.count.defensiveRibbonCount < 20 && damage > 0) {
        pokemon.count.defensiveRibbonCount++
        if (pokemon.count.defensiveRibbonCount % 2 === 0) {
          pokemon.addAttack(1, pokemon, 0, false)
          pokemon.addDefense(2, pokemon, 0, false)
          pokemon.addSpeed(5, pokemon, 0, false)
        }
      }
    }),
    new OnItemRemovedEffect((pokemon) => {
      const stacks = Math.floor(pokemon.count.defensiveRibbonCount / 2)
      pokemon.addAttack(-stacks, pokemon, 0, false)
      pokemon.addDefense(-2 * stacks, pokemon, 0, false)
      pokemon.addSpeed(-5 * stacks, pokemon, 0, false)
      pokemon.count.defensiveRibbonCount = 0
    })
  ],

  [Item.DEEP_SEA_TOOTH]: [
    new OnAttackEffect(({ pokemon, target, board, hasAttackKilled }) => {
      pokemon.addPP(5, pokemon, 0, false)

      if (hasAttackKilled) {
        pokemon.addPP(15, pokemon, 0, false)
      }
    })
  ],

  [Item.AMULET_COIN]: [
    new OnKillEffect(({ attacker }) => {
      if (attacker.player) {
        attacker.player.addMoney(1, true, attacker)
        attacker.count.moneyCount += 1
        attacker.count.amuletCoinCount += 1
      }
    })
  ],

  [Item.SMOKE_BALL]: [smokeBallEffect],

  [Item.COMFEY]: [
    new OnItemGainedEffect((pokemon) => {
      const comfey = PokemonFactory.createPokemonFromName(Pkm.COMFEY)
      pokemon.addAbilityPower(comfey.ap, pokemon, 0, false)
      pokemon.addAttack(comfey.atk, pokemon, 0, false)
      pokemon.addSpeed(comfey.speed - DEFAULT_SPEED, pokemon, 0, false)
      pokemon.addMaxHP(comfey.maxHP, pokemon, 0, false)
      pokemon.addDefense(comfey.def, pokemon, 0, false)
      pokemon.addSpecialDefense(comfey.speDef, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      const comfey = PokemonFactory.createPokemonFromName(Pkm.COMFEY)
      pokemon.addAbilityPower(-comfey.ap, pokemon, 0, false)
      pokemon.addAttack(-comfey.atk, pokemon, 0, false)
      pokemon.addSpeed(-(comfey.speed - DEFAULT_SPEED), pokemon, 0, false)
      pokemon.addMaxHP(-comfey.maxHP, pokemon, 0, false)
      pokemon.addDefense(-comfey.def, pokemon, 0, false)
      pokemon.addSpecialDefense(-comfey.speDef, pokemon, 0, false)
    }),
    new OnAbilityCastEffect((pokemon, board, target, crit) => {
      if (pokemon.items.has(Item.COMFEY) === false) return
      AbilityStrategies[Ability.FLORAL_HEALING].process(
        pokemon,
        board,
        target,
        crit,
        true
      )
    }, Item.COMFEY),
    new OnResurrectEffect(dropComfey, Item.COMFEY),
    new OnDeathEffect(dropComfey, Item.COMFEY)
  ],

  [Item.ELECTIRIZER]: [
    new OnAttackEffect(({ pokemon, target, board }) => {
      if (target && pokemon.count.attackCount % 3 === 0) {
        target.status.triggerParalysis(2000, target, pokemon)
      }
    })
  ],

  [Item.TERRAIN_EXTENDER]: [
    new OnSimulationStartEffect(({ entity }) => {
      const terrainTypes = [
        Synergy.ELECTRIC,
        Synergy.GRASS,
        Synergy.PSYCHIC,
        Synergy.FAIRY
      ]
      const fieldEffect = values(entity.types).find((type) =>
        terrainTypes.includes(type)
      )
      switch (fieldEffect) {
        case Synergy.ELECTRIC:
          entity.status.addElectricField(entity)
          break
        case Synergy.GRASS:
          entity.status.addGrassField(entity)
          break
        case Synergy.PSYCHIC:
          entity.status.addPsychicField(entity)
          break
        case Synergy.FAIRY:
          entity.status.addFairyField(entity)
          break
      }
    }),
    new OnAbilityCastEffect((pokemon, board) => {
      board.cells.forEach((ally) => {
        if (ally && ally.team === pokemon.team && ally.id !== pokemon.id) {
          if (
            pokemon.status.electricField &&
            !ally.status.electricField &&
            ally.types.has(Synergy.ELECTRIC)
          ) {
            ally.status.addElectricField(ally)
          }
          if (
            pokemon.status.grassField &&
            !ally.status.grassField &&
            ally.types.has(Synergy.GRASS)
          ) {
            ally.status.addGrassField(ally)
          }
          if (
            pokemon.status.psychicField &&
            !ally.status.psychicField &&
            ally.types.has(Synergy.PSYCHIC)
          ) {
            ally.status.addPsychicField(ally)
          }
          if (
            pokemon.status.fairyField &&
            !ally.status.fairyField &&
            ally.types.has(Synergy.FAIRY)
          ) {
            ally.status.addFairyField(ally)
          }
        }
      })
    })
  ],

  [Item.RUNNING_SHOES]: [
    () => new RunningShoesOnMoveEffect(), // needs new instance of effect for each pokemon due to internal stack counter
    new OnItemRemovedEffect((pokemon) => {
      const stacks =
        Object.values(pokemon.effectsSet).find(
          (effect) => effect instanceof RunningShoesOnMoveEffect
        )?.stacks ?? 0
      pokemon.addSpeed(-5 * stacks, pokemon, 0, false)
    })
  ],

  [Item.REAPER_CLOTH]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.effects.add(EffectEnum.ABILITY_CRIT)
      if (AbilityStrategies[pokemon.skill].canCritByDefault) {
        pokemon.addCritPower(50, pokemon, 0, false)
      }
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.effects.delete(EffectEnum.ABILITY_CRIT)
      if (AbilityStrategies[pokemon.skill].canCritByDefault) {
        pokemon.addCritPower(-50, pokemon, 0, false)
      }
    })
  ],

  [Item.BLUE_ORB]: [blueOrbOnAttackEffect],

  [Item.LOADED_DICE]: [loadedDiceOnAttackEffect],

  [Item.STICKY_BARB]: [
    new OnAttackReceivedEffect(({ pokemon, attacker }) => {
      if (
        attacker &&
        attacker.items.has(Item.PROTECTIVE_PADS) === false &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          attacker.positionX,
          attacker.positionY
        ) === 1
      ) {
        const damage = Math.round(3 + 0.15 * pokemon.def)
        attacker.handleDamage({
          damage,
          board: pokemon.simulation.board,
          attackType: AttackType.TRUE,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        if (chance(0.3, pokemon)) {
          attacker.status.triggerWound(3000, attacker, pokemon)
        }
      }
    })
  ],

  [Item.AQUA_EGG]: [
    new OnAbilityCastEffect((pokemon) => {
      const ppRegained = max(pokemon.maxPP - 10)(
        Math.round(0.2 * pokemon.maxPP + 2 * pokemon.count.ult)
      )
      pokemon.addPP(ppRegained, pokemon, 0, false)
    })
  ],

  [Item.STAR_DUST]: [
    new OnAbilityCastEffect((pokemon) => {
      pokemon.addShield(Math.round(0.5 * pokemon.maxPP), pokemon, 0, false)
      pokemon.count.starDustCount++
    })
  ],

  [Item.LEPPA_BERRY]: [
    new OnAbilityCastEffect((pokemon) => {
      pokemon.eatBerry(Item.LEPPA_BERRY)
    })
  ],

  [Item.MAX_ELIXIR]: [
    new OnAbilityCastEffect((pokemon) => {
      if (pokemon.count.ult === 1) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.addPP(pokemon.maxPP, pokemon, 0, false)
            pokemon.removeItem(Item.MAX_ELIXIR, false)
          }, 1000)
        )
      }
    })
  ],

  [Item.ABSORB_BULB]: [
    new OnDamageReceivedEffect(({ pokemon, board }) => {
      if (pokemon.hp < 0.5 * pokemon.maxHP) {
        const damage =
          pokemon.physicalDamageReduced + pokemon.specialDamageReduced
        pokemon.broadcastAbility({ skill: Ability.EXPLOSION })
        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                false,
                false
              )
            }
          })
        pokemon.removeItem(Item.ABSORB_BULB)
      }
    })
  ],

  [Item.METEORITE]: [
    new OnItemDroppedEffect(({ pokemon, player }) => {
      if (pokemon?.passive === Passive.ALIEN_DNA) {
        if (pokemon.name === Pkm.DEOXYS) {
          player.transformPokemon(pokemon, Pkm.DEOXYS_ATTACK)
        } else if (pokemon.name === Pkm.DEOXYS_ATTACK) {
          player.transformPokemon(pokemon, Pkm.DEOXYS_DEFENSE)
        } else if (pokemon.name === Pkm.DEOXYS_DEFENSE) {
          player.transformPokemon(pokemon, Pkm.DEOXYS_SPEED)
        } else if (pokemon.name === Pkm.DEOXYS_SPEED) {
          player.transformPokemon(pokemon, Pkm.DEOXYS)
        }
      }
      return false // prevent item from being equipped
    })
  ],

  [Item.ROTOM_CATALOG]: [
    new OnItemDroppedEffect(({ pokemon, player }) => {
      if (pokemon?.passive === Passive.ROTOM) {
        if (pokemon.name === Pkm.ROTOM) {
          player.transformPokemon(pokemon, Pkm.ROTOM_HEAT)
        } else if (pokemon.name === Pkm.ROTOM_HEAT) {
          player.transformPokemon(pokemon, Pkm.ROTOM_WASH)
        } else if (pokemon.name === Pkm.ROTOM_WASH) {
          player.transformPokemon(pokemon, Pkm.ROTOM_FROST)
        } else if (pokemon.name === Pkm.ROTOM_FROST) {
          player.transformPokemon(pokemon, Pkm.ROTOM_FAN)
        } else if (pokemon.name === Pkm.ROTOM_FAN) {
          player.transformPokemon(pokemon, Pkm.ROTOM_MOW)
        } else if (pokemon.name === Pkm.ROTOM_MOW) {
          player.transformPokemon(pokemon, Pkm.ROTOM_DRONE)
        } else if (pokemon.name === Pkm.ROTOM_DRONE) {
          player.transformPokemon(pokemon, Pkm.ROTOM)
        }
      }
      return false // prevent item from being equipped
    })
  ],

  [Item.ZYGARDE_CUBE]: [
    new OnItemDroppedEffect(({ pokemon, player }) => {
      if (pokemon?.passive === Passive.ZYGARDE) {
        if (pokemon.name === Pkm.ZYGARDE_10) {
          player.transformPokemon(pokemon, Pkm.ZYGARDE_50)
        } else if (pokemon.name === Pkm.ZYGARDE_50) {
          player.transformPokemon(pokemon, Pkm.ZYGARDE_10)
        }
      }
      return false // prevent item from being equipped
    })
  ],

  [Item.TEAL_MASK]: [ogerponMaskEffect],
  [Item.WELLSPRING_MASK]: [ogerponMaskEffect],
  [Item.CORNERSTONE_MASK]: [ogerponMaskEffect],
  [Item.HEARTHFLAME_MASK]: [ogerponMaskEffect],

  [Item.FIRE_SHARD]: [
    new OnItemDroppedEffect(({ pokemon, player, item }) => {
      if (pokemon.types.has(Synergy.FIRE) && player.life > 3) {
        pokemon.atk += 3
        pokemon.speed += 3
        player.life = min(1)(player.life - 3)
        removeInArray(player.items, item)
      }

      return false // prevent item from being equipped
    })
  ],

  [Item.CELL_BATTERY]: [
    new OnItemDroppedEffect(({ pokemon, player, item }) => {
      if (pokemon.types.has(Synergy.ELECTRIC) && !pokemon.supercharged) {
        pokemon.supercharged = true
        removeInArray(player.items, item)
      }

      return false // prevent item from being equipped
    })
  ],

  [Item.RECYCLE_TICKET]: [
    new OnItemDroppedEffect(({ pokemon, player, item }) => {
      let consummed = false
      pokemon.items.forEach((heldItem) => {
        const recipe = ItemRecipe[heldItem]
        if (recipe) {
          player.items.push(...recipe)
          pokemon.removeItem(heldItem, player)
          consummed = true
        }
      })

      if (consummed) {
        removeInArray(player.items, item)
      }

      return false // prevent item from being equipped
    })
  ],

  [Item.CHEF_HAT]: [
    chefCookEffect,
    new OnItemDroppedEffect(({ pokemon }) => {
      const canEquip = pokemon.types.has(Synergy.GOURMET)
      return canEquip
    })
  ],

  [Item.EVIOLITE]: [
    new OnItemDroppedEffect(({ pokemon, player, item }) => {
      const canEquip = pokemon.hasEvolution
      return canEquip
    })
  ],

  [Item.PICNIC_SET]: [
    new OnItemDroppedEffect(({ pokemon, player, item }) => {
      if (pokemon.meal == "") {
        let nbSandwiches = 0
        values(player.board).forEach((pkm) => {
          if (
            pkm.meal === "" &&
            pkm.canEat &&
            pokemon &&
            distanceC(
              pkm.positionX,
              pkm.positionY,
              pokemon.positionX,
              pokemon.positionY
            ) <= 1
          ) {
            pkm.meal = Item.SANDWICH
            pkm.action = PokemonActionState.EAT
            nbSandwiches++
          }
        })
        removeInArray(player.items, item)
        if (nbSandwiches >= 9) {
          player.titles.add(Title.PICNICKER)
        }
      }

      return false // prevent item from being equipped
    })
  ],

  ...Object.fromEntries(
    Flavors.map((flavor) => [
      flavor,
      [
        new OnItemDroppedEffect(
          ({ pokemon }) => pokemon.skill === Ability.DECORATE
        ) // is then consummed by ItemEvolutionRule
      ]
    ])
  ),

  [Item.BLACK_AUGURITE]: [
    new OnItemDroppedEffect(({ pokemon, player, item, room }) => {
      return pokemon.passive === Passive.SCYTHER // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.MALICIOUS_ARMOR]: [
    new OnItemDroppedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.CHARCADET // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.AUSPICIOUS_ARMOR]: [
    new OnItemDroppedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.CHARCADET // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.SCROLL_OF_DARKNESS]: [
    new OnItemDroppedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.KUBFU // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.SCROLL_OF_WATERS]: [
    new OnItemDroppedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.KUBFU // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.RARE_CANDY]: [
    new OnItemDroppedEffect(({ pokemon, player, room, item }) => {
      const evolution = pokemon.evolutionRule?.getEvolution(pokemon, player)
      if (
        !evolution ||
        evolution === Pkm.DEFAULT ||
        pokemon.items.has(Item.EVIOLITE) ||
        pokemon.items.size >= 3
      ) {
        return false // prevent item from being equipped
      }
      const pokemonEvolved = player.transformPokemon(pokemon, evolution)
      pokemon.afterEvolve({
        pokemonEvolved,
        pokemonsBeforeEvolution: [pokemon],
        player
      })

      pokemonEvolved.items.add(item)
      removeInArray(player.items, item)
      if (pokemonEvolved.items.has(Item.SHINY_CHARM)) {
        pokemonEvolved.shiny = true
      }

      room.checkEvolutionsAfterItemAcquired(player.id, pokemon)
      player.updateSynergies()
      return false // prevent default logic after item equipped due to pokemon having evolved
    })
  ],

  [Item.OLD_ROD]: [new FishingRodEffect(Item.OLD_ROD)],
  [Item.GOOD_ROD]: [new FishingRodEffect(Item.GOOD_ROD)],
  [Item.SUPER_ROD]: [new FishingRodEffect(Item.SUPER_ROD)],

  [Item.AMAZE_MULCH]: [
    new OnItemDroppedEffect(({ pokemon, player, item }) => {
      if (FlowerPotMons.includes(pokemon.name)) {
        pokemon.addMaxHP(50, player)
        pokemon.ap += 30
        removeInArray(player.items, item)
      }
      return false // prevent item from being equipped
    })
  ],

  [Item.BRONZE_DOJO_TICKET]: [new DojoTicketOnItemDroppedEffect(1)],
  [Item.SILVER_DOJO_TICKET]: [new DojoTicketOnItemDroppedEffect(2)],
  [Item.GOLD_DOJO_TICKET]: [new DojoTicketOnItemDroppedEffect(3)],

  ...Object.fromEntries(
    MemoryDiscs.map((memory) => [
      memory,
      [
        new OnItemDroppedEffect(
          ({ pokemon }) => PkmFamily[pokemon.name] === Pkm.TYPE_NULL
        )
      ]
    ])
  ),
  [Item.SPELL_TAG]: [
    new OnDeathEffect(({ attacker }) => {
      attacker?.status.triggerCurse(9000, attacker)
    })
  ]
}
