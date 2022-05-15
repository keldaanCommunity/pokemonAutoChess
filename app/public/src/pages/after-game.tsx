import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AfterMenu  from './component/after/after-menu'
import { Client, Room } from 'colyseus.js'
import { useAppDispatch, useAppSelector } from '../hooks'
import AfterGameState from '../../../rooms/states/after-game-state'
import firebase from 'firebase/compat/app'
import { FIREBASE_CONFIG } from './utils/utils'
import { joinAfter, logIn } from '../stores/NetworkStore'
import { addPlayer, leaveAfter } from '../stores/AfterGameStore'

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
    const dispatch = useAppDispatch()
    const client: Client = useAppSelector(state=>state.network.client)
    const room : Room<AfterGameState> | undefined = useAppSelector(state=>state.network.after)
    const [initialized, setInitialized] = useState<boolean>(false)
    const [toLobby, setToLobby] = useState<boolean>(false)
    const [toAuth, setToAuth] = useState<boolean>(false)

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
                            const r: Room<AfterGameState> = await client.reconnect(lastRoomId, lastSessionId)
                            await initialize(r)
                            dispatch(joinAfter(r))
                        }
                        else{
                            setToLobby(true)
                        }

                    }
                    catch(error){
                        setTimeout(async ()=>{
                            const lastRoomId = localStorage.getItem('lastRoomId')
                            const lastSessionId = localStorage.getItem('lastSessionId')
                            if(lastRoomId && lastSessionId){
                                const r: Room<AfterGameState> = await client.reconnect(lastRoomId, lastSessionId)
                                await initialize(r)
                                dispatch(joinAfter(r))
                            }
                            else{
                                setToLobby(true)
                            }
                        }, 1000)
                        console.log(error)         
                    }
                }
                else{
                    setToAuth(true)
                }

            })
        }
    
        const initialize = async (r: Room<AfterGameState>) => {
            r.state.players.onAdd = (player) => {
                dispatch(addPlayer(player))
            }
        }

        if(!initialized){
            reconnect()
        }
    })

    if(toLobby){
        return <Navigate to='/lobby'/>
    }
    if(toAuth){
        return <Navigate to='/auth'/>
    }
    else{
        return <div className='App'>
        <button className='nes-btn is-primary' style={buttonStyle} onClick={()=>{
            if(room) {
                room.connection.close()
            }
            dispatch(leaveAfter())
            setToLobby(true)
        }}>Lobby
        </button>
        <div className="nes-container with-title is-centered" style={style}>
            <AfterMenu/>
        </div>
    </div>
    }
}