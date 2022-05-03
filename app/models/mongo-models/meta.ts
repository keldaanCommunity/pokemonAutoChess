import {Schema, model} from 'mongoose';
import { Pkm } from '../../types/enum/Pokemon';
import { Synergy } from '../../types/enum/Synergy';

export interface ITeam {
  cluster_id: string;
  rank: number;
  x: number;
  y: number;
  pokemons: {[Property in keyof Pkm]: number}
}

export interface IMeta {
  cluster_id: string;
  count: number;
  ratio: number;
  winrate: number;
  mean_rank: number;
  types: {[Property in keyof Synergy]: number};
  pokemons: {[Property in keyof Pkm]: number};
  teams: ITeam[]  
}

const teamSchema = new Schema(
    {
      cluster_id: {
        type: String
      },
      rank: {
        type: Number
      },
      x: {
        type: Number
      },
      y: {
        type: Number
      },
      pokemons: Object
    }
);

const metaSchema = new Schema(
    {
      cluster_id: {
        type: String
      },
      count: {
        type: Number
      },
      ratio: {
        type: Number
      },
      winrate: {
        type: Number
      },
      mean_rank: {
        type: Number
      },
      types: Object,
      pokemons: Object,
      teams: [teamSchema]
    }
);

export default model<IMeta>('Meta', metaSchema, 'meta');