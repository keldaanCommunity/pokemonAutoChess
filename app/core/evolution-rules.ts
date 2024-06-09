import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { EvolutionTime } from "../types/Config"
import { PokemonActionState } from "../types/enum/Game"
import { ItemComponents, Item } from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Pkm } from "../types/enum/Pokemon"
import { logger } from "../utils/logger"
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
    if (pokemon.evolution === Pkm.DEFAULT || pokemon.items.has(Item.EVIOLITE))
      return false
    const count = values(player.board).filter(
      (pkm) => pkm.index === pokemon.index
    ).length
    return count >= this.numberRequired
  }

  canEvolveIfBuyingOne(pokemon: Pokemon, player: Player): boolean {
    if (pokemon.evolution === Pkm.DEFAULT || pokemon.items.has(Item.EVIOLITE))
      return false
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

    for (let i = 0; i < 3; i++) {
      const itemToAdd = itemsToAdd.pop()
      if (itemToAdd) {
        if (pokemonEvolved.items.has(itemToAdd)) {
          player.items.push(itemToAdd)
        } else {
          pokemonEvolved.items.add(itemToAdd)
        }
      }
    }

    itemsToAdd.forEach((item) => {
      player.items.push(item)
    })
    itemComponentsToAdd.forEach((item) => {
      player.items.push(item)
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
      setTimeout(
        () => pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel),
        2000
      )
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
