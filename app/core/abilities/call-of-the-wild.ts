import { RarityCost } from "../../config"
import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../models/precomputed/precomputed-types"
import { Rarity } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { WandererBehavior, WandererType } from "../../types/enum/Wanderer"
import type { IPokemonData } from "../../types/interfaces/PokemonData"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CallOfTheWildStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const nbSpawns = 2
    const nbCatchs = Math.round(3 * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1))

    const candidates: IPokemonData[] = PRECOMPUTED_POKEMONS_PER_TYPE[
      Synergy.WILD
    ]
      .map((p) => getPokemonData(p))
      .filter((p) => p.rarity === pokemon.rarity && p.stars === pokemon.stars)

    if (candidates.length === 0) {
      candidates.push(getPokemonData(Pkm.URSALUNA))
    }
    const spawns: IPokemonData[] = Array.from({ length: nbSpawns }, () =>
      pickRandomIn(candidates)
    )

    spawns.forEach((spawn) => {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        pokemon,
        pokemon.team
      )
      if (!coord) return
      const mon = PokemonFactory.createPokemonFromName(spawn.name)
      pokemon.simulation.addPokemon(mon, coord.x, coord.y, pokemon.team, false)
    })

    if (pokemon.player) {
      const catchableCandidates: IPokemonData[] = PRECOMPUTED_POKEMONS_PER_TYPE[
        Synergy.WILD
      ]
        .map((p) => getPokemonData(p))
        .filter(
          (p) =>
            p.rarity !== Rarity.SPECIAL &&
            RarityCost[p.rarity] < RarityCost[pokemon.rarity] &&
            p.stars < pokemon.stars
        )

      if (catchableCandidates.length > 0) {
        const catchableSpawns = Array.from({ length: nbCatchs }, () =>
          pickRandomIn(catchableCandidates)
        )
        for (const spawn of catchableSpawns) {
          pokemon.player.spawnWanderingPokemon({
            pkm: spawn.name,
            behavior: WandererBehavior.SPECTATE,
            type: WandererType.CATCHABLE
          })
        }
      }
    }
  }
}
