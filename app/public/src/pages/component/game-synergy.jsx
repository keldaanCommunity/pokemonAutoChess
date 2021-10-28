import React, { Component } from 'react';
import {TYPE_TRADUCTION, TYPE_TRIGGER} from '../../../../models/enum';
import ReactTooltip from 'react-tooltip';
import GameSynergyDetail from './game-synergy-detail';
class GameSynergy extends Component{

    render(){
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '5px',
            padding:'5px'
        }} className='nes-container'
        data-tip
        data-for={'detail-' + this.props.type}
        >
        <ReactTooltip id={'detail-' + this.props.type} 
        className='customeTheme' 
        textColor='#000000' 
        backgroundColor='rgba(255,255,255,0.7)' 
        effect='solid'
        place='right'>
            <GameSynergyDetail type={this.props.type} value={this.props.value}/>
        </ReactTooltip>

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
                        return <span key={t} style={{color: this.props.value >= t ? '#000000': '#808080'}}>
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