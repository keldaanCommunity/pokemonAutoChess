import { EvolutionTime, getBaseAltForm, PkmsWithAltForms } from "../config"
import { giveRandomEgg } from "../core/eggs"
import { EvolutionManager } from "../core/evolution-logic/evolution-manager"
import type Player from "../models/colyseus-models/player"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import {
  Berries,
  CraftableItemsNoScarves,
  Dishes,
  type IPokemon,
  Item,
  Sweets,
  SynergyGems,
  SynergyGivenByGem,
  Tools
} from "../types"
import {
  type ArmoryOptions,
  FreeOptions,
  PaidOptions
} from "../types/enum/ArmoryOptions"
import { Rarity } from "../types/enum/Game"
import { Pkm, Unowns } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import {
  getFirstAvailablePositionInBench,
  getFreeSpaceOnBench
} from "../utils/board"
import { chance, pickNRandomIn, pickRandomIn, randomWeighted } from "../utils/random"

const giftAmountOfItem = (
  toPlayer: Player,
  amount: number,
  itemName: string
): boolean => {
  if (itemName === "BERRIES") {
    const randomBerries = pickNRandomIn(Berries, amount)
    randomBerries.forEach((berry) => toPlayer.items.push(berry))
  } else if (itemName === "SWEETS") {
    const randomSweets = pickNRandomIn(Sweets, amount)
    randomSweets.forEach((sweet) => toPlayer.items.push(sweet))
  } else if (itemName === "GEMS") {
    const randomGems = pickNRandomIn(SynergyGems, amount)
    randomGems.forEach((gem) => {
      const type = SynergyGivenByGem[gem]
      toPlayer.bonusSynergies.set(
        type,
        (toPlayer.bonusSynergies.get(type) ?? 0) + 1
      )
      toPlayer.items.push(gem)
    })
    toPlayer.updateSynergies()
  } else if (itemName === "COMBINED_ITEMS") {
    const randomCombinedItems = pickNRandomIn(CraftableItemsNoScarves, amount)
    randomCombinedItems.forEach((x) => toPlayer.items.push(x))
  } else if (itemName === "TOOLS") {
    const randomTools = pickNRandomIn(Tools, amount)
    randomTools.forEach((x) => toPlayer.items.push(x))
  } else {
    return false
  }

  return true
}

const giftSetOfItems = (toPlayer: Player, itemName: string): boolean => {
  if (itemName === "TICKETS") {
    toPlayer.items.push(Item.EXCHANGE_TICKET)
    toPlayer.items.push(Item.RECYCLE_TICKET)
    toPlayer.items.push(Item.BRONZE_DOJO_TICKET)
  } else if (itemName === "REGION") {
    toPlayer.items.push(Item.LAPRAS_PASSPORT)
    toPlayer.shopFreeRolls += 10
  } else {
    return false
  }

  return true
}

const giftAmountOfPokemon = (
  toPlayer: Player,
  amount: number,
  pokemon: Pkm
): boolean => {
  const spaceInBench = getFreeSpaceOnBench(toPlayer.board)
  if (spaceInBench < amount) return false

  if (!pokemon) return false

  for (let i = 0; i < amount; i++) {
    let pkm = pokemon
    if (pokemon === Pkm.UNOWN_A) pkm = pickRandomIn(Unowns)

    const replacement = PokemonFactory.createPokemonFromName(
      getPokemonData(pkm).name,
      toPlayer
    )
    const freeCellX = getFirstAvailablePositionInBench(toPlayer.board)

    if (freeCellX === null) return false
    replacement.positionX = freeCellX
    replacement.positionY = 0
    toPlayer.board.set(replacement.id, replacement)
    replacement.onAcquired(toPlayer)
  }

  return true
}

const giftHatchPokemon = (toPlayer: Player, amount: number): boolean => {
  const spaceInBench = getFreeSpaceOnBench(toPlayer.board)
  if (spaceInBench < amount) return false

  if (chance(0.05)) { // 5% chance of getting a golden egg
    const hatchList = PRECOMPUTED_POKEMONS_PER_RARITY.HATCH.filter(
      (p) => getPokemonData(p).stars === 1
    )

    const randomHatches = pickNRandomIn(hatchList, amount)

    randomHatches.forEach((pkm) => {
      const replacement = PokemonFactory.createPokemonFromName(
        getPokemonData(pkm).name,
        toPlayer
      )
      const freeCellX = getFirstAvailablePositionInBench(toPlayer.board)

      if (freeCellX === null) return false
      replacement.stacksRequired = EvolutionTime.EVOLVE_HATCH
      replacement.positionX = freeCellX
      replacement.positionY = 0
      replacement.addMaxHP(50)
      replacement.addAttack(5)
      replacement.addAbilityPower(15)
      toPlayer.board.set(replacement.id, replacement)
      replacement.onAcquired(toPlayer)
    })
  } else {
    giveRandomEgg(toPlayer, true)
  }

  return true
}

