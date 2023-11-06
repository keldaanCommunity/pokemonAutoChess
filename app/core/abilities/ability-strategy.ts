import { Transfer } from "../../types"
import { Effect } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Synergy } from "../../types/enum/Synergy"
import Board from "../board"
import PokemonEntity from "../pokemon-entity"
import PokemonState from "../pokemon-state"

export class AbilityStrategy {
  copyable = true // if true, can be copied by mimic, metronome...
  process(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean,
    preventDefaultAnim?: boolean
  ) {
    pokemon.pp = 0
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

    if (pokemon.types.has(Synergy.SOUND)) {
      soundBoost(pokemon, board)
      if (pokemon.passive === Passive.MEGA_LAUNCHER) {
        soundBoost(pokemon, board)
        soundBoost(pokemon, board)
      }
    }

    board.forEach((x, y, pkm) => {
      if (
        pkm?.passive === Passive.WATER_SPRING &&
        pkm &&
        pkm.team !== pokemon.team &&
        pkm.id !== pokemon.id
      ) {
        pkm.addPP(5)
        pkm.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: pkm.skill,
          positionX: pkm.positionX,
          positionY: pkm.positionY
        })
      }
    })

    if (pokemon.items.has(Item.AQUA_EGG)) {
      pokemon.addPP(20)
    }

    if (pokemon.items.has(Item.STAR_DUST)) {
      pokemon.addShield(Math.round(0.6 * pokemon.maxPP), pokemon, false)
      pokemon.count.starDustCount++
    }

    if (crit) {
      pokemon.onCritical(target, board)
    }

    if (target.status.magicBounce) {
      const damage = 40
      pokemon.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        target,
        false,
        true
      )
    }
  }
}

export function soundBoost(pokemon: PokemonEntity, board: Board) {
  pokemon.count.soundCount++
  const chimechoBoost = !!board.find(
    (x, y, e) => e.passive === Passive.CHIMECHO && e.team === pokemon.team
  )
  board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
    if (ally && pokemon.team === ally.team) {
      ally.status.sleep = false
      if (
        pokemon.effects.has(Effect.LARGO) ||
        pokemon.effects.has(Effect.ALLEGRO) ||
        pokemon.effects.has(Effect.PRESTO)
      ) {
        ally.addAttack(chimechoBoost ? 2 : 1, false)
      }
      if (
        pokemon.effects.has(Effect.ALLEGRO) ||
        pokemon.effects.has(Effect.PRESTO)
      ) {
        ally.addAttackSpeed(chimechoBoost ? 10 : 5, false)
      }
      if (pokemon.effects.has(Effect.PRESTO)) {
        const manaBoost = chimechoBoost ? 6 : 3
        ally.addPP(manaBoost)
      }
    }
  })
}
