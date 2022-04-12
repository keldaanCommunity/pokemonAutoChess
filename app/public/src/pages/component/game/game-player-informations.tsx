import React from 'react';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position:'absolute',
    top:'.5%',
    left:'30%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display:'flex',
    justifyContent:'space-evenly',
    padding:'10px',
    minWidth:'40%',
    height:'7%'
}

export default function GamePlayerInformations(){
    function getLifePngName() {
        let lifePngName = 'life_100';
        if(life > 80){
            lifePngName = 'life_100';
        } else if(life > 60 && life <= 80){
            lifePngName = 'life_80';
        } else if(life > 40 && life <= 60){
            lifePngName = 'life_60';            
        } else if(life > 20 && life <= 40){
            lifePngName = 'life_40';
        } else if(life > 0 && life <= 20){
            lifePngName = 'life_20';
        } else {
            lifePngName = 'life_0';
        }
        return lifePngName;
    }
    const opponentName = useAppSelector(state=>state.game.currentPlayerOpponentName);
    const opponentAvatar = useAppSelector(state=>state.game.currentPlayerOpponentAvatar);
    const experienceManager = useAppSelector(state=>state.game.currentPlayerExperienceManager);
    const boardSize = useAppSelector(state=>state.game.currentPlayerBoardSize);
    const name = useAppSelector(state=>state.game.currentPlayerName);
    const avatar = useAppSelector(state=>state.game.currentPlayerAvatar);
    const life = useAppSelector(state=>state.game.currentPlayerLife);
    const money = useAppSelector(state=>state.game.currentPlayerMoney);

    let opponent = null;
    if(opponentName != '' && opponentAvatar !=''){
        opponent = 
        <div style={{display:'flex'}}>
            <p>Vs</p>
            <img src={`https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/${opponentAvatar}.png`}/>
            <p style={{marginLeft:'5px'}}>{opponentName}</p>
        </div>;
    }

    return <div style={style} className='nes-container'>
            <h4>{boardSize}/{experienceManager.level}</h4>
            <div style={{display:'flex'}}>
                <h4>{money}</h4>
                <img style={{width:'25px', height:'25px', marginBottom:'5px'}} src='assets/ui/money.png'/>
            </div>
            <div style={{display:'flex'}}>
                <h4 style={{marginLeft:'5px'}}>{life}</h4>
                <img style={{width:'25px', height:'25px', marginBottom:'5px'}} src={`assets/ui/${getLifePngName()}.png`}/>
            </div>
            <div style={{display:'flex'}}>
                <img src={`https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/${avatar}.png`}/>
                <p style={{marginLeft:'5px'}}>{name}</p>
            </div>
            {opponent}
            </div>;
}