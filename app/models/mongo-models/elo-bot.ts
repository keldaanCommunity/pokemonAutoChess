import {Schema, model} from 'mongoose';

export interface EloBot {
  name: string;
  elo: number;
}

const eloBot = new Schema(
    {
      name: {
        type: String
      },
      elo: {
        type: Number
      }
    }
);

export default model<EloBot>('EloBot', eloBot);