import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema"
import { CronTime } from "cron"
import { nanoid } from "nanoid"
import LobbyUser from "../../models/colyseus-models/lobby-user"
import Message from "../../models/colyseus-models/message"
import chatV2 from "../../models/mongo-models/chat-v2"
import { RANKED_LOBBY_CRON, SCRIBBLE_LOBBY_CRON } from "../../types/Config"
import { GameMode } from "../../types/enum/Game"

export default class LobbyState extends Schema {
  @type([Message]) messages = new ArraySchema<Message>()
  @type({ map: LobbyUser }) users = new MapSchema<LobbyUser>()
  @type("string") nextSpecialGameDate: string = ""
  @type("string") nextSpecialGameMode: GameMode | "" = ""

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

  getNextSpecialGameDate() {
    const getNextDate = (t: string) =>
      new CronTime(t, "Europe/Paris").sendAt().toUnixInteger()
    const nextRanked = getNextDate(RANKED_LOBBY_CRON)
    const nextScribble = getNextDate(SCRIBBLE_LOBBY_CRON)
    const nextSpecialGameDateInt = Math.min(nextRanked, nextScribble)
    this.nextSpecialGameDate = new Date(
      nextSpecialGameDateInt * 1000
    ).toISOString()

    if (nextSpecialGameDateInt === nextRanked) {
      this.nextSpecialGameMode = GameMode.RANKED
    } else if (nextSpecialGameDateInt === nextScribble) {
      this.nextSpecialGameMode = GameMode.SCRIBBLE
    }
  }
}
