import PokemonFactory from "../../models/pokemon-factory"
import { Title } from "../../types"
import { ARMOR_FACTOR, DEFAULT_SPEED } from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, PokemonActionState } from "../../types/enum/Game"
import { AbilityPerTM, Flavors, HMs, Item, OgerponMasks, SynergyGivenByItem, SynergyStones, TMs } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { removeInArray } from "../../utils/array"
import { distanceC } from "../../utils/distance"
import { max, min } from "../../utils/number"
import { chance } from "../../utils/random"
import { values } from "../../utils/schemas"
import { AbilityStrategies } from "../abilities/abilities"
import { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import {
  Effect,
  OnAbilityCastEffect,
  OnAttackEffect,
  OnDamageReceivedEffect,
  OnHitEffect,
  OnItemEquippedEffect,
  OnItemGainedEffect,
  OnItemRemovedEffect,
  OnKillEffect,
  PeriodicEffect
} from "./effect"

export const blueOrbOnAttackEffect = new OnAttackEffect(
  ({ pokemon, target, board }) => {
    pokemon.count.staticHolderCount++
    if (pokemon.count.staticHolderCount >= 4) {
      pokemon.count.staticHolderCount = 0
      const nbBounces = 2
      const closestEnemies = new Array<PokemonEntity>()
      board.forEach(
        (x: number, y: number, enemy: PokemonEntity | undefined) => {
          if (enemy && pokemon.team !== enemy.team) {
            closestEnemies.push(enemy)
          }
        }
      )
      closestEnemies.sort((a, b) => {
        const distanceA = distanceC(
          a.positionX,
          a.positionY,
          pokemon.positionX,
          pokemon.positionY
        )
        const distanceB = distanceC(
          b.positionX,
          b.positionY,
          pokemon.positionX,
          pokemon.positionY
        )
        return distanceA - distanceB
      })

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
            false
          )
          secondaryTargetHit.addPP(-20, pokemon, 0, false)
          secondaryTargetHit.count.manaBurnCount++
          previousTg = secondaryTargetHit
        } else {
          break
        }
      }
    }
  }
)

