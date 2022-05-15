import React from 'react'
import { IGameRecord } from '../../../../../models/colyseus-models/game-record'
import Record from './record'

const ulStyle = {
    listStyle: 'none',
    padding: '0px',
    display:'flex',
    flexFlow:'column'
}

export default function History(props: {history: IGameRecord[]}) {
    if(props.history){
        return <ul style={ulStyle}>
            <li key='index-history-title'>
                <div style={{display: 'flex', justifyContent:'space-around'}}>
                    <p>Rank</p>
                    <p>Team</p>
                    <p>Date</p>
                    <p>Elo</p>
                </div>
            </li>
        {props.history.map((r) => createGameRecord(r))}
    </ul>
    }
    else{
        return null
    }
}

function createGameRecord(r: IGameRecord){
    return <li key={r.time}>
        <Record record={r}/>
    </li>
}