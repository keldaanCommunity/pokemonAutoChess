import PokemonFactory from "../../models/pokemon-factory"
import { Transfer } from "../../types"
import { DEFAULT_SPEED } from "../../types/Config"
import { AttackType } from "../../types/enum/Game"
import { EffectEnum } from "../../types/enum/Effect"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"
import { distanceC } from "../../utils/distance"
import { min } from "../../utils/number"
import { PokemonEntity } from "../pokemon-entity"
import {
  Effect,
  OnAbilityCastEffect,
  OnAttackEffect,
  OnItemGainedEffect,
  OnItemRemovedEffect,
  OnKillEffect,
  PeriodicEffect
} from "./effect"
import { AbilityStrategies } from "../abilities/abilities"
import { DelayedCommand } from "../simulation-command"
import { Ability } from "../../types/enum/Ability"

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
          pokemon.simulation.room.broadcast(Transfer.ABILITY, {
            id: pokemon.simulation.id,
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
            const { takenDamage } = target.handleDamage({
              damage: Math.ceil(0.5 * specialDamage),
              board,
              attackType: AttackType.SPECIAL,
              attacker: pokemon,
              shouldTargetGainMana: true
            })
            totalTakenDamage += takenDamage
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
        pokemon.addAbilityPower(10, pokemon, 0, false)
        pokemon.count.soulDewCount++
      },
      Item.SOUL_DEW,
      1000
    )
  }
}

export const ItemEffects: { [i in Item]?: Effect[] } = {
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
          pokemon.addAbilityPower(-10 * effect.count, pokemon, 0, false)
          pokemon.effectsSet.delete(effect)
          pokemon.count.soulDewCount = 0
          break
        }
      }
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

  [Item.SWIFT_WING]: [
    new OnItemGainedEffect((pokemon) => {
      pokemon.addDodgeChance(0.1, pokemon, 0, false)
    }),
    new OnItemRemovedEffect((pokemon) => {
      pokemon.addDodgeChance(-0.1, pokemon, 0, false)
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
    new OnItemRemovedEffect((pokemon) => {
      const stacks = Math.floor(pokemon.count.defensiveRibbonCount / 2)
      pokemon.addAttack(-stacks, pokemon, 0, false)
      pokemon.addDefense(-2 * stacks, pokemon, 0, false)
      pokemon.addSpeed(-5 * stacks, pokemon, 0, false)
      pokemon.count.defensiveRibbonCount = 0
    })
  ],

  [Item.MANA_SCARF]: [
    new OnAttackEffect(({ pokemon, target, board }) => {
      pokemon.addPP(8, pokemon, 0, false)
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

  [Item.AQUA_EGG]: [
    new OnAbilityCastEffect((pokemon) => {
      pokemon.addPP(20, pokemon, 0, false)
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
  ]
}
