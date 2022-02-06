import React, { Component } from 'react';
import GameDps from './game-dps';

class GameDpsMeter extends Component{

    render(){
        const style = {
            position:'absolute',
            right: '6.5%',
            top: '.5%',
            width:'15%',
            display:'flex',
            flexFlow:'column',
            justifyContent:'space-between',
            backgroundColor: 'rgba(255,255,255,0.7)',
            padding:'10px',
            overflowY:'scroll',
            maxHeight:'78%'
        }
        if(this.props.blueDpsMeter.size && this.props.redDpsMeter.size && (this.props.blueDpsMeter.size > 0 || this.props.redDpsMeter.size > 0)){
            let redSortedArray = Array.from(this.props.redDpsMeter).sort((a,b)=>{return b[1].damage - a[1].damage});
            let blueSortedArray = Array.from(this.props.blueDpsMeter).sort((a,b)=>{return b[1].damage - a[1].damage});

            return <div className='nes-container hidden-scrollable' style={style}>
            <h5 style={{textAlign:'center'}}>Damage Dealt</h5>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '50%'}}>
                    {blueSortedArray.map(p=>{
                        return <GameDps 
                        key={p[0]} 
                        name={p[1].name}
                        damage={p[1].damage}
                        maxDamage={blueSortedArray[0][1].damage}
                        cssClass="nes-progress is-success"
                        />
                    })}
                </div>
                <div style={{width: '50%'}}>
                    {redSortedArray.map(p=>{
                        return <GameDps 
                        key={p[0]} 
                        name={p[1].name}
                        damage={p[1].damage}
                        maxDamage={redSortedArray[0][1].damage}
                        cssClass="nes-progress is-error"
                        />
                    })}
                </div>
            </div>

        </div>
        }
        else{
            return null;
        }
    }
}

export default GameDpsMeter;