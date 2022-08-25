import {Schema, type} from '@colyseus/schema'
import { ICount } from '../../types'

export default class Count extends Schema implements ICount{
  @type('uint8') crit = 0
  @type('uint8') ult = 0
  @type('uint8') petalDanceCount = 0
  @type('uint8') fieldCount = 0
  @type('uint8') soundCount = 0
  @type('uint8') fairyCritCount = 0
  @type('uint8') attackCount = 0
  @type('uint8') growGroundCount = 0
  @type('uint8') dodgeCount = 0
  @type('uint8') incenseCount = 0
  @type('uint8') staticCount = 0
  @type('uint8') brightPowderCount = 0
  @type('uint8') doubleAttackCount = 0
  @type('uint8') staticHolderCount = 0
  @type('uint8') defensiveRibbonCount = 0
  @type('uint8') monsterExecutionCount = 0
  @type('uint8') earthquakeCount = 0
  @type('uint8') mindBlownCount = 0
}
