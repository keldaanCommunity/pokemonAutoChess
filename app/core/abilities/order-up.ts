import { getBaseAltForm } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class OrderUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 100, 200][pokemon.stars - 1] ?? 200
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (pokemon.player) {
      const tatsugiriOnBoard = schemaValues(pokemon.player.board).find(
        (e) => e && getBaseAltForm(e.name) === Pkm.TATSUGIRI_CURLY
      )
      if (!tatsugiriOnBoard) {
        const form = [
          Pkm.TATSUGIRI_CURLY,
          Pkm.TATSUGIRI_DROOPY,
          Pkm.TATSUGIRI_STRETCHY
        ][pokemon.simulation.stageLevel % 3]
        pokemon.simulation.room.spawnOnBench(pokemon.player, form, "fishing")
      } else if (tatsugiriOnBoard.name === Pkm.TATSUGIRI_CURLY) {
        pokemon.addAttack(8, pokemon, 1, crit)
      } else if (tatsugiriOnBoard.name === Pkm.TATSUGIRI_DROOPY) {
        pokemon.addDefense(8, pokemon, 1, crit)
      } else if (tatsugiriOnBoard.name === Pkm.TATSUGIRI_STRETCHY) {
        pokemon.addSpeed(25, pokemon, 1, crit)
      }
    }
  }
}
