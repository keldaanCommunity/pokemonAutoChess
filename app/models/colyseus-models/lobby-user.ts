import {Schema, type, ArraySchema} from '@colyseus/schema';
import {GameRecord} from './game-record';
import MapTileset from './map-tileset';
import WinTileset from './win-tileset';

export default class LobbyUser extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type('string') avatar: string;
  @type('uint16') elo: number;
  @type(MapTileset) map = new MapTileset();
  @type('string') langage: string;
  @type('uint16') wins: number;
  @type('uint16') exp: number;
  @type('uint16') level: number;
  @type('boolean') donor: boolean;
  @type(WinTileset) mapWin = new WinTileset();
  @type(['string']) honors = new ArraySchema<string>();
  @type([GameRecord]) history = new ArraySchema<GameRecord>();


  constructor(id:string,
    name: string,
    elo: number,
    avatar: string,
     map:any,
    langage:string,
    wins:number,
    exp: number,
    level: number,
    mapWin: any,
    donor: boolean,
    history: ArraySchema<GameRecord>,
    honors: string[]) {

    super();
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.elo = elo;
    this.langage = langage;
    this.wins = wins;
    this.exp = exp;
    this.level = level;
    this.donor = donor;
    this.history = history;

    if (honors && honors.length && honors.length != 0) {
      honors.forEach((h) => {
        this.honors.push(h);
      });
    }
  }

  toString() {
    return `id: ${this.id} name:${this.name}`;
  }
}
