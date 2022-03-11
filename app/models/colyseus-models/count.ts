import {Schema, type} from '@colyseus/schema';

export default class BattleResult extends Schema {
  @type('uint8') crit: number;
  @type('uint8') ult: number;
  @type('uint8') petalDanceCount: number;
  @type('uint8') fieldCount: number;
  @type('uint8') soundCount: number;
  @type('uint8') fairyCritCount: number;
  @type('uint8') attackCount: number;
  @type('uint8') growGroundCount: number;
  @type('uint8') dodgeCount: number;
  @type('uint8') incenseCount: number;
  @type('uint8') staticCount: number;
  @type('uint8') brightPowderCount: number;
  @type('uint8') doubleAttackCount: number;
  @type('uint8') staticHolderCount: number;
  @type('uint8') defensiveRibbonCount: number;
}
