import React, { useState } from 'react';
import "nes.css/css/nes.min.css";
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { sendMessage } from '../../../stores/NetworkStore';
import ChatHistory from './chat-history';

export default function Chat(props: {source: string}) {
  const dispatch = useAppDispatch();
  const [currentText, setCurrentText] = useState<string>('');

  return <div className="nes-container" style={{
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, .6)',
    margin:'10px',
    height:'90vh',
    flexBasis: '30%'
    }}>
      <ChatHistory source={props.source}/>
      <form onSubmit={(e)=>{
          e.preventDefault();
          dispatch(sendMessage(currentText));
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