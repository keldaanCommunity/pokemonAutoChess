import {GameUser} from '../../models/colyseus-models/game-user';
import {Schema, MapSchema, type} from '@colyseus/schema';

export default class PreparationState extends Schema {
  @type({map: GameUser}) users = new MapSchema<GameUser>();
  @type('boolean') gameStarted: boolean;
  @type('string') ownerId: string;
  @type('string') ownerName: string;

  constructor(ownerId: string) {
    super();
    this.ownerId = ownerId;
  }
}