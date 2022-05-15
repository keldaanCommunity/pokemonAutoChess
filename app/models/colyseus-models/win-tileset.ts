import {Schema, type} from '@colyseus/schema'

export default class WinTileset extends Schema {
  @type('uint16') FIRE = 0
  @type('uint16') ICE = 0
  @type('uint16') GROUND = 0
  @type('uint16') NORMAL = 0
  @type('uint16') GRASS = 0
  @type('uint16') WATER = 0
}