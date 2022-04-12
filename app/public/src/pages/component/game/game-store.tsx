import React from 'react';
import { useAppSelector } from '../../../hooks';
import GamePokemonPortrait from './game-pokemon-portrait';
import CSS from 'csstype';
import PokemonFactory from '../../../../../models/pokemon-factory';

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
    const pokemonCollection = useAppSelector(state=>state.game.pokemonCollection);
    console.log(pokemonCollection);
    return <ul style={style}>
    {shop.map((pokemon,index)=>{
        if(pokemon != ""){
            const p = PokemonFactory.createPokemonFromName(pokemon);
            return <GamePokemonPortrait key={index} index={index} pokemon={p} pokemonConfig={pokemonCollection.get(p.index)}/>
        }
        else{
            return <GamePokemonPortrait key={index} index={index} pokemon={undefined} pokemonConfig={undefined}/>
        }
    })}
</ul>;
}