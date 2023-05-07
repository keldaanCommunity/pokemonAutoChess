import { Command } from "@colyseus/command"
import { GameUser } from "../../models/colyseus-models/game-user"
import UserMetadata, {
  IUserMetadata
} from "../../models/mongo-models/user-metadata"
import BotV2, { IBot } from "../../models/mongo-models/bot-v2"
import { Client } from "colyseus"
import PreparationRoom from "../preparation-room"
import { Emotion, IMessage, Role, Transfer } from "../../types"
import { BotDifficulty } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import { logger } from "../../utils/logger"

export class OnJoinCommand extends Command<
  PreparationRoom,
  {
    client: Client
    options: any
    auth: any
  }
> {
  execute({ client, options, auth }) {
    try {
      if (this.state.ownerId == "") {
        this.state.ownerId = auth.uid
      }
      UserMetadata.findOne(
        { uid: auth.uid },
        (err: any, user: IUserMetadata) => {
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
                auth.email === undefined
              )
            )

            if (user.uid == this.state.ownerId) {
              // logger.log(user.displayName);
              this.state.ownerName = user.displayName
            }
            this.room.broadcast(Transfer.MESSAGES, {
              name: "Server",
              payload: `${user.displayName} joined.`,
              avatar: user.avatar,
              time: Date.now()
            })
          }
        }
      )

      if (this.state.users.size >= 8) {
        return [new OnRemoveBotCommand().setPayload({ target: undefined })]
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnGameStartCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: any
  }
