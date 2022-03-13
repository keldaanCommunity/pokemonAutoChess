import {MAP, MASK_TABLE, HDR, MASK_COORDINATE, TERRAIN} from '../models/enum';
import Jimp from 'jimp';

export default class Tileset {
  id: string;
  headers: string[];
  img: any;
  ground: Map<string, number[]> = new Map();
  groundAlt: Map<string, number[]> = new Map();
  water: Map<string, number[]> = new Map();
  wall: Map<string, number[]> = new Map();
  wallAlt: Map<string, number[]> = new Map();

  constructor(id: string) {
    this.id = id;
    this.headers = MAP[id].tileset;
  }

  async initialize() {
    this.img = await Jimp.read(`app/public/dist/client/assets/tilesets/${this.id}.png`);
    this.computeMapping();
  }

  computeMapping() {
    Object.keys(MASK_TABLE).forEach((v)=>{
      this.ground.set(v, this.getId(v, HDR.GROUND));
      this.water.set(v, this.getId(v, HDR.WATER));
      this.wall.set(v, this.getId(v, HDR.WALL));
      [HDR.GROUND_ALT_1, HDR.GROUND_ALT_2, HDR.GROUND_ALT_3, HDR.GROUND_ALT_4].forEach((h)=>{
        if (this.headers.includes(h) && this.isPixelValue(v, h)) {
          const t = this.groundAlt.get(v);
          if (t) {
            this.groundAlt.set(v, t.concat([this.getId(v, h)]));
          } else {
            this.groundAlt.set(v, [this.getId(v, h)]);
          }
        }
      });

      [HDR.WALL_ALT_1, HDR.WALL_ALT_2, HDR.WALL_ALT_3].forEach((h)=>{
        if (this.headers.includes(h) && this.isPixelValue(v, h)) {
          const t = this.wallAlt.get(v);
          if (t) {
            this.wallAlt.set(v, t.concat([this.getId(v, h)]));
          } else {
            this.wallAlt.set(v, [this.getId(v, h)]);
          }
        }
      });
    });
  }

  getId(maskId: string, header: string) {
    let headerIndex = this.headers.indexOf(header);
    if (headerIndex == -1) {
      headerIndex = this.headers.indexOf(HDR.ABYSS);
    }
    const maskCoordinate = MASK_COORDINATE[maskId];
    const x = maskCoordinate.x + headerIndex * 3;
    const y = maskCoordinate.y;
    return y * this.headers.length * 3 + x + 1;
  }

  isPixelValue(maskId: string, header: string) {
    const headerIndex = this.headers.indexOf(header);
    const maskCoordinate = MASK_COORDINATE[maskId];
    const pixelX = maskCoordinate.x + headerIndex * 3;
    const pixelY = maskCoordinate.y;
    return (Jimp.intToRGBA(this.img.getPixelColor(pixelX * 25 + 12, pixelY * 25 + 12)).a != 0);
  }

  getTilemapId(terrain: number, maskId: string) {
    // console.log(terrain, maskId);
    let items;
    switch (terrain) {
      case TERRAIN.GROUND:
        items = this.groundAlt.get(maskId);
        // console.log(items);
        if (items && items.length > 0) {
          if (Math.random() > 0.80) {
            return items[Math.floor(Math.random() * items.length)];
          } else {
            return this.ground.get(maskId);
          }
        } else {
          return this.ground.get(maskId);
        }
      case TERRAIN.WATER:
        return this.water.get(maskId);

      case TERRAIN.WALL:
        items = this.wallAlt.get(maskId);
        // console.log(items);
        if (items && items.length > 0) {
          if (Math.random() > 0.80) {
            return items[Math.floor(Math.random() * items.length)];
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
