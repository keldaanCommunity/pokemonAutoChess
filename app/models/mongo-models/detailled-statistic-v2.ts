import {Schema, model} from 'mongoose';
import {ITEM, PKM} from '../enum';

export interface Pokemon {
  name: string;
  items: string[];
}

export interface DetailledStatistic {
  playerId: string;
  elo: number;
  tome: number;
  name: string;
  rank: number;
  avatar: string;
  pokemons: Pokemon[]
}

const pokemon = new Schema({
  name: {
    type: String,
    enum: Object.values(PKM)
  },
  items: [
    {
      type: String,
      enum: Object.keys(ITEM)
    }
  ]
});

const statisticSchema = new Schema(
    {
      playerId: {
        type: String
      },
      elo: {
        type: Number
      },
      time: {
        type: Number
      },
      name: {
        type: String
      },
      rank: {
        type: Number
      },
      avatar: {
        type: String
      },
      pokemons: [pokemon]
    }
);

export default model<DetailledStatistic>('DetailledStatisticV2', statisticSchema);