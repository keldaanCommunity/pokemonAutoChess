import React from 'react';
import { Emotion } from '../../../../../types';
import ReactTooltip from 'react-tooltip';
import { useAppDispatch } from '../../../hooks';
import { buyEmotion, changeSelectedEmotion } from '../../../stores/NetworkStore';

const cursorStyle={
    padding:'10px',
    display:'flex',
    flexFlow:'column',
    margin:'10px',
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
};

export default function PokemonEmotion(props:{index: string, shiny: boolean, unlocked: boolean, path: string, emotion:Emotion}){
    const dispatch = useAppDispatch();
    return <div className='nes-container' style={cursorStyle} data-tip data-for={`${props.path}-${props.emotion}`} onClick={()=>{
        if(props.unlocked){
            dispatch(changeSelectedEmotion({index: props.index, emotion: props.emotion, shiny: props.shiny}));
        }
        else{
            dispatch(buyEmotion({index: props.index, emotion: props.emotion, shiny: props.shiny}));
        }
    }}>
        <img 
            src={`https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/${props.path}/${props.emotion}.png`}
            style={{filter: props.unlocked ? 'grayscale(0)':'grayscale(1)', width:'80px', height:'80px', imageRendering:'pixelated'}}/>
            <ReactTooltip id={`${props.path}-${props.emotion}`}
                textColor='#000000'
                className='customeTheme'
                backgroundColor='rgba(255,255,255,1)' 
                effect='solid'>
                <p>{props.unlocked ? `Click to select the ${props.emotion} emotion for you pokemon` : `Click to unlock the ${props.emotion} emotion for you pokemon`}</p>
            </ReactTooltip>
    </div>
}