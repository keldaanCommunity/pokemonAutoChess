import React from 'react';
import ChatHistory from './chat-history';
import "nes.css/css/nes.min.css";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
   
    return <div className="nes-container" style={{
        backgroundColor: 'rgba(255, 255, 255, .6)',
         margin:'10px',
         overflow:'scroll',
         height:'92vh'
         }}>
            <ChatHistory messages={this.props.messages}/>
            <form onSubmit={this.props.handleSubmit} style={{display:'flex'}}>
              <div className="nes-field" style={{width: '80%'}}>
                <input id="name_field" type="text" className="nes-input" onChange={this.props.setCurrentText} value={this.props.currentText} />
              </div>
              
              <button className="nes-btn is-primary" style={{width: '20%'}}>Send</button>
            </form>
        </div>
  }
}