import { Command } from "@colyseus/command"
import { GameUser } from "../../models/colyseus-models/game-user"
import UserMetadata from "../../models/mongo-models/user-metadata"
import { Emotion, Transfer } from "../../types"
import { logger } from "../../utils/logger"

export class OnJoinCommand extends Command {
  async execute({ client }) {
    try {
      const user = await UserMetadata.findOne({ uid: client.userData.playerId })
      if (user) {
        this.state.users.set(
          client.userData.playerId,
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
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnLeaveCommand extends Command {
  execute({ client, consented }) {
    try {
      if (client.userData) {
        this.room.broadcast(Transfer.MESSAGES, {
          name: "Server",
          payload: `${client.userData.displayName} left.`,
          avatar: `0081/${Emotion.NORMAL}`,
          time: Date.now()
        })
        this.state.users.delete(client.userData.playerId)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
