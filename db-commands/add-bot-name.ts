import BotV2 from '../app/models/mongo-models/bot-v2';
import PokemonFactory from '../app/models/pokemon-factory';
import dotenv from 'dotenv';
import {connect, FilterQuery} from 'mongoose';
import { Emotion, PokemonIndex } from '../app/types';
dotenv.config();

connect(process.env.MONGO_URI, (err) => {
    BotV2.find({},(err, docs)=>{
        docs.forEach(doc=> {
            const index = doc.avatar.split('/')[0];
            const v = Object.values(PokemonIndex);
            const vIndex = v.findIndex(e=>e==index);
            const k = Object.keys(PokemonIndex)[vIndex];
            doc.name = k;
            console.log(doc.name);
            doc.save();
        });
    });
});
