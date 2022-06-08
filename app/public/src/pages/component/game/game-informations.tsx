import React from 'react'
import GameLeave from './game-leave'
import CSS from 'csstype'
import { useAppSelector } from '../../../hooks'

const style: CSS.Properties = {
    position:'absolute',
    top:'.5%',
    left:'.5%',
    display:'flex',
    justifyContent:'space-around',
    padding:'5px',
    flexFlow: 'column',
    width:'8%',
    height:'10%',
    color:'#fff'
}

export default function GameInformations(props:{leave:()=>void}) {
    const mapName = useAppSelector(state=>state.game.mapName)
    const stageLevel = useAppSelector(state=>state.game.stageLevel)
    const roundTime = useAppSelector(state=>state.game.roundTime) 

    return <div style={style} className='nes-container'>
    <p style={{fontSize: '0.9vw', textAlign: 'center', marginBottom: '0px'}}>{mapName}</p>
    <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
        <GameLeave leave={props.leave}/>
        <h3>T{stageLevel}</h3>
        <h3>{roundTime}s</h3>
    </div>
</div>
}