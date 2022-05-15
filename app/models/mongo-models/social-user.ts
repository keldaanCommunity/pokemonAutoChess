import {Schema, model} from 'mongoose'

export interface ISocialUser {
  payload: string;
  name: string;
  avatar: string;
  time: number;
}

const socialUserSchema = new Schema(
    {
      payload: {
        type: String
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      time: {
        type: Number
      }
    }
)

export default model<ISocialUser>('SocialUser', socialUserSchema)
