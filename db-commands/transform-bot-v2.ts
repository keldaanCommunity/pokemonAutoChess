import BotV2 from '../app/models/mongo-models/bot-v2';
import PokemonFactory from '../app/models/pokemon-factory';
import dotenv from 'dotenv';
import {connect, FilterQuery} from 'mongoose';
import { Emotion } from '../app/types';
dotenv.config();

connect(process.env.MONGO_URI, (err) => {
    BotV2.find({},(err, docs)=>{
        docs.forEach(doc=> {
            const pkm = PokemonFactory.createPokemonFromName(doc.avatar);
            doc.avatar = `${pkm.index}/${Emotion.NORMAL}`;
            console.log(doc.avatar);
            doc.save();
        });
    });
});
