import React, { Component } from 'react';
import GameDps from './game-dps';

class GameDpsMeter extends Component{

    render(){
        const style = {
            position:'absolute',
            right: '7%',
            top: '.5%',
            width:'10%',
            display:'flex',
            flexFlow:'column',
            justifyContent:'space-between',
            backgroundColor: 'rgba(255,255,255,0.7)',
            padding:'10px',
            overflowY:'scroll',
            maxHeight:'78%'
        }
        if(this.props.dpsMeter.size && this.props.dpsMeter.size > 0){
            let sortedArray = Array.from(this.props.dpsMeter).sort((a,b)=>{return b[1].damage - a[1].damage});

            return <div className='nes-container hidden-scrollable' style={style}>
            <h5 style={{textAlign:'center'}}>Damage Dealt</h5>
            {sortedArray.map(p=>{
                return <GameDps 
                key={p[0]} 
                name={p[1].name}
                damage={p[1].damage}
                maxDamage={sortedArray[0][1].damage}
                />
            })}
        </div>
        }
        else{
            return null;
        }
    }
}

export default GameDpsMeter;