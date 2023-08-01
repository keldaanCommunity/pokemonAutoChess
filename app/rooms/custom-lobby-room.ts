import {
  Client,
  Room,
  RoomListingData,
  matchMaker,
  subscribeLobby
} from "colyseus"
import { Dispatcher } from "@colyseus/command"
import LobbyState from "./states/lobby-state"
import { connect } from "mongoose"
import BannedUser from "../models/mongo-models/banned-user"
import ChatV2 from "../models/mongo-models/chat-v2"
import UserMetadata from "../models/mongo-models/user-metadata"
import {
  ILeaderboardInfo,
  ILeaderboardBotInfo
} from "../models/colyseus-models/leaderboard-info"
import admin from "firebase-admin"
import { WebhookClient } from "discord.js"
import BotV2, { IBot } from "../models/mongo-models/bot-v2"
import Meta, { IMeta } from "../models/mongo-models/meta"
import ItemsStatistic, {
  IItemsStatistic
} from "../models/mongo-models/items-statistic"
import PokemonsStatistic, {
  IPokemonsStatistic
} from "../models/mongo-models/pokemons-statistic"
import { PastebinAPI } from "pastebin-ts/dist/api"
import { Emotion, Transfer, Title, Role } from "../types"
import { nanoid } from "nanoid"
import { logger } from "../utils/logger"
import {
  OnJoinCommand,
  OnLeaveCommand,
  GiveTitleCommand,
  GiveBoostersCommand,
  GiveRoleCommand,
  OnNewMessageCommand,
  RemoveMessageCommand,
  OpenBoosterCommand,
  ChangeNameCommand,
  ChangeTitleCommand,
  ChangeSelectedEmotionCommand,
  BuyEmotionCommand,
  BuyBoosterCommand,
  OnSearchCommand,
  OnSearchByIdCommand,
  ChangeAvatarCommand,
  BanUserCommand,
  UnbanUserCommand,
  AddBotCommand,
  DeleteBotCommand,
  OnBotUploadCommand,
  createBotList,
  SelectLanguageCommand
} from "./commands/lobby-commands"
import { Language } from "../types/enum/Language"

export default class CustomLobbyRoom extends Room<LobbyState> {
  discordWebhook: WebhookClient | undefined
  bots: Map<string, IBot>
  meta: IMeta[]
  metaItems: IItemsStatistic[]
  metaPokemons: IPokemonsStatistic[]
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardBotInfo[]
  levelLeaderboard: ILeaderboardInfo[]
  pastebin: PastebinAPI | undefined = undefined
  unsubscribeLobby: (() => void) | undefined
  rooms: RoomListingData<any>[] | undefined
  dispatcher: Dispatcher<this>