export const choiceScarfOnAttackEffect = new OnAttackEffect(
  ({
    pokemon,
    target,
    board,
    totalDamage,
    physicalDamage,
    specialDamage,
    trueDamage
  }) => {
    if (totalDamage > 0 && target) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const candidateTargets = cells
        .filter((cell) => cell.value && pokemon.team != cell.value.team)
        .map((cell) => cell.value!)
      candidateTargets.sort((a, b) => a.life - b.life) // target lowest life first

      let targetCount = 1
      candidateTargets.forEach((target) => {
        if (targetCount > 0) {
          let totalTakenDamage = 0
          if (physicalDamage > 0) {
            const { takenDamage } = target.handleDamage({
              damage: Math.ceil(0.5 * physicalDamage),
              board,
              attackType: AttackType.PHYSICAL,
              attacker: pokemon,
              shouldTargetGainMana: true
            })
            totalTakenDamage += takenDamage
          }
          if (specialDamage > 0) {
            const scarfSpecialDamage = Math.ceil(0.5 * specialDamage)
            const { takenDamage } = target.handleDamage({
              damage: scarfSpecialDamage,
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
                scarfSpecialDamage / (1 + ARMOR_FACTOR * speDef)
              const damageBlocked = min(0)(
                scarfSpecialDamage - damageAfterReduction
              )
              pokemon.handleDamage({
                damage: Math.round(damageBlocked),
                board,
                attackType: AttackType.SPECIAL,
                attacker: target,
                shouldTargetGainMana: true
              })
            }
          }
          if (trueDamage > 0) {
            const { takenDamage } = target.handleDamage({
              damage: Math.ceil(0.5 * trueDamage),
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

          targetCount--
        }
      })
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

const smokeBallEffect = new OnDamageReceivedEffect(({ pokemon, board }) => {
  if (pokemon.life > 0 && pokemon.life < 0.4 * pokemon.hp) {
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

const ogerponMaskEffect = new OnItemEquippedEffect(({ pokemon, player, item }) => {
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
})

export const ItemEffects: { [i in Item]?: Effect[] } = {

  ...Object.fromEntries(SynergyStones.map((stone) => [stone, [
    // prevent adding a synergy stone on a pokemon that already has this synergy
    new OnItemEquippedEffect(({ pokemon, item }) => !pokemon.types.has(SynergyGivenByItem[item]))
  ]])),

  ...Object.fromEntries([...TMs, ...HMs].map(tm => [tm, [
    new OnItemEquippedEffect(({ pokemon, player, item }) => {
      const ability = AbilityPerTM[item]
      if (!ability || pokemon.types.has(Synergy.HUMAN) === false) return false // prevent equipping TMs/HMs on non-human pokemon
      pokemon.tm = ability
      pokemon.skill = ability
      pokemon.maxPP = 100
      removeInArray(player.items, item)
      const tmIndex = player.tms.findIndex((tm) => tm === item)
      if (tmIndex !== -1) {
        player.tms[tmIndex] = null
      }
      return true
    })
  ]])),

  [Item.RUSTED_SWORD]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAttack(pokemon.baseAtk * 0.5, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.baseAtk * 0.5, pokemon, 0, false)
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
        damage: Math.round(0.08 * target.hp),
        board,
        attackType: AttackType.PHYSICAL,
        attacker,
        shouldTargetGainMana: true
      })
    })
  ],

  [Item.WIDE_LENS]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.range += 2
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.range = min(1)(pokemon.range - 2)
    })
  ],

  [Item.MAX_REVIVE]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.addResurrection(pokemon)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.resurection = false
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

  [Item.TOXIC_ORB]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addAttack(pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.triggerPoison(
        60000,
        pokemon as PokemonEntity,
        pokemon as PokemonEntity
      )
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.baseAtk, pokemon, 0, false)
      pokemon.status.poisonCooldown = 0
    })
  ],

  [Item.POKERUS_VIAL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerPokerus(pokemon)
    })
    // intentionally no item removal effect
  ],

  [Item.FLUFFY_TAIL]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.status.triggerRuneProtect(60000)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.status.runeProtectCooldown = 0
    })
  ],

  [Item.KINGS_ROCK]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addShield(0.3 * pokemon.baseHP, pokemon, 0, false)
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
    new OnKillEffect((pokemon, target, board, attackType) => {
      if (pokemon.player) {
        const isLastEnemy =
          board.cells.some(
            (p) =>
              p &&
              p.team !== pokemon.team &&
              (p.life > 0 || p.status.resurecting)
          ) === false
        pokemon.count.bottleCapCount++
        const moneyGained = isLastEnemy ? pokemon.count.bottleCapCount + 1 : 1
        pokemon.player.addMoney(moneyGained, true, pokemon)
        pokemon.count.moneyCount += moneyGained
        if (isLastEnemy && pokemon.count.bottleCapCount >= 10) {
          pokemon.player.titles.add(Title.LUCKY)
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
      pokemon.status.resurection = false
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
      if (
        pokemon.count.defensiveRibbonCount < 20 &&
        damage > 0
      ) {
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
    new OnKillEffect((pokemon) => {
      if (pokemon.player) {
        pokemon.player.addMoney(1, true, pokemon)
        pokemon.count.moneyCount += 1
        pokemon.count.amuletCoinCount += 1
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
      pokemon.addMaxHP(comfey.hp, pokemon, 0, false)
      pokemon.addDefense(comfey.def, pokemon, 0, false)
      pokemon.addSpecialDefense(comfey.speDef, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      const comfey = PokemonFactory.createPokemonFromName(Pkm.COMFEY)
      pokemon.addAbilityPower(-comfey.ap, pokemon, 0, false)
      pokemon.addAttack(-comfey.atk, pokemon, 0, false)
      pokemon.addSpeed(-(comfey.speed - DEFAULT_SPEED), pokemon, 0, false)
      pokemon.addMaxHP(-comfey.hp, pokemon, 0, false)
      pokemon.addDefense(-comfey.def, pokemon, 0, false)
      pokemon.addSpecialDefense(-comfey.speDef, pokemon, 0, false)
    }),
    new OnAbilityCastEffect((pokemon, board, target, crit) => {
      AbilityStrategies[Ability.FLORAL_HEALING].process(
        pokemon,
        board,
        target,
        crit,
        true
      )
    })
  ],

  [Item.MAGMARIZER]: [
    new OnAttackEffect(({ pokemon, target, board }) => {
      pokemon.addAttack(1, pokemon, 0, false)
      pokemon.count.magmarizerCount++
    }),
    new OnHitEffect(({ attacker, target }) => {
      target.status.triggerBurn(2000, target, attacker)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addAttack(-pokemon.count.magmarizerCount, pokemon, 0, false)
      pokemon.count.magmarizerCount = 0
    })
  ],

  [Item.ELECTIRIZER]: [
    new OnAttackEffect(({ pokemon, target, board }) => {
      if (target && pokemon.count.attackCount % 3 === 0) {
        target.addPP(-15, pokemon, 0, false)
        target.count.manaBurnCount++
        target.status.triggerParalysis(2000, target, pokemon)
      }
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

  [Item.CHOICE_SCARF]: [choiceScarfOnAttackEffect],

  [Item.STICKY_BARB]: [
    new OnDamageReceivedEffect(({ pokemon, attacker, attackType }) => {
      if (attackType === AttackType.PHYSICAL
        && attacker
        && attacker.items.has(Item.PROTECTIVE_PADS) === false
        && distanceC(
          pokemon.positionX,
          pokemon.positionY,
          attacker.positionX,
          attacker.positionY
        ) === 1) {
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
      const ppRegained = max(pokemon.maxPP - 10)(Math.round(0.2 * pokemon.maxPP + 2 * pokemon.count.ult))
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
      if (pokemon.life < 0.5 * pokemon.hp) {
        const damage = pokemon.physicalDamageReduced + pokemon.specialDamageReduced
        pokemon.broadcastAbility({ skill: Ability.EXPLOSION })
        board.getAdjacentCells(pokemon.positionX, pokemon.positionY).forEach((cell) => {
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
    new OnItemEquippedEffect(({ pokemon, player }) => {
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

  [Item.ZYGARDE_CUBE]: [
    new OnItemEquippedEffect(({ pokemon, player }) => {
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
    new OnItemEquippedEffect(({ pokemon, player, item }) => {
      if (pokemon.types.has(Synergy.FIRE) && player.life > 3) {
        pokemon.atk += 3
        pokemon.speed += 3
        player.life = min(1)(player.life - 3)
        removeInArray(player.items, item)
      }

      return false // prevent item from being equipped
    })
  ],

  [Item.CHEF_HAT]: [
    new OnItemEquippedEffect(({ pokemon, player, item }) => {
      return pokemon.types.has(Synergy.GOURMET)
    })
  ],

  [Item.EVIOLITE]: [
    new OnItemEquippedEffect(({ pokemon, player, item }) => {
      return pokemon.hasEvolution
    })
  ],

  [Item.PICNIC_SET]: [
    new OnItemEquippedEffect(({ pokemon, player, item }) => {
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

  ...Object.fromEntries(Flavors.map((flavor) => [flavor, [
    new OnItemEquippedEffect(({ pokemon }) => pokemon.skill === Ability.DECORATE) // is then consummed by ItemEvolutionRule
  ]])),

  [Item.BLACK_AUGURITE]: [
    new OnItemEquippedEffect(({ pokemon, player, item, room }) => {
      return pokemon.passive === Passive.SCYTHER // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.MALICIOUS_ARMOR]: [
    new OnItemEquippedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.CHARCADET // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.AUSPICIOUS_ARMOR]: [
    new OnItemEquippedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.CHARCADET // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.SCROLL_OF_DARKNESS]: [
    new OnItemEquippedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.KUBFU // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.SCROLL_OF_WATERS]: [
    new OnItemEquippedEffect(({ pokemon, player, room, item }) => {
      return pokemon.passive === Passive.KUBFU // is then consummed by ItemEvolutionRule
    })
  ],

  [Item.RARE_CANDY]: [
    new OnItemEquippedEffect(({ pokemon, player, room, item }) => {
      const evolution = pokemon.evolutionRule?.getEvolution(pokemon, player)
      if (
        !evolution ||
        evolution === Pkm.DEFAULT ||
        pokemon.items.has(Item.EVIOLITE)
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
  ]
}