> {
  execute({ client, message }) {
    try {
      let allUsersReady = true

      this.state.users.forEach((user: GameUser, key: string) => {
        if (!user.ready) {
          allUsersReady = false
        }
      })

      if (allUsersReady && !this.state.gameStarted) {
        this.state.gameStarted = true
        this.room.broadcast(Transfer.GAME_START, message, { except: client })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnMessageCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: IMessage
  }
> {
  execute({ client, message }) {
    try {
      this.room.broadcast(Transfer.MESSAGES, { ...message, time: Date.now() })
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnRoomNameCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: string
  }
> {
  execute({ client, message }) {
    try {
      if (client.auth.uid == this.state.ownerId && this.state.name != message) {
        this.room.setName(message)
        this.state.name = message
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnRoomPasswordCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: string
  }
  > {
  execute({ client, message: password }) {
    try {
      if (client.auth.uid == this.state.ownerId && this.state.password != password) {
        this.room.setPassword(password)
        this.state.password = password
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnToggleEloCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: boolean
  }
  > {
  execute({ client, message: noElo }) {
    try {
      if (client.auth.uid === this.state.ownerId && this.state.noElo != noElo) {
        this.state.noElo = noElo
        this.room.toggleElo(noElo)
        this.room.broadcast(Transfer.MESSAGES, {
          name: "Server",
          payload: `Room leader ${noElo ? "disabled" : "enabled"} ELO gain for this game.`,
          avatar: this.state.users.get(client.auth.uid)?.avatar,
          time: Date.now()
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnKickPlayerCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: string
  }
> {
  execute({ client, message }) {
    try {
      if (client.auth.uid === this.state.ownerId) {
        this.room.clients.forEach((cli) => {
          if (cli.auth.uid === message) {
            this.room.broadcast(Transfer.MESSAGES, {
              name: "Server",
              payload: `${this.state.users.get(message).name} was kicked by ${
                this.state.ownerName
              }.`,
              avatar: this.state.users.get(client.auth.uid)?.avatar,
              time: Date.now()
            })
            cli.send(Transfer.KICK)
            cli.leave()
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnLeaveCommand extends Command<
  PreparationRoom,
  {
    client: Client
    consented: boolean
  }
> {
  execute({ client, consented }) {
    try {
      if (client.auth?.uid) {
        const user = this.state.users.get(client.auth.uid)
        if (user) {
          this.room.broadcast(Transfer.MESSAGES, {
            name: "Server",
            payload: `${user.name} left.`,
            avatar: user.avatar,
            time: Date.now()
          })
          this.state.users.delete(client.auth.uid)
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnToggleReadyCommand extends Command<
  PreparationRoom,
  {
    client: Client
  }
> {
  execute({ client }) {
    try {
      // logger.log(this.state.users.get(client.auth.uid).ready);
      if (client.auth.uid && this.state.users.has(client.auth.uid)) {
        this.state.users.get(client.auth.uid).ready = !this.state.users.get(
          client.auth.uid
        ).ready
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class InitializeBotsCommand extends Command<
  PreparationRoom,
  {
    ownerId: string
  }
> {
  execute(ownerId) {
    try {
      UserMetadata.findOne(
        { uid: ownerId },
        (err: any, user: IUserMetadata) => {
          if (!user) {
            return
          }

          const difficulty = { $gt: user.elo - 100, $lt: user.elo + 100 }

          BotV2.find({ elo: difficulty }, ["avatar", "elo", "name"], null)
            .limit(7)
            .exec((err, bots) => {
              if (!bots) {
                return
              }
              bots.forEach((bot) => {
                this.state.users.set(
                  bot.avatar,
                  new GameUser(
                    bot.avatar,
                    bot.name,
                    bot.elo,
                    bot.avatar,
                    true,
                    true,
                    "",
                    Role.BOT,
                    false
                  )
                )
              })
            })
        }
      )
    } catch (error) {
      logger.error(error)
    }
  }
}

type OnAddBotPayload = {
  type: IBot | BotDifficulty
  user: IUserMetadata
}

export class OnAddBotCommand extends Command<PreparationRoom, OnAddBotPayload> {
  async execute(data: OnAddBotPayload) {
    if (this.state.users.size >= 8) {
      return
    }

    const { type, user } = data
    const bot: IBot = typeof type === "object" ? type : await new Promise(resolve => {
      const difficulty = type
      let d

      switch (difficulty) {
        case BotDifficulty.EASY:
          d = { $lt: 800 }
          break
        case BotDifficulty.MEDIUM:
          d = { $gte: 800, $lt: 1100 }
          break
        case BotDifficulty.HARD:
          d = { $gte: 1100, $lt: 1400 }
          break
        case BotDifficulty.EXTREME:
          d = { $gte: 1400 }
          break
      }

      const userArray = new Array<string>()
      this.state.users.forEach((value: GameUser, key: string) => {
        if (value.isBot) {
          userArray.push(key)
        }
      })

      BotV2.find(
        { id: { $nin: userArray }, elo: d },
        ["avatar", "elo", "name", "id"],
        null,
        (err, bots) => {
          if(err) return logger.error(err)
          if (bots.length <= 0) {
            this.room.broadcast(Transfer.MESSAGES, {
              name: user.displayName,
              payload: "Error: No bots found",
              avatar: user.avatar,
              time: Date.now()
            })
            return
          }

          if (this.state.users.size >= 8) {
            return
          } else {
            const bot = pickRandomIn(bots)
            resolve(bot)
          }
        }
      )
    })

    this.state.listBots = null
    this.state.users.set(
      bot.id,
      new GameUser(
        bot.id,
        bot.name,
        bot.elo,
        bot.avatar,
        true,
        true,
        "",
        Role.BOT,
        false
      )
    )
    
    this.room.broadcast(Transfer.MESSAGES, {
      name: user.displayName,
      payload: `Bot ${bot.name} added.`,
      avatar: user.avatar,
      time: Date.now()
    })
  }
}

export class OnRemoveBotCommand extends Command<
  PreparationRoom,
  {
    target?: string | undefined
    user?: IUserMetadata | undefined
  }
> {
  execute({ target, user }) {
    try {
      // if no message, delete a random bot
      if (!target) {
        // let botDeleted = false;
        const keys = this.state.users.keys()
        while (!keys.done) {
          const key = keys.next().value
          if (this.state.users.get(key).isBot) {
            this.room.broadcast(Transfer.MESSAGES, {
              name: user?.displayName ? user.displayName : "Server",
              payload: `Bot ${key} removed to make room for new player.`,
              avatar: user?.avatar ? user.avatar : `0081/${Emotion.NORMAL}`,
              time: Date.now()
            })
            this.state.users.delete(key)
            // botDeleted = true;
            return
          }
        }
        logger.log("no bots in lobby")
        return
      }

      const name = this.state.users.get(target)?.name
      if (name && this.state.users.delete(target)) {
        this.room.broadcast(Transfer.MESSAGES, {
          name: user?.displayName ? user.displayName : "Server",
          payload: `Bot ${name} removed.`,
          avatar: user?.avatar ? user.avatar : `0081/${Emotion.NORMAL}`,
          time: Date.now()
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnListBotsCommand extends Command<PreparationRoom> {
  execute(data: { user: IUserMetadata }) {
    try {
      if (this.state.users.size >= 8) {
        return
      }

      const userArray = new Array<string>()

      this.state.users.forEach((value: GameUser, key: string) => {
        if (value.isBot) {
          userArray.push(key)
        }
      })

      const { user } = data

      BotV2.find(
        { id: { $nin: userArray } },
        ["avatar", "elo", "name", "id"],
        null,
        (err, bots) => {
          if(err) return logger.error(err)
          if (bots.length <= 0) {
            this.room.broadcast(Transfer.MESSAGES, {
              name: user.displayName,
              payload: `Error: No bots found`,
              avatar: user.avatar,
              time: Date.now()
            })
            return
          }

          this.room.clients.forEach((client) => {
            if (client.auth.uid === this.state.ownerId) {
              client.send(Transfer.REQUEST_BOT_LIST, bots)
            }
          })
        }
      )
    } catch (error) {
      logger.error(error)
    }
  }
}
