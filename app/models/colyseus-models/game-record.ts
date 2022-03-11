import {Schema, ArraySchema, type} from '@colyseus/schema';

export class PokemonRecord extends Schema {
  @type('string') name:string;
  @type(['string']) items = new ArraySchema<string>();

  constructor(mongoPokemon: any) {
    super();
    this.name = mongoPokemon.name;
    mongoPokemon.items.forEach((it: string)=>{
      this.items.push(it);
    });
  }
}

export class GameRecord extends Schema {
  @type('uint64') time: number;
  @type('uint8') rank: number;
  @type([PokemonRecord]) pokemons = new ArraySchema<PokemonRecord>();
  @type('uint16') elo: number;

  constructor(time: number, rank: number, elo:number, pokemons:any[]) {
    super();
    this.time = time;
    this.rank = rank;
    this.elo = elo;

    pokemons.forEach((pokemon) =>{
      this.pokemons.push(new PokemonRecord(pokemon));
    });
  }
}