  constructor() {
    super()
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

    if (process.env.DISCORD_WEBHOOK_URL) {
      this.discordWebhook = new WebhookClient({
        url: process.env.DISCORD_WEBHOOK_URL
      })
    }

    this.dispatcher = new Dispatcher(this)
    this.bots = new Map<string, IBot>()
    this.meta = new Array<IMeta>()
    this.metaItems = new Array<IItemsStatistic>()
    this.metaPokemons = new Array<IPokemonsStatistic>()
    this.leaderboard = new Array<ILeaderboardInfo>()
    this.botLeaderboard = new Array<ILeaderboardBotInfo>()
    this.levelLeaderboard = new Array<ILeaderboardInfo>()
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
      this.dispatcher.dispatch(new DeleteBotCommand(), { client, message })
    })

    this.onMessage(Transfer.ADD_BOT_DATABASE, async (client, message) => {
      this.dispatcher.dispatch(new AddBotCommand(), { client, message })
    })

    this.onMessage(
      Transfer.SELECT_LANGUAGE,
      async (client, message: Language) => {
        this.dispatcher.dispatch(new SelectLanguageCommand(), {
          client,
          message
        })
      }
    )

    this.onMessage(
      Transfer.UNBAN,
      (client, { uid, name }: { uid: string; name: string }) => {
        this.dispatcher.dispatch(new UnbanUserCommand(), { client, uid, name })
      }
    )

    this.onMessage(
      Transfer.BAN,
      (client, { uid, name }: { uid: string; name: string }) => {
        this.dispatcher.dispatch(new BanUserCommand(), { client, uid, name })
      }
    )

    this.onMessage(Transfer.NEW_MESSAGE, (client, message) => {
      this.dispatcher.dispatch(new OnNewMessageCommand(), { client, message })
    })

    this.onMessage(
      Transfer.REMOVE_MESSAGE,
      (client, message: { id: string }) => {
        this.dispatcher.dispatch(new RemoveMessageCommand(), {
          client,
          messageId: message.id
        })
      }
    )

    this.onMessage(
      Transfer.GIVE_BOOSTER,
      (
        client,
        { uid, numberOfBoosters }: { uid: string; numberOfBoosters: number }
      ) => {
        this.dispatcher.dispatch(new GiveBoostersCommand(), {
          client,
          uid,
          numberOfBoosters: Number(numberOfBoosters) || 1
        })
      }
    )

    this.onMessage(
      Transfer.GIVE_TITLE,
      (client, { uid, title }: { uid: string; title: Title }) => {
        this.dispatcher.dispatch(new GiveTitleCommand(), { client, uid, title })
      }
    )

    this.onMessage(
      Transfer.SET_ROLE,
      (client, { uid, role }: { uid: string; role: Role }) => {
        this.dispatcher.dispatch(new GiveRoleCommand(), { client, uid, role })
      }
    )

    this.onMessage(Transfer.BOT_CREATION, (client, { bot }: { bot: IBot }) => {
      this.dispatcher.dispatch(new OnBotUploadCommand(), { client, bot })
    })

    this.onMessage(Transfer.REQUEST_BOT_LIST, (client) => {
      try {
        client.send(Transfer.REQUEST_BOT_LIST, createBotList(this.bots))
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
      this.dispatcher.dispatch(new OpenBoosterCommand(), { client })
    })

    this.onMessage(Transfer.CHANGE_NAME, (client, message) => {
      this.dispatcher.dispatch(new ChangeNameCommand(), {
        client,
        name: message.name
      })
    })

    this.onMessage(Transfer.SET_TITLE, (client, title: Title | "") => {
      this.dispatcher.dispatch(new ChangeTitleCommand(), { client, title })
    })

    this.onMessage(
      Transfer.CHANGE_SELECTED_EMOTION,
      (
        client,
        {
          index,
          emotion,
          shiny
        }: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        this.dispatcher.dispatch(new ChangeSelectedEmotionCommand(), {
          client,
          index,
          emotion,
          shiny
        })
      }
    )

    this.onMessage(
      Transfer.BUY_EMOTION,
      (
        client,
        {
          index,
          emotion,
          shiny
        }: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        this.dispatcher.dispatch(new BuyEmotionCommand(), {
          client,
          index,
          emotion,
          shiny
        })
      }
    )

    this.onMessage(
      Transfer.BUY_BOOSTER,
      (client, message: { index: string }) => {
        this.dispatcher.dispatch(new BuyBoosterCommand(), {
          client,
          index: message.index
        })
      }
    )

    this.onMessage(Transfer.SEARCH_BY_ID, (client, uid: string) => {
      this.dispatcher.dispatch(new OnSearchByIdCommand(), { client, uid })
    })

    this.onMessage(Transfer.SEARCH, (client, { name }: { name: string }) => {
      this.dispatcher.dispatch(new OnSearchCommand(), { client, name })
    })

    this.onMessage(
      Transfer.CHANGE_AVATAR,
      (
        client,
        {
          index,
          emotion,
          shiny
        }: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        this.dispatcher.dispatch(new ChangeAvatarCommand(), {
          client,
          index,
          emotion,
          shiny
        })
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
          this.fetchChat()
          this.fetchLeaderboards()
          this.fetchMeta()
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

  onJoin(client: Client, options: any, auth: any) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      options,
      auth,
      rooms: this.rooms
    })
  }

  onLeave(client: Client) {
    this.dispatcher.dispatch(new OnLeaveCommand(), { client })
  }

  onDispose() {
    try {
      logger.info("dispose lobby")
      this.dispatcher.stop()
      if (this.unsubscribeLobby) {
        this.unsubscribeLobby()
      }
    } catch (error) {
      logger.error(error)
    }
  }

  fetchChat() {
    ChatV2.find({ time: { $gt: Date.now() - 86400000 } }, (err, messages) => {
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
    })
  }

  fetchMeta() {
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

  fetchLeaderboards() {
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
          name: bot.name,
          avatar: bot.avatar,
          rank: i + 1,
          value: bot.elo,
          author: bot.author
        })
      })
    })
  }
}
