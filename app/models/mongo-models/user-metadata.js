const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        default: 'rattata'
      },
      wins: {
        type: Number,
        default: 0
      },
      exp:{
        type: Number,
        default: 0
      },
      level:{
        type: Number,
        default: 0
      },
      elo:{
        type:Number,
        default: 1000
      },
      donor:{
        type:Boolean,
        default: false
      },
      mapWin:{
        ICE:{
          type: Number,
          default: 0
        },
        FIRE:{
          type: Number,
          default: 0
        },
        GROUND:{
          type: Number,
          default: 0
        },
        NORMAL:{
          type: Number,
          default: 0
        },
        GRASS:{
          type: Number,
          default: 0
        },
        WATER:{
          type: Number,
          default: 0
        }
      },
      map:{
        ICE:{
          type: String,
          default: 'ICE0'
        },
        FIRE:{
          type: String,
          default: 'FIRE0'
        },
        GROUND:{
          type: String,
          default: 'GROUND0'
        },
        NORMAL:{
          type: String,
          default: 'NORMAL0'
        },
        GRASS:{
          type: String,
          default: 'GRASS0'
        },
        WATER:{
          type: String,
          default: 'WATER0'
        }
      }
    }
);

const UserMetadata = mongoose.model('UserMetadata', userMetadataSchema);
module.exports = UserMetadata;
