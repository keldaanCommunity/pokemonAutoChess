import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { removeMessage, searchName } from '../../../stores/NetworkStore'
import { setTabIndex } from '../../../stores/LobbyStore'
import { IMessage, Role } from '../../../../../types'
import { getAvatarSrc } from '../../../utils'

export default function ChatMessage(props: {message: IMessage}) {
    const dispatch = useAppDispatch()
    const role = useAppSelector(state=>state.lobby.user?.role)

    const removeButton = role && (role === Role.MODERATOR || role === Role.ADMIN) ? 
    <button  className='bubbly-close' onClick={() => {dispatch(removeMessage({author: props.message.name, payload: props.message.payload}))}}><p style={{fontSize:'0.5em', margin:'0px'}}>X</p></button> :
    null

    return(
        <div className='chatbg'>
            <div className="chat">
                <div style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                >
                    <img style={{marginRight: '10px'}} src={getAvatarSrc(props.message.avatar)} />
                    <span style={{fontSize:'1vw'}}
                        onClick={()=>{
                            dispatch(searchName(props.message.name))
                            dispatch(setTabIndex(4))
                        }}
                    >{props.message.name}</span>
                    <span style={{fontSize:'1vw'}}>{formatDate(props.message.time)}</span>
                    {removeButton}
                </div>
                <p style={{fontSize:'1vw'}}>{props.message.payload}</p>
            </div>
        </div>

    )
}

function pad(number: number) {
    if ( number < 10 ) {
        return '0' + number
        }
    return number
}


function formatDate(n: number) {
    const date = new Date(n)
    return  pad( date.getMonth() + 1 ) +
        '/' + pad( date.getDate() ) +
        ' ' + pad( date.getHours() ) +
        ':' + pad( date.getMinutes() )
}