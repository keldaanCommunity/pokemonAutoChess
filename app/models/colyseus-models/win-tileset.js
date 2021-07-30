const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class WinTileset extends Schema {
  constructor(map) {
    super();
    //console.log(map);
    this.assign({
      FIRE:map.FIRE,
      ICE:map.ICE,
      GROUND:map.GROUND,
      NORMAL:map.NORMAL,
      GRASS:map.GRASS,
      WATER:map.WATER
    });
  }
}

schema.defineTypes(WinTileset, {
    FIRE: 'uint16',
    ICE: 'uint16',
    GROUND: 'uint16',
    NORMAL: 'uint16',
    GRASS: 'uint16',
    WATER: 'uint16'
});

module.exports = WinTileset;
