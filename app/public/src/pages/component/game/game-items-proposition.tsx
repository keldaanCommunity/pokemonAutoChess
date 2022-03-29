import React from 'react';
import GameItem from './game-item';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position:'absolute',
    top:'30%',
    left:'15.5%',
    width:'60%',
    display:'flex',
    justifyContent:'space-between',
    padding:'10px'
}


export default function GameItemsProposition(){
    const itemsProposition = useAppSelector(state=>state.game.itemsProposition);
    if(itemsProposition.length >0){
        return <div style={style}>
            {itemsProposition.map((e,i)=>{
                return <GameItem key={i} item={e}/>
            })}
    </div>;
    }
    else{
        return null;
    }
}