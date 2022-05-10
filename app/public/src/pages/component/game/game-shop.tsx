import React from 'react';
import GameRefresh from './game-refresh';
import GameLock from './game-lock';
import GameLevel from './game-level';
import GameExperience from './game-experience';
import GameStore from './game-store';
import GameMoneyDetail from './game-money-detail';
import ReactTooltip from 'react-tooltip';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position:'absolute',
    left:'0.5%',
    bottom:'0.5%',
    width:'90%',
    height:'15%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
}

export default function GameShop() {

    const money = useAppSelector(state=>state.game.money);

    return <div style={style} className='nes-container'>
    <div style={{position: 'absolute', bottom:'15%', left:'1%', fontSize: '22px'}}
        data-tip
        data-for={'money-tooltip'}>
         <ReactTooltip id={'money-tooltip'} 
            className='customeTheme' 
            textColor='#000000' 
            backgroundColor='rgba(255,255,255,1)' 
            effect='solid'
        >
            <GameMoneyDetail/>
        </ReactTooltip>
        {money}
        <img style={{width:'25px', marginBottom:'6px'}} src="/assets/ui/money.png"/>
    </div>
    <GameLock/>
    <GameRefresh/>
    <GameLevel/>
    <GameExperience/>
    <GameStore/>
</div>;
}