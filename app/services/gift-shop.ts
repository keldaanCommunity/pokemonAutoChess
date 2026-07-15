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
import { Rarity } from "../types/enum/Game"
import type { Gift } from "../types/enum/GiftShop"
import { Pkm, Unowns } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { isIn } from "../utils/array"
import { getFirstAvailablePositionInBench } from "../utils/board"
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
            (toPlayer.bonusSynergies.get(type) ?? 0) + 1
          )
        }
      })
      toPlayer.updateSynergies()
    }
  }

const giftAmountOfPokemon =
  (amount: number, pokemon: Pkm) => (toPlayer: Player) => {
    for (let i = 0; i < amount; i++) {
      let pkm = pokemon
      if (pokemon === Pkm.UNOWN_A) pkm = pickRandomIn(Unowns)

      const replacement = PokemonFactory.createPokemonFromName(
        getPokemonData(pkm).name,
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
  if (chance(0.05)) {
    giveRandomEgg(toPlayer, true)
  } else {
    // 5% chance of getting a golden egg
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

      if (freeCellX === null) return
      replacement.stacksRequired = EvolutionTime.EVOLVE_HATCH
      replacement.positionX = freeCellX
      replacement.positionY = 0
      replacement.addMaxHP(50)
      replacement.addAttack(5)
      replacement.addAbilityPower(15)
      toPlayer.board.set(replacement.id, replacement)
      replacement.onAcquired(toPlayer)
    })
  }
}

const giftRandomPokemonByRarity = (rarity: Rarity) => (toPlayer: Player) => {
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
  let wantedSynergies = toPlayer.synergies.getTopSynergies(nbOfSynergies)
  if (wantedSynergies.includes(Synergy.BABY)) {
    wantedSynergies = toPlayer.synergies.getTopSynergies(nbOfSynergies + 1)
    wantedSynergies.splice(wantedSynergies.indexOf(Synergy.BABY), 1)
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
    return wantedSynergies.some((type) => types.includes(type))
  })

  if (pkmByRarityWithWantedSyns.length === 0)
    pkmByRarityWithWantedSyns.push(Pkm.UNOWN_A) //Fallback if no Pokémon satisfy the filter
  const pkm = pickRandomIn(pkmByRarityWithWantedSyns) ?? Pkm.DITTO
  const replacement = PokemonFactory.createPokemonFromName(
    getPokemonData(pkm).name,
    toPlayer
  )
  const freeCellX = getFirstAvailablePositionInBench(toPlayer.board)

  if (freeCellX === null) return
  replacement.positionX = freeCellX
  replacement.positionY = 0
  toPlayer.board.set(replacement.id, replacement)
  replacement.onAcquired(toPlayer)
}

const giftPotion = (toPlayer: Player, fromPlayer: Player) => {
  toPlayer.life = max(100)(toPlayer.life + 10)
  fromPlayer.life = max(100)(fromPlayer.life + 10)
}

const evolveRandomPokemonInBoard = (toPlayer: Player) => {
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
    if (otherPokemon.length === 0) return
    const randomPkm2 = pickRandomIn(otherPokemon)
    randomPkm2.addMaxHP(200)
    randomPkm2.addAttack(10)
    randomPkm2.addAbilityPower(50)
    randomPkm2.addDefense(5)
    randomPkm2.addSpecialDefense(5)
    randomPkm2.addSpeed(20)
    randomPkm2.addLuck(15)
  }
}

const giftExperienceAndRaiseLevelCap = (toPlayer: Player) => {
  toPlayer.experienceManager.maxLevel = 10
  toPlayer.addExperience(32)
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
}

type GiftEffect = (toPlayer: Player, fromPlayer: Player) => void

export const GiftEffects: {
  [key in Gift]: GiftEffect
} = {
  [Item.BERRY_BUNDLE]: giftAmountOfItem(7, Berries),
  [Item.SWEETS_BUNDLE]: giftAmountOfItem(7, Sweets),
  [Item.UNOWN_BUNDLE]: giftAmountOfPokemon(5, Pkm.UNOWN_A),
  [Item.DITTO_BUNDLE]: giftAmountOfPokemon(1, Pkm.DITTO),
  [Item.TICKET_BUNDLE]: (toPlayer: Player, fromPlayer: Player) => {
    toPlayer.items.push(Item.EXCHANGE_TICKET)
    toPlayer.items.push(Item.RECYCLE_TICKET)
    toPlayer.items.push(Item.BRONZE_DOJO_TICKET)
  },
  [Item.HATCH_BUNDLE]: giftHatchPokemon(2),
  [Item.REGION_BUNDLE]: (toPlayer: Player, fromPlayer: Player) => {
    toPlayer.items.push(Item.LAPRAS_PASSPORT)
    toPlayer.shopFreeRolls += 10
  },
  [Item.COOKING_BUNDLE]: giftFoodAndPicnic,
  [Item.EVOLVE_BUNDLE]: evolveRandomPokemonInBoard,
  [Item.GEMS_BUNDLE]: giftAmountOfItem(3, SynergyGems),
  [Item.POTION]: giftPotion,
  [Item.DELUXE_BOX]: giftAmountOfItem(2, CraftableItemsNoScarves),
  [Item.TOOL_BUNDLE]: giftAmountOfItem(3, Tools),
  [Item.COMMON_BUNDLE]: giftRandomPokemonByRarity(Rarity.COMMON),
  [Item.UNCOMMON_BUNDLE]: giftRandomPokemonByRarity(Rarity.UNCOMMON),
  [Item.RARE_BUNDLE]: giftRandomPokemonByRarity(Rarity.RARE),
  [Item.EPIC_BUNDLE]: giftRandomPokemonByRarity(Rarity.EPIC),
  [Item.ULTRA_BUNDLE]: giftRandomPokemonByRarity(Rarity.ULTRA),
  [Item.UNIQUE_BUNDLE]: giftRandomPokemonByRarity(Rarity.UNIQUE),
  [Item.LEGENDARY_BUNDLE]: giftRandomPokemonByRarity(Rarity.LEGENDARY),
  [Item.EXP_BUNDLE]: giftExperienceAndRaiseLevelCap
}
