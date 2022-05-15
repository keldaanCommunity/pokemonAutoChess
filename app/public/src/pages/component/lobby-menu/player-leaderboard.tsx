import React from 'react'
import { useAppSelector } from '../../../hooks'
import { ILeaderboardInfo } from '../../../../../models/colyseus-models/leaderboard-info'
import Leaderboard from './leaderboard'

export default function PlayerLeaderboard() {
    const infos: ILeaderboardInfo[] = useAppSelector(state=>state.lobby.leaderboard)
    return <Leaderboard isBot={false} infos={infos}/>
}