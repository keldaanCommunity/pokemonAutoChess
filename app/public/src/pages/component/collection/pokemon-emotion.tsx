import React from 'react';
import { Emotion, EmotionCost } from '../../../../../types';
import ReactTooltip from 'react-tooltip';
import { useAppDispatch } from '../../../hooks';
import { buyEmotion, changeSelectedEmotion } from '../../../stores/NetworkStore';
import {CDN_URL} from '../../../../../models/enum';

const cursorStyle={
    padding:'10px',
    display:'flex',
    flexFlow:'column',
    margin:'10px',
    cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
};

export default function PokemonEmotion(props:{index: string, shiny: boolean, unlocked: boolean, path: string, emotion:Emotion}){
    const dispatch = useAppDispatch();
    const cost = props.shiny ? EmotionCost[props.emotion] * 3 : EmotionCost[props.emotion]; 
    const price = props.unlocked ? null: <div style={{display:'flex', marginTop:'5px', marginBottom:'-10px', justifyContent:'center', height:'25px'}}><p>{cost}</p><img style={{width:'20px',height:'20px',imageRendering:'pixelated'}} 
    src={`${CDN_URL}${props.index}/Normal.png`}/></div>;

    return <div className='nes-container' style={cursorStyle} data-tip data-for={`${props.path}-${props.emotion}`} onClick={()=>{
        if(props.unlocked){
            dispatch(changeSelectedEmotion({index: props.index, emotion: props.emotion, shiny: props.shiny}));
        }
        else{
            dispatch(buyEmotion({index: props.index, emotion: props.emotion, shiny: props.shiny}));
        }
    }}>
        <img 
            src={`${CDN_URL}${props.path}/${props.emotion}.png`}
            style={{filter: props.unlocked ? 'grayscale(0)':'grayscale(1)', width:'80px', height:'80px', imageRendering:'pixelated'}}/>
        {price}
        <ReactTooltip id={`${props.path}-${props.emotion}`}
            textColor='#000000'
            className='customeTheme'
            backgroundColor='rgba(255,255,255,1)' 
            effect='solid'>
            <p>{props.unlocked ? `Click to select the ${props.emotion} emotion for you pokemon` : `Click to unlock the ${props.emotion} emotion for you pokemon`}</p>
        </ReactTooltip>
    </div>
}