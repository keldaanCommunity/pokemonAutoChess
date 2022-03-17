import { RoomAvailable } from 'colyseus.js';
import React from 'react';
import { useAppDispatch } from '../../../hooks';
import { joinRoom } from '../../../stores/NetworkStore';

export default function RoomItem(props: {room: RoomAvailable}) {
  return <div className='nes-container with-title is-centered'>
    <p className='title'>Room id: {props.room.roomId}</p>
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <h3>{props.room.clients}/{props.room.maxClients}</h3>
        <button onClick={()=>{saveIds(props.room.roomId)}} className='nes-btn is-warning'>Join</button>
    </div>
  </div>
}

function saveIds(id: string){
  const dispatch = useAppDispatch();
  localStorage.setItem('lastRoomId', id);
  dispatch(joinRoom(id));
}