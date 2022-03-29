import React from 'react';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position:'absolute',
    right: '1%',
    bottom: '3%',
    width: '15%'
}

const styleProgress: CSS.Properties = {
    position: 'absolute',
    color: 'darkgray',
    left: '25%',
    bottom: '3%'
}

export default function GameExperience() {
    const experienceManager = useAppSelector(state=>state.game.experienceManager);
    
    let progressString = ''
    if(Number(experienceManager.expNeeded) == -1)
    {
        progressString = 'Max Level'
    }
    else
    {
        progressString = experienceManager.experience + "/" + experienceManager.expNeeded
    }
    

    return <div style={style}>
        <h1>Lvl {experienceManager.level}</h1>
        <div>
            <progress className="nes-progress" value={experienceManager.experience} max={experienceManager.expNeeded}></progress>
            <p style={styleProgress}>
                {progressString}</p>
        </div>
    </div>;
}