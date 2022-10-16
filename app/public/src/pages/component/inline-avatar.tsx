import React from 'react'
import { CDN_PORTRAIT_URL, Role, TitleName } from '../../../../types'
import { RoleBadge } from './RoleBadge'

export default function InlineAvatar(props:{avatar: string, name: string, title: string, role: Role}){
    return <div style={{
        display:'flex', alignItems:'center',gap:'5px', justifyContent:'space-between'
        }}>
        <img style={{width:'40px', height:'40px'}} src={CDN_PORTRAIT_URL + props.avatar + '.png'}/>
        <p style={{margin:'0px', color: '#ffc107'}}>{TitleName[props.title]}</p>
        <p style={{margin:'0px'}}>{props.name.length > 10 ?  props.name.slice(0,10).concat('..') : props.name}</p>
        <RoleBadge role={props.role}/>
    </div>
}