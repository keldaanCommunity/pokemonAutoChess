import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class KingShieldStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = 1500
    const shield = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    pokemon.status.triggerProtect(duration)
    pokemon.addShield(shield, pokemon, 1, crit)
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      pokemon.moveTo(
        farthestTarget.positionX,
        farthestTarget.positionY,
        board,
        true
      )
    }
    if (pokemon.name === Pkm.AEGISLASH) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addAttack(10, pokemon, 1, crit)
          pokemon.addDefense(-5, pokemon, 1, crit)
          pokemon.addSpecialDefense(-5, pokemon, 1, crit)
          pokemon.name = Pkm.AEGISLASH_BLADE
          pokemon.index = PkmIndex[Pkm.AEGISLASH_BLADE]
          if (pokemon.player) {
            pokemon.player.pokemonsPlayed.add(Pkm.AEGISLASH_BLADE)
          }
        }, 1500)
      )
    } else if (pokemon.name === Pkm.AEGISLASH_BLADE) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addAttack(-10, pokemon, 1, crit)
          pokemon.addDefense(5, pokemon, 1, crit)
          pokemon.addSpecialDefense(5, pokemon, 1, crit)
          pokemon.name = Pkm.AEGISLASH
          pokemon.index = PkmIndex[Pkm.AEGISLASH]
        }, 1500)
      )
    }
  }
}
