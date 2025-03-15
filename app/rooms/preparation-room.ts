import { Dispatcher } from "@colyseus/command"
import { Client, ClientArray, Room, updateLobby } from "colyseus"
import admin from "firebase-admin"
import { IBot } from "../models/mongo-models/bot-v2"
import UserMetadata from "../models/mongo-models/user-metadata"
import { IPreparationMetadata, Role, Transfer } from "../types"
import { EloRank, MAX_PLAYERS_PER_GAME } from "../types/Config"
import { CloseCodes } from "../types/enum/CloseCodes"
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
  OnNewMessageCommand,
  OnRemoveBotCommand,
  OnRoomChangeRankCommand,
  OnRoomChangeSpecialRule,
  OnRoomNameCommand,
  OnRoomPasswordCommand,
  OnChangeNoEloCommand,
  OnToggleReadyCommand,
  RemoveMessageCommand
} from "./commands/preparation-commands"
import PreparationState from "./states/preparation-state"
import { UserRecord } from "firebase-admin/lib/auth/user-record"

export default class PreparationRoom extends Room<PreparationState> {
  dispatcher: Dispatcher<this>
  clients!: ClientArray<undefined, UserRecord>

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

  async setNoElo(noElo: boolean) {
    await this.setMetadata(<IPreparationMetadata>{ noElo })
    updateLobby(this)
  }

  async setMinMaxRanks(minRank: EloRank, maxRank: EloRank) {
    await this.setMetadata(<IPreparationMetadata>{
      minRank: minRank,
      maxRank: maxRank
    })
    updateLobby(this)
  }

  async setGameStarted(gameStartedAt: string) {
    await this.setMetadata(<IPreparationMetadata>{ gameStartedAt })
  }

