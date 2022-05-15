import React from 'react'
import { useAppSelector } from '../../../hooks'
import { ILeaderboardInfo } from '../../../../../models/colyseus-models/leaderboard-info'
import Leaderboard from './leaderboard'

export default function BotLeaderboard() {
    const infos: ILeaderboardInfo[] = useAppSelector(state=>state.lobby.botLeaderboard)
    return <Leaderboard isBot={true} infos={infos}/>
}