import PokemonFactory from "./pokemon-factory"
import {
  getUnownsPoolPerStage,
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmProposition
} from "../types/enum/Pokemon"
import Player from "./colyseus-models/player"
import {
  RarityProbabilityPerLevel,
  DITTO_RATE,
  PoolSize,
  CommonShop,
  EpicShop,
  LegendaryShop,
  RareShop,
  UncommonShop,
  FishRarityProbability,
  SHOP_SIZE,
  NB_MYTHICAL_PROPOSITIONS
} from "../types/Config"
import { Rarity } from "../types/enum/Game"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  shuffleArray
} from "../utils/random"
import { clamp } from "../utils/number"
import { removeInArray } from "../utils/array"
import { Pokemon } from "./colyseus-models/pokemon"
import { logger } from "../utils/logger"
import { Synergy } from "../types/enum/Synergy"
import { IPlayer } from "../types"
import { Effect } from "../types/enum/Effect"

export function getPoolSize(rarity: Rarity, maxStars: number): number {
  return PoolSize[rarity][clamp(maxStars, 1, 3) - 1]
}

export default class Shop {
  commonPool: Map<Pkm, number> = new Map<Pkm, number>()
  uncommonPool: Map<Pkm, number> = new Map<Pkm, number>()
  rarePool: Map<Pkm, number> = new Map<Pkm, number>()
  epicPool: Map<Pkm, number> = new Map<Pkm, number>()
  legendaryPool: Map<Pkm, number> = new Map<Pkm, number>()
  constructor() {
    CommonShop.forEach((pkm) => {
      this.commonPool.set(pkm, getPoolSize(Rarity.COMMON, 3))
    })
    UncommonShop.forEach((pkm) => {
      const maxStars = pkm === Pkm.EEVEE ? 2 : 3
      this.uncommonPool.set(pkm, getPoolSize(Rarity.UNCOMMON, maxStars))
    })
    RareShop.forEach((pkm) => {
      this.rarePool.set(pkm, getPoolSize(Rarity.RARE, 3))
    })
    EpicShop.forEach((pkm) => {
      this.epicPool.set(pkm, getPoolSize(Rarity.EPIC, 3))
    })
    LegendaryShop.forEach((pkm) => {
      this.legendaryPool.set(pkm, getPoolSize(Rarity.LEGENDARY, 3))
    })
  }

  addAdditionalPokemon(pkmProposition: PkmProposition) {
    const pkm: Pkm =
      pkmProposition in PkmDuos ? PkmDuos[pkmProposition][0] : pkmProposition
    const p = PokemonFactory.createPokemonFromName(pkm)
    switch (p.rarity) {
      case Rarity.COMMON:
        this.commonPool.set(pkm, getPoolSize(Rarity.COMMON, 2))
        break
      case Rarity.UNCOMMON:
        this.uncommonPool.set(pkm, getPoolSize(Rarity.UNCOMMON, 2))
        break
      case Rarity.RARE:
        this.rarePool.set(pkm, getPoolSize(Rarity.RARE, 2))
        break
      case Rarity.EPIC:
        this.epicPool.set(pkm, getPoolSize(Rarity.EPIC, 2))
        break
      case Rarity.LEGENDARY:
        this.legendaryPool.set(pkm, getPoolSize(Rarity.LEGENDARY, 2))
        break
      default:
        break
    }
  }

  releasePokemon(pkm: Pkm) {
    const pokemon = PokemonFactory.createPokemonFromName(pkm)
    const family = PkmFamily[pokemon.name]
    const entityNumber = pokemon.stars === 3 ? 9 : pokemon.stars === 2 ? 3 : 1
    if (pokemon.rarity === Rarity.COMMON) {
      const value = this.commonPool.get(family)
      if (value !== undefined) {
        this.commonPool.set(family, value + entityNumber)
      }
    } else if (pokemon.rarity === Rarity.UNCOMMON) {
      const value = this.uncommonPool.get(family)
      if (value !== undefined) {
        this.uncommonPool.set(family, value + entityNumber)
      }
    } else if (pokemon.rarity === Rarity.RARE) {
      const value = this.rarePool.get(family)
      if (value !== undefined) {
        this.rarePool.set(family, value + entityNumber)
      }
    } else if (pokemon.rarity === Rarity.EPIC) {
      const value = this.epicPool.get(family)
      if (value !== undefined) {
        this.epicPool.set(family, value + entityNumber)
      }
    } else if (pokemon.rarity === Rarity.LEGENDARY) {
      const value = this.legendaryPool.get(family)
      if (value !== undefined) {
        this.legendaryPool.set(family, value + entityNumber)
      }
    }
  }

  refillShop(player: Player, stageLevel: number) {
    // No need to release pokemons since they won't be changed
    const PkmList = player.shop.map((pokemon) => {
      if (pokemon != Pkm.MAGIKARP && pokemon != Pkm.DEFAULT) {
        return pokemon
      }
      return this.pickPokemon(player, stageLevel)
    })

    for (let i = 0; i < SHOP_SIZE; i++) {
      player.shop[i] = PkmList[i]
    }
  }

