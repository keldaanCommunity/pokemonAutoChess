import React from 'react';
import { IGameUser } from '../../../../../models/colyseus-models/game-user';
import { useAppDispatch } from '../../../hooks';
import { removeBot } from '../../../stores/NetworkStore';
import Elo from '../elo';
import InlineAvatar from '../inline-avatar';

const buttonStyle = {
    marginLeft:'10px',
    marginRight:'10px'
};

export default function PreparationMenuUser(props: {key: string, user: IGameUser}){

    const dispatch = useAppDispatch();
    const readyColor = props.user.ready ? "#76c442" : "#ce372b";

    const removeButton = props.user.isBot ? 
        <button style={buttonStyle} className='nes-btn is-error' onClick={() => {dispatch(removeBot(props.user.id))}}>X</button> :
        null

    return <div className='nes-container' style={{display:'flex', backgroundColor: '#fff', padding:'5px', margin:'5px', borderColor:readyColor, justifyContent:'space-between'}}>
    <div style={{display:'flex'}}>
        <div style={{width:'140px'}}>
            <Elo elo={props.user.elo} style={{width:'140px'}}/>
        </div>
        <InlineAvatar avatar={props.user.avatar} name={props.user.name}/>
    </div>
    {removeButton}
    </div>
}