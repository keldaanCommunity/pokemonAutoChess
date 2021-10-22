import React, { Component } from 'react';
import GamePokemonPortrait from './game-pokemon-portrait';

class GameStore extends Component{

    render(){
        const style = {
            position: 'absolute',
            left: '23%',
            display: 'flex',
            width: '60%',
            height:'90%',
            top:'4%',
            justifyContent: 'space-between',
            listStyleType: 'none',
            padding: '0px'
        }

        return <ul style={style}>
            {this.props.shop.map((pokemon,index)=>{
                return <GamePokemonPortrait key={index} name={pokemon}/>
            })}
        </ul>;
    }
}

export default GameStore;