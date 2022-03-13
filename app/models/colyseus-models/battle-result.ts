import {Schema, type} from '@colyseus/schema';

export default class BattleResult extends Schema {
  @type('string') name: string;
  @type('string') result: string;
  @type('string') avatar: string;
  @type('boolean') isPVE: boolean;
  
  constructor(name: string, result: string, avatar: string, isPVE: boolean) {
    super();
    this.name = name;
    this.result = result;
    this.avatar = avatar;
    this.isPVE = isPVE;  
  }
}

