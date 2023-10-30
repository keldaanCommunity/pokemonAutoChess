import { Pkm } from "../types/enum/Pokemon"
import { Pokemon } from "../models/colyseus-models/pokemon"
import Player from "../models/colyseus-models/player"
import { values } from "../utils/schemas"
import { logger } from "colyseus"
import PokemonFactory from "../models/pokemon-factory"
import { BasicItems, Item } from "../types/enum/Item"
import { EvolutionTime } from "../types/Config"
import { PokemonActionState } from "../types/enum/Game"

type DivergentEvolution = (
  pokemon: Pokemon,
  player: Player,
  ...aditionalArgs: any[]
) => Pkm

export abstract class EvolutionRule {
  abstract canEvolve(
    pokemon: Pokemon,
    player: Player,
    stageLevel: number
  ): boolean
  abstract evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon
  divergentEvolution?: DivergentEvolution

  constructor(divergentEvolution?: DivergentEvolution) {
    if (divergentEvolution) this.divergentEvolution = divergentEvolution
  }

  tryEvolve(
    pokemon: Pokemon,
    player: Player,
    stageLevel: number
  ): void | Pokemon {
    if (this.canEvolve(pokemon, player, stageLevel)) {
      const pokemonEvolved = this.evolve(pokemon, player, stageLevel)
      this.afterEvolve(pokemonEvolved, player)
      return pokemonEvolved
    }
  }

  afterEvolve(pokemonEvolved: Pokemon, player: Player) {
    player.synergies.update(player.board)
    player.effects.update(player.synergies, player.board)
    pokemonEvolved.onAcquired(player)
  }
}

export class CountEvolutionRule extends EvolutionRule {
  numberRequired: number

  constructor(
    numberRequired: number,
    divergentEvolution?: (pokemon: Pokemon, player: Player) => Pkm
  ) {
    super(divergentEvolution)
    this.numberRequired = numberRequired
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.evolution === Pkm.DEFAULT) return false
    const count = values(player.board).filter(
      (pkm) => pkm.index === pokemon.index
    ).length
    return count >= this.numberRequired
  }

  canEvolveIfBuyingOne(pokemon: Pokemon, player: Player): boolean {
    if (pokemon.evolution === Pkm.DEFAULT) return false
    const count = values(player.board).filter(
      (pkm) => pkm.index === pokemon.index
    ).length
    return count >= this.numberRequired - 1
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    let pokemonEvolutionName = pokemon.evolution
    if (this.divergentEvolution) {
      pokemonEvolutionName = this.divergentEvolution(pokemon, player)
    }

    let coord: { x: number; y: number } | undefined
    const itemsToAdd = new Array<Item>()
    const basicItemsToAdd = new Array<Item>()

    player.board.forEach((pkm, id) => {
      if (pkm.index == pokemon.index) {
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
          if (BasicItems.includes(el)) {
            basicItemsToAdd.push(el)
          } else {
            itemsToAdd.push(el)
          }
        })
        player.board.delete(id)
      }
    })

    const pokemonEvolved = PokemonFactory.createPokemonFromName(
      pokemonEvolutionName,
      player
    )

    for (let i = 0; i < 3; i++) {
      const itemToAdd = itemsToAdd.pop()
      if (itemToAdd) {
        if (pokemonEvolved.items.has(itemToAdd)) {
          player.items.add(itemToAdd)
        } else {
          pokemonEvolved.items.add(itemToAdd)
        }
      }
    }

    itemsToAdd.forEach((item) => {
      player.items.add(item)
    })
    basicItemsToAdd.forEach((item) => {
      player.items.add(item)
    })

    if (coord) {
      // logger.debug(coord, pokemonEvolved.name)
      pokemonEvolved.positionX = coord.x
      pokemonEvolved.positionY = coord.y
      player.board.set(pokemonEvolved.id, pokemonEvolved)
    } else {
      logger.error("no coordinate found for new evolution")
    }

    return pokemonEvolved
  }
}

export class ItemEvolutionRule extends EvolutionRule {
  itemsTriggeringEvolution: Item[]

  constructor(
    itemsTriggeringEvolution: Item[],
    divergentEvolution?: (pokemon: Pokemon, player: Player, item: Item) => Pkm
  ) {
    super(divergentEvolution)
    this.itemsTriggeringEvolution = itemsTriggeringEvolution
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    return values(pokemon.items).some((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    let pokemonEvolutionName = pokemon.evolution
    if (this.divergentEvolution) {
      const itemEvolution = values(pokemon.items).find((item) =>
        this.itemsTriggeringEvolution.includes(item)
      )
      pokemonEvolutionName = this.divergentEvolution(
        pokemon,
        player,
        itemEvolution
      )
    }

    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}

export class HatchEvolutionRule extends EvolutionRule {
  evolutionTimer: number
  constructor(
    roundsRequired = EvolutionTime.EVOLVE_HATCH,
    divergentEvolution?: DivergentEvolution
  ) {
    super(divergentEvolution)
    this.evolutionTimer = roundsRequired
  }

  updateRound(pokemon: Pokemon, player: Player, stageLevel: number) {
    this.evolutionTimer -= 1
    pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel)
    if (pokemon.name === Pkm.EGG && this.evolutionTimer >= 1) {
      pokemon.action =
        this.evolutionTimer >= 2
          ? PokemonActionState.IDLE
          : PokemonActionState.HOP
    }
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    return this.evolutionTimer === 0
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    let pokemonEvolutionName = pokemon.evolution
    if (this.divergentEvolution) {
      pokemonEvolutionName = this.divergentEvolution(pokemon, player)
    }
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}

export class TurnEvolutionRule extends EvolutionRule {
  stageLevel: number
  constructor(stageLevel: number, divergentEvolution?: DivergentEvolution) {
    super(divergentEvolution)
    this.stageLevel = stageLevel
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    return stageLevel >= this.stageLevel
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    let pokemonEvolutionName = pokemon.evolution
    if (this.divergentEvolution) {
      pokemonEvolutionName = this.divergentEvolution(pokemon, player)
    }
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
