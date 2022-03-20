import {GameUser} from '../../models/colyseus-models/game-user';
import {Schema, MapSchema, type} from '@colyseus/schema';

export interface IPreparationState {
  users: Map <string,GameUser>,
  gameStarted: boolean,
  ownerId: string,
  ownerName: string
}

export default class PreparationState extends Schema implements IPreparationState{
  @type({map: GameUser}) users = new MapSchema<GameUser>();
  @type('boolean') gameStarted: boolean;
  @type('string') ownerId: string;
  @type('string') ownerName: string;

  constructor(ownerId: string) {
    super();
    this.ownerId = ownerId;
  }
}