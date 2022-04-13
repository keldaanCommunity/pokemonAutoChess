import {Schema, model} from 'mongoose';
import { Emotion } from '../../types';
import MapTileset from '../colyseus-models/map-tileset';
import WinTileset from '../colyseus-models/win-tileset';

export interface IUserMetadata {
  uid: string;
  displayName: string;
  langage: string;
  avatar: string;
  wins: number;
  exp: number;
  level: number;
  elo: number;
  donor: boolean;
  mapWin: WinTileset;
  map: MapTileset;
  honors: string[];
  pokemonCollection: Map<string, IPokemonConfig>;
  booster: number;
}

export interface IPokemonConfig {
  dust: number,
  emotions: Emotion[],
  shinyEmotions: Emotion[],
  selectedEmotion: Emotion,
  selectedShiny: boolean,
  id: string
}

const userMetadataSchema = new Schema(
    {
      uid: {
        type: String
      },
      displayName: {
        type: String
      },
      langage: {
        type: String,
        default: 'eng'
      },
      avatar: {
        type: String,
        default: '0019/Normal'
      },
      wins: {
        type: Number,
        default: 0
      },
      exp: {
        type: Number,
        default: 0
      },
      level: {
        type: Number,
        default: 0
      },
      elo: {
        type: Number,
        default: 1000
      },
      donor: {
        type: Boolean,
        default: false
      },
      booster: {
        type: Number,
        default: 0
      },
      mapWin: {
        ICE: {
          type: Number,
          default: 0
        },
        FIRE: {
          type: Number,
          default: 0
        },
        GROUND: {
          type: Number,
          default: 0
        },
        NORMAL: {
          type: Number,
          default: 0
        },
        GRASS: {
          type: Number,
          default: 0
        },
        WATER: {
          type: Number,
          default: 0
        }
      },
      map: {
        ICE: {
          type: String,
          default: 'ICE0'
        },
        FIRE: {
          type: String,
          default: 'FIRE0'
        },
        GROUND: {
          type: String,
          default: 'GROUND0'
        },
        NORMAL: {
          type: String,
          default: 'NORMAL0'
        },
        GRASS: {
          type: String,
          default: 'GRASS0'
        },
        WATER: {
          type: String,
          default: 'WATER0'
        }
      },
      honors: [
        {
          type: String
        }
      ],
      pokemonCollection: {
        type: Map,
        of:          
        {
          dust: {
            type: Number
          },
          selectedEmotion: {
            type: String,
            enum: Emotion
          },
          emotions: [
            {
              type: String,
              enum: Emotion
            }
          ],
          shinyEmotions: [
            {
              type: String,
              enum: Emotion
            }
          ],
          selectedShiny: {
            type: Boolean
          },
          id:{
            type: String
          }
        }       
      }
    }
);

export default model<IUserMetadata>('UserMetadata', userMetadataSchema);
