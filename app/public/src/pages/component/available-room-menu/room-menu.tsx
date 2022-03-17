import { RoomAvailable } from 'colyseus.js';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { createRoom } from '../../../stores/NetworkStore';
import RoomItem from './room-item';

export default function RoomMenu() {
    const ulStyle = {
        listStyle: 'none',
        padding: '0px'
    };

    const allRooms: RoomAvailable[] = useAppSelector(state=>state.lobby.allRooms);
    

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
             {allRooms.map(r=>createItem(r))}
         </ul>
        <button onClick={create} className='nes-btn is-success'>Create room</button>
    </div>;
}

function createItem(r: RoomAvailable){
    return <li key={r.roomId}><RoomItem room={r}/></li>
}

function create() {
    const [roomCreated, setRoomCreated] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    if(!roomCreated) {
        setRoomCreated(true);
        dispatch(createRoom(true));
    }
}