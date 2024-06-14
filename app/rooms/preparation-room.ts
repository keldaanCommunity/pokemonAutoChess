import { Dispatcher } from "@colyseus/command"
import { Client, Room, updateLobby } from "colyseus"
import admin from "firebase-admin"
import { components } from "../api-v1/openapi"
import { GameUser } from "../models/colyseus-models/game-user"
import BannedUser from "../models/mongo-models/banned-user"
import { IBot } from "../models/mongo-models/bot-v2"
import UserMetadata from "../models/mongo-models/user-metadata"
import { IPreparationMetadata, Transfer } from "../types"
import { EloRank, MAX_PLAYERS_PER_GAME } from "../types/Config"
import { BotDifficulty, GameMode } from "../types/enum/Game"
import { logger } from "../utils/logger"
import { values } from "../utils/schemas"
import {
  OnAddBotCommand,
  OnDeleteRoomCommand,
  OnGameStartRequestCommand,
  OnJoinCommand,
  OnKickPlayerCommand,
  OnLeaveCommand,
  OnListBotsCommand,
  OnNewMessageCommand,
  OnRemoveBotCommand,
  OnRoomNameCommand,
  OnRoomPasswordCommand,
  OnToggleEloCommand,
  OnToggleReadyCommand,
  RemoveMessageCommand
} from "./commands/preparation-commands"
import PreparationState from "./states/preparation-state"

