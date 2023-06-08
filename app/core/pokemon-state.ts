/* eslint-disable @typescript-eslint/no-empty-function */
import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import {
  AttackType,
  HealType,
  PokemonActionState,
  Team
} from "../types/enum/Game"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import { IPokemonEntity, Transfer, FIGHTING_PHASE_DURATION } from "../types"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Ability } from "../types/enum/Ability"
import { pickRandomIn } from "../utils/random"
import { logger } from "../utils/logger"
import { Passive } from "../types/enum/Passive"
import { Weather } from "../types/enum/Weather"

export default class PokemonState {
  handleHeal(
    pokemon: IPokemonEntity,
    heal: number,
    caster: IPokemonEntity,
    apBoost = 0
  ): void {
    if (
      pokemon.life > 0 &&
      pokemon.life < pokemon.hp &&
      !pokemon.status.wound
    ) {
      const boost = apBoost ? (heal * apBoost * pokemon.ap) / 100 : 0
      let healBoosted = Math.round(heal + boost)
      if (pokemon.passive === Passive.WONDER_GUARD) {
        healBoosted = 1
      }

      const healTaken = Math.min(pokemon.hp - pokemon.life, healBoosted)

      pokemon.life = Math.min(pokemon.hp, pokemon.life + healBoosted)

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

  handleShield(
    pokemon: IPokemonEntity,
    shield: number,
    caster: IPokemonEntity,
    apBoost?: boolean
  ) {
    if (pokemon.life > 0) {
      const boost = apBoost ? (shield * pokemon.ap) / 100 : 0
      const shieldBoosted = Math.round(shield + boost)
      pokemon.shield += shieldBoosted
      if (caster && shieldBoosted > 0) {
        if (pokemon.simulation.room.state.time < FIGHTING_PHASE_DURATION) {
          pokemon.simulation.room.broadcast(Transfer.POKEMON_HEAL, {
            index: caster.index,
            type: HealType.SHIELD,
            amount: shieldBoosted,
            x: pokemon.positionX,
            y: pokemon.positionY,
            id: pokemon.simulation.id
          })
        }
        caster.shieldDone += shieldBoosted
      }
    }
  }

  handleDamage({
    target: pokemon,
    damage,
    board,
    attackType,
    attacker,
    dodgeable,
    shouldTargetGainMana,
    shouldAttackerGainMana
  }: {
    target: PokemonEntity
    damage: number
    board: Board
    attackType: AttackType
    attacker: PokemonEntity | null
    dodgeable: boolean
    shouldTargetGainMana: boolean
    shouldAttackerGainMana: boolean
  }): { death: boolean; takenDamage: number } {
    let death = false
    let takenDamage = 0

    if (isNaN(damage)) {
      logger.trace(`NaN Damage from ${attacker ? attacker.name : "Environment"}`)
      return { death: false, takenDamage: 0 }
    }

    if (pokemon.life == 0) {
      death = true
    } else if (pokemon.status.protect) {
      death = false
      takenDamage = 0
    } else {
      let reducedDamage = damage

      if (pokemon.items.has(Item.POKE_DOLL)) {
        reducedDamage = Math.ceil(reducedDamage * 0.7)
      }

      if (attacker && attacker.status.electricField) {
        reducedDamage = Math.ceil(reducedDamage * 1.2)
      }

      if (attacker && attacker.status.psychicField) {
        reducedDamage = Math.ceil(reducedDamage * 1.2)
      }

      if (attacker && attacker.status.grassField) {
        reducedDamage = Math.ceil(reducedDamage * 1.2)
      }

      if (attacker && attacker.status.fairyField) {
        reducedDamage = Math.ceil(reducedDamage * 1.2)
      }

      if (attacker && attacker.items.has(Item.FIRE_GEM)) {
        reducedDamage = Math.ceil(reducedDamage + pokemon.hp * 0.1)
      }

      if(pokemon.simulation.weather === Weather.MISTY && attackType === AttackType.SPECIAL) {
        reducedDamage = Math.ceil(reducedDamage * 1.2)
      }

      if (
        attacker &&
        attacker.skill == Ability.LOCK_ON &&
        pokemon.status.armorReduction
      ) {
        attackType = AttackType.TRUE
      }
      const armorFactor = 0.1
      const def = pokemon.status.armorReduction
        ? Math.round(pokemon.def / 2)
        : pokemon.def
      const speDef = pokemon.status.armorReduction
        ? Math.round(pokemon.speDef / 2)
        : pokemon.speDef
      if (attackType == AttackType.PHYSICAL) {
        const ritodamage = damage / (1 + armorFactor * def)
        reducedDamage = Math.max(0, Math.round(ritodamage))
      } else if (attackType == AttackType.SPECIAL) {
        const ritodamage = damage / (1 + armorFactor * speDef)
        reducedDamage = Math.max(0, Math.round(ritodamage))
      } else if (attackType == AttackType.TRUE) {
        reducedDamage = damage
      }

      if (
        attackType !== AttackType.TRUE &&
        (pokemon.effects.includes(Effect.GUTS) ||
          pokemon.effects.includes(Effect.DEFIANT) ||
          pokemon.effects.includes(Effect.JUSTIFIED))
      ) {
        const damageBlocked = pokemon.effects.includes(Effect.JUSTIFIED)
          ? 10
          : pokemon.effects.includes(Effect.DEFIANT)
          ? 7
          : 4
        reducedDamage = reducedDamage - damageBlocked
      }

      reducedDamage = Math.max(1, reducedDamage) // should deal 1 damage at least

      if (isNaN(reducedDamage)) {
        reducedDamage = 0
        logger.error(
          `error calculating damage, damage: ${damage}, target: ${pokemon.name}, attacker: ${attacker ? attacker.name : "Environment"}, attack type: ${attackType}, defense : ${pokemon.def}, spedefense: ${pokemon.speDef}, life: ${pokemon.life}`
        )
      }

      if (dodgeable && pokemon.dodge > Math.random()) {
        if (!(attacker && attacker.items.has(Item.XRAY_VISION))) {
          reducedDamage = 0
          pokemon.count.dodgeCount += 1
        }
      }

      let residualDamage = reducedDamage

      if (pokemon.shield > 0) {
        let damageOnShield = reducedDamage
        if (attacker && attacker.items.has(Item.FIRE_GEM)) {
          damageOnShield *= 2 // double damage on shield
        }
        if (damageOnShield > pokemon.shield) {
          damageOnShield = pokemon.shield
        }

        takenDamage += damageOnShield
        pokemon.shield = pokemon.shield - damageOnShield
        residualDamage = Math.max(0, reducedDamage - damageOnShield)
      }

      if (pokemon.passive == Passive.WONDER_GUARD) {
        residualDamage = 1
      }

      takenDamage += Math.min(residualDamage, pokemon.life)

      if (attacker && takenDamage > 0) {
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

      if (attacker && takenDamage > 0) {
        pokemon.simulation.room.broadcast(Transfer.POKEMON_DAMAGE, {
          index: attacker.index,
          type: attackType,
          amount: takenDamage,
          x: pokemon.positionX,
          y: pokemon.positionY,
          id: pokemon.simulation.id
        })
      }

      pokemon.life = Math.max(0, pokemon.life - residualDamage)

      // logger.debug(`${pokemon.name} took ${damage} and has now ${pokemon.life} life shield ${pokemon.shield}`);

      if (pokemon) {
        if (shouldTargetGainMana) {
          pokemon.setMana(pokemon.mana + Math.ceil(damage / 10))
        }

        if (
          pokemon.items.has(Item.DEFENSIVE_RIBBON) &&
          pokemon.count.defensiveRibbonCount < 20 &&
          takenDamage > 0
        ) {
          pokemon.count.defensiveRibbonCount++
          if (pokemon.count.defensiveRibbonCount % 2 === 0) {
            pokemon.addAttack(1)
            pokemon.addDefense(1)
            pokemon.addAttackSpeed(5)
          }
        }

        if (pokemon.flyingProtection > 0 && pokemon.life > 0) {
          const pcLife = pokemon.life / pokemon.hp

          if (pokemon.effects.includes(Effect.TAILWIND) && pcLife < 0.2) {
            pokemon.flyAway(board)
          } else if (
            pokemon.effects.includes(Effect.FEATHER_DANCE) &&
            pcLife < 0.2
          ) {
            pokemon.status.triggerProtect(2000)
            pokemon.flyAway(board)
          } else if (pokemon.effects.includes(Effect.MAX_AIRSTREAM)) {
            if (
              (pokemon.flyingProtection === 2 && pcLife < 0.5) ||
              (pokemon.flyingProtection === 1 && pcLife < 0.2)
            ) {
              pokemon.status.triggerProtect(2000)
              pokemon.flyAway(board)
            }
          } else if (pokemon.effects.includes(Effect.MAX_GUARD)) {
            if (
              (pokemon.flyingProtection === 2 && pcLife < 0.5) ||
              (pokemon.flyingProtection === 1 && pcLife < 0.2)
            ) {
              pokemon.status.triggerProtect(2000)
              const cells = board.getAdjacentCells(
                pokemon.positionX,
                pokemon.positionY
              )
              cells.forEach((cell) => {
                if (cell.value && pokemon.team != cell.value.team) {
                  cell.value.status.triggerParalysis(2000, cell.value)
                }
              })
              pokemon.flyAway(board)
            }
          }
        }
      }

      if (attacker && takenDamage > 0) {
        attacker.onAttack(pokemon, board, takenDamage, shouldAttackerGainMana)
      }

      if (!pokemon.life || pokemon.life <= 0) {
        if (
          SynergyEffects[Synergy.FOSSIL].some((e) =>
            pokemon.effects.includes(e)
          )
        ) {
          const healBonus = pokemon.effects.includes(Effect.FORGOTTEN_POWER)
            ? 1
            : pokemon.effects.includes(Effect.ELDER_POWER)
            ? 0.8
            : 0.4
          const attackBonus = pokemon.effects.includes(Effect.FORGOTTEN_POWER)
            ? 1
            : pokemon.effects.includes(Effect.ELDER_POWER)
            ? 0.6
            : 0.3
          pokemon.life = pokemon.hp * healBonus
          pokemon.addAttack(pokemon.baseAtk * attackBonus)
          pokemon.effects.splice(
            pokemon.effects.findIndex((e) =>
              SynergyEffects[Synergy.FOSSIL].includes(e)
            ),
            1
          )
        } else if (pokemon.status.resurection) {
          pokemon.status.triggerResurection(pokemon)
        } else {
          const isWorkUp = pokemon.effects.includes(Effect.BULK_UP)
          const isRage = pokemon.effects.includes(Effect.RAGE)
          const isAngerPoint = pokemon.effects.includes(Effect.ANGER_POINT)

          if (isWorkUp || isRage || isAngerPoint) {
            const heal = 30
            let speedBoost = 0
            if (isWorkUp) {
              speedBoost = 20
            } else if (isRage) {
              speedBoost = 25
            } else if (isAngerPoint) {
              speedBoost = 30
            }
            board.forEach((x, y, value) => {
              if (
                value !== undefined &&
                value.team == pokemon.team &&
                value.types.includes(Synergy.FIELD)
              ) {
                const _pokemon = pokemon // beware of closure vars
                pokemon.simulation.room.clock.setTimeout(() => {
                  value.count.fieldCount++
                  value.handleHeal(heal, _pokemon, 0)
                  value.addAttackSpeed(speedBoost)
                }, 16) // delay to next tick, targeting 60 ticks per second
              }
            })
          }

          board.setValue(pokemon.positionX, pokemon.positionY, undefined)
          death = true
        }
      }

      if (death) {
        if (attacker) {
          attacker.onKill(pokemon, board)
        }
        const effectsRemovedList: Effect[] = []

        // Remove field effects on death
        if (pokemon.passive === Passive.ELECTRIC_SURGE) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.electricField) {
              pkm.status.electricField = false
            }
          })
          effectsRemovedList.push(Effect.ELECTRIC_TERRAIN)
        } else if (pokemon.passive === Passive.PSYCHIC_SURGE) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.psychicField) {
              pkm.status.psychicField = false
            }
          })
          effectsRemovedList.push(Effect.PSYCHIC_TERRAIN)
        } else if (pokemon.passive === Passive.GRASSY_SURGE) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.grassField) {
              pkm.status.grassField = false
            }
          })
          effectsRemovedList.push(Effect.GRASSY_TERRAIN)
        } else if (pokemon.passive === Passive.MISTY_SURGE) {
          board.forEach((x, y, pkm) => {
            if (pkm && pkm.team == pokemon.team && pkm.status.fairyField) {
              pkm.status.fairyField = false
            }
          })
          effectsRemovedList.push(Effect.MISTY_TERRAIN)
        }

        if (pokemon.team == Team.BLUE_TEAM) {
          pokemon.simulation.blueEffects =
            pokemon.simulation.blueEffects.filter(
              (x) => !effectsRemovedList.includes(x)
            )
        } else {
          pokemon.simulation.redEffects = pokemon.simulation.redEffects.filter(
            (x) => !effectsRemovedList.includes(x)
          )
        }
      }
    }

    takenDamage = Math.round(takenDamage)
    return { death, takenDamage }
  }

  update(pokemon: PokemonEntity, dt: number, board: Board, weather: string) {
    if(pokemon.status.resurecting &&
      pokemon.action !== PokemonActionState.HURT
    ){
      pokemon.toIdleState()
    }
    if (
      (pokemon.status.freeze || pokemon.status.sleep) &&
      pokemon.action !== PokemonActionState.SLEEP
    ) {
      pokemon.toIdleState()
    }
    if (
      pokemon.effects.includes(Effect.TILLER) ||
      pokemon.effects.includes(Effect.DIGGER) ||
      pokemon.effects.includes(Effect.DRILLER)
    ) {
      if (pokemon.count.growGroundCount < 4) {
        pokemon.growGroundTimer -= dt
        if (pokemon.growGroundTimer <= 0) {
          pokemon.growGroundTimer = 3000
          pokemon.count.growGroundCount += 1
          if (pokemon.effects.includes(Effect.TILLER)) {
            pokemon.addDefense(1)
            pokemon.addSpecialDefense(1)
            pokemon.addAttack(1)
          } else if (pokemon.effects.includes(Effect.DIGGER)) {
            pokemon.addDefense(2)
            pokemon.addSpecialDefense(2)
            pokemon.addAttack(2)
          } else if (pokemon.effects.includes(Effect.DRILLER)) {
            pokemon.addDefense(3)
            pokemon.addSpecialDefense(3)
            pokemon.addAttack(3)
          }
        }
      } else {
        pokemon.growGroundTimer = 3000
      }
    }

    if(pokemon.simulation.weather === Weather.SANDSTORM && pokemon.types.includes(Synergy.GROUND) === false) {
      pokemon.sandstormDamageTimer -= dt
      if (pokemon.sandstormDamageTimer <= 0) {
        pokemon.sandstormDamageTimer = 1000
        const sandstormDamage = 5
        pokemon.handleSpecialDamage(sandstormDamage, board, AttackType.SPECIAL, null, false)
      }
    }

    pokemon.status.updateAllStatus(dt, pokemon, board)

    if (pokemon.manaCooldown <= 0) {
      pokemon.setMana(pokemon.mana + 10)
      if(pokemon.simulation.weather === Weather.RAIN) {
        pokemon.setMana(pokemon.mana + 3)
      }
      pokemon.manaCooldown = 1000
    } else {
      pokemon.manaCooldown = Math.max(0, pokemon.manaCooldown - dt)
    }
  }

  onEnter(pokemon: PokemonEntity) {}

  onExit(pokemon: PokemonEntity) {}

  getNearestTargetCoordinate(
    pokemon: PokemonEntity,
    board: Board
  ): { x: number; y: number } | undefined {
    let distance = 999
    let candidatesCoordinates: { x: number; y: number }[] = new Array<{
      x: number
      y: number
    }>()

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value !== undefined && value.team !== pokemon.team && value.isTargettable) {
        const candidateDistance = board.distance(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y
        )
        if (candidateDistance < distance) {
          distance = candidateDistance
          candidatesCoordinates = [{ x, y }]
        } else if (candidateDistance == distance) {
          candidatesCoordinates.push({ x, y })
        }
      }
    })
    if (candidatesCoordinates.length > 0) {
      return pickRandomIn(candidatesCoordinates)
    } else {
      return undefined
    }
  }

  getFarthestTargetCoordinate(
    pokemon: PokemonEntity,
    board: Board
  ): { x: number; y: number } | undefined {
    const pokemons = new Array<{ distance: number; x: number; y: number }>()

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value !== undefined && value.team !== pokemon.team && value.isTargettable) {
        const distance = board.distance(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y
        )
        pokemons.push({ distance, x, y })
      }
    })

    pokemons.sort((a, b) => {
      return b.distance - a.distance
    })

    if (pokemons.length > 0) {
      return { x: pokemons[0].x, y: pokemons[0].y }
    } else {
      return undefined
    }
  }

  getMostSurroundedCoordianteAvailablePlace(
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

  getFarthestTargetCoordinateAvailablePlace(
    pokemon: PokemonEntity,
    board: Board
  ): { x: number; y: number } | undefined {
    let x: number | undefined = undefined
    let y: number | undefined = undefined
    const pokemons = new Array<{ distance: number; x: number; y: number }>()

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value !== undefined && value.team !== pokemon.team && value.isTargettable) {
        const distance = board.distance(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y
        )
        pokemons.push({ distance, x, y })
      }
    })

    pokemons.sort((a, b) => {
      return b.distance - a.distance
    })

    for (let i = 0; i < pokemons.length; i++) {
      const p = pokemons[i]
      const around = board.getAdjacentCells(p.x, p.y)

      around.sort((a, b) => {
        return (
          board.distance(b.x, b.y, pokemon.positionX, pokemon.positionY) -
          board.distance(a.x, a.y, pokemon.positionX, pokemon.positionY)
        )
      })
      around.forEach((cell) => {
        if (!cell.value && x === undefined && y === undefined) {
          x = cell.x
          y = cell.y
        }
      })
      if (x !== undefined && y !== undefined) {
        break
      }
    }
    if (x !== undefined && y !== undefined) {
      return { x, y }
    } else {
      return undefined
    }
  }

  getTargetCoordinateWhenConfused(
    pokemon: PokemonEntity,
    board: Board
  ): { x: number; y: number } | undefined {
    let distance = 999
    let candidatesCoordinates: { x: number; y: number }[] = new Array<{
      x: number
      y: number
    }>()

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value !== undefined && value.id !== pokemon.id && value.isTargettable) {
        const candidateDistance = board.distance(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y
        )
        if (candidateDistance < distance) {
          distance = candidateDistance
          candidatesCoordinates = [{ x, y }]
        } else if (candidateDistance == distance) {
          candidatesCoordinates.push({ x, y })
        }
      }
    })

    candidatesCoordinates.push({ x: pokemon.positionX, y: pokemon.positionY }) // sometimes attack itself when confused

    if (candidatesCoordinates.length > 0) {
      return pickRandomIn(candidatesCoordinates)
    } else {
      return undefined
    }
  }

  move(
    pokemon: PokemonEntity,
    board: Board,
    coordinates: { x: number; y: number }
  ) {}
}
