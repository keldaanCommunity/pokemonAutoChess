import React, { Component } from 'react';

class GamePlayerInformations extends Component{

    render(){
        const style = {
            position:'absolute',
            top:'.5%',
            left:'21%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display:'flex',
            justifyContent:'space-evenly',
            padding:'10px',
            minWidth:'40%',
            height:'7%'
        }

        return <div style={style} className='nes-container'>
                <h4>{this.props.boardSize}/{this.props.maxBoardSize}</h4>
                <div style={{display:'flex'}}>
                    <img src={`assets/avatar/${this.props.avatar}.png`}/>
                    <p>{this.props.name}</p>
                </div>
                <div style={{display:'flex'}}>
                    <h4>{this.props.money}</h4>
                    <img style={{width:'20px', height:'20px', marginBottom:'5px'}} src='assets/ui/money.png'/>
                </div>
                <p>{this.props.opponent == '' ? '': 'Vs ' + this.props.opponent}</p>
        </div>;
    }
}

export default GamePlayerInformations;