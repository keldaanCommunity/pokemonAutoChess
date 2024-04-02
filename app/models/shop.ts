import GameState from "../rooms/states/game-state"
import { IPlayer } from "../types"
import {
  DITTO_RATE,
  FishRarityProbability,
  NB_UNIQUE_PROPOSITIONS,
  PoolSize,
  RarityProbabilityPerLevel,
  SHOP_SIZE
} from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Effect } from "../types/enum/Effect"
import { Rarity } from "../types/enum/Game"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmProposition,
  getUnownsPoolPerStage
} from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { Synergy } from "../types/enum/Synergy"
import { removeInArray } from "../utils/array"
import { logger } from "../utils/logger"
import { clamp } from "../utils/number"
import { chance, pickNRandomIn, pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"
import Player from "./colyseus-models/player"
import { PRECOMPUTED_POKEMONS_PER_RARITY, getPokemonData } from "./precomputed"
import { PVEStages } from "./pve-stages"

export function getPoolSize(rarity: Rarity, maxStars: number): number {
  return PoolSize[rarity][clamp(maxStars, 1, 3) - 1]
}

function getRegularsTier1(pokemons: Pkm[]) {
  return pokemons.filter((p) => {
    const pokemonData = getPokemonData(p)
    return (
      pokemonData.stars === 1 &&
      pokemonData.skill !== Ability.DEFAULT &&
      !pokemonData.additional
    )
  })
}

const CommonShop = getRegularsTier1(
  PRECOMPUTED_POKEMONS_PER_RARITY.COMMON
).concat(Pkm.CRABRAWLER)
const UncommonShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON)
const RareShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.RARE)
const EpicShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.EPIC)
const UltraShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.ULTRA)

