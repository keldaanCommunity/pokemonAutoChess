import React, { Component } from 'react';
import RoomItem from './room-item';

class RoomMenu extends Component{
    render(){
        return <div className="nes-container" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
             margin:'10px'
             }}>
            <h1>Available Rooms:</h1>
             <ul>
                 {this.props.allRooms.map(this.createItem.bind(this))}
             </ul>
            <button className='nes-btn is-success'>Create room</button>
        </div>;
    }

    createItem(i){
        return <li key={i.id}><RoomItem/></li>
    }
}

export default RoomMenu;