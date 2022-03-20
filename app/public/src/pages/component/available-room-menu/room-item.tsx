import { RoomAvailable } from 'colyseus.js';
import React from 'react';

export default function RoomItem(props: {room: RoomAvailable}) {
  return <div className='nes-container with-title is-centered'>
    <p className='title'>Room id: {props.room.roomId}</p>
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <h3>{props.room.clients}/{props.room.maxClients}</h3>
        <button className='nes-btn is-warning'>Join</button>
    </div>
  </div>
}