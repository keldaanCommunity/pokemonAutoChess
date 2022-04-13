import React from 'react';
import CSS from 'csstype';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { openBooster } from '../../../stores/NetworkStore';
import { CDN_URL } from '../../../../../models/enum';
import { Emotion } from '../../../../../types';

const buttonStyle: CSS.Properties = {
    marginLeft:'10px',
    marginTop:'10px',
    marginRight:'10px'
}

export default function Booster(props: {toggle :()=>void}){
    const dispatch = useAppDispatch();
    const numberOfBooster = useAppSelector(state=>state.lobby.user.booster);
    const boosterContent = useAppSelector(state=>state.lobby.boosterContent);
    return <div>
        <button style={buttonStyle} onClick={()=>{props.toggle()}} className='nes-btn is-primary'>Lobby</button>
        <div className='nes-container' style={{margin:'10px', backgroundColor:'rgba(255,255,255,0.7)', display:'flex', justifyContent:'center', flexFlow:'column', alignItems:'center'}}>
            <div style={{display:'flex', justifyContent:'space-around', alignItems:'center', width:'30%'}}>
                <h1>{numberOfBooster}</h1>
                <i className="nes-pokeball"></i>
                <button onClick={()=>{dispatch(openBooster())}} className='nes-btn is-primary'>Open Booster !</button>
            </div>
        <div style={{display:'flex', marginTop:'20px'}}>
            {boosterContent.map((i,index)=>{
                return <div key={index} className='nes-container' style={{padding:'10px', width:'150px', height:'150px', backgroundColor:'rgba(255,255,255,1)'}}>
                    <h2>40x</h2>
                    <img style={{width:'80px',height:'80px', imageRendering:'pixelated'}} src={`${CDN_URL}${i.replace('-','/')}/${Emotion.NORMAL}.png`}/>
                </div>
            })}
        </div>
        </div>
    </div>
}