import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema"
import LobbyUser from "../../models/colyseus-models/lobby-user"
import Message from "../../models/colyseus-models/message"
import chatV2 from "../../models/mongo-models/chat-v2"

export default class LobbyState extends Schema {
  @type([Message]) messages = new ArraySchema<Message>()
  @type({ map: LobbyUser }) users = new MapSchema<LobbyUser>()

  addMessage(
    id: string,
    payload: string,
    authorId: string,
    author: string,
    avatar: string,
    time: number,
    save: boolean
  ) {
    const message = new Message(id, payload, authorId, author, avatar, time)
    this.messages.push(message)
    if (save) {
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
    const messageIndex = this.messages.findIndex((m) => m.id === id)
    if (messageIndex !== -1) {
      this.messages.splice(messageIndex, 1)
    }
    chatV2.deleteMany({ id: id })
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
}
