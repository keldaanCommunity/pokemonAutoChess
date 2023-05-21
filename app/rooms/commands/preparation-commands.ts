import os from "node:os"
import { Command } from "@colyseus/command"
import { GameUser, IGameUser } from "../../models/colyseus-models/game-user"
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
import { entries, values } from "../../utils/schemas"
import { MAX_PLAYERS_PER_LOBBY } from "../../types/Config"

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
      if (this.state.users.size >= MAX_PLAYERS_PER_LOBBY) {
        return // lobby already full
      }
      if (this.state.ownerId == "") {
        this.state.ownerId = auth.uid
      }
      if (this.state.users.has(auth.uid)) {
        const user = this.state.users.get(auth.uid)!
        this.room.broadcast(Transfer.MESSAGES, {
          name: "Server",
          payload: `${user.name} joined.`,
          avatar: user.avatar,
          time: Date.now()
        })
      } else {
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
                // logger.debug(user.displayName);
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
      }

      if (this.state.users.size >= MAX_PLAYERS_PER_LOBBY) {
        return [new OnRemoveBotCommand().setPayload({ target: undefined })]
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnGameStartRequestCommand extends Command<
  PreparationRoom,
  {
    client: Client
  }
> {
  execute({ client }) {
    try {
      if (this.state.gameStarted) {
        return // game already started
      }
      let allUsersReady = true
      let nbHumanPlayers = 0

      this.state.users.forEach((user: GameUser) => {
        if (!user.ready) {
          allUsersReady = false
        }
        if (!user.isBot) {
          nbHumanPlayers++
        }
      })

      if (!allUsersReady) {
        client.send(Transfer.MESSAGES, {
          name: "Server",
          payload: `Not all players are ready.`,
          avatar: "0079/Sigh",
          time: Date.now()
        })
      } else {
        const freeMemory = os.freemem()
        const totalMemory = os.totalmem()
        logger.info(
          `Memory: ${((100 * freeMemory) / totalMemory).toFixed(2)} % free (${
            totalMemory - freeMemory
          } / ${totalMemory})`
        )
        if (process.env?.MODE === "dev") {
          client.send(Transfer.GAME_START_REQUEST, "ok")
        } else if (freeMemory < 0.1 * totalMemory) {
          // if less than 10% free memory available, prevents starting another game to avoid out of memory crash
          this.room.broadcast(Transfer.MESSAGES, {
            name: "Server",
            payload: `Too many players are currently playing and the server is running out of memory. Try again in a few minutes, and avoid playing with bots. Sorry for the inconvenience.`,
            avatar: "0025/Pain",
            time: Date.now()
          })
        } else if (
          freeMemory < 0.2 * totalMemory &&
          nbHumanPlayers < MAX_PLAYERS_PER_LOBBY
        ) {
          // if less than 20% free memory available, prevents starting a game with bots
          this.room.broadcast(Transfer.MESSAGES, {
            name: "Server",
            payload: `Too many players are currently playing and the server is running out of memory. To save resources, only lobbys with ${MAX_PLAYERS_PER_LOBBY} human players are enabled. Sorry for the inconvenience.`,
            avatar: "0025/Pain",
            time: Date.now()
          })
        } else if (freeMemory < 0.4 * totalMemory && nbHumanPlayers === 1) {
          // if less than 40% free memory available, prevents starting a game solo
          this.room.broadcast(Transfer.MESSAGES, {
            name: "Server",
            payload: `Too many players are currently playing and the server is running out of memory. To save resources, solo games have been disabled. Please wait for more players to join the lobby before starting the game. Sorry for the inconvenience.`,
            avatar: "0025/Pain",
            time: Date.now()
          })
        } else {
          client.send(Transfer.GAME_START_REQUEST, "ok")
        }
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
      this.state.gameStarted = true
      this.room.broadcast(Transfer.GAME_START, message, { except: client })
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
      if (
        client.auth.uid == this.state.ownerId &&
        this.state.password != password
      ) {
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
          payload: `Room leader ${
            noElo ? "disabled" : "enabled"
          } ELO gain for this game.`,
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
  execute({ client, message: userId }) {
    try {
      if (client.auth.uid === this.state.ownerId) {
        this.room.clients.forEach((cli) => {
          if (cli.auth.uid === userId && this.state.users.has(userId)) {
            const user = this.state.users.get(userId)!
            this.room.broadcast(Transfer.MESSAGES, {
              name: "Server",
              payload: `${user.name} was kicked by ${this.state.ownerName}.`,
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

          if (client.auth.uid === this.state.ownerId) {
            const newOwner = values(this.state.users).find(
              (user) => user.id !== this.state.ownerId
            )
            if (newOwner) {
              this.state.ownerId = newOwner.id
              this.state.ownerName = newOwner.name
              this.room.broadcast(Transfer.MESSAGES, {
                name: "Server",
                payload: `The new room leader is ${newOwner.name}`,
                avatar: newOwner.avatar,
                time: Date.now()
              })
            }
          }
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
      // logger.debug(this.state.users.get(client.auth.uid).ready);
      if (client.auth.uid && this.state.users.has(client.auth.uid)) {
        const user = this.state.users.get(client.auth.uid)!
        user.ready = !user.ready
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
  user: IGameUser
}

export class OnAddBotCommand extends Command<PreparationRoom, OnAddBotPayload> {
  async execute(data: OnAddBotPayload) {
    if (this.state.users.size >= MAX_PLAYERS_PER_LOBBY) {
      return
    }

    const { type, user } = data
    const bot: IBot =
      typeof type === "object"
        ? type
        : await new Promise((resolve) => {
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
                if (err) return logger.error(err)
                if (bots.length <= 0) {
                  this.room.broadcast(Transfer.MESSAGES, {
                    name: user.name,
                    payload: "Error: No bots found",
                    avatar: user.avatar,
                    time: Date.now()
                  })
                  return
                }

                if (this.state.users.size >= MAX_PLAYERS_PER_LOBBY) {
                  return
                } else {
                  const bot = pickRandomIn(bots)
                  resolve(bot)
                }
              }
            )
          })

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
      name: user.name,
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
    user?: IGameUser | undefined
  }
> {
  execute({ target, user }) {
    try {
      // if no message, delete a random bot
      if (!target) {
        const users = entries(this.state.users)
        const entryToDelete = users.find(([key, user]) => user.isBot)
        if (entryToDelete) {
          const [key, bot] = entryToDelete
          this.room.broadcast(Transfer.MESSAGES, {
            name: user?.displayName ?? "Server",
            payload: `Bot ${bot.name} removed to make room for new player.`,
            avatar: user?.avatar ? user.avatar : `0081/${Emotion.NORMAL}`,
            time: Date.now()
          })
          this.state.users.delete(key)
        }
        logger.info("no bots in lobby")
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
      if (this.state.users.size >= MAX_PLAYERS_PER_LOBBY) {
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
          if (err) return logger.error(err)
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
