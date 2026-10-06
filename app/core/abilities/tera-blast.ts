import { TeraShardsBySynergy } from "../../types"
import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { OrientationArray } from "../../utils/orientation"
import { pickRandomIn } from "../../utils/random"
import { type Board, effectInOrientation } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TeraBlastStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const activeSynergies = Object.values(Synergy).filter((type) =>
      pokemon.hasSynergyEffect(type)
    )
    const damage = [40, 80, 120, 200, 300][pokemon.stars - 1] ?? 300
    const shards = OrientationArray.map((orientation) => {
      const type = pickRandomIn(activeSynergies)
      const shard = TeraShardsBySynergy[type]
      effectInOrientation(board, pokemon, orientation, (cell) => {
        if (cell.value) {
          if (cell.value.team === pokemon.team) {
            if (
              cell.value.refToBoardPokemon &&
              cell.value.refToBoardPokemon.types.has(type) === false
            ) {
              cell.value.types.add(type)
              cell.value.refToBoardPokemon.types.add(type)
              cell.value.broadcastAbility({ skill: "TERASTALIZE" })
            }
          } else {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      })
      return shard
    })
    pokemon.broadcastAbility({ data: { shards } })
  }
}
