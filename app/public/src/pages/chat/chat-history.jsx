import React from 'react';
import ChatMessage from './chat-message';
import { findDOMNode } from 'react-dom';

 export default class ChatHistory extends React.Component{

    componentDidUpdate(){
        if(this.props.messages.length != 0){
            //console.log(this.props.messages.length);
            let domMessages = findDOMNode(this.refs.history);
            domMessages.scrollTop = domMessages.scrollHeight;
        }
    }

    createMessage(message, index){
        let liStyles = {
            padding: '5px',
            borderBottom: '1px solid #ddd'
         };
         return <li key={index} style={liStyles}><ChatMessage message={message}/></li>
    }

    render() {
           
        let ulStyles = {
           listStyle: 'none',
           margin: 0,
           padding: 0,
           overflowX: 'hidden',
           overflowY: 'scroll',
           maxWidth: 'inherit',
           maxHeight: 'inherit'
        };
        return <ul ref="history" style={ulStyles}>{this.props.messages.map(this.createMessage.bind(this))}</ul>;
     }
 }