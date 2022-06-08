import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import PreparationMenuUser from './preparation-menu-user'
import { IGameUser } from '../../../../../models/colyseus-models/game-user'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { addBot, changeRoomName, gameStart, toggleReady } from '../../../stores/NetworkStore'
import firebase from 'firebase/compat/app'
import { Client, Room } from 'colyseus.js'
import GameState from '../../../../../rooms/states/game-state'
import { BotDifficulty } from '../../../../../types/enum/Game'
import { leavePreparation } from '../../../stores/PreparationStore'
import PreparationState from '../../../../../rooms/states/preparation-state'

const buttonStyle = {
    marginLeft:'10px',
    marginRight:'10px'
}


export default function PreparationMenu(props:{setToGame: Dispatch<SetStateAction<boolean>>}) {
    const dispatch = useAppDispatch()
    const [inputValue, setInputValue] = useState<string>('')
    const users: IGameUser[] = useAppSelector(state=>state.preparation.users)
    const ownerName: string = useAppSelector(state=>state.preparation.ownerName)
    const name: string = useAppSelector(state=>state.preparation.name)
    const ownerId: string = useAppSelector(state=>state.preparation.ownerId)
    const uid: string = useAppSelector(state=>state.network.uid)
    const client: Client = useAppSelector(state=>state.network.client)
    const room: Room<PreparationState> | undefined = useAppSelector(state=>state.network.preparation)
    const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(BotDifficulty.MEDIUM)

    async function startGame() {
        if(room){
            let allUsersReady = true
            users.forEach(user=> {if(!user.ready){allUsersReady = false}})
            if(allUsersReady){
                const token = await firebase.auth().currentUser?.getIdToken()
                if(token) {
                    const r: Room<GameState> = await client.create('game', {users: users, idToken: token, name: name, preparationId: room.id})
                    dispatch(gameStart(r.id))
                    localStorage.setItem('lastRoomId', r.id)
                    localStorage.setItem('lastSessionId', r.sessionId)
                    await room.leave()
                    r.connection.close()
                    dispatch(leavePreparation())
                    props.setToGame(true)
                }
            }
        }
    }

    let input: ReactElement|null = null
    if(uid == ownerId){
        input = <div className="nes-field is-inline" style={{margin:'5px'}}>
        <input maxLength={30} type="text" id="inline_field" className="nes-input" placeholder={name} onChange={e=>{setInputValue(e.target.value)}}/>
        <button style={{marginLeft:'10px'}} className="nes-btn is-primary" onClick={()=>dispatch(changeRoomName(inputValue))}>Change</button>
    </div>
    }
    return <div className="nes-container with-title is-centered" style={{
        backgroundColor: 'rgba(255, 255, 255, .6)',
         margin:'10px',
         display: 'flex',
         flexFlow: 'column',
         justifyContent: 'space-between',
         flexBasis:'50%'
         }}>
             <p className="title">{name}</p>
            <div>
                {users.map((u) => {
                return <PreparationMenuUser 
                    key={u.id} 
                    user={u}
                />})}
            </div>

            <div>
                {input}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex'}}>
                    <button data-tip data-for={'difficulty-select'} style={buttonStyle} className='nes-btn is-primary' onClick={() => {dispatch(addBot(botDifficulty))}}>
                        <ReactTooltip id={'difficulty-select'} 
                            className='customeTheme' 
                            textColor='#000000' 
                            backgroundColor='rgba(255,255,255,1) !important' 
                            effect='solid'
                            place='top'>
                            <p>Easy: &lt;800</p>
                            <p>Normal: 800-1099</p>
                            <p>Hard: &gt;=1100</p>
                        </ReactTooltip>
                        Add Bot
                    </button>

                    <div className="nes-select" style={{width: 'auto'}}>
                        
                        <select defaultValue={botDifficulty}  onChange={(e)=>{ setBotDifficulty(parseInt(e.target.value)) }}>
                            <option value={BotDifficulty.EASY}>Easy</option>
                            <option value={BotDifficulty.MEDIUM}>Normal</option>
                            <option value={BotDifficulty.HARD}>Hard</option>
                        </select>
                    </div>
                    
                </div>
                <div>
                    <button style={buttonStyle} className='nes-btn is-warning' onClick={()=>{dispatch(toggleReady())}}>Ready</button>
                    <button 
                        style={buttonStyle} 
                        className={ownerId == uid ? 'nes-btn is-success':'nes-btn is-disabled'} 
                        onClick={ownerId == uid ? startGame: undefined}
                        data-tip
                        data-for={'start-game'}
                        >
                        Start Game
                        <ReactTooltip id={'start-game'} 
                            className='customeTheme' 
                            textColor='#000000' 
                            backgroundColor='rgba(255,255,255,1) !important' 
                            effect='solid'
                            place='top'>
                            <p>Owner: ({ownerName})</p>
                        </ReactTooltip>
                    </button>
                </div>
            </div>
            </div>
        </div>
}