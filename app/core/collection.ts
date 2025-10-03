import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import { CollectionEmotions, Emotion, PkmWithCustom } from "../types"
import { Booster, BoosterCard } from "../types/Booster"
import { BoosterRarityProbability, EmotionCost } from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Rarity } from "../types/enum/Game"
import { Pkm, PkmIndex, Unowns } from "../types/enum/Pokemon"
import {
  IPokemonCollectionItemClient,
  IPokemonCollectionItemMongo,
  IPokemonCollectionItemUnpacked,
  IUserMetadataMongo
} from "../types/interfaces/UserMetadata"
import { sum } from "../utils/array"
import { chance, pickRandomIn, randomWeighted } from "../utils/random"

export function createBooster(user: IUserMetadataMongo): Booster {
  const NB_PER_BOOSTER = 10
  const boosterContent: BoosterCard[] = []
  const alreadyTaken = new Set<string>()

  for (let i = 0; i < NB_PER_BOOSTER; i++) {
    const guaranteedUnique = i === NB_PER_BOOSTER - 1
    let card: BoosterCard
    let attempts = 0
    const maxAttempts = 50 // Prevent infinite loops

    do {
      card = pickRandomPokemonBooster(user, guaranteedUnique)
      attempts++
    } while (
      attempts < maxAttempts &&
      alreadyTaken.has(`${card.name}-${card.shiny}-${card.emotion}`)
    )

    // If we couldn't find a unique combination after maxAttempts, use the last generated card anyway
    // This ensures the booster always has the expected number of cards
    boosterContent.push(card)
    alreadyTaken.add(`${card.name}-${card.shiny}-${card.emotion}`)
  }
  return boosterContent
}

export function pickRandomPokemonBooster(
  user: IUserMetadataMongo,
  guaranteedUnique: boolean
): BoosterCard {
  let name = Pkm.MAGIKARP
  const rarities = Object.keys(Rarity) as Rarity[]
  const seed = Math.random() * sum(Object.values(BoosterRarityProbability))
  let threshold = 0

  if (guaranteedUnique) {
    name = pickRandomIn([
      ...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.UNIQUE],
      ...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.LEGENDARY]
    ]) as Pkm
  } else {
    for (let i = 0; i < rarities.length; i++) {
      const rarity = rarities[i]
      const rarityProbability = BoosterRarityProbability[rarity]
      threshold += rarityProbability
      if (seed < threshold) {
        const candidates: Pkm[] = (
          PRECOMPUTED_POKEMONS_PER_RARITY[rarity] ?? []
        ).filter(
          (p) =>
            Unowns.includes(p) === false &&
            getPokemonData(p).skill !== Ability.DEFAULT
        )
        if (candidates.length > 0) {
          name = pickRandomIn(candidates) as Pkm
          break
        }
      }
    }
  }

  const availableEmotions = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[PkmIndex[name]]?.[i] === 1
  )
  const emotion =
    randomWeighted<Emotion>(
      availableEmotions.reduce(
        (o, e) => ({ ...o, [e]: 1 / EmotionCost[e] }),
        {}
      )
    ) ?? Emotion.NORMAL
  const shiny = chance(0.05)
  const hasAlreadyUnlocked = CollectionUtils.hasUnlockedCustom(
    user.pokemonCollection,
    {
      name,
      shiny,
      emotion
    }
  )

  return { name: name, shiny, emotion, new: !hasAlreadyUnlocked }
}

// Utility functions for working with collection and the optimized unlocked field
export class CollectionUtils {
  private static readonly EMOTION_VALUES = CollectionEmotions

  static hasUnlockedCustom(
    collection: Map<string, IPokemonCollectionItemMongo>,
    card: PkmWithCustom
  ): boolean {
    const index = PkmIndex[card.name]
    if (collection.has(index) === false) {
      return false
    }
    const collectionItem = collection.get(index)!
    return CollectionUtils.hasUnlocked(
      collectionItem.unlocked,
      card.emotion ?? Emotion.NORMAL,
      card.shiny
    )
  }

  static toMongoCollectionItem(
    item: IPokemonCollectionItemClient
  ): IPokemonCollectionItemMongo {
    return {
      ...item,
      unlocked: CollectionUtils.decodeBase64(item.unlockedb64)
    }
  }

