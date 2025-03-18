import { memoryUsage } from "node:process"
import { Command } from "@colyseus/command"
import { Client, matchMaker } from "colyseus"
import { FilterQuery } from "mongoose"
import { GameUser, IGameUser } from "../../models/colyseus-models/game-user"
import { BotV2, IBot } from "../../models/mongo-models/bot-v2"
import UserMetadata from "../../models/mongo-models/user-metadata"
import { Role } from "../../types"
import {
  EloRank,
  EloRankThreshold,
  MAX_PLAYERS_PER_GAME,
  MIN_HUMAN_PLAYERS
} from "../../types/Config"
import { BotDifficulty, GameMode } from "../../types/enum/Game"
import { logger } from "../../utils/logger"
import { max } from "../../utils/number"
import { cleanProfanity } from "../../utils/profanity-filter"
import { pickRandomIn } from "../../utils/random"
import { entries, values } from "../../utils/schemas"
import PreparationRoom from "../preparation-room"
import { CloseCodes } from "../../types/enum/CloseCodes"
import { getRank } from "../../utils/elo"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { UserRecord } from "firebase-admin/lib/auth/user-record"
import { setTimeout } from "node:timers/promises"

export class OnJoinCommand extends Command<
  PreparationRoom,
  {
    client: Client<undefined, UserRecord>
    options: any
    auth: UserRecord
  }