export default class Shop {
  commonPool: Map<Pkm, number> = new Map<Pkm, number>()
  uncommonPool: Map<Pkm, number> = new Map<Pkm, number>()
  rarePool: Map<Pkm, number> = new Map<Pkm, number>()
  epicPool: Map<Pkm, number> = new Map<Pkm, number>()
  ultraPool: Map<Pkm, number> = new Map<Pkm, number>()
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
    UltraShop.forEach((pkm) => {
      this.ultraPool.set(pkm, getPoolSize(Rarity.ULTRA, 3))
    })
  }

  addAdditionalPokemon(pkmProposition: PkmProposition) {
    const pkm: Pkm =
      pkmProposition in PkmDuos ? PkmDuos[pkmProposition][0] : pkmProposition
    const rarity = getPokemonData(pkm).rarity
    switch (rarity) {
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
      case Rarity.ULTRA:
        this.ultraPool.set(pkm, getPoolSize(Rarity.ULTRA, 2))
        break
      default:
        break
    }
  }

  releasePokemon(pkm: Pkm) {
    const { stars, rarity } = getPokemonData(pkm)
    const family = PkmFamily[pkm]
    let entityNumber = stars >= 3 ? 9 : stars === 2 ? 3 : 1
    const duo = Object.entries(PkmDuos).find(([key, duo]) => duo.includes(pkm))
    if (duo) {
      // duos increase the number in pool by one if selling both
      // but it is negligible and cannot be abused
      entityNumber = Math.ceil(entityNumber / 2)
    }

    if (rarity === Rarity.COMMON) {
      const value = this.commonPool.get(family)
      if (value !== undefined) {
        this.commonPool.set(family, value + entityNumber)
      }
    } else if (rarity === Rarity.UNCOMMON) {
      const value = this.uncommonPool.get(family)
      if (value !== undefined) {
        this.uncommonPool.set(family, value + entityNumber)
      }
    } else if (rarity === Rarity.RARE) {
      const value = this.rarePool.get(family)
      if (value !== undefined) {
        this.rarePool.set(family, value + entityNumber)
      }
    } else if (rarity === Rarity.EPIC) {
      const value = this.epicPool.get(family)
      if (value !== undefined) {
        this.epicPool.set(family, value + entityNumber)
      }
    } else if (rarity === Rarity.ULTRA) {
      const value = this.ultraPool.get(family)
      if (value !== undefined) {
        this.ultraPool.set(family, value + entityNumber)
      }
    }
  }

  refillShop(player: Player, state: GameState) {
    // No need to release pokemons since they won't be changed
    const PkmList = player.shop.map((pokemon) => {
      if (pokemon != Pkm.MAGIKARP && pokemon != Pkm.DEFAULT) {
        return pokemon
      }
      return this.pickPokemon(player, state)
    })

    for (let i = 0; i < SHOP_SIZE; i++) {
      player.shop[i] = PkmList[i]
    }
  }

  assignShop(player: Player, manualRefresh: boolean, state: GameState) {
    player.shop.forEach((pkm) => this.releasePokemon(pkm))

    if (player.effects.has(Effect.EERIE_SPELL) && !manualRefresh) {
      const unowns = getUnownsPoolPerStage(state.stageLevel)
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = pickRandomIn(unowns)
      }
    } else {
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = this.pickPokemon(player, state)
      }
    }
  }

  assignUniquePropositions(
    player: Player,
    list: PkmProposition[],
    synergies: Synergy[]
  ) {
    const propositions = [...list]

    // ensure we have at least one synergy per proposition
    if (synergies.length > NB_UNIQUE_PROPOSITIONS) {
      synergies = pickNRandomIn(synergies, NB_UNIQUE_PROPOSITIONS)
    } else if (synergies.length < NB_UNIQUE_PROPOSITIONS) {
      while (synergies.length < NB_UNIQUE_PROPOSITIONS) {
        synergies.push(pickRandomIn(Synergy))
      }
    }

    for (let i = 0; i < NB_UNIQUE_PROPOSITIONS; i++) {
      const synergy = synergies[i]
      const candidates = propositions.filter((m) => {
        const pkm: Pkm = m in PkmDuos ? PkmDuos[m][0] : m
        return getPokemonData(pkm).types.includes(synergy)
      })
      const selectedProposition = pickRandomIn(
        candidates.length > 0 ? candidates : propositions
      )
      removeInArray(propositions, selectedProposition)
      player.pokemonsProposition.push(selectedProposition)
    }
  }

  getRandomPokemonFromPool(
    pool: Map<Pkm, number>,
    finals: Set<Pkm>,
    specificTypeWanted?: Synergy
  ): Pkm {
    let pkm = Pkm.MAGIKARP
    const candidates = new Array<Pkm>()
    pool.forEach((value, pkm) => {
      const types = getPokemonData(pkm).types
      const isOfTypeWanted = specificTypeWanted
        ? types.includes(specificTypeWanted)
        : types.includes(Synergy.WILD) === false

      if (isOfTypeWanted && !finals.has(pkm)) {
        for (let i = 0; i < value; i++) {
          candidates.push(pkm)
        }
      }
    })

    if (candidates.length > 0) {
      pkm = pickRandomIn(candidates)
    } else if (specificTypeWanted === Synergy.WATER) {
      return Pkm.MAGIKARP // if no more water in pool, return magikarp
    } else if (specificTypeWanted) {
      return this.getRandomPokemonFromPool(pool, finals) // could not find of specific type, return another type
    }

    const val = pool.get(pkm)
    if (val !== undefined) {
      pool.set(pkm, Math.max(0, val - 1))
    }
    //logger.debug("taking a ", pkm, "from the shop", val)
    return pkm
  }

  pickPokemon(player: Player, state: GameState) {
    const rarityProbability =
      RarityProbabilityPerLevel[player.experienceManager.level]
    const rarity_seed = Math.random()
    let pokemon = Pkm.MAGIKARP
    let threshold = 0

    if (
      state.specialGameRule !== SpecialGameRule.DITTO_PARTY &&
      chance(DITTO_RATE)
    ) {
      return Pkm.DITTO
    }

    const UNOWN_RATE = 0.05
    if (
      (player.effects.has(Effect.LIGHT_SCREEN) ||
        player.effects.has(Effect.EERIE_SPELL)) &&
      chance(UNOWN_RATE)
    ) {
      const unowns = getUnownsPoolPerStage(state.stageLevel)
      return pickRandomIn(unowns)
    }

    const isPVE = state.stageLevel in PVEStages
    const wildChance = player.effects.has(Effect.QUICK_FEET)
      ? 0.05
      : player.effects.has(Effect.RUN_AWAY)
      ? 0.1
      : player.effects.has(Effect.HUSTLE)
      ? 0.15
      : player.effects.has(Effect.BERSERK)
      ? 0.2
      : isPVE
      ? 0.05
      : 0

    const finals = new Set(
      values(player.board)
        .filter((pokemon) => pokemon.final)
        .map((pokemon) => PkmFamily[pokemon.name])
    )

    let specificTypeWanted: Synergy | undefined = undefined
    if (wildChance > 0 && chance(wildChance)) {
      specificTypeWanted = Synergy.WILD
    }

    for (let i = 0; i < rarityProbability.length; i++) {
      threshold += rarityProbability[i]
      if (rarity_seed < threshold) {
        switch (i) {
          case 0:
            pokemon = this.getRandomPokemonFromPool(
              this.commonPool,
              finals,
              specificTypeWanted
            )
            break
          case 1:
            pokemon = this.getRandomPokemonFromPool(
              this.uncommonPool,
              finals,
              specificTypeWanted
            )
            break
          case 2:
            pokemon = this.getRandomPokemonFromPool(
              this.rarePool,
              finals,
              specificTypeWanted
            )
            break
          case 3:
            pokemon = this.getRandomPokemonFromPool(
              this.epicPool,
              finals,
              specificTypeWanted
            )
            break
          case 4:
            pokemon = this.getRandomPokemonFromPool(
              this.ultraPool,
              finals,
              specificTypeWanted
            )
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
    const finals = new Set(
      values(player.board)
        .filter((pokemon) => pokemon.final)
        .map((pokemon) => PkmFamily[pokemon.name])
    )

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
            if (fishingLevel === 1) fish = Pkm.MAGIKARP
            if (fishingLevel === 2) fish = Pkm.FEEBAS
            //if (fishingLevel >= 3) fish = Pkm.WISHIWASHI // when available
            break
        }
        break
      }
    }

    return fish
  }
}
