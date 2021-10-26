import React, { Component } from 'react';
import {TYPE_TRADUCTION, TYPE_TRIGGER} from '../../../../models/enum';

class GameSynergy extends Component{

    render(){
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '5px',
            padding:'5px'
        }} className='nes-container'>
            <img style={{
                height:'40px',
                width:'40px'
            }}
            src={'assets/types/' + this.props.type + '.png'}/>
            <h4>{this.props.value}</h4>
            <div style={{
                display:'flex',
                 flexFlow:'column'}}>
                <div style={{
                    display:'flex',
                    justifyContent:'space-between'
                }}>
                    {TYPE_TRIGGER[this.props.type].map(t=>{
                        return <span key={t} style={{color: this.props.value >= t ? '#70884f': '#000000'}}>
                            {t} 
                            </span>;
                    })}
                </div>
                <p>{TYPE_TRADUCTION[this.props.type]['eng']}</p>
            </div>
        </div>
    }
}

export default GameSynergy;