import {Schema, MapSchema, type} from '@colyseus/schema';
import { GameUser } from '../../models/colyseus-models/game-user';
import SimplePlayer from '../../models/colyseus-models/simple-player';

export default class AfterGameState extends Schema {
  @type({map: GameUser}) users = new MapSchema<GameUser>();
  @type({map: SimplePlayer}) players = new MapSchema<SimplePlayer>();
}