  onCreate(options: {
    ownerId?: string
    roomName: string
    minRank?: EloRank
    maxRank?: EloRank
    gameMode: GameMode
    noElo?: boolean
    password?: string
    autoStartDelayInSeconds?: number
    whitelist?: string[]
    blacklist?: string[]
    tournamentId?: string
    bracketId?: string
  }) {
    logger.info("create Preparation ", this.roomId)
    // logger.debug(options);
    //logger.info(`create ${options.roomName}`)

    // start the clock ticking
    this.clock.start()

    // logger.debug(defaultRoomName);
    this.state = new PreparationState(options)
    this.setMetadata(<IPreparationMetadata>{
      name: options.roomName.slice(0, 30),
      ownerName:
        options.gameMode === GameMode.QUICKPLAY ? null : options.ownerId,
      minRank: options.minRank ?? null,
      maxRank: options.maxRank ?? null,
      noElo: options.noElo ?? false,
      gameMode: options.gameMode,
      whitelist: options.whitelist ?? [],
      blacklist: options.blacklist ?? [],
      playersInfo: [],
      tournamentId: options.tournamentId ?? null,
      bracketId: options.bracketId ?? null,
      gameStartedAt: null,
      password: options.password ?? null,
      type: "preparation"
    })
    this.maxClients = 8
    if (options.gameMode === GameMode.TOURNAMENT) {
      this.autoDispose = false
    }

    if (options.autoStartDelayInSeconds) {
      this.clock.setTimeout(() => {
        if (this.state.gameStartedAt != null) {
          // game has started but the prep room is still open
          logger.debug(
            "game has started but the prep room is still open, forcing close"
          )
          this.disconnect(CloseCodes.NORMAL_CLOSURE)
          return
        } else if (this.state.users.size < 2) {
          // automatically remove lobbies with zero or one players
          if (this.metadata?.tournamentId) {
            // automatically give rank 1 if solo in a tournament lobby
            this.presence.publish("tournament-match-end", {
              tournamentId: this.metadata?.tournamentId,
              bracketId: this.metadata?.bracketId,
              players: values(this.state.users).map((p) => ({
                id: p.uid,
                rank: 1
              }))
            })
          }

          this.disconnect(CloseCodes.ROOM_EMPTY)
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

    this.onMessage(Transfer.KICK, (client, message) => {
      logger.info(Transfer.KICK, this.roomName)
      try {
        this.dispatcher.dispatch(new OnKickPlayerCommand(), { client, message })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.DELETE_ROOM, (client) => {
      logger.info(Transfer.DELETE_ROOM, this.roomName)
      try {
        this.dispatcher.dispatch(new OnDeleteRoomCommand(), { client })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.CHANGE_ROOM_NAME, (client, message) => {
      logger.info(Transfer.CHANGE_ROOM_NAME, this.roomName)
      try {
        this.dispatcher.dispatch(new OnRoomNameCommand(), { client, message })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.CHANGE_ROOM_PASSWORD, (client, message) => {
      logger.info(Transfer.CHANGE_ROOM_PASSWORD, this.roomName)
      try {
        this.dispatcher.dispatch(new OnRoomPasswordCommand(), {
          client,
          message
        })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(
      Transfer.CHANGE_ROOM_RANKS,
      (client, { minRank, maxRank }) => {
        logger.info(Transfer.CHANGE_ROOM_RANKS, this.roomName, minRank, maxRank)
        try {
          this.dispatcher.dispatch(new OnRoomChangeRankCommand(), {
            client,
            minRank,
            maxRank
          })
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(Transfer.CHANGE_SPECIAL_RULE, (client, specialRule) => {
      logger.info(Transfer.CHANGE_SPECIAL_RULE, this.roomName, specialRule)
      try {
        this.dispatcher.dispatch(new OnRoomChangeSpecialRule(), {
          client,
          specialRule
        })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.CHANGE_NO_ELO, (client, message) => {
      logger.info(Transfer.CHANGE_NO_ELO, this.roomName)
      try {
        this.dispatcher.dispatch(new OnChangeNoEloCommand(), {
          client,
          message
        })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.GAME_START_REQUEST, (client) => {
      logger.info(Transfer.GAME_START_REQUEST, this.roomName)
      try {
        this.dispatcher.dispatch(new OnGameStartRequestCommand(), { client })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.TOGGLE_READY, (client, ready: boolean) => {
      logger.info(Transfer.TOGGLE_READY, this.roomName)
      try {
        this.dispatcher.dispatch(new OnToggleReadyCommand(), { client, ready })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(Transfer.NEW_MESSAGE, (client, message) => {
      logger.info(Transfer.NEW_MESSAGE, this.roomName)
      try {
        this.dispatcher.dispatch(new OnNewMessageCommand(), { client, message })
      } catch (error) {
        logger.error(error)
      }
    })

    this.onMessage(
      Transfer.REMOVE_MESSAGE,
      (client, message: { id: string }) => {
        logger.info(Transfer.REMOVE_MESSAGE, this.roomName)
        try {
          this.dispatcher.dispatch(new RemoveMessageCommand(), {
            client,
            messageId: message.id
          })
        } catch (error) {
          logger.error(error)
        }
      }
    )

    this.onMessage(
      Transfer.ADD_BOT,
      (client: Client, botType: IBot | BotDifficulty) => {
        logger.info(Transfer.ADD_BOT, this.roomName)
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
      logger.info(Transfer.REMOVE_BOT, this.roomName)
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

    this.onServerAnnouncement = this.onServerAnnouncement.bind(this)
    this.presence.subscribe("server-announcement", this.onServerAnnouncement)

    this.onGameStart = this.onGameStart.bind(this)
    this.presence.subscribe("game-started", this.onGameStart)

    this.presence.subscribe("room-deleted", (roomId) => {
      if (this.roomId === roomId) {
        this.disconnect(CloseCodes.ROOM_DELETED)
      }
    })
  }

  async onAuth(client: Client, options, context) {
    try {
      const token = await admin.auth().verifyIdToken(options.idToken)
      const user = await admin.auth().getUser(token.uid)
      const userProfile = await UserMetadata.findOne({ uid: user.uid })
      const isAdmin = userProfile?.role === Role.ADMIN
      client.send(Transfer.USER_PROFILE, userProfile)

      const isAlreadyInRoom = this.state.users.has(user.uid)
      const numberOfHumanPlayers = values(this.state.users).filter(
        (u) => !u.isBot
      ).length

      if (numberOfHumanPlayers >= MAX_PLAYERS_PER_GAME && !isAdmin) {
        throw "Room is full"
      } else if (isAlreadyInRoom) {
        throw "Already joined"
      } else if (this.state.gameStartedAt != null) {
        throw "Game already started"
      } else if (!user.displayName) {
        throw "No display name"
      } else if (userProfile?.banned) {
        throw "User banned"
      } else if (this.metadata.blacklist.includes(user.uid)) {
        throw "User previously kicked"
      } else {
        return user
      }
    } catch (error) {
      logger.error(error)
    }
  }

  async onJoin(
    client: Client<undefined, UserRecord>,
    options: any,
    auth: UserRecord | undefined
  ) {
    if (auth) {
      /*logger.info(
        `${auth.displayName} ${client.id} join preparation room`
      )*/
      await this.dispatcher.dispatch(new OnJoinCommand(), {
        client,
        options,
        auth
      })
    }
  }

  async onLeave(client: Client, consented: boolean) {
    if (client.auth && client.auth.displayName) {
      /*logger.info(
        `${client.auth.displayName} ${client.id} is leaving preparation room`
      )*/
    }
    try {
      this.state.abortOnPlayerLeave?.abort()
      if (consented) {
        throw new Error("consented leave")
      }
      // allow disconnected client to reconnect into this room until 10 seconds
      await this.allowReconnection(client, 10)
    } catch (e) {
      if (client.auth && client.auth.displayName) {
        /*logger.info(
          `${client.auth.displayName} ${client.id} leave preparation room`
        )*/
      }
      this.dispatcher.dispatch(new OnLeaveCommand(), { client, consented })
    }
  }

  onDispose() {
    logger.info("Dispose Preparation", this.roomId)
    this.dispatcher.stop()
    this.presence.unsubscribe("server-announcement", this.onServerAnnouncement)
    this.presence.unsubscribe("game-started", this.onGameStart)
  }

  onServerAnnouncement(message: string) {
    this.state.addMessage({
      author: "Server Announcement",
      authorId: "server",
      payload: message,
      avatar: "0294/Joyous"
    })
  }

  onGameStart({
    gameId,
    preparationId
  }: { gameId: string; preparationId: string }) {
    if (this.roomId === preparationId) {
      this.lock()
      this.setGameStarted(new Date().toISOString())
      //logger.debug("game start", game.roomId)
      this.broadcast(Transfer.GAME_START, gameId)
    }
  }

  updatePlayersInfo() {
    this.setMetadata({
      playersInfo: [...this.state.users.values()].map(
        (u) => `${u.name} [${u.elo}]`
      )
    })
  }
}
