import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { EvolutionTime } from "../types/Config"
import { PokemonActionState } from "../types/enum/Game"
import { ItemComponents, Item, ShinyItems } from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Pkm } from "../types/enum/Pokemon"
import { logger } from "../utils/logger"
import { pickRandomIn, shuffleArray } from "../utils/random"
import { values } from "../utils/schemas"

type DivergentEvolution = (
  pokemon: Pokemon,
  player: Player,
  ...aditionalArgs: unknown[]
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
      this.afterEvolve(pokemonEvolved, player, stageLevel)
      return pokemonEvolved
    }
  }

  afterEvolve(pokemonEvolved: Pokemon, player: Player, stageLevel: number) {
    player.updateSynergies()
    pokemonEvolved.onAcquired(player)
    player.board.forEach((pokemon) => {
      if (
        (pokemon.passive === Passive.COSMOG ||
          pokemon.passive === Passive.COSMOEM) &&
        pokemonEvolved.passive !== Passive.COSMOG &&
        pokemonEvolved.passive !== Passive.COSMOEM
      ) {
        pokemon.hp += 10
        pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel)
      }
    })
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
    const copies = values(player.board).filter((p) => p.index === pokemon.index)
    if (
      pokemon.evolution === Pkm.DEFAULT ||
      copies.some((p) => p.items.has(Item.EVIOLITE))
    ) {
      return false
    }
    return copies.length >= this.numberRequired
  }

  canEvolveIfBuyingOne(pokemon: Pokemon, player: Player): boolean {
    const copies = values(player.board).filter((p) => p.index === pokemon.index)
    if (
      pokemon.evolution === Pkm.DEFAULT ||
      copies.some((p) => p.items.has(Item.EVIOLITE))
    ) {
      return false
    }
    return copies.length >= this.numberRequired - 1
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    let pokemonEvolutionName = pokemon.evolution
    if (this.divergentEvolution) {
      pokemonEvolutionName = this.divergentEvolution(pokemon, player)
    }

    let coord: { x: number; y: number } | undefined
    const itemsToAdd = new Array<Item>()
    const itemComponentsToAdd = new Array<Item>()

    const pokemonsBeforeEvolution: Pokemon[] = []

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
          if (ItemComponents.includes(el)) {
            itemComponentsToAdd.push(el)
          } else {
            itemsToAdd.push(el)
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
    if (pokemon.onEvolve) {
      pokemon.onEvolve({ pokemonEvolved, pokemonsBeforeEvolution, player })
    }

    shuffleArray(itemsToAdd)
    for (const item of itemsToAdd) {
      if (pokemonEvolved.items.has(item) || pokemonEvolved.items.size >= 3) {
        player.items.push(item)
      } else {
        pokemonEvolved.items.add(item)
      }
    }

    shuffleArray(itemComponentsToAdd)
    for (const itemComponent of itemComponentsToAdd) {
      if (
        pokemonEvolved.items.has(itemComponent) ||
        pokemonEvolved.items.size >= 3
      ) {
        player.items.push(itemComponent)
      } else {
        pokemonEvolved.items.add(itemComponent)
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

    return pokemonEvolved
  }
}

export class ItemEvolutionRule extends EvolutionRule {
  itemsTriggeringEvolution: Item[]

  constructor(
    itemsTriggeringEvolution: Item[],
    divergentEvolution?: DivergentEvolution
  ) {
    super(divergentEvolution)
    this.itemsTriggeringEvolution = itemsTriggeringEvolution
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    const itemEvolution = values(pokemon.items).find((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )

    let pokemonEvolutionName = pokemon.evolution
    if (this.divergentEvolution && itemEvolution) {
      pokemonEvolutionName = this.divergentEvolution(
        pokemon,
        player,
        itemEvolution
      )
    }

    return itemEvolution != null && pokemonEvolutionName !== pokemon.name
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

  updateHatch(pokemon: Pokemon, player: Player, stageLevel: number) {
    this.evolutionTimer -= 1
    const willHatch = this.canEvolve(pokemon, player, stageLevel)
    if (willHatch) {
      pokemon.action = PokemonActionState.HOP
      setTimeout(() => {
        pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel)
        if (pokemon.name === Pkm.EGG && pokemon.shiny) {
          player.items.push(pickRandomIn(ShinyItems))
        }
      }, 2000)
    } else if (pokemon.name === Pkm.EGG) {
      pokemon.action =
        [
          PokemonActionState.HOP,
          PokemonActionState.EMOTE,
          PokemonActionState.IDLE
        ][this.evolutionTimer] ?? PokemonActionState.IDLE
    }
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
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

type EvolutionCondition = (
  pokemon: Pokemon,
  player: Player,
  stageLevel: number
) => boolean

export class ConditionBasedEvolutionRule extends EvolutionRule {
  condition: EvolutionCondition
  constructor(
    condition: EvolutionCondition,
    divergentEvolution?: DivergentEvolution
  ) {
    super(divergentEvolution)
    this.condition = condition
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    return this.condition(pokemon, player, stageLevel)
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
