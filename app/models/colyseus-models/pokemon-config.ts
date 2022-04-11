import {IPokemonConfig} from '../mongo-models/user-metadata';
import {Schema, type, ArraySchema} from '@colyseus/schema';
import { Emotion } from '../../types';

export default class PokemonConfig extends Schema implements IPokemonConfig{
    @type('uint16') dust: number;
    @type(['string']) emotions = new ArraySchema<Emotion>();
    @type(['string']) shinyEmotions = new ArraySchema<Emotion>();
    @type('string') selectedEmotion: Emotion

    constructor(p?: IPokemonConfig){
        super();
        if(p){
            this.dust = p.dust;
            p.emotions.forEach(e=>this.emotions.push(e));
            p.shinyEmotions.forEach(e=>this.shinyEmotions.push(e));
            this.selectedEmotion = p.selectedEmotion;
        }
        else{
            this.dust = 0;
            p.emotions = [];
            p.shinyEmotions = [];
            p.selectedEmotion = Emotion.NORMAL;
        }
    }
}