  static toCollectionItemClient(
    item: IPokemonCollectionItemMongo
  ): IPokemonCollectionItemClient {
    return {
      id: item.id,
      dust: item.dust,
      played: item.played,
      selectedShiny: item.selectedShiny,
      selectedEmotion: item.selectedEmotion,
      unlockedb64: item.unlocked
        ? CollectionUtils.encodeBase64(item.unlocked)
        : ""
    }
  }

  static unpackCollectionItem(
    item: IPokemonCollectionItemClient
  ): IPokemonCollectionItemUnpacked {
    const { emotions, shinyEmotions } =
      CollectionUtils.getEmotionsUnlocked(item)
    const { unlockedb64, ...rest } = item
    return {
      ...rest,
      emotions,
      shinyEmotions
    }
  }

  /**
   * Create emotion mask from legacy format
   */
  static getEmotionMask(
    emotions: Emotion[] = [],
    shinyEmotions: Emotion[] = []
  ): Buffer {
    const buffer = Buffer.alloc(5) // 5 bytes = 40 bits total

    // Set normal emotions (using bits 0-19)
    emotions.forEach((emotion) => {
      const index = this.EMOTION_VALUES.indexOf(emotion)
      if (index !== -1) {
        this.setBit(buffer, index, true)
      }
    })

    // Set shiny emotions (using bits 20-39)
    shinyEmotions.forEach((emotion) => {
      const index = this.EMOTION_VALUES.indexOf(emotion)
      if (index !== -1) {
        this.setBit(buffer, index + 20, true)
      }
    })

    return buffer
  }

  static encodeBase64(buffer: Buffer): string {
    return buffer.toString("base64")
  }

  static decodeBase64(base64: string): Buffer {
    return Buffer.from(base64, "base64")
  }

  /**
   * Get list of emotions from emotion 5 bytes mask on MongoDB
   */
  static getEmotionsUnlocked(
    item?: IPokemonCollectionItemMongo | IPokemonCollectionItemClient
  ): {
    emotions: Emotion[]
    shinyEmotions: Emotion[]
  } {
    const emotions: Emotion[] = []
    const shinyEmotions: Emotion[] = []

    if (!item) return { emotions, shinyEmotions }

    const mask =
      "unlockedb64" in item
        ? CollectionUtils.decodeBase64(item.unlockedb64)
        : item.unlocked

    // Extract normal emotions (bits 0-19)
    for (let i = 0; i < 20; i++) {
      if (this.getBit(mask, i)) {
        emotions.push(this.EMOTION_VALUES[i])
      }
    }

    // Extract shiny emotions (bits 20-39)
    for (let i = 0; i < 20; i++) {
      if (this.getBit(mask, i + 20)) {
        shinyEmotions.push(this.EMOTION_VALUES[i])
      }
    }

    return {
      emotions,
      shinyEmotions
    }
  }

  /**
   * Check if emotion is unlocked
   */
  static hasUnlocked(
    mask: Buffer,
    emotion: Emotion,
    shiny: boolean = false
  ): boolean {
    const index = this.EMOTION_VALUES.indexOf(emotion)
    if (index === -1) return false

    const bitIndex = shiny ? index + 20 : index
    return this.getBit(mask, bitIndex)
  }

  /**
   * Add emotion to the mask
   */
  static unlockEmotion(
    mask: Buffer,
    emotion: Emotion,
    shiny: boolean = false
  ): void {
    const index = this.EMOTION_VALUES.indexOf(emotion)
    if (index === -1) return

    const bitIndex = shiny ? index + 20 : index
    this.setBit(mask, bitIndex, true)
  }

  private static setBit(mask: Buffer, bitIndex: number, value: boolean): void {
    const byteIndex = Math.floor(bitIndex / 8)
    const bitPosition = bitIndex % 8

    if (byteIndex >= mask.length) return

    if (value) {
      mask[byteIndex] |= 1 << bitPosition
    } else {
      mask[byteIndex] &= ~(1 << bitPosition)
    }
  }

  private static getBit(mask: Buffer, bitIndex: number): boolean {
    const byteIndex = Math.floor(bitIndex / 8)
    const bitPosition = bitIndex % 8

    if (byteIndex >= mask.length) return false

    return (mask[byteIndex] & (1 << bitPosition)) !== 0
  }
}
