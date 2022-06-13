import React from 'react'
import { ILeaderboardInfo } from '../../../../../models/colyseus-models/leaderboard-info'
import { useAppDispatch } from '../../../hooks'
import { setTabIndex } from '../../../stores/LobbyStore'
import { searchName } from '../../../stores/NetworkStore'
import Elo from '../elo'
import { CDN_PORTRAIT_URL } from '../../../../../types'


export default function LeaderboardItem(props: {item: ILeaderboardInfo, isBot: boolean}){
    const dispatch = useAppDispatch()
    return <div className='playerBox my-cursor' style={{ display: 'flex', justifyContent:'space-between', alignItems:'center'}} onClick={()=>{
        if(!props.isBot) {
            dispatch(searchName(props.item.name))
            dispatch(setTabIndex(3))
        }
    }}>
        <div style={{display:'flex', gap:'5px'}}>
            {props.item.rank}
            <img src={CDN_PORTRAIT_URL + props.item.avatar + '.png'}/> 
        </div>
        <div style={{overflow:'hidden', whiteSpace:'nowrap', maxWidth:'300px'}}>
            {props.item.name}
        </div>
        <div> 
            <Elo elo={props.item.value}/>
        </div>
    </div>
}