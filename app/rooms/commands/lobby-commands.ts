import { Command } from "@colyseus/command"
import { ArraySchema } from "@colyseus/schema"
import { Client, RoomListingData, matchMaker } from "colyseus"
import { EmbedBuilder } from "discord.js"
import { nanoid } from "nanoid"
import {
  getRemainingPlayers,
  getTournamentStage,
  makeBrackets
} from "../../core/tournament-logic"
import { GameRecord } from "../../models/colyseus-models/game-record"
import LobbyUser from "../../models/colyseus-models/lobby-user"
import PokemonConfig from "../../models/colyseus-models/pokemon-config"
import {
  TournamentBracketSchema,
  TournamentPlayerSchema
} from "../../models/colyseus-models/tournament"
import BannedUser from "../../models/mongo-models/banned-user"
import { BotV2, IBot } from "../../models/mongo-models/bot-v2"
import DetailledStatistic from "../../models/mongo-models/detailled-statistic-v2"
import { Tournament } from "../../models/mongo-models/tournament"
import UserMetadata, {
  IPokemonConfig
} from "../../models/mongo-models/user-metadata"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../models/precomputed/precomputed-emotions"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../models/precomputed/precomputed-rarity"
import { getAvatarSrc, getPortraitSrc } from "../../public/src/utils"
import {
  CDN_PORTRAIT_URL,
  Emotion,
  IPlayer,
  ISuggestionUser,
  PkmWithConfig,
  Role,
  Title,
  Transfer,
  USERNAME_REGEXP
} from "../../types"
import {
  BoosterRarityProbability,
  DUST_PER_BOOSTER,
  DUST_PER_SHINY,
  getEmotionCost
} from "../../types/Config"
import { EloRank } from "../../types/enum/EloRank"
import { GameMode, Rarity } from "../../types/enum/Game"
import { Language } from "../../types/enum/Language"
import { Pkm, PkmIndex, Unowns } from "../../types/enum/Pokemon"
import { ITournamentPlayer } from "../../types/interfaces/Tournament"
import { sum } from "../../utils/array"
import { logger } from "../../utils/logger"
import { cleanProfanity } from "../../utils/profanity-filter"
import { chance, pickRandomIn } from "../../utils/random"
import { convertSchemaToRawObject, values } from "../../utils/schemas"
import CustomLobbyRoom from "../custom-lobby-room"

export class OnJoinCommand extends Command<
  CustomLobbyRoom,
  {
    client: Client
    options: any
    auth: any
    rooms: RoomListingData<any>[] | undefined
  }
