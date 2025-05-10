import { Transfer } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import Board from "../board"
import { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { min } from "../../utils/number"
import { OnAbilityCastEffect } from "../effects/effect"
import { DelayedCommand } from "../simulation-command"

export class AbilityStrategy {
  copyable = true // if true, can be copied by mimic, metronome...
  canCritByDefault = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean,
    preventDefaultAnim?: boolean
  ) {
    pokemon.pp = min(0)(pokemon.pp - pokemon.maxPP)
    pokemon.count.ult += 1

    if (!preventDefaultAnim) {
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: pokemon.skill,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: target.positionX,
        targetY: target.positionY,
        orientation: pokemon.orientation
      })
    }

    pokemon.effectsSet.forEach((effect) => {
      if (effect instanceof OnAbilityCastEffect) {
        effect.apply(pokemon, board, target, crit)
      }
    })

    if (pokemon.items.has(Item.AQUA_EGG)) {
      pokemon.addPP(20, pokemon, 0, false)
    }

    if (pokemon.items.has(Item.STAR_DUST)) {
      pokemon.addShield(Math.round(0.5 * pokemon.maxPP), pokemon, 0, false)
      pokemon.count.starDustCount++
    }

    if (pokemon.items.has(Item.LEPPA_BERRY)) {
      pokemon.eatBerry(Item.LEPPA_BERRY)
    }

    if (pokemon.items.has(Item.MAX_ELIXIR) && pokemon.count.ult === 1) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addPP(pokemon.maxPP, pokemon, 0, false)
          pokemon.removeItem(Item.MAX_ELIXIR, false)
        }, 1000)
      )
    }

    if (pokemon.items.has(Item.COMFEY)) {
      AbilityStrategies[Ability.FLORAL_HEALING].process(
        pokemon,
        board,
        target,
        crit,
        true
      )
    }

    if (pokemon.passive === Passive.SLOW_START && pokemon.count.ult === 1) {
      pokemon.addSpeed(30, pokemon, 0, false)
      pokemon.addAttack(10, pokemon, 0, false)
    }
  }
}
