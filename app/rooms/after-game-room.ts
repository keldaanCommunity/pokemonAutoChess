import { Client, Room } from "colyseus"
import SimplePlayer from "../models/colyseus-models/simple-player"
import { Dispatcher } from "@colyseus/command"
import AfterGameState from "./states/after-game-state"
import admin from "firebase-admin"
import BannedUser from "../models/mongo-models/banned-user"

export default class AfterGameRoom extends Room {
  dispatcher: Dispatcher<this>
  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
  }

  onCreate(options: {
    players: SimplePlayer[],
    idToken: string,
    noElo: boolean
  }) {
    console.log("create after game", this.roomId)

    this.setState(new AfterGameState(options.noElo))
    this.maxClients = 8
    // console.log('before', this.state.players);
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
    console.log(`${client.auth.email} join after game`)
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
        console.log(`${client.auth.displayName} leave after game room`)
      }
    }
  }

  onDispose() {
    console.log("dispose after game")
    this.dispatcher.stop()
  }
}