import React from 'react';

export default class ChatMessage extends React.Component{
    render() {
        return(
            <div className="nes-container with-title" style={{
                backgroundColor: '#fff'
            }}>
                <div className="title" style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    alignItems: 'center'
                }}>
                    <img style={{marginRight: '10px'}} src={`assets/avatar/${this.props.message.avatar}.png`} />
                    <span>{this.props.message.name}</span>
                </div>
                <p>{this.props.message.payload}</p>
            </div>
        );
     }
 }