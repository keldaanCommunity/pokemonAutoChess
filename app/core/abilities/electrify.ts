import { Synergy } from "../../types/enum/Synergy"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { getStrongestUnit } from "../unit-score"
import { AbilityStrategy } from "./ability-strategy"

export class ElectrifyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    // Give to your STRONGEST non-ELECTRIC ally ELECTRIC_FIELD and all the effects of active ELECTRIC synergy + [15,30,60,SP] SHIELD.
    super.process(pokemon, board, target, crit)
    const nonElectricAllies = board.cells.filter(
      (entity) =>
        entity &&
        entity.team === pokemon.team &&
        entity.id !== pokemon.id &&
        entity.hasSynergy(Synergy.ELECTRIC) === false &&
        entity.status.electricField !== true
    ) as PokemonEntity[]
    const strongestAlly = getStrongestUnit(nonElectricAllies)
    const buffedUnit = strongestAlly ?? pokemon //  If no ally is found, self-cast instead.
    const shield = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    buffedUnit.status.addElectricField(buffedUnit)
    buffedUnit.addShield(shield, pokemon, 1, crit)
    if (buffedUnit.hasSynergy(Synergy.ELECTRIC) === false) {
      buffedUnit.types.add(Synergy.ELECTRIC)
      pokemon.simulation.applySynergyEffects(buffedUnit, Synergy.ELECTRIC)
    }
  }
}
