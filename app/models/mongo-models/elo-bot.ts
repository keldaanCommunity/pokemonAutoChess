import {Schema, model} from 'mongoose'

export interface IEloBot {
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
)

export default model<IEloBot>('EloBot', eloBot)