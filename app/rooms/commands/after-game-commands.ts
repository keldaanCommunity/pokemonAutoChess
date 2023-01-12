import { Command } from "@colyseus/command"
import { GameUser } from "../../models/colyseus-models/game-user"
import UserMetadata from "../../models/mongo-models/user-metadata"
import { Emotion, Transfer } from "../../types"

export class OnJoinCommand extends Command {
  execute({ client, options, auth }) {
    UserMetadata.findOne({ uid: auth.uid }, (err, user) => {
      if (user) {
        this.state.users.set(
          client.auth.uid,
          new GameUser(
            user.uid,
            user.displayName,
            user.elo,
            user.avatar,
            false,
            false,
            user.title,
            user.role,
            false
          )
        )

        this.room.broadcast(Transfer.MESSAGES, {
          name: "Server",
          payload: `${user.displayName} joined.`,
          avatar: user.avatar,
          time: Date.now()
        })
      }
    })
  }
}

export class OnMessageCommand extends Command {
  execute({ client, message }) {
    this.room.broadcast(Transfer.MESSAGES, message)
  }
}

export class OnLeaveCommand extends Command {
  execute({ client, consented }) {
    this.room.broadcast(Transfer.MESSAGES, {
      name: "Server",
      payload: `${client.auth.displayName} left.`,
      avatar: `0081/${Emotion.NORMAL}`,
      time: Date.now()
    })
    this.state.users.delete(client.auth.uid)
  }
}