> {
  async execute({
    client,
    rooms = []
  }: {
    client: Client
    options: any
    auth: any
    rooms: RoomListingData<any>[] | undefined
  }) {
    try {
      //logger.info(`${client.auth.displayName} ${client.id} join lobby room`)
      client.send(Transfer.ROOMS, rooms)
      const user = await UserMetadata.findOne({ uid: client.auth.uid })

      if (user) {
        // load existing account
        const stats = await DetailledStatistic.find(
          { playerId: client.auth.uid },
          ["pokemons", "time", "rank", "elo"],
          { limit: 10, sort: { time: -1 } }
        )
        if (stats) {
          const records = new ArraySchema<GameRecord>()
          stats.forEach((record) => {
            records.push(
              new GameRecord(
                record.time,
                record.rank,
                record.elo,
                record.pokemons
              )
            )
          })

          this.state.users.set(
            client.auth.uid,
            new LobbyUser(
              user.uid,
              user.displayName,
              user.elo,
              user.avatar,
              user.wins,
              user.exp,
              user.level,
              user.donor,
              records,
              user.honors,
              user.uid === client.auth.uid ? user.pokemonCollection : null,
              user.booster,
              user.titles,
              user.title,
              user.role,
              client.auth.email === undefined &&
                client.auth.photoURL === undefined,
              client.auth.metadata.creationTime,
              client.auth.metadata.lastSignInTime,
              user.language
            )
          )
        }
      } else {
        // create new user account
        const numberOfBoosters = 3
        UserMetadata.create({
          uid: client.auth.uid,
          displayName: client.auth.displayName,
          booster: numberOfBoosters,
          pokemonCollection: new Map<string, IPokemonConfig>()
        })
        this.state.users.set(
          client.auth.uid,
          new LobbyUser(
            client.auth.uid,
            client.auth.displayName,
            1000,
            "0019/Normal",
            0,
            0,
            0,
            false,
            [],
            [],
            new Map<string, IPokemonConfig>(),
            numberOfBoosters,
            [],
            "",
            Role.BASIC,
            client.auth.email === undefined &&
              client.auth.photoURL === undefined,
            client.auth.metadata.creationTime,
            client.auth.metadata.lastSignInTime,
            ""
          )
        )
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
        this.state.users.delete(client.auth.uid)
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
      const u = this.state.users.get(client.auth.uid)
      const targetUser = this.state.users.get(uid)

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
      const u = this.state.users.get(client.auth.uid)
      const targetUser = this.state.users.get(uid)

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
      const u = this.state.users.get(client.auth.uid)
      const targetUser = this.state.users.get(uid)
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

      const user = this.state.users.get(client.auth.uid)
      if (user && !user.anonymous && message != "") {
        this.state.addMessage(message, user.id, user.name, user.avatar)
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
      const user = this.state.users.get(client.auth.uid)
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
      const user = this.state.users.get(client.auth.uid)
      if (!user) return

      const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!mongoUser || mongoUser.booster <= 0) return

      const NB_PER_BOOSTER = 10

      mongoUser.booster -= 1
      const boosterContent: PkmWithConfig[] = []

      for (let i = 0; i < NB_PER_BOOSTER; i++) {
        const guaranteedUnique = i === NB_PER_BOOSTER - 1
        boosterContent.push(pickRandomPokemonBooster(guaranteedUnique))
      }

      boosterContent.forEach((pkmWithConfig) => {
        const index = PkmIndex[pkmWithConfig.name]
        const mongoPokemonConfig = mongoUser.pokemonCollection.get(index)
        const dustGain = pkmWithConfig.shiny ? DUST_PER_SHINY : DUST_PER_BOOSTER

        if (mongoPokemonConfig) {
          mongoPokemonConfig.dust += dustGain
        } else {
          mongoUser.pokemonCollection.set(index, {
            id: index,
            emotions: [],
            shinyEmotions: [],
            dust: dustGain,
            selectedEmotion: Emotion.NORMAL,
            selectedShiny: false
          })
        }
      })

      mongoUser.save()

      // resync, db-authoritative
      user.booster = mongoUser.booster
      boosterContent.forEach((pkmWithConfig) => {
        const index = PkmIndex[pkmWithConfig.name]
        const pokemonConfig = user.pokemonCollection.get(index)
        const mongoPokemonConfig = mongoUser.pokemonCollection.get(index)
        if (!mongoPokemonConfig) return
        if (pokemonConfig) {
          pokemonConfig.dust = mongoPokemonConfig.dust
        } else {
          const newConfig = new PokemonConfig(index)
          newConfig.dust = mongoPokemonConfig.dust
          user.pokemonCollection.set(index, newConfig)
        }
      })

      client.send(Transfer.BOOSTER_CONTENT, boosterContent)
    } catch (error) {
      logger.error(error)
    }
  }
}

function pickRandomPokemonBooster(guarantedUnique: boolean): PkmWithConfig {
  let pkm = Pkm.MAGIKARP,
    emotion = Emotion.NORMAL
  const shiny = chance(0.03)
  const rarities = Object.keys(Rarity) as Rarity[]
  const seed = Math.random() * sum(Object.values(BoosterRarityProbability))
  let threshold = 0

  if (guarantedUnique) {
    pkm = pickRandomIn([
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
        ).filter((p) => Unowns.includes(p) === false)
        if (candidates.length > 0) {
          pkm = pickRandomIn(candidates) as Pkm
          break
        }
      }
    }
  }

  const availableEmotions = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[PkmIndex[pkm]]?.[i] === 1
  )
  emotion = pickRandomIn(availableEmotions)

  return { name: pkm, shiny, emotion }
}

