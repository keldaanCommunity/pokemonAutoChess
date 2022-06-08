import React, { useEffect, useRef, useState } from 'react'
import Chat from './component/chat/chat'
import PreparationMenu from './component/preparation/preparation-menu'
import { Link, Navigate } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { FIREBASE_CONFIG } from './utils/utils'
import PreparationState from '../../../rooms/states/preparation-state'
import { useAppDispatch, useAppSelector } from '../hooks'
import { Client, Room } from 'colyseus.js'
import {joinPreparation, logIn } from '../stores/NetworkStore'
import { addUser, changeUser, leavePreparation, pushMessage, removeUser, setGameStarted, setName, setOwnerId, setOwnerName } from '../stores/PreparationStore'
import GameState from '../../../rooms/states/game-state'
import {Transfer} from '../../../types'

const preparationStyle = {
    display:'flex',
    justifyContent:'space-between',
    marginTop:'-10px'
}

const buttonStyle= {
    marginLeft:'10px',
    marginTop:'10px'
}

export default function Preparation() {
    const dispatch = useAppDispatch()
    const client: Client = useAppSelector(state=>state.network.client)
    const room : Room<PreparationState>|undefined = useAppSelector(state=>state.network.preparation)
    const [initialized, setInitialized] = useState<boolean>(false)
    const [toGame, setToGame] = useState<boolean>(false)
    const audio = useRef(new Audio('assets/sounds/notification.mp3'))

    useEffect(()=>{
        const reconnect = async () => {
            setInitialized(true)
            if(!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG)
            }
            firebase.auth().onAuthStateChanged(async user => {
                if(user){
                    dispatch(logIn(user))
                    try{
                        const lastRoomId = localStorage.getItem('lastRoomId')
                        const lastSessionId = localStorage.getItem('lastSessionId')
                        if(lastRoomId && lastSessionId){
                            const r: Room<PreparationState> = await client.reconnect(lastRoomId,lastSessionId)
                            await initialize(r)
                            dispatch(joinPreparation(r))
                        }
                    }
                    catch(error){
                        console.log(error)         
                    }
                }
            })
        }

        const initialize = async (r: Room<PreparationState>) => {
            r.state.users.forEach(u=>{
                dispatch(addUser(u))
            })
            r.state.onChange = changes => {
                changes.forEach(change => {
                    if( change.field == 'gameStarted') {
                        dispatch(setGameStarted(change.value))
                    }
                    else if (change.field == 'ownerId') {
                        dispatch(setOwnerId(change.value))
                    }
                    else if (change.field == 'ownerName') {
                        dispatch(setOwnerName(change.value))
                    }
                    else if (change.field == 'name') {
                        dispatch(setName(change.value))
                    }
                })
            }
            r.state.users.onAdd = (u) => {
                dispatch(addUser(u))

                if(!u.isBot){
                    console.log('audio')
                    audio.current?.play()
                }

                u.onChange = (changes) => {
                    changes.forEach(change=>{
                        dispatch(changeUser({id: u.id, field: change.field, value: change.value}))
                    })
                }
            }
            r.state.users.onRemove = (u) => {dispatch(removeUser(u.id))}
            r.onMessage(Transfer.MESSAGES, (message) => {
                dispatch(pushMessage(message))
            })
            r.onMessage(Transfer.GAME_START, async (message) => {
                const token = await firebase.auth().currentUser?.getIdToken()
                if(token){
                    const game: Room<GameState> = await client.joinById(message.id, {idToken: token})
                    localStorage.setItem('lastRoomId', game.id)
                    localStorage.setItem('lastSessionId', game.sessionId)
                    await r.leave()
                    game.connection.close()
                    dispatch(leavePreparation())
                    setToGame(true)
                }
            })
        }

        if(!initialized){
            reconnect()
        }
    })

    if(toGame) {
        return <Navigate to='/game'/>
    }
    else{
        return (<div className="App">
        <Link to='/lobby'>
            <button className='bubbly-primary' style={buttonStyle} onClick={async ()=>{
                dispatch(leavePreparation())
                room?.connection.close()
                }}>Lobby</button>
        </Link>
        <div style={preparationStyle}>
            <PreparationMenu setToGame={setToGame}/>
            <Chat source='preparation'/>
        </div>
    </div>)
    }
}
