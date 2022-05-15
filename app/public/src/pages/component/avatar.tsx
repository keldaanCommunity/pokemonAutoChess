import React from 'react'
import Elo from './elo'
import {CDN_PORTRAIT_URL} from '../../../../types'

export default function Avatar(props:{elo: number|undefined, name: string, avatar: string}){
    const elo = props.elo ? <Elo elo={props.elo}/>: null

    return <div style={{
        textAlign:'center',
        display:'flex',
        alignItems:'center',
        flexFlow:'column'
        }}>
        <img src={`${CDN_PORTRAIT_URL}${props.avatar}.png`}/>
        <p style={{margin:'0px'}}>{props.name}</p>
        {elo}
    </div>
}