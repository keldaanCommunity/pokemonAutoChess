import Chat from '../app/models/mongo-models/chat';
import PokemonFactory from '../app/models/pokemon-factory';
import {Emotion} from '../app/types';
import dotenv from 'dotenv';
import {connect} from 'mongoose';
dotenv.config();

connect(process.env.MONGO_URI, (err) => {
    Chat.find({},(err, docs)=>{
        docs.forEach(doc=> {
            const pkm = PokemonFactory.createPokemonFromName(doc.avatar);
            doc.avatar = `${pkm.index}/${Emotion.NORMAL}`;
            doc.save();
        });
    });
});
