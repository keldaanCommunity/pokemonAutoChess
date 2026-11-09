import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { TeraShardsBySynergy } from "../../types/enum/Item"
import { Synergy } from "../../types/enum/Synergy"
import { pickRandomIn, randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TeraStarstormStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const activeSynergies = Object.values(Synergy).filter((type) =>
      pokemon.hasSynergyEffect(type)
    )
    const damage = [40, 60, 80, 120, 150][pokemon.stars - 1] ?? 150
    const numberOfProjectiles = [10, 20, 30, 50, 100][pokemon.stars - 1] ?? 100

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const type = pickRandomIn(activeSynergies) ?? Synergy.NORMAL
          const shard = TeraShardsBySynergy[type]
          pokemon.broadcastAbility({ targetX: x, targetY: y, data: { shard } })

          pokemon.commands.push(
            new DelayedCommand(() => {
              const value = board.getEntityOnCell(x, y)
              if (!value || value.status.resurrecting || value.hp <= 0) return
              if (value && value.team === pokemon.team) {
                if (
                  value.refToBoardPokemon &&
                  value.refToBoardPokemon.types.has(type) === false
                ) {
                  value.types.add(type)
                  value.refToBoardPokemon.types.add(type)
                  value.broadcastAbility({ skill: "TERASTALIZE" })
                }
              } else {
                value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }, 400)
          )
        }, i * 100)
      )
    }
  }
}
