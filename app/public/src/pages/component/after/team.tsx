import React from 'react';
import { CDN_PORTRAIT_URL } from '../../../../../models/enum';

const ulStyle = {
    listStyle: 'none',
    padding: '0px',
    display: 'flex'
};

export default function Team(props:{team: string[]}){

    return <ul style={ulStyle}>
        {props.team.map((v, index)=>{        
            return <li key={index}>
            <img src={CDN_PORTRAIT_URL + v + ".png"}/>
        </li>})}
    </ul>
}