export default class PreparationRoom extends Room<PreparationState> {
  dispatcher: Dispatcher<this>

  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
    this.maxClients = MAX_PLAYERS_PER_GAME
  }

  async setName(name: string) {
    await this.setMetadata(<IPreparationMetadata>{
      name: name.slice(0, 30),
      type: "preparation"
    })
    updateLobby(this)
  }

  async setPassword(password: string) {
    await this.setMetadata(<IPreparationMetadata>{
      password: password,
      type: "preparation"
    })
    updateLobby(this)
  }

  async toggleElo(noElo: boolean) {
    await this.setMetadata(<IPreparationMetadata>{
      noElo: noElo
    })
    updateLobby(this)
  }

  async setGameStarted(gameStarted: boolean) {
    await this.setMetadata(<IPreparationMetadata>{
      gameStarted: gameStarted
    })
  }

  onCreate(options: {
    ownerId?: string
    roomName: string
    minRank?: EloRank
    gameMode: GameMode
    noElo?: boolean
    autoStartDelayInSeconds?: number
    whitelist?: string[]
    blacklist?: string[]
    tournamentId?: string
    bracketId?: string
  }) {
    // logger.debug(options);
    //logger.info(`create ${options.roomName}`)

    // start the clock ticking
    this.clock.start()

    // logger.debug(defaultRoomName);
    this.setState(new PreparationState(options))
    this.setMetadata(<IPreparationMetadata>{
      ownerName:
        options.gameMode === GameMode.QUICKPLAY ? null : options.ownerId,
      minRank: options.minRank ?? null,
      noElo: options.noElo ?? false,
      gameMode: options.gameMode,
      whitelist: options.whitelist ?? null,
      blacklist: options.blacklist ?? [],
      tournamentId: options.tournamentId ?? null,
      bracketId: options.bracketId ?? null
    })
    this.maxClients = 8
    if (
      options.gameMode !== GameMode.NORMAL &&
      options.gameMode !== GameMode.QUICKPLAY
    ) {
      this.autoDispose = false
    }

    if (options.autoStartDelayInSeconds) {
      this.clock.setTimeout(() => {
        if (this.state.users.size < 2) {
          // automatically remove lobbies with zero or one players
          if (this.metadata?.tournamentId) {
            // automatically give rank 1 if solo in a tournament lobby
            this.presence.publish("tournament-match-end", {
              tournamentId: this.metadata?.tournamentId,
              bracketId: this.metadata?.bracketId,
              players: values(this.state.users).map((p) => ({
                id: p.id,
                rank: 1
              }))
            })
          }

          this.broadcast(Transfer.KICK)
          this.disconnect()
        } else {
          this.dispatcher.dispatch(new OnGameStartRequestCommand())
        }
      }, options.autoStartDelayInSeconds * 1000)

      this.clock.setTimeout(
        () => {
          for (let t = 0; t < 10; t++) {
            this.clock.setTimeout(() => {
              this.state.addMessage({
                author: "Server",
                authorId: "server",
                payload: `Game is starting in ${10 - t}`,
                avatar: "0070/Normal"
              })
            }, t * 1000)
          }
        },
        (options.autoStartDelayInSeconds - 10) * 1000
      )

      this.clock.setTimeout(
        () => {
          for (let t = 0; t < 9; t++) {
            this.clock.setTimeout(
              () => {
                this.state.addMessage({
                  author: "Server",
                  authorId: "server",
                  payload: `Game will start automatically in ${10 - t} minute${
                    t !== 9 ? "s" : ""
                  }`,
                  avatar: "0340/Special1"
                })
              },
              t * 60 * 1000
            )
          }
        },
        (options.autoStartDelayInSeconds - 10 * 60) * 1000
      )
    }

    this.setName(options.roomName)

    this.onMessage(Transfer.KICK, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnKickPlayerCommand(), { client, message })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.DELETE_ROOM, (client) => {
      try {
        this.dispatcher.dispatch(new OnDeleteRoomCommand(), { client })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.CHANGE_ROOM_NAME, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnRoomNameCommand(), { client, message })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.CHANGE_ROOM_PASSWORD, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnRoomPasswordCommand(), {
          client,
          message
        })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.TOGGLE_NO_ELO, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnToggleEloCommand(), { client, message })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.GAME_START_REQUEST, (client) => {
      try {
        this.dispatcher.dispatch(new OnGameStartRequestCommand(), { client })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.TOGGLE_READY, (client) => {
      try {
        this.dispatcher.dispatch(new OnToggleReadyCommand(), { client })
      } catch (error) {
        logger.error(error)
      }
    })

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
      Transfer.ADD_BOT,
      (client: Client, botType: IBot | BotDifficulty) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          if (user) {
            this.dispatcher.dispatch(new OnAddBotCommand(), {
              type: botType,
              user: user
            })
          }
        } catch (error) {
          logger.error(error)
        }
      }
    )
    this.onMessage(Transfer.REMOVE_BOT, (client: Client, t: string) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (user) {
          this.dispatcher.dispatch(new OnRemoveBotCommand(), {
            target: t,
            user: user
          })
        }
      } catch (error) {
        logger.error(error)
      }
    })
    this.onMessage(Transfer.REQUEST_BOT_LIST, (client: Client) => {
      try {
        const user = this.state.users.get(client.auth.uid)

        this.dispatcher.dispatch(new OnListBotsCommand(), {
          user: user
        })
      } catch (error) {
        logger.error(error)
      }
    })

    this.presence.subscribe("server-announcement", (message: string) => {
      this.state.addMessage({
        author: "Server Announcement",
        authorId: "server",
        payload: message,
        avatar: "0294/Joyous"
      })
    })
  }

  async onAuth(client: Client, options: any, request: any) {
    try {
      super.onAuth(client, options, request)
      const token = await admin.auth().verifyIdToken(options.idToken)
      const user = await admin.auth().getUser(token.uid)
      const isBanned = await BannedUser.findOne({ uid: user.uid })
      const userProfile = await UserMetadata.findOne({ uid: user.uid })
      client.send(Transfer.USER_PROFILE, userProfile)

      const isAlreadyInRoom = this.state.users.has(user.uid)
      const numberOfHumanPlayers = values(this.state.users).filter(
        (u) => !u.isBot
      ).length
      if (numberOfHumanPlayers >= MAX_PLAYERS_PER_GAME) {
        throw "Room is full"
      } else if (this.state.gameStarted) {
        throw "Game already started"
      } else if (!user.displayName) {
        throw "No display name"
      } else if (isBanned) {
        throw "User banned"
      } else if (this.metadata.blacklist.includes(user.uid)) {
        throw "User previously kicked"
      } else if (isAlreadyInRoom) {
        throw "User already in room"
      } else {
        return user
      }
    } catch (error) {
      logger.error(error)
    }
  }

  onJoin(client: Client, options: any, auth: any) {
    if (client && client.auth && client.auth.displayName) {
      /*logger.info(
        `${client.auth.displayName} ${client.id} join preparation room`
      )*/
      this.dispatcher.dispatch(new OnJoinCommand(), { client, options, auth })
    }
  }

  async onLeave(client: Client, consented: boolean) {
    if (client && client.auth && client.auth.displayName) {
      /*logger.info(
        `${client.auth.displayName} ${client.id} is leaving preparation room`
      )*/
    }
    try {
      if (consented) {
        throw new Error("consented leave")
      }
      // allow disconnected client to reconnect into this room until 10 seconds
      await this.allowReconnection(client, 10)
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        /*logger.info(
          `${client.auth.displayName} ${client.id} leave preparation room`
        )*/
      }
      this.dispatcher.dispatch(new OnLeaveCommand(), { client, consented })
    }
  }

  onDispose() {
    //logger.info("Dispose preparation room")
    this.dispatcher.stop()
    this.presence.unsubscribe("server-announcement")
  }

  status() {
    const players = new Array<components["schemas"]["Player"]>()
    this.state.users.forEach((user: GameUser) => {
      if (!user.isBot) {
        players.push({
          id: user.id,
          avatar: user.avatar,
          name: user.name,
          elo: user.elo
        })
      }
    })
    return {
      players: players,
      name: this.state.name,
      id: this.roomId
    }
  }
}
