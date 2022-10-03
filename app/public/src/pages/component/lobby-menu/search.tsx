import React, { useState } from 'react'
import History from './history'
import { CDN_PORTRAIT_URL } from '../../../../../types'
import Elo from '../elo'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { searchName, searchById } from '../../../stores/NetworkStore'

export default function Search() {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state=>state.lobby.searchedUser)
    const suggestions = useAppSelector(state=>state.lobby.suggestions)
    const [currentText, setCurrentText] = useState<string>('')

    return <div>
        <div className="nes-field is-inline">
            <input type="text" id="inline_field" className="my-input" placeholder="Player Name..." value={currentText} onChange={(e)=>{setCurrentText(e.target.value); dispatch(searchName(e.target.value))}}/>
        </div>
        <div style={{display:'flex', gap:'10px',flexWrap:'wrap', marginTop:'10px', justifyContent:'space-around'}}>
            {suggestions.map(suggestion => <div style={{display:'flex', flexFlow:'column', padding:'5px'}} className='playerBox my-cursor' key={suggestion.id} onClick={(e)=>{dispatch(searchById(suggestion.id))}}>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img style={{width:'40px',height:'40px'}} src={`${CDN_PORTRAIT_URL}${suggestion.avatar}.png`}/>
                </div>
                <div style={{display:'flex', flexFlow:'column'}}>
                    <p style={{margin:'0px', padding:'0px'}}>{suggestion.name} </p>
                </div>
            </div>)}
        </div>
        {user ? 
        <div>
            <div style={{display:'flex', alignItems: 'center', marginTop: '30px'}}>
                <img src={CDN_PORTRAIT_URL + user.avatar + '.png'}/>
                <h5>{user.name}</h5>
                <Elo elo={user.elo}/>
            </div>
            <p>Level {user.level} ({user.exp} / 1000)</p>
            <p>Wins: {user.wins}</p>
            <p>Tipee contributor: {user.donor ? 'Yes': 'No'}</p>
            <h5>Game History</h5>
            <History history={user.history}/>
        </div>
        :null
        }
    </div>
}