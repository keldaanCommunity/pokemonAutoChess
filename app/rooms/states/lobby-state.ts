import {Schema, MapSchema, type, ArraySchema} from '@colyseus/schema'
import LeaderboardInfo from '../../models/colyseus-models/leaderboard-info'
import LobbyUser from '../../models/colyseus-models/lobby-user'
import Message from '../../models/colyseus-models/message'
import chat from '../../models/mongo-models/chat'

export default class LobbyState extends Schema {

  @type([Message]) messages = new ArraySchema<Message>()
  @type({map: LobbyUser}) users = new MapSchema<LobbyUser>()
  @type([LeaderboardInfo]) leaderboard = new ArraySchema<LeaderboardInfo>()
  @type([LeaderboardInfo]) botLeaderboard = new ArraySchema<LeaderboardInfo>()


  addMessage(name: string, payload: string, avatar: string, time: number, save: boolean) {
    const message = new Message(name, payload, avatar, time)
    this.messages.push(message)
    if (save) {
      chat.create({'name': message.name, 'avatar': message.avatar, 'payload': message.payload, 'time': message.time})
    }
  }
  removeMessage(name:string, payload: string){
    const messageIndex = this.messages.findIndex(m=>m.name === name && m.payload === payload)
    if(messageIndex !== -1){
      this.messages.splice(messageIndex, 1)
    }
    chat.deleteMany({name: name, payload: payload})
  }
}
