import Player from "../models/colyseus-models/player"
import { Pokemon, PokemonClasses } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { IPlayer } from "../types"
import { EvolutionTime } from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { PokemonActionState } from "../types/enum/Game"
import { Item, ItemComponents, ShinyItems } from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Pkm } from "../types/enum/Pokemon"
import { sum } from "../utils/array"
import { logger } from "../utils/logger"
import { pickRandomIn, shuffleArray } from "../utils/random"
import { values } from "../utils/schemas"

type DivergentEvolution = (
  pokemon: Pokemon,
  player: IPlayer,
  ...additionalArgs: unknown[]
) => Pkm

export abstract class EvolutionRule {
  abstract canEvolve(
    pokemon: Pokemon,
    player: Player,
    stageLevel: number
  ): boolean
  abstract evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon
  divergentEvolution?: DivergentEvolution
  stacks: number

  constructor(divergentEvolution?: DivergentEvolution) {
    if (divergentEvolution) this.divergentEvolution = divergentEvolution
    this.stacks = 0
  }

  getEvolution(
    pokemon: Pokemon,
    player: IPlayer,
    ...additionalArgs: unknown[]
  ): Pkm {
    if (this.divergentEvolution) {
      return this.divergentEvolution(pokemon, player, ...additionalArgs)
    }
    return pokemon.evolution
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
    pokemonEvolved.onAcquired(player)
    player.updateSynergies()
    player.board.forEach((pokemon) => {
      if (
        (pokemon.passive === Passive.COSMOG ||
          pokemon.passive === Passive.COSMOEM) &&
        pokemonEvolved.passive !== Passive.COSMOG &&
        pokemonEvolved.passive !== Passive.COSMOEM
      ) {
        pokemon.hp += 10
        pokemon.evolutionRule.stacks++
      }
      // check evolutions again if it can evolve twice in a row
      pokemon.evolutionRule.tryEvolve(pokemon, player, stageLevel)
    })
  }
}

export class CountEvolutionRule extends EvolutionRule {
  numberRequired: number

  constructor(
    numberRequired: number,
    divergentEvolution?: (pokemon: Pokemon, player: IPlayer) => Pkm
  ) {
    super(divergentEvolution)
    this.numberRequired = numberRequired
  }

  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (!pokemon.hasEvolution) return false
    const copies = values(player.board).filter(
      (p) => p.index === pokemon.index && !p.items.has(Item.EVIOLITE)
    )
    return copies.length >= this.numberRequired
  }

  canEvolveIfBuyingOne(pokemon: Pokemon, player: Player): boolean {
    if (!pokemon.hasEvolution) return false
    const copies = values(player.board).filter(
      (p) => p.index === pokemon.index && !p.items.has(Item.EVIOLITE)
    )
    return copies.length >= this.numberRequired - 1
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel)
    let coord: { x: number; y: number } | undefined
    const itemsToAdd = new Array<Item>()
    const itemComponentsToAdd = new Array<Item>()

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

    carryOverPermanentStats(pokemonEvolved, pokemonsBeforeEvolution)
    if (pokemonsBeforeEvolution.some((p) => p.meal)) {
      pokemonEvolved.meal = pickRandomIn(
        pokemonsBeforeEvolution.filter((p) => p.meal).map((p) => p.meal)
      )
    }

    shuffleArray(itemsToAdd)
    for (const item of itemsToAdd) {
      if (pokemonEvolved.items.has(item) || pokemonEvolved.items.size >= 3) {
        player.items.push(item)
      } else {
        pokemonEvolved.items.add(item)
        if (item === Item.SHINY_CHARM) {
          pokemonEvolved.shiny = true
        }
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

    if (pokemon.afterEvolve) {
      pokemon.afterEvolve({ pokemonEvolved, pokemonsBeforeEvolution, player })
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
    const items = values(pokemon.items)
    pokemon.meal !== "" && items.push(pokemon.meal)
    const itemEvolution = items.find((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )

    const pokemonEvolutionName = this.getEvolution(
      pokemon,
      player,
      itemEvolution
    )
    return itemEvolution != null && pokemonEvolutionName !== pokemon.name
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    const itemEvolution = values(pokemon.items).find((item) =>
      this.itemsTriggeringEvolution.includes(item)
    )
    const pokemonEvolutionName = this.getEvolution(
      pokemon,
      player,
      itemEvolution
    )
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
    this.evolutionTimer = EvolutionTime.EVOLVE_HATCH // prevent trying to evolve twice in a row
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel)
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
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
export function carryOverPermanentStats(
  pokemonEvolved: Pokemon,
  pokemonsBeforeEvolution: Pokemon[]
) {
  // carry over the permanent stat buffs
  const permanentBuffStats = ["hp", "atk", "def", "speDef"] as const
  const baseData = new PokemonClasses[pokemonsBeforeEvolution[0].name]()
  for (const stat of permanentBuffStats) {
    const statStacked = sum(
      pokemonsBeforeEvolution.map((p) => p[stat] - baseData[stat])
    )
    if (statStacked > 0) {
      pokemonEvolved[stat] += statStacked
    }
  }

  // carry over TM
  const existingTms = pokemonsBeforeEvolution
    .map((p) => p.tm)
    .filter<Ability>((tm): tm is Ability => tm != null)
  if (existingTms.length > 0) {
    pokemonEvolved.tm = pickRandomIn(existingTms)
    pokemonEvolved.skill = pokemonEvolved.tm
    pokemonEvolved.maxPP = 100
  }
}
