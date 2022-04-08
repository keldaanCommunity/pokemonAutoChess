import {Schema, type} from '@colyseus/schema';
import { BattleResults } from '../../types/enum/Game';

export default class BattleResult extends Schema {
  @type('string') name: string;
  @type('number') result: BattleResults;
  @type('string') avatar: string;
  @type('boolean') isPVE: boolean;
  
  constructor(name: string, result: BattleResults, avatar: string, isPVE: boolean) {
    super();
    this.name = name;
    this.result = result;
    this.avatar = avatar;
    this.isPVE = isPVE;  
  }
}

