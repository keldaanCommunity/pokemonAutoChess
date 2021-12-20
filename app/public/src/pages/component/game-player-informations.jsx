import React, { Component } from 'react';

class GamePlayerInformations extends Component{

    getLifePngName() {
        let lifePngName = 'life_100';
        if(this.props.life > 80){
            lifePngName = 'life_100';
        } else if(this.props.life > 60 && this.props.life <= 80){
            lifePngName = 'life_80';
        } else if(this.props.life > 40 && this.props.life <= 60){
            lifePngName = 'life_60';            
        } else if(this.props.life > 20 && this.props.life <= 40){
            lifePngName = 'life_40';
        } else if(this.props.life > 0 && this.props.life <= 20){
            lifePngName = 'life_20';
        } else {
            lifePngName = 'life_0';
        }
        return lifePngName;
      }

    render(){
        const style = {
            position:'absolute',
            top:'.5%',
            left:'30%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display:'flex',
            justifyContent:'space-evenly',
            padding:'10px',
            minWidth:'40%',
            height:'7%'
        }

        let opponent = null;
        if(this.props.opponent != '' && this.props.opponentAvatar !=''){
            opponent = 
            <div style={{display:'flex'}}>
                <p>Vs</p>
                <img src={`assets/avatar/${this.props.opponentAvatar}.png`}/>
                <p style={{marginLeft:'5px'}}>{this.props.opponent}</p>
            </div>;
        }

        return <div style={style} className='nes-container'>
                <h4>{this.props.boardSize}/{this.props.maxBoardSize}</h4>
                <div style={{display:'flex'}}>
                    <h4>{this.props.money}</h4>
                    <img style={{width:'25px', height:'25px', marginBottom:'5px'}} src='assets/ui/money.png'/>
                </div>
                <div style={{display:'flex'}}>
                    <h4 style={{marginLeft:'5px'}}>{this.props.life}</h4>
                    <img style={{width:'25px', height:'25px', marginBottom:'5px'}} src={`assets/ui/${this.getLifePngName()}.png`}/>
                </div>
                <div style={{display:'flex'}}>
                    <img src={`assets/avatar/${this.props.avatar}.png`}/>
                    <p style={{marginLeft:'5px'}}>{this.props.name}</p>
                </div>
                {opponent}
                </div>;
    }
}

export default GamePlayerInformations;