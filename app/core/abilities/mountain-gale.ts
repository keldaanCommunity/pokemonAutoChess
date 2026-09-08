import { MaxTroopersPerPkm } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { max } from "../../utils/number"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import { BergmiteOnBackEffect } from "../effects/passives/bergmite-on-back"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class MountainGaleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const isFirstCast = pokemon.count.ult === 0
    super.process(pokemon, board, target, crit, true)
    const damage = 40
    const targets: PokemonEntity[] = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
    if (targets.length === 0 || !targets.some((t) => t.id === target.id)) {
      targets.push(target)
    }

    const nbHits = [1, 3, 5, 10][pokemon.stars - 1] ?? 10
    const nbBergmites = isFirstCast
      ? max(MaxTroopersPerPkm[pokemon.name] ?? 0)(
          [...pokemon.effectsSet.values()].find(
            (e) => e instanceof BergmiteOnBackEffect
          )?.stacks ?? 0
        )
      : 0
    for (let i = 0; i < nbHits + nbBergmites; i++) {
      const t = pickRandomIn(targets)
      pokemon.commands.push(
        new DelayedCommand(() => {
          t.status.triggerFlinch(3000, pokemon)
          t.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          pokemon.broadcastAbility({
            targetX: t.positionX,
            targetY: t.positionY,
            delay: i >= nbHits ? i - nbHits : undefined
          })
        }, 200 * i)
      )
    }
  }
}
