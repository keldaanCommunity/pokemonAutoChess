import GameState from "../rooms/states/game-state"
import { IPokemon, IPokemonEntity } from "../types"
import {
  ARCEUS_RATE,
  DITTO_RATE,
  FishRarityProbability,
  KECLEON_RATE,
  LegendaryPool,
  NB_UNIQUE_PROPOSITIONS,
  PoolSize,
  PortalCarouselStages,
  RarityCost,
  RarityProbabilityPerLevel,
  SHOP_SIZE,
  UniquePool
} from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Effect } from "../types/enum/Effect"
import { Rarity } from "../types/enum/Game"
import { FishingRod, Item } from "../types/enum/Item"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmProposition,
  PkmRegionalVariants,
  Unowns,
  getUnownsPoolPerStage
} from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { Synergy } from "../types/enum/Synergy"
import { removeInArray } from "../utils/array"
import { logger } from "../utils/logger"
import { clamp, min } from "../utils/number"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  shuffleArray
} from "../utils/random"
import { values } from "../utils/schemas"
import Player from "./colyseus-models/player"
import { PokemonClasses } from "./colyseus-models/pokemon"
import PokemonFactory from "./pokemon-factory"
import { getPokemonData } from "./precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "./precomputed/precomputed-rarity"
import { PVEStages } from "./pve-stages"

export function getPoolSize(rarity: Rarity, maxStars: number): number {
  return PoolSize[rarity][clamp(maxStars, 1, 3) - 1]
}

export function getRegularsTier1(pokemons: Pkm[]) {
  return pokemons.filter((p) => {
    const pokemonData = getPokemonData(p)
    return (
      pokemonData.stars === 1 &&
      pokemonData.skill !== Ability.DEFAULT &&
      !pokemonData.additional &&
      !pokemonData.regional
    )
  })
}

export function getAdditionalsTier1(pokemons: Pkm[]) {
  return pokemons.filter((p) => {
    const pokemonData = getPokemonData(p)
    return (
      pokemonData.stars === 1 &&
      pokemonData.skill !== Ability.DEFAULT &&
      pokemonData.additional &&
      !pokemonData.regional
    )
  })
}

export function getSellPrice(
  pokemon: IPokemon | IPokemonEntity,
  specialGameRule?: SpecialGameRule | null
): number {
  const name = pokemon.name

  if (specialGameRule === SpecialGameRule.FREE_MARKET && name !== Pkm.EGG)
    return 0

  const duo = Object.entries(PkmDuos).find(([key, duo]) => duo.includes(name))

  let price = 1
  let stars = pokemon.stars
  const hasRareCandy = pokemon.items && pokemon.items.has(Item.RARE_CANDY)

  if (hasRareCandy) {
    stars = min(1)(stars - 1)
  }

  if (name === Pkm.EGG) {
    price = pokemon.shiny ? 10 : 2
  } else if (name == Pkm.DITTO) {
    price = 5
  } else if (name === Pkm.MAGIKARP) {
    price = 0
  } else if (name === Pkm.FEEBAS) {
    price = 1
  } else if (name === Pkm.WISHIWASHI) {
    price = 3
  } else if (name === Pkm.REMORAID) {
    price = 3
  } else if (name === Pkm.OCTILLERY) {
    price = 10
  } else if (name === Pkm.GYARADOS) {
    price = hasRareCandy ? 0 : 10
  } else if (name === Pkm.MILOTIC) {
    price = hasRareCandy ? 1 : 10
  } else if (name === Pkm.WISHIWASHI_SCHOOL) {
    price = hasRareCandy ? 3 : 10
  } else if (Unowns.includes(name)) {
    price = 1
  } else if (pokemon.rarity === Rarity.HATCH) {
    price = [3, 4, 5][stars - 1] ?? 5
  } else if (pokemon.rarity === Rarity.UNIQUE) {
    price = duo ? 6 : 10
  } else if (pokemon.rarity === Rarity.LEGENDARY) {
    price = duo ? 10 : 20
  } else if (PokemonFactory.getPokemonBaseEvolution(name) === Pkm.EEVEE) {
    price = RarityCost[pokemon.rarity]
  } else if (duo) {
    price = Math.ceil((RarityCost[pokemon.rarity] * stars) / 2)
  } else {
    price = RarityCost[pokemon.rarity] * stars
  }

  return price
}

