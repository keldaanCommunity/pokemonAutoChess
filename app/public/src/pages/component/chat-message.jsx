import React from 'react';
import Avatar from './avatar';

export default class ChatMessage extends React.Component{
    render() {
        return(
           <div style ={{display:'flex'}}>
              <Avatar name={this.props.message.name} avatar={this.props.message.avatar}/>
               <p>{this.props.message.payload}</p>
               <br />
           </div>
        );
     }
 }