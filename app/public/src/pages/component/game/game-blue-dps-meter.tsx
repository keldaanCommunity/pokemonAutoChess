import React from 'react'
import { useAppSelector } from '../../../hooks'
import GameDps from './game-dps'

export default function GameBluedDpsMeter() {
    const blueDpsMeter = useAppSelector(state=>state.game.blueDpsMeter)
    if(blueDpsMeter.length > 0){
        const blueSortedArray = [...blueDpsMeter].sort((a,b)=>{return (b.physicalDamage + b.specialDamage + b.trueDamage) - (a.physicalDamage + a.specialDamage + a.trueDamage)})
        const blueMaxDamage = blueSortedArray[0].physicalDamage + blueSortedArray[0].specialDamage + blueSortedArray[0].trueDamage
        return <div>
            {blueSortedArray.map(p=>{
                return <GameDps 
                key={p.id} 
                dps={p}
                maxDamage={blueMaxDamage}
                />
            })
        }
        </div>
    }
    else{
        return null
    }
}