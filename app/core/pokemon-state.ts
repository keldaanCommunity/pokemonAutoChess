import Player from "../models/colyseus-models/player"
import { SynergyEffects } from "../models/effects"
import { IPokemonEntity, Transfer } from "../types"
import { ARMOR_FACTOR, FIGHTING_PHASE_DURATION } from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { EffectEnum } from "../types/enum/Effect"
import {
  AttackType,
  HealType,
  PokemonActionState,
  Stat,
  Team
} from "../types/enum/Game"
import { Item } from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Pkm, PkmIndex } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { Weather } from "../types/enum/Weather"
import { count } from "../utils/array"
import { distanceC, distanceM } from "../utils/distance"
import { logger } from "../utils/logger"
import { max, min } from "../utils/number"
import { chance, pickRandomIn } from "../utils/random"
import { broadcastAbility } from "./abilities/abilities"
import Board, { Cell } from "./board"
import { PeriodicEffect, StoneEdgeEffect } from "./effects/effect"
import { PokemonEntity } from "./pokemon-entity"

export default abstract class PokemonState {
  name: string = ""

  attack(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity | null,
    isTripleAttack = false
  ) {
    if (target && target.life > 0) {
      let damage = pokemon.atk
      let physicalDamage = 0
      let specialDamage = 0
      let trueDamage = 0
      let totalTakenDamage = 0
      let attackType = pokemon.attackType

      if (chance(pokemon.critChance / 100, pokemon)) {
        if (target.items.has(Item.ROCKY_HELMET) === false) {
          let opponentCritPower = pokemon.critPower
          if (target.effects.has(EffectEnum.BATTLE_ARMOR)) {
            opponentCritPower -= 0.3
          } else if (target.effects.has(EffectEnum.MOUTAIN_RESISTANCE)) {
            opponentCritPower -= 0.5
          } else if (target.effects.has(EffectEnum.DIAMOND_STORM)) {
            opponentCritPower -= 0.7
          }
          const nbBlackAugurite = target.player
            ? count(target.player.items, Item.BLACK_AUGURITE)
            : 0
          opponentCritPower -= 0.1 * nbBlackAugurite
          damage = min(0)(Math.round(damage * opponentCritPower))
          target.count.crit++
        }
        pokemon.onCriticalAttack({ target, board, damage })
      }

      if (pokemon.items.has(Item.PUNCHING_GLOVE)) {
        damage = Math.round(damage + target.hp * 0.08)
      }

      if (pokemon.attackType === AttackType.SPECIAL) {
        damage = Math.ceil(damage * (1 + pokemon.ap / 100))
      }

      if (pokemon.effects.has(EffectEnum.STONE_EDGE)) {
        let crit = 1
        pokemon.effectsSet.forEach((effect) => {
          if (effect instanceof StoneEdgeEffect) {
            if (effect.crit) {
              crit = pokemon.critPower
            }
          }
        })
        damage += Math.round(pokemon.def * (1 + pokemon.ap / 100) * crit)
      }

      let additionalSpecialDamagePart = 0
      if (pokemon.effects.has(EffectEnum.AROMATIC_MIST)) {
        additionalSpecialDamagePart += 0.2
      } else if (pokemon.effects.has(EffectEnum.FAIRY_WIND)) {
        additionalSpecialDamagePart += 0.4
      } else if (pokemon.effects.has(EffectEnum.STRANGE_STEAM)) {
        additionalSpecialDamagePart += 0.6
      } else if (pokemon.effects.has(EffectEnum.MOON_FORCE)) {
        additionalSpecialDamagePart += 0.8
      }

      if (pokemon.effects.has(EffectEnum.CHARGE)) {
        additionalSpecialDamagePart +=
          1 * pokemon.count.ult * (1 + pokemon.ap / 100)
      }

      let isAttackSuccessful = true
      let dodgeChance = target.dodge
      if (pokemon.status.blinded) {
        dodgeChance += 0.5
      }

      if (
        chance(dodgeChance, target, 0.9) &&
        !pokemon.items.has(Item.XRAY_VISION) &&
        !pokemon.effects.has(EffectEnum.LOCK_ON) &&
        !target.status.paralysis &&
        !target.status.sleep &&
        !target.status.freeze
      ) {
        isAttackSuccessful = false
        damage = 0
        target.count.dodgeCount += 1
      }

      if (target.status.protect || target.status.skydiving) {
        isAttackSuccessful = false
        damage = 0
      }

      if (additionalSpecialDamagePart > 0) {
        specialDamage += Math.ceil(damage * additionalSpecialDamagePart)
      }

      if (pokemon.passive === Passive.SPOT_PANDA && target.status.confusion) {
        specialDamage += 1 * damage * (1 + pokemon.ap / 100)
      }

      if (target.effects.has(EffectEnum.WONDER_ROOM)) {
        damage = Math.ceil(damage * (1 + pokemon.ap / 100))
        attackType = AttackType.SPECIAL
      }

      let trueDamagePart = 0
      if (pokemon.effects.has(EffectEnum.STEEL_SURGE)) {
        trueDamagePart += 0.33
      } else if (pokemon.effects.has(EffectEnum.STEEL_SPIKE)) {
        trueDamagePart += 0.66
      } else if (pokemon.effects.has(EffectEnum.CORKSCREW_CRASH)) {
        trueDamagePart += 1.0
      } else if (pokemon.effects.has(EffectEnum.MAX_MELTDOWN)) {
        trueDamagePart += 1.2
      }
      if (pokemon.items.has(Item.RED_ORB) && target) {
        trueDamagePart += 0.25
      }
      if (pokemon.effects.has(EffectEnum.LOCK_ON) && target) {
        trueDamagePart += 2.0 * (1 + pokemon.ap / 100)
        pokemon.effects.delete(EffectEnum.LOCK_ON)
      }

      if (trueDamagePart > 0) {
        // Apply true damage part
        trueDamage = Math.ceil(damage * trueDamagePart)
        damage = min(0)(damage * (1 - trueDamagePart))

        const { takenDamage } = target.handleDamage({
          damage: trueDamage,
          board,
          attackType: AttackType.TRUE,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      if (attackType === AttackType.SPECIAL) {
        specialDamage += damage
      } else {
        physicalDamage = damage
      }

      if (physicalDamage > 0) {
        // Apply attack physical damage
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
        // Apply special damage
        const { takenDamage } = target.handleDamage({
          damage: specialDamage,
          board,
          attackType: AttackType.SPECIAL,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      const totalDamage = physicalDamage + specialDamage + trueDamage
      pokemon.onAttack({
        target,
        board,
        physicalDamage,
        specialDamage,
        trueDamage,
        totalDamage,
        isTripleAttack
      })
      if (isAttackSuccessful) {
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

  handleHeal(
    pokemon: PokemonEntity,
    heal: number,
    caster: PokemonEntity,
    apBoost: number,
    crit: boolean
  ): void {
    if (pokemon.status.wound) {
      if (
        pokemon.simulation.weather === Weather.BLOODMOON &&
        pokemon.player &&
        pokemon.player.items.includes(Item.BLOOD_STONE)
      ) {
        const nbBloodStones = count(pokemon.player.items, Item.BLOOD_STONE)
        if (nbBloodStones > 0) {
          pokemon.addShield(
            Math.round(0.3 * nbBloodStones * heal),
            pokemon,
            apBoost,
            crit
          )
        }
      }
      return
    }
    if (
      pokemon.life > 0 &&
      pokemon.life < pokemon.hp &&
      !pokemon.status.protect
    ) {
      if (apBoost > 0) {
        heal *= 1 + (apBoost * caster.ap) / 100
      }
      if (crit) {
        heal *= caster.critPower
      }
      if (pokemon.effects.has(EffectEnum.BUFF_HEAL_RECEIVED)) {
        heal *= 1.3
      }
      if (pokemon.status.burn) {
        heal *= 0.5
      }
      if (pokemon.status.enraged) {
        heal *= 0.5
      }

      heal = Math.round(heal)
      const healTaken = Math.min(pokemon.hp - pokemon.life, heal)

      pokemon.life = Math.min(pokemon.hp, pokemon.life + heal)

      if (caster && healTaken > 0) {
        if (pokemon.simulation.room.state.time < FIGHTING_PHASE_DURATION) {
          pokemon.simulation.room.broadcast(Transfer.POKEMON_HEAL, {
            index: caster.index,
            type: HealType.HEAL,
            amount: healTaken,
            x: pokemon.positionX,
            y: pokemon.positionY,
            id: pokemon.simulation.id
          })
        }
        caster.healDone += healTaken
      }
    }
  }

  addShield(
    pokemon: IPokemonEntity,
    shield: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    if (pokemon.life > 0) {
      if (apBoost > 0) shield *= 1 + (caster.ap * apBoost) / 100
      if (crit) shield *= caster.critPower
      if (pokemon.status.enraged) shield *= 0.5
      if (pokemon.items.has(Item.SILK_SCARF)) shield *= 1.5

      shield = Math.round(shield)
      pokemon.shield = min(0)(pokemon.shield + shield)
      if (caster && shield > 0) {
        if (pokemon.simulation.room.state.time < FIGHTING_PHASE_DURATION) {
          pokemon.simulation.room.broadcast(Transfer.POKEMON_HEAL, {
            index: caster.index,
            type: HealType.SHIELD,
            amount: shield,
            x: pokemon.positionX,
            y: pokemon.positionY,
            id: pokemon.simulation.id
          })
        }
        caster.shieldDone += shield
      }
    }
  }

  handleDamage({
    target: pokemon,
    damage,
    board,
    attackType,
    attacker,
    shouldTargetGainMana
  }: {
    target: PokemonEntity
    damage: number
    board: Board
    attackType: AttackType
    attacker: PokemonEntity | null
    shouldTargetGainMana: boolean
  }): { death: boolean; takenDamage: number } {
    let death = false
    let takenDamage = 0

    if (isNaN(damage)) {
      logger.trace(
        `NaN Damage from ${attacker ? attacker.name : "Environment"}`
      )
      return { death: false, takenDamage: 0 }
    }

    if (pokemon.life <= 0 || pokemon.status.resurecting) {
      pokemon.status.possessedCooldown = 0
      return { death: false, takenDamage: 0 }
    }

    if (attacker && attacker.status.enraged) {
      damage *= 2
    }

    if (pokemon.status.protect || pokemon.status.skydiving) {
      death = false
      takenDamage = 0
    } else {
      if (attacker && attacker.status.electricField) {
        damage = Math.ceil(damage * 1.2)
      }

      if (attacker && attacker.status.psychicField) {
        damage = Math.ceil(damage * 1.2)
      }

      if (attacker && attacker.status.grassField) {
        damage = Math.ceil(damage * 1.2)
      }

      if (attacker && attacker.status.fairyField) {
        damage = Math.ceil(damage * 1.2)
      }

      if (
        attacker &&
        attacker.passive === Passive.HISUIAN_TYPHLOSION &&
        (pokemon.status.burn || pokemon.status.silence)
      ) {
        damage = Math.ceil(damage * 1.2)
      }

      if (
        pokemon.simulation.weather === Weather.MISTY &&
        attackType === AttackType.SPECIAL
      ) {
        damage = Math.ceil(damage * 1.2)
      }

      if (
        pokemon.simulation.weather === Weather.BLOODMOON &&
        attackType === AttackType.PHYSICAL
      ) {
        damage = Math.ceil(damage * 1.2)
      }

      if (
        pokemon.status.freeze &&
        attacker &&
        attacker.effects.has(EffectEnum.SHEER_COLD)
      ) {
        damage = Math.ceil(damage * 1.3)
      }

      let def = pokemon.status.armorReduction
        ? Math.round(pokemon.def / 2)
        : pokemon.def
      let speDef = pokemon.status.armorReduction
        ? Math.round(pokemon.speDef / 2)
        : pokemon.speDef

      if (pokemon.effects.has(EffectEnum.WONDER_ROOM)) {
        const swap = def
        def = speDef
        speDef = swap
      }

      if (pokemon.status.reflect && attackType === AttackType.PHYSICAL) {
        if (attacker && attacker.items.has(Item.PROTECTIVE_PADS) === false) {
          const crit =
            pokemon.effects.has(EffectEnum.ABILITY_CRIT) &&
            chance(pokemon.critChance, pokemon)
          const reflectDamage = Math.round(0.5 * damage * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1))
          attacker.handleDamage({
            damage: reflectDamage,
            board,
            attackType: AttackType.PHYSICAL,
            attacker: pokemon,
            shouldTargetGainMana: true
          })
        }
        return { death: false, takenDamage: 0 }
      }

      let reducedDamage = damage
      if (attackType == AttackType.PHYSICAL) {
        reducedDamage = damage / (1 + ARMOR_FACTOR * def)
      } else if (attackType == AttackType.SPECIAL) {
        reducedDamage = damage / (1 + ARMOR_FACTOR * speDef)
      } else if (attackType == AttackType.TRUE) {
        reducedDamage = damage
      }

      if (attackType !== AttackType.TRUE) {
        // damage reduction
        if (pokemon.items.has(Item.POKE_DOLL)) {
          reducedDamage = Math.ceil(reducedDamage * 0.7)
        }

        if (
          pokemon.effects.has(EffectEnum.GUTS) ||
          pokemon.effects.has(EffectEnum.STURDY) ||
          pokemon.effects.has(EffectEnum.DEFIANT) ||
          pokemon.effects.has(EffectEnum.JUSTIFIED)
        ) {
          const damageBlocked = pokemon.effects.has(EffectEnum.JUSTIFIED)
            ? 13
            : pokemon.effects.has(EffectEnum.DEFIANT)
              ? 10
              : pokemon.effects.has(EffectEnum.STURDY)
                ? 7
                : 4
          reducedDamage = reducedDamage - damageBlocked
          pokemon.count.fightingBlockCount++
        }

        if (pokemon.passive === Passive.WONDER_GUARD) {
          const damageBlocked = 20
          reducedDamage = reducedDamage - damageBlocked
        }
      }

      reducedDamage = min(1)(reducedDamage) // should deal 1 damage at least

      if (attackType === AttackType.PHYSICAL) {
        pokemon.physicalDamageReduced += min(0)(damage - reducedDamage)
      } else if (attackType === AttackType.SPECIAL) {
        pokemon.specialDamageReduced += min(0)(damage - reducedDamage)

        if (attacker && attacker.items.has(Item.POKEMONOMICON)) {
          pokemon.status.triggerBurn(3000, pokemon, attacker)
        }
      }

      if (isNaN(reducedDamage)) {
        reducedDamage = 0
        logger.error(
          `error calculating damage, damage: ${damage}, target: ${pokemon.name
          }, attacker: ${attacker ? attacker.name : "Environment"
          }, attack type: ${attackType}, defense : ${pokemon.def
          }, spedefense: ${pokemon.speDef}, life: ${pokemon.life}`
        )
      }

      let residualDamage = reducedDamage

      if (pokemon.shield > 0) {
        let damageOnShield
        if (pokemon.status.flinch) {
          damageOnShield = Math.ceil(reducedDamage * 0.5)
          residualDamage = Math.ceil(reducedDamage * 0.5)
        } else {
          damageOnShield = reducedDamage
          residualDamage = 0
        }
        if (attacker && attacker.items.has(Item.PROTECTIVE_PADS)) {
          damageOnShield *= 2 // double damage on shield
        }
        if (damageOnShield > pokemon.shield) {
          residualDamage += damageOnShield - pokemon.shield
          damageOnShield = pokemon.shield
        }

        pokemon.shieldDamageTaken += damageOnShield
        takenDamage += damageOnShield
        pokemon.shield -= damageOnShield
      }

      takenDamage += Math.min(residualDamage, pokemon.life)

      if (
        pokemon.items.has(Item.SHINY_CHARM) &&
        pokemon.life - residualDamage < 0.3 * pokemon.hp
      ) {
        death = false
        takenDamage = 0
        residualDamage = 0
        pokemon.status.triggerProtect(2000)
        pokemon.removeItem(Item.SHINY_CHARM)
      }

      if (pokemon.hasSynergyEffect(Synergy.FOSSIL) && pokemon.life - residualDamage <= 0) {
        const shield = Math.round(pokemon.hp * (pokemon.effects.has(EffectEnum.FORGOTTEN_POWER)
          ? 1
          : pokemon.effects.has(EffectEnum.ELDER_POWER)
            ? 0.7
            : 0.4))
        const attackBonus = pokemon.effects.has(EffectEnum.FORGOTTEN_POWER)
          ? 1
          : pokemon.effects.has(EffectEnum.ELDER_POWER)
            ? 0.7
            : 0.4
        pokemon.addShield(shield, pokemon, 0, false)

        const damageOnShield = max(shield)(residualDamage)

        pokemon.shieldDamageTaken += damageOnShield
        takenDamage += damageOnShield
        pokemon.shield -= damageOnShield

        if (residualDamage < shield) {
          pokemon.addShield(shield - residualDamage, pokemon, 0, false)
        }
        takenDamage += max(shield)(residualDamage - pokemon.life)
        pokemon.shieldDamageTaken += max(shield)(residualDamage)
        residualDamage = min(0)(residualDamage - shield)

        pokemon.addAttack(pokemon.baseAtk * attackBonus, pokemon, 0, false)
        pokemon.cooldown = Math.round(500 * (50 / pokemon.speed))
        broadcastAbility(pokemon, { skill: "FOSSIL_RESURRECT" })
        SynergyEffects[Synergy.FOSSIL].forEach((e) => {
          pokemon.effects.delete(e)
        })
      }

      pokemon.life = Math.max(0, pokemon.life - residualDamage)

      // logger.debug(`${pokemon.name} took ${damage} and has now ${pokemon.life} life shield ${pokemon.shield}`);

      if (shouldTargetGainMana) {
        pokemon.addPP(Math.ceil(residualDamage / 10), pokemon, 0, false)
      }

      if (takenDamage > 0) {
        pokemon.onDamageReceived({ attacker, damage: takenDamage, board })
        if (attacker) {
          attacker.onDamageDealt({ target: pokemon, damage: takenDamage })
          if (pokemon !== attacker) {
            // do not count self damage
            switch (attackType) {
              case AttackType.PHYSICAL:
                attacker.physicalDamage += takenDamage
                break

              case AttackType.SPECIAL:
                attacker.specialDamage += takenDamage
                break

              case AttackType.TRUE:
                attacker.trueDamage += takenDamage
                break

              default:
                break
            }
          }

          pokemon.simulation.room.broadcast(Transfer.POKEMON_DAMAGE, {
            index: attacker.index,
            type: attackType,
            amount: takenDamage,
            x: pokemon.positionX,
            y: pokemon.positionY,
            id: pokemon.simulation.id
          })
        }
      }

      if (pokemon.life <= 0) {
        if (pokemon.status.resurection) {
          pokemon.status.triggerResurection(pokemon)
          board.forEach((x, y, entity: PokemonEntity | undefined) => {
            if (entity && entity.targetEntityId === pokemon.id) {
              // switch aggro immediately to reduce retarget lag after resurection
              entity.cooldown = 0
              entity.toMovingState()
            }
          })
        } else {
          death = true
        }

        if (pokemon.passive === Passive.PRIMEAPE) {
          pokemon.applyStat(Stat.ATK, 1, true)
        }
      }

      if (death) {
        pokemon.onDeath({ board })
        board.setValue(pokemon.positionX, pokemon.positionY, undefined)
        if (attacker && pokemon !== attacker) {
          attacker.onKill({ target: pokemon, board, attackType })
        }
        const effectsRemovedList: EffectEnum[] = []

        // Remove field effects on death
        if (pokemon.passive === Passive.ELECTRIC_TERRAIN) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.electricField) {
              pkm.status.removeElectricField(pkm)
            }
          })
          effectsRemovedList.push(EffectEnum.ELECTRIC_TERRAIN)
        } else if (pokemon.passive === Passive.PSYCHIC_TERRAIN) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.psychicField) {
              pkm.status.removePsychicField(pkm)
            }
          })
          effectsRemovedList.push(EffectEnum.PSYCHIC_TERRAIN)
        } else if (pokemon.passive === Passive.GRASSY_TERRAIN) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.grassField) {
              pkm.status.grassField = false
            }
          })
          effectsRemovedList.push(EffectEnum.GRASSY_TERRAIN)
        } else if (pokemon.passive === Passive.MISTY_TERRAIN) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.fairyField) {
              pkm.status.fairyField = false
            }
          })
          effectsRemovedList.push(EffectEnum.MISTY_TERRAIN)
        }

        const originalTeam = pokemon.status.possessed ? (pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM) : pokemon.team
        if (originalTeam == Team.BLUE_TEAM) {
          effectsRemovedList.forEach((x) =>
            pokemon.simulation.blueEffects.delete(x)
          )
          pokemon.simulation.blueTeam.delete(pokemon.id)
        } else {
          effectsRemovedList.forEach((x) =>
            pokemon.simulation.redEffects.delete(x)
          )
          pokemon.simulation.redTeam.delete(pokemon.id)
        }
      }
    }

    takenDamage = Math.round(takenDamage)
    return { death, takenDamage }
  }

  updateCommands(pokemon: PokemonEntity, dt: number) {
    pokemon.commands.forEach((command) => command.update(dt))
    pokemon.commands = pokemon.commands.filter((command) => !command.executed)
  }

  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    player: Player | undefined
  ) {
    this.updateCommands(pokemon, dt)
    pokemon.status.updateAllStatus(dt, pokemon, board)

    pokemon.effectsSet.forEach((effect) => {
      if (effect instanceof PeriodicEffect) {
        effect.update(dt, pokemon)
      }
    })

    if (
      (pokemon.status.resurecting ||
        pokemon.status.freeze ||
        pokemon.status.sleep) &&
      pokemon.state.name !== "idle"
    ) {
      pokemon.toIdleState()
    }

    if (
      pokemon.effects.has(EffectEnum.INGRAIN) ||
      pokemon.effects.has(EffectEnum.GROWTH) ||
      pokemon.effects.has(EffectEnum.SPORE)
    ) {
      if (pokemon.grassHealCooldown - dt <= 0) {
        const heal = pokemon.effects.has(EffectEnum.SPORE)
          ? 30
          : pokemon.effects.has(EffectEnum.GROWTH)
            ? 15
            : 5
        pokemon.handleHeal(heal, pokemon, 0, false)
        pokemon.grassHealCooldown = 2000
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: "GRASS_HEAL",
          positionX: pokemon.positionX,
          positionY: pokemon.positionY
        })
      } else {
        pokemon.grassHealCooldown = pokemon.grassHealCooldown - dt
      }
    }

    if (pokemon.simulation.weather === Weather.SANDSTORM) {
      pokemon.sandstormDamageTimer -= dt
      if (pokemon.sandstormDamageTimer <= 0 && !pokemon.simulation.finished) {
        pokemon.sandstormDamageTimer = 1000
        let sandstormDamage = 5
        const nbSmoothRocks = player ? count(player.items, Item.SMOOTH_ROCK) : 0
        if (nbSmoothRocks > 0) {
          sandstormDamage -= nbSmoothRocks
          pokemon.addSpeed(nbSmoothRocks, pokemon, 0, false)
        }
        if (pokemon.types.has(Synergy.GROUND) === false) {
          pokemon.handleDamage({
            damage: sandstormDamage,
            board,
            attackType: AttackType.SPECIAL,
            attacker: null,
            shouldTargetGainMana: false
          })
        }
      }
    }

    if (pokemon.oneSecondCooldown <= 0) {
      this.updateEachSecond(pokemon, board)
      pokemon.oneSecondCooldown = 1000
    } else {
      pokemon.oneSecondCooldown = min(0)(pokemon.oneSecondCooldown - dt)
    }

    if (pokemon.fairySplashCooldown > 0) {
      pokemon.fairySplashCooldown = min(0)(pokemon.fairySplashCooldown - dt)
    }

    if (
      pokemon.items.has(Item.FLAME_ORB) &&
      !pokemon.status.burn &&
      pokemon.action !== PokemonActionState.HOP
    ) {
      pokemon.status.triggerBurn(60000, pokemon, pokemon)
    }

    if (
      pokemon.items.has(Item.TOXIC_ORB) &&
      pokemon.status.poisonStacks === 0 &&
      pokemon.action !== PokemonActionState.HOP
    ) {
      pokemon.status.triggerPoison(60000, pokemon, pokemon)
    }
  }

  updateEachSecond(pokemon: PokemonEntity, board: Board) {
    pokemon.addPP(10, pokemon, 0, false)
    if (pokemon.effects.has(EffectEnum.RAIN_DANCE)) {
      pokemon.addPP(4, pokemon, 0, false)
    }
    if (pokemon.effects.has(EffectEnum.DRIZZLE)) {
      pokemon.addPP(8, pokemon, 0, false)
    }
    if (pokemon.effects.has(EffectEnum.PRIMORDIAL_SEA)) {
      pokemon.addPP(12, pokemon, 0, false)
    }
    if (pokemon.simulation.weather === Weather.RAIN) {
      pokemon.addPP(3, pokemon, 0, false)
      const nbDampRocks = pokemon.player
        ? count(pokemon.player.items, Item.DAMP_ROCK)
        : 0
      if (nbDampRocks > 0) {
        pokemon.addPP(2 * nbDampRocks, pokemon, 0, false)
      }
    }

    if (pokemon.passive === Passive.ILLUMISE_VOLBEAT) {
      board.forEach((x, y, p) => {
        if (p && p.passive === Passive.ILLUMISE_VOLBEAT && p !== pokemon) {
          pokemon.addPP(5, pokemon, 0, false)
        }
      })
    }

    if (
      pokemon.effects.has(EffectEnum.LIGHT_PULSE) ||
      pokemon.effects.has(EffectEnum.ETERNAL_LIGHT) ||
      pokemon.effects.has(EffectEnum.MAX_ILLUMINATION)
    ) {
      pokemon.addPP(8, pokemon, 0, false)
    }

    if (pokemon.items.has(Item.METRONOME)) {
      pokemon.addPP(5, pokemon, 0, false)
    }

    if (pokemon.items.has(Item.GREEN_ORB)) {
      for (const cell of board.getAdjacentCells(
        pokemon.positionX,
        pokemon.positionY,
        true
      )) {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.handleHeal(0.04 * cell.value.hp, pokemon, 0, false)
        }
      }
    }

    if (
      pokemon.effects.has(EffectEnum.STEALTH_ROCKS) &&
      !pokemon.types.has(Synergy.ROCK)
    ) {
      pokemon.handleDamage({
        damage: 10,
        board,
        attackType: AttackType.PHYSICAL,
        attacker: null,
        shouldTargetGainMana: true
      })
      pokemon.status.triggerWound(1000, pokemon, undefined)
    }

    if (
      pokemon.effects.has(EffectEnum.SPIKES) &&
      !pokemon.types.has(Synergy.FLYING)
    ) {
      pokemon.handleDamage({
        damage: 10,
        board,
        attackType: AttackType.TRUE,
        attacker: null,
        shouldTargetGainMana: true
      })
      pokemon.status.triggerArmorReduction(1000, pokemon)
    }

    if (
      pokemon.effects.has(EffectEnum.TOXIC_SPIKES) &&
      !pokemon.types.has(Synergy.POISON)
    ) {
      pokemon.status.triggerPoison(1000, pokemon, undefined)
    }

    if (
      pokemon.effects.has(EffectEnum.HAIL) &&
      !pokemon.types.has(Synergy.ICE)
    ) {
      pokemon.handleDamage({
        damage: 10,
        board,
        attackType: AttackType.SPECIAL,
        attacker: null,
        shouldTargetGainMana: true
      })
      pokemon.status.triggerFreeze(1000, pokemon)
      pokemon.effects.delete(EffectEnum.HAIL)
    }

    if (
      pokemon.effects.has(EffectEnum.EMBER) &&
      !(pokemon.types.has(Synergy.FIRE) || pokemon.types.has(Synergy.FLYING))
    ) {
      pokemon.handleDamage({
        damage: 10,
        board,
        attackType: AttackType.SPECIAL,
        attacker: null,
        shouldTargetGainMana: true
      })
      pokemon.status.triggerBurn(1100, pokemon, undefined)
    }

    if (pokemon.effects.has(EffectEnum.ZEN_MODE)) {
      const crit =
        pokemon.effects.has(EffectEnum.ABILITY_CRIT) &&
        chance(pokemon.critChance / 100, pokemon)
      pokemon.handleHeal(15, pokemon, 1, crit)
      if (pokemon.life >= pokemon.hp) {
        pokemon.index = PkmIndex[Pkm.DARMANITAN]
        pokemon.name = Pkm.DARMANITAN
        pokemon.passive = Passive.DARMANITAN
        pokemon.skill = Ability.HEADBUTT
        pokemon.pp = 0
        pokemon.status.tree = false
        pokemon.toMovingState()
        pokemon.addAttack(10, pokemon, 0, false)
        pokemon.addDefense(-5, pokemon, 0, false)
        pokemon.addSpecialDefense(-5, pokemon, 0, false)
      }
    }
  }

  onEnter(pokemon: PokemonEntity) { }

  onExit(pokemon: PokemonEntity) { }

  getTargetsAtRange(pokemon: PokemonEntity, board: Board): PokemonEntity[] {
    const targets: PokemonEntity[] = []
    for (
      let x = min(0)(pokemon.positionX - pokemon.range);
      x <= max(board.columns - 1)(pokemon.positionX + pokemon.range);
      x++
    ) {
      for (
        let y = min(0)(pokemon.positionY - pokemon.range);
        y <= max(board.rows - 1)(pokemon.positionY + pokemon.range);
        y++
      ) {
        const value = board.getValue(x, y)
        if (value && value.isTargettableBy(pokemon)) {
          targets.push(value)
        }
      }
    }
    return targets
  }

  /* NOTE: getNearestTargetAtRange require another algorithm that getNearestTargetCoordinate
  because it used Chebyshev distance instead of Manhattan distance
  more info here: https://discord.com/channels/737230355039387749/1183398539456413706 */
  getNearestTargetAtRange(
    pokemon: PokemonEntity,
    board: Board
  ): PokemonEntity | undefined {
    const targets = this.getTargetsAtRange(pokemon, board)
    let distance = pokemon.range + 1
    let candidates: PokemonEntity[] = []
    for (const target of targets) {
      const candidateDistance = distanceC(
        pokemon.positionX,
        pokemon.positionY,
        target.positionX,
        target.positionY
      )
      if (candidateDistance < distance) {
        distance = candidateDistance
        candidates = [target]
      } else if (candidateDistance == distance) {
        candidates.push(target)
      }
    }
    if (candidates.length > 0) {
      return pickRandomIn(candidates)
    } else {
      return undefined
    }
  }

  getNearestTargetAtSight(
    pokemon: PokemonEntity,
    board: Board
  ): { x: number; y: number; target: PokemonEntity } | null {
    let distance = 999
    let candidatesCoordinates = new Array<{
      x: number
      y: number
      target: PokemonEntity
    }>()

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && value.isTargettableBy(pokemon)) {
        const candidateDistance = distanceM(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y
        )
        if (candidateDistance < distance) {
          distance = candidateDistance
          candidatesCoordinates = [{ x, y, target: value }]
        } else if (candidateDistance == distance) {
          candidatesCoordinates.push({ x, y, target: value })
        }
      }
    })

    if (candidatesCoordinates.length > 0) {
      return pickRandomIn(candidatesCoordinates)
    } else {
      return null
    }
  }

  getFarthestTarget(
    pokemon: PokemonEntity,
    board: Board,
    targettableBy: PokemonEntity = pokemon
  ): PokemonEntity | undefined {
    let farthestTarget: PokemonEntity | undefined = undefined
    let maxDistance = 0

    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && enemy.isTargettableBy(targettableBy)) {
        const distance = distanceM(pokemon.positionX, pokemon.positionY, x, y)
        if (distance > maxDistance) {
          farthestTarget = enemy
          maxDistance = distance
        }
      }
    })
    return farthestTarget
  }

  getNearestAllies(pokemon: PokemonEntity, board: Board): PokemonEntity[] {
    let nearestAllies: PokemonEntity[] = []
    let minDistance = 999
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && value.team === pokemon.team && pokemon.id !== value.id) {
        const distance = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          value.positionX,
          value.positionY
        )
        if (distance < minDistance) {
          nearestAllies = [value]
          minDistance = distance
        } else if (distance === minDistance) {
          nearestAllies.push(value)
        }
      }
    })
    return nearestAllies
  }

  getMostSurroundedCoordinateAvailablePlace(
    pokemon: PokemonEntity,
    board: Board
  ): { x: number; y: number } | undefined {
    let x: number | undefined = undefined
    let y: number | undefined = undefined
    const team = pokemon.team
    const emptyPlaces = new Array<{ x: number; y: number; neighbour: number }>()
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value === undefined) {
        const cells = board.getAdjacentCells(x, y)
        let n = 0
        cells.forEach((cell) => {
          if (cell.value && cell.value.team !== team) {
            n++
          }
        })
        emptyPlaces.push({ x, y, neighbour: n })
      }
    })

    emptyPlaces.sort((a, b) => {
      return b.neighbour - a.neighbour
    })

    if (emptyPlaces.length > 0) {
      x = emptyPlaces[0].x
      y = emptyPlaces[0].y
    }

    if (x !== undefined && y !== undefined) {
      return { x, y }
    } else {
      return undefined
    }
  }

  getNearestAvailablePlaceCoordinates(
    pokemon: PokemonEntity,
    board: Board,
    maxRange?: number | undefined
  ): Cell | null {
    let candidateCells: Cell[] = []
    let minDistance = 999
    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      const distance = distanceM(pokemon.positionX, pokemon.positionY, x, y)
      if (
        value === undefined &&
        (maxRange === undefined || distance <= maxRange)
      ) {
        if (distance < minDistance) {
          candidateCells = [{ x, y, value }]
          minDistance = distance
        } else if (distance == minDistance) {
          candidateCells.push({ x, y, value })
        }
      }
    })

    return pickRandomIn(candidateCells)
  }

  getTargetWhenConfused(
    pokemon: PokemonEntity,
    board: Board
  ): PokemonEntity | undefined {
    let distance = pokemon.range + 1
    let candidates: PokemonEntity[] = []

    board.forEach((x: number, y: number, pkm: PokemonEntity | undefined) => {
      if (
        pkm &&
        pkm.id !== pokemon.id &&
        pkm.isTargettableBy(pokemon, true, true)
      ) {
        const candidateDistance = distanceM(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y
        )
        if (candidateDistance < distance) {
          distance = candidateDistance
          candidates = [pkm]
        } else if (candidateDistance == distance) {
          candidates.push(pkm)
        }
      }
    })

    candidates.push(pokemon) // sometimes attack itself when confused

    if (candidates.length > 0) {
      return pickRandomIn(candidates)
    } else {
      return undefined
    }
  }
}
