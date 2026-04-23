import { getBaseAltForm, getEmotionCost } from "../config"
import { CollectionUtils } from "../core/collection"
import UserMetadata from "../models/mongo-models/user-metadata"
import { checkTitlesAfterEmotionUnlocked } from "./booster"
import { Emotion } from "../types"
import { PkmByIndex, PkmIndex } from "../types/enum/Pokemon"
import type { IUserMetadataMongo } from "../types/interfaces/UserMetadata"

export type CollectionMutationResult = {
  userDoc: IUserMetadataMongo
}

export async function changeSelectedEmotionForUser(
  uid: string,
  index: string,
  emotion: Emotion | null,
  shiny: boolean
): Promise<CollectionMutationResult | null> {
  const mongoUser = await UserMetadata.findOne({ uid })
  if (!mongoUser) return null

  const mongoItem = mongoUser.pokemonCollection.get(index)
  if (!mongoItem) return null

  if (
    emotion === mongoItem.selectedEmotion &&
    shiny === mongoItem.selectedShiny
  ) {
    return { userDoc: mongoUser }
  }

  if (
    emotion !== null &&
    !CollectionUtils.hasUnlocked(mongoItem.unlocked, emotion, shiny)
  ) {
    return null
  }

  mongoItem.selectedEmotion = emotion
  mongoItem.selectedShiny = shiny
  await mongoUser.save()

  return { userDoc: mongoUser }
}

export async function buyEmotionForUser(
  uid: string,
  index: string,
  emotion: Emotion,
  shiny: boolean
): Promise<CollectionMutationResult | null> {
  if (!PkmByIndex.hasOwnProperty(index)) return null

  const mongoUser = await UserMetadata.findOne({ uid })
  if (!mongoUser) return null

  const cost = getEmotionCost(emotion, shiny)
  const shardIndex = PkmIndex[getBaseAltForm(PkmByIndex[index])]

  const mongoItem = mongoUser.pokemonCollection.get(index)
  const mongoShardItem = mongoUser.pokemonCollection.get(shardIndex)
  if (!mongoItem || !mongoShardItem) return null

  if (CollectionUtils.hasUnlocked(mongoItem.unlocked, emotion, shiny)) {
    return { userDoc: mongoUser }
  }

  if (mongoShardItem.dust < cost) return null

  CollectionUtils.unlockEmotion(mongoItem.unlocked, emotion, shiny)
  mongoItem.selectedEmotion = emotion
  mongoItem.selectedShiny = shiny
  mongoUser.markModified(`pokemonCollection.${index}`)

  mongoShardItem.dust -= cost

  checkTitlesAfterEmotionUnlocked(mongoUser, [
    { name: PkmByIndex[index], emotion, shiny }
  ])
  await mongoUser.save()

  return { userDoc: mongoUser }
}
