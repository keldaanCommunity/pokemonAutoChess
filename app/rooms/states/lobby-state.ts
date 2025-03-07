import { ArraySchema, Schema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import Message from "../../models/colyseus-models/message"
import { TournamentSchema } from "../../models/colyseus-models/tournament"
import chatV2 from "../../models/mongo-models/chat-v2"
import tournament from "../../models/mongo-models/tournament"
import { logger } from "../../utils/logger"

export default class LobbyState extends Schema {
  @type([Message]) messages = new ArraySchema<Message>()
  @type([TournamentSchema]) tournaments = new ArraySchema<TournamentSchema>()
  @type("number") ccu = 0

  addMessage(
    payload: string,
    authorId: string,
    author: string,
    avatar: string
  ) {
    const id = nanoid()
    const time = Date.now()
    const message = new Message(id, payload, authorId, author, avatar, time)
    this.messages.push(message)
    if (author) {
      chatV2.create({
        id: id,
        payload: payload,
        authorId: authorId,
        author: author,
        avatar: avatar,
        time: time
      })
    }
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
      if (this.messages[i]?.authorId === authorId) {
        this.messages.splice(i, 1)
      }
    }
    chatV2.deleteMany({ authorId: authorId })
  }

  addAnnouncement(message: string) {
    this.addMessage(message, "server", "Server Announcement", "0294/Joyous")
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
