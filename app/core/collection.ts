import { CollectionEmotions, Emotion, type PkmWithCustom } from "../types"
import { PkmIndex } from "../types/enum/Pokemon"
import type {
  IPokemonCollectionItemClient,
  IPokemonCollectionItemMongo,
  IPokemonCollectionItemUnpacked
} from "../types/interfaces/UserMetadata"

// Utility functions for working with collection and the optimized unlocked field
export class CollectionUtils {
  private static readonly EMOTION_VALUES = CollectionEmotions

  private static hasNodeBuffer(): boolean {
    return typeof Buffer !== "undefined"
  }

  private static allocMask(size: number): Uint8Array {
    return this.hasNodeBuffer() ? Buffer.alloc(size) : new Uint8Array(size)
  }

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
  ): Uint8Array {
    const buffer = this.allocMask(5) // 5 bytes = 40 bits total

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

  static encodeBase64(buffer: Uint8Array): string {
    if (this.hasNodeBuffer()) {
      return Buffer.from(buffer).toString("base64")
    }

    let binary = ""
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i])
    }
    return btoa(binary)
  }

  static decodeBase64(base64: string): Uint8Array {
    if (this.hasNodeBuffer()) {
      return Buffer.from(base64, "base64")
    }

    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    return bytes
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
    mask: Uint8Array,
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
    mask: Uint8Array,
    emotion: Emotion,
    shiny: boolean = false
  ): void {
    const index = this.EMOTION_VALUES.indexOf(emotion)
    if (index === -1) return

    const bitIndex = shiny ? index + 20 : index
    this.setBit(mask, bitIndex, true)
  }

  private static setBit(
    mask: Uint8Array,
    bitIndex: number,
    value: boolean
  ): void {
    const byteIndex = Math.floor(bitIndex / 8)
    const bitPosition = bitIndex % 8

    if (byteIndex >= mask.length) return

    if (value) {
      mask[byteIndex] |= 1 << bitPosition
    } else {
      mask[byteIndex] &= ~(1 << bitPosition)
    }
  }

  private static getBit(mask: Uint8Array, bitIndex: number): boolean {
    const byteIndex = Math.floor(bitIndex / 8)
    const bitPosition = bitIndex % 8

    if (byteIndex >= mask.length) return false

    return (mask[byteIndex] & (1 << bitPosition)) !== 0
  }
}
