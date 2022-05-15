import React from 'react'
import ReactTooltip from 'react-tooltip'
import GamePlayerDetail from './game-player-detail'
import CSS from 'csstype'
import { IPlayer } from '../../../../../types'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setPlayer } from '../../../stores/GameStore'
import { CDN_PORTRAIT_URL } from '../../../../../types'

const progressStyle: CSS.Properties = {
    height: '15px',
    borderImageOutset: '1',
    position: 'absolute',
    left: '0px',
    bottom: '2%',
    width: '55px',
    background:'none'
}

const imgStyle: CSS.Properties = {
    position:'absolute',
    left:'12px',
    top:'5%'
}

export default function GamePlayer(props:{player: IPlayer, color: string, click: (id: string)=>void, index: number}) {
    const style: CSS.Properties = {
        backgroundColor: props.color,
        cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer',
        height:'70px',
        width:'70px',
        position: 'absolute',
        right:'0.5%',
        top:`${0.5 + props.index*12.5}%`
    }
    const dispatch = useAppDispatch()
    const game = useAppSelector(state=>state.network.game)

    function playerClick(){
        props.click(props.player.id)
        if(game && game.state.players){
            const player = game.state.players.get(props.player.id)
            if(player){
                dispatch(setPlayer(player))
            }
        }
    }

    return  <div 
        style={style} 
        className='nes-container'
        onClick={()=>{playerClick()}}
        data-tip
        data-for={'detail-' + props.player.id}
    >

         <ReactTooltip id={'detail-' + props.player.id}
            className='customeTheme' 
            textColor='#000000' 
            backgroundColor='rgba(255,255,255,1)' 
            effect='solid'
            place='left'>
        <GamePlayerDetail name={props.player.name} life={props.player.life} money={props.player.money} history={props.player.history}/>
    </ReactTooltip>
        <img style={imgStyle} src={`${CDN_PORTRAIT_URL}${props.player.avatar}.png`}/>
        <progress style={progressStyle} className="nes-progress is-error" value={props.player.life} max="100"></progress>
    </div>
}