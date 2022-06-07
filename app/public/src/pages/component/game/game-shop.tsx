import React from 'react'
import GameRefresh from './game-refresh'
import GameLock from './game-lock'
import GameExperience from './game-experience'
import GameStore from './game-store'
import CSS from 'csstype'
import { useAppSelector } from '../../../hooks'
import GameRarityPercentage from './game-rarity-percentage'

const style: CSS.Properties = {
    position:'absolute',
    left:'10%',
    bottom:'0.5%',
    height:'15%',
    background: '#54596b',
    display:'flex',
    justifyContent:'space-between',
    padding:'5px'
}


export default function GameShop() {

    const money = useAppSelector(state=>state.game.money)

    return <div style={style} className='nes-container'>
    <div className='nes-container' style={{display:'flex', flexFlow:'column', padding:'5px', background:'#61738a', justifyContent:'space-between'}}>
        <GameRarityPercentage/>
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <GameLock/>
            <GameRefresh/>
        </div>
    </div>   
    <GameStore/>
    <GameExperience/>
</div>
}