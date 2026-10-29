import { EvolutionTime, getBaseAltForm, PkmsWithAltForms } from "../config"
import { ItemConfigs, SYNERGY_GEM_BONUS } from "../config/game/items"
import { LegendaryPool, UniquePool } from "../config/game/pools"
import { giveRandomEgg } from "../core/eggs"
import { EvolutionManager } from "../core/evolution-logic/evolution-manager"
import type Player from "../models/colyseus-models/player"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import type GameRoom from "../rooms/game-room"
import {
  Berries,
  CraftableItemsNoScarves,
  Dishes,
  type Gift,
  type IPokemon,
  Item,
  ItemComponentsNoFossilOrScarf,
  NonSpecialBerries,
  ShinyItems,
  Sweets,
  SynergyGems,
  SynergyGivenByGem,
  Tools
} from "../types"
import { EvolutionRuleType } from "../types/EvolutionRules"
import { Rarity } from "../types/enum/Game"
import { Pkm, PkmDuos, type PkmProposition } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { isIn } from "../utils/array"
import {
  getFirstAvailablePositionInBench,
  getFreeSpaceOnBench,
  isOnBench
} from "../utils/board"
import { max } from "../utils/number"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  randomWeighted
} from "../utils/random"

const giftAmountOfItem =
  (amount: number, itemsSet: Item[]) => (toPlayer: Player) => {
    const itemsGiven = pickNRandomIn(itemsSet, amount)
    itemsGiven.forEach((berry) => toPlayer.items.push(berry))
    if (itemsGiven.some((item) => isIn(SynergyGems, item))) {
      itemsGiven.forEach((gem) => {
        const type = SynergyGivenByGem[gem]
        if (type) {
          toPlayer.bonusSynergies.set(
            type,
            (toPlayer.bonusSynergies.get(type) ?? 0) + SYNERGY_GEM_BONUS
          )
        }
      })
      toPlayer.updateSynergies()
    }
  }

const giftAmountOfPokemon =
  (amount: number, pokemon: Pkm) => (toPlayer: Player) => {
    for (let i = 0; i < amount; i++) {
      const replacement = PokemonFactory.createPokemonFromName(
        pokemon,
        toPlayer
      )
      const freeCellX = getFirstAvailablePositionInBench(toPlayer.board)

      if (freeCellX === null) return
      replacement.positionX = freeCellX
      replacement.positionY = 0
      toPlayer.board.set(replacement.id, replacement)
      replacement.onAcquired(toPlayer)
    }
  }

const giftHatchPokemon = (amount: number) => (toPlayer: Player) => {
  const { goldenEggChancePercent, hatchStars, maxHp, attack, abilityPower } =
    ItemConfigs.HATCH_BUNDLE
  if (chance(goldenEggChancePercent / 100)) {
    giveRandomEgg(toPlayer, true)
  } else {
    const hatchList = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
      (p) => getPokemonData(p).stars === hatchStars
    )

    const randomHatches = pickNRandomIn(hatchList, amount)

    randomHatches.forEach((pkm) => {
      const replacement = PokemonFactory.createPokemonFromName(
        getPokemonData(pkm).name,
        toPlayer
      )
      const freeCellX = getFirstAvailablePositionInBench(toPlayer.board)

      if (freeCellX === null) return
      replacement.stacksRequired = EvolutionTime.EVOLVE_HATCH
      replacement.positionX = freeCellX
      replacement.positionY = 0
      replacement.addMaxHP(maxHp)
      replacement.addAttack(attack)
      replacement.addAbilityPower(abilityPower)
      toPlayer.board.set(replacement.id, replacement)
      replacement.onAcquired(toPlayer)
    })
  }
}

const giftRandomPokemonByRarity =
  (rarity: Rarity, config: { stars: number; topSynergies: number }) =>
  (toPlayer: Player, fromPlayer: Player, room: GameRoom) => {
    const { stars: wantedStars, topSynergies: nbOfSynergies } = config
    let shouldBeRegionalOrAdditional = false

    switch (rarity) {
      case Rarity.UNCOMMON:
      case Rarity.RARE:
      case Rarity.EPIC:
        shouldBeRegionalOrAdditional = true
        break
    }

    let wantedSynergies = toPlayer.synergies
      .getTopSynergies(nbOfSynergies)
      .filter((type) => toPlayer.synergies.hasSynergyActive(type)) // only consider active types
    if (wantedSynergies.includes(Synergy.BABY)) {
      wantedSynergies = toPlayer.synergies.getTopSynergies(nbOfSynergies + 1)
      wantedSynergies.splice(wantedSynergies.indexOf(Synergy.BABY), 1)
    }

    const pool: PkmProposition[] =
      rarity === Rarity.LEGENDARY
        ? LegendaryPool
        : rarity === Rarity.UNIQUE
          ? UniquePool
          : PRECOMPUTED_POKEMONS_PER_RARITY[rarity]

    const poolWithWantedSyns = pool.filter((proposition) => {
      const p: Pkm =
        proposition in PkmDuos ? PkmDuos[proposition][0] : proposition
      const pkmData = getPokemonData(p)
      if (PkmsWithAltForms.includes(p) && getBaseAltForm(p) !== p) return false
      if (pkmData.stars !== wantedStars) return false
      if (
        shouldBeRegionalOrAdditional &&
        !(pkmData.additional || pkmData.regional)
      )
        return false
      if (
        !shouldBeRegionalOrAdditional &&
        (pkmData.additional || pkmData.regional)
      )
        return false
      if (
        shouldBeRegionalOrAdditional &&
        pkmData.regional &&
        !toPlayer.regionalPokemons.includes(p)
      )
        return false
      const types = pkmData.types
      return wantedSynergies.some((type) => types.includes(type))
    })

    const candidates =
      poolWithWantedSyns.length === 0 ? pool : poolWithWantedSyns //Fallback if no Pokémon satisfy the filter
    const selectedProposition = pickRandomIn(candidates) ?? Pkm.DITTO

    const pokemonsObtained: Pokemon[] = (
      selectedProposition in PkmDuos
        ? PkmDuos[selectedProposition]
        : [selectedProposition]
    ).map((p) => PokemonFactory.createPokemonFromName(p, toPlayer))

    room.givePokemons(pokemonsObtained, toPlayer, true)
  }

