import { Command } from "@colyseus/command"
import { Client, matchMaker } from "colyseus"
import { writeHeapSnapshot } from "v8"
import {
  BoosterPriceByRarity,
  DUST_PER_BOOSTER,
  DUST_PER_SHINY,
  EloRankThreshold,
  getBaseAltForm,
  getEmotionCost,
  MAX_PLAYERS_PER_GAME,
  PkmAltForms,
  PkmAltFormsByPkm,
  USERNAME_REGEXP
} from "../../config"
import { CollectionUtils, createBooster } from "../../core/collection"
import { getPendingGame } from "../../core/pending-game-manager"
import UserMetadata, {
  toUserMetadataJSON
} from "../../models/mongo-models/user-metadata"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { discordService } from "../../services/discord"
import { notificationsService } from "../../services/notifications"
import {
  CollectionEmotions,
  Emotion,
  PkmWithCustom,
  Role,
  Title,
  Transfer
} from "../../types"
import { CloseCodes } from "../../types/enum/CloseCodes"
import { EloRank } from "../../types/enum/EloRank"
import { GameMode } from "../../types/enum/Game"
import { Language } from "../../types/enum/Language"
import {
  NonPkm,
  Pkm,
  PkmByIndex,
  PkmIndex,
  Unowns
} from "../../types/enum/Pokemon"
import { StarterAvatars, Starters } from "../../types/enum/Starters"
import {
  IPokemonCollectionItemMongo,
  IUserMetadataMongo
} from "../../types/interfaces/UserMetadata"
import { getPortraitSrc } from "../../utils/avatar"
import { getRank } from "../../utils/elo"
import { logger } from "../../utils/logger"
import { generateRandomName } from "../../utils/name-generation"
import { cleanProfanity } from "../../utils/profanity-filter"
import { pickRandomIn } from "../../utils/random"
import CustomLobbyRoom from "../custom-lobby-room"

export class OnJoinCommand extends Command<
  CustomLobbyRoom,
  {
    client: Client
    user: IUserMetadataMongo | null
  }
