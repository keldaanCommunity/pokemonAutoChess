import {
  Client,
  LobbyRoom,
  Room,
  RoomListingData,
  matchMaker,
  subscribeLobby
} from "colyseus"
import LobbyState from "./states/lobby-state"
import { connect, FilterQuery, CallbackError } from "mongoose"
import ChatV2 from "../models/mongo-models/chat-v2"
import UserMetadata, {
  IPokemonConfig,
  IUserMetadata
} from "../models/mongo-models/user-metadata"
import BannedUser from "../models/mongo-models/banned-user"
import { ILeaderboardInfo } from "../models/colyseus-models/leaderboard-info"
import { ArraySchema } from "@colyseus/schema"
import LobbyUser from "../models/colyseus-models/lobby-user"
import admin from "firebase-admin"
import { GameRecord } from "../models/colyseus-models/game-record"
import { MessageEmbed, WebhookClient } from "discord.js"
import DetailledStatistic from "../models/mongo-models/detailled-statistic-v2"
import BotV2, { IBot } from "../models/mongo-models/bot-v2"
import Meta, { IMeta } from "../models/mongo-models/meta"
import ItemsStatistic, {
  IItemsStatistic
} from "../models/mongo-models/items-statistic"
import PokemonsStatistic, {
  IPokemonsStatistic
} from "../models/mongo-models/pokemons-statistic"
import { PastebinAPI } from "pastebin-ts/dist/api"
import { getAvatarSrc, getPortraitSrc } from "../public/src/utils"
import {
  Emotion,
  Transfer,
  ISuggestionUser,
  Title,
  Role,
  CDN_PORTRAIT_URL,
  PrecomputedRaritPokemonyAll,
  USERNAME_REGEXP
} from "../types"
import { getEmotionCost, RarityProbability } from "../types/Config"
import { Pkm, PkmFamily, PkmIndex } from "../types/enum/Pokemon"
import PokemonConfig from "../models/colyseus-models/pokemon-config"
import { nanoid } from "nanoid"
import PRECOMPUTED_RARITY_POKEMONS from "../models/precomputed/type-rarity-all.json"
import { Rarity } from "../types/enum/Game"
import { pickRandomIn } from "../utils/random"
import { sum } from "../utils/array"
import { logger } from "../utils/logger"

export default class CustomLobbyRoom extends Room<LobbyState> {
  discordWebhook: WebhookClient | undefined
  bots: Map<string, IBot>
  meta: IMeta[]
  metaItems: IItemsStatistic[]
  metaPokemons: IPokemonsStatistic[]
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardInfo[]
  levelLeaderboard: ILeaderboardInfo[]
  pastebin: PastebinAPI | undefined = undefined
  precomputedRarityPokemons: PrecomputedRaritPokemonyAll
  unsubscribeLobby: (() => void) | undefined
  rooms: RoomListingData<any>[] | undefined

  constructor() {
    super()
    this.precomputedRarityPokemons =
      PRECOMPUTED_RARITY_POKEMONS as PrecomputedRaritPokemonyAll
    if (
      process.env.PASTEBIN_API_DEV_KEY &&
      process.env.PASTEBIN_API_USERNAME &&
      process.env.PASTEBIN_API_DEV_KEY
    ) {
      this.pastebin = new PastebinAPI({
        api_dev_key: process.env.PASTEBIN_API_DEV_KEY!,
        api_user_name: process.env.PASTEBIN_API_USERNAME!,
        api_user_password: process.env.PASTEBIN_API_PASSWORD!
      })
    }

    if (process.env.WEBHOOK_URL) {
      this.discordWebhook = new WebhookClient({
        url: process.env.WEBHOOK_URL
      })
    }

    this.bots = new Map<string, IBot>()
    this.meta = new Array<IMeta>()
    this.metaItems = new Array<IItemsStatistic>()
    this.metaPokemons = new Array<IPokemonsStatistic>()
    this.leaderboard = new Array<ILeaderboardInfo>()
    this.botLeaderboard = new Array<ILeaderboardInfo>()
    this.levelLeaderboard = new Array<ILeaderboardInfo>()
  }

