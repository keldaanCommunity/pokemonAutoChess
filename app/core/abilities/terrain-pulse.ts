import type { IStatus } from "../../types"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TerrainPulseStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const fieldEffects: (keyof IStatus)[] = [
      "fairyField",
      "electricField",
      "grassField",
      "psychicField"
    ] as const
    type FieldEffect = (typeof fieldEffects)[number]
    const getFieldEffect = (pkm: PokemonEntity): FieldEffect | null =>
      fieldEffects.find((field) => pkm.status[field] === true) ?? null

    const userField = getFieldEffect(pokemon)
    if (userField === null) pokemon.status.grassField = true

    const adjacentFieldsByPkm: Map<PokemonEntity, Set<FieldEffect>> = new Map()
    const pokemonsWithField: Map<PokemonEntity, FieldEffect> = new Map()

    // 1. collect adjacent fields
    board.forEach((x, y, entity) => {
      if (!entity) return
      if (entity.team !== pokemon.team) return
      const activeField = getFieldEffect(entity)
      if (activeField) {
        pokemonsWithField.set(entity, activeField)
        const adjacentAlliesWithoutField = board
          .getAdjacentCells(x, y)
          .map((cell) => cell.value)
          .filter(
            (e): e is PokemonEntity =>
              e != null && e.team === entity.team && getFieldEffect(e) === null
          )
        for (const ally of adjacentAlliesWithoutField) {
          const adjacentFields =
            adjacentFieldsByPkm.get(ally) ?? new Set<FieldEffect>()
          adjacentFields.add(activeField)
          adjacentFieldsByPkm.set(ally, adjacentFields)
        }
      }
    })

    // 2. propagate fields
    adjacentFieldsByPkm.forEach((fields, pkm) => {
      const field = pickRandomIn([...fields])
      switch (field) {
        case "fairyField":
          pkm.status.addFairyField(pkm)
          break
        case "electricField":
          pkm.status.addElectricField(pkm)
          break
        case "grassField":
          pkm.status.addGrassField(pkm)
          break
        case "psychicField":
          pkm.status.addPsychicField(pkm)
          break
      }
      pokemonsWithField.set(pkm, getFieldEffect(pkm)!)
    })

    // 3. trigger additional field effects
    /*
    Grass field: heal 5/7/10/15% of max HP
    Electric Field: gain 10/12/15/20 Speed
    Psychic Field: gain 10/12/15/20 PP
    Fairy Field: gain 5/7/10/15% of max HP as Shield
    */
    pokemonsWithField.forEach((field, pkm) => {
      switch (field) {
        case "grassField": {
          const heal = [0.05, 0.07, 0.1, 0.15][pokemon.stars - 1] ?? 0.15
          pkm.handleHeal(heal * pkm.maxHP, pokemon, 1, crit)
          break
        }
        case "electricField": {
          const speedBuff = [10, 12, 15, 20][pokemon.stars - 1] ?? 20
          pkm.addSpeed(speedBuff, pokemon, 1, crit)
          break
        }
        case "psychicField": {
          const ppGain = [10, 12, 15, 20][pokemon.stars - 1] ?? 20
          pkm.addPP(ppGain, pokemon, 1, crit)
          break
        }
        case "fairyField": {
          const shieldPercent = [0.05, 0.07, 0.1, 0.15][pokemon.stars - 1] ?? 0.15
          pkm.addShield(shieldPercent * pkm.maxHP, pokemon, 1, crit)
          break
        }
      }
    })
  }
}
