import { Client, Room } from "colyseus"
import SimplePlayer from "../models/colyseus-models/simple-player"
import { Dispatcher } from "@colyseus/command"
import AfterGameState from "./states/after-game-state"
import admin from "firebase-admin"
import BannedUser from "../models/mongo-models/banned-user"
import { logger } from "../utils/logger"
import UserMetadata from "../models/mongo-models/user-metadata"
import { Transfer } from "../types"

export default class AfterGameRoom extends Room<AfterGameState> {
  dispatcher: Dispatcher<this>
  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
  }

  onCreate(options: {
    players: SimplePlayer[]
    idToken: string
    elligibleToXP: boolean
    elligibleToELO: boolean
  }) {
    logger.info("create after game", this.roomId)

    this.setState(new AfterGameState(options))
    // logger.debug('before', this.state.players);
    if (options.players) {
      options.players.forEach((plyr: SimplePlayer) => {
        const player = new SimplePlayer(
          plyr.id,
          plyr.name,
          plyr.avatar,
          plyr.rank,
          plyr.pokemons,
          plyr.exp,
          plyr.title,
          plyr.role,
          plyr.synergies,
          plyr.elo
        )
        this.state.players.set(player.id, player)
      })
    }
  }

  async onAuth(client: Client, options, request) {
    try {
      super.onAuth(client, options, request)
      const token = await admin.auth().verifyIdToken(options.idToken)
      const user = await admin.auth().getUser(token.uid)
      const isBanned = await BannedUser.findOne({ uid: user.uid })
      const userProfile = await UserMetadata.findOne({ uid: user.uid })
      client.send(Transfer.USER_PROFILE, userProfile)

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

  onJoin(client: Client) {
    logger.info(`${client.auth.email} join after game`)
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (consented) {
        throw new Error("consented leave")
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20)
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        logger.info(`${client.auth.displayName} leave after game room`)
      }
    }
  }

  onDispose() {
    logger.info("dispose after game")
    this.dispatcher.stop()
  }
}
