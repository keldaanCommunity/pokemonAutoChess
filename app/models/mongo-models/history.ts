import {Schema, model} from 'mongoose';
import { components } from '../../api-v1/openapi';
import { Item } from '../../types/enum/Item';
import {Pkm} from '../../types/enum/Pokemon';

const historyPokemon = new Schema({
    name: {
      type: String,
      enum: Object.values(Pkm)
    },
    avatar:{
      type: String,
    },
    inventory: [
      {
        type: String,
        enum: Item
      }
    ]
  });

const history = new Schema({
    id: {type: String},
    name: {type: String},
    startTime: {type: Number},
    endTime: {type: Number},
    players: [
      {
        id: {type: String},
        avatar: {type: String},
        name: {type: String},
        elo: {type: Number},
        rank: {type: Number},
        pokemons: [historyPokemon]
      }
    ],
},
{
  toJSON: {
    transform: function(doc, ret) {
      delete ret._id;
      delete ret.__v;
      ret.players.forEach((p)=>{
        p.pokemons.forEach((po)=>{
          po.inventory.forEach(i=>{
            delete i._id;
          })
          delete po._id;
        });
        delete p._id;
      });
    }
  }
});

export default model<components["schemas"]["GameHistory"]>('History', history);