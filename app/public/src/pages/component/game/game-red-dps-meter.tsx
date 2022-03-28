import React from 'react';
import { useAppSelector } from '../../../hooks';
import GameDps from './game-dps';

export default function GameRedDpsMeter() {
    const redDpsMeter = useAppSelector(state=>state.game.redDpsMeter);
    if(redDpsMeter.length > 0){
        const redSortedArray = [...redDpsMeter].sort((a,b)=>{return (b.physicalDamage + b.specialDamage + b.trueDamage) - (a.physicalDamage + a.specialDamage + a.trueDamage)});
        const redMaxDamage = redSortedArray[0].physicalDamage + redSortedArray[0].specialDamage + redSortedArray[0].trueDamage;
        return <div>
            {redSortedArray.map(p=>{
                return <GameDps 
                key={p.id} 
                dps={p}
                maxDamage={redMaxDamage}
                />
            })
        }
        </div>
    }
    else{
        return null;
    }
}