const giftPotion = (toPlayer: Player, fromPlayer: Player) => {
  const { heal, maxPlayerHp } = ItemConfigs.POTION
  toPlayer.life = max(maxPlayerHp)(toPlayer.life + heal)
  fromPlayer.life = max(maxPlayerHp)(fromPlayer.life + heal)
}

const evolveRandomPokemonInBoard = (toPlayer: Player) => {
  const pokemonThatCanEvolve: Pokemon[] = []
  const otherPokemon: Pokemon[] = []
  toPlayer.board.forEach((pkm: Pokemon) => {
    if (
      pkm.evolutionRule.type === EvolutionRuleType.COUNT &&
      pkm.hasEvolution &&
      !pkm.items.has(Item.EVIOLITE)
    ) {
      pokemonThatCanEvolve.push(pkm)
    } else if (!isOnBench(pkm)) {
      otherPokemon.push(pkm)
    }
  })

  if (pokemonThatCanEvolve.length > 0) {
    const randomPkm = pickRandomIn(pokemonThatCanEvolve)
    EvolutionManager.evolve(randomPkm, toPlayer)
  } else {
    if (otherPokemon.length === 0) return
    const randomPkm2 = pickRandomIn(otherPokemon)
    const { maxHp, attack, abilityPower, defense, specialDefense, speed } =
      ItemConfigs.STAR_GIFT
    randomPkm2.addMaxHP(maxHp)
    randomPkm2.addAttack(attack)
    randomPkm2.addAbilityPower(abilityPower)
    randomPkm2.addDefense(defense)
    randomPkm2.addSpecialDefense(specialDefense)
    randomPkm2.addSpeed(speed)
  }
}

const giftFoodAndPicnic = (toPlayer: Player) => {
  toPlayer.board.forEach((p: IPokemon) => {
    if (p.canEat) {
      let randomDish = pickRandomIn(
        Dishes.filter((d) => d !== Item.HERBA_MYSTICA)
      )
      if (randomDish === Item.SWEETS) {
        randomDish = pickRandomIn(Sweets)
      } else if (randomDish === Item.MUSHROOMS) {
        randomDish =
          randomWeighted({
            [Item.TINY_MUSHROOM]: ItemConfigs.MUSHROOMS.tinyMushroomWeight,
            [Item.BIG_MUSHROOM]: ItemConfigs.MUSHROOMS.bigMushroomWeight,
            [Item.BALM_MUSHROOM]: ItemConfigs.MUSHROOMS.balmMushroomWeight
          }) ?? Item.TINY_MUSHROOM
      }

      p.dishes.add(randomDish)
    }
  })

  toPlayer.items.push(Item.TINY_MUSHROOM)
  toPlayer.items.push(Item.BIG_MUSHROOM)
  toPlayer.items.push(Item.BALM_MUSHROOM)
  toPlayer.items.push(Item.PICNIC_SET)
}

const giftXP = (amount: number) => (toPlayer: Player) => {
  const xpActuallyGained = toPlayer.addExperience(amount)
  if (xpActuallyGained < amount) {
    toPlayer.addMoney(amount - xpActuallyGained, true, null)
  }
}

type GiftEffect = (toPlayer: Player, fromPlayer: Player, room: GameRoom) => void

