import React from 'react'
import { ILeaderboardInfo } from '../../../../../models/colyseus-models/leaderboard-info'
import { useAppDispatch } from '../../../hooks'
import { setTabIndex } from '../../../stores/LobbyStore'
import { searchName } from '../../../stores/NetworkStore'
import Elo from '../elo'
import { CDN_PORTRAIT_URL } from '../../../../../types'

const clickStyle = {
    cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer'
}

export default function LeaderboardItem(props: {item: ILeaderboardInfo, isBot: boolean}){
    const dispatch = useAppDispatch()
    return <tr onClick={()=>{
        if(!props.isBot) {
            dispatch(searchName(props.item.name))
            dispatch(setTabIndex(3))
        }
    }}
    style= {!props.isBot ? clickStyle: { cursor: 'default'}}>
        <td>
            {props.item.rank}
        </td>
        <td>
            <img src={CDN_PORTRAIT_URL + props.item.avatar + '.png'}/>    
        </td>
        <td style={{overflow:'hidden', whiteSpace:'nowrap', maxWidth:'300px'}}>
            {props.item.name}
        </td>
        <td> 
            <Elo elo={props.item.value}/>
        </td>
    </tr>
}