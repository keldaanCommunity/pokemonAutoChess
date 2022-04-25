import {Schema, model} from 'mongoose';
import {ITEM} from '../enum';
import {Pkm} from '../../types/enum/Pokemon';

export interface IItemsStatistic {
  rank: number;
  count: number;
  name: string;
  pokemons: string[]
}

const itemsStatistic = new Schema(
    {
      rank: {
        type: Number
      },
      count: {
        type: Number
      },
      name: {
        type: String,
        enum: Object.keys(ITEM)
      },
      pokemons: [
        {
          type: String,
          enum: Object.values(Pkm)
        }
      ]
    }
);

export default model<IItemsStatistic>('ItemsStatistic', itemsStatistic, 'items-statistic');