import React from 'react';
import { CDN_PORTRAIT_URL } from '../../../../types';

export default function InlineAvatar(props:{avatar: string, name: string}){
    return <div style={{
        display:'flex', alignItems:'center'
        }}>
        <img style={{width:'40px', height:'40px'}} src={CDN_PORTRAIT_URL + props.avatar + ".png"}/>
        <p style={{margin:'0px', marginLeft:'10px', maxWidth:'350px', overflow:'hidden', whiteSpace:'nowrap'}}>{props.name}</p>
    </div>;
}