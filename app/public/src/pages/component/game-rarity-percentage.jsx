import {PROBABILITY, RARITY} from '../../../../models/enum';
import React, { Component } from 'react';

class GameRarityPercentage extends Component{

    render(){
        const style = {
            position:'absolute',
            bottom:'16%',
            right:'5%',
            display:'flex',
            padding:'0px',
            backgroundColor:'rgba(255,255,255,0.7)'
        }

        const RARITY_RGB={
            COMMON:'rgba(104, 109, 125,0.7)',
            UNCOMMON:'rgba(71, 138, 65, 0.7)',
            RARE:'rgba(80, 98, 171, 0.7)',
            EPIC:'rgba(123, 70, 156, 0.7)',
            LEGENDARY:'rgb(166, 128, 46, 0.7)'
        }

        return <div style={style} className='nes-container'>
            {[RARITY.COMMON, RARITY.UNCOMMON, RARITY.RARE, RARITY.EPIC, RARITY.LEGENDARY].map((rarity,index)=>{
                return <div key={rarity}
                    style={{
                        backgroundColor:RARITY_RGB[rarity],
                        padding:'3px'
                    }}
                >
                    {Math.floor(PROBABILITY[this.props.level][index] * 100)}%
                </div>
            })}
        </div>;
    }
}

export default GameRarityPercentage;
