import React from 'react';
import ChatMessage from './chat-message';

export default class ChatHistory extends React.Component {
    constructor(props) {
        super(props)
        this.domElement = React.createRef()
    }

    componentDidUpdate(){
        if (this.props.messages.length > 0) {
            this.domElement.current.scrollTop = this.domElement.current.scrollHeight;
        }
    }

    createMessage(message, index){
        let liStyles = {
            padding: '5px',
            borderBottom: '1px solid #ddd'
        };
        return <div key={index} style={liStyles}><ChatMessage message={message}/></div>
    }

    render() {
        let ulStyles = {
            flex: '1',
            width: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            maxWidth: 'inherit',
            maxHeight: 'inherit'
        };
        return <div ref={this.domElement} style={ulStyles}>{this.props.messages.map(this.createMessage)}</div>;
    }
 }