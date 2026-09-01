import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DoomDesireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          pokemon.broadcastAbility({
            skill: "DOOM_DESIRE_HIT",
            targetX: target.positionX,
            targetY: target.positionY
          })
          const damage = [100, 125, 150, 300][pokemon.stars - 1] ?? 300
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        } else {
          pokemon.pp = pokemon.maxPP // cast again immediately if target is dead
        }
      }, 2000)
    )
    pokemon.resetCooldown(200)
  }
}
