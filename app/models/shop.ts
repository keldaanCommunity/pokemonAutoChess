import {
  ARCEUS_RATE,
  BuyPrices,
  DITTO_RATE,
  FALINKS_TROOPER_RATE,
  FishRarityProbability,
  getUnownsPoolPerStage,
  HIGH_ROLLER_CHANCE,
  HONEY_CHANCE,
  INCENSE_CHANCE,
  KECLEON_RATE,
  LegendaryPool,
  MAGNET_PULL_RATE_PER_RARITY,
  MIN_STAGE_FOR_DITTO,
  NB_UNIQUE_PROPOSITIONS,
  PoolSize,
  PortalCarouselStages,
  PVE_WILD_CHANCE,
  RarityCost,
  RarityProbabilityPerLevel,
  REMORAID_RATE,
  REPEAT_BALL_LEGENDARY_CAP,
  REPEAT_BALL_UNIQUE_CAP,
  REPEAT_BALL_UNIQUE_INTERVAL,
  SellPrices,
  SHOP_SIZE,
  UNOWN_EERIE_SPELL_NB_SHOPS_INTERVAL,
  UNOWN_LIGHT_SCREEN_NB_SHOPS_INTERVAL,
  UNOWN_RATE_AMNESIA,
  UniquePool
} from "../config"
import GameState from "../rooms/states/game-state"
import { IPokemon, IPokemonEntity } from "../types"
import { Ability } from "../types/enum/Ability"
import { EffectEnum } from "../types/enum/Effect"
import { Rarity } from "../types/enum/Game"
import { FishingRod, Item } from "../types/enum/Item"
import {
  isRegionalVariant,
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmProposition,
  PkmRegionalVariants,
  Unowns
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
import { Pokemon, PokemonClasses } from "./colyseus-models/pokemon"
import { getPokemonBaseline, PkmColorVariantsByPkm } from "./pokemon-factory"
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
  specialGameRule?: SpecialGameRule | null,
  ignoreRareCandy = false
): number {
  const name = pokemon.name

  if (specialGameRule === SpecialGameRule.FREE_MARKET && name !== Pkm.EGG)
    return 0

  const duo = Object.entries(PkmDuos).find(([key, duo]) => duo.includes(name))

  let price = 1
  let stars = pokemon.stars
  const hasRareCandy = pokemon.items && pokemon.items.has(Item.RARE_CANDY)

  if (hasRareCandy && !ignoreRareCandy) {
    stars = min(1)(stars - 1)
  }

  if (name === Pkm.EGG) {
    price = pokemon.shiny ? SellPrices.SHINY_EGG : SellPrices.EGG
  } else if (name == Pkm.DITTO) {
    price = SellPrices.DITTO
  } else if (name == Pkm.FALINKS_TROOPER) {
    price = SellPrices.FALINKS_TROOPER
  } else if (name == Pkm.MELTAN) {
    price = SellPrices.MELTAN
  } else if (name === Pkm.MAGIKARP) {
    price = SellPrices.MAGIKARP
  } else if (name === Pkm.FEEBAS) {
    price = SellPrices.FEEBAS
  } else if (name === Pkm.WISHIWASHI) {
    price = SellPrices.WISHIWASHI
  } else if (name === Pkm.REMORAID) {
    price = SellPrices.REMORAID
  } else if (name === Pkm.OCTILLERY) {
    price = hasRareCandy ? SellPrices.REMORAID : SellPrices.OCTILLERY
  } else if (name === Pkm.GYARADOS) {
    price = hasRareCandy ? SellPrices.MAGIKARP : SellPrices.GYARADOS
  } else if (name === Pkm.MILOTIC) {
    price = hasRareCandy ? SellPrices.FEEBAS : SellPrices.MILOTIC
  } else if (name === Pkm.WISHIWASHI_SCHOOL) {
    price = hasRareCandy ? SellPrices.WISHIWASHI : SellPrices.WISHIWASHI_SCHOOL
  } else if (Unowns.includes(name)) {
    price = SellPrices.UNOWN
  } else if (pokemon.rarity === Rarity.HATCH) {
    price = SellPrices.HATCH[stars - 1] ?? SellPrices.HATCH.at(-1)
  } else if (pokemon.rarity === Rarity.UNIQUE) {
    price = duo ? SellPrices.UNIQUE_DUO : SellPrices.UNIQUE
  } else if (pokemon.rarity === Rarity.LEGENDARY) {
    price = duo ? SellPrices.LEGENDARY_DUO : SellPrices.LEGENDARY
  } else if (getPokemonBaseline(name) === Pkm.EEVEE) {
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

  let price: number

  if (name === Pkm.DITTO) {
    price = BuyPrices.DITTO
  } else if (name === Pkm.FALINKS_TROOPER) {
    price = BuyPrices.FALINKS_TROOPER
  } else if (name === Pkm.MELTAN) {
    price = BuyPrices.MELTAN
  } else if (Unowns.includes(name)) {
    price = BuyPrices.UNOWN
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

  addAdditionalPokemon(pkmProposition: PkmProposition, state: GameState) {
    const pkm: Pkm =
      pkmProposition in PkmDuos ? PkmDuos[pkmProposition][0] : pkmProposition
    if (state.additionalPokemons.includes(pkm)) return // already added, like in Everyone is here scribble
    state.additionalPokemons.push(pkm)
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

  releasePokemon(pkm: Pkm, player: Player, state: GameState) {
    const { stars, rarity, regional } = getPokemonData(pkm)
    const baseline = getPokemonBaseline(pkm)
    let entityNumber = stars >= 3 ? 9 : stars === 2 ? 3 : 1
    const duo = Object.entries(PkmDuos).find(([_key, duo]) => duo.includes(pkm))
    if (duo) {
      // duos increase the number in pool by one if selling both
      // but it is negligible and cannot be abused
      entityNumber = Math.ceil(entityNumber / 2)
    }

    if (
      regional &&
      new PokemonClasses[pkm](pkm).isInRegion(player.map, state) === false
    ) {
      return // regional pokemons sold in a region other than their original region are not added back to the pool
    }

    const pool = regional
      ? this.getRegionalPool(rarity, player)
      : this.getPool(rarity)

    if (pool) {
      for (let n = 0; n < entityNumber; n++) {
        pool.push(baseline)
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
    player.shop.forEach((pkm) => this.releasePokemon(pkm, player, state))

    const hasEerieSpell = player.effects.has(EffectEnum.EERIE_SPELL)
    if (hasEerieSpell) {
      player.shopsSinceLastUnownShop += 1
    }
    const shouldBeUnownShop =
      hasEerieSpell &&
      ((!manualRefresh && !player.shopLocked) ||
        (manualRefresh &&
          player.shopsSinceLastUnownShop ===
            UNOWN_EERIE_SPELL_NB_SHOPS_INTERVAL))

    if (shouldBeUnownShop) {
      // Unown shop
      player.shopFreeRolls += 1
      player.shopsSinceLastUnownShop = 0
      const unowns = getUnownsPoolPerStage(state.stageLevel)
      const chosenUnowns: Pkm[] = []
      for (let i = 0; i < SHOP_SIZE; i++) {
        const availableUnowns = unowns.filter((u) => !chosenUnowns.includes(u))
        const randomUnown = pickRandomIn(availableUnowns)
        chosenUnowns.push(randomUnown)
        player.shop[i] = randomUnown
      }
    } else {
      // Regular shop
      for (let i = 0; i < SHOP_SIZE; i++) {
        player.shop[i] = this.pickPokemon(player, state, i)
      }
    }
  }

  assignUniquePropositions(
    player: Player,
    stageLevel: number,
    portalSynergies: Synergy[]
  ) {
    const allCandidates =
      stageLevel === PortalCarouselStages[1]
        ? [...UniquePool]
        : [...LegendaryPool]

    // ensure we have at least one synergy per proposition
    if (portalSynergies.length > NB_UNIQUE_PROPOSITIONS) {
      portalSynergies = pickNRandomIn(portalSynergies, NB_UNIQUE_PROPOSITIONS)
    }

    for (let i = 0; i < NB_UNIQUE_PROPOSITIONS; i++) {
      const synergyWanted: Synergy | undefined = portalSynergies[i]
      let candidates = allCandidates.filter((m) => {
        const pkm: Pkm = m in PkmDuos ? PkmDuos[m][0] : m
        const { types, regional } = getPokemonData(pkm)

        const hasSynergyWanted =
          synergyWanted === undefined || types.includes(synergyWanted)

        if (!hasSynergyWanted) return false

        if (regional) {
          const pokemon = new PokemonClasses[pkm](pkm)
          if (!pokemon.isInRegion(player.map)) {
            // skip regional pokemons not in their region
            return false
          }
        }

        if (
          player.pokemonsProposition.some((prop) => {
            const p: Pkm = prop in PkmDuos ? PkmDuos[prop][0] : prop
            return PkmFamily[p] === PkmFamily[pkm] || isRegionalVariant(p, pkm)
          })
        ) {
          // avoid proposing two pokemons of the same family or regional variants
          return false
        }

        if (
          pkm in PkmRegionalVariants &&
          PkmRegionalVariants[pkm]?.some((p) => {
            const variant = new PokemonClasses[p](p)
            const lostTypes = types.filter((type) => !variant.types.has(type))
            return (
              variant.isInRegion(player.map) &&
              synergyWanted &&
              lostTypes.includes(synergyWanted)
            )
          })
        ) {
          // avoid proposing pokemon whose regional variants would lose the wanted synergy
          return false
        }

        return true
      })

      if (candidates.length === 0) candidates = allCandidates
      let selected = pickRandomIn(candidates)

      if (selected in PkmRegionalVariants) {
        const regionalVariants = PkmRegionalVariants[selected]!.filter((p) =>
          new PokemonClasses[p](p).isInRegion(player.map)
        )
        if (regionalVariants.length > 0)
          selected = pickRandomIn(regionalVariants)
      }
      if (selected in PkmColorVariantsByPkm) {
        selected = PkmColorVariantsByPkm[selected]!(player)
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
        if (pkm in PkmColorVariantsByPkm) {
          pkm = PkmColorVariantsByPkm[pkm]!(player)
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

        return isOfTypeWanted && !finals.has(getPokemonBaseline(pkm))
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
      const index = pool.indexOf(getPokemonBaseline(pkm))
      if (index >= 0) {
        pool.splice(index, 1)
      }
    }

    return pkm
  }

  pickPokemon(
    player: Player,
    state: GameState,
    shopIndex: number = -1,
    noSpecial = false
  ): Pkm {
    if (
      state.specialGameRule !== SpecialGameRule.DITTO_PARTY &&
      chance(DITTO_RATE) &&
      state.stageLevel >= MIN_STAGE_FOR_DITTO &&
      !noSpecial
    ) {
      return player.items.includes(Item.MYSTERY_BOX) ? Pkm.MELTAN : Pkm.DITTO
    }

    if (
      shopIndex === 5 &&
      !noSpecial &&
      ((player.effects.has(EffectEnum.LIGHT_SCREEN) &&
        (player.rerollCount + state.stageLevel) %
          UNOWN_LIGHT_SCREEN_NB_SHOPS_INTERVAL ===
          0) ||
        (player.effects.has(EffectEnum.AMNESIA) && chance(UNOWN_RATE_AMNESIA)))
    ) {
      const unowns = getUnownsPoolPerStage(state.stageLevel)
      return pickRandomIn(unowns)
    }

    if (
      player.effects.has(EffectEnum.FALINKS_BRASS) &&
      chance(FALINKS_TROOPER_RATE)
    ) {
      return Pkm.FALINKS_TROOPER
    }

    const isPVE = state.stageLevel in PVEStages
    const wildChance =
      player.wildChance +
      (isPVE || state.stageLevel === 0 ? PVE_WILD_CHANCE : 0)

    const finals = player.getFinalizedLines()
    let specificTypesWanted: Synergy[] | undefined = undefined

    const attractors = values(player.board).filter(
      (p) => p.items.has(Item.INCENSE) || p.meal === Item.HONEY
    )
    let attractor: Pokemon | null = null
    for (const p of attractors) {
      if (p.items.has(Item.INCENSE) && chance(INCENSE_CHANCE, p)) attractor = p
      if (p.meal === Item.HONEY && chance(HONEY_CHANCE, p)) attractor = p
    }

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
      chance(HIGH_ROLLER_CHANCE) &&
      !noSpecial
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
      shopIndex < repeatBallHolders.length &&
      !noSpecial
    ) {
      if (
        totalRerolls >= REPEAT_BALL_LEGENDARY_CAP &&
        totalRerolls % REPEAT_BALL_UNIQUE_INTERVAL === 0
      ) {
        return this.pickSpecialPokemon(Rarity.LEGENDARY)
      } else if (
        totalRerolls >= REPEAT_BALL_UNIQUE_CAP &&
        totalRerolls % REPEAT_BALL_UNIQUE_INTERVAL === 0
      ) {
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

    const rarityProbability = FishRarityProbability[rod]
    const rarity_seed = Math.random()
    let threshold = 0
    const finals = player.getFinalizedLines()

    if (
      finals.has(Pkm.REMORAID) === false &&
      ((mantine && chance(REMORAID_RATE, mantine)) || chance(player.wildChance))
    )
      return Pkm.REMORAID

    let rarity = Rarity.SPECIAL
    for (const r in rarityProbability) {
      threshold += rarityProbability[r]
      if (rarity_seed < threshold) {
        rarity = r as Rarity
        break
      }
    }

    if (rarity !== Rarity.SPECIAL) {
      const fish = this.getRandomPokemonFromPool(rarity, player, finals, [
        Synergy.WATER
      ])
      if (fish !== Pkm.MAGIKARP) return fish
    }

    if (rod === Item.SUPER_ROD) return Pkm.WISHIWASHI
    if (rod === Item.GOOD_ROD) return Pkm.FEEBAS
    return Pkm.MAGIKARP
  }

  magnetPull(meltan: IPokemonEntity, player: Player): Pkm {
    const rarity_seed =
      Math.random() * (1 + meltan.ap / 200) * (1 + meltan.luck / 100)
    let threshold = 0
    const finals = player.getFinalizedLines()

    let rarity = Rarity.SPECIAL
    for (const r in MAGNET_PULL_RATE_PER_RARITY) {
      threshold += MAGNET_PULL_RATE_PER_RARITY[r]
      rarity = r as Rarity
      if (rarity_seed < threshold) {
        break
      }
    }

    if (rarity !== Rarity.SPECIAL) {
      const steelPkm = this.getRandomPokemonFromPool(rarity, player, finals, [
        Synergy.STEEL
      ])
      if (getPokemonData(steelPkm).types.includes(Synergy.STEEL))
        return steelPkm
    }

    return Pkm.MELTAN
  }
}
