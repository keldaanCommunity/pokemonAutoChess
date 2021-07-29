import React from 'react';
import ChatHistory from './chat-history';
import "nes.css/css/nes.min.css";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="nes-container" style={{
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(255, 255, 255, .6)',
      margin:'10px',
      height:'92vh',
      flexBasis: '35%'
      }}>
        <ChatHistory messages={this.props.messages}/>
        <form onSubmit={this.props.handleSubmit} style={{
          display:'flex',
          flexFlow: 'row nowrap',
          width: '100%',
          marginTop: '15px'
          }}>
          <div className="nes-field" style={{width: '80%'}}>
            <input id="name_field" type="text" className="nes-input" onChange={this.props.setCurrentText} value={this.props.currentText} />
          </div>
          <button className="nes-btn is-primary" style={{width: '20%'}}>Send</button>
        </form>
      </div>
  }
}