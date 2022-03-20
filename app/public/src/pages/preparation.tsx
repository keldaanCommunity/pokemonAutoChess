import React, { useEffect, useState } from 'react';
import Chat from './component/chat/chat';
import PreparationMenu from './component/preparation/preparation-menu';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { FIREBASE_CONFIG } from './utils/utils';
import PreparationState from '../../../rooms/states/preparation-state';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Client, Room } from 'colyseus.js';
import { joinPreparation } from '../stores/NetworkStore';
import { addUser, changeUser, pushMessage, removeUser, setGameStarted, setOwnerId, setOwnerName } from '../stores/PreparationStore';

const preparationStyle = {
    display:'flex',
    justifyContent:'space-between'
};

const buttonStyle= {
    marginLeft:'10px',
    marginTop:'10px'
}

export default function Preparation() {
    const dispatch = useAppDispatch();
    const client: Client = useAppSelector(state=>state.network.client);
    const room : Room<PreparationState> = useAppSelector(state=>state.network.preparation);
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(()=>{
        const reconnect = async () => {
            if(!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            firebase.auth().onAuthStateChanged(async user => {
                const r: Room<PreparationState> = await client.reconnect(localStorage.getItem('lastRoomId'),localStorage.getItem('lastSessionId'));
                dispatch(joinPreparation(r));
            });
        }
        if(!room) {
            reconnect();
        }
        else{
            if(!initialized){
                setInitialized(true);
                dispatch(setOwnerId(room.state.ownerId));
                dispatch(setOwnerName(room.state.ownerName));
                dispatch(setGameStarted(room.state.gameStarted));
                room.state.onChange = changes => {
                    changes.forEach(change=>{
                        if(change.field == 'gameStarted'){
                            setGameStarted(change.value);
                        }
                    });
                }
                room.state.users.onAdd = (u) => {
                    dispatch(addUser(u));

                    u.onChange = (changes) => {
                        changes.forEach(change=>{
                            dispatch(changeUser({id: u.id, field: change.field, value: change.value}));
                        });
                    };
                };
                room.state.users.onRemove = (u) => {dispatch(removeUser(u.id))};
                room.onMessage('messages', (message) => {
                    dispatch(pushMessage(message));
                });
                room.onMessage('game-start', (message) => {

                });
            }
        }
    });

    return (<div className="App">
        <Link to='/lobby'>
            <button className='nes-btn is-primary' style={buttonStyle} onClick={()=>{room.leave()}}>Lobby</button>
        </Link>
        <div style={preparationStyle}>
            <PreparationMenu/>
            <Chat/>
        </div>
    </div>)
}
