import {Schema, model} from 'mongoose';
import {ITEM} from '../enum';
import {Pkm} from '../../types/enum/Pokemon';
export interface IDetailledPokemon {
  name: string;
  x:number;
  y: number;
  items: string[];
}

export interface IStep {
  board: IDetailledPokemon[];
  roundsRequired: number;
}

export interface IBot {
  avatar: string;
  author: string;
  elo: number;
  steps: IStep[];
  name: string;
}

const pkm = new Schema(
    {
      name: {
        type: String,
        enum: Object.values(Pkm),
        required: true
      },
      x: {
        type: Number,
        min: 0,
        max: 7,
        required: true
      },
      y: {
        type: Number,
        min: 0,
        max: 3,
        required: true
      },
      items: [{
        type: String,
        enum: Object.keys(ITEM)
      }]
    }
);

const step = new Schema(
    {
      board: [pkm],
      roundsRequired: {
        type: Number,
        required: true
      }
    }
);

const bot = new Schema(
    {
      name: {
        type: String
      },
      avatar: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      elo: {
        type: Number,
        required: true
      },
      steps: [step]
    },
    {
      toJSON: {
        transform: function(doc, ret) {
          delete ret._id;
          delete ret.__v;
          ret.steps.forEach((step)=>{
            step.board.forEach((board)=>{
              delete board._id;
            });
            delete step._id;
          });
        }
      }
    }
);

export default model<IBot>('BotV2', bot);
