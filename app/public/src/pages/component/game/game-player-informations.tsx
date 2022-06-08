import React, {ReactElement} from 'react'
import CSS from 'csstype'
import { useAppSelector } from '../../../hooks'
import { CDN_PORTRAIT_URL } from '../../../../../types'
import GameMoney from './game-money'
import GameLife from './game-life'

const style: CSS.Properties = {
    position:'absolute',
    top:'.5%',
    left:'30%',
    display:'flex',
    justifyContent:'space-evenly',
    padding:'5px',
    minWidth:'40%',
    height:'8%',
    alignItems:'center',
    color:'white'
}

export default function GamePlayerInformations(){
    const opponentName = useAppSelector(state=>state.game.currentPlayerOpponentName)
    const opponentAvatar = useAppSelector(state=>state.game.currentPlayerOpponentAvatar)
    const experienceManager = useAppSelector(state=>state.game.currentPlayerExperienceManager)
    const boardSize = useAppSelector(state=>state.game.currentPlayerBoardSize)
    const name = useAppSelector(state=>state.game.currentPlayerName)
    const avatar = useAppSelector(state=>state.game.currentPlayerAvatar)
    const life = useAppSelector(state=>state.game.currentPlayerLife)
    const money = useAppSelector(state=>state.game.currentPlayerMoney)

    let opponent: null | ReactElement = null
    const vs = opponentAvatar != '' && opponentName != '' ? <p style={{color:'white', fontSize:'1.3vw'}}>Vs</p> : null
    if(opponentName != '' && opponentAvatar !=''){
        opponent = 
        <div className='nes-container' style={{backgroundColor:'#54596b', padding:'5px', display:'flex', height:'100%'}}>
            <img src={`${CDN_PORTRAIT_URL}${opponentAvatar}.png`}/>
            <p style={{marginLeft:'5px', color:'white'}}>{opponentName}</p>      
        </div>
    }

    return <div style={style} className='nes-container'>
    <div className='nes-container' style={{backgroundColor:'#54596b', padding:'.001px', display:'flex', width:'15%', height:'100%', backgroundImage:'url("assets/ui/pokeball-bg.png"', backgroundSize:'cover'}}>
        <div style={{ background:'#54596b', display:'flex', alignItems:'center', borderRadius:'7px', height:'100%'}}>
            <h4 style={{color:'white'}}>{boardSize}/{experienceManager.level}</h4>
            <img style={{width:'25px', height:'25px', marginBottom:'5px'}} src='assets/ui/pokeball.png'/>
        </div>
    </div>

    <GameMoney money={money}/>
    <GameLife life={life}/>
    <div className='nes-container' style={{backgroundColor:'#54596b', padding:'5px', display:'flex', width:'15%', height:'100%'}}>
        <img src={`${CDN_PORTRAIT_URL}${avatar}.png`}/>
        <p style={{marginLeft:'5px', color:'white'}}>{name}</p>
    </div>
    {vs}
    {opponent}
    </div>
}