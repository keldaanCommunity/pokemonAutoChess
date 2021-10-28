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
            padding:'5px',
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`
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
                <p style={{margin:'0px'}}>{TYPE_TRADUCTION[this.props.type]['eng']}</p>
            </div>
        </div>
    }
}

export default GameSynergy;