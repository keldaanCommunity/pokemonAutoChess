import React, { Component } from 'react';
import GameLeave from './gam-leave';
class GameInformations extends Component{

    render(){
        const style = {
            position:'absolute',
            top:'.5%',
            left:'.5%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display:'flex',
            justifyContent:'space-evenly',
            padding:'10px',
            flexFlow: 'column',
            width:'13%',
            height:'10%'
        }

        return <div style={style} className='nes-container'>
                <p style={{fontSize: '0.7vw', textAlign: 'center', marginBottom: '0px'}}>{this.props.mapName}</p>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                    <GameLeave click={this.props.click}/>
                    <h3>T{this.props.turn}</h3>
                    <h3>{this.props.time}s</h3>
                </div>
        </div>;
    }
}

export default GameInformations;