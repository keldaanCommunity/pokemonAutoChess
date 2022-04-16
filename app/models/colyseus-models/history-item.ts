import {Schema, type} from '@colyseus/schema';
import { BattleResult } from '../../types/enum/Game';

export default class HistoryItem extends Schema {
  @type('string') name: string;
  @type('uint8') result: BattleResult;
  @type('string') avatar: string;
  @type('boolean') isPVE: boolean;
  
  constructor(name: string, result: BattleResult, avatar: string, isPVE: boolean) {
    super();
    this.name = name;
    this.result = result;
    this.avatar = avatar;
    this.isPVE = isPVE;  
  }
}