  assignShop(player: Player, manualRefresh: boolean, stageLevel: number) {
    player.shop.forEach((pkm) => this.releasePokemon(pkm))

    if (player.effects.list.includes(Effect.EERIE_SPELL) && !manualRefresh) {
      const unowns = getUnownsPoolPerStage(stageLevel)
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = pickRandomIn(unowns)
      }
    } else {
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = this.pickPokemon(player, stageLevel)
      }
    }
  }

  assignMythicalPropositions(
    player: Player,
    list: PkmProposition[],
    synergies: Synergy[]
  ) {
    const mythicals = [...list]

    // ensure we have at least one synergy per proposition
    if (synergies.length > NB_MYTHICAL_PROPOSITIONS) {
      synergies = pickNRandomIn(synergies, NB_MYTHICAL_PROPOSITIONS)
    } else if (synergies.length < NB_MYTHICAL_PROPOSITIONS) {
      while (synergies.length < NB_MYTHICAL_PROPOSITIONS) {
        synergies.push(pickRandomIn(Synergy))
      }
    }

    for (let i = 0; i < NB_MYTHICAL_PROPOSITIONS; i++) {
      const synergy = synergies[i]
      const candidates = mythicals.filter((m) => {
        const pkm: Pkm = m in PkmDuos ? PkmDuos[m][0] : m
        return PokemonFactory.createPokemonFromName(pkm).types.includes(synergy)
      })
      const selectedProposition = pickRandomIn(
        candidates.length > 0 ? candidates : mythicals
      )
      removeInArray(mythicals, selectedProposition)
      player.pokemonsProposition.push(selectedProposition)
    }
  }

  getRandomPokemonFromPool(
    pool: Map<Pkm, number>,
    finals: Array<Pkm>,
    specificTypeWanted?: Synergy
  ): Pkm {
    let pkm = Pkm.MAGIKARP
    const candidates = new Array<Pkm>()
    pool.forEach((value, pkm) => {
      const pokemon = PokemonFactory.createPokemonFromName(pkm)
      const isOfTypeWanted =
        !specificTypeWanted || pokemon.types.includes(specificTypeWanted)

      if (isOfTypeWanted && !finals.includes(pkm)) {
        for (let i = 0; i < value; i++) {
          candidates.push(pkm)
        }
      }
    })
    if (candidates.length > 0) {
      pkm = pickRandomIn(candidates)
    }
    const val = pool.get(pkm)
    if (val !== undefined) {
      pool.set(pkm, Math.max(0, val - 1))
    }
    //logger.debug("taking a ", pkm, "from the shop", val)
    return pkm
  }

  pickPokemon(player: Player, stageLevel: number) {
    const rarityProbability =
      RarityProbabilityPerLevel[player.experienceManager.level]
    const rarity_seed = Math.random()
    let pokemon = Pkm.MAGIKARP
    let threshold = 0
    const finals = new Array<Pkm>()

    if (chance(DITTO_RATE)) {
      return Pkm.DITTO
    }

    const UNOWN_RATE = 0.05
    if (
      player.effects.list.includes(Effect.LIGHT_SCREEN) &&
      chance(UNOWN_RATE)
    ) {
      const unowns = getUnownsPoolPerStage(stageLevel)
      return pickRandomIn(unowns)
    }

    player.board.forEach((pokemon: Pokemon) => {
      if (pokemon.final) {
        finals.push(PkmFamily[pokemon.name])
      }
    })

    for (let i = 0; i < rarityProbability.length; i++) {
      threshold += rarityProbability[i]
      if (rarity_seed < threshold) {
        switch (i) {
          case 0:
            pokemon = this.getRandomPokemonFromPool(this.commonPool, finals)
            break
          case 1:
            pokemon = this.getRandomPokemonFromPool(this.uncommonPool, finals)
            break
          case 2:
            pokemon = this.getRandomPokemonFromPool(this.rarePool, finals)
            break
          case 3:
            pokemon = this.getRandomPokemonFromPool(this.epicPool, finals)
            break
          case 4:
            pokemon = this.getRandomPokemonFromPool(this.legendaryPool, finals)
            break
          default:
            logger.error(
              `error in shop while picking seed = ${rarity_seed}, threshold = ${threshold}, index = ${i}`
            )
            break
        }
        break
      }
    }

    return pokemon
  }

  fishPokemon(player: IPlayer, fishingLevel: number): Pkm {
    const rarityProbability = FishRarityProbability[fishingLevel]
    const rarity_seed = Math.random()
    let fish: Pkm = Pkm.MAGIKARP
    let threshold = 0
    const finals = new Array<Pkm>()

    player.board.forEach((pokemon: Pokemon) => {
      if (pokemon.final) {
        finals.push(PkmFamily[pokemon.name])
      }
    })

    for (const rarity in rarityProbability) {
      threshold += rarityProbability[rarity]
      if (rarity_seed < threshold) {
        switch (rarity) {
          case Rarity.COMMON:
            fish = this.getRandomPokemonFromPool(
              this.commonPool,
              finals,
              Synergy.WATER
            )
            break
          case Rarity.UNCOMMON:
            fish = this.getRandomPokemonFromPool(
              this.uncommonPool,
              finals,
              Synergy.WATER
            )
            break
          case Rarity.RARE:
            fish = this.getRandomPokemonFromPool(
              this.rarePool,
              finals,
              Synergy.WATER
            )
            break
          case Rarity.EPIC:
            fish = this.getRandomPokemonFromPool(
              this.epicPool,
              finals,
              Synergy.WATER
            )
            break
          case Rarity.SPECIAL:
          default:
            fish = Pkm.MAGIKARP
            break
        }
        break
      }
    }

    return fish
  }
}