> {
  async execute({ client, options, auth }) {
    try {
      const timeoutDateStr = await this.room.presence.hget(
        client.auth.uid,
        "user_timeout"
      )
      if (timeoutDateStr) {
        const timeout = new Date(timeoutDateStr).getTime()
        if (timeout > Date.now()) {
          client.leave(CloseCodes.USER_TIMEOUT)
          return
        }
      }
      if (
        this.state.ownerId == "" &&
        this.state.gameMode === GameMode.CUSTOM_LOBBY
      ) {
        this.state.ownerId = auth.uid
      }

      const u = await UserMetadata.findOne({ uid: auth.uid })
      if (!u) {
        client.leave(CloseCodes.USER_NOT_AUTHENTICATED)
        return
      }

      if (this.state.users.has(auth.uid)) {
        const user = this.state.users.get(auth.uid)!
        this.state.addMessage({
          authorId: "server",
          payload: `${user.name} is back.`,
          avatar: user.avatar
        })
      } else {
        const nbHumanPlayers = values(this.state.users).filter(
          (u) => !u.isBot
        ).length
        const isAdmin = u.role === Role.ADMIN
        if (nbHumanPlayers >= MAX_PLAYERS_PER_GAME && !isAdmin) {
          client.leave(CloseCodes.ROOM_FULL)
          return
        }

        if (
          this.state.minRank != null &&
          u.elo < EloRankThreshold[this.state.minRank] &&
          !isAdmin
        ) {
          client.leave(CloseCodes.USER_RANK_TOO_LOW)
          return
        }

        if (
          this.state.maxRank != null &&
          u.elo &&
          EloRankThreshold[getRank(u.elo)] >
            EloRankThreshold[this.state.maxRank] &&
          !isAdmin
        ) {
          client.leave(CloseCodes.USER_RANK_TOO_HIGH)
          return
        }

        this.state.users.set(
          client.auth.uid,
          new GameUser(
            u.uid,
            u.displayName,
            u.elo,
            u.avatar,
            false,
            false,
            u.title,
            u.role,
            auth.email === undefined && auth.photoURL === undefined
          )
        )
        this.room.updatePlayersInfo()

        if (u.uid == this.state.ownerId) {
          // logger.debug(user.displayName);
          this.state.ownerName = u.displayName
          this.room.setMetadata({
            ownerName: this.state.ownerName
          })
        }

        if (this.state.gameMode !== GameMode.CUSTOM_LOBBY) {
          this.clock.setTimeout(() => {
            if (
              this.state.users.has(u.uid) &&
              !this.state.users.get(u.uid)!.ready
            ) {
              this.state.users.delete(u.uid)
              client.leave(CloseCodes.USER_KICKED) // kick clients that can't auto-ready in time. Still investigating why this happens for some people
            }
          }, 10000)
        }

        this.state.addMessage({
          authorId: "server",
          payload: `${u.displayName} joined.`,
          avatar: u.avatar
        })
      }

      while (this.state.users.size > MAX_PLAYERS_PER_GAME) {
        // delete a random bot to make room
        const users = entries(this.state.users)
        const entryToDelete = users.find(([key, user]) => user.isBot)
        if (entryToDelete) {
          const [key, bot] = entryToDelete
          this.room.state.addMessage({
            authorId: "server",
            avatar: bot.avatar,
            payload: `Bot ${bot.name} removed to make room for new player.`
          })
          this.state.users.delete(key)
        } else {
          throw new Error(
            `There is more than 8 players in the lobby which was not supposed to happen`
          )
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnGameStartRequestCommand extends Command<
  PreparationRoom,
  {
    client?: Client
  }
> {
  async execute({ client }: { client?: Client } = {}) {
    try {
      if (this.state.gameStartedAt != null) {
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

      if (nbHumanPlayers < MIN_HUMAN_PLAYERS && process.env.MODE !== "dev") {
        this.state.addMessage({
          authorId: "Server",
          payload: `Due to the current high traffic on the game, to limit the resources used server side, only games with a minimum of ${MIN_HUMAN_PLAYERS} players are authorized.`,
          avatar: "0054/Surprised"
        })
        return
      }

      if (this.state.users.size < 2) {
        this.state.addMessage({
          authorId: "Server",
          payload: `Add bots or wait for more players to join your room.`,
          avatar: "0079/Sigh"
        })
        return
      }

      if (!allUsersReady && this.state.gameMode === GameMode.CUSTOM_LOBBY) {
        this.state.addMessage({
          authorId: "Server",
          payload: `Not all players are ready.`,
          avatar: "0079/Sigh"
        })
        return
      }

      /*let freeMemory = os.freemem()
      let totalMemory = os.totalmem()
      logger.info(
          `Memory freemem/totalmem: ${(
            (100 * freeMemory) /
            totalMemory
          ).toFixed(2)} % free (${totalMemory - freeMemory} / ${totalMemory})`
        )*/
      const freeMemory = memoryUsage().heapUsed
      const totalMemory = memoryUsage().heapTotal
      /*logger.info(
          `Memory heapUsed/heapTotal: ${(
            (100 * freeMemory) /
            totalMemory
          ).toFixed(2)} % free (${totalMemory - freeMemory} / ${totalMemory})`
        )*/

      if (freeMemory < 0.1 * totalMemory) {
        // if less than 10% free memory available, prevents starting another game to avoid out of memory crash
        this.state.addMessage({
          author: "Server",
          authorId: "server",
          payload: `Too many players are currently playing and the server is running out of memory. Try again in a few minutes, and avoid playing with bots. Sorry for the inconvenience.`,
          avatar: "0025/Pain"
        })
      } else if (
        freeMemory < 0.2 * totalMemory &&
        nbHumanPlayers < MAX_PLAYERS_PER_GAME
      ) {
        // if less than 20% free memory available, prevents starting a game with bots
        this.state.addMessage({
          author: "Server",
          authorId: "server",
          payload: `Too many players are currently playing and the server is running out of memory. To save resources, only lobbys with ${MAX_PLAYERS_PER_GAME} human players are enabled. Sorry for the inconvenience.`,
          avatar: "0025/Pain"
        })
      } else if (freeMemory < 0.4 * totalMemory && nbHumanPlayers === 1) {
        // if less than 40% free memory available, prevents starting a game solo
        this.state.addMessage({
          author: "Server",
          authorId: "server",
          payload: `Too many players are currently playing and the server is running out of memory. To save resources, solo games have been disabled. Please wait for more players to join the lobby before starting the game. Sorry for the inconvenience.`,
          avatar: "0025/Pain"
        })
      } else {
        this.state.gameStartedAt = new Date().toISOString()
        this.room.lock()
        const gameRoom = await matchMaker.createRoom("game", {
          users: Object.fromEntries(entries(this.state.users)),
          name: this.state.name,
          ownerName: this.state.ownerName,
          preparationId: this.room.roomId,
          noElo: this.state.noElo,
          gameMode: this.state.gameMode,
          specialGameRule: this.state.specialGameRule,
          tournamentId: this.room.metadata?.tournamentId,
          bracketId: this.room.metadata?.bracketId,
          minRank: this.state.minRank
        })

        this.room.presence.publish("game-started", {
          gameId: gameRoom.roomId,
          preparationId: this.room.roomId
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnNewMessageCommand extends Command<
  PreparationRoom,
  { client: Client; message: string }
> {
  execute({ client, message }: { client: Client; message: string }) {
    try {
      const MAX_MESSAGE_LENGTH = 250
      message = cleanProfanity(message.substring(0, MAX_MESSAGE_LENGTH))

      const user = this.state.users.get(client.auth.uid)
      if (user && !user.anonymous && message != "") {
        this.state.addMessage({
          author: user.name,
          authorId: user.uid,
          avatar: user.avatar,
          payload: message
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class RemoveMessageCommand extends Command<
  PreparationRoom,
  { client: Client; messageId: string }
> {
  execute({ client, messageId }: { client: Client; messageId: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (
        user &&
        user.role &&
        (user.role === Role.ADMIN || user.role === Role.MODERATOR)
      ) {
        this.state.removeMessage(messageId)
      }
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
  execute({ client, message: roomName }) {
    roomName = cleanProfanity(roomName)
    try {
      const user = this.state.users.get(client.auth?.uid)
      if (
        this.state.name != roomName &&
        (client.auth?.uid == this.state.ownerId ||
          (user && [Role.ADMIN, Role.MODERATOR].includes(user.role)))
      ) {
        this.room.setName(roomName)
        this.state.name = roomName
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
        client.auth?.uid == this.state.ownerId &&
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

export class OnRoomChangeRankCommand extends Command<
  PreparationRoom,
  {
    client: Client
    minRank: EloRank | null
    maxRank: EloRank | null
  }
> {
  execute({ client, minRank, maxRank }) {
    try {
      if (
        client.auth?.uid == this.state.ownerId &&
        (minRank !== this.state.minRank || maxRank !== this.state.maxRank)
      ) {
        if (EloRankThreshold[minRank] > EloRankThreshold[maxRank]) {
          if (minRank !== this.state.minRank) maxRank = minRank
          else minRank = maxRank
        }

        this.room.setMinMaxRanks(minRank, maxRank)
        this.state.minRank = minRank
        this.state.maxRank = maxRank
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnRoomChangeSpecialRule extends Command<
  PreparationRoom,
  {
    client: Client
    specialRule: SpecialGameRule | null
  }
> {
  execute({ client, specialRule }) {
    try {
      if (client.auth?.uid == this.state.ownerId) {
        this.state.specialGameRule = specialRule
        if (specialRule != null) {
          this.state.noElo = true
          this.room.setNoElo(true)
        }
        const leader = this.state.users.get(client.auth.uid)
        this.room.state.addMessage({
          author: "Server",
          authorId: "server",
          payload: `Room leader ${
            specialRule ? "enabled" : "disabled"
          } Smeargle's Scribble for this game. Players need to ready again.`,
          avatar: leader?.avatar
        })

        this.state.users.forEach((user) => {
          if (!user.isBot) user.ready = false
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnChangeNoEloCommand extends Command<
  PreparationRoom,
  {
    client: Client
    message: boolean
  }
> {
  execute({ client, message: noElo }) {
    try {
      if (
        client.auth?.uid === this.state.ownerId &&
        this.state.noElo != noElo
      ) {
        this.state.noElo = noElo
        if (noElo === false) {
          this.room.state.specialGameRule = null
        }
        this.room.setNoElo(noElo)
        const leader = this.state.users.get(client.auth.uid)
        this.room.state.addMessage({
          author: "Server",
          authorId: "server",
          payload: `Room leader ${
            noElo ? "disabled" : "enabled"
          } ELO gain for this game. Players need to ready again.`,
          avatar: leader?.avatar
        })

        this.state.users.forEach((user) => {
          if (!user.isBot) user.ready = false
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
      const user = this.state.users.get(client.auth?.uid)
      if (
        client.auth?.uid === this.state.ownerId ||
        (user && [Role.ADMIN, Role.MODERATOR].includes(user.role))
      ) {
        this.room.clients.forEach((cli) => {
          if (cli.auth?.uid === userId && this.state.users.has(userId)) {
            const user = this.state.users.get(userId)!
            if (user.role === Role.BASIC) {
              this.room.state.addMessage({
                author: "Server",
                authorId: "server",
                payload: `${user.name} was kicked out of the room`,
                avatar: this.state.users.get(client.auth.uid)?.avatar
              })
              this.state.users.delete(userId)
              this.room.setMetadata({
                blacklist: this.room.metadata.blacklist.concat(userId)
              })
              cli.leave(CloseCodes.USER_KICKED)
            } else {
              this.room.state.addMessage({
                author: "Server",
                authorId: "server",
                payload: `${this.state.ownerName} tried to kick a moderator (${user.name}).`,
                avatar: "0068/Normal"
              })
            }
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnDeleteRoomCommand extends Command<
  PreparationRoom,
  {
    client: Client
  }
> {
  execute({ client }) {
    try {
      const user = this.state.users.get(client.auth?.uid)
      if (user && [Role.ADMIN, Role.MODERATOR].includes(user.role)) {
        this.room.clients.forEach((cli) => {
          cli.leave(CloseCodes.ROOM_DELETED)
        })
        this.room.disconnect()
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
        const user = this.state.users.get(client.auth?.uid)
        if (user) {
          this.room.state.addMessage({
            authorId: "server",
            payload: `${user.name} left.`,
            avatar: user.avatar
          })
          this.state.users.delete(client.auth.uid)

          if (client.auth.uid === this.state.ownerId) {
            const newOwner = values(this.state.users).find(
              (user) => user.uid !== this.state.ownerId && !user.isBot
            )
            if (newOwner) {
              this.state.ownerId = newOwner.uid
              this.state.ownerName = newOwner.name
              this.room.setMetadata({ ownerName: this.state.ownerName })
              this.room.setName(
                `${newOwner.name}'${
                  newOwner.name.endsWith("s") ? "" : "s"
                } room`
              )
              this.room.state.addMessage({
                authorId: "server",
                payload: `The new room leader is ${newOwner.name}`,
                avatar: newOwner.avatar
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
    ready: boolean
  }
> {
  execute({ client, ready }) {
    try {
      // cannot toggle ready in quick play / ranked / tournament game mode
      if (this.room.state.gameMode !== GameMode.CUSTOM_LOBBY && ready !== true)
        return

      // logger.debug(this.state.users.get(client.auth.uid).ready);
      if (client.auth?.uid && this.state.users.has(client.auth.uid)) {
        const user = this.state.users.get(client.auth.uid)!
        user.ready = ready
      }

      const nbExpectedPlayers =
        this.room.metadata?.whitelist &&
        this.room.metadata?.whitelist.length > 0
          ? max(MAX_PLAYERS_PER_GAME)(this.room.metadata?.whitelist.length)
          : MAX_PLAYERS_PER_GAME

      if (
        this.state.gameMode !== GameMode.CUSTOM_LOBBY &&
        this.state.users.size === nbExpectedPlayers &&
        values(this.state.users).every((user) => user.ready)
      ) {
        // auto start when ranked lobby is full and all ready
        this.room.state.addMessage({
          authorId: "server",
          payload: "Lobby is full, starting match in 5 seconds..."
        })

        return new CheckAutoStartRoom()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class CheckAutoStartRoom extends Command<PreparationRoom, void> {
  async execute() {
    try {
      this.state.abortOnPlayerLeave = new AbortController()
      const signal = this.state.abortOnPlayerLeave.signal
      await setTimeout(5000, null, { signal })

      this.room.state.addMessage({
        authorId: "server",
        payload: "Starting match..."
      })

      if ([GameMode.RANKED, GameMode.SCRIBBLE].includes(this.state.gameMode)) {
        // open another one
        this.room.presence.publish("lobby-full", {
          gameMode: this.state.gameMode,
          minRank: this.state.minRank,
          noElo: this.state.noElo
        })
      }

      return new OnGameStartRequestCommand()
    } catch (e) {
      this.room.state.addMessage({
        authorId: "server",
        payload: "Waiting for the room to fill up."
      })
    }
  }
}

export class InitializeBotsCommand extends Command<
  PreparationRoom,
  {
    ownerId: string
  }
> {
  async execute({ ownerId }) {
    try {
      const user = await UserMetadata.findOne({ uid: ownerId })
      if (user) {
        const difficulty = { $gt: user.elo - 100, $lt: user.elo + 100 }

        const bots = await BotV2.find({ elo: difficulty }, [
          "avatar",
          "elo",
          "name",
          "id"
        ]).limit(7)

        if (bots) {
          bots.forEach((bot) => {
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
          })
        }
        this.room.updatePlayersInfo()
      }
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
    try {
      if (this.state.users.size >= MAX_PLAYERS_PER_GAME) {
        this.room.state.addMessage({
          authorId: "server",
          payload: "Room is full"
        })
        return
      }

      const { type } = data
      let bot: IBot | undefined
      if (typeof type === "object") {
        // pick a specific bot chosen by the user
        bot = type
      } else {
        // pick a random bot per difficulty
        const difficulty = type
        let d: FilterQuery<IBot> | undefined

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

        const existingBots = new Array<string>()
        this.state.users.forEach((value: GameUser, key: string) => {
          if (value.isBot) {
            existingBots.push(key)
          }
        })

        const bots = await BotV2.find({ id: { $nin: existingBots }, elo: d }, [
          "avatar",
          "elo",
          "name",
          "id"
        ])

        if (bots.length <= 0) {
          this.room.state.addMessage({
            authorId: "server",
            payload: "Error: No bots found"
          })
          return
        }

        bot = pickRandomIn(bots)
      }

      if (bot) {
        // we checked again the lobby size because of the async request ahead
        if (this.state.users.size >= MAX_PLAYERS_PER_GAME) {
          this.room.state.addMessage({
            authorId: "server",
            payload: "Room is full"
          })
          return
        }

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

        this.room.updatePlayersInfo()
        this.room.state.addMessage({
          authorId: "server",
          payload: `Bot ${bot.name} added.`
        })
      }
    } catch (error) {
      logger.error(error)
    }
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
      const name = this.state.users.get(target)?.name
      if (name && this.state.users.delete(target)) {
        this.room.state.addMessage({
          authorId: "server",
          payload: `Bot ${name} removed.`
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
