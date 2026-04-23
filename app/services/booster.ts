import {
  BoosterPriceByRarity,
  DUST_PER_BOOSTER,
  DUST_PER_SHINY,
  getBaseAltForm,
  PkmAltForms,
  PkmAltFormsByPkm
} from "../config"
import { CollectionUtils, createBooster } from "../core/collection"
import UserMetadata from "../models/mongo-models/user-metadata"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { CollectionEmotions, Emotion, PkmWithCustom, Title } from "../types"
import type { Booster } from "../types/Booster"
import {
  NonPkm,
  Pkm,
  PkmByIndex,
  PkmIndex,
  Unowns
} from "../types/enum/Pokemon"
import {
  IPokemonCollectionItemMongo,
  IUserMetadataMongo
} from "../types/interfaces/UserMetadata"

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

export function checkTitlesAfterEmotionUnlocked(
  mongoUser: IUserMetadataMongo,
  unlocked: PkmWithCustom[]
) {
  const newTitles: Title[] = []
  if (!mongoUser.titles.includes(Title.SHINY_SEEKER)) {
    let numberOfShinies = 0
    mongoUser.pokemonCollection.forEach((c) => {
      const { shinyEmotions } = CollectionUtils.getEmotionsUnlocked(c)
      numberOfShinies += shinyEmotions.length
    })
    if (numberOfShinies >= 30) {
      newTitles.push(Title.SHINY_SEEKER)
    }
  }

  if (!mongoUser.titles.includes(Title.DUKE)) {
    if (
      Object.values(Pkm)
        .filter(
          (p) =>
            NonPkm.includes(p) === false && PkmAltForms.includes(p) === false
        )
        .every((pkm) => {
          const baseForm = getBaseAltForm(pkm)
          const accepted: Pkm[] =
            baseForm in PkmAltFormsByPkm
              ? [baseForm, ...PkmAltFormsByPkm[baseForm]]
              : [baseForm]
          return accepted.some((form) => {
            const item = mongoUser.pokemonCollection.get(PkmIndex[form])
            if (!item) return false
            const { emotions, shinyEmotions } =
              CollectionUtils.getEmotionsUnlocked(item)
            return emotions.length > 0 || shinyEmotions.length > 0
          })
        })
    ) {
      newTitles.push(Title.DUKE)
    }
  }

  if (
    unlocked.some((p) => p.emotion === Emotion.ANGRY && p.name === Pkm.ARBOK) &&
    !mongoUser.titles.includes(Title.DENTIST)
  ) {
    newTitles.push(Title.DENTIST)
  }

  if (
    !mongoUser.titles.includes(Title.ARCHEOLOGIST) &&
    Unowns.some((unown) => unlocked.map((p) => p.name).includes(unown)) &&
    Unowns.every((name) => {
      const unownIndex = PkmIndex[name]
      const item = mongoUser.pokemonCollection.get(unownIndex)
      const isBeingUnlockedRightNow = unlocked.some((p) => p.name === name)
      let isAlreadyUnlocked = false
      if (item) {
        const { emotions, shinyEmotions } =
          CollectionUtils.getEmotionsUnlocked(item)
        isAlreadyUnlocked = emotions.length > 0 || shinyEmotions.length > 0
      }
      return isAlreadyUnlocked || isBeingUnlockedRightNow
    })
  ) {
    newTitles.push(Title.ARCHEOLOGIST)
  }

  if (!mongoUser.titles.includes(Title.DUCHESS)) {
    if (
      unlocked.some((p) => {
        const item = mongoUser.pokemonCollection.get(PkmIndex[p.name])
        if (!item) return false
        const { emotions, shinyEmotions } =
          CollectionUtils.getEmotionsUnlocked(item)
        return (
          shinyEmotions.length >= CollectionEmotions.length &&
          emotions.length >= CollectionEmotions.length
        )
      })
    ) {
      newTitles.push(Title.DUCHESS)
    }
  }

  if (newTitles.length > 0) {
    mongoUser.titles.push(...newTitles)
  }
}
