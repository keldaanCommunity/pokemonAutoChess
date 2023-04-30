import { Client, LobbyRoom } from "colyseus"
import LobbyState from "./states/lobby-state"
import { connect, FilterQuery, CallbackError } from "mongoose"
import Chat from "../models/mongo-models/chat"
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

export default class CustomLobbyRoom extends LobbyRoom {
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
        break;
      }
    }
    return pkm
  }

  onCreate(): Promise<void> {
    logger.log("create lobby", this.roomId)
    super.onCreate({})
    this.setState(new LobbyState())
    this.autoDispose = false

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

    this.onMessage(Transfer.BAN, (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (
          user &&
          (user.role === Role.ADMIN || user.role === Role.MODERATOR)
        ) {
          BannedUser.findOne({ uid: message }, (err, banned) => {
            if (err) {
              logger.error(err)
            }
            if (!banned) {
              BannedUser.create({ uid: message })
            }
          })
          this.clients.forEach((c) => {
            if (c.auth.uid === message) {
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
            user.name,
            message.payload,
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
      (client, message: { author: string; payload: string }) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (
            user &&
            user.role &&
            (user.role === Role.ADMIN || user.role === Role.MODERATOR)
          ) {
            this.state.removeMessage(message.author, message.payload)
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

    this.onMessage(Transfer.BOT_CREATION, (client, message) => {
      try {
        const bot = message.bot
        const user = this.state.users.get(client.auth.uid)
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
              .setAuthor(user.name, getAvatarSrc(user.avatar))
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

        client.send(Transfer.REQUEST_BOT_LIST, botList)
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
        const user: LobbyUser = this.state.users.get(client.auth.uid)
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
        if (USERNAME_REGEXP.test(message.name)) {
          this.state.users.get(client.auth.uid).name = message.name
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
          const user: LobbyUser = this.state.users.get(client.auth.uid)
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
          const user: LobbyUser = this.state.users.get(client.auth.uid)
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

                    const unowns = (Object.keys(PkmFamily) as Pkm[]).filter(pkm => PkmFamily[pkm] === Pkm.UNOWN_A)
                    if(!u.titles.includes(Title.ARCHEOLOGIST) && unowns.every(name => {
                      const index = PkmIndex[name]
                      const collection = u.pokemonCollection.get(index)
                      const isUnlocked = collection && (collection.emotions.length > 0 || collection.shinyEmotions.length > 0)
                      return (isUnlocked || index === message.index)
                    })){
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
      (
        client,
        message: { index: string }
      ) => {
        try {
          const user: LobbyUser = this.state.users.get(client.auth.uid)
          const pokemonConfig = user.pokemonCollection.get(message.index)
          if (pokemonConfig) {
            const BOOSTER_COST = 500
            if (pokemonConfig.dust >= BOOSTER_COST) {
              pokemonConfig.dust -= BOOSTER_COST
              user.booster += 1
              UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
                if (u) {
                  u.pokemonCollection.get(message.index).dust = pokemonConfig.dust
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
            { limit: 10, sort: { level: -1 } },
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
          const user: LobbyUser = this.state.users.get(client.auth.uid)
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
          if(err != null){
            logger.error("Error connecting to Mongo", err)
          }
          Chat.find(
            { time: { $gt: Date.now() - 86400000 } },
            (err, messages) => {
              if (err) {
                logger.error(err)
              } else {
                messages.forEach((message) => {
                  this.state.addMessage(
                    message.name,
                    message.payload,
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
    super.onJoin(client, options)
    try {
      logger.log(`${client.auth.displayName} ${client.id} join lobby room`)
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
                      client.auth.email === undefined && client.auth.photoURL === undefined
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
                client.auth.email === undefined && client.auth.photoURL === undefined
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
      super.onLeave(client)
      if (client && client.auth && client.auth.displayName && client.auth.uid) {
        logger.log(`${client.auth.displayName} ${client.id} leave lobby`)
        this.state.users.delete(client.auth.uid)
      }
    } catch (error) {
      logger.error(error)
    }
  }

  onDispose() {
    try {
      super.onDispose()
      logger.log("dispose lobby")
    } catch (error) {
      logger.error(error)
    }
  }
}
