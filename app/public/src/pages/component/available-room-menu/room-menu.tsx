import { Client, Room } from 'colyseus.js';
import { RoomAvailable } from 'colyseus.js';
import firebase from 'firebase/compat/app';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {ICustomLobbyState} from '../../../../../types';
import RoomItem from './room-item';
import { joinRoom } from '../../../stores/NetworkStore';
import PreparationState from '../../../../../rooms/states/preparation-state';


const ulStyle = {
    listStyle: 'none',
    padding: '0px'
};

export default function RoomMenu() {

    const dispatch = useAppDispatch();
    const allRooms: RoomAvailable[] = useAppSelector(state=>state.lobby.allRooms);
    const client: Client = useAppSelector(state=>state.network.client);
    const lobby: Room<ICustomLobbyState> = useAppSelector(state=>state.network.lobby);
    const uid: string = useAppSelector(state=>state.network.uid);
    const [roomCreated, setRoomCreated] = useState<boolean>(false);
     
    async function create() {
        if(!roomCreated) {
            setRoomCreated(true);
            const token: string = await firebase.auth().currentUser.getIdToken();
            const room: Room<PreparationState> = await client.create('room', {idToken: token, ownerId: uid});
            await lobby.leave();
            localStorage.setItem('lastRoomId', room.id);
            localStorage.setItem('lastSessionId', room.sessionId);
            dispatch(joinRoom(room));
        }
    }

   async function join(id:string) {
       const token: string = await firebase.auth().currentUser.getIdToken();
       const room: Room<PreparationState> = await client.joinById(id, {idToken: token});
       await lobby.leave();
       localStorage.setItem('lastRoomId', room.id);
       localStorage.setItem('lastSessionId', room.sessionId);
       dispatch(joinRoom(room));
   }

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
             {allRooms.map(r=><li key={r.roomId} onClick={()=>join.bind(r.roomId)}><RoomItem room={r}/></li>)}
         </ul>
        <button onClick={create} className='nes-btn is-success'>Create room</button>
    </div>;
}