import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import type {
  DivergentEvolution,
  EvolutionContextMap,
  EvolutionRule,
  EvolutionRuleType
} from "../../types/EvolutionRules"
import { Ability } from "../../types/enum/Ability"
import { Stat } from "../../types/enum/Game"
import {
  SynergyGivenByItem,
  SynergyItems,
  TMPerAbility
} from "../../types/enum/Item"
import type { Pkm } from "../../types/enum/Pokemon"
import { ZMoves } from "../../types/enum/ZMoves"
import { isIn, sum } from "../../utils/array"
import { pickRandomIn } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"

export abstract class EvolutionHandler<T extends EvolutionRuleType> {
  protected divergentEvolution?: DivergentEvolution<T>

  constructor(
    evolutionRule: Extract<EvolutionRule, { type: T }> & {
      divergentEvolution?: DivergentEvolution<T>
    }
  ) {
    this.divergentEvolution = evolutionRule.divergentEvolution
  }

  abstract canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContextMap[T]
  ): boolean

  abstract evolve(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContextMap[T]
  ): Pokemon

  getEvolution(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContextMap[T]
  ): Pkm {
    if (this.divergentEvolution) {
      return this.divergentEvolution(pokemon, player, context)
    }
    return pokemon.evolution
  }
}

export function carryOverPermanentStats(
  pokemonEvolved: Pokemon,
  pokemonsBeforeEvolution: Pokemon[],
  player?: Player
) {
  // carry over the permanent stat buffs
  const permanentBuffStats = [
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
    const statMapping: Record<typeof stat, Stat> = {
      maxHP: Stat.HP,
      atk: Stat.ATK,
      def: Stat.DEF,
      speDef: Stat.SPE_DEF,
      speed: Stat.SPEED,
      ap: Stat.AP,
      luck: Stat.LUCK
    }
    pokemonEvolved.applyStat(statMapping[stat], sumOfPermaStatsModifier) // can be negative or positive
  }
}

export function carryOverChangedAbilities(
  pokemonEvolved: Pokemon,
  pokemonsBeforeEvolution: Pokemon[],
  player: Player
) {
  // carry over TM and Z-Moves
  const existingTms = pokemonsBeforeEvolution
    .map((p) => p.tm)
    .filter<Ability>((tm): tm is Ability => tm !== Ability.DEFAULT)
  const existingZMoves = pokemonsBeforeEvolution
    .map((p) => p.skill)
    .filter((skill) => isIn(ZMoves, skill))
  if (existingZMoves.length > 0) {
    pokemonEvolved.skill = pickRandomIn(existingZMoves)
    if (existingTms.length > 0) {
      // give back TM if taking the Z-Move
      pokemonEvolved.tm = Ability.DEFAULT
      player.items.push(...existingTms.map((tm) => TMPerAbility[tm]))
    }
  } else if (existingTms.length > 0) {
    pokemonEvolved.tm = pickRandomIn(existingTms)
    // only one TM can be kept, give back the other ones
    existingTms.splice(existingTms.indexOf(pokemonEvolved.tm), 1)
    existingTms.forEach((tm) => {
      const item = TMPerAbility.get(tm)
      if (item && player) player.items.push(item)
    })
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

export function carryOverTeraShards(
  pokemonEvolved: Pokemon,
  pokemonsBeforeEvolution: Pokemon[]
) {
  const typesGivenByItems = pokemonsBeforeEvolution.map((p) =>
    schemaValues(p.items)
      .filter((item) => isIn(SynergyItems, item))
      .map((item) => SynergyGivenByItem[item])
  )
  const teraTypes = pokemonsBeforeEvolution.flatMap((p, i) =>
    schemaValues(p.types).filter((type) => {
      const baseTypes = getPokemonData(p.name).types
      return !baseTypes.includes(type) && !isIn(typesGivenByItems[i], type)
    })
  )
  for (const type of teraTypes.flat()) {
    pokemonEvolved.types.add(type)
  }
}