> {
  async execute({
    client,
    user
  }: {
    client: Client
    user: IUserMetadataMongo | null
  }) {
    try {
      //logger.info(`${client.auth.displayName} ${client.id} join lobby room`)
      client.send(Transfer.ROOMS, this.room.rooms)
      client.userData = { joinedAt: Date.now() }

      if (user) {
        // load existing account
        this.room.users.set(client.auth.uid, user)
        const pendingGame = await getPendingGame(
          this.room.presence,
          client.auth.uid
        )
        if (pendingGame != null && !pendingGame.isExpired) {
          client.send(Transfer.RECONNECT_PROMPT, pendingGame.gameId)
        }

        // Send any pending notifications
        const notifications = notificationsService.getNotifications(
          client.auth.uid
        )
        if (notifications.length > 0) {
          client.send(Transfer.NOTIFICATIONS, notifications)
        }
      } else {
        // create new user account
        const starterBoosters = 3
        const starterPokemon = pickRandomIn(Starters)
        const starterAvatar = PkmIndex[starterPokemon] + "/Normal"
        const randomName = generateRandomName(starterPokemon)
        await UserMetadata.create({
          uid: client.auth.uid,
          displayName: randomName,
          avatar: starterAvatar,
          booster: starterBoosters,
          pokemonCollection: new Map<string, IPokemonCollectionItemMongo>()
        })
        const newUser: IUserMetadataMongo = {
          uid: client.auth.uid,
          displayName: randomName,
          language: client.auth.metadata.language,
          avatar: starterAvatar,
          games: 0,
          wins: 0,
          exp: 0,
          level: 0,
          elo: 1000,
          maxElo: 1000,
          eventPoints: 0,
          maxEventPoints: 0,
          eventFinishTime: null,
          pokemonCollection: new Map<string, IPokemonCollectionItemMongo>(),
          booster: starterBoosters,
          titles: [],
          title: "",
          role: Role.BASIC
        }
        this.room.users.set(client.auth.uid, newUser)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnLeaveCommand extends Command<
  CustomLobbyRoom,
  { client: Client }
> {
  execute({ client }: { client: Client }) {
    try {
      if (client && client.auth && client.auth.displayName && client.auth.uid) {
        //logger.info(`${client.auth.displayName} ${client.id} leave lobby`)
        this.room.users.delete(client.auth.uid)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class GiveTitleCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; title: Title }
> {
  async execute({
    client,
    uid,
    title
  }: {
    client: Client
    uid: string
    title: Title
  }) {
    try {
      const u = this.room.users.get(client.auth.uid)
      const targetUser = this.room.users.get(uid)

      if (u && u.role && u.role === Role.ADMIN) {
        const user = await UserMetadata.findOne({ uid })
        if (user && user.titles && !user.titles.includes(title)) {
          user.titles.push(title)
          user.save()

          if (targetUser) {
            targetUser.titles.push(title)
          }
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class DeleteAccountCommand extends Command<CustomLobbyRoom> {
  async execute({ client }: { client: Client }) {
    try {
      if (client.auth.uid) {
        logger.info(
          `User ${client.auth.displayName} [${client.auth.uid}] has deleted their account`
        )
        await UserMetadata.deleteOne({ uid: client.auth.uid })
        client.leave(CloseCodes.USER_DELETED)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class HeapSnapshotCommand extends Command<
  CustomLobbyRoom,
  { client: Client }
> {
  execute({ client }: { client: Client }) {
    const u = this.room.users.get(client.auth.uid)
    if (u && u.role === Role.ADMIN) {
      logger.info("writing heap snapshot")
      writeHeapSnapshot()
    }
  }
}

export class GiveBoostersCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; numberOfBoosters: number }
> {
  async execute({
    client,
    uid,
    numberOfBoosters = 1
  }: {
    client: Client
    uid: string
    numberOfBoosters: number
  }) {
    try {
      const u = this.room.users.get(client.auth.uid)
      const targetUser = this.room.users.get(uid)

      if (u && u.role && u.role === Role.ADMIN) {
        const user = await UserMetadata.findOne({ uid: uid })
        if (user) {
          user.booster += numberOfBoosters
          user.save()

          if (targetUser) {
            targetUser.booster = user.booster
          }
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class GiveRoleCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; role: Role }
> {
  async execute({
    client,
    uid,
    role
  }: {
    client: Client
    uid: string
    role: Role
  }) {
    try {
      const u = this.room.users.get(client.auth.uid)
      const targetUser = this.room.users.get(uid)
      // logger.debug(u.role, uid)
      if (u && u.role === Role.ADMIN) {
        const user = await UserMetadata.findOne({ uid: uid })
        if (user) {
          user.role = role
          user.save()

          if (targetUser) {
            targetUser.role = user.role
          }
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
export class OnNewMessageCommand extends Command<
  CustomLobbyRoom,
  { client: Client; message: string }
> {
  execute({ client, message }: { client: Client; message: string }) {
    try {
      const MAX_MESSAGE_LENGTH = 250
      message = cleanProfanity(message.substring(0, MAX_MESSAGE_LENGTH))

      const user = this.room.users.get(client.auth.uid)
      if (
        user &&
        [Role.ADMIN, Role.MODERATOR].includes(user.role) &&
        message != ""
      ) {
        this.state.addMessage(message, user.uid, user.displayName, user.avatar)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class RemoveMessageCommand extends Command<
  CustomLobbyRoom,
  { client: Client; messageId: string }
> {
  execute({ client, messageId }: { client: Client; messageId: string }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (
        user &&
        user.role &&
        (user.role === Role.ADMIN || user.role === Role.MODERATOR)
      ) {
        this.state.removeMessage(messageId)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OpenBoosterCommand extends Command<
  CustomLobbyRoom,
  { client: Client }
> {
  async execute({ client }: { client: Client }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (!user) return

      // Immediately find and decrement booster count to avoid any possible race condition
      let userDoc = await UserMetadata.findOneAndUpdate(
        {
          uid: client.auth.uid,
          booster: { $gt: 0 }
        },
        {
          $inc: { booster: -1 }
        },
        { returnDocument: "after" }
      )

      if (!userDoc) return // No boosters available or user not found

      // Build update operations for all booster cards
      const updateOperations: any = {}
      const boosterContent = createBooster(userDoc)
      boosterContent.forEach((card) => {
        const index = PkmIndex[card.name]
        const existingItem = userDoc!.pokemonCollection.get(index)

        if (!existingItem) {
          if (`pokemonCollection.${index}` in updateOperations) {
            // If the item already exists in the update operations, we need to merge
            // the new emotions with the existing ones.
            const unlocked =
              updateOperations[`pokemonCollection.${index}`].unlocked
            CollectionUtils.unlockEmotion(unlocked, card.emotion, card.shiny)
          } else {
            // Create new collection item
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
          // Check if already unlocked
          const hasUnlocked = CollectionUtils.hasUnlocked(
            existingItem.unlocked,
            card.emotion,
            card.shiny
          )

          if (hasUnlocked) {
            // Add dust
            const dustGain = card.shiny ? DUST_PER_SHINY : DUST_PER_BOOSTER
            const shardIndex = PkmIndex[getBaseAltForm(card.name)]
            updateOperations.$inc = updateOperations.$inc || {}
            updateOperations.$inc[`pokemonCollection.${shardIndex}.dust`] =
              dustGain
          } else {
            // Add new emotion
            CollectionUtils.unlockEmotion(
              existingItem.unlocked,
              card.emotion,
              card.shiny
            )
            updateOperations[`pokemonCollection.${index}.unlocked`] =
              Buffer.copyBytesFrom(existingItem.unlocked, 0, 5)
          }
        }
      })

      // Perform atomic update
      await userDoc.updateOne(updateOperations)

      // Reload updated user
      userDoc = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!userDoc) {
        logger.error(
          `User document not found after opening booster: ${client.auth.uid}`
        )
        return
      }

      // resync, db-authoritative
      user.booster = userDoc.booster
      boosterContent.forEach((pkmWithCustom) => {
        const index = PkmIndex[pkmWithCustom.name]
        const pokemonCollectionItem = user.pokemonCollection.get(index)
        const mongoPokemonCollectionItem = userDoc.pokemonCollection.get(index)
        if (!mongoPokemonCollectionItem) {
          logger.error(`Missing mongo collection item after booster open`, {
            index,
            pkmWithCustom,
            clientUid: client.auth.uid
          })
          return
        }
        if (pokemonCollectionItem) {
          pokemonCollectionItem.dust = mongoPokemonCollectionItem.dust
          pokemonCollectionItem.unlocked = Buffer.copyBytesFrom(
            mongoPokemonCollectionItem.unlocked,
            0,
            5
          )
        } else {
          const newConfig: IPokemonCollectionItemMongo = {
            dust: mongoPokemonCollectionItem.dust,
            id: mongoPokemonCollectionItem.id,
            selectedEmotion: mongoPokemonCollectionItem.selectedEmotion,
            selectedShiny: mongoPokemonCollectionItem.selectedShiny,
            played: mongoPokemonCollectionItem.played,
            unlocked: Buffer.copyBytesFrom(
              mongoPokemonCollectionItem.unlocked,
              0,
              5
            )
          }
          user.pokemonCollection.set(index, newConfig)
        }
      })

      checkTitlesAfterEmotionUnlocked(userDoc, boosterContent)
      await userDoc.save()
      client.send(Transfer.BOOSTER_CONTENT, boosterContent)
      client.send(Transfer.USER_PROFILE, toUserMetadataJSON(userDoc))
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeNameCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string }
> {
  async execute({ client, name }: { client: Client; name: string }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (!user) return
      if (USERNAME_REGEXP.test(name)) {
        logger.info(`${client.auth.displayName} changed name to ${name}`)
        user.displayName = name
        const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
        if (mongoUser) {
          mongoUser.displayName = name
          await mongoUser.save()
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeTitleCommand extends Command<
  CustomLobbyRoom,
  { client: Client; title: Title | "" }
> {
  async execute({ client, title }: { client: Client; title: Title | "" }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (title !== "" && user?.titles.includes(title) === false) {
        throw new Error("User does not have this title unlocked")
      }
      if (user) {
        user.title = title
        const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
        if (mongoUser) {
          mongoUser.title = title
          await mongoUser.save()
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeSelectedEmotionCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string; emotion: Emotion | null; shiny: boolean }
> {
  async execute({
    client,
    emotion,
    index,
    shiny
  }: {
    client: Client
    index: string
    emotion: Emotion | null
    shiny: boolean
  }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (!user) return
      const pokemonCollectionItem = user.pokemonCollection.get(index)
      if (!pokemonCollectionItem) return
      if (
        emotion === pokemonCollectionItem.selectedEmotion &&
        shiny === pokemonCollectionItem.selectedShiny
      ) {
        return // No change needed
      }

      if (
        emotion === null ||
        CollectionUtils.hasUnlocked(
          pokemonCollectionItem.unlocked,
          emotion,
          shiny
        )
      ) {
        pokemonCollectionItem.selectedEmotion = emotion
        pokemonCollectionItem.selectedShiny = shiny
        await UserMetadata.findOneAndUpdate(
          { uid: client.auth.uid },
          {
            [`pokemonCollection.${index}.selectedEmotion`]: emotion,
            [`pokemonCollection.${index}.selectedShiny`]: shiny
          }
        )
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeAvatarCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string; emotion: Emotion; shiny: boolean }
> {
  async execute({
    client,
    index,
    emotion,
    shiny
  }: {
    client: Client
    index: string
    emotion: Emotion
    shiny: boolean
  }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!user) return
      if (!mongoUser) return
      const collectionItem = mongoUser.pokemonCollection.get(index)
      if (
        !collectionItem ||
        !CollectionUtils.hasUnlocked(collectionItem.unlocked, emotion, shiny)
      )
        return
      const portrait = getPortraitSrc(index, shiny, emotion)
        .replace("/assets/portraits/", "")
        .replace(".png", "")
      user.avatar = portrait
      mongoUser.avatar = portrait
      mongoUser.save()
    } catch (error) {
      logger.error(error)
    }
  }
}

export class BuyEmotionCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string; emotion: Emotion; shiny: boolean }
> {
  async execute({
    client,
    emotion,
    index,
    shiny
  }: {
    client: Client
    index: string
    emotion: Emotion
    shiny: boolean
  }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      const cost = getEmotionCost(emotion, shiny)
      if (!user || !PkmByIndex.hasOwnProperty(index)) return

      // If an alt form is bought, shards must be taken from the base form
      const shardIndex = PkmIndex[getBaseAltForm(PkmByIndex[index])]
      const pokemonCollectionItem = user.pokemonCollection.get(index)
      const shardCollectionItem = user.pokemonCollection.get(shardIndex)
      if (!pokemonCollectionItem || !shardCollectionItem) return

      // Check if emotion is already unlocked
      if (
        CollectionUtils.hasUnlocked(
          pokemonCollectionItem.unlocked,
          emotion,
          shiny
        )
      ) {
        return // Already unlocked
      }

      // Update MongoDB with optimized format
      const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!mongoUser) return

      const mongoItem = mongoUser.pokemonCollection.get(index)
      const mongoShardItem = mongoUser.pokemonCollection.get(shardIndex)
      if (!mongoItem || !mongoShardItem) return

      if (mongoShardItem.dust < cost) return

      // Add the emotion using optimized storage
      CollectionUtils.unlockEmotion(mongoItem.unlocked, emotion, shiny)
      mongoItem.selectedEmotion = emotion
      mongoItem.selectedShiny = shiny
      mongoUser.markModified(`pokemonCollection.${index}`) // mongoose does not track changes to Buffers automatically

      // Deduct cost
      mongoShardItem.dust -= cost

      // Update in-memory user data
      CollectionUtils.unlockEmotion(
        pokemonCollectionItem.unlocked,
        emotion,
        shiny
      )
      shardCollectionItem.dust = mongoShardItem.dust
      pokemonCollectionItem.selectedEmotion = emotion
      pokemonCollectionItem.selectedShiny = shiny

      checkTitlesAfterEmotionUnlocked(mongoUser, [
        { name: PkmByIndex[index], emotion, shiny }
      ])
      await mongoUser.save()
      client.send(Transfer.USER_PROFILE, toUserMetadataJSON(mongoUser))
    } catch (error) {
      logger.error(error)
    }
  }
}

async function checkTitlesAfterEmotionUnlocked(
  mongoUser: IUserMetadataMongo,
  unlocked: PkmWithCustom[]
) {
  const newTitles: Title[] = []
  if (!mongoUser.titles.includes(Title.SHINY_SEEKER)) {
    // update titles
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
    mongoUser.titles.push(...newTitles) // NOTE: document needs to be saved after those modifications
  }
}

export class BuyBoosterCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string }
> {
  async execute({ client, index }: { client: Client; index: string }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (!user) return

      const pkm = PkmByIndex[index]
      if (!pkm) return

      const rarity = getPokemonData(pkm).rarity
      const boosterCost = BoosterPriceByRarity[rarity]

      const shardIndex = PkmIndex[getBaseAltForm(pkm)]

      const mongoUser = await UserMetadata.findOneAndUpdate(
        {
          uid: client.auth.uid,
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
      if (!mongoUser) return

      const pokemonCollectionItem = user.pokemonCollection.get(shardIndex)
      if (!pokemonCollectionItem) return

      const mongoPokemonCollectionItem =
        mongoUser.pokemonCollection.get(shardIndex)
      if (!mongoPokemonCollectionItem) return

      user.booster = mongoUser.booster
      pokemonCollectionItem.dust = mongoPokemonCollectionItem.dust // resync shards to database value, db authoritative
      client.send(Transfer.USER_PROFILE, toUserMetadataJSON(mongoUser))
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnSearchByIdCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string }
> {
  async execute({ client, uid }: { client: Client; uid: string }) {
    try {
      const user = await UserMetadata.findOne({ uid: uid })
      if (user) {
        client.send(Transfer.USER, user)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class BanUserCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; reason: string }
> {
  async execute({
    client,
    uid,
    reason
  }: {
    client: Client
    uid: string
    reason: string
  }) {
    try {
      const bannedUser = await UserMetadata.findOne({ uid })
      const user = this.room.users.get(client.auth.uid)
      if (
        user &&
        bannedUser &&
        (user.role === Role.ADMIN || user.role === Role.MODERATOR) &&
        bannedUser.role !== Role.ADMIN
      ) {
        const res = await UserMetadata.updateOne({ uid }, { banned: true })
        this.state.removeMessages(uid)
        if (res.modifiedCount > 0) {
          client.send(
            Transfer.ALERT,
            `${user.displayName} banned the user ${bannedUser.displayName}`
          )

          discordService.announceBan(user, bannedUser, reason)
          bannedUser.banned = true
          client.send(Transfer.USER, bannedUser)
        } else {
          client.send(
            Transfer.ALERT,
            `${bannedUser.displayName} was already banned`
          )
        }
        this.room.clients.forEach((c) => {
          if (c.auth.uid === uid) {
            c.leave(CloseCodes.USER_BANNED)
          }
        })
      } else if (!bannedUser) {
        client.send(Transfer.ALERT, `No user found with ID ${uid}`)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class UnbanUserCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; reason: string }
> {
  async execute({
    client,
    uid,
    reason
  }: {
    client: Client
    uid: string
    reason: string
  }) {
    try {
      const unbannedUser = await UserMetadata.findOne({ uid })
      const user = this.room.users.get(client.auth.uid)
      if (
        unbannedUser &&
        user &&
        (user.role === Role.ADMIN || user.role === Role.MODERATOR)
      ) {
        const res = await UserMetadata.updateOne({ uid }, { banned: false })
        if (res.modifiedCount > 0) {
          client.send(
            Transfer.ALERT,
            `${user.displayName} unbanned the user ${unbannedUser?.displayName} (User ID: ${uid})`
          )
          discordService.announceUnban(user, unbannedUser, reason)
          unbannedUser.banned = false
          client.send(Transfer.USER, unbannedUser)
        } else {
          client.send(
            Transfer.ALERT,
            `${unbannedUser.displayName} was not banned`
          )
        }
      } else if (!unbannedUser) {
        client.send(Transfer.ALERT, `No user found with ID ${uid}`)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class SelectLanguageCommand extends Command<
  CustomLobbyRoom,
  { client: Client; message: Language }
> {
  async execute({ client, message }: { client: Client; message: Language }) {
    try {
      const u = this.room.users.get(client.auth.uid)
      if (client.auth.uid && u) {
        const user = await UserMetadata.findOne({ uid: client.auth.uid })
        if (user) {
          user.language = message
          await user.save()
        }
        u.language = message
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class JoinOrOpenRoomCommand extends Command<
  CustomLobbyRoom,
  { client: Client; gameMode: GameMode }
> {
  async execute({ client, gameMode }: { client: Client; gameMode: GameMode }) {
    const user = this.room.users.get(client.auth.uid)
    if (!user) return

    switch (gameMode) {
      case GameMode.CUSTOM_LOBBY:
        return [new OpenGameCommand().setPayload({ gameMode, client })]

      case GameMode.CLASSIC: {
        const existingClassicLobby = this.room.rooms?.find(
          (room) =>
            room.name === "preparation" &&
            room.metadata?.gameMode === GameMode.CLASSIC &&
            room.clients < MAX_PLAYERS_PER_GAME
        )
        if (existingClassicLobby) {
          client.send(Transfer.REQUEST_ROOM, existingClassicLobby.roomId)
        } else {
          return [new OpenGameCommand().setPayload({ gameMode, client })]
        }
        break
      }

      case GameMode.RANKED: {
        const userRank = getRank(user.elo)
        let minRank = EloRank.LEVEL_BALL
        let maxRank = EloRank.BEAST_BALL
        switch (userRank) {
          case EloRank.LEVEL_BALL:
          case EloRank.NET_BALL:
            // 0- 1099
            minRank = EloRank.LEVEL_BALL
            maxRank = EloRank.NET_BALL
            break
          case EloRank.SAFARI_BALL:
          case EloRank.LOVE_BALL:
            // 1050-1200
            minRank = EloRank.NET_BALL
            maxRank = EloRank.LOVE_BALL
            break
          case EloRank.PREMIER_BALL:
          case EloRank.QUICK_BALL:
            // 1150-1299
            minRank = EloRank.LOVE_BALL
            maxRank = EloRank.QUICK_BALL
            break
          case EloRank.POKE_BALL:
          case EloRank.SUPER_BALL:
          case EloRank.ULTRA_BALL:
          case EloRank.MASTER_BALL:
          case EloRank.BEAST_BALL:
            // 1250+
            minRank = EloRank.QUICK_BALL
            maxRank = EloRank.BEAST_BALL
            break
        }
        const existingRanked = this.room.rooms?.find((room) => {
          const { minRank, maxRank, gameMode } = room.metadata ?? {}
          const minElo = minRank ? EloRankThreshold[minRank] : 0
          const maxRankThreshold = maxRank
            ? EloRankThreshold[maxRank]
            : Infinity
          return (
            room.name === "preparation" &&
            gameMode === GameMode.RANKED &&
            user.elo >= minElo &&
            (user.elo <= maxRankThreshold || userRank === maxRank) &&
            room.clients < MAX_PLAYERS_PER_GAME
          )
        })
        if (existingRanked) {
          client.send(Transfer.REQUEST_ROOM, existingRanked.roomId)
        } else {
          return [
            new OpenGameCommand().setPayload({
              gameMode,
              client,
              minRank,
              maxRank
            })
          ]
        }
        break
      }

      case GameMode.SCRIBBLE: {
        const existingScribble = this.room.rooms?.find(
          (room) =>
            room.name === "preparation" &&
            room.metadata?.gameMode === GameMode.SCRIBBLE &&
            room.clients < MAX_PLAYERS_PER_GAME
        )
        if (existingScribble) {
          client.send(Transfer.REQUEST_ROOM, existingScribble.roomId)
        } else {
          return [new OpenGameCommand().setPayload({ gameMode, client })]
        }
        break
      }
    }
  }
}

export class OpenGameCommand extends Command<
  CustomLobbyRoom,
  {
    gameMode: GameMode
    client: Client
    minRank?: EloRank
    maxRank?: EloRank
  }
> {
  async execute({
    gameMode,
    client,
    minRank,
    maxRank
  }: {
    gameMode: GameMode
    client: Client
    minRank?: EloRank
    maxRank?: EloRank
  }) {
    const user = this.room.users.get(client.auth.uid)
    if (!user) return
    let roomName = `${user.displayName}'${user.displayName.endsWith("s") ? "" : "s"} room`
    let noElo: boolean = true
    let password: string | null = null
    let ownerId: string | null = null

    if (gameMode === GameMode.RANKED) {
      roomName = "Ranked Match"
      noElo = false
    } else if (gameMode === GameMode.SCRIBBLE) {
      roomName = "Smeargle's Scribble"
    } else if (gameMode === GameMode.CUSTOM_LOBBY) {
      ownerId = user.uid
      password = Math.random().toString(36).substring(2, 6).toUpperCase()
    } else if (gameMode === GameMode.CLASSIC) {
      roomName = "Classic"
    }

    const newRoom = await matchMaker.createRoom("preparation", {
      gameMode,
      minRank,
      maxRank,
      noElo,
      password,
      ownerId,
      roomName
    })
    client.send(Transfer.REQUEST_ROOM, newRoom.roomId)
  }
}

export class DeleteRoomCommand extends Command<
  CustomLobbyRoom,
  {
    client: Client
    roomId?: string
    tournamentId?: string
    bracketId?: string
  }
> {
  async execute({ client, roomId, tournamentId, bracketId }) {
    try {
      if (client) {
        const user = this.room.users.get(client.auth.uid)
        if (!user || !user.role || user.role !== Role.ADMIN) {
          return
        }
      }

      const roomsIdToDelete: string[] = []
      if (roomId) {
        roomsIdToDelete.push(roomId)
      } else if (tournamentId) {
        const tournament = this.state.tournaments.find(
          (t) => t.id === tournamentId
        )
        if (!tournament)
          return logger.error(
            `DeleteRoomCommand ; Tournament not found: ${tournamentId}`
          )

        const allRooms = await matchMaker.query({})
        roomsIdToDelete.push(
          ...allRooms
            .filter(
              (result) =>
                result.metadata?.tournamentId === tournamentId &&
                (bracketId === "all" ||
                  result.metadata?.bracketId === bracketId)
            )
            .map((result) => result.roomId)
        )
      }

      if (roomsIdToDelete.length === 0) {
        return logger.error(
          `DeleteRoomCommand ; room not found with query: roomId: ${roomId} tournamentId: ${tournamentId} bracketId: ${bracketId}`
        )
      }

      roomsIdToDelete.forEach((roomIdToDelete) => {
        this.room.presence.publish("room-deleted", roomIdToDelete)
      })
    } catch (error) {
      logger.error(`DeleteRoomCommand error:`, error)
    }
  }
}
