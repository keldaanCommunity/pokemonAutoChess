import React from 'react';
import ReactTooltip from 'react-tooltip';
import GamePlayerDetail from './game-player-detail';
import CSS from 'csstype';
import { IPlayer } from '../../../../../types';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setCurrentPlayerId, setPlayer, setSynergies } from '../../../stores/GameStore';

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

const opponentStyle: CSS.Properties = {
    position: 'absolute',
    right: '74px',
    top: '-4px',
    bottom: '0px',
    padding: '0px',
    width: '30px',
    height: '30px',
    margin: '0px',
    border: '2px solid black',
    imageRendering:'pixelated'
};

export default function GamePlayer(props:{player: IPlayer, color: string, click: (id: string)=>void}) {
    const style: CSS.Properties = {
        backgroundColor: props.color,
        cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
        height:'70px',
        width:'70px'
    }
    const dispatch = useAppDispatch();
    const players = useAppSelector(state=>state.network.game.state.players);
    const opponent = props.player.opponentName != '' && props.player.opponentAvatar != ''? <img style={opponentStyle} src={`https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/${props.player.opponentAvatar}.png`}/>: null;

    function playerClick(){
        props.click(props.player.id);
        dispatch(setPlayer(players.get(props.player.id)));
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
        <img style={imgStyle} src={`https://raw.githubusercontent.com/keldaanInteractive/SpriteCollab/master/portrait/${props.player.avatar}.png`}/>
        <progress style={progressStyle} className="nes-progress is-error" value={props.player.life} max="100"></progress>
        {opponent}
    </div>
}