import { RarityCost } from "../../config"
import PokemonFactory from "../../models/pokemon-factory"
import { PokemonActionState } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { max } from "../../utils/number"
import { getOrientation } from "../../utils/orientation"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SwarmStrategy extends AbilityStrategy {
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    if (!pokemon.player) return
    const units = schemaValues(pokemon.player.board) 
    const nest = board.cells.find((p) => p?.name === Pkm.BUG_NEST)
    if (!nest) return

    const bugs = units
      .filter((p) => p.types.has(Synergy.BUG))
      .sort((a, b) => RarityCost[a.rarity] - RarityCost[b.rarity])
    const bugToSpawn =
      bugs[max(bugs.length - 1)(pokemon.count.ult - 1)] ?? bugs.at(-1)

    const freeCell = pokemon.simulation.getClosestFreeCellToPokemonEntity(nest)

    if (bugToSpawn && freeCell) {
      const spawn = pokemon.simulation.addPokemon(
        PokemonFactory.createPokemonFromName(bugToSpawn.name, pokemon.player),
        freeCell.x,
        freeCell.y,
        pokemon.team,
        true
      )
      spawn.action = PokemonActionState.NEST
      spawn.orientation = getOrientation(
        nest.positionX,
        nest.positionY,
        freeCell.x,
        freeCell.y
      )
      spawn.cooldown = 1000
    }
  }
}
