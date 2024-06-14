import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { CronTime } from "cron"
import { nanoid } from "nanoid"
import LobbyUser from "../../models/colyseus-models/lobby-user"
import Message from "../../models/colyseus-models/message"
import { TournamentSchema } from "../../models/colyseus-models/tournament"
import { SpecialGamePlannedSchema } from "../../models/colyseus-models/lobby"
import chatV2 from "../../models/mongo-models/chat-v2"
import tournament from "../../models/mongo-models/tournament"
import {
  GREATBALL_RANKED_LOBBY_CRON,
  ULTRABALL_RANKED_LOBBY_CRON,
  SCRIBBLE_LOBBY_CRON
} from "../../types/Config"
import { EloRank } from "../../types/enum/EloRank"
import { GameMode } from "../../types/enum/Game"
import { ISpecialGamePlanned } from "../../types/interfaces/Lobby"
import { logger } from "../../utils/logger"

export default class LobbyState extends Schema {
  @type([Message]) messages = new ArraySchema<Message>()
  @type({ map: LobbyUser }) users = new MapSchema<LobbyUser>()
  @type(SpecialGamePlannedSchema) nextSpecialGame: ISpecialGamePlanned | null =
    null
  @type([TournamentSchema]) tournaments = new ArraySchema<TournamentSchema>()

  addMessage(
    payload: string,
    authorId: string,
    author: string,
    avatar: string
  ) {
    const id = nanoid()
    const time = Date.now()
    const message = new Message(id, payload, authorId, author, avatar, time)
    chatV2
      .create({
        id: id,
        payload: payload,
        authorId: authorId,
        author: author,
        avatar: avatar,
        time: time
      })
      .then(() => {
        this.messages.push(message)
      })
  }

  removeMessage(id: string) {
    chatV2.deleteMany({ id: id }).then((result) => {
      //logger.debug("deleted message id", id, result)
      const messageIndex = this.messages.findIndex((m) => m.id === id)
      if (messageIndex !== -1) {
        this.messages.splice(messageIndex, 1)
      }
    })
  }

  removeMessages(authorId: string) {
    let i = this.messages.length
    while (i--) {
      if (this.messages[i].authorId === authorId) {
        this.messages.splice(i, 1)
      }
    }
    chatV2.deleteMany({ authorId: authorId })
  }

  addAnnouncement(message: string) {
    this.addMessage(message, "server", "Server Announcement", "0294/Joyous")
  }

  getNextSpecialGame() {
    const getNextDate = (t: string) =>
      new CronTime(t, "Europe/Paris").sendAt().toUnixInteger()
    const nextGreatballRanked = getNextDate(GREATBALL_RANKED_LOBBY_CRON)
    const nextUltraballRanked = getNextDate(ULTRABALL_RANKED_LOBBY_CRON)
    const nextScribble = getNextDate(SCRIBBLE_LOBBY_CRON)
    const nextSpecialGameDateInt = Math.min(
      nextGreatballRanked,
      nextUltraballRanked,
      nextScribble
    )
    const nextSpecialGameDate = new Date(
      nextSpecialGameDateInt * 1000
    ).toISOString()

    if (nextSpecialGameDateInt === nextGreatballRanked) {
      this.nextSpecialGame = new SpecialGamePlannedSchema(
        GameMode.RANKED,
        nextSpecialGameDate,
        EloRank.GREATBALL
      )
    } else if (nextSpecialGameDateInt === nextGreatballRanked) {
      this.nextSpecialGame = new SpecialGamePlannedSchema(
        GameMode.RANKED,
        nextSpecialGameDate,
        EloRank.ULTRABALL
      )
    } else if (nextSpecialGameDateInt === nextScribble) {
      this.nextSpecialGame = new SpecialGamePlannedSchema(
        GameMode.SCRIBBLE,
        nextSpecialGameDate
      )
    }
  }

  async createTournament(name: string, startDate: string) {
    const id = nanoid()
    logger.debug(`creating tournament id ${id}`)
    return tournament.create({
      id,
      name,
      startDate,
      brackets: new Map(),
      players: new Map(),
      finished: false
    })
  }

  removeTournament(id: string) {
    tournament.findByIdAndDelete(id).then((result) => {
      logger.debug(`deleted tournament id ${id}`)
      const tournamentIndex = this.tournaments.findIndex((m) => m.id === id)
      if (tournamentIndex !== -1) {
        this.tournaments.splice(tournamentIndex, 1)
      }
    })
  }
}
