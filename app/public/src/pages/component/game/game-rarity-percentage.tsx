import { Rarity } from '../../../../../types/enum/Game';
import React from 'react';
import CSS from 'csstype';
import { useAppSelector } from '../../../hooks';
import { Probability } from '../../../../../types/Config';

const style: CSS.Properties = {
    position:'absolute',
    bottom:'16%',
    right:'5%',
    display:'flex',
    padding:'0px',
    backgroundColor:'rgba(255,255,255,0.7)'
}

const RARITY_RGB= {
    [Rarity.COMMON] :'rgba(104, 109, 125,0.7)',
    [Rarity.UNCOMMON] :'rgba(71, 138, 65, 0.7)',
    [Rarity.RARE] :'rgba(80, 98, 171, 0.7)',
    [Rarity.EPIC] :'rgba(123, 70, 156, 0.7)',
    [Rarity.LEGENDARY] :'rgb(166, 128, 46, 0.7)'
}

export default function GameRarityPercentage() {
    const level = useAppSelector(state=>state.game.experienceManager.level);
    return <div style={style} className='nes-container'>
        {[Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY].map((rarity,index)=>{
            return <div key={rarity}
                style={{
                    backgroundColor:RARITY_RGB[rarity],
                    padding:'3px'
                }}
            >
                {Math.floor(Probability[level][index] * 100)}%
            </div>
        })}
    </div>;
}