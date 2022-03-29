import React from 'react';
import { useAppSelector } from '../../../hooks';
import GamePokemonPortrait from './game-pokemon-portrait';
import CSS from 'csstype';

const style: CSS.Properties = {
    position: 'absolute',
    left: '19%',
    display: 'flex',
    width: '65%',
    height:'90%',
    top:'4%',
    listStyleType: 'none',
    padding: '0px'
}

export default function GameStore() {
    const shop = useAppSelector(state=>state.game.shop);

    return <ul style={style}>
    {shop.map((pokemon,index)=>{
        if(pokemon != ""){
            return <GamePokemonPortrait key={index} index={index} pokemonName={pokemon}/>
        }
        else{
            return <GamePokemonPortrait key={index} index={index} pokemonName={undefined}/>;
        }
    })}
</ul>;
}