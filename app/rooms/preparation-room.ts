import { Client, Room, updateLobby } from "colyseus"
import { Dispatcher } from "@colyseus/command"
import PreparationState from "./states/preparation-state"
import admin from "firebase-admin"
import {
  OnGameStartCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnToggleReadyCommand,
  OnMessageCommand,
  OnAddBotCommand,
  OnRemoveBotCommand,
  OnListBotsCommand,
  InitializeBotsCommand,
  OnRoomNameCommand,
  OnRoomPasswordCommand,
  OnToggleEloCommand,
  OnKickPlayerCommand
} from "./commands/preparation-commands"
import { BotDifficulty } from "../types/enum/Game"
import { IPreparationMetadata, Transfer } from "../types"
import { components } from "../api-v1/openapi"
import { GameUser } from "../models/colyseus-models/game-user"
import BannedUser from "../models/mongo-models/banned-user"
import { IBot } from "../models/mongo-models/bot-v2"

export default class PreparationRoom extends Room {
  dispatcher: Dispatcher<this>
  elos: Map<any, any>

  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
    this.elos = new Map()
  }

  async setName(name: string) {
    await this.setMetadata(<IPreparationMetadata>{
      name: name.slice(0, 30),
      type: "preparation"
    })
    updateLobby(this)
  }

  async setPassword(password: string){
    await this.setMetadata(<IPreparationMetadata>{
      password: password,
      type: "preparation"
    })
    updateLobby(this)
  }

  async toggleElo(noElo: boolean){
    await this.setMetadata(<IPreparationMetadata>{
      noElo: noElo
    })
    updateLobby(this)
  }

  onCreate(options: { ownerId?: string; idToken: string; ownerName: string }) {
    // console.log(options);
    const n = `${options.ownerName}'s room`
    console.log(`create ${n} room`)
    // console.log(defaultRoomName);
    this.setState(new PreparationState(options.ownerId, n))
    this.maxClients = 8
    if (options.ownerId) {
      this.dispatcher.dispatch(new InitializeBotsCommand(), {
        ownerId: options.ownerId
      })
    }
    this.setName(n)

    this.onMessage(Transfer.KICK, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnKickPlayerCommand(), { client, message })
      } catch (error) {
        console.log(error)
      }
    })

    this.onMessage(Transfer.CHANGE_ROOM_NAME, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnRoomNameCommand(), { client, message })
      } catch (error) {
        console.log(error)
      }
    })

    this.onMessage(Transfer.CHANGE_ROOM_PASSWORD, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnRoomPasswordCommand(), { client, message })
      } catch (error) {
        console.log(error)
      }
    })

    this.onMessage(Transfer.TOGGLE_NO_ELO, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnToggleEloCommand(), { client, message })
      } catch (error) {
        console.log(error)
      }
    })

    this.onMessage(Transfer.GAME_START, (client, message) => {
      try {
        this.dispatcher.dispatch(new OnGameStartCommand(), { client, message })
      } catch (error) {
        console.log(error)
      }
    })
    this.onMessage(Transfer.TOGGLE_READY, (c, message) => {
      try {
        this.dispatcher.dispatch(new OnToggleReadyCommand(), { client: c })
      } catch (error) {
        console.log(error)
      }
    })
    this.onMessage(Transfer.NEW_MESSAGE, (client, message) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        if (user && !user.anonymous && message.payload != "") {
          this.dispatcher.dispatch(new OnMessageCommand(), {
            client: client,
            message: {
              name: user.name,
              avatar: user.avatar,
              payload: message.payload,
              time: Date.now()
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    })
    this.onMessage(
      Transfer.ADD_BOT,
      (client: Client, botType: IBot | BotDifficulty) => {
        try {
          const user = this.state.users.get(client.auth.uid)
          this.dispatcher.dispatch(new OnAddBotCommand(), {
            type: botType,
            user: user
          })
        } catch (error) {
          console.log(error)
        }
      }
    )
    this.onMessage(Transfer.REMOVE_BOT, (client: Client, t: string) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        this.dispatcher.dispatch(new OnRemoveBotCommand(), {
          target: t,
          user: user
        })
      } catch (error) {
        console.log(error)
      }
    })
    this.onMessage(Transfer.REQUEST_BOT_LIST, (client: Client) => {
      try {
        const user = this.state.users.get(client.auth.uid)
        
        this.dispatcher.dispatch(new OnListBotsCommand(), {
          user: user
        })
      } catch (error) {
        console.log(error)
      }
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
      console.log(error)
    }
  }

  onJoin(client: Client, options: any, auth: any) {
    if (client && client.auth && client.auth.displayName) {
      console.log(
        `${client.auth.displayName} ${client.id} join preparation room`
      )
      this.dispatcher.dispatch(new OnJoinCommand(), { client, options, auth })
    }
  }

  async onLeave(client: Client, consented: boolean) {
    if (client && client.auth && client.auth.displayName) {
      console.log(
        `${client.auth.displayName} ${client.id} is leaving preparation room`
      )
    }
    try {
      if (consented) {
        throw new Error("consented leave")
      }

      // allow disconnected client to reconnect into this room until 2 seconds
      await this.allowReconnection(client, 2)
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        console.log(
          `${client.auth.displayName} ${client.id} leave preparation room`
        )
      }
      this.dispatcher.dispatch(new OnLeaveCommand(), { client, consented })
    }
  }

  onDispose() {
    console.log("Dispose preparation room")
    this.dispatcher.stop()
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
