import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import ChatMessage from './chat-message';
import CSS from 'csstype';
import { IMessage } from '../../../../../types';

export default function ChatHistory() {
    const ulStyles: CSS.Properties = {
        flex: '1',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        maxWidth: 'inherit',
        maxHeight: 'inherit'
    };
    const messages = useAppSelector(state=>state.lobby.messages);
    const domRef = useRef(null);

    useEffect(()=>{
        if(messages.length > 0) {
            domRef.current.scollTop = domRef.current.scrollHeight;
        }
    });
 
    return (<div ref={domRef} style={ulStyles}>{messages.map((m,i)=>{return message(m,i)})}</div>)
}

function message(message: IMessage, index: number) {

    const liStyles = {
        padding: '5px',
        borderBottom: '1px solid #ddd'
    };

    return <div key={index} style={liStyles}><ChatMessage message={message}/></div>
}
