import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BulletPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal [20,30,40,80,SP] TRUE to the target, then gain [20,30,40,80,SP] SPEED for 2 seconds.
    const damage = [20, 30, 40, 80][pokemon.stars - 1] ?? 80
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    const speedBuff =
      ([20, 30, 40, 80][pokemon.stars - 1] ?? 80) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)
    pokemon.addSpeed(speedBuff, pokemon, 0, false)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addSpeed(-speedBuff, pokemon, 0, false)
      }, 2000)
    )
    pokemon.resetCooldown(250)
  }
}
