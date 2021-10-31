import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import GamePlayerDetail from './game-player-detail';

class GamePlayer extends Component{

    render(){
        const style = {
            backgroundColor: this.props.color,
            cursor:`url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC) 14 0, pointer`,
            height:'70px',
            width:'70px'
        }

        const progressStyle={
            height: '15px',
            borderImageOutset: '1',
            position: 'absolute',
            left: '0px',
            bottom: '2%',
            width: '55px',
            background:'none'
        }

        const imgStyle={
            position:'absolute',
            left:'12px',
            top:'5%'
        }

        return  <div 
            style={style} 
            className='nes-container' 
            onClick={()=>{this.props.playerClick(this.props.id)}}
            data-tip
            data-for={'detail-' + this.props.id}
        >
             <ReactTooltip id={'detail-' + this.props.id} 
                className='customeTheme' 
                textColor='#000000' 
                backgroundColor='rgba(255,255,255,0.7)' 
                effect='solid'
                place='left'>
            <GamePlayerDetail name={this.props.name} life={this.props.life} money={this.props.money} history={this.props.history}/>
        </ReactTooltip>
            <img style={imgStyle} src={`assets/avatar/${this.props.avatar}.png`}/>
            <progress style={progressStyle} className="nes-progress is-error" value={this.props.life} max="100"></progress>
        </div>
    }
}

export default GamePlayer;