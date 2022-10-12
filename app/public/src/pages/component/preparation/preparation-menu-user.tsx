import React from 'react'
import { IGameUser } from '../../../../../models/colyseus-models/game-user'
import { useAppDispatch } from '../../../hooks'
import { removeBot } from '../../../stores/NetworkStore'
import Elo from '../elo'
import InlineAvatar from '../inline-avatar'

const buttonStyle = {
    marginLeft:'10px',
    marginRight:'10px'
}

export default function PreparationMenuUser(props: {key: string, user: IGameUser}){

    const dispatch = useAppDispatch()
    const readyColor = props.user.ready ? '#76c442' : '#ce372b'

    const removeButton = props.user.isBot ? 
        <button style={buttonStyle} className='bubbly-close' onClick={() => {dispatch(removeBot(props.user.id))}}><p style={{fontSize:'0.5em', margin:'0px'}}>X</p></button> :
        null

    return <div className='nes-container playerBox' style={{ width:'40%', display:'flex', padding:'5px', margin:'5px', borderColor:readyColor, justifyContent:'space-between'}}>
    <div style={{display:'flex'}}>
        <div style={{width:'140px'}}>
            <Elo elo={props.user.elo}/>
        </div>
        <InlineAvatar avatar={props.user.avatar} name={props.user.name} title={props.user.title}/>
    </div>
    {removeButton}
    </div>
}