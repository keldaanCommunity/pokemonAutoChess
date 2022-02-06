const {MAP, MASK_TABLE, HDR, MASK_COORDINATE, TERRAIN} = require('../models/enum');

class Tileset {
  constructor(id) {
    this.id = id;
    this.headers = MAP[id].tileset;
    this.ground = new Map();
    this.groundAlt = new Map();
    this.water = new Map();
    this.wall = new Map();
    this.wallAlt = new Map();
    this.computeMapping();
  }

  computeMapping() {
    Object.keys(MASK_TABLE).forEach((v)=>{
      this.ground.set(v, this.getId(v, HDR.GROUND));
      this.water.set(v, this.getId(v, HDR.WATER));
      this.wall.set(v, this.getId(v, HDR.WALL));
      if (v == MASK_TABLE.A1B2C3D4) {
        if (this.headers.includes(HDR.GROUND_ALT_1)) {
          this.groundAlt.set(this.getId(v, HDR.GROUND_ALT_1));
        }
        if (this.headers.includes(HDR.GROUND_ALT_2)) {
          this.groundAlt.set(this.getId(v, HDR.GROUND_ALT_2));
        }
        if (this.headers.includes(HDR.GROUND_ALT_3)) {
          this.groundAlt.set(this.getId(v, HDR.GROUND_ALT_3));
        }
        if (this.headers.includes(HDR.GROUND_ALT_4)) {
          this.groundAlt.set(this.getId(v, HDR.GROUND_ALT_4));
        }
        if (this.headers.includes(HDR.WALL_ALT_1)) {
          this.wallAlt.set(this.getId(v, HDR.WALL_ALT_1));
        }
        if (this.headers.includes(HDR.WALL_ALT_2)) {
          this.wallAlt.set(this.getId(v, HDR.WALL_ALT_2));
        }
        if (this.headers.includes(HDR.WALL_ALT_3)) {
          this.wallAlt.set(this.getId(v, HDR.WALL_ALT_3));
        }
      }
    });
  }

  getId(maskId, header) {
    let headerIndex = this.headers.indexOf(header);
    if (headerIndex == -1) {
      headerIndex = this.headers.indexOf(HDR.ABYSS);
    }
    const maskCoordinate = MASK_COORDINATE[maskId];
    const x = maskCoordinate.x + headerIndex * 3;
    const y = maskCoordinate.y;
    return y * this.headers.length * 3 + x + 1;
  }

  getTilemapId(terrain, maskId) {
    // console.log(terrain, maskId);
    switch (terrain) {
      case TERRAIN.GROUND:
        if (this.groundAlt.size > 0) {
          if (Math.random() > 0.80 && maskId == MASK_TABLE.A1B2C3D4) {
            const items = Array.from(this.groundAlt);
            return items[Math.floor(Math.random() * items.length)][0];
          } else {
            return this.ground.get(maskId);
          }
        } else {
          return this.ground.get(maskId);
        }

      case TERRAIN.WATER:
        return this.water.get(maskId);

      case TERRAIN.WALL:
        if (this.wallAlt.size > 0) {
          if (Math.random() > 0.60 && maskId == MASK_TABLE.A1B2C3D4) {
            const items = Array.from(this.wallAlt);
            return items[Math.floor(Math.random() * items.length)][0];
          } else {
            return this.wall.get(maskId);
          }
        } else {
          return this.wall.get(maskId);
        }
    }
  }

  exportToTiled() {
    return {
      columns: this.headers.length * 3,
      firstgid: 1,
      image: `assets/tilesets/${this.id}.png`,
      imageheight: 601,
      imagewidth: 3 * this.headers.length * 25 + 1,
      margin: 1,
      name: this.id,
      spacing: 1,
      tilecount: 3 * this.headers.length * 24,
      tileheight: 24,
      tilewidth: 24
    };
  }
};

module.exports = Tileset;
