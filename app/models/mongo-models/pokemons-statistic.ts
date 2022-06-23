import {Schema, model} from 'mongoose'
import {Item} from '../../types/enum/Item'
import {Pkm} from '../../types/enum/Pokemon'

export interface IPokemonsStatistic {
  rank: number;
  count: number;
  name: Pkm;
  items: Item[]
}

const pokemonsStatistic = new Schema(
    {
      rank: {
        type: Number
      },
      count: {
        type: Number
      },
      name: {
        type: String,
        enum: Pkm
      },
      items: [
        {
          type: String,
          enum: Object.values(Item)
        }
      ]
    }
)

export default model<IPokemonsStatistic>('PokemonsStatistic', pokemonsStatistic, 'pokemons-statistic')