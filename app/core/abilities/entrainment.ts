import { Ability } from "../../types/enum/Ability"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class EntrainmentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const ppGained = [10,10,10,30][pokemon.stars - 1] ?? 30
    pokemon.addPP(ppGained, pokemon, 1, crit)
    if (target.skill !== Ability.ENTRAINMENT) {
      target.skill = Ability.ENTRAINMENT
    } else {
      const potentialTargets: { x: number; y: number; value: PokemonEntity }[] =
        []
      board.forEach(
        (x: number, y: number, entity?: PokemonEntity) => {
          if (entity && entity.team !== pokemon.team && entity.hp > 0 && entity.skill !== Ability.ENTRAINMENT) {
            potentialTargets.push({ x, y, value: entity })
          }
        }
      )
      potentialTargets.sort(
        (a, b) =>
          distanceC(pokemon.positionX, pokemon.positionY, a.x, a.y) -
          distanceC(pokemon.positionX, pokemon.positionY, b.x, b.y)
      )
      if (potentialTargets.length > 0) {
        potentialTargets[0].value.skill = Ability.ENTRAINMENT
      }
    }
  }
}
