import React from 'react'
import { ILobbyUser } from '../../../../../models/colyseus-models/lobby-user'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { setTabIndex } from '../../../stores/LobbyStore'
import { searchName } from '../../../stores/NetworkStore'
import Avatar from '../avatar'
import CSS from 'csstype'

const ulStyle = {
    listStyle: 'none',
    padding: '0px',
}

const style : CSS.Properties = {
    backgroundColor: 'rgba(255, 255, 255, .6)',
     margin:'10px',
     flexBasis:'15%',
     height:'90vh',
     overflowY:'scroll',
     backgroundImage:'url("assets/ui/back2.png")',
     backgroundSize: 'cover',
     backgroundPositionX: 'right',
     color:'white'
}

export default function CurrentUsers () {
    const users: ILobbyUser[] = useAppSelector(state=>state.lobby.users)

    return <div className="nes-container hidden-scrollable" style={style}>
        <h1 className='my-h1'>Online</h1>
        <ul style={ulStyle}>{users.map((v, i)=><User key={i} v={v}/>)}</ul>
    </div>

}

function User(props:{key: number, v: ILobbyUser}) {
    const dispatch = useAppDispatch()
    const cursorStyle = {
        cursor:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer'
    }
    return <li 
        style={cursorStyle}             
        onClick={()=>{
            dispatch(searchName(props.v.name))
            dispatch(setTabIndex(3))
        }}>
        <Avatar avatar={props.v.avatar} name={props.v.name} elo={props.v.elo}/>
    </li>
}