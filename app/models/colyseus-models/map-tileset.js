const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class MapTileset extends Schema {
  constructor(map) {
    super();
    // console.log(map);
    this.assign({
      FIRE: map.FIRE,
      ICE: map.ICE,
      GROUND: map.GROUND,
      NORMAL: map.NORMAL,
      GRASS: map.GRASS,
      WATER: map.WATER
    });
  }
}

schema.defineTypes(MapTileset, {
  FIRE: 'string',
  ICE: 'string',
  GROUND: 'string',
  NORMAL: 'string',
  GRASS: 'string',
  WATER: 'string'
});

module.exports = MapTileset;
