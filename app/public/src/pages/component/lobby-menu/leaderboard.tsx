import React from 'react';
import { useAppSelector } from '../../../hooks';
import LeaderboardItem from './leaderboard-item';
import { ILeaderboardInfo } from '../../../../../models/colyseus-models/leaderboard-info';

export default function Leaderboard(props: {isBot: boolean}) {
    const infos: ILeaderboardInfo[] = props.isBot ? useAppSelector(state=>state.lobby.botLeaderboard) : useAppSelector(state=>state.lobby.leaderboard);
    return <div>
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <p>Rank</p>
            <p>Name</p>
            <p>Elo</p>
        </div>
        <table>
            <tbody>
                {infos.map((i: ILeaderboardInfo, index: number) => <LeaderboardItem key={index} item={i} isBot={props.isBot}/>)}
            </tbody>
        </table>
    </div>;
}