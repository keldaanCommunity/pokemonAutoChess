import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { chance, pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import { giveRandomEgg } from "../eggs"
import { getHatchTime } from "../evolution-logic/hatch-time"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BabyBoomStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    // 3 eggs land on random enemies and 3 other eggs appear on the bench. Each egg has [10,10,10,100,LK]% chance to be golden.
    // The eggs deal [100,SP] SPECIAL damage to the target and adjacent enemies. Golden eggs deal double damage and grant 1 GOLD per KO.
    const nbEggsThrown = 3
    const nbEggsOnBench = 3
    const damage = 100
    const goldenEggChance = [0.1, 0.1, 0.1, 1][pokemon.stars - 1] ?? 1

    const enemies = board.cells.filter(
      (e): e is PokemonEntity => e != null && e.team !== pokemon.team
    )

    for (let i = 0; i < nbEggsThrown; i++) {
      const target = pickRandomIn(enemies)
      const golden = chance(goldenEggChance, pokemon)

      if (target) {
        const targetX = target.positionX
        const targetY = target.positionY
        pokemon.broadcastAbility({
          skill: Ability.BABY_BOOM,
          targetX,
          targetY,
          delay: i * 500,
          data: { golden }
        })
        pokemon.simulation.commands.push(
          new DelayedCommand(
            () => {
              board.getAdjacentCells(targetX, targetY, true).forEach((cell) => {
                if (cell.value && cell.value.team !== pokemon.team) {
                  const kill = cell.value.handleSpecialDamage(
                    damage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                  if (kill && golden && pokemon.player) {
                    pokemon.player.addMoney(1, true, pokemon)
                    pokemon.count.moneyCount += pokemon.stars
                  }
                }
              })
            },
            i * 500 + 1000
          )
        )
      }
    }

    for (let i = 0; i < nbEggsOnBench; i++) {
      const golden = chance(goldenEggChance, pokemon)
      if (pokemon.player) {
        const egg = giveRandomEgg(pokemon.player, golden)
        if (egg) {
          egg.stacks = getHatchTime(egg, pokemon.player) - 1
        }
      }
    }
  }
}
