import React from 'react';
import SimplePlayer from '../../../../../models/colyseus-models/simple-player';
import { useAppSelector } from '../../../hooks';
import Avatar from '../avatar';
import Team from './team';

export default function AfterMenu() {
    const players = useAppSelector(state=>state.after.players);
    return <table>
    <thead>
        <tr>
            <td>Rank</td>
            <td>Player</td>
            <td>Team</td>
        </tr>
    </thead>
    <tbody>
        {players.map((v)=>{
            return <tr key={v.id}>
            <td>{v.rank}</td>
            <td><Avatar avatar={v.avatar} name={v.name} elo={undefined}/></td>
            <td><Team team={v.pokemons}/></td>
        </tr>})}
    </tbody>
    </table>
}