import React from 'react'
import CSS from 'csstype'
import { useAppSelector } from '../../../hooks'
import GameLevel from './game-level'

const style: CSS.Properties = {
    padding:'5px'
}

const styleProgress: CSS.Properties = {
    position: 'absolute',
    color: 'white',
    left: '35%',
    bottom: '7%',
    fontSize:'1.2vw',
    margin: '0px'
}

export default function GameExperience() {
    const experienceManager = useAppSelector(state=>state.game.experienceManager)
    
    let progressString = ''
    if(Number(experienceManager.expNeeded) == -1)
    {
        progressString = 'Max Level'
    }
    else
    {
        progressString = experienceManager.experience + '/' + experienceManager.expNeeded
    }
    

    return <div className='nes-container' style={style}>
        <div style={{display:'flex', alignItems:'center', }}>
            <h1 style={{fontSize:'1.3vw', color:'white'}}>Lvl {experienceManager.level}</h1>
            <GameLevel/>
        </div>
        <div>
            <progress className="nes-progress" value={experienceManager.experience} max={experienceManager.expNeeded}>
            </progress>
            <p style={styleProgress}>{progressString}</p>
        </div>
    </div>
}