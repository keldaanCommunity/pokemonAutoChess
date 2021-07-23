import React, { Component } from 'react';

class RoomItem extends Component {
  render() {
    return <div className='nes-container with-title is-centered'>
        <p className='title'>Room id: {this.props.id}</p>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <h3>{this.props.clients}/{this.props.maxClient}</h3>
            <button className='nes-btn is-warning'>Join</button>
        </div>
    </div>
  }
}
export default RoomItem;
