import UserMetadata, { IPokemonConfig } from '../app/models/mongo-models/user-metadata';
import {Emotion} from '../app/types';
import dotenv from 'dotenv';
import {connect} from 'mongoose';
dotenv.config();

connect(process.env.MONGO_URI, (err) => {
    UserMetadata.find({},(err, docs)=>{
        docs.forEach(doc=> {
             doc.booster = doc.level * 6;
             doc.avatar = `0019/${Emotion.NORMAL}`;
             doc.pokemonCollection = new Map<string, IPokemonConfig>();
             doc.pokemonCollection.set('0019', {id: '0019', dust: 100, emotions:[Emotion.NORMAL], shinyEmotions:[], selectedEmotion: Emotion.NORMAL, selectedShiny: false});
             doc.save();
             console.log(doc);
        });
    });
});