export function getBuyPrice(
  name: Pkm,
  specialGameRule?: SpecialGameRule | null
): number {
  if (specialGameRule === SpecialGameRule.FREE_MARKET) return 0

  let price = 1

  if (name === Pkm.DITTO) {
    price = 5
  } else if (Unowns.includes(name)) {
    price = 1
  } else {
    price = RarityCost[getPokemonData(name).rarity]
  }

  return price
}

const CommonShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.COMMON)
const UncommonShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON)
const RareShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.RARE)
const EpicShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.EPIC)
const UltraShop = getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY.ULTRA)

export default class Shop {
  commonPool: Pkm[] = new Array<Pkm>()
  uncommonPool: Pkm[] = new Array<Pkm>()
  rarePool: Pkm[] = new Array<Pkm>()
  epicPool: Pkm[] = new Array<Pkm>()
  ultraPool: Pkm[] = new Array<Pkm>()
  constructor() {
    this.commonPool = CommonShop.flatMap((pkm) =>
      Array(getPoolSize(Rarity.COMMON, 3)).fill(pkm)
    )
    this.uncommonPool = UncommonShop.flatMap((pkm) =>
      Array(getPoolSize(Rarity.UNCOMMON, pkm === Pkm.EEVEE ? 2 : 3)).fill(pkm)
    )
    this.rarePool = RareShop.flatMap((pkm) =>
      Array(getPoolSize(Rarity.RARE, 3)).fill(pkm)
    )
    this.epicPool = EpicShop.flatMap((pkm) =>
      Array(getPoolSize(Rarity.EPIC, 3)).fill(pkm)
    )
    this.ultraPool = UltraShop.flatMap((pkm) =>
      Array(getPoolSize(Rarity.ULTRA, 3)).fill(pkm)
    )
  }

  getPool(rarity: Rarity) {
    switch (rarity) {
      case Rarity.COMMON:
        return this.commonPool
      case Rarity.UNCOMMON:
        return this.uncommonPool
      case Rarity.RARE:
        return this.rarePool
      case Rarity.EPIC:
        return this.epicPool
      case Rarity.ULTRA:
        return this.ultraPool
    }
  }

  getRegionalPool(rarity: Rarity, player: Player) {
    switch (rarity) {
      case Rarity.COMMON:
        return player.commonRegionalPool
      case Rarity.UNCOMMON:
        return player.uncommonRegionalPool
      case Rarity.RARE:
        return player.rareRegionalPool
      case Rarity.EPIC:
        return player.epicRegionalPool
      case Rarity.ULTRA:
        return player.ultraRegionalPool
    }
  }

  addAdditionalPokemon(pkmProposition: PkmProposition) {
    const pkm: Pkm =
      pkmProposition in PkmDuos ? PkmDuos[pkmProposition][0] : pkmProposition
    const { rarity, stages } = getPokemonData(pkm)
    const pool = this.getPool(rarity)
    const entityNumber = getPoolSize(rarity, stages)
    if (pool) {
      for (let n = 0; n < entityNumber; n++) {
        pool.push(pkm)
      }
    }
  }

  addRegionalPokemon(pkm: Pkm, player: Player) {
    //logger.debug("adding regional pokemon", pkm)
    const { rarity, stages } = getPokemonData(pkm)
    const pool = this.getRegionalPool(rarity, player)
    const entityNumber = getPoolSize(rarity, stages)
    if (pool) {
      for (let n = 0; n < entityNumber; n++) {
        pool.push(pkm)
      }
    }
  }

