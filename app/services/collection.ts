import { HydratedDocument } from "mongoose"
import {
  BoosterRarityProbability,
  EmotionCost,
  getBaseAltForm,
  getEmotionCost,
  PkmAltForms,
  PkmAltFormsByPkm
} from "../config"
import { CollectionUtils } from "../core/collection"
import UserMetadata from "../models/mongo-models/user-metadata"
import { getAvailableEmotions } from "../models/precomputed/precomputed-emotions"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import { PokemonAnimations } from "../public/src/game/components/pokemon-animations"
import { Emotion } from "../types"
import { Booster, BoosterCard } from "../types/Booster"
import { Ability } from "../types/enum/Ability"
import { Rarity } from "../types/enum/Game"
import { Pkm, PkmByIndex, PkmIndex, Unowns } from "../types/enum/Pokemon"
import type {
  IPokemonCollectionItemMongo,
  IUserMetadataMongo
} from "../types/interfaces/UserMetadata"
import { logger } from "../utils/logger"
import { chance, pickRandomIn, randomWeighted } from "../utils/random"
import { checkTitlesAfterEmotionUnlocked } from "./booster"
import { recordBoosterCreation } from "./booster-monitor"

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

export async function migrateShardsOfAltForms(
  mongoUser: HydratedDocument<IUserMetadataMongo>
) {
  let modified = false

  for (const [index, item] of mongoUser.pokemonCollection) {
    const pkm = PkmByIndex[index]
    if (PkmAltForms.includes(pkm) && item.dust > 0) {
      const basePkm = getBaseAltForm(pkm)
      const baseIndex = PkmIndex[basePkm]
      const baseItem = mongoUser.pokemonCollection.get(baseIndex)
      const dustToMigrate = item.dust
      if (!baseItem) {
        // Base form is not in collection, create new collection item
        const newCollectionItem: IPokemonCollectionItemMongo = {
          id: index,
          unlocked: Buffer.alloc(5, 0),
          dust: item.dust,
          selectedEmotion: Emotion.NORMAL,
          selectedShiny: false,
          played: 0
        }
        mongoUser.pokemonCollection.set(baseIndex, newCollectionItem)
      } else {
        // Base form exists, add dust
        baseItem.dust += dustToMigrate
        item.dust = 0
      }
      logger.info(
        `Migrated ${dustToMigrate} shards from ${pkm} to its base form ${basePkm} for user ${mongoUser.uid}`
      )
      modified = true
    }
  }

  if (modified) {
    return await mongoUser.save()
  }
}

export function createBooster(user: IUserMetadataMongo): Booster {
  const NB_PER_BOOSTER = 10
  const boosterContent: BoosterCard[] = []
  const alreadyTaken = new Set<string>()
  const godPack = chance(1 / 1000)

  for (let i = 0; i < NB_PER_BOOSTER; i++) {
    const guaranteedUnique = i === NB_PER_BOOSTER - 1
    let card: BoosterCard
    let attempts = 0
    const maxAttempts = 50 // Prevent infinite loops

    do {
      card = pickRandomPokemonBooster(user, guaranteedUnique, godPack)
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

  recordBoosterCreation(boosterContent)

  return boosterContent
}

export function pickRandomPokemonBooster(
  user: IUserMetadataMongo,
  guaranteedUnique: boolean,
  godPack: boolean
): BoosterCard {
  let name = Pkm.MAGIKARP
  const rarity =
    randomWeighted<Rarity>(BoosterRarityProbability) ?? Rarity.COMMON

  if (godPack || guaranteedUnique) {
    name = pickRandomIn(
      [
        ...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.UNIQUE],
        ...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.LEGENDARY]
      ].filter((p) => getBaseAltForm(p) === p)
    ) as Pkm
  } else {
    const candidates: Pkm[] = (
      PRECOMPUTED_POKEMONS_PER_RARITY[rarity] ?? []
    ).filter(
      (p) =>
        Unowns.includes(p) === false &&
        getPokemonData(p).skill !== Ability.DEFAULT &&
        getBaseAltForm(p) === p
    )
    name = pickRandomIn(candidates)
    if (name === undefined) {
      name = Pkm.MAGIKARP
      logger.warn(
        `No candidates found for booster card rarity ${rarity}, defaulting to MAGIKARP`
      )
    }
  }

  if (name in PkmAltFormsByPkm) {
    // If the selected Pokemon has alt forms, pick one of them randomly
    name = pickRandomIn([name, ...PkmAltFormsByPkm[name]!])
  }

  const shiny =
    (godPack || chance(0.05)) &&
    PokemonAnimations[name]?.shinyUnavailable !== true

  const availableEmotions = getAvailableEmotions(PkmIndex[name], shiny)
  let emotion =
    randomWeighted<Emotion>(
      availableEmotions.reduce(
        (o, e) => ({ ...o, [e]: 1 / EmotionCost[e] }),
        {}
      )
    ) ?? Emotion.NORMAL

  if (godPack) {
    const emotionsNotUnlocked = availableEmotions.filter(
      (emotion) =>
        !CollectionUtils.hasUnlockedCustom(user.pokemonCollection, {
          name,
          shiny,
          emotion
        })
    )
    if (emotionsNotUnlocked.length > 0) {
      emotion = pickRandomIn(emotionsNotUnlocked)
    }
  }

  const hasAlreadyUnlocked = CollectionUtils.hasUnlockedCustom(
    user.pokemonCollection,
    {
      name,
      shiny,
      emotion
    }
  )

  return { name, shiny, emotion, new: !hasAlreadyUnlocked }
}
