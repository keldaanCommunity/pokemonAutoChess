import React from 'react';
import GamePlayer from './game-player';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position:'absolute',
    right:'.5%',
    top: '.5%',
    width:'70px',
    height:'700px',
    display:'flex',
    flexFlow:'column',
    justifyContent:'space-between'
}

export default function GamePlayers(props: {click: (id: string)=>void}) {
    const players = useAppSelector(state=>state.game.players);
    const uid = useAppSelector(state=>state.network.uid);
    const sortedPlayers = [...players];
    return <div style={style}>
    {sortedPlayers.sort((a,b)=>{return a.rank - b.rank}).map(p=>{
        return <GamePlayer 
        key={p.id} 
        player={p}
        color={uid == p.id ? 'rgba(247, 213, 29, 0.7)':'rgba(255, 255, 255, 0.7)'}
        click={(id: string)=>props.click(id)}
        />
    })}
</div>
}