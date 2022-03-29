import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AfterMenu  from './component/after/after-menu';
import { Client, Room } from 'colyseus.js';
import { useAppDispatch, useAppSelector } from '../hooks';
import AfterGameState from '../../../rooms/states/after-game-state';
import firebase from 'firebase/compat/app';
import { FIREBASE_CONFIG } from './utils/utils';
import { joinAfter, logIn } from '../stores/NetworkStore';
import { addPlayer, leaveAfter } from '../stores/AfterGameStore';

const buttonStyle = {
    marginLeft:'10px',
    marginTop:'10px'
}

 const style = {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    margin:'10px',
    display: 'flex',
    flexFlow: 'column'
}

export default function AfterGame(){
    const dispatch = useAppDispatch();
    const client: Client = useAppSelector(state=>state.network.client);
    const room : Room<AfterGameState> = useAppSelector(state=>state.network.after);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [toLobby, setToLobby] = useState<boolean>(false);

    useEffect(()=>{
        const reconnect = async () => {
            setInitialized(true);
            if(!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            firebase.auth().onAuthStateChanged(async user => {
                dispatch(logIn(user));
                try{
                    const r: Room<AfterGameState> = await client.reconnect(localStorage.getItem('lastRoomId'),localStorage.getItem('lastSessionId'));
                    await initialize(r);
                    dispatch(joinAfter(r));
                }
                catch(error){
                    console.log(error);         
                }
            });
        }
    
        const initialize = async (r: Room<AfterGameState>) => {
            r.state.players.onAdd = (player, key) => {
                dispatch(addPlayer(player));
            }
        }

        if(!initialized){
            reconnect();
        }
    });

    if(toLobby){
        return <Navigate to='/lobby'/>
    }
    else{
        return <div className='App'>
        <button className='nes-btn is-primary' style={buttonStyle} onClick={()=>{
            room.connection.close();
            dispatch(leaveAfter());
            setToLobby(true);
        }}>Lobby
        </button>
        <div className="nes-container with-title is-centered" style={style}>
            <AfterMenu/>
        </div>
    </div>
    }
}