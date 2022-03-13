import {TERRAIN} from '../models/enum';
import Tileset from './tileset';
import Terrain from './terrain';
import Mask from './mask';

export default class Design {
  id: any;
  terrain: number[][] = [];
  bitmask: string[][] = [];
  tilemap: number[] = [];
  width: number = 85;
  height: number = 43;
  frequency: number;
  persistance: number;
  tileset: Tileset;
  minArena: number[] = [26, 4];
  maxArena: number[] = [58, 35];
  leftBorder: number[] = [27, 31];
  rightBorder: number[] = [57, 31];

  constructor(id: string, frequency: number, persistance: number) {
    this.id = id;
    this.frequency = frequency;
    this.persistance = persistance;
    this.tileset = new Tileset(this.id);
  }

  async create() {
    return new Promise<void>((resolve, reject)=>{
      this.tileset.initialize().then(()=>{
        this.generateTerrain();
        this.generateMask();
        this.generateTilemap();
        resolve();
      });
    });
  }

  generateTerrain() {
    const t = new Terrain(this.width, this.height, this.frequency, this.persistance);
    const generation = t.terrain;

    for (let i = 0; i < this.height; i++) {
      const row: number[] = [];
      for (let j = 0; j < this.width; j++) {
        const v = generation[i][j];
        if (v > 0.66) {
          row.push(TERRAIN.WALL);
        } else if (v>0.33) {
          row.push(TERRAIN.GROUND);
        } else {
          row.push(TERRAIN.WATER);
        }
      }
      this.terrain.push(row);
    }

    for (let i = this.minArena[0]; i < this.maxArena[0]; i++) {
      for (let j = this.minArena[1]; j < this.maxArena[1]; j++) {
        this.terrain[j][i] = TERRAIN.GROUND;
      }
    }

    for (let i = this.leftBorder[0]; i < this.rightBorder[0]; i++) {
      this.terrain[this.leftBorder[1]][i] = TERRAIN.WALL;
    }
  }

  generateMask() {
    const mask = new Mask();
    for (let i = 0; i < this.height; i++) {
      const row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(mask.mask8bits(this.terrain, i, j));
      }
      this.bitmask.push(row);
    }
  }

  generateTilemap() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const tileID = this.tileset.getTilemapId(this.terrain[i][j], this.bitmask[i][j]);
        this.tilemap.push(tileID);
      }
    }
  }

  exportToTiled() {
    return {
      compressionlevel: -1,
      height: this.height,
      infinite: false,
      layers: [
        {
          data: this.tilemap,
          height: this.height,
          id: 1,
          name: 'World',
          opacity: 1,
          type: 'tilelayer',
          visible: true,
          width: this.width,
          x: 0,
          y: 0
        }],
      nextlayerid: 6,
      nextobjectid: 1,
      orientation: 'orthogonal',
      renderorder: 'right-down',
      tiledversion: '1.7.2',
      tileheight: 24,
      tilesets: [this.tileset.exportToTiled()],
      tilewidth: 24,
      type: 'map',
      version: '1.6',
      width: this.width
    };
  }
};