import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RoomItem extends Component {
  render() {
    return <div className='nes-container with-title is-centered'>
        <p className='title'>Room id: {this.props.id}</p>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <h3>{this.props.clients}/{this.props.maxClients}</h3>
            <Link to={'./preparation' + this.props.id}>
              <button className='nes-btn is-warning'>Join</button>
            </Link>
        </div>
    </div>
  }
}
export default RoomItem;
