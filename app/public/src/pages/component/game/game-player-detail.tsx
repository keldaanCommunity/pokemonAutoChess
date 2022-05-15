import React from 'react'
import HistoryItem from '../../../../../models/colyseus-models/history-item'
import { BattleResult } from '../../../../../types/enum/Game'
import { CDN_PORTRAIT_URL } from '../../../../../types'
import { ArraySchema } from '@colyseus/schema'

export default function GamePlayerDetail(props:{name: string, life: number, money: number, history: ArraySchema<HistoryItem>}) {
    return <div>
    <div style={{display:'flex'}}>
        <h4>{props.name}</h4>
        <div style={{display:'flex', marginLeft:'10px'}}>
            <h4>{props.life}</h4>
            <i className="nes-icon is-small heart"></i>
        </div>
        <div style={{display:'flex', marginLeft:'10px'}}>
            <h4>{props.money}</h4>
            <img style={{width:'20px', height:'20px', marginBottom:'5px'}} src='assets/ui/money.png'/>
        </div>
    </div>
    <p>History :</p>
    <div style={{display:'flex'}}>{props.history.map((record, i)=>{
        return <div key={i} style={{
            display:'flex',
            justifyContent:'space-around',
            alignItems:'center',
            flexFlow:'column'
        }}>
                <img style={{
                    border:record.result == BattleResult.WIN ? '4px solid #4aa52e' : '4px solid #8c2022',
                    marginLeft:'6px'
                }} src={`${CDN_PORTRAIT_URL}${record.avatar}.png`}/>
            <p style={{
            }}>{record.name.slice(0,4)}</p>
            </div>
    })}</div>
    </div>
}
