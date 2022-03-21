import React, { useEffect, useState } from 'react';
import Chat from './component/chat/chat';
import PreparationMenu from './component/preparation/preparation-menu';
import { Link } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { FIREBASE_CONFIG } from './utils/utils';
import PreparationState from '../../../rooms/states/preparation-state';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Client, Room } from 'colyseus.js';
import { joinGame, joinLobby, joinPreparation, logIn } from '../stores/NetworkStore';
import { addUser, changeUser, leavePreparation, pushMessage, removeUser, setGameStarted, setOwnerId, setOwnerName } from '../stores/PreparationStore';
import GameState from '../../../rooms/states/game-state';
import { ICustomLobbyState } from '../../../types';

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
    const [reconnectionTried, setReconnectionTried] = useState<boolean>(false);

    useEffect(()=>{
        const reconnect = async () => {
            if(!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            firebase.auth().onAuthStateChanged(async user => {
                dispatch(logIn(user));
                try{
                    if(!reconnectionTried){
                        setReconnectionTried(true);
                        const r: Room<PreparationState> = await client.reconnect(localStorage.getItem('lastRoomId'),localStorage.getItem('lastSessionId'));
                        dispatch(joinPreparation(r));
                    }
                }
                catch(error){             
                }
            });
        }

        const initialize = async () => {
            setInitialized(true);
            dispatch(setGameStarted(room.state.gameStarted));
            dispatch(setOwnerId(room.state.ownerId));
            dispatch(setOwnerName(room.state.ownerName));
            room.state.users.forEach(u=>{
                dispatch(addUser(u));
            });
            room.state.onChange = changes => {
                changes.forEach(change => {
                    if( change.field == 'gameStarted') {
                        dispatch(setGameStarted(change.value));
                    }
                    else if (change.field == 'ownerId') {
                        dispatch(setOwnerId(change.value));
                    }
                    else if (change.field == 'ownerName') {
                        dispatch(setOwnerName(change.value));
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
            room.onMessage('game-start', async (message) => {
                const token: string = await firebase.auth().currentUser.getIdToken();
                const r: Room<GameState> = await client.joinById(message.id, {idToken: token});
                localStorage.setItem('lastRoomId', r.id);
                localStorage.setItem('lastSessionId', r.sessionId);
                dispatch(leavePreparation());
                await room.leave();
                joinGame(r);
            });
        }

        const onJoin = async () => {
            if(room == undefined) {
                await reconnect();
            }
            if(room != undefined && room.state != undefined) {
                await initialize();
            }
        }

        if(!initialized){
            onJoin();
        }
    });

    return (<div className="App">
        <Link to='/lobby'>
            <button className='nes-btn is-primary' style={buttonStyle} onClick={async ()=>{
                dispatch(leavePreparation());
                await room.leave();
                }}>Lobby</button>
        </Link>
        <div style={preparationStyle}>
            <PreparationMenu/>
            <Chat source='preparation'/>
        </div>
    </div>)
}
