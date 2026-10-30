import { AttackType } from "../../types/enum/Game"
import { chance, pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TorchSongStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    // Blow out [4,SP] raging flames to random opponents. Each flame deals 50% of ATK as SPECIAL, with [30,LK]% chance to BURN for 2 seconds, and buff the user AP by [1,2,3].
    const damagePerFlame = 0.5 * pokemon.atk
    const apGainPerFlame = [1, 2, 3, 6][pokemon.stars - 1] ?? 6

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbFlames = Math.round(
      4 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < nbFlames; i++) {
      const randomTarget = pickRandomIn(enemies)
      if (randomTarget) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: randomTarget.positionX,
              targetY: randomTarget.positionY
            })
            pokemon.addAbilityPower(apGainPerFlame, pokemon, 0, false)
            if (randomTarget.hp > 0) {
              randomTarget.handleSpecialDamage(
                damagePerFlame,
                board,
                AttackType.SPECIAL,
                pokemon,
                false,
                false
              )
              if (chance(0.3, pokemon)) {
                randomTarget.status.triggerBurn(2000, randomTarget, pokemon)
              }
            }
          }, 100 * i)
        )
      }
    }
  }
}