  resetRegionalPool(player: Player) {
    player.commonRegionalPool = player.commonRegionalPool.filter(
      (p) => getPokemonData(p).regional === false
    )
    player.uncommonRegionalPool = player.uncommonRegionalPool.filter(
      (p) => getPokemonData(p).regional === false
    )
    player.rareRegionalPool = player.rareRegionalPool.filter(
      (p) => getPokemonData(p).regional === false
    )
    player.epicRegionalPool = player.epicRegionalPool.filter(
      (p) => getPokemonData(p).regional === false
    )
    player.ultraRegionalPool = player.ultraRegionalPool.filter(
      (p) => getPokemonData(p).regional === false
    )
  }

  releasePokemon(pkm: Pkm, player: Player) {
    const { stars, rarity, regional } = getPokemonData(pkm)
    const baseEvolution = PokemonFactory.getPokemonBaseEvolution(pkm)
    let entityNumber = stars >= 3 ? 9 : stars === 2 ? 3 : 1
    const duo = Object.entries(PkmDuos).find(([_key, duo]) => duo.includes(pkm))
    if (duo) {
      // duos increase the number in pool by one if selling both
      // but it is negligible and cannot be abused
      entityNumber = Math.ceil(entityNumber / 2)
    }

    const pool = regional
      ? this.getRegionalPool(rarity, player)
      : this.getPool(rarity)
    if (pool) {
      for (let n = 0; n < entityNumber; n++) {
        pool.push(baseEvolution)
      }
    }
  }

  refillShop(player: Player, state: GameState) {
    // No need to release pokemons since they won't be changed
    player.shop.forEach((pokemon, i) => {
      if (pokemon === Pkm.MAGIKARP || pokemon === Pkm.DEFAULT) {
        player.shop[i] = this.pickPokemon(player, state, i)
      }
    })
  }

