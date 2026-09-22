import {
  BoosterPriceByRarity,
  DUST_PER_BOOSTER,
  DUST_PER_SHINY,
  getBaseAltForm
} from "../config"
import { CollectionUtils } from "../core/collection"
import UserMetadata from "../models/mongo-models/user-metadata"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../types"
import type { Booster } from "../types/Booster"
import { PkmByIndex, PkmIndex } from "../types/enum/Pokemon"
import type {
  IPokemonCollectionItemMongo,
  IUserMetadataMongo
} from "../types/interfaces/UserMetadata"
import { checkTitlesAfterEmotionUnlocked, createBooster } from "./collection"

export type OpenBoosterResult = {
  userDoc: IUserMetadataMongo
  boosterContent: Booster
}

export type BuyBoosterResult = {
  userDoc: IUserMetadataMongo
}

export async function buyBoosterForUser(
  uid: string,
  index: string
): Promise<BuyBoosterResult | null> {
  const pkm = PkmByIndex[index]
  if (!pkm) return null

  const rarity = getPokemonData(pkm).rarity
  const boosterCost = BoosterPriceByRarity[rarity]
  const shardIndex = PkmIndex[getBaseAltForm(pkm)]

  const userDoc = await UserMetadata.findOneAndUpdate(
    {
      uid,
      [`pokemonCollection.${shardIndex}.dust`]: { $gte: boosterCost }
    },
    {
      $inc: {
        booster: 1,
        [`pokemonCollection.${shardIndex}.dust`]: -boosterCost
      }
    },
    { returnDocument: "after" }
  )

  if (!userDoc) return null

  return { userDoc }
}

export async function openBoosterForUser(
  uid: string
): Promise<OpenBoosterResult | null> {
  let userDoc = await UserMetadata.findOneAndUpdate(
    {
      uid,
      booster: { $gt: 0 }
    },
    {
      $inc: { booster: -1 }
    },
    { returnDocument: "after" }
  )

  if (!userDoc) return null

  const updateOperations: any = {}
  const boosterContent = createBooster(userDoc)
  for (const card of boosterContent) {
    const index = PkmIndex[card.name]
    const existingItem = userDoc.pokemonCollection.get(index)

    if (!existingItem) {
      if (`pokemonCollection.${index}` in updateOperations) {
        const unlocked = updateOperations[`pokemonCollection.${index}`].unlocked
        CollectionUtils.unlockEmotion(unlocked, card.emotion, card.shiny)
      } else {
        const newCollectionItem: IPokemonCollectionItemMongo = {
          id: index,
          unlocked: Buffer.alloc(5, 0),
          dust: 0,
          selectedEmotion: Emotion.NORMAL,
          selectedShiny: false,
          played: 0
        }
        CollectionUtils.unlockEmotion(
          newCollectionItem.unlocked,
          card.emotion,
          card.shiny
        )
        updateOperations[`pokemonCollection.${index}`] = newCollectionItem
      }
    } else {
      const hasUnlocked = CollectionUtils.hasUnlocked(
        existingItem.unlocked,
        card.emotion,
        card.shiny
      )

      if (hasUnlocked) {
        const dustGain = card.shiny ? DUST_PER_SHINY : DUST_PER_BOOSTER
        const shardIndex = PkmIndex[getBaseAltForm(card.name)]
        updateOperations.$inc = updateOperations.$inc || {}
        updateOperations.$inc[`pokemonCollection.${shardIndex}.dust`] = dustGain
      } else {
        CollectionUtils.unlockEmotion(
          existingItem.unlocked,
          card.emotion,
          card.shiny
        )
        updateOperations[`pokemonCollection.${index}.unlocked`] =
          Buffer.copyBytesFrom(existingItem.unlocked, 0, 5)
      }
    }
  }

  await userDoc.updateOne(updateOperations)

  userDoc = await UserMetadata.findOne({ uid })
  if (!userDoc) return null

  checkTitlesAfterEmotionUnlocked(userDoc, boosterContent)
  await userDoc.save()

  return {
    userDoc,
    boosterContent
  }
}
