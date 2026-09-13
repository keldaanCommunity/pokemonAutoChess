import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../models/precomputed/precomputed-rarity"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import type { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FirstImpressionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [45, 90, 180, 360][pokemon.stars - 1] ?? 360
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(5000, target, pokemon)

    if (pokemon.count.ult === 1) {
      // On first cast, find a cell to jump away to after the attack
      const newCell = board.getSafePlaceAwayFrom(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )

      // Store original position before moving
      const x = pokemon.positionX
      const y = pokemon.positionY

      if (newCell) {
        // Move pokemon to the fly away position
        pokemon.moveTo(newCell.x, newCell.y, board, false)

        // If original position is now empty, spawn a random bug pokemon
        if (board.getEntityOnCell(x, y) === undefined) {
          // Get all 1-star bug pokemon from common/uncommon rarities with abilities
          const possibleBugsPkm = (
            [
              PRECOMPUTED_POKEMONS_PER_RARITY.COMMON,
              PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON,
              PRECOMPUTED_POKEMONS_PER_RARITY.RARE
            ][pokemon.stars - 1] ?? PRECOMPUTED_POKEMONS_PER_RARITY.RARE
          ).filter((pkm) => {
            const data = getPokemonData(pkm)
            return (
              data.stars === 1 &&
              data.skill !== Ability.DEFAULT &&
              data.types.includes(Synergy.BUG)
            )
          })

          // Pick a random bug pokemon from the filtered list
          const randomBugPkm = pickRandomIn<Pkm>(possibleBugsPkm)

          // Create the bug pokemon instance
          const randomBug = PokemonFactory.createPokemonFromName(
            randomBugPkm,
            pokemon.player
          )

          // Add the bug pokemon to the original position
          pokemon.simulation.addPokemon(randomBug, x, y, pokemon.team, true)
        }
      }
    }
  }
}
