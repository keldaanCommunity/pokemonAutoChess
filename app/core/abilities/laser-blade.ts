import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class LaserBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % 2 === 1) {
      // Spins laser blade around, moving behind their target, gaining [30,SP] SHIELD and dealing [30,SP] SPECIAL to target and adjacent enemies on the path.
      const damage = [25, 25, 25, 50][pokemon.stars - 1] ?? 50
      const shield = [25, 25, 25, 50][pokemon.stars - 1] ?? 50
      const enemiesHit = new Set<PokemonEntity>()
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .concat(
          board.getAdjacentCells(target.positionX, target.positionY, false)
        )
        .map((cell) => cell.value)
        .filter(
          (entity): entity is PokemonEntity =>
            entity != null && entity.team !== pokemon.team
        )
        .forEach((enemy) => enemiesHit.add(enemy))
      pokemon.moveTo(target.positionX, target.positionY, board, true)
      pokemon.addShield(shield, pokemon, 1, crit)
      enemiesHit.forEach((enemy) => {
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      })
    } else {
      // Spins laser blade in front of them, dealing 2 times [30,SP] + ATK as SPECIAL
      const damage = ([25, 25, 25, 50][pokemon.stars - 1] ?? 50) + pokemon.atk
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, 300)
      )
    }
  }
}
