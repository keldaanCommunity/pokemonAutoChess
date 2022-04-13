import {Schema, type, ArraySchema} from '@colyseus/schema';
import {GameRecord, IGameRecord} from './game-record';
import MapTileset from './map-tileset';
import WinTileset from './win-tileset';
import PokemonCollection from './pokemon-collection';
import PokemonConfig from './pokemon-config';
import { IPokemonConfig } from '../mongo-models/user-metadata';

export interface ILobbyUser {
  id: string;
  name: string;
  avatar: string;
  elo: number;
  langage: string;
  wins: number;
  exp: number;
  level: number;
  donor: boolean;
  honors: string[];
  history: IGameRecord[];
  pokemonCollection: Map<string, IPokemonConfig>;
  booster: number;
}
export default class LobbyUser extends Schema implements ILobbyUser{
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
  @type([GameRecord]) history = new ArraySchema<IGameRecord>();
  @type({map: PokemonConfig}) pokemonCollection = new PokemonCollection();
  @type('uint16') booster: number;


  constructor(id:string,
    name: string,
    elo: number,
    avatar: string,
    langage:string,
    wins:number,
    exp: number,
    level: number,
    donor: boolean,
    history: GameRecord[],
    honors: string[],
    pokemonCollection: Map<string,IPokemonConfig>,
    booster: number) {

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
    this.booster = booster;

    if(history && history.length && history.length != 0) {
      history.forEach((h)=>{
        this.history.push(h);
      });
    }

    if (honors && honors.length && honors.length != 0) {
      honors.forEach((h) => {
        this.honors.push(h);
      });
    }

    if(pokemonCollection && pokemonCollection.size) {
      pokemonCollection.forEach((value, key) => {
          this.pokemonCollection.set(key, new PokemonConfig(value.id, value));
      });
    }
  }
}
