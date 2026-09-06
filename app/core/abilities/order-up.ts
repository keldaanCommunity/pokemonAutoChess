import { getBaseAltForm } from "../../config";
import { Item } from "../../types"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { schemaValues } from "../../utils/schemas";
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

    const pokemonsEating = new Set(
      board.cells.filter(
        (e): e is PokemonEntity =>
          e != null && e.team === pokemon.team && e.effects.has(EffectEnum.RICE)
      )
    )
    pokemonsEating.add(pokemon)

    if (pokemon.items.has(Item.TATSUGIRI_CURLY)) {
      pokemonsEating.forEach((p) => {
        p.addMaxHP(80, p, 0, false)
        p.addAttack(8, p, 0, false)
      })
    } else if (pokemon.items.has(Item.TATSUGIRI_DROOPY)) {
      pokemonsEating.forEach((p) => {
        p.addMaxHP(80, p, 0, false)
        p.addDefense(8, p, 0, false)
      })
    } else if (pokemon.items.has(Item.TATSUGIRI_STRETCHY)) {
      pokemonsEating.forEach((p) => {
        p.addMaxHP(80, p, 0, false)
        p.addSpeed(25, p, 0, false)
      })
    } else if (pokemon.player) {
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
      }
    }
  }
}