export class ChangeNameCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string }
> {
  async execute({ client, name }: { client: Client; name: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      if (USERNAME_REGEXP.test(name)) {
        user.name = name
        const usr = await UserMetadata.findOne({ uid: client.auth.uid })
        if (usr) {
          usr.displayName = name
          usr.save()
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
      const user = this.state.users.get(client.auth.uid)
      if (user) {
        if (user.title === title) {
          title = "" // remove title if user already has it
        }
        user.title = title
        const usr = await UserMetadata.findOne({ uid: client.auth.uid })
        if (usr) {
          usr.title = title
          usr.save()
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeSelectedEmotionCommand extends Command<
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
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const pokemonConfig = user.pokemonCollection.get(index)
      if (pokemonConfig) {
        const emotionsToCheck = shiny
          ? pokemonConfig.shinyEmotions
          : pokemonConfig.emotions
        if (
          emotionsToCheck.includes(emotion) &&
          (emotion != pokemonConfig.selectedEmotion ||
            shiny != pokemonConfig.selectedShiny)
        ) {
          pokemonConfig.selectedEmotion = emotion
          pokemonConfig.selectedShiny = shiny
          const u = await UserMetadata.findOne({ uid: client.auth.uid })
          const pkmConfig = u?.pokemonCollection.get(index)
          if (u && pkmConfig) {
            pkmConfig.selectedEmotion = emotion
            pkmConfig.selectedShiny = shiny
            u.save()
          }
        }
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
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const config = user.pokemonCollection.get(index)
      if (config) {
        const emotionsToCheck = shiny ? config.shinyEmotions : config.emotions
        if (emotionsToCheck.includes(emotion)) {
          const portrait = getPortraitSrc(index, shiny, emotion)
            .replace(CDN_PORTRAIT_URL, "")
            .replace(".png", "")
          user.avatar = portrait
          const u = await UserMetadata.findOne({ uid: client.auth.uid })
          if (u) {
            u.avatar = portrait
            u.save()
          }
        }
      }
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
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const pokemonConfig = user.pokemonCollection.get(index)
      if (!pokemonConfig) return

      const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!mongoUser) return

      const mongoPokemonConfig = mongoUser.pokemonCollection.get(index)
      if (!mongoPokemonConfig) return

      const cost = getEmotionCost(emotion, shiny)
      const emotions = shiny
        ? mongoPokemonConfig.shinyEmotions
        : mongoPokemonConfig.emotions

      if (emotions.includes(emotion) || mongoPokemonConfig.dust < cost) return // already bought or can't afford

      emotions.push(emotion)
      mongoPokemonConfig.dust -= cost
      mongoPokemonConfig.selectedEmotion = emotion
      mongoPokemonConfig.selectedShiny = shiny

      pokemonConfig.dust = mongoPokemonConfig.dust // resync shards to database value, db authoritative
      pokemonConfig.selectedEmotion = emotion
      pokemonConfig.selectedShiny = shiny

      if (shiny) {
        pokemonConfig.shinyEmotions.push(emotion)
      } else {
        pokemonConfig.emotions.push(emotion)
      }

      if (!mongoUser.titles.includes(Title.SHINY_SEEKER)) {
        // update titles
        let numberOfShinies = 0
        mongoUser.pokemonCollection.forEach((c) => {
          numberOfShinies += c.shinyEmotions.length
        })
        if (numberOfShinies >= 30) {
          mongoUser.titles.push(Title.SHINY_SEEKER)
        }
      }

      if (
        !mongoUser.titles.includes(Title.DUKE) &&
        mongoUser.pokemonCollection.size >= 30
      ) {
        mongoUser.titles.push(Title.DUKE)
      }
      if (
        emotion === Emotion.ANGRY &&
        index === PkmIndex[Pkm.ARBOK] &&
        !mongoUser.titles.includes(Title.DENTIST)
      ) {
        mongoUser.titles.push(Title.DENTIST)
      }

      if (
        !mongoUser.titles.includes(Title.ARCHEOLOGIST) &&
        Unowns.some((unown) => index === PkmIndex[unown]) &&
        Unowns.every((name) => {
          const index = PkmIndex[name]
          const collection = mongoUser.pokemonCollection.get(index)
          const isUnlocked =
            collection &&
            (collection.emotions.length > 0 ||
              collection.shinyEmotions.length > 0)
          return isUnlocked || index === index
        })
      ) {
        mongoUser.titles.push(Title.ARCHEOLOGIST)
      }

      if (
        !mongoUser.titles.includes(Title.DUCHESS) &&
        mongoPokemonConfig.shinyEmotions.length >=
          Object.keys(Emotion).length &&
        mongoPokemonConfig.emotions.length >= Object.keys(Emotion).length
      ) {
        mongoUser.titles.push(Title.DUCHESS)
      }

      mongoUser.save()
    } catch (error) {
      logger.error(error)
    }
  }
}

export class BuyBoosterCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string }
> {
  async execute({ client, index }: { client: Client; index: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const pokemonConfig = user.pokemonCollection.get(index)
      if (!pokemonConfig) return

      const BOOSTER_COST = 500
      const mongoUser = await UserMetadata.findOne({ uid: client.auth.uid })
      const mongoPokemonConfig = mongoUser?.pokemonCollection.get(index)
      if (
        mongoUser &&
        mongoPokemonConfig &&
        mongoPokemonConfig.dust >= BOOSTER_COST
      ) {
        mongoPokemonConfig.dust -= BOOSTER_COST
        pokemonConfig.dust = mongoPokemonConfig.dust // resync shards to database value, db authoritative
        mongoUser.booster += 1
        user.booster = mongoUser.booster
        mongoUser.save()
      }
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
        const statistic = await DetailledStatistic.find(
          { playerId: user.uid },
          ["pokemons", "time", "rank", "elo"],
          { limit: 10, sort: { time: -1 } }
        )
        if (statistic) {
          client.send(
            Transfer.USER,
            new LobbyUser(
              user.uid,
              user.displayName,
              user.elo,
              user.avatar,
              user.wins,
              user.exp,
              user.level,
              user.donor,
              statistic.map((r) => {
                return new GameRecord(r.time, r.rank, r.elo, r.pokemons)
              }),
              user.honors,
              user.pokemonCollection,
              user.booster,
              user.titles,
              user.title,
              user.role,
              false,
              client.auth.metadata.creationTime,
              client.auth.metadata.lastSignInTime,
              user.language
            )
          )
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnSearchCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string }
> {
  async execute({ client, name }: { client: Client; name: string }) {
    try {
      const regExp = new RegExp("^" + name)
      const users = await UserMetadata.find(
        { displayName: { $regex: regExp, $options: "i" } },
        ["uid", "elo", "displayName", "level", "avatar"],
        { limit: 100, sort: { level: -1 } }
      )
      if (users) {
        const suggestions: Array<ISuggestionUser> = users.map((u) => {
          return {
            id: u.uid,
            elo: u.elo,
            name: u.displayName,
            level: u.level,
            avatar: u.avatar
          }
        })
        client.send(Transfer.SUGGESTIONS, suggestions)
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
      const potentialBannedUser = await UserMetadata.findOne({ uid: uid })
      const user = this.state.users.get(client.auth.uid)
      if (
        user &&
        potentialBannedUser &&
        (user.role === Role.ADMIN || user.role === Role.MODERATOR) &&
        potentialBannedUser.role !== Role.ADMIN
      ) {
        this.state.removeMessages(uid)
        const banned = await BannedUser.findOne({ uid })
        if (!banned) {
          BannedUser.create({
            uid,
            author: user.name,
            time: Date.now(),
            name: potentialBannedUser.displayName
          })
          client.send(
            Transfer.BANNED,
            `${user.name} banned the user ${potentialBannedUser.displayName}`
          )

          const dsEmbed = new EmbedBuilder()
            .setTitle(
              `${user.name} banned the user ${potentialBannedUser.displayName}`
            )
            .setAuthor({
              name: user.name,
              iconURL: getAvatarSrc(user.avatar)
            })
            .setDescription(
              `${user.name} banned the user ${potentialBannedUser.displayName}. Reason: ${reason}`
            )
            .setThumbnail(getAvatarSrc(potentialBannedUser.avatar))
          try {
            this.room.discordBanWebhook?.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            logger.error(error)
          }
        } else {
          client.send(
            Transfer.BANNED,
            `${potentialBannedUser.displayName} was already banned`
          )
        }
        this.room.clients.forEach((c) => {
          if (c.auth.uid === uid) {
            c.send(Transfer.BAN)
            c.leave()
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class UnbanUserCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; name: string }
> {
  async execute({
    client,
    uid,
    name
  }: {
    client: Client
    uid: string
    name: string
  }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (user && (user.role === Role.ADMIN || user.role === Role.MODERATOR)) {
        const res = await BannedUser.deleteOne({ uid })
        if (res.deletedCount > 0) {
          client.send(Transfer.BANNED, `${user.name} unbanned the user ${name}`)
          const dsEmbed = new EmbedBuilder()
            .setTitle(`${user.name} unbanned the user ${name}`)
            .setAuthor({
              name: user.name,
              iconURL: getAvatarSrc(user.avatar)
            })
            .setDescription(`${user.name} unbanned the user ${name}`)
            .setThumbnail(getAvatarSrc(user.avatar))
          try {
            this.room.discordBanWebhook?.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            logger.error(error)
          }
        }
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
      const u = this.state.users.get(client.auth.uid)
      if (client.auth.uid && u) {
        const user = await UserMetadata.findOne({ uid: client.auth.uid })
        if (user) {
          user.language = message
          user.save()
        }
        u.language = message
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class AddBotCommand extends Command<
  CustomLobbyRoom,
  { client: Client; message: any }
> {
  async execute({ client, message }: { client: Client; message: any }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (
        user &&
        (user.role === Role.ADMIN ||
          user.role === Role.BOT_MANAGER ||
          user.role === Role.MODERATOR)
      ) {
        const id = message.slice(21)
        client.send(Transfer.BOT_DATABASE_LOG, `retrieving id : ${id} ...`)
        client.send(Transfer.BOT_DATABASE_LOG, "retrieving data ...")
        const data = await this.room.pastebin?.getPaste(id, false)
        if (data) {
          client.send(Transfer.BOT_DATABASE_LOG, "parsing JSON data ...")
          const json = JSON.parse(data)
          const resultDelete = await BotV2.deleteMany({
            avatar: json.avatar,
            author: json.author
          })
          const keys = new Array<string>()
          this.room.bots.forEach((b) => {
            if (b.avatar === json.avatar && b.author === json.author) {
              keys.push(b.id)
            }
          })
          keys.forEach((k) => {
            this.room.bots.delete(k)
          })
          client.send(
            Transfer.BOT_DATABASE_LOG,
            JSON.stringify(resultDelete, null, 2)
          )
          client.send(
            Transfer.BOT_DATABASE_LOG,
            `creating Bot ${json.avatar} by ${json.author}...`
          )
          const resultCreate = await BotV2.create({
            name: json.name,
            avatar: json.avatar,
            elo: json.elo ? json.elo : 1200,
            author: json.author,
            steps: json.steps,
            id: nanoid()
          })

          const dsEmbed = new EmbedBuilder()
            .setTitle(
              `BOT ${json.name} by @${json.author} loaded by ${user.name}`
            )
            .setURL(message as string)
            .setAuthor({
              name: user.name,
              iconURL: getAvatarSrc(user.avatar)
            })
            .setDescription(
              `BOT ${json.name} by @${json.author} (url: ${message} ) loaded by ${user.name}`
            )
            .setThumbnail(getAvatarSrc(json.avatar))
          try {
            this.room.discordWebhook?.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            logger.error(error)
          }

          this.room.bots.set(resultCreate.id, resultCreate)
          this.room.broadcast(
            Transfer.REQUEST_BOT_LIST,
            createBotList(this.room.bots, { withSteps: true })
          )
        } else {
          client.send(
            Transfer.BOT_DATABASE_LOG,
            `no pastebin found with given url ${message}`
          )
        }
      }
    } catch (error) {
      logger.error(error)
      client.send(Transfer.BOT_DATABASE_LOG, JSON.stringify(error))
    }
  }
}

export class DeleteBotCommand extends Command<
  CustomLobbyRoom,
  { client: Client; message: string }
> {
  async execute({ client, message }: { client: Client; message: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (
        user &&
        (user.role === Role.ADMIN ||
          user.role === Role.BOT_MANAGER ||
          user.role === Role.MODERATOR)
      ) {
        const id = message
        const botData = this.room.bots.get(id)
        client.send(
          Transfer.BOT_DATABASE_LOG,
          `deleting bot ${botData?.name}by @${botData?.author} id ${id}`
        )
        const resultDelete = await BotV2.deleteOne({ id: id })
        client.send(
          Transfer.BOT_DATABASE_LOG,
          JSON.stringify(resultDelete, null, 2)
        )
        const dsEmbed = new EmbedBuilder()
          .setTitle(
            `BOT ${botData?.name} by @${botData?.author} deleted by ${user.name}`
          )
          .setAuthor({
            name: user.name,
            iconURL: getAvatarSrc(user.avatar)
          })
          .setDescription(
            `BOT ${botData?.name} by @${botData?.author} (id: ${message} ) deleted by ${user.name}`
          )
          .setThumbnail(getAvatarSrc(botData?.avatar ? botData?.avatar : ""))
        try {
          this.room.discordWebhook?.send({
            embeds: [dsEmbed]
          })
        } catch (error) {
          logger.error(error)
        }

        this.room.bots.delete(id)
        this.room.broadcast(
          Transfer.REQUEST_BOT_LIST,
          createBotList(this.room.bots, { withSteps: true })
        )
      }
    } catch (error) {
      logger.error(error)
      client.send(Transfer.BOT_DATABASE_LOG, JSON.stringify(error))
    }
  }
}

export function createBotList(
  bots: Map<string, IBot>,
  options: { withSteps: boolean } = { withSteps: true }
): Partial<IBot>[] {
  return [...bots.values()].map((bot) => ({
    name: bot.name,
    avatar: bot.avatar,
    id: bot.id,
    author: bot.author,
    elo: bot.elo,
    ...(options.withSteps ? { steps: bot.steps } : {})
  }))
}

export class OnBotUploadCommand extends Command<
  CustomLobbyRoom,
  { client: Client; bot: IBot }
> {
  execute({ client, bot }: { client: Client; bot: IBot }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      this.room.pastebin
        ?.createPaste({
          text: JSON.stringify(bot),
          title: `${user.name} has uploaded BOT ${bot.name}`,
          format: "json"
        })
        .then((data: unknown) => {
          const dsEmbed = new EmbedBuilder()
            .setTitle(`BOT ${bot.name} created by ${bot.author}`)
            .setURL(data as string)
            .setAuthor({
              name: user.name,
              iconURL: getAvatarSrc(user.avatar)
            })
            .setDescription(
              `A new bot has been created by ${user.name}, You can import the data in the Pokemon Auto Chess Bot Builder (url: ${data} ).`
            )
            .setThumbnail(getAvatarSrc(bot.avatar))
          client.send(Transfer.PASTEBIN_URL, { url: data as string })
          try {
            this.room.discordWebhook?.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            logger.error(error)
          }
        })
        .catch((error) => {
          logger.error(error)
        })
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OpenSpecialGameCommand extends Command<
  CustomLobbyRoom,
  { gameMode: GameMode; minRank?: EloRank | null; noElo?: boolean }
> {
  execute({
    gameMode,
    minRank,
    noElo
  }: {
    gameMode: GameMode
    minRank?: EloRank | null
    noElo?: boolean
  }) {
    logger.info(`Creating special game ${gameMode} ${minRank ?? ""}`)
    let roomName = "Special game"
    if (gameMode === GameMode.RANKED) {
      if (minRank === EloRank.GREATBALL) {
        roomName = `Great Ball Ranked Match`
      } else if (minRank === EloRank.ULTRABALL) {
        roomName = `Ultra Ball Ranked Match`
      } else {
        roomName = `Ranked Match`
      }
    } else if (gameMode === GameMode.SCRIBBLE) {
      roomName = "Smeargle's Scribble"
    }

    matchMaker.createRoom("preparation", {
      gameMode,
      minRank,
      noElo,
      ownerId: null,
      roomName,
      autoStartDelayInSeconds: 15 * 60
    })

    this.state.getNextSpecialGame()
  }
}

export class MakeServerAnnouncementCommand extends Command<
  CustomLobbyRoom,
  { client: Client; message: string }
> {
  async execute({ client, message }: { client: Client; message: string }) {
    try {
      const u = this.state.users.get(client.auth.uid)
      if (u && u.role && u.role === Role.ADMIN) {
        this.room.presence.publish("server-announcement", message)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnCreateTournamentCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string; startDate: string }
> {
  async execute({
    client,
    name,
    startDate
  }: {
    client: Client
    name: string
    startDate: string
  }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (user && user.role && user.role === Role.ADMIN) {
        await this.state.createTournament(name, startDate)
        await this.room.fetchTournaments()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class RemoveTournamentCommand extends Command<
  CustomLobbyRoom,
  { client: Client; tournamentId: string }
> {
  execute({ client, tournamentId }: { client: Client; tournamentId: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (user && user.role && user.role === Role.ADMIN) {
        this.state.removeTournament(tournamentId)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ParticipateInTournamentCommand extends Command<
  CustomLobbyRoom,
  { client: Client; tournamentId: string; participate: boolean }
> {
  async execute({
    client,
    tournamentId,
    participate
  }: {
    client: Client
    tournamentId: string
    participate: boolean
  }) {
    try {
      if (!client.auth.uid || this.state.users.has(client.auth.uid) === false)
        return
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )

      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const user = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!user) return

      if (participate) {
        //logger.debug(`${user.uid} participates in tournament ${tournamentId}`)
        const tournamentPlayer = new TournamentPlayerSchema(
          user.displayName,
          user.avatar,
          user.elo
        )

        tournament.players.set(user.uid, tournamentPlayer)
      } else if (tournament.players.has(user.uid)) {
        /*logger.debug(
          `${user.uid} no longer participates in tournament ${tournamentId}`
        )*/
        tournament.players.delete(user.uid)
      }

      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.players = convertSchemaToRawObject(tournament.players)
        mongoTournament.save()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class NextTournamentStageCommand extends Command<
  CustomLobbyRoom,
  { tournamentId: string }
> {
  async execute({ tournamentId }: { tournamentId: string }) {
    try {
      logger.debug(`Tournament ${tournamentId} is moving to next stage`)
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const remainingPlayers = getRemainingPlayers(tournament)
      if (
        remainingPlayers.length <= 4 &&
        remainingPlayers.some((p) => p.ranks.length > 0)
      ) {
        // finals ended
        return [new EndTournamentCommand().setPayload({ tournamentId })]
      } else {
        return [
          new CreateTournamentLobbiesCommand().setPayload({ tournamentId })
        ]
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class CreateTournamentLobbiesCommand extends Command<
  CustomLobbyRoom,
  { client?: Client; tournamentId: string }
> {
  async execute({
    tournamentId,
    client
  }: {
    tournamentId: string
    client?: Client
  }) {
    try {
      if (client) {
        const user = this.state.users.get(client.auth.uid)
        if (!user || !user.role || user.role !== Role.ADMIN) {
          return
        }
      }

      logger.debug(`Creating tournament lobbies for tournament ${tournamentId}`)
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      this.state.addAnnouncement(
        `${tournament.name} ${getTournamentStage(tournament)} are starting !`
      )

      const brackets = makeBrackets(tournament)
      tournament.brackets.clear()

      for (const bracket of brackets) {
        const bracketId = nanoid()
        logger.info(`Creating tournament game ${bracket.name} id: ${bracketId}`)
        tournament.brackets.set(
          bracketId,
          new TournamentBracketSchema(bracket.name, bracket.playersId)
        )

        await matchMaker.createRoom("preparation", {
          gameMode: GameMode.TOURNAMENT,
          noElo: true,
          ownerId: null,
          roomName: bracket.name,
          autoStartDelayInSeconds: 10 * 60,
          whitelist: bracket.playersId,
          tournamentId,
          bracketId
        })
      }

      //save brackets to db
      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.brackets = convertSchemaToRawObject(tournament.brackets)
        await mongoTournament.save()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class EndTournamentMatchCommand extends Command<
  CustomLobbyRoom,
  {
    tournamentId: string
    bracketId: string
    players: { id: string; rank: number }[]
  }
> {
  async execute({
    tournamentId,
    bracketId,
    players
  }: {
    tournamentId: string
    bracketId: string
    players: IPlayer[]
  }) {
    logger.debug(`Tournament ${tournamentId} bracket ${bracketId} has ended`)
    try {
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const bracket = tournament.brackets.get(bracketId)
      if (!bracket)
        return logger.error(`Tournament bracket not found: ${bracketId}`)

      bracket.finished = true

      players.forEach((p) => {
        const player = tournament.players.get(p.id)
        if (player) {
          player.ranks.push(p.rank)
          if (p.rank > 4) {
            // eliminate players whose rank is > 4
            player.eliminated = true
          }
        }
      })

      bracket.playersId.forEach((playerId) => {
        const player = tournament.players.get(playerId)
        if (player && players.every((p) => p.id !== playerId)) {
          // eliminate players who did not attend their bracket
          player.eliminated = true
        }
      })

      if (values(tournament.brackets).every((b) => b.finished)) {
        //save brackets and player ranks to db before moving to next stage
        const mongoTournament = await Tournament.findById(tournamentId)
        if (mongoTournament) {
          mongoTournament.players = convertSchemaToRawObject(tournament.players)
          mongoTournament.brackets = convertSchemaToRawObject(
            tournament.brackets
          )
          mongoTournament.save()
        }

        return [new NextTournamentStageCommand().setPayload({ tournamentId })]
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class EndTournamentCommand extends Command<
  CustomLobbyRoom,
  { tournamentId: string }
> {
  async execute({ tournamentId }: { tournamentId: string }) {
    try {
      logger.debug(`Tournament ${tournamentId} is finished`)
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      let finalists: (ITournamentPlayer & { id: string })[] = [],
        nbMatchsPlayed = 0

      tournament.players.forEach((player, playerId) => {
        if (player.ranks.length > nbMatchsPlayed) {
          finalists = []
          nbMatchsPlayed = player.ranks.length
        }
        if (player.ranks.length === nbMatchsPlayed) {
          finalists.push({
            id: playerId,
            ...player
          })
        }
      })

      const winner = finalists.find((p) => p.ranks.at(-1) === 1)
      if (winner) {
        this.room.presence.publish("tournament-winner", winner)
      }

      for (const player of finalists) {
        const mongoUser = await UserMetadata.findOne({ uid: player.id })
        const user = this.state.users.get(player.id)
        const rank = player.ranks.at(-1) ?? 1

        if (mongoUser == null || user == null) continue

        mongoUser.booster += 3 // 3 boosters for top 8
        if (mongoUser.titles.includes(Title.ACE_TRAINER) === false) {
          mongoUser.titles.push(Title.ACE_TRAINER)
          user.titles.push(Title.ACE_TRAINER)
        }

        if (rank <= 4) {
          mongoUser.booster += 3 // 6 boosters for top 4
          if (mongoUser.titles.includes(Title.ELITE_FOUR_MEMBER) === false) {
            mongoUser.titles.push(Title.ELITE_FOUR_MEMBER)
            user.titles.push(Title.ELITE_FOUR_MEMBER)
          }
        }

        if (rank === 1) {
          mongoUser.booster += 4 // 10 boosters for top 1
          if (mongoUser.titles.includes(Title.CHAMPION) === false) {
            mongoUser.titles.push(Title.CHAMPION)
            user.titles.push(Title.CHAMPION)
          }
        }

        user.booster = mongoUser.booster
        await mongoUser.save()
      }

      tournament.brackets.clear()
      tournament.finished = true

      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.finished = true
        mongoTournament.brackets = convertSchemaToRawObject(tournament.brackets)
        await mongoTournament.save()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
