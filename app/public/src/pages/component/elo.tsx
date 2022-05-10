import React from 'react';
import { EloRankThreshold, EloRank } from '../../../../types/Config';
import CSS from 'csstype';

const style: CSS.Properties = {
    display:'flex',
    alignItems:'center',
    width:'auto'
}

const imgStyle: CSS.Properties = {
    width:'48px',
    height:'48px',
    imageRendering:'pixelated'
};

export default function Elo(props:{elo:number}){
    const rank = getRank(props.elo);
    return <div style={style}>
        <img style={imgStyle} src={'assets/ranks/'+ rank + '.png'}/>
        <div style={{marginLeft:'10px'}}>
            <p style={{margin:'0px'}}>{props.elo}</p>
        </div>
    </div>;
}

function getRank(elo :number){
    let rank = EloRank.BRONZE;
    (Object.keys(EloRankThreshold) as EloRank[]).forEach(e =>{
        if(elo > EloRankThreshold[e]){
            rank = e;
        }
    });
    return rank;
}