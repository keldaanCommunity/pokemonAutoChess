import React from 'react';
import { useAppSelector } from '../../../hooks';
import GameDpsHeal from './game-dps-heal';

export default function GameBlueHealDpsMeter() {
    const blueHealDpsMeter = useAppSelector(state=>state.game.blueHealDpsMeter);
    if(blueHealDpsMeter.length > 0){
        const blueHealSortedArray = [...blueHealDpsMeter].sort((a,b)=>{return (b.shield + b.heal) - (a.shield + a.heal)});
        const blueHealMaxDamage = blueHealSortedArray[0].shield + blueHealSortedArray[0].heal;
        return <div>
            {blueHealSortedArray.map(p=>{
                return <GameDpsHeal
                key={p.id} 
                dpsHeal={p}
                maxHeal={blueHealMaxDamage}
                />
            })
        }
        </div>
    }
    else{
        return null;
    }
}