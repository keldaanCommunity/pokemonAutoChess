import React from 'react'
import { CDN_PORTRAIT_URL, TitleName } from '../../../../types'

export default function InlineAvatar(props:{avatar: string, name: string, title: string}){
    return <div style={{
        display:'flex', alignItems:'center',gap:'5px'
        }}>
        <img style={{width:'40px', height:'40px'}} src={CDN_PORTRAIT_URL + props.avatar + '.png'}/>
        <p style={{margin:'0px', color: '#ffc107'}}>{TitleName[props.title]}</p>
        <p style={{margin:'0px', marginLeft:'10px', maxWidth:'350px', overflow:'hidden', whiteSpace:'nowrap'}}>{props.name}</p>
    </div>
}