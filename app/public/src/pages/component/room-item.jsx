import React, { Component } from 'react';

class RoomItem extends Component {
  render() {
    return <div className='nes-container with-title is-centered'>
        <p className='title'>Room id: {this.props.id}</p>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <h3>{this.props.clients}/{this.props.maxClients}</h3>
            <button onClick={this.saveIds.bind(this)} className='nes-btn is-warning'>Join</button>
        </div>
    </div>
  }

  saveIds(){
    localStorage.setItem('lastRoomId', this.props.id);
    this.props.joinRoom(this.props.id);
  }
}
export default RoomItem;
