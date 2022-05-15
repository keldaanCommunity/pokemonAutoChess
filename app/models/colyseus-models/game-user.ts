import {Schema, type} from '@colyseus/schema'
import MapTileset from './map-tileset'

export interface IGameUser {
  id: string;
  name: string;
  avatar: string;
  ready: boolean;
  isBot: boolean;
  elo: number;
}
export class GameUser extends Schema implements IGameUser{
  @type('string') id: string
  @type('string') name: string
  @type('string') avatar: string
  @type('boolean') ready: boolean
  @type('boolean') isBot: boolean
  @type('uint16') elo: number
  @type(MapTileset) map = new MapTileset()
  
  constructor(id: string, name: string, elo: number, avatar: string, isBot: boolean, ready: boolean) {
    super()
    this.id = id
    this.name = name
    this.avatar = avatar
    this.ready = ready
    this.isBot = isBot
    this.elo = elo
  }
}
