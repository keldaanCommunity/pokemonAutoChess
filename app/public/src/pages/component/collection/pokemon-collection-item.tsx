import React from 'react';
import {ITracker} from '../../../../../types/ITracker';
import {IPokemonConfig} from '../../../../../models/mongo-models/user-metadata';
import { Emotion } from '../../../../../types';

const cursorStyle = {
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,1)',
    margin: '10px'
}

export default function PokemonCollectionItem(props: {index: string, metadata: ITracker, config: IPokemonConfig}) {
    let emotion: Emotion;
    
    if(!props.metadata || Object.keys(props.metadata.portrait_files).length == 0){
        return null;
    }

    if(props.config && props.config.selectedEmotion){
        emotion = props.config.selectedEmotion;   
    }
    else{
        emotion = Emotion.NORMAL;
    }

    return <div style={cursorStyle} className='nes-container'>
        <img style={{filter: props.config ? 'grayscale(0)':'grayscale(1)', width:'80px', height:'80px', imageRendering:'pixelated'}}
         src={`https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/${props.index.replace('-','/')}/${emotion}.png`}/>
    </div>;
}