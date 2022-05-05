/* eslint-disable @typescript-eslint/no-inferrable-types */
import {Schema, type} from '@colyseus/schema';
import { ICount } from '../../types';

export default class Count extends Schema implements ICount{
  @type('uint8') crit: number = 0;
  @type('uint8') ult: number = 0;
  @type('uint8') petalDanceCount: number = 0;
  @type('uint8') fieldCount: number = 0;
  @type('uint8') soundCount: number = 0;
  @type('uint8') fairyCritCount: number = 0;
  @type('uint8') attackCount: number = 0;
  @type('uint8') growGroundCount: number = 0;
  @type('uint8') dodgeCount: number = 0;
  @type('uint8') incenseCount: number = 0;
  @type('uint8') staticCount: number = 0;
  @type('uint8') brightPowderCount: number = 0;
  @type('uint8') doubleAttackCount: number = 0;
  @type('uint8') staticHolderCount: number = 0;
  @type('uint8') defensiveRibbonCount: number = 0;
  @type('uint8') monsterExecutionCount: number = 0;
}
