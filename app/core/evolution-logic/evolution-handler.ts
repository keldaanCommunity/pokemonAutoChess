import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import PokemonFactory from "../../models/pokemon-factory"
import type { IPlayer } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { Passive } from "../../types/enum/Passive"
import type { Pkm } from "../../types/enum/Pokemon"
import { sum } from "../../utils/array"
import { pickRandomIn } from "../../utils/random"
import { EvolutionManager } from "./evolution-manager"

type DivergentEvolution<Param = any> = (
  pokemon: Pokemon,
  player: IPlayer,
  ...additionalArgs: Param[]
) => Pkm

export abstract class EvolutionHandler {
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
      if (pokemon.supercharged) pokemonEvolved.supercharged = true
      this.afterEvolve(pokemonEvolved, player, stageLevel)
      return pokemonEvolved
    }
  }

  afterEvolve(pokemonEvolved: Pokemon, player: Player, stageLevel: number) {
    player.updateSynergies()
    player.board.forEach((pokemon) => {
      if (
        (pokemon.passive === Passive.COSMOG ||
          pokemon.passive === Passive.COSMOEM) &&
        pokemonEvolved.passive !== Passive.COSMOG &&
        pokemonEvolved.passive !== Passive.COSMOEM
      ) {
        pokemon.addMaxHP(10)
        pokemon.stacks++
        EvolutionManager.tryEvolve(pokemon, player, stageLevel)
      }
    })
    // check evolutions again if it can evolve twice in a row
    EvolutionManager.tryEvolve(pokemonEvolved, player, stageLevel)
  }
}

export function carryOverPermanentStats(
  pokemonEvolved: Pokemon,
  pokemonsBeforeEvolution: Pokemon[]
) {
  // carry over the permanent stat buffs
  const permanentBuffStats = [
    "hp",
    "maxHP",
    "atk",
    "def",
    "speDef",
    "speed",
    "ap",
    "luck"
  ] as const
  const pkm = pokemonsBeforeEvolution[0].name
  const baseData = PokemonFactory.createPokemonFromName(pkm)
  for (const stat of permanentBuffStats) {
    const sumOfPermaStatsModifier = sum(
      pokemonsBeforeEvolution.map((p) => p[stat] - baseData[stat])
    )
    pokemonEvolved[stat] += sumOfPermaStatsModifier // can be negative or positive
  }

  // carry over TM
  const existingTms = pokemonsBeforeEvolution
    .map((p) => p.tm)
    .filter<Ability>((tm): tm is Ability => tm !== Ability.DEFAULT)
  if (existingTms.length > 0) {
    pokemonEvolved.tm = pickRandomIn(existingTms)
    if (pokemonEvolved.tm === Ability.SKILL_SWAP) {
      // keep the ability learnt with skill swap if there is one
      pokemonEvolved.skill =
        pokemonsBeforeEvolution.find((p) => p.tm === Ability.SKILL_SWAP)
          ?.skill ?? Ability.SKILL_SWAP
    } else {
      pokemonEvolved.skill = pokemonEvolved.tm
    }
    pokemonEvolved.maxPP = 100
  }
}
