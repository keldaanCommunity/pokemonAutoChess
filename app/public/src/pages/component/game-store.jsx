import React, { Component } from 'react';
import GamePokemonPortrait from './game-pokemon-portrait';

class GameStore extends Component{

    render(){
        const style = {
            position: 'absolute',
            left: '19%',
            display: 'flex',
            width: '65%',
            height:'90%',
            top:'4%',
            listStyleType: 'none',
            padding: '0px'
        }

        return <ul style={style}>
            {this.props.shop.map((pokemon,index)=>{
                if(pokemon != ""){
                    return <GamePokemonPortrait key={index} name={pokemon} shopClick={this.props.shopClick} index={index}/>
                }
                else{
                    return null;
                }
            })}
        </ul>;
    }
}

export default GameStore;