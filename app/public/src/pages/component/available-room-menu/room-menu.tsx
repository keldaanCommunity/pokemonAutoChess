import { Client, Room } from 'colyseus.js';
import { RoomAvailable } from 'colyseus.js';
import firebase from 'firebase/compat/app';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {ICustomLobbyState} from '../../../../../types';
import RoomItem from './room-item';
import PreparationState from '../../../../../rooms/states/preparation-state';
import { Link, Navigate } from 'react-router-dom';
import { leaveLobby } from '../../../stores/LobbyStore';
import CSS from 'csstype';

const ulStyle = {
    listStyle: 'none',
    padding: '0px'
};

const liStyle = {
    marginBottom: '20px'
}

const scrollStyle : CSS.Properties = {
    height:'100%',
    overflowY:'auto'
};

export default function RoomMenu(props: { toPreparation: boolean; setToPreparation: Dispatch<SetStateAction<boolean>>; }) {

    const dispatch = useAppDispatch();
    const allRooms: RoomAvailable[] = useAppSelector(state=>state.lobby.allRooms);
    const client: Client = useAppSelector(state=>state.network.client);
    const lobby: Room<ICustomLobbyState> = useAppSelector(state=>state.network.lobby);
    const uid: string = useAppSelector(state=>state.network.uid);
     
    async function create() {
        if(!props.toPreparation) {
            const token: string = await firebase.auth().currentUser.getIdToken();
            const room: Room<PreparationState> = await client.create('room', {idToken: token, ownerId: uid});
            localStorage.setItem('lastRoomId', room.id);
            localStorage.setItem('lastSessionId', room.sessionId);
            await lobby.leave();
            room.connection.close();
            dispatch(leaveLobby());
            props.setToPreparation(true);
        }
    }

   async function join(id:string) {
       if(!props.toPreparation) {
        const token: string = await firebase.auth().currentUser.getIdToken();
        const room: Room<PreparationState> = await client.joinById(id, {idToken: token});
        localStorage.setItem('lastRoomId', room.id);
        localStorage.setItem('lastSessionId', room.sessionId);
        await lobby.leave();
        room.connection.close();
        dispatch(leaveLobby());
        props.setToPreparation(true);
    }
   }

    return <div className="nes-container" style={{
        backgroundColor: 'rgba(255, 255, 255, .6)',
         margin:'10px',
         display: 'flex',
         flexFlow: 'column',
         flexBasis: '15%',
         height: '90vh'
         }}>
        <h6 style={{textAlign:'center'}}>Click 'Create Room' to play</h6>
        <button onClick={create} className='nes-btn is-success'>Create room</button>
        <h6 style={{textAlign:'center', marginTop: '20px'}}>Available Rooms:</h6>

        <div className="hidden-scrollable" style={scrollStyle}>
            <ul style={ulStyle}>
                {allRooms.map(r=>
                    <li style={liStyle} key={r.roomId} onClick={()=>{join(r.roomId)}}>
                    <RoomItem room={r}/>
                    
                </li>)}
            </ul>
        </div>
    </div>
}