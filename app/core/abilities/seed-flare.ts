import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SeedFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const targetX = target.positionX
    const targetY = target.positionY
    const ap = Math.round(pokemon.ap * (crit ? pokemon.critPower : 1))
    super.process(pokemon, board, target, crit, true)
    const damage = [20, 25, 30, 35, 70][pokemon.stars - 1] ?? 70
    const spDefDebuff = [-3, -3, -3, -3, -6][pokemon.stars - 1] ?? -6
    const targets = board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 5, false)
      .filter((cell) => cell.value && pokemon.team !== cell.value.team)

    pokemon.broadcastAbility({
      targetX,
      targetY,
      ap,
      data: { targets: targets.map(({ x, y }) => ({ x, y })) }
    })

    targets.forEach((cell) => {
      const enemy = cell.value
      if (!enemy) return
      enemy.addSpecialDefense(spDefDebuff, pokemon, 0, false)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}
