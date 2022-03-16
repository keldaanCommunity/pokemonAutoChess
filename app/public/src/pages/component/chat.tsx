import React, { useState } from 'react';
import ChatHistory from './chat-history';
import "nes.css/css/nes.min.css";
import { useAppSelector } from '../../hooks';

export default function Chat(){
  const messages = useAppSelector(state=>state.lobby.messages);
  const user = useAppSelector(state=> state.lobby.user);
  const room = useAppSelector(state=>state.network.lobby);
  const [currentText, setCurrentText] = useState<string>('');

  return <div className="nes-container" style={{
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, .6)',
    margin:'10px',
    height:'90vh',
    flexBasis: '40%'
    }}>
      <ChatHistory/>
      <form onSubmit={(e)=>{
          e.preventDefault()
          room.send('new-message', {'name': user.name, 'payload': currentText, 'avatar':user.avatar });
          setCurrentText('');
        }}
        style={{
        display:'flex',
        flexFlow: 'row nowrap',
        width: '100%',
        marginTop: '15px'
        }}>
        <div className="nes-field" style={{width: '80%'}}>
          <input id="name_field" type="text" className="nes-input" onChange={(e)=>{setCurrentText(e.target.value)}} value={currentText} />
        </div>
        <button className="nes-btn is-primary" style={{width: '20%'}}>Send</button>
      </form>
    </div>
}