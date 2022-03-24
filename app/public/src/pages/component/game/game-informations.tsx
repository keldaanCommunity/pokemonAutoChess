import React from 'react';
import GameLeave from './game-leave';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position:'absolute',
    top:'.5%',
    left:'.5%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display:'flex',
    justifyContent:'space-evenly',
    padding:'10px',
    flexFlow: 'column',
    width:'13%',
    height:'10%'
}

export default function GameInformations() {
    const mapName = useAppSelector(state=>state.game.mapName);
    const stageLevel = useAppSelector(state=>state.game.stageLevel);
    const roundTime = useAppSelector(state=>state.game.roundTime); 

    return <div style={style} className='nes-container'>
    <p style={{fontSize: '0.7vw', textAlign: 'center', marginBottom: '0px'}}>{mapName}</p>
    <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
        <GameLeave/>
        <h3>T{stageLevel}</h3>
        <h3>{roundTime}s</h3>
    </div>
</div>;
}