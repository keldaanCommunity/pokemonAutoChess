import React from 'react'
import { useAppSelector } from '../../../hooks'
import Avatar from '../avatar'
import Team from './team'

export default function AfterMenu() {
    const players = useAppSelector(state=>state.after.players)
    return <div style={{display:'flex', flexFlow:'column', gap:'10px'}}>
        <div style={{color:'#fff', fontSize:'1.3em', display:'flex', justifyContent:'space-between'}}>
            <p>Rank</p>
            <p>Player</p>
            <p>Team</p>
        </div>
        {players.map((v)=>{
            return <div key={v.id} style={{color:'#fff', display:'flex', fontSize:'1.3em', justifyContent:'space-between'}}>
            <p>{v.rank}</p>
            <Avatar avatar={v.avatar} name={v.name} elo={undefined}/>
            <Team team={v.pokemons}/>
        </div>})}
    </div>
}