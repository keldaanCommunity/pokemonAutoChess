import {Schema, type} from '@colyseus/schema';

export default class BattleResult extends Schema {
  @type('string') name: string;
  @type('string') result: string;
  @type('string') avatar: string;
  @type('boolean') isPVE: boolean;
}

