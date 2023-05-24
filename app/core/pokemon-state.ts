/* eslint-disable @typescript-eslint/no-empty-function */
import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import { AttackType, HealType, PokemonActionState } from "../types/enum/Game"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import { IPokemonEntity, Transfer, FIGHTING_PHASE_DURATION } from "../types"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Ability } from "../types/enum/Ability"
import { pickRandomIn } from "../utils/random"
import { logger } from "../utils/logger"

export default class PokemonState {
  handleHeal(
    pokemon: IPokemonEntity,
    heal: number,
    caster: IPokemonEntity,
    apBoost: number = 0
  ): void {
    if (
      pokemon.life > 0 &&
      pokemon.life < pokemon.hp &&
      !pokemon.status.wound
    ) {
      const boost = apBoost ? (heal * apBoost * pokemon.ap) / 100 : 0
      let healBoosted = Math.round(heal + boost)
      if (pokemon.skill === Ability.WONDER_GUARD) {
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
    attacker: PokemonEntity
    dodgeable: boolean
    shouldTargetGainMana: boolean
    shouldAttackerGainMana: boolean
  }): { death: boolean; takenDamage: number } {
    let death: boolean = false
    let takenDamage: number = 0

    if (isNaN(damage)) {
      logger.trace(`NaN Damage`)
      logger.debug({
        damage,
        attacker: attacker.name,
        critDamage: attacker.critDamage,
        atk: attacker.atk
      })
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
        reducedDamage = Math.ceil(reducedDamage * 1.3)
      }

      if (attacker && attacker.status.psychicField) {
        reducedDamage = Math.ceil(reducedDamage * 1.3)
      }

      if (attacker && attacker.status.grassField) {
        reducedDamage = Math.ceil(reducedDamage * 1.3)
      }

      if (attacker && attacker.status.fairyField) {
        reducedDamage = Math.ceil(reducedDamage * 1.3)
      }

      if (attacker && attacker.items.has(Item.FIRE_GEM)) {
        reducedDamage = Math.ceil(reducedDamage + pokemon.hp * 0.1)
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
          `error calculating damage, damage: ${damage}, target: ${pokemon.name}, attacker: ${attacker.name}, attack type: ${attackType}, defense : ${pokemon.def}, spedefense: ${pokemon.speDef}, life: ${pokemon.life}`
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

      if (pokemon.skill == Ability.WONDER_GUARD) {
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
            pokemon.handleAttackSpeed(5)
          }
        }

          if (pokemon.flyingProtection > 0 && pokemon.life > 0) {
            const pcLife = pokemon.life / pokemon.hp

            if (pokemon.effects.includes(Effect.TAILWIND) && pcLife < 0.2) {
              pokemon.flyAway(board)
            } else if (pokemon.effects.includes(Effect.FEATHER_DANCE) && pcLife < 0.2) {
              pokemon.status.triggerProtect(2000)
              pokemon.flyAway(board)
            } else if (pokemon.effects.includes(Effect.MAX_AIRSTREAM)) {
              if ((pokemon.flyingProtection === 2 && pcLife < 0.5) || (pokemon.flyingProtection === 1 && pcLife < 0.2)) {
                pokemon.status.triggerProtect(2000)
                pokemon.flyAway(board)
              }
            } else if (pokemon.effects.includes(Effect.MAX_GUARD)) {
              if ((pokemon.flyingProtection === 2 && pcLife < 0.5) || (pokemon.flyingProtection === 1 && pcLife < 0.2)) {
                pokemon.status.triggerProtect(2000)
                const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
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
          pokemon.status.resurection = false
          pokemon.life = pokemon.hp
        } else {
          const isWorkUp = pokemon.effects.includes(Effect.BULK_UP)
          const isRage = pokemon.effects.includes(Effect.RAGE)
          const isAngerPoint = pokemon.effects.includes(Effect.ANGER_POINT)

          if (isWorkUp || isRage || isAngerPoint) {
            let boost = 0
            let speedBoost = 0
            if (isWorkUp) {
              boost = 20
              speedBoost = 15
            } else if (isRage) {
              boost = 30
              speedBoost = 20
            } else if (isAngerPoint) {
              boost = 40
              speedBoost = 30
            }
            board.forEach((x, y, value) => {
              if (
                value !== undefined &&
                value.team == pokemon.team &&
                value.types.includes(Synergy.FIELD)
              ) {
                let _pokemon = pokemon // beware of closure vars
                pokemon.simulation.room.clock.setTimeout(() => {
                  value.count.fieldCount++
                  value.handleHeal((boost / 100) * value.hp, _pokemon, 0)
                  value.handleAttackSpeed(speedBoost)
                }, 16) // delay to next tick, targeting 60 ticks per second
              }
            })
          }

          board.setValue(pokemon.positionX, pokemon.positionY, undefined)
          death = true
        }

        if (attacker) {
          attacker.onKill(pokemon, board)
        }

        if (death) {
          // Remove field effects on death
          if (pokemon.skill === Ability.ELECTRIC_SURGE) {
            board.forEach((x, y, v) => {
              if (v && v.status.electricField) {
                v.status.electricField = false
              }
            })
          } else if (pokemon.skill === Ability.PSYCHIC_SURGE) {
            board.forEach((x, y, v) => {
              if (v && v.status.psychicField) {
                v.status.psychicField = false
              }
            })
          } else if (pokemon.skill === Ability.GRASSY_SURGE) {
            board.forEach((x, y, v) => {
              if (v && v.status.grassField) {
                v.status.grassField = false
              }
            })
          } else if (pokemon.skill === Ability.MISTY_SURGE) {
            board.forEach((x, y, v) => {
              if (v && v.status.fairyField) {
                v.status.fairyField = false
              }
            })
          }
        }
      }
    }

    takenDamage = Math.round(takenDamage)
    return { death, takenDamage }
  }

  update(pokemon: PokemonEntity, dt: number, board: Board, climate: string) {
    if (
      (pokemon.status.freeze || pokemon.status.sleep) &&
      pokemon.action !== PokemonActionState.SLEEP
    ) {
      pokemon.toIdleState()
    }
    if (
      pokemon.effects.includes(Effect.SHORE_UP) ||
      pokemon.effects.includes(Effect.ROTOTILLER) ||
      pokemon.effects.includes(Effect.SANDSTORM)
    ) {
      if (pokemon.count.growGroundCount < 4) {
        pokemon.growGroundTimer -= dt
        if (pokemon.growGroundTimer <= 0) {
          pokemon.growGroundTimer = 3000
          pokemon.count.growGroundCount += 1
          if (pokemon.effects.includes(Effect.SHORE_UP)) {
            pokemon.addDefense(1)
            pokemon.addSpecialDefense(1)
            pokemon.addAttack(1)
          } else if (pokemon.effects.includes(Effect.ROTOTILLER)) {
            pokemon.addDefense(2)
            pokemon.addSpecialDefense(2)
            pokemon.addAttack(2)
          } else if (pokemon.effects.includes(Effect.SANDSTORM)) {
            pokemon.addDefense(3)
            pokemon.addSpecialDefense(3)
            pokemon.addAttack(3)
          }
        }
      } else {
        pokemon.growGroundTimer = 3000
      }
    }

    pokemon.status.updateAllStatus(dt, pokemon, board)

    if (pokemon.manaCooldown <= 0) {
      pokemon.setMana(pokemon.mana + 10)
      pokemon.manaCooldown = 1000
    } else {
      pokemon.manaCooldown = Math.max(0, pokemon.manaCooldown - dt)
    }
  }

  onEnter(pokemon: PokemonEntity) {}

  onExit(pokemon: PokemonEntity) {}

  isTarget(pokemon: PokemonEntity, board: Board) {
    let target = false
    board.forEach((x, y, value) => {
      if (value && value.team != pokemon.team) {
        target = true
      }
    })
    return target
  }

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
      if (value !== undefined && value.team != pokemon.team) {
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
      if (value !== undefined && value.team != pokemon.team) {
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
      if (value !== undefined && value.team != pokemon.team) {
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
      if (value !== undefined && value.id != pokemon.id) {
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
