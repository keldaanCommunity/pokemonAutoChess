import React from 'react';
import { TYPE_TRIGGER } from '../../../../../models/enum';
import GameSynergy from './game-synergy';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';

const style: CSS.Properties = {
    position: 'absolute',
    left: '0.5%',
    display: 'flex',
    justifyContent:'space-between',
    width: '13%',
    top:'11%',
    flexFlow: 'column',
    maxHeight:'73%',
    overflowY:'scroll',
    padding:'0px',
    backgroundColor:'rgba(255,255,255,0.6)' 
}

export default function GameSynergies(props:{source: string}) {
    const synergies = props.source == 'game'? useAppSelector(state=>state.game.synergies) : useAppSelector(state=>state.lobby.synergies);

    if(synergies){
        return <div style={style} className='nes-container hidden-scrollable'>
            <h5 style={{padding:'10px', textAlign: 'center'}}>Synergies</h5>
        {Object.keys(synergies).sort((a,b)=>{
                if(synergies[a] == synergies[b]){
                    if(synergies[a] >= TYPE_TRIGGER[a][0]){
                        return -1;
                    }
                    else{
                        return 1;
                    }
                }
                else{
                    return synergies[b] - synergies[a];
                }
            }).map((type, index)=>{
            if(synergies[type] > 0){
                return <GameSynergy key={type} type={type} isFirst={index==0} value={synergies[type]}/>;
            }
            else{
                return null;
            }
        })}
    </div>
    }
    else{
        return null;
    }
}
