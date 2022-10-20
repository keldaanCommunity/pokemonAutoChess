import { Client, Room } from "colyseus"
import SimplePlayer from "../models/colyseus-models/simple-player"
import { Dispatcher } from "@colyseus/command"
import AfterGameState from "./states/after-game-state"
import admin from "firebase-admin"

export default class AfterGameRoom extends Room {
  dispatcher: Dispatcher<this>
  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
  }

  onCreate(options: any) {
    console.log("create after game", this.roomId)

    this.setState(new AfterGameState())
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
          plyr.role
        )
        this.state.players.set(player.id, player)
      })
    }
  }

  async onAuth(client: Client, options: any, request: any) {
    const token = await admin.auth().verifyIdToken(options.idToken)
    const user = await admin.auth().getUser(token.uid)
    return user
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

module.exports = AfterGameRoom
