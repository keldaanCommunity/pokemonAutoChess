import React, { Component } from 'react';
import RoomItem from './room-item';

class RoomMenu extends Component{
    render(){

        const ulStyle = {
            listStyle: 'none',
            padding: '0px'
        };

        return <div className="nes-container" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
             margin:'10px',
             display: 'flex',
             flexFlow: 'column',
             flexBasis: '15%',
             height: '90vh'
             }}>
            <h6 style={{textAlign:'center'}}>Available Rooms:</h6>
            <h6 style={{textAlign:'center'}}>Click 'Create Room' to play</h6>
             <ul style={ulStyle}>
                 {this.props.allRooms.map(this.createItem.bind(this))}
             </ul>
            <button onClick={this.props.createRoom} className='nes-btn is-success'>Create room</button>
        </div>;
    }

    createItem(i){
        return <li key={i.roomId}><RoomItem id={i.roomId} clients={i.clients} maxClients={i.maxClients} joinRoom={this.props.joinRoom}/></li>
    }
}

export default RoomMenu;