  assignShop(player: Player, manualRefresh: boolean, state: GameState) {
    player.shop.forEach((pkm) => this.releasePokemon(pkm, player))

    if (
      player.effects.has(Effect.EERIE_SPELL) &&
      !manualRefresh &&
      !player.shopLocked
    ) {
      // Unown shop
      player.shopFreeRolls += 1
      const unowns = getUnownsPoolPerStage(state.stageLevel)
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = pickRandomIn(unowns)
      }
    } else {
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = this.pickPokemon(player, state, i)
      }
    }
  }

  assignUniquePropositions(
    player: Player,
    stageLevel: number,
    synergies: Synergy[]
  ) {
    const allCandidates =
      stageLevel === PortalCarouselStages[1]
        ? [...UniquePool]
        : [...LegendaryPool]

    // ensure we have at least one synergy per proposition
    if (synergies.length > NB_UNIQUE_PROPOSITIONS) {
      synergies = pickNRandomIn(synergies, NB_UNIQUE_PROPOSITIONS)
    } else if (synergies.length < NB_UNIQUE_PROPOSITIONS) {
      while (synergies.length < NB_UNIQUE_PROPOSITIONS) {
        synergies = synergies.concat(pickRandomIn(Synergy))
      }
    }

    for (let i = 0; i < NB_UNIQUE_PROPOSITIONS; i++) {
      const synergy = synergies[i]
      let candidates = allCandidates.filter((m) => {
        const pkm: Pkm = m in PkmDuos ? PkmDuos[m][0] : m
        const specialSynergies: ReadonlyMap<Pkm, Synergy> = new Map([
          [Pkm.TAPU_BULU, Synergy.GRASS],
          [Pkm.TAPU_FINI, Synergy.FAIRY],
          [Pkm.TAPU_KOKO, Synergy.ELECTRIC],
          [Pkm.TAPU_LELE, Synergy.PSYCHIC],
          [Pkm.OGERPON_CORNERSTONE, Synergy.ROCK],
          [Pkm.OGERPON_HEARTHFLAME, Synergy.FIRE],
          [Pkm.OGERPON_WELLSPRING, Synergy.AQUATIC]
        ])
        const hasSynergy = specialSynergies.has(pkm)
          ? specialSynergies.get(pkm) === synergy
          : getPokemonData(pkm).types.includes(synergy)

        return (
          hasSynergy &&
          !player.pokemonsProposition.some(
            (p) => PkmFamily[p] === PkmFamily[pkm]
          )
        )
      })

      if (candidates.length === 0) candidates = allCandidates
      let selected = pickRandomIn(candidates)
      if (selected in PkmRegionalVariants) {
        const regionalVariants = PkmRegionalVariants[selected]!.filter((p) =>
          new PokemonClasses[p]().isInRegion(player.map)
        )
        if (regionalVariants.length > 0)
          selected = pickRandomIn(regionalVariants)
      }
      if (
        stageLevel === PortalCarouselStages[1] &&
        player.pokemonsProposition.includes(Pkm.KECLEON) === false &&
        chance(KECLEON_RATE)
      ) {
        selected = Pkm.KECLEON
      } else if (
        stageLevel === PortalCarouselStages[2] &&
        player.pokemonsProposition.includes(Pkm.ARCEUS) === false &&
        chance(ARCEUS_RATE)
      ) {
        selected = Pkm.ARCEUS
      }

      removeInArray(allCandidates, selected)
      player.pokemonsProposition.push(selected)
    }
  }

  getRandomPokemonFromPool(
    rarity: Rarity,
    player: Player,
    finals: Set<Pkm> = new Set(),
    specificTypesWanted?: Synergy[]
  ): Pkm {
    let pkm = Pkm.MAGIKARP
    const candidates = (this.getPool(rarity) ?? [])
      .concat(this.getRegionalPool(rarity, player) ?? [])
      .map((pkm) => {
        if (pkm in PkmRegionalVariants) {
          const regionalVariants = PkmRegionalVariants[pkm]!.filter((p) =>
            player.regionalPokemons.includes(p)
          )
          if (regionalVariants.length > 0) pkm = pickRandomIn(regionalVariants)
        }
        return pkm
      })
      .filter((pkm) => {
        const types = getPokemonData(pkm).types
        const isOfTypeWanted = specificTypesWanted
          ? specificTypesWanted.some((specificTypeWanted) =>
              types.includes(specificTypeWanted)
            )
          : types.includes(Synergy.WILD) === false

        return isOfTypeWanted && !finals.has(pkm)
      })

    if (candidates.length > 0) {
      pkm = pickRandomIn(candidates)
    } else if (
      specificTypesWanted &&
      specificTypesWanted.includes(Synergy.WATER)
    ) {
      return Pkm.MAGIKARP // if no more water in pool, return magikarp
    } else if (specificTypesWanted) {
      return this.getRandomPokemonFromPool(rarity, player, finals) // could not find of specific type, return another type
    }

    const { regional } = getPokemonData(pkm)
    const pool = regional
      ? this.getRegionalPool(rarity, player)
      : this.getPool(rarity)
    if (pool) {
      const index = pool.indexOf(pkm)
      if (index >= 0) {
        pool.splice(index, 1)
      }
    }

    return pkm
  }

  pickPokemon(player: Player, state: GameState, shopIndex: number = -1): Pkm {
    if (
      state.specialGameRule !== SpecialGameRule.DITTO_PARTY &&
      chance(DITTO_RATE) &&
      state.stageLevel >= 2
    ) {
      return Pkm.DITTO
    }

    if (
      player.effects.has(Effect.LIGHT_SCREEN) &&
      shopIndex === 5 &&
      (player.rerollCount + state.stageLevel) % 3 === 0
    ) {
      const unowns = getUnownsPoolPerStage(state.stageLevel)
      return pickRandomIn(unowns)
    }

    const isPVE = state.stageLevel in PVEStages
    const wildChance = player.wildChance + (isPVE ? 0.05 : 0)

    const finals = new Set(
      values(player.board)
        .filter((pokemon) => pokemon.final)
        .map((pokemon) => PkmFamily[pokemon.name])
    )

    let specificTypesWanted: Synergy[] | undefined = undefined

    const attractors = values(player.board).filter(
      (p) => p.items.has(Item.INCENSE) || p.meal === Item.HONEY
    )
    const attractor = attractors.find((p) => chance(5 / 100, p))

    if (attractor) {
      specificTypesWanted = values(attractor.types)
    } else if (wildChance > 0 && chance(wildChance)) {
      specificTypesWanted = [Synergy.WILD]
    }

    const probas = RarityProbabilityPerLevel[player.experienceManager.level]
    const rarity_seed = Math.random()
    let i = 0,
      threshold = 0
    while (rarity_seed > threshold) {
      threshold += probas[i]
      i++
    }
    const rarity = [
      Rarity.COMMON,
      Rarity.UNCOMMON,
      Rarity.RARE,
      Rarity.EPIC,
      Rarity.ULTRA
    ][i - 1]

    if (
      state.specialGameRule === SpecialGameRule.HIGH_ROLLER &&
      chance(2 / 100)
    ) {
      if (state.stageLevel < 10) return this.pickSpecialPokemon(Rarity.HATCH)
      if (state.stageLevel < 20) return this.pickSpecialPokemon(Rarity.UNIQUE)
      return this.pickSpecialPokemon(Rarity.LEGENDARY)
    }

    if (!rarity) {
      logger.error(
        `error in shop while picking seed = ${rarity_seed}, threshold = ${threshold}`
      )
      return Pkm.MAGIKARP
    }

    const repeatBallHolders = values(player.board).filter((p) =>
      p.items.has(Item.REPEAT_BALL)
    )
    const totalRerolls = player.rerollCount + state.stageLevel

    if (
      repeatBallHolders.length > 0 &&
      shopIndex >= 0 &&
      shopIndex < repeatBallHolders.length
    ) {
      if (totalRerolls >= 150 && totalRerolls % 10 === 0) {
        return this.pickSpecialPokemon(Rarity.LEGENDARY)
      } else if (totalRerolls >= 100 && totalRerolls % 10 === 0) {
        return this.pickSpecialPokemon(Rarity.UNIQUE)
      }
    }

    return this.getRandomPokemonFromPool(
      rarity,
      player,
      finals,
      specificTypesWanted
    )
  }

  pickSpecialPokemon(rarity: Rarity) {
    let pool: PkmProposition[]
    switch (rarity) {
      case Rarity.LEGENDARY:
        pool = LegendaryPool
        break
      case Rarity.UNIQUE:
        pool = UniquePool
        break
      case Rarity.HATCH:
        pool = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
          (p) => getPokemonData(p).stars === 1
        )
        break
      default:
        return Pkm.MAGIKARP
    }
    let candidates: Pkm[] = pool.filter<Pkm>((p): p is Pkm => !(p in PkmDuos))
    shuffleArray(candidates)
    candidates = candidates.filter(
      (p, index) =>
        candidates.findIndex((p2) => PkmFamily[p2] === PkmFamily[p]) === index
    )
    if (candidates.length > 0) return pickRandomIn(candidates)
    return Pkm.MAGIKARP
  }

  pickFish(player: Player, rod: FishingRod): Pkm {
    const mantine = values(player.board).find(
      (p) => p.name === Pkm.MANTYKE || p.name === Pkm.MANTINE
    )
    if (mantine && chance(0.3, mantine)) return Pkm.REMORAID

    const rarityProbability = FishRarityProbability[rod]
    const rarity_seed = Math.random()
    let fish: Pkm = Pkm.MAGIKARP
    let threshold = 0
    const finals = new Set(
      values(player.board)
        .filter((pokemon) => pokemon.final)
        .map((pokemon) => PkmFamily[pokemon.name])
    )

    let rarity = Rarity.SPECIAL
    for (const r in rarityProbability) {
      threshold += rarityProbability[r]
      if (rarity_seed < threshold) {
        rarity = r as Rarity
        break
      }
    }

    if (rarity === Rarity.SPECIAL) {
      if (rod === Item.OLD_ROD) fish = Pkm.MAGIKARP
      if (rod === Item.GOOD_ROD) fish = Pkm.FEEBAS
      if (rod === Item.SUPER_ROD) fish = Pkm.WISHIWASHI
    } else {
      fish = this.getRandomPokemonFromPool(rarity, player, finals, [
        Synergy.WATER
      ])
    }

    return fish
  }
}
