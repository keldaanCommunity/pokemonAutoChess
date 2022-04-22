import React, { Dispatch, SetStateAction } from 'react';
import {ITracker} from '../../../../../public/dist/client/assets/pokemons/ITracker';
import {IPokemonConfig} from '../../../../../models/mongo-models/user-metadata';
import { Emotion } from '../../../../../types';
import { CDN_PORTRAIT_URL } from '../../../../../models/enum';

const cursorStyle = {
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,1)',
    margin: '10px'
}

export default function PokemonCollectionItem(props: {name: string, index: string, metadata: ITracker, config: IPokemonConfig, setPokemon:Dispatch<SetStateAction<string>>}) {
    let emotion: Emotion;
    let shinyPad = '';

    if(!props.metadata || Object.keys(props.metadata.portrait_files).length == 0){
        return null;
    }

    if(props.config && props.config.selectedEmotion){
        emotion = props.config.selectedEmotion;
        shinyPad = props.config.selectedShiny ? '/0000/0001' : '';
    }
    else{
        emotion = Emotion.NORMAL;
    }

    return <div style={cursorStyle} className='nes-container' onClick={()=>{props.setPokemon(props.name)}}>
        <img style={{filter: props.config && (props.config.emotions.length != 0 || props.config.shinyEmotions.length != 0) ? 'grayscale(0)':'grayscale(1)', width:'80px', height:'80px', imageRendering:'pixelated'}}
         src={`${CDN_PORTRAIT_URL}${props.index.replace('-','/')}${shinyPad}/${emotion}.png`}/>
         <div style={{display:'flex', marginTop:'5px', marginBottom:'-10px', justifyContent:'center'}}>{props.config ? props.config.dust: 0}<img style={{width:'20px',height:'20px',imageRendering:'pixelated'}} 
         src={`${CDN_PORTRAIT_URL}${props.index.replace('-','/')}/Normal.png`}/></div>
    </div>;
}