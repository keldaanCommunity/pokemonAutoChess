import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import PokemonFactory from "../../models/pokemon-factory"
import { Item, ItemComponents } from "../../types"
import type { CountEvolutionRule } from "../../types/EvolutionRules"
import { Pkm } from "../../types/enum/Pokemon"
import { isOnBench } from "../../utils/board"
import { logger } from "../../utils/logger"
import { shuffleArray } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"
import { carryOverPermanentStats, EvolutionHandler } from "./evolution-handler"

export class CountEvolutionHandler extends EvolutionHandler {
  numberRequired: number

  constructor(evolutionRule: CountEvolutionRule) {
    super(evolutionRule)
    this.numberRequired = evolutionRule.numberRequired
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (!pokemon.hasEvolution) return false

    // special case for Avalugg passive, didnt find a better way to do it
    if (
      pokemon.name === Pkm.BERGMITE &&
      schemaValues(player.board).find(
        (p) => p.name === Pkm.AVALUGG || p.name === Pkm.HISUI_AVALUGG
      )
    ) {
      return false
    }

    const copies = schemaValues(player.board).filter(
      (p) => p.index === pokemon.index && !p.items.has(Item.EVIOLITE)
    )
    return copies.length >= this.numberRequired
  }

  canEvolveIfGettingOne(pokemon: Pokemon, player: Player): boolean {
    if (!pokemon.hasEvolution) return false

    // special case for Avalugg passive, didnt find a better way to do it
    if (
      pokemon.name === Pkm.BERGMITE &&
      schemaValues(player.board).find(
        (p) => p.name === Pkm.AVALUGG || p.name === Pkm.HISUI_AVALUGG
      )
    ) {
      return false
    }

    const copies = schemaValues(player.board).filter(
      (p) => p.index === pokemon.index && !p.items.has(Item.EVIOLITE)
    )
    return copies.length === this.numberRequired - 1
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel)
    let coord: { x: number; y: number } | undefined
    const itemsComponentsOnBench: Item[] = []
    const itemsCompleteOnBench: Item[] = []
    const itemsComponentsOnBoard: Item[] = []
    const itemsCompleteOnBoard: Item[] = []

    const pokemonsBeforeEvolution: Pokemon[] = []

    player.board.forEach((pkm, id) => {
      if (
        pkm.index == pokemon.index &&
        !pkm.items.has(Item.EVIOLITE) &&
        pokemonsBeforeEvolution.length < this.numberRequired
      ) {
        // logger.debug(pkm.name, pokemon.name)
        if (coord) {
          if (pkm.positionY > coord.y) {
            coord.x = pkm.positionX
            coord.y = pkm.positionY
            // logger.debug('better coord', coord)
          }
        } else {
          if (pkm.positionX !== -1) {
            coord = { x: pkm.positionX, y: pkm.positionY }
          }

          // logger.debug('first coord', coord)
        }

        pkm.items.forEach((el) => {
          if (ItemComponents.includes(el)) {
            if (isOnBench(pkm)) {
              itemsComponentsOnBench.push(el)
            } else {
              itemsComponentsOnBoard.push(el)
            }
          } else {
            if (isOnBench(pkm)) {
              itemsCompleteOnBench.push(el)
            } else {
              itemsCompleteOnBoard.push(el)
            }
          }
        })
        player.board.delete(id)
        pokemonsBeforeEvolution.push(pkm)
      }
    })

    const pokemonEvolved = PokemonFactory.createPokemonFromName(
      pokemonEvolutionName,
      player
    )

    carryOverPermanentStats(pokemonEvolved, pokemonsBeforeEvolution)
    pokemonEvolved.stacks = pokemon.stacks // carry over the stacks (since they're not supposed to be linked to the evolution rule)

    shuffleArray(itemsCompleteOnBench)
    shuffleArray(itemsCompleteOnBoard)

    const itemsCompleteToAdd = [
      ...itemsCompleteOnBoard,
      ...itemsCompleteOnBench
    ]

    for (const item of itemsCompleteToAdd) {
      if (pokemonEvolved.items.has(item) || pokemonEvolved.items.size >= 3) {
        player.items.push(item)
      } else {
        pokemonEvolved.items.add(item)
        if (item === Item.SHINY_CHARM) {
          pokemonEvolved.shiny = true
        }
      }
    }

    shuffleArray(itemsComponentsOnBench)
    shuffleArray(itemsComponentsOnBoard)
    const itemComponentsToAdd = [
      ...itemsComponentsOnBoard,
      ...itemsComponentsOnBench
    ]
    for (const itemComponent of itemComponentsToAdd) {
      if (
        schemaValues(pokemonEvolved.items).some((i) =>
          ItemComponents.includes(i)
        ) ||
        pokemonEvolved.items.size >= 3
      ) {
        player.items.push(itemComponent)
      } else {
        pokemonEvolved.items.add(itemComponent)
      }
    }

    if (pokemonsBeforeEvolution.some((p) => p.dishes.size > 0)) {
      const dishes = pokemonsBeforeEvolution
        .filter((p) => p.dishes.size > 0)
        .flatMap((p) => schemaValues(p.dishes))
      while (pokemonEvolved.canEat && dishes.length > 0) {
        const dish = dishes.pop()
        if (dish && !pokemonEvolved.dishes.has(dish)) {
          pokemonEvolved.dishes.add(dish)
        }
      }
    }

    if (coord) {
      // logger.debug(coord, pokemonEvolved.name)
      pokemonEvolved.positionX = coord.x
      pokemonEvolved.positionY = coord.y
      player.board.set(pokemonEvolved.id, pokemonEvolved)
    } else {
      logger.error("no coordinate found for new evolution")
    }

    if (pokemon.afterEvolve) {
      pokemon.afterEvolve({ pokemonEvolved, pokemonsBeforeEvolution, player })
    }

    pokemonEvolved.onAcquired(player)
    return pokemonEvolved
  }
}
