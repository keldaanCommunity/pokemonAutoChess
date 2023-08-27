import { Command } from "@colyseus/command"
import { Client, logger, RoomListingData } from "colyseus"
import { ArraySchema } from "@colyseus/schema"
import { EmbedBuilder } from "discord.js"
import { nanoid } from "nanoid"
import { GameRecord } from "../../models/colyseus-models/game-record"
import LobbyUser from "../../models/colyseus-models/lobby-user"
import BannedUser from "../../models/mongo-models/banned-user"
import { BotV2, IBot } from "../../models/mongo-models/bot-v2"
import UserMetadata, {
  IPokemonConfig
} from "../../models/mongo-models/user-metadata"
import DetailledStatistic from "../../models/mongo-models/detailled-statistic-v2"
import {
  Transfer,
  Role,
  Title,
  Emotion,
  USERNAME_REGEXP,
  ISuggestionUser,
  CDN_PORTRAIT_URL
} from "../../types"
import CustomLobbyRoom from "../custom-lobby-room"
import { Pkm, PkmIndex, Unowns } from "../../types/enum/Pokemon"
import { Language } from "../../types/enum/Language"
import PokemonConfig from "../../models/colyseus-models/pokemon-config"
import PRECOMPUTED_RARITY_POKEMONS from "../../models/precomputed/type-rarity-all.json"
import { BoosterRarityProbability, getEmotionCost } from "../../types/Config"
import { Rarity } from "../../types/enum/Game"
import { sum } from "../../utils/array"
import { pickRandomIn } from "../../utils/random"
import { getPortraitSrc, getAvatarSrc } from "../../public/src/utils"
import { cleanProfanity } from "../../utils/profanity-filter"

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
      logger.info(`${client.auth.displayName} ${client.id} join lobby room`)
      client.send(Transfer.ROOMS, rooms)
      // client.send(Transfer.REQUEST_BOT_DATA, this.bots);
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
              user.pokemonCollection,
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
        logger.info(`${client.auth.displayName} ${client.id} leave lobby`)
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

      const DUST_PER_BOOSTER = 50
      if (user && user.booster && user.booster > 0) {
        user.booster -= 1
        const boosterIndex: string[] = []

        for (let i = 0; i < 5; i++) {
          const pkm = pickRandomPokemonBooster()
          boosterIndex.push(PkmIndex[pkm])
        }

        boosterIndex.forEach((i) => {
          const c = user.pokemonCollection.get(i)
          if (c) {
            c.dust += DUST_PER_BOOSTER
          } else {
            const newConfig = new PokemonConfig(i)
            newConfig.dust += DUST_PER_BOOSTER
            user.pokemonCollection.set(i, newConfig)
          }
        })

        const u = await UserMetadata.findOne({ uid: client.auth.uid })

        if (u) {
          u.booster = user.booster
          boosterIndex.forEach((i) => {
            const c = u.pokemonCollection.get(i)
            if (c) {
              c.dust += DUST_PER_BOOSTER
            } else {
              u.pokemonCollection.set(i, {
                id: i,
                emotions: [],
                shinyEmotions: [],
                dust: DUST_PER_BOOSTER,
                selectedEmotion: Emotion.NORMAL,
                selectedShiny: false
              })
            }
          })
          u.save()
        }

        client.send(Transfer.BOOSTER_CONTENT, boosterIndex)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

function pickRandomPokemonBooster(): Pkm {
  let pkm = Pkm.MAGIKARP
  const rarities = Object.keys(Rarity) as Rarity[]
  const seed = Math.random() * sum(Object.values(BoosterRarityProbability))
  let threshold = 0
  for (let i = 0; i < rarities.length; i++) {
    const rarity = rarities[i]
    const rarityProbability = BoosterRarityProbability[rarity]
    threshold += rarityProbability
    if (
      seed < threshold &&
      PRECOMPUTED_RARITY_POKEMONS[rarity] &&
      PRECOMPUTED_RARITY_POKEMONS[rarity].length > 0
    ) {
      pkm = pickRandomIn(PRECOMPUTED_RARITY_POKEMONS[rarity]) as Pkm
      break
    }
  }
  return pkm
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
      if (pokemonConfig) {
        const emotionsToCheck = shiny
          ? pokemonConfig.shinyEmotions
          : pokemonConfig.emotions
        const cost = getEmotionCost(emotion, shiny)
        if (!emotionsToCheck.includes(emotion) && pokemonConfig.dust >= cost) {
          emotionsToCheck.push(emotion)
          pokemonConfig.dust -= cost
          pokemonConfig.selectedEmotion = emotion
          pokemonConfig.selectedShiny = shiny
          const u = await UserMetadata.findOne({ uid: client.auth.uid })
          if (u) {
            let numberOfShinies = 0
            u.pokemonCollection.forEach((c) => {
              numberOfShinies += c.shinyEmotions.length
            })
            if (
              numberOfShinies > 30 &&
              !u.titles.includes(Title.SHINY_SEEKER)
            ) {
              u.titles.push(Title.SHINY_SEEKER)
            }
            if (
              u.pokemonCollection.size >= 30 &&
              !u.titles.includes(Title.DUKE)
            ) {
              u.titles.push(Title.DUKE)
            }
            if (
              emotion === Emotion.ANGRY &&
              index === PkmIndex[Pkm.ARBOK] &&
              !u.titles.includes(Title.DENTIST)
            ) {
              u.titles.push(Title.DENTIST)
            }

            const uPokemonConfig = u.pokemonCollection.get(index)

            if (uPokemonConfig) {
              if (
                uPokemonConfig.shinyEmotions.length >=
                  Object.keys(Emotion).length &&
                uPokemonConfig.emotions.length >= Object.keys(Emotion).length &&
                !u.titles.includes(Title.DUCHESS)
              ) {
                u.titles.push(Title.DUCHESS)
              }

              if (
                !u.titles.includes(Title.ARCHEOLOGIST) &&
                Unowns.every((name) => {
                  const index = PkmIndex[name]
                  const collection = u.pokemonCollection.get(index)
                  const isUnlocked =
                    collection &&
                    (collection.emotions.length > 0 ||
                      collection.shinyEmotions.length > 0)
                  return isUnlocked || index === index
                })
              ) {
                u.titles.push(Title.ARCHEOLOGIST)
              }

              if (shiny) {
                uPokemonConfig.shinyEmotions.push(emotion)
              } else {
                uPokemonConfig.emotions.push(emotion)
              }

              uPokemonConfig.dust -= cost
              uPokemonConfig.selectedEmotion = emotion
              uPokemonConfig.selectedShiny = shiny
              u.save()
            }
          }
        }
      }
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
      if (pokemonConfig) {
        const BOOSTER_COST = 500
        if (pokemonConfig.dust >= BOOSTER_COST) {
          pokemonConfig.dust -= BOOSTER_COST
          user.booster += 1
          const u = await UserMetadata.findOne({ uid: client.auth.uid })
          const pkmConfig = u?.pokemonCollection.get(index)
          if (u && pkmConfig) {
            pkmConfig.dust = pokemonConfig.dust
            u.booster = user.booster
            u.save()
          }
        }
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
      if (USERNAME_REGEXP.test(name)) {
        const regExp = new RegExp(name)
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
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class BanUserCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; name: string; reason: string }
> {
  async execute({
    client,
    uid,
    name,
    reason
  }: {
    client: Client
    uid: string
    name: string
    reason: string
  }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (user && (user.role === Role.ADMIN || user.role === Role.MODERATOR)) {
        this.state.removeMessages(uid)
        const banned = await BannedUser.findOne({ uid })
        if (!banned) {
          BannedUser.create({
            uid,
            author: user.name,
            time: Date.now(),
            name
          })
          client.send(Transfer.BANNED, `${user.name} banned the user ${name}`)

          const dsEmbed = new EmbedBuilder()
            .setTitle(`${user.name} banned the user ${name}`)
            .setAuthor({
              name: user.name,
              iconURL: getAvatarSrc(user.avatar)
            })
            .setDescription(
              `${user.name} banned the user ${name}. Reason: ${reason}`
            )
            .setThumbnail(getAvatarSrc(user.avatar))
          try {
            this.room.discordBanWebhook?.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            logger.error(error)
          }
        } else {
          client.send(Transfer.BANNED, `${name} was already banned`)
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
            createBotList(this.room.bots)
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
          createBotList(this.room.bots)
        )
      }
    } catch (error) {
      logger.error(error)
      client.send(Transfer.BOT_DATABASE_LOG, JSON.stringify(error))
    }
  }
}

export function createBotList(bots: Map<string, IBot>) {
  const botList = new Array<{
    name: string
    avatar: string
    author: string
    id: string
  }>()

  bots.forEach((b) => {
    botList.push({
      name: b.name,
      avatar: b.avatar,
      id: b.id,
      author: b.author
    })
  })
  return botList
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
