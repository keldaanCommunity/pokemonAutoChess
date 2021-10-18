import React, { Component } from 'react';
import GamePlayer from './game-player';

class GamePlayers extends Component{

    render(){
        const style = {
            position:'absolute',
            right:'.5%',
            top: '.5%',
            width:'70px',
            height:'700px',
            display:'flex',
            flexFlow:'column',
            justifyContent:'space-between'
        }

        return <div style={style}>
            {Array.from(this.props.players).sort((a,b)=>{return a[1].rank - b[1].rank}).map(p=>{
                return <GamePlayer 
                key={p[0]} 
                avatar={p[1].avatar} 
                life={p[1].life} 
                playerClick={this.props.playerClick} 
                id={p[0]}
                color={this.props.uid == p[1].id ? 'rgba(247, 213, 29, 0.7)':'rgba(255, 255, 255, 0.7)'}
                />
            })}
        </div>
    }
}

export default GamePlayers;