export const GiftEffects: {
  [key in Gift]: GiftEffect | GiftEffect[]
} = {
  [Item.BERRIES_GIFT]: giftAmountOfItem(
    ItemConfigs.BERRIES_GIFT.amount,
    Berries
  ),
  [Item.SWEETS_GIFT]: giftAmountOfItem(ItemConfigs.SWEETS_GIFT.amount, Sweets),
  [Item.DITTO_GIFT]: giftAmountOfPokemon(
    ItemConfigs.DITTO_GIFT.amount,
    Pkm.DITTO
  ),
  [Item.TICKET_BUNDLE]: (toPlayer: Player, fromPlayer: Player) => {
    toPlayer.items.push(Item.EXCHANGE_TICKET)
    toPlayer.items.push(Item.RECYCLE_TICKET)
    toPlayer.items.push(Item.BRONZE_DOJO_TICKET)
  },
  [Item.HATCH_BUNDLE]: giftHatchPokemon(ItemConfigs.HATCH_BUNDLE.amount),
  [Item.REGIONAL_TOUR]: (toPlayer: Player, fromPlayer: Player) => {
    toPlayer.items.push(Item.LAPRAS_PASSPORT)
    toPlayer.shopFreeRolls += ItemConfigs.REGIONAL_TOUR.freeRerolls
  },
  [Item.BANQUET]: giftFoodAndPicnic,
  [Item.STAR_GIFT]: evolveRandomPokemonInBoard,
  [Item.GEMS_BUNDLE]: giftAmountOfItem(
    ItemConfigs.GEMS_BUNDLE.amount,
    SynergyGems
  ),
  [Item.POTION]: giftPotion,
  [Item.FORAGE_BAG]: giftAmountOfItem(
    ItemConfigs.FORAGE_BAG.amount,
    ItemComponentsNoFossilOrScarf
  ),
  [Item.COLLECTION_BOX]: [
    giftAmountOfItem(ItemConfigs.COLLECTION_BOX.apples, [
      Item.SWEET_APPLE,
      Item.TART_APPLE,
      Item.SIRUPY_APPLE
    ]),
    giftAmountOfItem(ItemConfigs.COLLECTION_BOX.scarves, [Item.SILK_SCARF]),
    giftAmountOfItem(
      ItemConfigs.COLLECTION_BOX.completedItems,
      CraftableItemsNoScarves
    ),
    giftAmountOfItem(ItemConfigs.COLLECTION_BOX.tools, Tools),
    giftAmountOfItem(ItemConfigs.COLLECTION_BOX.berries, NonSpecialBerries)
  ],
  [Item.PRETTY_BOX]: giftAmountOfItem(
    ItemConfigs.PRETTY_BOX.amount,
    CraftableItemsNoScarves
  ),
  [Item.DELUXE_BOX]: giftAmountOfItem(
    ItemConfigs.DELUXE_BOX.amount,
    ShinyItems
  ),
  [Item.TOOLBOX]: giftAmountOfItem(ItemConfigs.TOOLBOX.amount, Tools),
  [Item.COMMON_GIFT]: giftRandomPokemonByRarity(
    Rarity.COMMON,
    ItemConfigs.COMMON_GIFT
  ),
  [Item.UNCOMMON_GIFT]: giftRandomPokemonByRarity(
    Rarity.UNCOMMON,
    ItemConfigs.UNCOMMON_GIFT
  ),
  [Item.RARE_GIFT]: giftRandomPokemonByRarity(
    Rarity.RARE,
    ItemConfigs.RARE_GIFT
  ),
  [Item.EPIC_GIFT]: giftRandomPokemonByRarity(
    Rarity.EPIC,
    ItemConfigs.EPIC_GIFT
  ),
  [Item.ULTRA_GIFT]: giftRandomPokemonByRarity(
    Rarity.ULTRA,
    ItemConfigs.ULTRA_GIFT
  ),
  [Item.UNIQUE_GIFT]: giftRandomPokemonByRarity(
    Rarity.UNIQUE,
    ItemConfigs.UNIQUE_GIFT
  ),
  [Item.LEGENDARY_GIFT]: giftRandomPokemonByRarity(
    Rarity.LEGENDARY,
    ItemConfigs.LEGENDARY_GIFT
  ),
  [Item.SMALL_EXP_GIFT]: giftXP(ItemConfigs.SMALL_EXP_GIFT.experience),
  [Item.LARGE_EXP_GIFT]: giftXP(ItemConfigs.LARGE_EXP_GIFT.experience)
}

export const openGift = (
  gift: Gift,
  toPlayer: Player,
  fromPlayer: Player,
  room: GameRoom
) => {
  const benchSpace = getFreeSpaceOnBench(toPlayer.board)
  if (
    [
      Item.DITTO_GIFT,
      Item.COMMON_GIFT,
      Item.UNCOMMON_GIFT,
      Item.RARE_GIFT,
      Item.EPIC_GIFT,
      Item.LEGENDARY_GIFT,
      Item.UNIQUE_GIFT,
      Item.LEGENDARY_GIFT
    ].includes(gift) &&
    benchSpace === 0
  ) {
    toPlayer.items.push(gift) // player will open gift when they can
  } else {
    const giftEffect = GiftEffects[gift]
    if (Array.isArray(giftEffect)) {
      giftEffect.forEach((effect) => effect(toPlayer, fromPlayer, room))
    } else {
      giftEffect(toPlayer, fromPlayer, room)
    }
  }
}