const giftRandomPokemonByRarity = (
  toPlayer: Player,
  rarity: Rarity
): boolean => {
  const spaceInBench = getFreeSpaceOnBench(toPlayer.board)
  if (spaceInBench < 1) return false
  let wantedStars: number
  let shouldBeRegionalOrAdditional = false

  switch (rarity) {
    case Rarity.COMMON:
    case Rarity.UNIQUE:
    case Rarity.LEGENDARY:
      wantedStars = 3
      break
    case Rarity.UNCOMMON:
    case Rarity.RARE:
    case Rarity.EPIC:
      wantedStars = 2
      shouldBeRegionalOrAdditional = true
      break
    case Rarity.ULTRA:
    default:
      wantedStars = 1
      break
  }

  const nbOfSynergies =
    rarity === Rarity.ULTRA || rarity === Rarity.LEGENDARY ? 2 : 1
  var wantedSynergy = toPlayer.synergies.getTopSynergies(nbOfSynergies)
  if (wantedSynergy.includes(Synergy.BABY)) {
    wantedSynergy = toPlayer.synergies.getTopSynergies(nbOfSynergies + 1)
    wantedSynergy.splice(wantedSynergy.indexOf(Synergy.BABY), 1)
  }

  const pkmByRarity = PRECOMPUTED_POKEMONS_PER_RARITY[rarity]
  const pkmByRarityWithWantedSyns = pkmByRarity.filter((p) => {
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
    let res = false
    wantedSynergy.forEach((syn) => {
      if (types.includes(syn)) res = true
    })
    return res
  })

  if (pkmByRarityWithWantedSyns.length === 0)
    pkmByRarityWithWantedSyns.push(Pkm.UNOWN_A) //Fallback if no Pokémon satisfy the filter
  const pkm = pickRandomIn(pkmByRarityWithWantedSyns)

  if (!pkm) return false

  const replacement = PokemonFactory.createPokemonFromName(
    getPokemonData(pkm).name,
    toPlayer
  )
  const freeCellX = getFirstAvailablePositionInBench(toPlayer.board)

  if (freeCellX === null) return false
  replacement.positionX = freeCellX
  replacement.positionY = 0
  toPlayer.board.set(replacement.id, replacement)
  replacement.onAcquired(toPlayer)

  return true
}

const giftPotion = (toPlayer: Player, fromPlayer: Player): boolean => {
  toPlayer.life = Math.min(100, toPlayer.life + 10)
  fromPlayer.life = Math.min(100, fromPlayer.life + 10)
  return true
}

const evolveRandomPokemonInBoard = (toPlayer: Player): boolean => {
  const pokemonThatCanEvolve: Pokemon[] = []
  const otherPokemon: Pokemon[] = []
  toPlayer.board.forEach((pkm: Pokemon) => {
    if (pkm.hasEvolution) pokemonThatCanEvolve.push(pkm)
    else otherPokemon.push(pkm)
  })

  if (pokemonThatCanEvolve.length !== 0) {
    const randomPkm = pickRandomIn(pokemonThatCanEvolve)
    EvolutionManager.evolve(randomPkm, toPlayer)
  } else {
    if (otherPokemon.length === 0) return false // deny bundle if no units in board
    const randomPkm2 = pickRandomIn(otherPokemon)
    randomPkm2.addMaxHP(200)
    randomPkm2.addAttack(10)
    randomPkm2.addAbilityPower(50)
    randomPkm2.addDefense(5)
    randomPkm2.addSpecialDefense(5)
    randomPkm2.addSpeed(20)
    randomPkm2.addLuck(15)
  }
  return true
}

const giftExperienceAndRaiseLevelCap = (toPlayer: Player): boolean => {
  toPlayer.experienceManager.maxLevel = 10
  toPlayer.addExperience(32)
  return true
}

const giftFoodAndPicnic = (toPlayer: Player): boolean => {
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
            [Item.TINY_MUSHROOM]: 77,
            [Item.BIG_MUSHROOM]: 20,
            [Item.BALM_MUSHROOM]: 3
          }) ?? Item.TINY_MUSHROOM
      }

      p.dishes.add(randomDish)
    }
  })

  toPlayer.items.push(Item.TINY_MUSHROOM)
  toPlayer.items.push(Item.BIG_MUSHROOM)
  toPlayer.items.push(Item.BALM_MUSHROOM)
  toPlayer.items.push(Item.PICNIC_SET)

  return true
}

export const armoryGiftService: {
  [key in ArmoryOptions]?: (toPlayer: Player, fromPlayer: Player) => boolean
} = {
  [FreeOptions.BERRYBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfItem(toPlayer, 7, "BERRIES"),
  [FreeOptions.SWEETSBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfItem(toPlayer, 7, "SWEETS"),
  [FreeOptions.UNOWNBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfPokemon(toPlayer, 5, Pkm.UNOWN_A),
  [FreeOptions.DITTOBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfPokemon(toPlayer, 1, Pkm.DITTO),
  [FreeOptions.TICKETBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftSetOfItems(toPlayer, "TICKETS"),
  [FreeOptions.HATCHBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftHatchPokemon(toPlayer, 2),
  [FreeOptions.REGIONBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftSetOfItems(toPlayer, "REGION"),
  [FreeOptions.COOKINGBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftFoodAndPicnic(toPlayer),

  [PaidOptions.EVOLVEBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    evolveRandomPokemonInBoard(toPlayer),
  [PaidOptions.GEMSBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfItem(toPlayer, 3, "GEMS"),
  [PaidOptions.POTION]: (toPlayer: Player, fromPlayer: Player) =>
    giftPotion(toPlayer, fromPlayer),
  [PaidOptions.DELUXE_BOX]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfItem(toPlayer, 2, "COMBINED_ITEMS"),
  [PaidOptions.TOOLBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftAmountOfItem(toPlayer, 3, "TOOLS"),
  [PaidOptions.COMMONBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.COMMON),
  [PaidOptions.UNCOMMONBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.UNCOMMON),
  [PaidOptions.RAREBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.RARE),
  [PaidOptions.EPICBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.EPIC),
  [PaidOptions.ULTRABUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.ULTRA),
  [PaidOptions.UNIQUEBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.UNIQUE),
  [PaidOptions.LEGENDARYBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftRandomPokemonByRarity(toPlayer, Rarity.LEGENDARY),
  [PaidOptions.EXPBUNDLE]: (toPlayer: Player, fromPlayer: Player) =>
    giftExperienceAndRaiseLevelCap(toPlayer)
}
