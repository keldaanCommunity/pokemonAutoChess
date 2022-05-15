import {Schema, type} from '@colyseus/schema'
import { IDps } from '../types'

export default class Dps extends Schema implements IDps{
  @type('string') id: string
  @type('string') name: string
  @type('uint16') physicalDamage = 0
  @type('uint16') specialDamage = 0
  @type('uint16') trueDamage = 0

  constructor(id: string, name: string) {
    super()
    this.id = id
    this.name = name
  }

  changeDamage(physicalDamage: number, specialDamage: number, trueDamage: number) {
    if (this.physicalDamage != physicalDamage) {
      this.physicalDamage = physicalDamage
    }
    if (this.specialDamage != specialDamage) {
      this.specialDamage = specialDamage
    }
    if (this.trueDamage != trueDamage) {
      this.trueDamage = trueDamage
    }
  }
}