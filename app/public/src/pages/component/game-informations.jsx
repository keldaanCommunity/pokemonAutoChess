import React, { Component } from 'react';
import GameLeave from './gam-leave';
class GameInformations extends Component{

    render(){
        const style = {
            position:'absolute',
            top:'.5%',
            left:'.5%',
            width:'12%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display:'flex',
            justifyContent:'space-evenly',
            padding:'10px',
            height:'7%'
        }

        return <div style={style} className='nes-container'>
                <GameLeave click={this.props.click}/>
                <h5>T{this.props.turn}</h5>
                <h2>{this.props.time}s</h2>
        </div>;
    }
}

export default GameInformations;