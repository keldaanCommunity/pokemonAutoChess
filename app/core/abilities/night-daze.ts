import { AttackType } from "../../types/enum/Game"
import { PkmIndex } from "../../types/enum/Pokemon"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class NightDazeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Deal [25,50,100,200,SP] SPECIAL to the target and inflict BLINDED for [3,SP] seconds.
    // If the user is disguised as an ally, this ability also affects enemies ADJACENT to the target, and the user's disguise is broken.
    const damage = [25, 50, 100, 200][pokemon.stars - 1] ?? 200
    const blindDuration = 3000
    const isDisguised = pokemon.index !== PkmIndex[pokemon.name]
    pokemon.index = PkmIndex[pokemon.name] // break the disguise

    const targets = isDisguised
      ? board
          .getAdjacentCells(target.positionX, target.positionY, true)
          .map((cell) => cell.value)
          .filter<PokemonEntity>(
            (entity): entity is PokemonEntity =>
              entity != null && pokemon.team != entity.team
          )
      : [target]

    targets.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      enemy.status.triggerBlinded(blindDuration, enemy, pokemon, true)
    })
  }
}