  pickPokemon(): Pkm {
    let pkm = Pkm.MAGIKARP
    const rarities = Object.keys(Rarity) as Rarity[]
    const seed = Math.random() * sum(Object.values(RarityProbability))
    let threshold = 0
    for (let i = 0; i < rarities.length; i++) {
      const rarity = rarities[i]
      const rarityProbability = RarityProbability[rarity]
      threshold += rarityProbability
      if (
        seed < threshold &&
        this.precomputedRarityPokemons[rarity] &&
        this.precomputedRarityPokemons[rarity].length > 0
      ) {
        pkm = pickRandomIn(this.precomputedRarityPokemons[rarity])
        break
      }
    }
    return pkm
  }

  async onCreate(): Promise<void> {
    logger.info("create lobby", this.roomId)
    this.setState(new LobbyState())
    this.autoDispose = false
    this.listing.unlisted = true

    this.unsubscribeLobby = await subscribeLobby((roomId, data) => {
      if (this.rooms) {
        const roomIndex = this.rooms?.findIndex(
          (room) => room.roomId === roomId
        )

        if (!data) {
          // remove room listing data
          if (roomIndex !== -1) {
            const previousData = this.rooms[roomIndex]

            this.rooms.splice(roomIndex, 1)

            this.clients.forEach((client) => {
              client.send(Transfer.REMOVE_ROOM, roomId)
            })
          }
        } else if (roomIndex === -1) {
          // append room listing data
          this.rooms.push(data)

          this.clients.forEach((client) => {
            client.send(Transfer.ADD_ROOM, [roomId, data])
          })
        } else {
          const previousData = this.rooms[roomIndex]

          // replace room listing data
          this.rooms[roomIndex] = data

          this.clients.forEach((client) => {
            if (previousData && !data) {
              client.send(Transfer.REMOVE_ROOM, roomId)
            } else if (data) {
              client.send(Transfer.ADD_ROOM, [roomId, data])
            }
          })
        }
      }
    })

    this.rooms = await matchMaker.query({ private: false, unlisted: false })

    this.onMessage(Transfer.REQUEST_LEADERBOARD, (client, message) => {
      try {
        client.send(Transfer.REQUEST_LEADERBOARD, this.leaderboard)
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.REQUEST_BOT_LEADERBOARD, (client, message) => {
      try {
        client.send(Transfer.REQUEST_BOT_LEADERBOARD, this.botLeaderboard)
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.REQUEST_LEVEL_LEADERBOARD, (client, message) => {
      try {
        client.send(Transfer.REQUEST_LEVEL_LEADERBOARD, this.levelLeaderboard)
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.DELETE_BOT_DATABASE, async (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (
          user &&
          (user.role === Role.ADMIN ||
            user.role === Role.BOT_MANAGER ||
            user.role === Role.MODERATOR)
        ) {
          const id = message
          const botData = this.bots.get(id)
          client.send(
            Transfer.BOT_DATABASE_LOG,
            `deleting bot ${botData?.name}by @${botData?.author} id ${id}`
          )
          const resultDelete = await BotV2.deleteOne({ id: id })
          client.send(
            Transfer.BOT_DATABASE_LOG,
            JSON.stringify(resultDelete, null, 2)
          )
          const dsEmbed = new MessageEmbed()
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
            this.discordWebhook?.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            logger.error(error)
          }

          this.bots.delete(id)
          this.broadcast(Transfer.REQUEST_BOT_LIST, this.createBotList())
        }
      } catch (error) {
        logger.error(error)
        client.send(Transfer.BOT_DATABASE_LOG, JSON.stringify(error))
      }
    })

    this.onMessage(Transfer.ADD_BOT_DATABASE, async (client, message) => {
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
          const data = await this.pastebin?.getPaste(id, false)
          if (data) {
            client.send(Transfer.BOT_DATABASE_LOG, "parsing JSON data ...")
            const json = JSON.parse(data)
            const resultDelete = await BotV2.deleteMany({
              avatar: json.avatar,
              author: json.author
            })
            const keys = new Array<string>()
            this.bots.forEach((b) => {
              if (b.avatar === json.avatar && b.author === json.author) {
                keys.push(b.id)
              }
            })
            keys.forEach((k) => {
              this.bots.delete(k)
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

            const dsEmbed = new MessageEmbed()
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
              this.discordWebhook?.send({
                embeds: [dsEmbed]
              })
            } catch (error) {
              logger.error(error)
            }

            this.bots.set(resultCreate.id, resultCreate)
            this.broadcast(Transfer.REQUEST_BOT_LIST, this.createBotList())
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
    })

    this.onMessage(Transfer.UNBAN, (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (
          user &&
          (user.role === Role.ADMIN || user.role === Role.MODERATOR)
        ) {
          BannedUser.deleteOne({ uid: message.uid }, (err, res) => {
            if (err) {
              logger.error
            }
            if (res?.deletedCount > 0) {
              client.send(
                Transfer.BANNED,
                `${user.name} unbanned the user ${message.name}`
              )
            }
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.BAN, (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (
          user &&
          (user.role === Role.ADMIN || user.role === Role.MODERATOR)
        ) {
          this.state.removeMessages(message.uid)
          BannedUser.findOne({ uid: message.uid }, (err, banned) => {
            if (err) {
              logger.error(err)
            }
            if (!banned) {
              BannedUser.create({
                uid: message.uid,
                author: user.name,
                time: Date.now(),
                name: message.name
              })
              client.send(
                Transfer.BANNED,
                `${user.name} banned the user ${message.name}`
              )
            } else {
              client.send(Transfer.BANNED, `${message.name} was already banned`)
            }
          })
          this.clients.forEach((c) => {
            if (c.auth.uid === message.uid) {
              c.send(Transfer.BAN)
              c.leave()
            }
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.NEW_MESSAGE, (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (user && !user.anonymous && message.payload != "") {
          this.state.addMessage(
            nanoid(),
            message.payload,
            user.id,
            user.name,
            user.avatar,
            Date.now(),
            true
          )
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(
      Transfer.REMOVE_MESSAGE,
      (client, message: { id: string }) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (
            user &&
            user.role &&
            (user.role === Role.ADMIN || user.role === Role.MODERATOR)
          ) {
            this.state.removeMessage(message.id)
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(
      Transfer.GIVE_BOOSTER,
      (client, message: { uid: string; numberOfBoosters: number }) => {
        try {
          const u = this.state.users.get(client.auth.uid)
          const targetUser = this.state.users.get(message.uid)

          if (u && u.role && u.role === Role.ADMIN) {
            UserMetadata.findOne({ uid: message.uid }, (err, user) => {
              if (user) {
                user.booster += 1
                user.save()

                if (targetUser) {
                  targetUser.booster = user.booster
                }
              }
            })
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(
      Transfer.GIVE_TITLE,
      (client, message: { uid: string; title: Title }) => {
        try {
          const u = this.state.users.get(client.auth.uid)
          const targetUser = this.state.users.get(message.uid)

          if (u && u.role && u.role === Role.ADMIN) {
            UserMetadata.findOne({ uid: message.uid }, (err, user) => {
              if (user && user.titles && !user.titles.includes(message.title)) {
                user.titles.push(message.title)
                user.save()

                if (targetUser) {
                  targetUser.titles.push(message.title)
                }
              }
            })
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(Transfer.SET_MODERATOR, (client, uid: string) => {
      try {
        const u = this.state.users.get(client.auth.uid)
        const targetUser = this.state.users.get(uid)
        // logger.debug(u.role, uid)
        if (u && u.role === Role.ADMIN) {
          UserMetadata.findOne({ uid: uid }, (err, user) => {
            if (user) {
              user.role = Role.MODERATOR
              user.save()

              if (targetUser) {
                targetUser.role = user.role
              }
            }
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.SET_BOT_MANAGER, (client, uid: string) => {
      try {
        const u = this.state.users.get(client.auth.uid)
        const targetUser = this.state.users.get(uid)
        // logger.debug(u.role, uid)
        if (u && u.role === Role.ADMIN) {
          UserMetadata.findOne({ uid: uid }, (err, user) => {
            if (user) {
              user.role = Role.BOT_MANAGER
              user.save()

              if (targetUser) {
                targetUser.role = user.role
              }
            }
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.BOT_CREATION, (client, message) => {
      try {
        const bot = message.bot
        const user = this.state.users.get(client.auth.uid)
        if (!user) return
        this.pastebin
          ?.createPaste({
            text: JSON.stringify(bot),
            title: `${user.name} has uploaded BOT ${bot.name}`,
            format: "json"
          })
          .then((data: unknown) => {
            const dsEmbed = new MessageEmbed()
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
              this.discordWebhook?.send({
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
    })

    this.onMessage(Transfer.REQUEST_BOT_LIST, (client) => {
      try {
        client.send(Transfer.REQUEST_BOT_LIST, this.createBotList())
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.REQUEST_BOT_DATA, (client, bot) => {
      try {
        const botData = this.bots.get(bot)
        client.send(Transfer.REQUEST_BOT_DATA, botData)
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.REQUEST_META, (client) => {
      try {
        client.send(Transfer.REQUEST_META, this.meta)
        client.send(Transfer.REQUEST_META_ITEMS, this.metaItems)
        client.send(Transfer.REQUEST_META_POKEMONS, this.metaPokemons)
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.OPEN_BOOSTER, (client) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (!user) return

        const DUST_PER_BOOSTER = 50
        if (user && user.booster && user.booster > 0) {
          user.booster -= 1
          const boosterIndex: string[] = []

          for (let i = 0; i < 5; i++) {
            const pkm = this.pickPokemon()
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

          UserMetadata.findOne(
            { uid: client.auth.uid },
            (err, u: FilterQuery<IUserMetadata>) => {
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
          )
          client.send(Transfer.BOOSTER_CONTENT, boosterIndex)
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.CHANGE_NAME, (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (!user) return
        if (USERNAME_REGEXP.test(message.name)) {
          user.name = message.name
          UserMetadata.findOne({ uid: client.auth.uid }, (err, user) => {
            if (user) {
              user.displayName = message.name
              user.save()
            }
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.SET_TITLE, (client, message: Title | "") => {
      try {
        let m = message
        const user = this.state.users.get(client.auth.uid)
        if (user) {
          if (user.title === message) {
            m = ""
          }
          user.title = m
          UserMetadata.findOne({ uid: client.auth.uid }, (err, user) => {
            if (user) {
              user.title = m
              user.save()
            }
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(
      Transfer.CHANGE_SELECTED_EMOTION,
      (
        client,
        message: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (!user) return
          const pokemonConfig = user.pokemonCollection.get(message.index)
          if (pokemonConfig) {
            const emotionsToCheck = message.shiny
              ? pokemonConfig.shinyEmotions
              : pokemonConfig.emotions
            if (
              emotionsToCheck.includes(message.emotion) &&
              (message.emotion != pokemonConfig.selectedEmotion ||
                message.shiny != pokemonConfig.selectedShiny)
            ) {
              pokemonConfig.selectedEmotion = message.emotion
              pokemonConfig.selectedShiny = message.shiny
              UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
                if (u) {
                  if (u.pokemonCollection.get(message.index)) {
                    u.pokemonCollection.get(message.index).selectedEmotion =
                      message.emotion
                    u.pokemonCollection.get(message.index).selectedShiny =
                      message.shiny
                    u.save()
                  }
                }
              })
            }
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(
      Transfer.BUY_EMOTION,
      (
        client,
        message: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (!user) return
          const pokemonConfig = user.pokemonCollection.get(message.index)
          if (pokemonConfig) {
            const emotionsToCheck = message.shiny
              ? pokemonConfig.shinyEmotions
              : pokemonConfig.emotions
            const cost = getEmotionCost(message.emotion, message.shiny)
            if (
              !emotionsToCheck.includes(message.emotion) &&
              pokemonConfig.dust >= cost
            ) {
              emotionsToCheck.push(message.emotion)
              pokemonConfig.dust -= cost
              pokemonConfig.selectedEmotion = message.emotion
              pokemonConfig.selectedShiny = message.shiny
              UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
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
                  if (u.pokemonCollection.get(message.index)) {
                    if (
                      u.pokemonCollection.get(message.index).shinyEmotions
                        .length >= Object.keys(Emotion).length &&
                      u.pokemonCollection.get(message.index).emotions.length >=
                        Object.keys(Emotion).length &&
                      !u.titles.includes(Title.DUCHESS)
                    ) {
                      u.titles.push(Title.DUCHESS)
                    }

                    const unowns = (Object.keys(PkmFamily) as Pkm[]).filter(
                      (pkm) => PkmFamily[pkm] === Pkm.UNOWN_A
                    )
                    if (
                      !u.titles.includes(Title.ARCHEOLOGIST) &&
                      unowns.every((name) => {
                        const index = PkmIndex[name]
                        const collection = u.pokemonCollection.get(index)
                        const isUnlocked =
                          collection &&
                          (collection.emotions.length > 0 ||
                            collection.shinyEmotions.length > 0)
                        return isUnlocked || index === message.index
                      })
                    ) {
                      u.titles.push(Title.ARCHEOLOGIST)
                    }

                    message.shiny
                      ? u.pokemonCollection
                          .get(message.index)
                          .shinyEmotions.push(message.emotion)
                      : u.pokemonCollection
                          .get(message.index)
                          .emotions.push(message.emotion)
                    u.pokemonCollection.get(message.index).dust -= cost
                    u.pokemonCollection.get(message.index).selectedEmotion =
                      message.emotion
                    u.pokemonCollection.get(message.index).selectedShiny =
                      message.shiny
                    u.save()
                  }
                }
              })
            }
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(
      Transfer.BUY_BOOSTER,
      (client, message: { index: string }) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (!user) return
          const pokemonConfig = user.pokemonCollection.get(message.index)
          if (pokemonConfig) {
            const BOOSTER_COST = 500
            if (pokemonConfig.dust >= BOOSTER_COST) {
              pokemonConfig.dust -= BOOSTER_COST
              user.booster += 1
              UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
                if (u) {
                  u.pokemonCollection.get(message.index).dust =
                    pokemonConfig.dust
                  u.booster = user.booster
                  u.save()
                }
              })
            }
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(Transfer.SEARCH_BY_ID, (client, message) => {
      try {
        UserMetadata.findOne({ uid: message }, (err, user) => {
          if (user) {
            DetailledStatistic.find(
              { playerId: user.uid },
              ["pokemons", "time", "rank", "elo"],
              { limit: 10, sort: { time: -1 } },
              (err, stats) => {
                if (err) {
                  logger.error(err)
                } else {
                  client.send(
                    Transfer.USER,
                    new LobbyUser(
                      user.uid,
                      user.displayName,
                      user.elo,
                      user.avatar,
                      user.langage,
                      user.wins,
                      user.exp,
                      user.level,
                      user.donor,
                      stats.map((r) => {
                        return new GameRecord(r.time, r.rank, r.elo, r.pokemons)
                      }),
                      user.honors,
                      user.pokemonCollection,
                      user.booster,
                      user.titles,
                      user.title,
                      user.role,
                      false
                    )
                  )
                }
              }
            )
          } else {
            client.send(Transfer.USER, {})
          }
        })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.SEARCH, (client, message) => {
      try {
        if (USERNAME_REGEXP.test(message.name)) {
          const regExp = new RegExp(message.name)
          UserMetadata.find(
            { displayName: { $regex: regExp, $options: "i" } },
            ["uid", "elo", "displayName", "level", "avatar"],
            { limit: 100, sort: { level: -1 } },
            (err, users) => {
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
          )
        }
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(
      Transfer.CHANGE_AVATAR,
      (
        client,
        message: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (!user) return
          const config = user.pokemonCollection.get(message.index)
          if (config) {
            const emotionsToCheck = message.shiny
              ? config.shinyEmotions
              : config.emotions
            if (emotionsToCheck.includes(message.emotion)) {
              const portrait = getPortraitSrc(
                message.index,
                message.shiny,
                message.emotion
              )
                .replace(CDN_PORTRAIT_URL, "")
                .replace(".png", "")
              user.avatar = portrait
              UserMetadata.findOne(
                { uid: client.auth.uid },
                (err: CallbackError, u: FilterQuery<IUserMetadata>) => {
                  u.avatar = portrait
                  u.save()
                }
              )
            }
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )

    return new Promise((resolve) => {
      connect(
        process.env.MONGO_URI ? process.env.MONGO_URI : "Default Mongo URI",
        {},
        (err) => {
          if (err != null) {
            logger.error("Error connecting to Mongo", err)
          }
          ChatV2.find(
            { time: { $gt: Date.now() - 86400000 } },
            (err, messages) => {
              if (err) {
                logger.error(err)
              } else {
                messages.forEach((message) => {
                  this.state.addMessage(
                    nanoid(),
                    message.payload,
                    message.authorId,
                    message.author,
                    message.avatar,
                    message.time,
                    false
                  )
                })
              }
            }
          )
          UserMetadata.find(
            {},
            ["displayName", "avatar", "elo"],
            { limit: 100, sort: { elo: -1 } },
            (err, users) => {
              if (err) {
                logger.error(err)
              } else {
                for (let i = 0; i < users.length; i++) {
                  const user = users[i]
                  this.leaderboard.push({
                    name: user.displayName,
                    rank: i + 1,
                    avatar: user.avatar,
                    value: user.elo
                  })
                }
              }
            }
          )
          UserMetadata.find(
            {},
            ["displayName", "avatar", "level"],
            { limit: 100, sort: { level: -1 } },
            (err, users) => {
              if (err) {
                logger.error(err)
              } else {
                for (let i = 0; i < users.length; i++) {
                  const user = users[i]
                  this.levelLeaderboard.push({
                    name: user.displayName,
                    rank: i + 1,
                    avatar: user.avatar,
                    value: user.level
                  })
                }
              }
            }
          )
          BotV2.find({}, {}, { sort: { elo: -1 } }, (_err, bots) => {
            const ids = new Array<string>()
            bots.forEach((bot, i) => {
              if (ids.includes(bot.id)) {
                const id = nanoid()
                bot.id = id
                bot.save()
              }
              ids.push(bot.id)
              this.bots.set(bot.id, bot)
              this.botLeaderboard.push({
                name: `${bot.name} by @${bot.author}`,
                avatar: bot.avatar,
                rank: i + 1,
                value: bot.elo
              })
            })
          })
          Meta.find(
            {},
            [
              "cluster_id",
              "count",
              "ratio",
              "winrate",
              "mean_rank",
              "types",
              "pokemons"
            ],
            (err, docs) => {
              if (err) {
                logger.error(err)
              } else {
                docs.forEach((doc) => {
                  this.meta.push(doc)
                })
              }
            }
          )
          ItemsStatistic.find({}, (err, docs) => {
            if (err) {
              logger.error(err)
            } else {
              docs.forEach((doc) => {
                this.metaItems.push(doc)
              })
            }
          })
          PokemonsStatistic.find({}, (err, docs) => {
            if (err) {
              logger.error(err)
            } else {
              docs.forEach((doc) => {
                this.metaPokemons.push(doc)
              })
            }
          })
        }
      )
      resolve()
    })
  }

  async onAuth(client: Client, options: any, request: any) {
    try {
      super.onAuth(client, options, request)
      const token = await admin.auth().verifyIdToken(options.idToken)
      const user = await admin.auth().getUser(token.uid)
      const isBanned = await BannedUser.findOne({ uid: user.uid })

      if (!user.displayName) {
        throw "No display name"
      } else if (isBanned) {
        throw "User banned"
      } else {
        return user
      }
    } catch (error) {
      logger.error(error)
    }
  }

  onJoin(client: Client, options: any) {
    try {
      logger.info(`${client.auth.displayName} ${client.id} join lobby room`)
      client.send(Transfer.ROOMS, this.rooms)
      // client.send(Transfer.REQUEST_BOT_DATA, this.bots);
      UserMetadata.findOne(
        { uid: client.auth.uid },
        (err: any, user: IUserMetadata) => {
          if (user) {
            DetailledStatistic.find(
              { playerId: client.auth.uid },
              ["pokemons", "time", "rank", "elo"],
              { limit: 10, sort: { time: -1 } },
              (err, stats) => {
                if (err) {
                  logger.error(err)
                } else {
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
                      user.langage,
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
                        client.auth.photoURL === undefined
                    )
                  )
                }
              }
            )
          } else {
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
                "eng",
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
                  client.auth.photoURL === undefined
              )
            )
          }
        }
      )
    } catch (error) {
      logger.error(error)
    }
  }

  onLeave(client: Client) {
    try {
      if (client && client.auth && client.auth.displayName && client.auth.uid) {
        logger.info(`${client.auth.displayName} ${client.id} leave lobby`)
        this.state.users.delete(client.auth.uid)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  onDispose() {
    try {
      logger.info("dispose lobby")
      if (this.unsubscribeLobby) {
        this.unsubscribeLobby()
      }
    } catch (error) {
      logger.error(error)
    }
  }

  createBotList() {
    const botList = new Array<{
      name: string
      avatar: string
      author: string
      id: string
    }>()

    this.bots.forEach((b) => {
      botList.push({
        name: b.name,
        avatar: b.avatar,
        id: b.id,
        author: b.author
      })
    })
    return botList
  }
}
