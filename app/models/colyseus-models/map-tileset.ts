import {Schema, type} from '@colyseus/schema';

export default class MapTileset extends Schema {
  @type('string') FIRE = 'FIRE0';
  @type('string') ICE = 'ICE0';
  @type('string') GROUND = 'GROUND0';
  @type('string') NORMAL = 'NORMAL0';
  @type('string') GRASS = 'GRASS0';
  @type('string') WATER = 'WATER0';
}